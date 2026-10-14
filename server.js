import { createServer } from 'node:http';
import { createReadStream, existsSync, mkdirSync } from 'node:fs';
import { basename, join, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes, randomUUID, scryptSync, timingSafeEqual, createCipheriv, createDecipheriv } from 'node:crypto';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };
const MAX_BODY = 16_384;
const SESSION_MS = 8 * 60 * 60 * 1000;
const SESSION_COOKIE = 'sehasetu_staff';
const CASE_STATUSES = ['New Enquiry', 'Contacted', 'Assessment Pending', 'Assessment Completed', 'Matching in Progress', 'Quote Sent', 'Awaiting Approval', 'Booking Confirmed', 'Service In Progress', 'Follow-up', 'Closed'];
const COORDINATION_STATUSES = ['New Request', 'Coordinator Review', 'Appointment Coordination Pending', 'Accompaniment Availability Pending', 'Follow-up Scheduled', 'Closed', 'Cancelled'];
const MEDICINE_MANUAL_STATUSES = ['New Request', 'Prescription Needed', 'Verification Pending', 'Follow-up Due', 'Cancelled', 'Refund or Escalation', 'Closed'];
const SESSION_STATUS_MESSAGES = { en: { notConfigured: 'Online submissions are not configured.', required: 'All required fields must be completed correctly.' }, hi: { notConfigured: 'ऑनलाइन अनुरोध की सुविधा अभी शुरू नहीं हुई है।', required: 'कृपया सभी ज़रूरी जानकारी सही ढंग से भरें।' } };

const liveSessions = new Map();
const limits = new Map();
let database;
let encryptionKey;
let adminHash;
let adminSalt;
let sessionsEnabled = false;

function json(res, status, body, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers });
  res.end(JSON.stringify(body));
}

function recordRateLimit(key, maximum, intervalMs) {
  const now = Date.now();
  const existing = limits.get(key);
  if (existing && now - existing.started < intervalMs) {
    if (existing.count >= maximum) return Math.max(1, Math.ceil((intervalMs - (now - existing.started)) / 1000));
    existing.count += 1;
    return 0;
  }
  if (limits.size > 10_000) {
    for (const [entry, value] of limits) if (now - value.started > 24 * 60 * 60 * 1000) limits.delete(entry);
    if (limits.size > 10_000) limits.delete(limits.keys().next().value);
  }
  limits.set(key, { started: now, count: 1 });
  return 0;
}

function fingerprint(value) {
  return scryptSync(value, adminSalt, 64);
}

function encryptionEnabled() {
  return process.env.ADMIN_PASSWORD && process.env.ENCRYPTION_KEY;
}

function setupDatabase() {
  const password = process.env.ADMIN_PASSWORD;
  const rawKey = process.env.ENCRYPTION_KEY;
  if (!password || !rawKey) return false;
  if (password.length < 20 || password.length > 256) throw new Error('ADMIN_PASSWORD must contain between 20 and 256 characters.');
  if (!/^[a-f0-9]{64}$/i.test(rawKey)) throw new Error('ENCRYPTION_KEY must be exactly 64 hexadecimal characters (32 random bytes).');

  encryptionKey = Buffer.from(rawKey, 'hex');
  adminSalt = randomBytes(32);
  adminHash = fingerprint(password);
  sessionsEnabled = true;

  const configuredPath = resolve(ROOT, process.env.DATA_DIR || 'data');
  mkdirSync(configuredPath, { recursive: true, mode: 0o700 });
  const { DatabaseSync } = process.getBuiltinModule('node:sqlite') || requireSqlite();
  database = new DatabaseSync(join(configuredPath, 'sehasetu.sqlite'));
  database.exec('PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');
  database.exec(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY,
      kind TEXT NOT NULL CHECK(kind IN ('care', 'partner')),
      created_at TEXT NOT NULL,
      status TEXT NOT NULL,
      nonce BLOB NOT NULL,
      ciphertext BLOB NOT NULL,
      tag BLOB NOT NULL
    );
    CREATE TABLE IF NOT EXISTS admin_audit (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      enquiry_id TEXT NOT NULL,
      action TEXT NOT NULL,
      occurred_at TEXT NOT NULL,
      FOREIGN KEY(enquiry_id) REFERENCES enquiries(id)
    );
    CREATE INDEX IF NOT EXISTS enquiries_created ON enquiries(created_at DESC);
    CREATE TABLE IF NOT EXISTS health_requests (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      nonce BLOB NOT NULL,
      ciphertext BLOB NOT NULL,
      tag BLOB NOT NULL
    );
    CREATE TABLE IF NOT EXISTS health_request_audit (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_id TEXT NOT NULL,
      action TEXT NOT NULL,
      occurred_at TEXT NOT NULL,
      FOREIGN KEY(request_id) REFERENCES health_requests(id)
    );
    CREATE INDEX IF NOT EXISTS health_requests_created ON health_requests(created_at DESC);
  `);
  sessionsEnabled = true;
  return true;
}

function requireSqlite() {
  throw new Error('The built-in SQLite driver is unavailable. Run this server with the package start command and Node.js 22 or newer.');
}

function encryptPayload(id, kind, payload) {
  const nonce = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey, nonce);
  cipher.setAAD(Buffer.from(`${kind}:${id}`));
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()]);
  return { nonce, ciphertext, tag: cipher.getAuthTag() };
}

function decryptPayload(row) {
  const decipher = createDecipheriv('aes-256-gcm', encryptionKey, row.nonce);
  decipher.setAAD(Buffer.from(`${row.kind}:${row.id}`));
  decipher.setAuthTag(row.tag);
  const plaintext = Buffer.concat([decipher.update(row.ciphertext), decipher.final()]).toString('utf8');
  return JSON.parse(plaintext);
}

async function readJson(req) {
  if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] || '')) throw Object.assign(new Error('Send a JSON request.'), { status: 415 });
  const declaredSize = Number(req.headers['content-length'] || 0);
  if (declaredSize > MAX_BODY) throw Object.assign(new Error('Request is too large.'), { status: 413 });
  let size = 0;
  const parts = [];
  for await (const part of req) {
    size += part.length;
    if (size > MAX_BODY) {
      req.destroy();
      throw Object.assign(new Error('Request is too large.'), { status: 413 });
    }
    parts.push(part);
  }
  try {
    const payload = JSON.parse(Buffer.concat(parts).toString('utf8'));
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('Invalid request.');
    return payload;
  } catch {
    throw Object.assign(new Error('Invalid JSON.'), { status: 400 });
  }
}

function text(value, maximum) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, maximum);
}

function emailValid(value, optional = true) {
  if (typeof value !== 'string' || !value) return optional;
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function dateValid(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  const actual = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
  const today = new Date().toISOString().slice(0, 10);
  return actual === value && value >= today;
}

function optionalDateValid(value, direction = 'future') {
  if (typeof value !== 'string' || !value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  const actual = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
  const today = new Date().toISOString().slice(0, 10);
  return actual === value && (direction === 'any' || (direction === 'past' ? value <= today : value >= today));
}

function optionalDateInputValid(value, direction = 'future') {
  if (value === undefined || value === '') return true;
  return optionalDateValid(value, direction);
}

function validateCoordinationRequest(body) {
  const patientName = text(body.patientName, 120);
  const ageValue = body.age ?? '';
  if (ageValue !== '' && (typeof ageValue !== 'string' || !/^\d{1,3}$/.test(ageValue))) return null;
  const age = ageValue === '' ? '' : Number(ageValue);
  const dateOfBirth = text(body.dateOfBirth, 10);
  const caregiverName = text(body.caregiverName, 120);
  const phone = String(body.phone || '');
  const email = text(body.email || '', 254);
  const locality = text(body.locality, 120);
  const address = text(body.address, 300);
  const doctorPreference = body.doctorPreference;
  const doctorName = text(body.doctorName || '', 120);
  const hospital = text(body.hospital || '', 140);
  if (patientName.length < 2 || (age === '' && !dateOfBirth) || (age !== '' && (!Number.isInteger(age) || age < 0 || age > 120))) return null;
  if (!optionalDateInputValid(body.dateOfBirth, 'past')) return null;
  if (caregiverName.length < 2 || !/^[0-9]{10}$/.test(phone) || !emailValid(email) || !locality || address.length < 5) return null;
  if (!['preferred', 'none', 'help'].includes(doctorPreference) || (doctorPreference === 'preferred' && doctorName.length < 2)) return null;
  if (!['phone', 'email'].includes(body.contactMethod) || (body.contactMethod === 'email' && !email)) return null;
  if (!optionalDateInputValid(body.lastConsultationDate, 'past') || !optionalDateInputValid(body.nextAppointmentDate)) return null;
  if (!['yes', 'no'].includes(body.accompaniment) || !['yes', 'no'].includes(body.medicineAssistance)) return null;
  if (body.followUpOptIn !== 'yes' && body.followUpOptIn !== 'no') return null;
  if (!optionalDateInputValid(body.followUpDate)) return null;
  if (body.followUpOptIn === 'yes' && !body.followUpDate) return null;
  if (body.consent !== 'yes') return null;
  return {
    patientName,
    age: age === '' ? '' : age,
    dateOfBirth,
    caregiverName,
    phone,
    email,
    address,
    locality,
    doctorPreference,
    doctorName,
    specialty: text(body.specialty || '', 100),
    hospital,
    hospitalAddress: text(body.hospitalAddress || '', 240),
    lastConsultationDate: text(body.lastConsultationDate || '', 10),
    nextAppointmentDate: text(body.nextAppointmentDate || '', 10),
    accompaniment: body.accompaniment,
    medicineAssistance: body.medicineAssistance,
    contactMethod: body.contactMethod,
    followUpDate: text(body.followUpDate || '', 10),
    followUpOptIn: body.followUpOptIn === 'yes',
    consent: true,
  };
}

function validateMedicineRequest(body) {
  const patientName = text(body.patientName, 120);
  const phone = String(body.phone || '');
  const doctorName = text(body.doctorName || '', 120);
  const hospital = text(body.hospital || '', 140);
  const medicineName = text(body.medicineName || '', 140);
  const quantity = text(body.quantity || '', 80);
  const address = text(body.address, 300);
  const locality = text(body.locality, 120);
  const deliveryInstructions = text(body.deliveryInstructions || '', 240);
  const requestedDate = text(body.requestedDate || '', 10);
  const deliveryWindow = body.deliveryWindow;
  const requestType = body.requestType;
  const followUpOptIn = body.followUpOptIn;
  const followUpDate = text(body.followUpDate || '', 10);
  if (patientName.length < 2 || !/^[0-9]{10}$/.test(phone) || !address || !locality) return null;
  if (!emailValid(body.email) || !optionalDateInputValid(body.requestedDate)) return null;
  if (!['Morning', 'Afternoon', 'Evening', 'Flexible'].includes(deliveryWindow)) return null;
  if (!['first', 'refill'].includes(requestType) || !['yes', 'no'].includes(followUpOptIn)) return null;
  if (!optionalDateInputValid(body.followUpDate) || (followUpOptIn === 'yes' && !followUpDate)) return null;
  if (body.consent !== 'yes' || body.verificationAcknowledgement !== 'yes') return null;
  return {
    patientName,
    phone,
    email: text(body.email || '', 254),
    doctorName,
    hospital,
    medicineName,
    quantity,
    address,
    locality,
    deliveryInstructions,
    requestedDate,
    deliveryWindow,
    requestType,
    followUpDate,
    followUpOptIn: followUpOptIn === 'yes',
    consent: true,
    verificationAcknowledgement: true,
  };
}

function validateCare(body) {
  const careFor = ['self', 'parent', 'grandparent', 'other'];
  const supports = ['companionship', 'daily-living', 'scheduled-caregiver', 'appointment-coordination', 'mobility', 'nursing-enquiry', 'other'];
  if (!careFor.includes(body.careFor)) return null;
  if (!Array.isArray(body.support) || !body.support.length || body.support.length > supports.length || body.support.some(value => !supports.includes(value)) || new Set(body.support).size !== body.support.length) return null;
  const locality = text(body.locality, 120);
  const phone = String(body.phone || '');
  if (!locality || !/^[0-9]{10}$/.test(phone) || !dateValid(body.preferredDate)) return null;
  if (!['Morning', 'Afternoon', 'Evening', 'Flexible'].includes(body.preferredTime)) return null;
  if (!['once', 'recurring'].includes(body.frequency)) return null;
  if (!['English', 'Hindi'].includes(body.preferredLanguage)) return null;
  if (body.contactConsent !== 'yes' || !emailValid(body.email)) return null;
  const fullName = text(body.fullName, 120);
  const relationship = text(body.relationship, 80);
  if (fullName.length < 2 || relationship.length < 2) return null;
  return {
    fullName,
    phone,
    email: text(body.email || '', 254),
    relationship,
    careFor: body.careFor,
    support: body.support,
    locality,
    preferredDate: body.preferredDate,
    preferredTime: body.preferredTime,
    frequency: body.frequency,
    preferredLanguage: body.preferredLanguage,
    message: text(body.message || '', 1000),
    contactConsent: true,
    updatesConsent: body.updatesConsent === 'yes',
  };
}

function validatePartner(body) {
  const categories = ['caregiver', 'agency', 'nurse', 'physiotherapist', 'other'];
  const fullName = text(body.fullName, 140);
  const phone = String(body.phone || '');
  const category = body.category;
  const experience = text(body.experience, 600);
  const areas = text(body.areas, 160);
  const availability = text(body.availability || '', 160);
  const qualifications = text(body.qualifications || '', 500);
  if (fullName.length < 2 || !/^[0-9]{10}$/.test(phone) || !emailValid(body.email)) return null;
  if (!categories.includes(category) || experience.length < 2 || !areas || body.contactConsent !== 'yes') return null;
  return { fullName, phone, email: text(body.email || '', 254), category, experience, areas, availability, qualifications, contactConsent: true };
}

function requireSameOrigin(req, res) {
  const origin = req.headers.origin;
  const site = req.headers['sec-fetch-site'];
  if (site === 'cross-site') {
    json(res, 403, { error: 'This request could not be accepted.' });
    return false;
  }
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.host) {
        json(res, 403, { error: 'This request could not be accepted.' });
        return false;
      }
    } catch {
      json(res, 403, { error: 'This request could not be accepted.' });
      return false;
    }
  }
  return true;
}

function findSession(req, res) {
  const cookie = String(req.headers.cookie || '').split(';').map(part => part.trim()).find(part => part.startsWith(`${SESSION_COOKIE}=`));
  if (!cookie) {
    json(res, 401, { error: 'Please sign in.' });
    return false;
  }
  const token = cookie.slice(SESSION_COOKIE.length + 1);
  const expires = liveSessions.get(token);
  if (!expires || expires < Date.now()) {
    liveSessions.delete(token);
    json(res, 401, { error: 'Your sign-in has expired. Please sign in again.' });
    return false;
  }
  liveSessions.set(token, Date.now() + SESSION_MS);
  return true;
}

function sessionCookie(req, token = '', maxAge = 0) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

function storeEnquiry(kind, payload) {
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  const status = 'New Enquiry';
  const encrypted = encryptPayload(id, kind, payload);
  database.prepare('INSERT INTO enquiries (id, kind, created_at, status, nonce, ciphertext, tag) VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, kind, createdAt, status, encrypted.nonce, encrypted.ciphertext, encrypted.tag);
  return { id, reference: `SH-${new Date().getUTCFullYear()}-${id.slice(0, 8).toUpperCase()}` };
}

function storeHealthRequest(kind, payload) {
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  const record = { requestKind: kind, status: 'New Request', followUpDate: payload.followUpDate || '', followUpOptIn: payload.followUpOptIn, details: payload };
  const encrypted = encryptPayload(id, 'health', record);
  database.exec('BEGIN IMMEDIATE');
  try {
    database.prepare('INSERT INTO health_requests (id, created_at, nonce, ciphertext, tag) VALUES (?, ?, ?, ?, ?)').run(
      id, createdAt, encrypted.nonce, encrypted.ciphertext, encrypted.tag,
    );
    database.prepare('INSERT INTO health_request_audit (request_id, action, occurred_at) VALUES (?, ?, ?)').run(id, 'Request created', createdAt);
    database.exec('COMMIT');
  } catch (error) {
    database.exec('ROLLBACK');
    throw error;
  }
  return { id, reference: `SH-${new Date(createdAt).getUTCFullYear()}-${id.slice(0, 8).toUpperCase()}` };
}

function apiRoute(req, res, path) {
  if (path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
  }

  if (req.method === 'GET' && path === '/api/health') return json(res, 200, { status: 'online', submissionsEnabled: Boolean(sessionsEnabled) });

  if (req.method === 'GET' && path === '/api/admin/requests') {
    if (!sessionsEnabled) return json(res, 503, { code: 'NOT_CONFIGURED', error: 'Admin access is not configured.' });
    if (!findSession(req, res)) return;
    const rows = database.prepare('SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 500').all();
    const healthRows = database.prepare('SELECT * FROM health_requests ORDER BY created_at DESC LIMIT 500').all();
    try {
      const items = rows.map(row => {
        const payload = decryptPayload(row);
        const reference = `SH-${new Date(row.created_at).getUTCFullYear()}-${row.id.slice(0, 8).toUpperCase()}`;
        const details = row.kind === 'care' ? payload.support.join(', ') : payload.category;
        return { id: row.id, kind: row.kind, reference, createdAt: row.created_at, status: row.status, fullName: payload.fullName, phone: payload.phone, email: payload.email, locality: payload.locality || payload.areas, details };
      });
      for (const row of healthRows) {
        const record = decryptPayload({ ...row, kind: 'health' });
        const payload = record.details;
        const reference = `SH-${new Date(row.created_at).getUTCFullYear()}-${row.id.slice(0, 8).toUpperCase()}`;
        const patientName = payload.patientName;
        const details = record.requestKind === 'coordination'
          ? `Doctor preference: ${payload.doctorPreference}${payload.doctorName ? ` — ${payload.doctorName}` : ''}; hospital: ${payload.hospital || 'not specified'}; accompaniment: ${payload.accompaniment}`
          : `Doctor: ${payload.doctorName || 'not specified'}; clinic: ${payload.hospital || 'not specified'}; medicine: ${payload.medicineName || 'prescription review needed'}; order: ${payload.requestType}`;
        items.push({
          id: row.id,
          kind: record.requestKind,
          workflow: 'health',
          reference,
          createdAt: row.created_at,
          status: record.status,
          fullName: patientName,
          phone: payload.phone,
          email: payload.email,
          locality: payload.locality,
          details,
          followUpDate: record.followUpDate,
          followUpOptIn: record.followUpOptIn,
          patientDetails: payload,
        });
      }
      items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return json(res, 200, { items });
    } catch {
      return json(res, 500, { error: 'Enquiry records could not be opened. Check the configured encryption key.' });
    }
  }

  if (req.method === 'PATCH' && /^\/api\/admin\/health-requests\/[a-f0-9-]{36}$/i.test(path)) {
    if (!sessionsEnabled) return json(res, 503, { code: 'NOT_CONFIGURED', error: 'Admin access is not configured.' });
    if (!requireSameOrigin(req, res) || !findSession(req, res)) return;
    return readJson(req).then(body => {
      const id = path.split('/').at(-1);
      const row = database.prepare('SELECT * FROM health_requests WHERE id = ?').get(id);
      if (!row) return json(res, 404, { error: 'Request not found.' });
      let record;
      try {
        record = decryptPayload({ ...row, kind: 'health' });
      } catch {
        return json(res, 500, { error: 'This patient request could not be opened. Check the configured encryption key.' });
      }
      const requestKind = record.requestKind;
      const allowedStatuses = requestKind === 'medicine' ? MEDICINE_MANUAL_STATUSES : COORDINATION_STATUSES;
      const status = body.status === undefined ? record.status : body.status;
      if (!allowedStatuses.includes(status)) return json(res, 400, { error: 'Choose a valid request status.' });
      const followUpDateInput = body.followUpDate;
      if (followUpDateInput !== undefined && !optionalDateInputValid(followUpDateInput, 'any')) return json(res, 400, { error: 'Choose a valid follow-up date.' });
      const followUpDate = followUpDateInput === undefined ? undefined : text(followUpDateInput, 10);
      if (body.followUpOptIn !== undefined && typeof body.followUpOptIn !== 'boolean') return json(res, 400, { error: 'Choose whether follow-up reminders are enabled.' });
      const followUpOptIn = body.followUpOptIn;
      if (followUpOptIn === true && followUpDate === undefined) return json(res, 400, { error: 'A follow-up date is required when reminders are enabled.' });
      const nextOptIn = followUpOptIn === undefined ? Boolean(record.followUpOptIn) : followUpOptIn;
      const nextDate = followUpDate === undefined ? record.followUpDate : followUpDate || '';
      if (nextOptIn && !nextDate) return json(res, 400, { error: 'A follow-up date is required when reminders are enabled.' });
      if (requestKind === 'coordination' && status === 'Follow-up Scheduled' && !nextDate) return json(res, 400, { error: 'A follow-up date is required for a scheduled follow-up.' });
      if (requestKind === 'medicine' && status === 'Follow-up Due' && (!nextDate || nextDate > new Date().toISOString().slice(0, 10))) {
        return json(res, 400, { error: 'A follow-up can be marked due only after its scheduled date.' });
      }
      const updatedRecord = { ...record, status, followUpDate: nextDate, followUpOptIn: nextOptIn };
      const encrypted = encryptPayload(id, 'health', updatedRecord);
      database.exec('BEGIN IMMEDIATE');
      try {
        database.prepare('UPDATE health_requests SET nonce = ?, ciphertext = ?, tag = ? WHERE id = ?').run(encrypted.nonce, encrypted.ciphertext, encrypted.tag, id);
        if (body.status !== undefined && body.status !== record.status) {
          database.prepare('INSERT INTO health_request_audit (request_id, action, occurred_at) VALUES (?, ?, ?)').run(id, 'Request status updated', new Date().toISOString());
        }
        if (followUpDate !== undefined || followUpOptIn !== undefined) {
          database.prepare('INSERT INTO health_request_audit (request_id, action, occurred_at) VALUES (?, ?, ?)').run(id, 'Follow-up settings updated', new Date().toISOString());
        }
        database.exec('COMMIT');
      } catch (error) {
        database.exec('ROLLBACK');
        throw error;
      }
      return json(res, 200, { saved: true });
    }).catch(error => json(res, error.status || 400, { error: error.status ? error.message : 'Invalid request.' }));
  }

  if (req.method === 'PATCH' && /^\/api\/admin\/requests\/[a-f0-9-]{36}$/i.test(path)) {
    if (!sessionsEnabled) return json(res, 503, { code: 'NOT_CONFIGURED', error: 'Admin access is not configured.' });
    if (!requireSameOrigin(req, res) || !findSession(req, res)) return;
    return readJson(req).then(body => {
      const status = body.status;
      if (!CASE_STATUSES.includes(status)) return json(res, 400, { error: 'Choose a valid enquiry status.' });
      const id = path.split('/').at(-1);
      const changed = database.prepare('UPDATE enquiries SET status = ? WHERE id = ?').run(status, id).changes;
      if (!changed) return json(res, 404, { error: 'Enquiry not found.' });
      database.prepare('INSERT INTO admin_audit (enquiry_id, action, occurred_at) VALUES (?, ?, ?)').run(id, `Status changed to ${status}`, new Date().toISOString());
      return json(res, 200, { saved: true });
    }).catch(error => json(res, error.status || 400, { error: error.status ? error.message : 'Invalid request.' }));
  }

  if (req.method === 'POST' && path === '/api/admin/login') {
    if (!sessionsEnabled) return json(res, 503, { code: 'NOT_CONFIGURED', error: 'Admin access is not configured.' });
    if (!requireSameOrigin(req, res)) return;
    const retryAfter = recordRateLimit(`login:${req.socket.remoteAddress}`, 8, 15 * 60 * 1000);
    if (retryAfter) return json(res, 429, { error: 'Too many sign-in attempts. Try again later.' }, { 'Retry-After': String(retryAfter) });
    return readJson(req).then(body => {
      if (typeof body.password !== 'string' || body.password.length > 256) return json(res, 400, { error: 'Enter a valid administrator password.' });
      const supplied = fingerprint(body.password);
      if (!timingSafeEqual(supplied, adminHash)) return json(res, 401, { error: 'Sign-in failed. Check your password.' });
      const token = randomBytes(32).toString('hex');
      liveSessions.set(token, Date.now() + SESSION_MS);
      return json(res, 200, { authenticated: true }, { 'Set-Cookie': sessionCookie(req, token, SESSION_MS / 1000), 'Cache-Control': 'no-store' });
    }).catch(error => json(res, error.status || 400, { error: error.status ? error.message : 'Invalid request.' }));
  }

  if (req.method === 'POST' && path === '/api/admin/logout') {
    if (!requireSameOrigin(req, res)) return;
    const cookie = String(req.headers.cookie || '').split(';').map(part => part.trim()).find(part => part.startsWith(`${SESSION_COOKIE}=`));
    if (cookie) liveSessions.delete(cookie.slice(SESSION_COOKIE.length + 1));
    return json(res, 200, { signedOut: true }, { 'Set-Cookie': sessionCookie(req) });
  }

  if (req.method === 'POST' && ['/api/care-requests', '/api/partner-applications', '/api/coordination-requests', '/api/medicine-requests'].includes(path)) {
    if (!sessionsEnabled) return json(res, 503, { code: 'NOT_CONFIGURED', error: SESSION_STATUS_MESSAGES.en.notConfigured });
    if (!requireSameOrigin(req, res)) return;
    const kind = path === '/api/care-requests' ? 'care' : path === '/api/partner-applications' ? 'partner' : path === '/api/coordination-requests' ? 'coordination' : 'medicine';
    const retryAfter = recordRateLimit(`submit:${kind}:${req.socket.remoteAddress}`, 8, 60 * 60 * 1000);
    if (retryAfter) return json(res, 429, { error: 'Too many requests. Please wait before trying again.' }, { 'Retry-After': String(retryAfter) });
    return readJson(req).then(body => {
      if (body.website) return json(res, 400, { error: SESSION_STATUS_MESSAGES.en.required });
      if (kind === 'medicine' && ['prescription', 'prescriptionFile', 'file'].some(field => Object.hasOwn(body, field))) {
        return json(res, 400, { error: 'Secure prescription upload is not configured. Do not include prescription documents in this request.' });
      }
      const payload = kind === 'care' ? validateCare(body) : kind === 'partner' ? validatePartner(body) : kind === 'coordination' ? validateCoordinationRequest(body) : validateMedicineRequest(body);
      if (!payload) return json(res, 400, { error: SESSION_STATUS_MESSAGES.en.required });
      try {
        const result = kind === 'care' || kind === 'partner' ? storeEnquiry(kind, payload) : storeHealthRequest(kind, payload);
        return json(res, 201, { received: true, reference: result.reference });
      } catch {
        return json(res, 503, { error: 'Your request could not be securely saved. Please try again later.' });
      }
    }).catch(error => json(res, error.status || 400, { error: error.status ? error.message : SESSION_STATUS_MESSAGES.en.required }));
  }

  return null;
}

function securityHeaders(res, isHtml = false) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  if (isHtml) res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://images.unsplash.com https://images.pexels.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; upgrade-insecure-requests");
}

function serveFile(req, res, pathname, statusCode = 200) {
  const cleanPath = pathname === '/' ? '/index.html' : pathname;
  const allowed = new Set(['/index.html', '/app.js', '/styles.css', '/icon.svg', '/robots.txt', '/sitemap.xml']);
  if (!allowed.has(cleanPath)) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    return res.end('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Not found | SEHASETU Healthcare</title></html>');
  }
  const path = join(ROOT, basename(cleanPath));
  if (!existsSync(path)) { res.writeHead(404); return res.end('Not found'); }
  securityHeaders(res, extname(path) === '.html');
  res.setHeader('Content-Type', MIME[extname(path)] || 'application/octet-stream');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.writeHead(statusCode);
  if (req.method === 'HEAD') return res.end();
  createReadStream(path).pipe(res);
}

function requestHandler(req, res) {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    if (url.pathname.startsWith('/api/')) {
      const result = apiRoute(req, res, url.pathname);
      if (result === null && !res.writableEnded) return json(res, 404, { error: 'Endpoint not found.' });
      return;
    }
    if (['/app.js', '/styles.css', '/icon.svg'].includes(url.pathname)) return serveFile(req, res, url.pathname);
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { 'Allow': 'GET, HEAD', 'Cache-Control': 'no-store' });
      return res.end('Method not allowed.');
    }
    const publicRoutes = new Set(['/health', '/request-care', '/partner-application', '/doctor-hospital-assistance', '/medicine-delivery', '/services', '/how-it-works', '/for-families', '/for-partners', '/about', '/contact', '/resources', '/faqs', '/privacy', '/terms', '/cancellation', '/grievance', '/admin']);
    const segments = url.pathname.split('/').filter(Boolean);
    if (url.pathname !== '/' && !publicRoutes.has(url.pathname) && !(segments.length === 2 && ['services', 'resources'].includes(segments[0]))) {
      return serveFile(req, res, '/index.html', 404);
    }
    serveFile(req, res, '/index.html');
  } catch {
    if (!res.headersSent) json(res, 500, { error: 'An unexpected server error occurred.' });
    else res.destroy();
  }
}

process.umask(0o077);
try { setupDatabase(); }
catch (error) {
  console.error(`SEHASETU secure storage could not start: ${error.message}`);
  process.exitCode = 1;
  process.exit();
}

const host = process.env.HOST || '0.0.0.0';
const portConfigured = process.env.PORT !== undefined;
let port = Number(process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be a valid TCP port.');
const server = createServer(requestHandler);
server.requestTimeout = 15_000;
server.headersTimeout = 10_000;
server.keepAliveTimeout = 5_000;
server.on('error', error => {
  if (error.code === 'EADDRINUSE' && !portConfigured && process.env.NODE_ENV !== 'production' && port < 65535) {
    port += 1;
    console.warn(`Port ${port - 1} is already in use; trying port ${port}.`);
    server.listen(port, host);
    return;
  }
  console.error(`SEHASETU Healthcare could not start: ${error.message}`);
  database?.close();
  process.exit(1);
});
server.listen(port, host, () => {
  console.log(`SEHASETU Healthcare running at http://${host}:${server.address().port}`);
  if (!sessionsEnabled) console.log('Intake and staff access are disabled; configure ADMIN_PASSWORD and ENCRYPTION_KEY to accept requests.');
});
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => server.close(() => { database?.close(); process.exit(0); }));
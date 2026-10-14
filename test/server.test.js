import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { createServer as createTcpServer } from 'node:net';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const careDetails = {
  careFor: 'parent',
  support: ['companionship', 'scheduled-caregiver'],
  locality: 'Sigra',
  preferredDate: new Date(Date.now() + 86_400_000).toISOString().slice(0, 10),
  preferredTime: 'Morning',
  frequency: 'once',
  fullName: 'Confidential Family Member',
  phone: '9876543210',
  relationship: 'daughter',
  preferredLanguage: 'English',
  email: 'family@example.com',
  message: 'Please call about a scheduled visit.',
  contactConsent: 'yes',
  updatesConsent: 'no',
};
const coordinationDetails = {
  patientName: 'Confidential Patient',
  age: '72',
  dateOfBirth: '',
  caregiverName: 'Confidential Caregiver',
  phone: '9876543212',
  email: '',
  address: 'Private address in Sigra',
  locality: 'Sigra',
  doctorPreference: 'help',
  doctorName: '',
  specialty: '',
  hospital: '',
  hospitalAddress: '',
  lastConsultationDate: '',
  nextAppointmentDate: '',
  accompaniment: 'yes',
  medicineAssistance: 'no',
  contactMethod: 'phone',
  followUpOptIn: 'no',
  followUpDate: '',
  consent: 'yes',
};
const medicineDetails = {
  patientName: 'Confidential Medicine Patient',
  phone: '9876543213',
  email: '',
  doctorName: '',
  hospital: '',
  medicineName: '',
  quantity: '',
  address: 'Private delivery address',
  locality: 'Lanka',
  deliveryInstructions: '',
  requestedDate: '',
  deliveryWindow: 'Flexible',
  requestType: 'first',
  followUpOptIn: 'no',
  followUpDate: '',
  verificationAcknowledgement: 'yes',
  consent: 'yes',
};

let server;
let port;
let directory;
let baseUrl;
let sessionCookie;
let adminPassword;

async function freePort() {
  const socket = createTcpServer();
  socket.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => { socket.once('listening', resolve); socket.once('error', reject); });
  const assigned = socket.address().port;
  await new Promise((resolve, reject) => socket.close(error => error ? reject(error) : resolve()));
  return assigned;
}

before(async () => {
  port = await freePort();
  baseUrl = `http://127.0.0.1:${port}`;
  directory = await mkdtemp(join(tmpdir(), 'sehasetu-server-test-'));
  adminPassword = randomBytes(32).toString('base64url');
  server = spawn(process.execPath, ['server.js'], {
    cwd: root,
    env: {
      ...process.env,
      PORT: String(port),
      HOST: '127.0.0.1',
      DATA_DIR: directory,
      ADMIN_PASSWORD: adminPassword,
      ENCRYPTION_KEY: randomBytes(32).toString('hex'),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  const started = new Promise((resolve, reject) => {
    server.stdout.on('data', chunk => {
      output += chunk.toString();
      if (output.includes(`:${port}`)) resolve();
    });
    server.stderr.on('data', chunk => { output += chunk.toString(); });
    server.once('error', reject);
    server.once('exit', code => reject(new Error(`Test server exited (${code}): ${output}`)));
  });
  await Promise.race([started, delay(10_000, undefined, { ref: false }).then(() => { throw new Error(`Test server did not start: ${output}`); })]);
});

after(async () => {
  if (server && server.exitCode === null && server.signalCode === null) {
    server.kill('SIGTERM');
    await new Promise(resolve => server.once('exit', resolve));
  }
  if (directory) await rm(directory, { recursive: true, force: true });
});

async function response(path, options = {}) {
  return fetch(`${baseUrl}${path}`, { ...options, headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(sessionCookie && options.auth ? { Cookie: sessionCookie } : {}), ...options.headers } });
}

async function jsonResponse(path, method, body, headers = {}) {
  return response(path, { method, body: JSON.stringify(body), headers });
}

test('live bilingual site, secure care intake, and staff workflow', async t => {
  await t.test('serves public pages with browser security headers', async () => {
    const home = await response('/');
    const html = await home.text();
    assert.equal(home.status, 200);
    assert.match(html, /<main id="main"/);
    assert.match(html, /<script src="\/app\.js" defer/);
    assert.match(home.headers.get('content-security-policy'), /script-src 'self'/);
    assert.equal(home.headers.get('x-frame-options'), 'DENY');
    const script = await response('/app.js');
    const app = await script.text();
    assert.equal(script.status, 200);
    assert.match(script.headers.get('content-type'), /javascript/);
    assert.match(app, /function render\(/);
    assert.match(app, /Hospital Se Ghar Tak,/);
    assert.match(app, /function updateCareReview/);
    assert.match(html, /Family portal in development/);
    const styles = await response('/styles.css');
    assert.equal(styles.status, 200);
    assert.match(styles.headers.get('content-type'), /text\/css/);
    const icon = await response('/icon.svg');
    assert.equal(icon.status, 200);
    assert.match(icon.headers.get('content-type'), /image\/svg\+xml/);
    const missingPage = await response('/not-a-real-page');
    assert.equal(missingPage.status, 404);
    for (const path of ['/services', '/services/elderly-care', '/services/hospital-to-home-recovery', '/services/diagnostics-coordination', '/services/physiotherapy-coordination', '/services/medical-equipment-coordination', '/services/insurance-document-assistance', '/services/long-term-care-coordination', '/services/qualified-professional-care', '/request-care', '/partner-application', '/doctor-hospital-assistance', '/medicine-delivery', '/for-families', '/for-partners', '/about', '/contact', '/how-it-works', '/resources', '/resources/caregiver-or-nurse', '/faqs', '/privacy', '/terms', '/cancellation', '/grievance', '/admin']) {
      const page = await response(path);
      assert.equal(page.status, 200, `${path} should serve the application`);
      assert.match(page.headers.get('content-type'), /text\/html/);
    }
    assert.match(app, /Do not upload or send prescriptions/);
  });

  await t.test('rejects cross-origin requests and invalid care enquiries', async () => {
    const crossOrigin = await jsonResponse('/api/care-requests', 'POST', careDetails, { Origin: 'https://attacker.example' });
    assert.equal(crossOrigin.status, 403);
    const crossOriginHealth = await jsonResponse('/api/coordination-requests', 'POST', coordinationDetails, { Origin: 'https://attacker.example' });
    assert.equal(crossOriginHealth.status, 403);
    const invalid = await jsonResponse('/api/care-requests', 'POST', { ...careDetails, support: ['fake-service'] });
    assert.equal(invalid.status, 400);
    const missingConsent = await jsonResponse('/api/care-requests', 'POST', { ...careDetails, contactConsent: '' });
    assert.equal(missingConsent.status, 400);
    const missingPatientConsent = await jsonResponse('/api/coordination-requests', 'POST', { ...coordinationDetails, consent: '' });
    assert.equal(missingPatientConsent.status, 400);
    const doctorWithoutName = await jsonResponse('/api/coordination-requests', 'POST', { ...coordinationDetails, doctorPreference: 'preferred' });
    assert.equal(doctorWithoutName.status, 400);
    const invalidPatientAge = await jsonResponse('/api/coordination-requests', 'POST', { ...coordinationDetails, age: null });
    assert.equal(invalidPatientAge.status, 400);
    const invalidFollowUpDate = await jsonResponse('/api/medicine-requests', 'POST', { ...medicineDetails, followUpOptIn: 'yes', followUpDate: 123 });
    assert.equal(invalidFollowUpDate.status, 400);
    const medicineWithoutAcknowledgement = await jsonResponse('/api/medicine-requests', 'POST', { ...medicineDetails, verificationAcknowledgement: '' });
    assert.equal(medicineWithoutAcknowledgement.status, 400);
    const unsupportedPrescriptionUpload = await jsonResponse('/api/medicine-requests', 'POST', { ...medicineDetails, prescription: 'private-document-content' });
    assert.equal(unsupportedPrescriptionUpload.status, 400);
    assert.match((await unsupportedPrescriptionUpload.json()).error, /upload is not configured/i);
  });

  let careReference;
  let coordinationReference;
  let medicineReference;
  await t.test('validates and stores care and partner enquiries', async () => {
    const care = await jsonResponse('/api/care-requests', 'POST', careDetails);
    assert.equal(care.status, 201);
    const careResult = await care.json();
    assert.match(careResult.reference, /^SH-\d{4}-[A-F0-9]{8}$/);
    careReference = careResult.reference;

    const partner = await jsonResponse('/api/partner-applications', 'POST', { fullName: 'Varanasi Care Agency', phone: '9876543211', email: 'partner@example.com', category: 'agency', experience: 'Local caregiver coordination.', areas: 'Sigra and Lanka', availability: 'Weekdays', qualifications: '', contactConsent: 'yes' });
    assert.equal(partner.status, 201);
    assert.match((await partner.json()).reference, /^SH-\d{4}-[A-F0-9]{8}$/);

    const coordination = await jsonResponse('/api/coordination-requests', 'POST', coordinationDetails);
    assert.equal(coordination.status, 201);
    coordinationReference = (await coordination.json()).reference;
    assert.match(coordinationReference, /^SH-\d{4}-[A-F0-9]{8}$/);

    const medicine = await jsonResponse('/api/medicine-requests', 'POST', medicineDetails);
    assert.equal(medicine.status, 201);
    medicineReference = (await medicine.json()).reference;
    assert.match(medicineReference, /^SH-\d{4}-[A-F0-9]{8}$/);
  });

  await t.test('requires staff authentication and limits sign-in attempts', async () => {
    const denied = await response('/api/admin/requests');
    assert.equal(denied.status, 401);
    const invalidLogin = await jsonResponse('/api/admin/login', 'POST', { password: 'not-the-test-password' });
    assert.equal(invalidLogin.status, 401);

    const correct = await jsonResponse('/api/admin/login', 'POST', { password: adminPassword });
    assert.equal(correct.status, 200);
    sessionCookie = correct.headers.getSetCookie().find(value => value.startsWith('sehasetu_staff='));
    assert.ok(sessionCookie);
    assert.match(sessionCookie, /HttpOnly/);
    assert.match(sessionCookie, /SameSite=Strict/);
  });

  await t.test('shows records only after staff sign-in and records status changes', async () => {
    assert.ok(careReference);
    const records = await response('/api/admin/requests', { auth: true });
    assert.equal(records.status, 200);
    const { items } = await records.json();
    assert.equal(items.length, 4);
    const care = items.find(item => item.reference === careReference);
    assert.equal(care.fullName, careDetails.fullName);
    assert.equal(care.locality, careDetails.locality);
    assert.equal(care.status, 'New Enquiry');
    const coordination = items.find(item => item.reference === coordinationReference);
    assert.equal(coordination.workflow, 'health');
    assert.equal(coordination.patientDetails.doctorPreference, 'help');
    assert.equal(coordination.status, 'New Request');
    const medicine = items.find(item => item.reference === medicineReference);
    assert.equal(medicine.kind, 'medicine');
    assert.equal(medicine.patientDetails.medicineName, '');
    assert.equal(medicine.status, 'New Request');

    const invalidStatus = await jsonResponse(`/api/admin/requests/${care.id}`, 'PATCH', { status: 'Invented Status' }, { Cookie: sessionCookie.split(';')[0] });
    assert.equal(invalidStatus.status, 400);
    const updated = await jsonResponse(`/api/admin/requests/${care.id}`, 'PATCH', { status: 'Assessment Pending' }, { Cookie: sessionCookie.split(';')[0] });
    assert.equal(updated.status, 200);
    const refreshed = await response('/api/admin/requests', { auth: true });
    const updatedCare = (await refreshed.json()).items.find(item => item.reference === careReference);
    assert.equal(updatedCare.status, 'Assessment Pending');

    const invalidHealthStatus = await jsonResponse(`/api/admin/health-requests/${coordination.id}`, 'PATCH', { status: 'Delivered' }, { Cookie: sessionCookie.split(';')[0] });
    assert.equal(invalidHealthStatus.status, 400);
    const followUpWithoutDate = await jsonResponse(`/api/admin/health-requests/${coordination.id}`, 'PATCH', { status: 'Follow-up Scheduled' }, { Cookie: sessionCookie.split(';')[0] });
    assert.equal(followUpWithoutDate.status, 400);
    const unverifiedDeliveryStatus = await jsonResponse(`/api/admin/health-requests/${medicine.id}`, 'PATCH', { status: 'Delivered' }, { Cookie: sessionCookie.split(';')[0] });
    assert.equal(unverifiedDeliveryStatus.status, 400);
    const unverifiedPharmacyStatus = await jsonResponse(`/api/admin/health-requests/${medicine.id}`, 'PATCH', { status: 'Confirmed by Pharmacy' }, { Cookie: sessionCookie.split(';')[0] });
    assert.equal(unverifiedPharmacyStatus.status, 400);
    const futureDate = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10);
    const missingReminderDate = await jsonResponse(`/api/admin/health-requests/${medicine.id}`, 'PATCH', { followUpOptIn: true }, { Cookie: sessionCookie.split(';')[0] });
    assert.equal(missingReminderDate.status, 400);
    const updateMedicine = await jsonResponse(`/api/admin/health-requests/${medicine.id}`, 'PATCH', { status: 'Prescription Needed', followUpDate: futureDate, followUpOptIn: true }, { Cookie: sessionCookie.split(';')[0] });
    assert.equal(updateMedicine.status, 200, JSON.stringify(await updateMedicine.json()));
    const refreshedHealth = (await (await response('/api/admin/requests', { auth: true })).json()).items.find(item => item.reference === medicineReference);
    assert.equal(refreshedHealth.status, 'Prescription Needed');
    assert.equal(refreshedHealth.followUpDate, futureDate);
    assert.equal(refreshedHealth.followUpOptIn, true);
  });

  await t.test('encrypts personal data at rest and revokes the staff session on logout', async () => {
    const files = await readdir(directory);
    for (const file of files.filter(name => name.startsWith('sehasetu.sqlite'))) {
      const diskBytes = await readFile(join(directory, file));
      assert.equal(diskBytes.includes(Buffer.from(careDetails.fullName)), false, `${file} must not contain the submitted name in plaintext`);
      assert.equal(diskBytes.includes(Buffer.from(careDetails.phone)), false, `${file} must not contain the submitted mobile number in plaintext`);
      assert.equal(diskBytes.includes(Buffer.from(coordinationDetails.patientName)), false, `${file} must not contain a patient name in plaintext`);
      assert.equal(diskBytes.includes(Buffer.from(medicineDetails.patientName)), false, `${file} must not contain a medicine-request patient name in plaintext`);
      assert.equal(diskBytes.includes(Buffer.from('Prescription Needed')), false, `${file} must not contain health workflow statuses in plaintext`);
    }
    const logout = await jsonResponse('/api/admin/logout', 'POST', {}, { Cookie: sessionCookie.split(';')[0] });
    assert.equal(logout.status, 200);
    sessionCookie = undefined;
    const revoked = await response('/api/admin/requests', { auth: true });
    assert.equal(revoked.status, 401);
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const failed = await jsonResponse('/api/admin/login', 'POST', { password: 'not-the-test-password' });
      assert.equal(failed.status, 401);
    }
    const rateLimited = await jsonResponse('/api/admin/login', 'POST', { password: adminPassword });
    assert.equal(rateLimited.status, 429);
  });
});
# SEHASETU Healthcare

A bilingual (English/Hindi), responsive care-coordination website for families in Varanasi. It runs on Node.js 24 or later with **no external npm dependencies** and uses Node's built-in SQLite driver for optional encrypted enquiry storage.

## Run locally

```sh
npm run dev
```

Open `http://localhost:3000`. The public website and its guides work immediately. Online care and partner submissions and the staff dashboard **remain disabled until the server is configured**; requests are not saved, and the form displays this explicitly. Configure credentials below to enable those features. Check that the official privacy notice and service contact details have been reviewed before enabling real intake.

```sh
export ADMIN_PASSWORD="$(openssl rand -base64 36)"
export ENCRYPTION_KEY="$(openssl rand -hex 32)"
npm start
```

Keep both values in your host's secret manager, never in source control, browser code, or the public website. The administrator password must contain at least 20 characters. `ENCRYPTION_KEY` must contain exactly 64 hexadecimal characters; generate it once and protect a separate backup. Changing or losing the key makes existing enquiries unreadable. The server exits at startup if the password or encryption key is invalid.

Optional configuration:

- `PORT`: listening port; defaults to `3000`. In local development, if the default port is busy and `PORT` is not explicitly set, the server tries subsequent ports. An explicitly configured `PORT` fails clearly if unavailable.
- `HOST`: listening address; defaults to `0.0.0.0`.
- `DATA_DIR`: directory for the SQLite database and its write-ahead log; defaults to `./data`.
- `NODE_ENV=production`: adds the `Secure` attribute to the staff session cookie. Use behind an HTTPS-terminating host.

## Tests

```sh
npm run check
npm test
```

The Node test suite starts an isolated server with temporary credentials and a temporary SQLite database. It covers HTTP pages, security headers, same-origin and field validation, care, partner, doctor/hospital, and medicine request flows, staff authentication, status and follow-up updates, logout, and confirmation that personal data is not stored in plaintext. It deletes its temporary database when finished.

## Data and access

Once both secrets are configured, valid care enquiries, partner applications, doctor/hospital coordination requests, and medicine-assistance requests are validated again on the server, encrypted using AES-256-GCM, and saved in SQLite. The encrypted records are accessible in the staff dashboard at `/admin` after the administrator password is entered. Patient details and consent are encrypted at rest. Sessions are `HttpOnly`, `SameSite=Strict`, time-limited, and kept in server memory; restarting the server signs staff out. Request bodies are limited to 16 KiB. Unauthenticated requests, invalid consent, cross-origin requests, and rate-limited requests are rejected.

The new healthcare forms collect coordination details only. Secure prescription uploads, private medical-document storage, authorized pharmacist review, pharmacy and delivery integrations, payments, SMS/WhatsApp, automated reminders, patient-facing order status, individual staff accounts/roles, and automated retention/deletion are **not connected**. The medicine form does not accept files, and a request does not create an order. Staff can record a follow-up date and reminder preference for manual review; the application sends no messages and never automatically refills or renews prescriptions. Statuses such as pharmacy confirmation or delivery are administrative records only and are not confirmed by an external system. The existing dashboard is protected by one administrator credential, not role-based staff permissions. Do not accept real patient records or enable medicine fulfillment until private document handling, authorized pharmacy operations, access controls, retention/deletion, and applicable Indian legal requirements have been implemented and reviewed.

## Customer experience status

The homepage introduces the Varanasi-first service model, service shortcuts, a consent and verification explanation, coordination journey, service boundaries, medicine-request checks, family support, and FAQs. The care enquiry includes a review step before submission; a case reference is shown only after the configured server confirms receipt. The family-facing portal is not connected and is labelled as in development. Service availability, providers, quotes, and appointments are not represented as confirmed; each requires review and customer approval.

Database files are created in a directory with owner-only access under a restrictive server umask. Add the entire directory, including SQLite WAL/SHM files, to `.gitignore`. For production, use persistent storage, arrange tested and access-restricted backups of both the database and the encryption key, and document a retention, deletion, incident-response, and access-review process before accepting real data. The included draft privacy notice is not a substitute for reviewing legal obligations or confirming actual operations. The built-in in-memory rate limiter is intended for a single app process; a multi-instance deployment needs a shared rate limiter and appropriately managed secrets and encrypted persistence.

## Deployment

Deploy as a **long-running Node.js service with Node 24+ and persistent writable storage**; do not deploy this SQLite server as a serverless function with ephemeral storage. Install no packages; run `npm start`. Set `PORT`, `NODE_ENV=production`, `ADMIN_PASSWORD`, `ENCRYPTION_KEY`, and `DATA_DIR` through your platform's private configuration. Terminate TLS at the host and enable HTTPS/HSTS there. The server enforces same-origin form submissions, a same-site staff cookie, a content-security policy, content-type checks, and a small request-size limit. Verify your platform's proxy, secure-cookie, persistence, firewall, backup, and update settings before launch.

Photographs and fonts load from Pexels and Google Fonts; an internet connection is needed for these optional visual assets. Review image licensing and confirm the final images, fonts, and their attributions meet your intended deployment requirements.

## Launch checklist

Before taking actual enquiries, supply and professionally review the official phone number, business email, WhatsApp Business link, responsible legal-entity details, approved service areas, real provider terms and rates, response and grievance contacts, and final privacy, cancellation, and terms documents. Confirm partner eligibility and verification procedures, service and clinical boundaries, consent wording, retention and access policies, secure backups, and a properly secured HTTPS deployment. Do not publish invented provider credentials, availability, prices, office addresses, reviews, or outcomes.

Secure partner-document upload, partner eligibility/status administration, payments, notifications, marketing consent processing, persistent audit attribution to individual staff users, automated data retention, and centralised rate limiting are not implemented. The application does not provide a medical service, emergency response, payments, care matching guarantees, or an assertion that any provider has been verified.
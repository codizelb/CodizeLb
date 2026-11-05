const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

// Minimal .env loader (no extra dependency)
try {
  fs.readFileSync(path.join(__dirname, '..', '..', '.env'), 'utf8').split('\n').forEach(line => {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/)
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2]
  })
} catch { /* no .env file */ }

const e = process.env
const config = {
  port: Number(e.PORT) || 3000,
  db: {
    server: e.DB_SERVER || 'localhost',
    // Named instance (e.g. SQLEXPRESS): set DB_INSTANCE and leave DB_PORT unset — SQL Server Browser
    // resolves the port dynamically. Fixed port: leave DB_INSTANCE unset and set DB_PORT (default 1433).
    instance: e.DB_INSTANCE || undefined,
    port: e.DB_INSTANCE ? undefined : Number(e.DB_PORT) || 1433,
    user: e.DB_USER || 'sa',
    password: e.DB_PASSWORD || '',
    name: e.DB_NAME || 'codize',
    // Local SQL Server usually uses a self-signed cert, so encrypt+trust are both needed for a local dev connection.
    // Azure SQL (*.database.windows.net) requires an encrypted connection with a real certificate,
    // so those two settings default correctly for it; for a local SQL Server they default to
    // "no encryption, trust the self-signed cert". Either can still be forced via .env.
    encrypt: e.DB_ENCRYPT ? e.DB_ENCRYPT === 'true' : /\.database\.windows\.net$/i.test(e.DB_SERVER || ''),
    trustServerCertificate: e.DB_TRUST_CERT ? e.DB_TRUST_CERT !== 'false' : !/\.database\.windows\.net$/i.test(e.DB_SERVER || ''),
    // Set DB_AUTO_CREATE=false when the database already exists (always the case on Azure SQL,
    // where you create it in the portal): skips the CREATE DATABASE step that needs `master` access.
    autoCreate: e.DB_AUTO_CREATE !== 'false',
    retries: Number(e.DB_CONNECT_RETRIES) || 4,
    retryDelayMs: Number(e.DB_RETRY_DELAY_MS) || 15000,
  },
  adminPassword: e.ADMIN_PASSWORD || 'changeme',
  secret: e.SECRET || crypto.randomBytes(32).toString('hex'),
  // UPLOAD_DIR lets you point uploads at a persistent disk/volume on hosts that wipe the app folder on redeploy.
  uploadDir: e.UPLOAD_DIR || path.join(__dirname, '..', '..', 'uploads'),
  clientDist: path.join(__dirname, '..', '..', '..', 'client', 'dist'),
  // Email notifications for new contact-form messages. Optional — if SMTP_HOST is unset,
  // messages are still saved to the database, they just won't be emailed.
  mail: {
    host: e.SMTP_HOST || '',
    port: Number(e.SMTP_PORT) || 587,
    secure: e.SMTP_SECURE === 'true', // true for port 465, false for 587/25 (STARTTLS)
    user: e.SMTP_USER || '',
    pass: e.SMTP_PASS || '',
    from: e.MAIL_FROM || e.SMTP_USER || '',
    to: e.MAIL_TO || e.SMTP_USER || '',
  },
}
if (!/^\w+$/.test(config.db.name)) throw new Error('DB_NAME may only contain letters, numbers and underscores')
if (!e.ADMIN_PASSWORD) console.warn('WARNING: ADMIN_PASSWORD is not set — the first-run admin password will be "changeme"')
if (!e.SECRET) console.warn('WARNING: SECRET is not set — admin logins will reset every time the server restarts')
module.exports = config

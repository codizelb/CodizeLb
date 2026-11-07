const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

// Minimal .env loader (no extra dependency). Real environment variables (e.g. Render's) always win.
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
    host: e.DB_HOST || 'localhost',
    port: Number(e.DB_PORT) || 3306,
    user: e.DB_USER || 'root',
    password: e.DB_PASSWORD || '',
    name: e.DB_NAME || 'defaultdb',
    // Aiven requires TLS. Supply its CA certificate in DB_SSL_CA (PEM text; "\n" escapes are accepted
    // so it also works from a single-line .env value). DB_SSL=true encrypts without verifying the cert.
    ssl: e.DB_SSL_CA
      ? { ca: e.DB_SSL_CA.replace(/\\n/g, '\n'), rejectUnauthorized: true }
      : e.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    connectTimeoutMs: Number(e.DB_CONNECT_TIMEOUT_MS) || 30000,
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
if (!config.db.ssl && /aivencloud\.com$/i.test(config.db.host)) console.warn('WARNING: DB_HOST is an Aiven host but no DB_SSL_CA / DB_SSL is set — the connection will be refused')
module.exports = config
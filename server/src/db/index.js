const sql = require('mssql')
const { db } = require('../config/env')

/** Builds the mssql connection config from env settings. Shared with init.js (which also
    connects to `master` before this database exists). */
function connectionConfig(database) {
  return {
    server: db.server, port: db.port, user: db.user, password: db.password, database,
    options: { encrypt: db.encrypt, trustServerCertificate: db.trustServerCertificate, instanceName: db.instance },
  }
}

// The pool connects lazily; init.js makes sure the database exists before the first query.
// `database` is intentionally set here to our app database — see init.js, which connects to
// `master` separately (on its own pool) to create it first.
const pool = new sql.ConnectionPool({
  ...connectionConfig(db.name),
  connectionTimeout: 60000, // Azure serverless databases can take up to ~a minute to wake from auto-pause
  requestTimeout: 30000,
  pool: { max: 10, idleTimeoutMillis: 30000 },
})
// Cloud gateways drop idle connections. Without a listener, mssql turns that into an uncaught
// exception that kills the whole process; with one, it logs and the pool reconnects on the next query.
pool.on('error', err => console.error('Database pool error (will reconnect on next query):', err.message))

/** Connects, retrying on network/timeout failures (e.g. a paused Azure database waking up).
    A wrong username/password (ELOGIN) is never retried — retrying can't fix it, it only delays the error. */
async function connectWithRetry() {
  for (let attempt = 1; ; attempt++) {
    try { return await pool.connect() } catch (err) {
      if (err.code === 'ELOGIN' || attempt >= db.retries) throw err
      console.warn(`Database connection failed (attempt ${attempt}/${db.retries}): ${err.message} — retrying in ${db.retryDelayMs / 1000}s`)
      await new Promise(r => setTimeout(r, db.retryDelayMs))
    }
  }
}
const ready = connectWithRetry() // single shared connection promise; mssql queues requests until it resolves
ready.catch(() => {}) // failure is reported by init.js when it awaits `ready`; this just stops Node treating it as unhandled
module.exports = { pool, ready, sql, connectionConfig }

const sql = require('mssql')
const { db } = require('../config/env')
// The pool connects lazily; init.js makes sure the database exists before the first query.
// `database` is intentionally omitted here — see init.js, which connects to `master` first
// to create the database, then this pool connects directly to it.
const pool = new sql.ConnectionPool({
  server: db.server, port: db.port, user: db.user, password: db.password, database: db.name,
  options: { encrypt: db.encrypt, trustServerCertificate: db.trustServerCertificate },
  pool: { max: 10 },
})
const ready = pool.connect() // single shared connection promise; mssql queues requests until it resolves
module.exports = { pool, ready, sql }

const mysql = require('mysql2/promise')
const { db } = require('../config/env')

// One shared pool for the whole app. mysql2 connects lazily, so init.js's first query is
// what actually surfaces a bad host/credential/SSL problem.
const pool = mysql.createPool({
  host: db.host, port: db.port, user: db.user, password: db.password, database: db.name,
  ssl: db.ssl,
  charset: 'utf8mb4',
  timezone: 'Z',                 // DATETIME values are read/written as UTC
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: db.connectTimeoutMs, // managed/free DBs can take a while to wake
  enableKeepAlive: true,         // stops cloud gateways dropping idle connections
  keepAliveInitialDelay: 10000,
})
module.exports = { pool }
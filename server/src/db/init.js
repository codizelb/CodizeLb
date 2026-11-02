const fs = require('fs')
const path = require('path')
const sql = require('mssql')
const { db, adminPassword } = require('../config/env')
const { pool, ready } = require('./index')
const contentService = require('../services/content.service')
const authService = require('../services/auth.service')

/** Connects to the `master` database (always present) to create ours if it doesn't exist yet. */
async function ensureDatabase() {
  const admin = new sql.ConnectionPool({
    server: db.server, port: db.port, user: db.user, password: db.password, database: 'master',
    options: { encrypt: db.encrypt, trustServerCertificate: db.trustServerCertificate },
  })
  const conn = await admin.connect()
  await conn.request().query(`IF NOT EXISTS (SELECT 1 FROM sys.databases WHERE name = '${db.name}') CREATE DATABASE [${db.name}]`)
  await conn.close()
}
async function createTables() {
  await ready
  const stmt = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
  await pool.request().batch(stmt) // .batch (not .query) so the GO-free multi-statement IF/BEGIN/END blocks run correctly
}
/** Fills missing content keys from seed.json. Existing (edited) content is never overwritten. */
async function seed() {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed.json'), 'utf8'))
  for (const [k, v] of Object.entries(data)) await contentService.insertIfMissing(k, v)
  await authService.ensureAdmin(adminPassword)
}
module.exports = async function initDb() { await ensureDatabase(); await createTables(); await seed() }

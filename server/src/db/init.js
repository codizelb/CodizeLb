const fs = require('fs')
const path = require('path')
const { adminPassword } = require('../config/env')
const { pool } = require('./index')
const contentService = require('../services/content.service')
const authService = require('../services/auth.service')

/** Runs schema.sql one statement at a time (mysql2 doesn't allow multiple statements per query by default).
    Every statement is CREATE TABLE IF NOT EXISTS, so this is safe on every start. */
async function createTables() {
  const statements = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8').split(';').map(s => s.trim()).filter(Boolean)
  for (const stmt of statements) await pool.query(stmt)
}
/** Fills missing content keys from seed.json. Existing (edited) content is never overwritten. */
async function seed() {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed.json'), 'utf8'))
  for (const [k, v] of Object.entries(data)) await contentService.insertIfMissing(k, v)
  await authService.ensureAdmin(adminPassword)
}
// The database itself (Aiven's `defaultdb`, or one you created in Workbench) must already exist.
module.exports = async function initDb() { await createTables(); await seed() }
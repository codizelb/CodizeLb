const { pool } = require('../db')
const HttpError = require('../utils/httpError')

// Sections editable from the admin dashboard. Keys starting with "_" are private (e.g. the admin credentials).
const EDITABLE = ['site', 'seo', 'hero', 'nav', 'sections', 'pillars', 'stats', 'services', 'why', 'tech', 'process', 'projects', 'testimonials', 'faq']
const parse = v => (typeof v === 'string' ? JSON.parse(v) : v)

exports.getPublic = async () => {
  const [rows] = await pool.query("SELECT k, v FROM content WHERE k NOT LIKE '\\_%'")
  return Object.fromEntries(rows.map(r => [r.k, parse(r.v)]))
}
exports.get = async key => {
  const [rows] = await pool.execute('SELECT v FROM content WHERE k = ?', [key])
  return rows[0] ? parse(rows[0].v) : null
}
exports.set = async (key, value) => {
  await pool.execute('INSERT INTO content (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v = VALUES(v)', [key, JSON.stringify(value)])
}
exports.insertIfMissing = async (key, value) => {
  await pool.execute('INSERT IGNORE INTO content (k, v) VALUES (?, ?)', [key, JSON.stringify(value)])
}
exports.saveEditable = async (key, value) => {
  if (!EDITABLE.includes(key)) throw new HttpError(400, 'Invalid section')
  await exports.set(key, value)
}
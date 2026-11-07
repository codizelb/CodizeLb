const { pool } = require('../db')
const HttpError = require('../utils/httpError')
const mail = require('./mail.service')
const clip = (v, n) => String(v || '').trim().slice(0, n)

exports.create = async body => {
  const m = { name: clip(body.name, 100), email: clip(body.email, 200), phone: clip(body.phone, 40), company: clip(body.company, 100), type: clip(body.type, 50), message: clip(body.message, 3000) }
  if (!m.name || !m.message || !/^\S+@\S+\.\S+$/.test(m.email)) throw new HttpError(400, 'Please fill in your name, a valid email and a message.')
  await pool.execute(
    'INSERT INTO messages (name, email, phone, company, type, message) VALUES (?, ?, ?, ?, ?, ?)',
    [m.name, m.email, m.phone, m.company, m.type, m.message]
  )
  try { mail.notifyNewMessage(m) } catch { /* belt-and-suspenders: notifyNewMessage already self-catches internally */ }
}
exports.list = async () => {
  const [rows] = await pool.query('SELECT id, name, email, phone, company, type, message, date FROM messages ORDER BY id DESC')
  return rows
}
exports.remove = async id => {
  await pool.execute('DELETE FROM messages WHERE id = ?', [id])
}
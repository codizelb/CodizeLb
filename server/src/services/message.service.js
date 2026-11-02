const { pool, ready, sql } = require('../db')
const HttpError = require('../utils/httpError')
const mail = require('./mail.service')
const clip = (v, n) => String(v || '').trim().slice(0, n)

exports.create = async body => {
  const m = { name: clip(body.name, 100), email: clip(body.email, 200), phone: clip(body.phone, 40), company: clip(body.company, 100), type: clip(body.type, 50), message: clip(body.message, 3000) }
  if (!m.name || !m.message || !/^\S+@\S+\.\S+$/.test(m.email)) throw new HttpError(400, 'Please fill in your name, a valid email and a message.')
  await ready
  await pool.request()
    .input('name', sql.VarChar(100), m.name).input('email', sql.VarChar(200), m.email).input('phone', sql.VarChar(40), m.phone)
    .input('company', sql.VarChar(100), m.company).input('type', sql.VarChar(50), m.type).input('message', sql.NVarChar(sql.MAX), m.message)
    .query('INSERT INTO messages (name, email, phone, company, type, message) VALUES (@name, @email, @phone, @company, @type, @message)')
  try { mail.notifyNewMessage(m) } catch { /* belt-and-suspenders: notifyNewMessage already self-catches internally */ }
}
exports.list = async () => {
  await ready
  return (await pool.request().query('SELECT id, name, email, phone, company, type, message, date FROM messages ORDER BY id DESC')).recordset
}
exports.remove = async id => {
  await ready
  await pool.request().input('id', sql.Int, id).query('DELETE FROM messages WHERE id = @id')
}

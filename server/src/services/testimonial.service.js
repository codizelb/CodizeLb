const { pool, ready, sql } = require('../db')
const HttpError = require('../utils/httpError')
const content = require('./content.service')
const clip = (v, n) => String(v || '').trim().slice(0, n)

/** A visitor's submitted testimonial goes here first, pending review — it never appears on the
    live site until an admin approves it (moved into the `testimonials` content list). */
exports.submit = async body => {
  const t = { quote: clip(body.quote, 1000), name: clip(body.name, 100), position: clip(body.position, 100), company: clip(body.company, 100) }
  if (!t.quote || !t.name) throw new HttpError(400, 'Please fill in your name and your testimonial.')
  await ready
  await pool.request()
    .input('quote', sql.NVarChar(sql.MAX), t.quote).input('name', sql.VarChar(100), t.name)
    .input('position', sql.VarChar(100), t.position).input('company', sql.VarChar(100), t.company)
    .query('INSERT INTO testimonial_submissions (quote, name, position, company) VALUES (@quote, @name, @position, @company)')
}
exports.list = async () => {
  await ready
  return (await pool.request().query('SELECT id, quote, name, position, company, date FROM testimonial_submissions ORDER BY id DESC')).recordset
}
exports.reject = async id => {
  await ready
  await pool.request().input('id', sql.Int, id).query('DELETE FROM testimonial_submissions WHERE id = @id')
}
/** Approve: copy the submission onto the live `testimonials` content list, then remove it from the queue. */
exports.approve = async id => {
  await ready
  const { recordset } = await pool.request().input('id', sql.Int, id).query('SELECT quote, name, position, company FROM testimonial_submissions WHERE id = @id')
  const sub = recordset[0]
  if (!sub) throw new HttpError(404, 'Submission not found')
  const testimonials = (await content.get('testimonials')) || []
  testimonials.push({ quote: sub.quote, name: sub.name, position: sub.position, company: sub.company })
  await content.set('testimonials', testimonials)
  await exports.reject(id)
}
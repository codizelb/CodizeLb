const nodemailer = require('nodemailer')
const { mail } = require('../config/env')

let transporter = null
if (mail.host) {
  transporter = nodemailer.createTransport({
    host: mail.host, port: mail.port, secure: mail.secure,
    auth: mail.user ? { user: mail.user, pass: mail.pass } : undefined,
  })
} else {
  console.warn('WARNING: SMTP_HOST is not set — contact form messages will be saved but not emailed')
}
console.log(transporter ? `Email notifications: ON (sending to ${mail.to || '(MAIL_TO not set)'})` : 'Email notifications: OFF')

const escapeHtml = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

/** Emails a new contact-form submission to the site owner. Never throws — a failed send should
    never fail the contact form request; the message is already safely saved in the database. */
exports.notifyNewMessage = async m => {
  if (!transporter) return
  try {
    await transporter.sendMail({
      from: mail.from, to: mail.to, replyTo: m.email,
      subject: `New website message from ${m.name}`,
      text: `Name: ${m.name}\nEmail: ${m.email}\nPhone: ${m.phone || '—'}\nCompany: ${m.company || '—'}\nProject type: ${m.type || '—'}\n\n${m.message}`,
      html: `
        <p><b>Name:</b> ${escapeHtml(m.name)}<br>
        <b>Email:</b> ${escapeHtml(m.email)}<br>
        <b>Phone:</b> ${escapeHtml(m.phone || '—')}<br>
        <b>Company:</b> ${escapeHtml(m.company || '—')}<br>
        <b>Project type:</b> ${escapeHtml(m.type || '—')}</p>
        <p>${escapeHtml(m.message).replace(/\n/g, '<br>')}</p>
      `,
    })
  } catch (err) {
    console.error('Failed to send message notification email:', err.message)
  }
}

const crypto = require('crypto')
const { secret } = require('../config/env')

const safeEqual = (a, b) => { a = Buffer.from(String(a)); b = Buffer.from(String(b)); return a.length === b.length && crypto.timingSafeEqual(a, b) }

// Passwords: scrypt with per-password salt
const hashPassword = (pw, salt = crypto.randomBytes(16).toString('hex')) => ({ salt, hash: crypto.scryptSync(pw, salt, 64).toString('hex') })
const verifyPassword = (pw, rec) => !!rec && safeEqual(crypto.scryptSync(pw, rec.salt, 64).toString('hex'), rec.hash)

// Session tokens: "<expiry>.<hmac>" (24h)
const sign = v => crypto.createHmac('sha256', secret).update(v).digest('hex')
const createToken = () => { const exp = String(Date.now() + 24 * 3600 * 1000); return `${exp}.${sign(exp)}` }
const verifyToken = token => { const [exp, sig] = String(token || '').split('.'); return !!(exp && sig && Number(exp) > Date.now() && safeEqual(sig, sign(exp))) }

module.exports = { hashPassword, verifyPassword, createToken, verifyToken }

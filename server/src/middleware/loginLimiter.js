const HttpError = require('../utils/httpError')
// Simple in-memory limiter: 5 failed logins per IP per 15 minutes
const fails = new Map(), WINDOW = 15 * 60 * 1000, MAX = 5
const recent = ip => (fails.get(ip) || []).filter(t => Date.now() - t < WINDOW)
exports.check = (req, res, next) => (recent(req.ip).length >= MAX ? next(new HttpError(429, 'Too many attempts. Try again later.')) : next())
exports.fail = ip => fails.set(ip, [...recent(ip), Date.now()])
exports.reset = ip => fails.delete(ip)

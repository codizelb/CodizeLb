const auth = require('../services/auth.service')
const limiter = require('../middleware/loginLimiter')
exports.login = async (req, res, next) => {
  try { const token = await auth.login(req.body.password); limiter.reset(req.ip); res.json({ token }) }
  catch (e) { if (e.status === 401) limiter.fail(req.ip); next(e) }
}
exports.changePassword = async (req, res) => { await auth.changePassword(req.body.current, req.body.next); res.json({ ok: true }) }

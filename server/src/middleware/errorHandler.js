exports.notFound = (req, res) => res.status(404).json({ error: 'Not found' })
// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, req, res, next) => {
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Request too large' })
  const status = err.status || 500
  if (status >= 500) console.error(err)
  const body = { error: status >= 500 ? 'Server error' : err.message }
  // DEBUG=true in server/.env includes the real error on 500s, for local troubleshooting only —
  // never enable this on a live/public site, since it can reveal internal details.
  if (status >= 500 && process.env.DEBUG === 'true') { body.debug = err.message; body.stack = err.stack }
  res.status(status).json(body)
}

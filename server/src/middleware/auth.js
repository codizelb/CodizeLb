const { verifyToken } = require('../utils/security')
module.exports = (req, res, next) => {
  if (verifyToken((req.headers.authorization || '').replace('Bearer ', ''))) return next()
  res.status(401).json({ error: 'Unauthorized' })
}

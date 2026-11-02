const fs = require('fs')
const path = require('path')
const express = require('express')
const helmet = require('helmet')
const { uploadDir, clientDist } = require('./config/env')
const auth = require('./middleware/auth')
const routes = require('./routes')
const { notFound, errorHandler } = require('./middleware/errorHandler')

const app = express()
app.disable('x-powered-by')
// Behind a reverse proxy (nginx, Caddy, a cloud load balancer) in production, this makes
// req.ip reflect the real visitor's address (from X-Forwarded-For) instead of the proxy's own
// address — required for the rate limiters and login limiter to work correctly post-deploy.
app.set('trust proxy', 1)
app.use(helmet({
  // The admin dashboard and public site load fonts/scripts inline and from Google Fonts;
  // a strict default CSP would break them, so it's left off here. Everything else helmet
  // sets by default (X-Content-Type-Options, X-Frame-Options, etc.) still applies.
  contentSecurityPolicy: false,
}))
app.use('/api/admin/upload', auth, express.json({ limit: '8mb' })) // image uploads (base64) need a larger body limit
app.use(express.json({ limit: '1mb' }))
app.use('/api', routes)
app.use('/api', notFound)
app.use('/uploads', express.static(uploadDir, { maxAge: '7d' }))
if (fs.existsSync(clientDist)) { // production: serve the built React app
  app.use(express.static(clientDist))
  app.get('*', (req, res) => res.sendFile(path.join(clientDist, 'index.html')))
}
app.use(errorHandler)
module.exports = app

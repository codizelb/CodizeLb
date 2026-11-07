const { port } = require('./config/env')
const initDb = require('./db/init')
const app = require('./app')
const { pool } = require('./db')

initDb()
  .then(() => {
    const server = app.listen(port, () => console.log(`Codize server listening on http://localhost:${port}`))
    // Graceful shutdown: on a process-manager restart/redeploy (Render, Docker, systemd), finish
    // in-flight requests and close the database pool cleanly instead of dropping connections.
    const shutdown = signal => {
      console.log(`${signal} received, shutting down...`)
      server.close(() => pool.end().finally(() => process.exit(0)))
      setTimeout(() => process.exit(1), 10000).unref() // force-exit if something hangs
    }
    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT', () => shutdown('SIGINT'))
  })
  .catch(err => {
    console.error('Startup failed:', err.message)
    if (['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'PROTOCOL_CONNECTION_LOST'].includes(err.code)) {
      console.error([
        '',
        'Could not reach the MySQL server. Common causes:',
        '  1. DB_HOST / DB_PORT are wrong (copy them from Aiven -> Service overview).',
        '  2. Aiven "Allowed IP addresses" blocks this machine, or a free-plan service is powered off.',
        '  3. The environment variables are missing — on Render set them in the dashboard; locally use server/.env.',
      ].join('\n'))
    } else if (/SSL|certificate|self.signed/i.test(err.message)) {
      console.error('\nTLS problem: set DB_SSL_CA to the contents of Aiven\'s CA certificate (ca.pem).')
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\nWrong DB_USER / DB_PASSWORD.')
    }
    process.exit(1)
  })
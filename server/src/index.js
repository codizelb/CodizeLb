const { port } = require('./config/env')
const initDb = require('./db/init')
const app = require('./app')
const { pool } = require('./db')

initDb()
  .then(() => {
    const server = app.listen(port, () => console.log(`Codize server listening on http://localhost:${port}`))
    // Graceful shutdown: on a process-manager restart/redeploy (pm2, Docker, systemd), finish
    // in-flight requests and close the database pool cleanly instead of dropping connections.
    const shutdown = signal => {
      console.log(`${signal} received, shutting down...`)
      server.close(() => pool.close().finally(() => process.exit(0)))
      setTimeout(() => process.exit(1), 10000).unref() // force-exit if something hangs
    }
    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT', () => shutdown('SIGINT'))
  })
  .catch(err => {
    console.error('Startup failed:', err.message)
    if (err.code === 'ESOCKET' || /ECONNREFUSED/.test(err.message)) {
      console.error([
        '',
        'Could not reach SQL Server. Common causes:',
        '  1. server/.env does not exist yet — copy server/.env.example to server/.env and fill it in.',
        '  2. SQL Server is a named instance (e.g. SQLEXPRESS) — set DB_INSTANCE in .env instead of DB_PORT,',
        '     and make sure the "SQL Server Browser" Windows service is running.',
        '  3. TCP/IP is disabled — enable it in SQL Server Configuration Manager > SQL Server Network',
        '     Configuration > Protocols, then restart the SQL Server service.',
      ].join('\n'))
    }
    process.exit(1)
  })

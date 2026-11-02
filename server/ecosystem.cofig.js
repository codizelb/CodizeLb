// Process-manager config for pm2 (https://pm2.keymetrics.io). Keeps the server running and
// restarts it automatically if it crashes, after a reboot, etc.
//   Install once:  npm install -g pm2
//   Start:         cd server && pm2 start ecosystem.config.js
//   View logs:     pm2 logs codize
//   On reboot:     pm2 startup   (then follow its one-time instructions)   &&   pm2 save
module.exports = {
  apps: [{
    name: 'codize',
    script: 'src/index.js',
    cwd: __dirname,
    instances: 1, // raise this only if you remove in-memory rate limiting / move it to a shared store
    autorestart: true,
    max_memory_restart: '300M',
    env: { NODE_ENV: 'production' },
  }],
}

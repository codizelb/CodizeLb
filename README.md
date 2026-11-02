# Codize — React + TypeScript + Vite + Tailwind client, Node/Express + SQL Server backend

All website content lives in SQL Server and is edited from the admin dashboard (`/admin`). The React app has no hardcoded content.

## Setup
1. Install SQL Server (Developer/Express edition) and, optionally, SSMS to browse the data.
2. `npm install` then `npm run install:all`
3. `cp server/.env.example server/.env` — set your SQL Server credentials, `ADMIN_PASSWORD` (first-run only), `SECRET`
4. Dev: `npm run dev` → site http://localhost:5173, admin http://localhost:5173/admin
5. Production: `npm run build` then `npm start` → http://localhost:3000

On first start the server creates the `codize` database and its tables and fills them from `server/src/db/seed.json`
(starter content). Later edits in the admin are never overwritten. The admin password is stored hashed in the
database; change it from the dashboard's Password tab.

If your SQL Server uses **Windows Authentication only** (no SQL login enabled), open SSMS → right-click the server →
Properties → Security → enable "SQL Server and Windows Authentication mode", restart the SQL Server service, then
create a login (or use `sa`) for `.env`.

## Viewing the data in SSMS
Connect to your server in SSMS, then under Databases → `codize` → Tables you'll find:
- **`dbo.content`** — one row per section of the site (hero, services, projects, …), stored as JSON text in the `v` column
- **`dbo.messages`** — contact form submissions

## What the admin controls
General/SEO/logo · Hero · Section order, visibility and headings · Navigation · Services · Why choose us · Stats · Technologies ·
Process · Projects (with image upload) · About pillars · Testimonials · FAQ · Contact messages · Admin password.

Uploaded images are stored in `server/uploads/` — back that folder up along with the database.

## Email notifications for contact form messages
Set the `SMTP_*` variables in `server/.env` and every new message is also emailed to `MAIL_TO`
(defaults to `SMTP_USER`) in addition to being saved in the database. Leave `SMTP_HOST` blank to
skip email — messages are always saved either way, and a failed send never blocks the form.

**Gmail:** `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_USER=you@gmail.com`, and for
`SMTP_PASS` create a 16-character **App Password** (Google Account → Security → 2-Step
Verification must be on → App passwords) — your normal Gmail password will not work.

**Outlook/Microsoft 365:** `SMTP_HOST=smtp.office365.com`, `SMTP_PORT=587`, `SMTP_USER` = your
full email address, `SMTP_PASS` = your account password (or an app password if MFA is on).

**A transactional provider (SendGrid, Mailgun, etc.):** use the SMTP host/port/credentials from
that provider's dashboard — more reliable for a live site than a personal Gmail/Outlook account.

## Server structure (`server/src`)
```
index.js            entry: init database, start server, graceful shutdown
app.js               express app: security headers, rate limiting, routes, static files, errors
config/env.js        environment + .env loading (SQL Server connection settings)
db/                  index.js (connection pool) · init.js (create db/tables, seed) · schema.sql · seed.json
routes/index.js      all API routes (public + /admin)
controllers/         thin request/response handlers
services/            business logic + SQL (content, auth, messages, testimonials, mail, uploads)
middleware/          auth · loginLimiter · rateLimit · errorHandler
utils/               security (hashing, tokens) · httpError · asyncHandler
```

Data access uses the `mssql` package with parameterized queries throughout (no string-built SQL).

## Deploying to production

This runs anywhere Node.js and SQL Server can both reach each other — a single VPS running both,
or a VPS for the app alongside a managed SQL Server (e.g. Azure SQL). What's already built in:

- **Security headers** via `helmet`.
- **Rate limiting**: 10 contact/testimonial submissions per IP per 15 minutes; 120 API requests
  per IP per minute overall. Returns a plain `429` once hit, nothing crashes.
- **Graceful shutdown**: on `SIGTERM`/`SIGINT` (what a process manager or `docker stop` sends),
  the server finishes in-flight requests and closes the database connection cleanly.
- **`app.set('trust proxy', 1)`** — required so rate limiting sees the real visitor IP once you're
  behind a reverse proxy, rather than the proxy's own address for every request.

### 1. Build the client
```
npm run build
```
This produces `client/dist`, which `server/src/app.js` automatically serves once it exists —
the whole site (site + `/admin`) is then served from one Node process on `PORT`.

### 2. Environment
Copy `server/.env.example` to `server/.env` on the server and fill in real values. Specifically
for production: a strong, unique `ADMIN_PASSWORD` and `SECRET`, and make sure `DEBUG` is **not**
set to `true` (it's for local troubleshooting only — it leaks internal error detail to the
browser, which you don't want on a public site).

### 3. Keep it running: pm2
```
npm install -g pm2
cd server
pm2 start ecosystem.config.js
pm2 save
pm2 startup        # follow the one-time instructions it prints, so it survives a server reboot
```
`pm2 logs codize` tails the logs; `pm2 restart codize` picks up a new `.env` or a new build.

Don't raise `instances` in `ecosystem.config.js` above 1 without changing the rate limiters —
they currently track IPs in each process's own memory, so multiple instances would each allow
their own separate quota rather than sharing one.

### 4. HTTPS: put a reverse proxy in front
Don't expose Node's `PORT` directly to the internet. Put **Caddy** or **nginx** in front on ports
80/443; either can fetch and renew a free TLS certificate automatically. Simplest is Caddy — a
`Caddyfile` with just:
```
yourdomain.com {
  reverse_proxy localhost:3000
}
```
and running `caddy run` handles HTTPS entirely on its own.

### 5. Database
SQL Server Express (what you likely have locally) is free but capped around 1 CPU / 1GB buffer
pool — fine for this site's traffic, not something to worry about until you're well past a small
business's typical load. For managed hosting instead of running SQL Server yourself, Azure SQL's
cheapest tier works with this project unchanged (same `mssql` driver, same connection settings).

### 6. Uploaded images need a persistent disk
`server/uploads/` is a plain folder on disk. Fine on a normal VPS. If you ever move to a
platform with an ephemeral filesystem (containers that reset on redeploy), that folder — and
anything in it — would be wiped on the next deploy; you'd need to point `uploadDir` at a mounted
volume or move to cloud storage (S3-compatible) instead. Not needed for a standard VPS.

### Quick pre-launch checklist
- [ ] Real `ADMIN_PASSWORD` set, and changed again from the dashboard once live
- [ ] `SECRET` is long and random
- [ ] `DEBUG` is unset (or `false`)
- [ ] `client/dist` built and present
- [ ] Reverse proxy + HTTPS in front of the app
- [ ] `pm2 save` + `pm2 startup` done, so a server reboot doesn't take the site down
- [ ] `server/uploads/` and the SQL Server database both included in your backup routine

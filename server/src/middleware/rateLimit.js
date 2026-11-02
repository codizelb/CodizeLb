const rateLimit = require('express-rate-limit')

const handler = (req, res) => res.status(429).json({ error: 'Too many requests. Please try again later.' })

/** Public form submissions (contact, testimonials): generous enough for a real visitor retrying
    a typo, tight enough to blunt a script hammering the endpoint. */
exports.formSubmission = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false, handler })

/** Everything else under /api: a broad ceiling just to stop a runaway client or basic flood,
    not meant to constrain normal browsing (the site makes very few API calls per visit). */
exports.general = rateLimit({ windowMs: 60 * 1000, max: 120, standardHeaders: true, legacyHeaders: false, handler })

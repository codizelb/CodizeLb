const testimonials = require('../services/testimonial.service')
exports.submit = async (req, res) => { await testimonials.submit(req.body || {}); res.status(201).json({ ok: true }) }
exports.list = async (req, res) => res.json(await testimonials.list())
exports.approve = async (req, res) => { await testimonials.approve(Number(req.params.id)); res.json({ ok: true }) }
exports.reject = async (req, res) => { await testimonials.reject(Number(req.params.id)); res.json({ ok: true }) }
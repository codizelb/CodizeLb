const messages = require('../services/message.service')
exports.create = async (req, res) => { await messages.create(req.body || {}); res.status(201).json({ ok: true }) }
exports.list = async (req, res) => res.json(await messages.list())
exports.remove = async (req, res) => { await messages.remove(Number(req.params.id)); res.json({ ok: true }) }

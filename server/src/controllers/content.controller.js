const content = require('../services/content.service')
exports.getPublic = async (req, res) => res.json(await content.getPublic())
exports.save = async (req, res) => { await content.saveEditable(req.params.key, req.body); res.json({ ok: true }) }

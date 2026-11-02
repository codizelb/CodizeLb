const uploads = require('../services/upload.service')
exports.image = (req, res) => res.json({ url: uploads.saveImage(req.body.data) })

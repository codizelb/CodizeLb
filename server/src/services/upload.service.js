const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { uploadDir } = require('../config/env')
const HttpError = require('../utils/httpError')
const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' }
const MAX = 5 * 1024 * 1024
fs.mkdirSync(uploadDir, { recursive: true })

exports.saveImage = dataUrl => {
  const m = /^data:(image\/[a-z]+);base64,(.+)$/.exec(String(dataUrl || ''))
  if (!m || !EXT[m[1]]) throw new HttpError(400, 'Use a PNG, JPG, WEBP or GIF image')
  const buf = Buffer.from(m[2], 'base64')
  if (buf.length > MAX) throw new HttpError(413, 'Image must be under 5 MB')
  const name = `${crypto.randomBytes(8).toString('hex')}.${EXT[m[1]]}`
  fs.writeFileSync(path.join(uploadDir, name), buf)
  return '/uploads/' + name
}

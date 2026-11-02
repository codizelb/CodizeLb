const contentService = require('./content.service')
const HttpError = require('../utils/httpError')
const { hashPassword, verifyPassword, createToken } = require('../utils/security')
const KEY = '_admin'

exports.ensureAdmin = async initialPassword => {
  if (!(await contentService.get(KEY))) await contentService.set(KEY, hashPassword(initialPassword))
}
exports.login = async password => {
  if (!verifyPassword(String(password || ''), await contentService.get(KEY))) throw new HttpError(401, 'Wrong password')
  return createToken()
}
exports.changePassword = async (current, next) => {
  if (!verifyPassword(String(current || ''), await contentService.get(KEY))) throw new HttpError(403, 'Current password is wrong')
  if (String(next || '').length < 8) throw new HttpError(400, 'New password must be at least 8 characters')
  await contentService.set(KEY, hashPassword(String(next)))
}

const router = require('express').Router()
const wrap = require('../utils/asyncHandler')
const auth = require('../middleware/auth')
const limiter = require('../middleware/loginLimiter')
const rateLimit = require('../middleware/rateLimit')
const content = require('../controllers/content.controller')
const authCtrl = require('../controllers/auth.controller')
const messages = require('../controllers/message.controller')
const upload = require('../controllers/upload.controller')
const testimonials = require('../controllers/testimonial.controller')

router.use(rateLimit.general)

// Public
router.get('/content', wrap(content.getPublic))
router.post('/contact', rateLimit.formSubmission, wrap(messages.create))
router.post('/testimonials', rateLimit.formSubmission, wrap(testimonials.submit))
router.post('/login', limiter.check, wrap(authCtrl.login))

// Admin (requires token)
router.use('/admin', auth)
router.put('/admin/content/:key', wrap(content.save))
router.post('/admin/password', wrap(authCtrl.changePassword))
router.post('/admin/upload', wrap(upload.image))
router.get('/admin/messages', wrap(messages.list))
router.delete('/admin/messages/:id', wrap(messages.remove))
router.get('/admin/testimonial-submissions', wrap(testimonials.list))
router.post('/admin/testimonial-submissions/:id/approve', wrap(testimonials.approve))
router.delete('/admin/testimonial-submissions/:id', wrap(testimonials.reject))

module.exports = router

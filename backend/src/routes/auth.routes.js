const router = require('express').Router();
const { register, login, getProfile } = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { validateRegistration, validateLogin } = require('../middleware/validation.middleware');
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.get('/me', authenticateToken, getProfile);
module.exports = router;
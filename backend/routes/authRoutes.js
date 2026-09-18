const express = require('express');
const AuthController = require('../controllers/AuthController');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();
router.post('/login', AuthController.login);
router.get('/me', requireAuth, AuthController.me);
router.post('/logout', requireAuth, AuthController.logout);
module.exports = router;

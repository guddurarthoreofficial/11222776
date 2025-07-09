const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/evaluation-service/register', authController.register);
router.post('/evaluation-service/auth', authController.authenticate);

module.exports = router;

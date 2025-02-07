const express = require('express');
const { discordLogin, discordCallback } = require('../controllers/authController');
const router = express.Router();

router.get('/discord', discordLogin);
router.get('/discord/callback', discordCallback);

module.exports = router;

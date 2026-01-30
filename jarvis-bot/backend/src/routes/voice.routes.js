const express = require('express');
const router = express.Router();
const voiceController = require('../controllers/voice.controller');

router.post('/tts', voiceController.textToSpeech);

module.exports = router;

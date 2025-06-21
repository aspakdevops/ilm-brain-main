const express = require('express');
const router = express.Router();
const learningController = require('../controllers/learningController');

// Chat endpoint
router.post('/chat', learningController.sendMessage);

// Script generation endpoint
router.post('/generate-script', learningController.generateScript);

module.exports = router; 
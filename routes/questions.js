const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/questionsController');

// Evaluate an answer
router.post('/evaluate-answer', questionsController.evaluateAnswer);

// Get 3 sample questions for a subtopic
router.post('/sample-questions', questionsController.getSampleQuestions);

module.exports = router; 
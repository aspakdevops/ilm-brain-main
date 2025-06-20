const express = require('express');
const router = express.Router();
const contentFetchController = require('../controllers/contentFetchController');

// Get all topics for a subject
router.get('/topics', contentFetchController.getTopicsFromFile);

// Get subtopics for a specific topic in a subject
router.get('/topics/:topicId', contentFetchController.getSubtopicsFromFile);

// Get goals for a specific subtopic in a topic
router.get('/topics/:topicId/subtopics/:subtopicId/goals', contentFetchController.getGoalsForSubtopic);

// Additional routes using the content service

// Get content statistics for a subject
router.get('/stats', contentFetchController.getContentStats);

// Get questions for a specific subtopic
router.get('/subtopics/:subtopicId/questions', contentFetchController.getQuestionsForSubtopic);

// Get a specific goal by ID
router.get('/goals/:goalId', contentFetchController.getGoalById);

module.exports = router; 
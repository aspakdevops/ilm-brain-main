const express = require('express');
const router = express.Router();

// Import route modules
const learningRoutes = require('./learning');
const userProgressRoutes = require('./user-progress');
const contentFetchRoutes = require('./content-fetch');
const questionsRoutes = require('./questions');

// Mount routes
router.use('/learning', learningRoutes);
router.use('/user-progress', userProgressRoutes);
router.use('/content', contentFetchRoutes);
router.use('/questions', questionsRoutes);

// Direct API endpoints used by frontend
router.use('/next-content', learningRoutes);
router.use('/submit-answer', learningRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router; 
const express = require('express');
const UserProgressController = require('../controllers/userProgressController');

const router = express.Router();
const progressController = new UserProgressController();

/**
 * User Progress Routes
 * All routes are prefixed with /api/user-progress
 */

// Health check endpoint
router.get('/health', (req, res) => {
    progressController.healthCheck(req, res);
});

// Get current user progress
router.get('/', (req, res) => {
    progressController.getUserProgress(req, res);
});

// Update user progress (complete a goal)
router.put('/goal/:goalId', (req, res) => {
    progressController.updateUserProgress(req, res);
});

// Reset progress to beginning (for testing)
router.post('/reset', (req, res) => {
    progressController.resetUserProgress(req, res);
});

module.exports = router; 
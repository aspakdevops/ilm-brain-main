const learningService = require('../services/learningService');

/**
 * Learning Controller - Handles all learning-related endpoints
 * Includes chat and script generation functionality
 */
class LearningController {
    
    // Chat endpoint handler
    async sendMessage(req, res) {
        try {
            const { question, content, sub_topic } = req.body;

            // Validate all required fields
            if (!question) {
                return res.status(400).json({
                    status: 'error',
                    message: 'question is required'
                });
            }

            if (!content) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Content is required'
                });
            }

            if (!sub_topic) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Sub_topic is required'
                });
            }

            // All fields are required
            const result = await learningService.askQuestion(
                question,     // question (required)
                content,     // content (required)
                sub_topic    // sub_topic (required)
            );

            if (result.success) {
                res.status(200).json({
                    status: 'success',
                    message: 'Answer generated successfully',
                    data: {
                        answer: result.answer
                    }
                });
            } else {
                res.status(500).json({
                    status: 'error',
                    message: result.error
                });
            }
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // Script generation endpoint handler
    async generateScript(req, res) {
        try {
            const { content, level, goals } = req.body;

            // Validate all required fields
            if (!content) {
                return res.status(400).json({
                    status: 'error',
                    message: 'content is required'
                });
            }

            if (!level) {
                return res.status(400).json({
                    status: 'error',
                    message: 'level is required'
                });
            }

            if (!goals) {
                return res.status(400).json({
                    status: 'error',
                    message: 'goals is required'
                });
            }

            // All fields are required
            const result = await learningService.generateScript(
                content,     // context (required)
                level,       // level (required)
                goals        // goals (required)
            );

            if (result.success) {
                res.status(200).json({
                    status: 'success',
                    message: 'Script generated successfully',
                    data: {
                        script: result.script
                    }
                });
            } else {
                res.status(500).json({
                    status: 'error',
                    message: result.error
                });
            }
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    // TODO: Add other learning controller methods here
    // Examples:
    // - async getNextContent(req, res) {}
    // - async submitAnswer(req, res) {}
    // - async getUserProgress(req, res) {}
    // - async startLearningSession(req, res) {}
    // - async completeLearningGoal(req, res) {}
}

module.exports = new LearningController(); 
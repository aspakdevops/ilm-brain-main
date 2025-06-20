/**
 * Content Fetch Controller - Refactored to use ContentService
 * 
 * This controller has been refactored to use the centralized ContentService
 * instead of handling file operations and business logic directly.
 * 
 * All content fetching logic is now handled by services/contentService.js
 * which provides:
 * - Centralized data loading and caching
 * - Consistent error handling
 * - Reusable business logic
 * - Better separation of concerns
 */

const contentService = require('../services/contentService');

exports.getTopicsFromFile = async (req, res) => {
    try {
        const subject = req.query.subject || 'physics';
        
        const result = await contentService.getTopics(subject);
        res.json(result);
    } catch (error) {
        console.error("Error fetching topics:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Internal Server Error" 
        });
    }
};

exports.getSubtopicsFromFile = async (req, res) => {
    try {
        const subject = req.query.subject || 'physics';
        const topicId = req.params.topicId;

        const result = await contentService.getSubtopics(topicId, subject);
        res.json(result);
    } catch (error) {
        console.error("Error fetching subtopics:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Internal Server Error" 
        });
    }
};

exports.getGoalsForSubtopic = async (req, res) => {
    try {
        const subject = req.query.subject || 'physics';
        const topicId = req.params.topicId;
        const subtopicId = req.params.subtopicId;

        const result = await contentService.getGoals(topicId, subtopicId, subject);
        res.json(result);
    } catch (error) {
        console.error("Error fetching goals:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Internal Server Error" 
        });
    }
};

// Additional controller methods using the content service

exports.getContentStats = async (req, res) => {
    try {
        const subject = req.query.subject || 'physics';
        
        const result = await contentService.getContentStats(subject);
        res.json(result);
    } catch (error) {
        console.error("Error fetching content stats:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Internal Server Error" 
        });
    }
};

exports.getQuestionsForSubtopic = async (req, res) => {
    try {
        const subtopicId = req.params.subtopicId;
        
        const result = await contentService.getQuestions(subtopicId);
        res.json(result);
    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message || "Internal Server Error" 
        });
    }
};

/**
 * Get specific goal by ID with full context
 * 
 * @route GET /api/content/goals/:goalId
 * @param {string} goalId - The unique goal identifier
 * @query {string} subject - Subject name (default: 'physics')
 * 
 * @returns {Object} Response object containing:
 *   - success: boolean
 *   - data: {
 *       subject: { name },
 *       topic: { id, title },
 *       subtopic: { id, name },
 *       goal: { id, order, description, content }
 *     }
 * 
 * @example
 * GET /api/content/goals/44?subject=physics
 * 
 * @throws {400} Invalid goal ID
 * @throws {404} Goal not found or subject not found
 * @throws {500} Server error
 */
exports.getGoalById = async (req, res) => {
    try {
        const goalId = req.params.goalId;
        const subject = req.query.subject || 'physics';

        // Validate goalId parameter
        if (!goalId || isNaN(goalId)) {
            return res.status(400).json({
                success: false,
                message: `Invalid goal ID: ${goalId}. Goal ID must be a number.`
            });
        }

        // Call content service
        const result = await contentService.getGoalById(goalId, subject);
        
        // Transform response format to match API specification
        const transformedResponse = {
            success: true,
            data: {
                subject: {
                    name: result.context.subject
                },
                topic: {
                    id: result.context.topic.id,
                    title: result.context.topic.title
                },
                subtopic: {
                    id: result.context.subtopic.id,
                    name: result.context.subtopic.name
                },
                goal: {
                    id: result.goal.id,
                    order: result.goal.order,
                    description: result.goal.description,
                    content: result.goal.content
                }
            }
        };

        res.json(transformedResponse);
    } catch (error) {
        console.error("Error fetching goal by ID:", error);
        
        // Handle specific error types
        if (error.message.includes('not found')) {
            res.status(404).json({ 
                success: false, 
                message: error.message 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: "Internal Server Error",
                error: error.message 
            });
        }
    }
};
const questionsService = require('../services/questionsService');
const contentService = require('../services/contentService');

/**
 * Questions Controller - Handles all question-related endpoints
 */
class QuestionsController {
    
    // TODO: Add question endpoint handlers here
    // Examples:
    // - async getQuestionsBySubtopic(req, res) {}
    // - async searchQuestions(req, res) {}
    // - async getRandomQuestion(req, res) {}
    // - async getQuestionById(req, res) {}

    // Answer evaluation endpoint handler
    async evaluateAnswer(req, res) {
        try {
            const { question, student_answer } = req.body;

            if (!question) {
                return res.status(400).json({
                    status: 'error',
                    message: 'question is required'
                });
            }

            if (!student_answer) {
                return res.status(400).json({
                    status: 'error',
                    message: 'student_answer is required'
                });
            }

            const result = await questionsService.evaluateAnswer(
                question,
                student_answer
            );

            if (result.success) {
                res.status(200).json({
                    status: 'success',
                    message: 'Answer evaluated successfully',
                    data: result.evaluation
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

    // Get sample questions for a subtopic
    async getSampleQuestions(req, res) {
        try {
            const { subject, topic, subtopic } = req.body;

            if (!subject || !topic || !subtopic) {
                return res.status(400).json({
                    status: 'error',
                    message: "Subject, topic, and subtopic names are required."
                });
            }

            // 1. Get the subtopic ID from the content service
            const idResult = await contentService.getSubtopicIdByNames(subject, topic, subtopic);
            
            // 2. Get the full question objects from the questions service
            const fullQuestions = await questionsService.getSampleQuestionsBySubtopicId(idResult.subtopicId);

            // 3. Extract just the question text for the response
            const questionTexts = fullQuestions.map(q => q.question_text);

            res.json({
                status: 'success',
                data: {
                    questions: questionTexts
                }
            });

        } catch (error) {
            console.error("Error fetching sample questions:", error);
            res.status(error.message.includes('not found') ? 404 : 500).json({ 
                status: 'error', 
                message: error.message || "Internal Server Error" 
            });
        }
    }
}

module.exports = new QuestionsController(); 
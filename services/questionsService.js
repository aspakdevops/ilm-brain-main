const axios = require('axios');
const config = require('../config/environment');
const fs = require('fs').promises;
const path = require('path');

/**
 * Questions Service - Question management and processing
 * 
 * This service will handle:
 * - Question retrieval and filtering
 * - Question search and selection
 * - Question data processing
 * - Question analytics
 */

class QuestionsService {
    constructor() {
        console.log('❓ Questions Service initialized');
        this.questionsData = null;
        this.loadQuestionsData();
    }

    /**
     * Load questions data file into memory
     */
    async loadQuestionsData() {
        try {
            const questionsPath = path.join(__dirname, '..', 'sample_data', 'questions.json');
            const questionsContent = await fs.readFile(questionsPath, 'utf8');
            this.questionsData = JSON.parse(questionsContent);
            console.log('❓ Questions data loaded successfully');
        } catch (error) {
            console.error('❌ Error loading questions data:', error);
        }
    }

    _validateDataLoaded() {
        if (!this.questionsData) {
            throw new Error('Questions service data is not ready. Please try again later.');
        }
    }

    /**
     * Get 3 sample questions for a specific subtopic ID
     */
    async getSampleQuestionsBySubtopicId(subtopicId) {
        this._validateDataLoaded();
        const matchingQuestions = this.questionsData.questions.filter(q =>
            q.subtopic_id === subtopicId
        );
        return matchingQuestions.slice(0, 3);
    }

    // TODO: Add question handling methods here
    // Examples:
    // - async getQuestionsBySubtopic(subtopicId) {}
    // - async searchQuestions(keywords) {}
    // - async getRandomQuestion(subtopicId) {}
    // - async getQuestionById(questionId) {}
    // - async filterQuestionsByType(questionType) {}

    // Answer evaluation functionality
    async evaluateAnswer(question, studentAnswer) {
        try {
            console.log('📊 Calling external answer evaluation API:', {
                endpoint: `${config.EVALUATE_ANS_API_URL}`,
                question: question ? question.substring(0, 100) + '...' : 'empty',
                student_answer: studentAnswer ? studentAnswer.substring(0, 100) + '...' : 'empty'
            });

            const response = await axios.post(`${config.EVALUATE_ANS_API_URL}`, {
                question: question,           // string (required)
                student_answer: studentAnswer // string (required)
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 20000 // 10 second timeout
            });

            console.log('✅ External API response received:', {
                status: response.status,
                is_correct: response.data.is_correct,
                score: response.data.score
            });

            return {
                success: true,
                evaluation: response.data
            };
        } catch (error) {
            console.error('❌ External API error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });

            return {
                success: false,
                error: error.response?.data?.error || error.message || 'Answer evaluation service unavailable'
            };
        }
    }
}

// Export singleton instance
module.exports = new QuestionsService(); 
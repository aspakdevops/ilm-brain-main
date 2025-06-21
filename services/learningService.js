/**
 * Learning Service - Learning management and orchestration
 * 
 
 */

const axios = require('axios');
const config = require('../config/environment');

class LearningService {
    constructor() {
        console.log('📚 Learning Service initialized');
        console.log('🔍 DEBUG - All config:', config);
        console.log('🔍 DEBUG - SCRIPT_GEN_API_URL:', config.SCRIPT_GEN_API_URL);
        console.log('🔍 DEBUG - EVALUATE_ANS_API_URL:', config.EVALUATE_ANS_API_URL);
    }

    // Chat functionality - matches external API: POST http://127.0.0.1:5000/ilm-chatbot
    async askQuestion(question, content, subTopic) {
        try {
            console.log('🤖 Calling external chatbot API:', {
                endpoint: `${config.CHATBOT_API_URL}`,
                question: question,
                content: content ? content.substring(0, 100) + '...' : 'empty',
                sub_topic: subTopic || 'empty'
            });

            const response = await axios.post(`${config.CHATBOT_API_URL}`, {
                question: question,     // string (required)
                content: content,       // string (optional)
                sub_topic: subTopic     // string (optional)
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 30000 // 30 second timeout
            });

            console.log('✅ External API response received:', {
                status: response.status,
                hasAnswer: !!response.data.answer
            });

            return {
                success: true,
                answer: response.data.answer  // External API returns: {"answer": "<p>content...</p>"}
            };
        } catch (error) {
            console.error('❌ External API error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });

            return {
                success: false,
                error: error.response?.data?.error || error.message || 'Chatbot service unavailable'
            };
        }
    }

    // Script generation functionality - matches external API: POST https://ilm-main-pipeline.onrender.com/generate-script
    async generateScript(content, level, goals) {
        try {
            console.log('📝 Calling external script generation API:', {
                endpoint: `${config.SCRIPT_GEN_API_URL}`,
                content: content ? content.substring(0, 100) + '...' : 'empty',
                level: level || 'empty',
                goals: goals ? goals.substring(0, 100) + '...' : 'empty'
            });

            const response = await axios.post(`${config.SCRIPT_GEN_API_URL}`, {
                context: content,       // External API expects "context" field
                level: level,           // string (required)
                goals: goals            // string (required)
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 20000 // 5 second timeout
            });

            console.log('✅ External API response received:', {
                status: response.status,
                hasScript: !!response.data.script
            });

            return {
                success: true,
                script: response.data.script  // External API returns: {"script": "generated script content"}
            };
        } catch (error) {
            console.error('External API error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });

            return {
                success: false,
                error: error.response?.data?.error || error.message || 'Script generation service unavailable'
            };
        }
    }

}

// Export singleton instance
module.exports = new LearningService(); 
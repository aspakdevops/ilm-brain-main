require('dotenv').config();

module.exports = {
    CHATBOT_API_URL: process.env.CHATBOT_API_URL,
    SCRIPT_GEN_API_URL: process.env.SCRIPT_GEN_API_URL,
    EVALUATE_ANS_API_URL: process.env.EVALUATE_ANS_API_URL
}; 
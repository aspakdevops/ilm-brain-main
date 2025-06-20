const API_BASE_URL = '/api';

const apiClient = {
    async get(endpoint) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }
        return response.json();
    },

    async post(endpoint, data) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }
        return response.json();
    },

    async put(endpoint, data) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }
        return response.json();
    },

    // Learning API endpoints
    async getNextContent() {
        return this.post('/next-content');
    },

    async submitAnswer(answer) {
        return this.post('/submit-answer', { answer });
    },

    // Chat API endpoints
    async sendChatMessage(message) {
        return this.post('/chat', { message });
    },

    // User Progress API endpoints  
    async getUserProgress() {
        return this.get('/user-progress');
    },

    async updateUserProgress(goalId) {
        return this.put(`/user-progress/goal/${goalId}`);
    },

    async resetProgress() {
        return this.post('/user-progress/reset');
    },

    // Content API endpoints
    async getTopics() {
        return this.get('/content/topics');
    }
};

window.apiClient = apiClient; 
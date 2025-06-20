// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🤖 Chatbot script loaded');
    
    const chatInput = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.btn-chat');
    const chatMessages = document.querySelector('.chat-messages');
    const closeButton = document.querySelector('.close-btn');
    const rightPanel = document.querySelector('.right-panel');
    const openAssistantBtn = document.getElementById('openAssistantBtn');

    // Close button functionality
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            rightPanel.classList.add('hidden');
            // Show the open button when panel is closed
            if (openAssistantBtn) {
                openAssistantBtn.classList.remove('hidden');
            }
        });
    }

    // Open button functionality
    if (openAssistantBtn) {
        openAssistantBtn.addEventListener('click', () => {
            rightPanel.classList.remove('hidden');
            // Hide the open button when panel is shown
            openAssistantBtn.classList.add('hidden');
        });
    }

    if (sendButton && chatInput) {
        sendButton.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addMessage(message, 'user');
        chatInput.value = '';

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error('Failed to get response from AI');
            }

            const data = await response.json();
            addMessage(data.response, 'bot');
        } catch (error) {
            addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        }
    }

    function addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}-message`;
        
        const messageCard = document.createElement('div');
        messageCard.className = 'message-card';
        messageCard.textContent = content;
        
        messageDiv.appendChild(messageCard);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Set initial state - show open button if panel is hidden
    if (rightPanel && rightPanel.classList.contains('hidden')) {
        if (openAssistantBtn) {
            openAssistantBtn.classList.remove('hidden');
        }
    }
}); 
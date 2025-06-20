const utils = {
    // DOM manipulation helpers
    createElement(tag, className, text) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text) element.textContent = text;
        return element;
    },

    // State management
    setLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },

    getLocalStorage(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },

    // UI helpers
    showLoading(element) {
        if (element) {
            element.classList.add('loading');
            element.disabled = true;
        }
    },

    hideLoading(element) {
        if (element) {
            element.classList.remove('loading');
            element.disabled = false;
        }
    },

    showError(message, container = document.body) {
        const errorDiv = this.createElement('div', 'error-state');
        errorDiv.innerHTML = `
            <h3>Error</h3>
            <p>${message}</p>
        `;
        container.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
    },

    // Animation helpers
    fadeIn(element, duration = 300) {
        element.style.opacity = 0;
        element.style.display = 'block';
        
        let start = null;
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            element.style.opacity = Math.min(progress / duration, 1);
            
            if (progress < duration) {
                window.requestAnimationFrame(animate);
            }
        }
        window.requestAnimationFrame(animate);
    },

    fadeOut(element, duration = 300) {
        let start = null;
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            element.style.opacity = 1 - Math.min(progress / duration, 1);
            
            if (progress < duration) {
                window.requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        }
        window.requestAnimationFrame(animate);
    },

    // Validation helpers
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    isValidPassword(password) {
        return password.length >= 8;
    },

    // Format helpers
    formatDate(date) {
        return new Date(date).toLocaleDateString();
    },

    formatTime(date) {
        return new Date(date).toLocaleTimeString();
    },

    // Math helpers
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    // String helpers
    truncate(str, length = 100) {
        if (str.length <= length) return str;
        return str.slice(0, length) + '...';
    }
}; 
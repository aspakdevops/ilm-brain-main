window.userProgress = null;

async function loadUserProgress() {
    try {
        console.log('📊 Loading user progress...');
        const res = await fetch('/api/user-progress/');
        const data = await res.json();

        if (data.status === "success") {
            window.userProgress = data.data;
            console.log('✅ User progress loaded:', window.userProgress);
            
            // Update all progress displays
            displayGlobalProgress();
            if (typeof updateProgressOverview === 'function') {
                updateProgressOverview();
            }
            if (typeof updateContinueLearning === 'function') {
                updateContinueLearning();
            }
            
            return window.userProgress;
        } else {
            console.warn("❌ Progress load failed:", data.message);
            return null;
        }
    } catch (err) {
        console.error("❌ Progress fetch error:", err);
        return null;
    }
}

function displayGlobalProgress() {
    const el = document.getElementById("globalProgress");
    if (!el || !window.userProgress) return;

    const percentage = window.userProgress.overall_progress?.progress_percentage || 0;
    el.textContent = `${percentage}% Complete`;
    el.className = 'progress-badge';
    
    // Add color coding based on progress
    if (percentage >= 80) {
        el.style.color = '#28a745'; // Green for high progress
    } else if (percentage >= 50) {
        el.style.color = '#ffc107'; // Yellow for medium progress
    } else {
        el.style.color = '#dc3545'; // Red for low progress
    }
}

// Initialize progress on page load
window.addEventListener('DOMContentLoaded', async () => {
    await loadUserProgress();
}); 
// Global developer mode flag
const isDeveloperMode = new URLSearchParams(window.location.search).has('dev');

document.addEventListener('DOMContentLoaded', async () => {
    console.log('📚 Subtopics page loaded');
    
    // Check for developer mode
    if (isDeveloperMode) {
        console.log('🔧 Developer mode activated - All subtopics unlocked');
        // Add visual indicator
        document.body.style.border = '5px solid orange';
        document.title = '🔧 DEV MODE - ' + document.title;
    }
    
    // Load chapter data and update content
    await loadAndUpdateSubtopicsData();
    
    // Initialize animations
    initializeAnimations();
    
    // Add event listeners
    setupEventListeners();
});

// Load chapter data and update page content
async function loadAndUpdateSubtopicsData() {
    if (!window.dataService) return;
    
    try {
        console.log('📊 Loading chapter data for subtopics page...');
        const chapterData = await window.dataService.loadChapterData();
        
        if (!chapterData?.subjects?.[0]?.topics?.[0]) {
            console.error('❌ Failed to load chapter data');
            return;
        }
        
        // Update page content with real data
        updateSubtopicsPageContent();
        
        // Update continue learning section if we have user progress
        if (window.dataService.userProgress) {
            updateContinueLearningSection();
        }
        
    } catch (error) {
        console.error('❌ Error loading chapter data:', error);
    }
}

// Update subtopics page content with real data
function updateSubtopicsPageContent() {
    const chapterInfo = window.dataService.getChapterInfo();
    const subtopics = window.dataService.getSubtopics();
    const overallProgress = window.dataService.getOverallProgress();
    
    if (!chapterInfo || !subtopics.length) return;
    
    // Update topic header
    updateTopicHeader(chapterInfo, overallProgress);
    
    // Update subtopics grid with real data
    updateSubtopicsGrid(subtopics);
    
    console.log('✅ Subtopics page updated with real data');
}

// Update topic header section
function updateTopicHeader(chapterInfo, progress) {
    // Update topic title
    const topicTitleElement = document.querySelector('.topic-header h1');
    if (topicTitleElement) {
        topicTitleElement.textContent = chapterInfo.title;
    }
    
    // Update topic description
    const topicDescElement = document.querySelector('.topic-header p');
    if (topicDescElement) {
        topicDescElement.textContent = chapterInfo.description;
    }
    
    // Update overall progress
    const overallProgressElement = document.querySelector('.overall-progress .progress-percentage');
    if (overallProgressElement) {
        overallProgressElement.textContent = `${progress.percentage}% Complete`;
    }
    
    // Update progress bar
    const progressBar = document.querySelector('.overall-progress .progress-bar');
    if (progressBar) {
        progressBar.style.width = `${progress.percentage}%`;
    }

    // Update breadcrumb
    const breadcrumbCurrent = document.querySelector('.breadcrumb-current');
    if (breadcrumbCurrent) {
        breadcrumbCurrent.textContent = chapterInfo.title;
    }
}

// Update subtopics grid with real data
function updateSubtopicsGrid(subtopics) {
    const subtopicsGrid = document.querySelector('.subtopics-grid');
    if (!subtopicsGrid) return;
    
    // Clear existing content
    subtopicsGrid.innerHTML = '';
    
    // Sort subtopics by order
    const sortedSubtopics = [...subtopics].sort((a, b) => a.order - b.order);
    
    // Get user progress data
    const userProgress = window.dataService.userProgress;
    const completedGoals = userProgress?.courses?.physics?.topics['1']?.completed_goals || [];
    const currentGoal = userProgress?.courses?.physics?.topics['1']?.current_goal || 1;
    
    // Generate subtopic cards from real data
    sortedSubtopics.forEach((subtopic, index) => {
        // Calculate progress for this subtopic
        const subtopicGoals = subtopic.goals.map(g => g.id);
        const completedInSubtopic = completedGoals.filter(goalId => subtopicGoals.includes(goalId));
        const completedCount = completedInSubtopic.length;
        const totalGoals = subtopicGoals.length;
        const percentage = Math.round((completedCount / totalGoals) * 100);
        
        // Determine status
        let status;
        if (completedCount === totalGoals && totalGoals > 0) {
            status = 'completed';
        } else if (subtopicGoals.includes(currentGoal) || completedCount > 0) {
            status = 'current';
        } else {
            status = 'pending';
        }
        
        // Add progress info to subtopic
        const subtopicWithProgress = {
            ...subtopic,
            progress: {
                completed: completedCount,
                total: totalGoals,
                percentage,
                status
            },
            goalCount: totalGoals
        };
        
        const subtopicCard = createSubtopicCard(subtopicWithProgress, index);
        subtopicsGrid.appendChild(subtopicCard);
    });

    // Add click event listeners to cards
    setupSubtopicInteractions();
    
    // Add hover effects
    addCardHoverEffects();
    
    // Animate progress bars
    animateProgressBars();
    
    // Highlight current subtopic
    highlightCurrentSubtopic();
}

// Create a subtopic card element
function createSubtopicCard(subtopic, index) {
    const card = document.createElement('div');
    card.className = `subtopic-card ${subtopic.progress.status}`;
    card.setAttribute('data-subtopic-id', subtopic.id);
    
    // Determine status icon and text
    let statusIcon, statusText, statusClass;
    switch (subtopic.progress.status) {
        case 'completed':
            statusIcon = '✅';
            statusText = 'Completed';
            statusClass = 'completed';
            break;
        case 'current':
            statusIcon = '▶️';
            statusText = 'Current';
            statusClass = 'current';
            break;
        case 'in-progress':
            statusIcon = '🔄';
            statusText = 'In Progress';
            statusClass = 'in-progress';
            break;
        default:
            statusIcon = '⭕';
            statusText = 'Pending';
            statusClass = 'pending';
    }
    
    card.innerHTML = `
        <div class="subtopic-card-header">
            <span class="subtopic-number">${subtopic.order}</span>
            <span class="subtopic-status ${statusClass}">
                <span class="status-icon">${statusIcon}</span>
                <span class="status-text">${statusText}</span>
            </span>
        </div>
        
        <h3 class="subtopic-title">${subtopic.name}</h3>
        
        <div class="subtopic-meta">
            <span class="goal-count">🎯 ${subtopic.goalCount} goals</span>
        </div>
        
        <div class="subtopic-progress">
            <div class="progress-text">${subtopic.progress.completed}/${subtopic.progress.total} completed</div>
            <div class="progress-bar">
                <div class="progress-bar-fill" style="width: ${subtopic.progress.percentage}%"></div>
            </div>
            <div class="progress-percentage">${subtopic.progress.percentage}%</div>
        </div>
        
        <button class="subtopic-button testing-enabled" 
                data-subtopic-id="${subtopic.id}">
            ${subtopic.progress.status === 'completed' ? '📖 Review' : 
              subtopic.progress.status === 'current' ? '▶️ Continue' : 
              '🔧 Test Access'}
        </button>
    `;
    
    return card;
}

// Initialize page animations
function initializeAnimations() {
    // Animate topic header
    const topicHeader = document.querySelector('.topic-header');
    if (topicHeader) {
        topicHeader.style.opacity = '0';
        topicHeader.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            topicHeader.style.transition = 'all 0.6s ease';
            topicHeader.style.opacity = '1';
            topicHeader.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Animate breadcrumbs
    const breadcrumbs = document.querySelector('.breadcrumbs');
    if (breadcrumbs) {
        breadcrumbs.style.opacity = '0';
        breadcrumbs.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            breadcrumbs.style.transition = 'all 0.4s ease';
            breadcrumbs.style.opacity = '1';
            breadcrumbs.style.transform = 'translateY(0)';
        }, 50);
    }
    
    // Animate subtopic cards with staggered delay
    const subtopicCards = document.querySelectorAll('.subtopic-card');
    subtopicCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });
}

// Setup event listeners
function setupEventListeners() {
    // Back to topics button
    const backButton = document.querySelector('.back-to-topics');
    if (backButton) {
        backButton.addEventListener('click', () => {
            utils.showLoading(backButton);
            window.location.href = '/topics';
        });
    }
    
    // Breadcrumb navigation
    const breadcrumbLinks = document.querySelectorAll('.breadcrumb-link');
    breadcrumbLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href) {
                utils.showLoading(link);
                window.location.href = href;
            }
        });
    });
    
    // Subtopic card clicks and button clicks
    setupSubtopicInteractions();
    
    // Add hover effects
    addCardHoverEffects();
}

// TESTING: Setup subtopic card interactions - all subtopics accessible
function setupSubtopicInteractions() {
    const subtopicCards = document.querySelectorAll('.subtopic-card');
    
    subtopicCards.forEach(card => {
        const button = card.querySelector('.subtopic-button');
        const subtopicId = card.getAttribute('data-subtopic-id');
        
        // TESTING: All buttons are clickable
        if (button) {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const urlParams = new URLSearchParams(window.location.search);
                const topicId = urlParams.get('topic') || '1';
                const subject = urlParams.get('subject') || 'physics';
                
                console.log(`🔧 TESTING: Accessing subtopic ${subtopicId}`);
                window.location.href = `/learning?topic=${topicId}&subtopic=${subtopicId}&subject=${subject}`;
            });
        }
        
        // TESTING: All cards are clickable
        card.addEventListener('click', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const topicId = urlParams.get('topic') || '1';
            const subject = urlParams.get('subject') || 'physics';
            
            console.log(`🔧 TESTING: Card click - accessing subtopic ${subtopicId}`);
            window.location.href = `/learning?topic=${topicId}&subtopic=${subtopicId}&subject=${subject}`;
        });
    });
}

// Show locked message for pending subtopics
function showLockedMessage(card) {
    // Remove any existing locked messages
    const existingMessage = document.querySelector('.locked-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create and show locked message
    const message = document.createElement('div');
    message.className = 'locked-message';
    message.innerHTML = `
        <div class="locked-content">
            <span class="locked-icon">🔒</span>
            <p>Complete previous subtopics to unlock this content</p>
        </div>
    `;
    
    // Position message near the card
    const cardRect = card.getBoundingClientRect();
    message.style.position = 'fixed';
    message.style.top = `${cardRect.top + cardRect.height / 2}px`;
    message.style.left = `${cardRect.left + cardRect.width / 2}px`;
    message.style.transform = 'translate(-50%, -50%)';
    message.style.zIndex = '1000';
    
    document.body.appendChild(message);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.style.opacity = '0';
            setTimeout(() => message.remove(), 300);
        }
    }, 3000);
    
    // Add click to dismiss
    message.addEventListener('click', () => {
        message.style.opacity = '0';
        setTimeout(() => message.remove(), 300);
    });
}

// Add hover effects to cards
function addCardHoverEffects() {
    document.addEventListener('mouseover', (e) => {
        const card = e.target.closest('.subtopic-card');
        if (card) {
            const isLocked = card.classList.contains('pending') && !isDeveloperMode;
            if (!isLocked) {
                card.style.transform = 'translateY(-5px)';
            }
        }
    });

    document.addEventListener('mouseout', (e) => {
        const card = e.target.closest('.subtopic-card');
        if (card) {
            card.style.transform = 'translateY(0)';
        }
    });
}

// Animate progress bars on page load
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar, .subtopic-progress-fill');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 300);
    });
}

// Update progress display based on completion status
function updateProgressDisplay() {
    const completedCards = document.querySelectorAll('.subtopic-card.completed');
    const totalCards = document.querySelectorAll('.subtopic-card').length;
    const overallProgress = Math.round((completedCards.length / totalCards) * 100);
    
    // Update overall progress
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-percentage');
    
    if (progressBar && progressText) {
        progressBar.style.width = `${overallProgress}%`;
        progressText.textContent = `${overallProgress}% Complete`;
    }
}

// Highlight current subtopic
function highlightCurrentSubtopic() {
    const currentCard = document.querySelector('.subtopic-card.current');
    if (currentCard) {
        // Add pulsing effect to current card
        currentCard.style.animation = 'pulse 2s infinite';
    }
}

// Add CSS for locked message and pulse animation
const style = document.createElement('style');
style.textContent = `
    .locked-message {
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        opacity: 0;
        transition: all 0.3s ease;
        pointer-events: none;
    }
    
    .locked-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        white-space: nowrap;
    }
    
    .locked-icon {
        font-size: 1.2rem;
    }
    
    .locked-content p {
        margin: 0;
        font-size: 0.9rem;
    }
    
    @keyframes pulse {
        0%, 100% { 
            box-shadow: 0 6px 20px rgba(0, 123, 255, 0.2);
        }
        50% { 
            box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
        }
    }
`;
document.head.appendChild(style);

// Initialize all functions
animateProgressBars();
updateProgressDisplay();
highlightCurrentSubtopic();

// Update continue learning section with real data
function updateContinueLearningSection() {
    const currentLearning = window.dataService.getCurrentLearningStatus();
    const continueSection = document.querySelector('.continue-learning-section');
    
    if (!continueSection) {
        console.log('❌ Continue learning section not found in DOM');
        return;
    }
    
    if (!currentLearning) {
        // Hide the section if no current learning data
        continueSection.style.display = 'none';
        return;
    }
    
    // Show and update the section
    continueSection.style.display = 'block';
    
    // Update the content
    const content = `
        <div class="continue-learning-content">
            <h2>Continue Where You Left Off</h2>
            <p>Resume your learning with "${currentLearning.subtopicName}"</p>
            <p>
                <a href="/topics/energy" class="topic-link">Energy</a>
                <span class="topic-separator">—</span>
                ${currentLearning.subtopicName}
            </p>
            <p class="goal-count">Goal ${currentLearning.goalId} of 4</p>
            <button class="continue-learning-button">Continue Learning</button>
        </div>
    `;
    
    continueSection.innerHTML = content;
    
    // Add click handler for the continue button
    const continueButton = continueSection.querySelector('.continue-learning-button');
    if (continueButton) {
        continueButton.addEventListener('click', () => {
            const currentSession = window.dataService.userProgress?.current_session;
            if (currentSession) {
                utils.showLoading(continueButton);
                window.location.href = `/learning?subtopic=${currentSession.subtopic_id}&goal=${currentSession.goal_id}`;
            }
        });
    }
    
    // Add animation
    const contentDiv = continueSection.querySelector('.continue-learning-content');
    if (contentDiv) {
        contentDiv.style.opacity = '0';
        contentDiv.style.transform = 'translateY(20px)';
        setTimeout(() => {
            contentDiv.style.transition = 'all 0.6s ease';
            contentDiv.style.opacity = '1';
            contentDiv.style.transform = 'translateY(0)';
        }, 300);
    }
}

// Helper to get topic and subject from URL
function getTopicAndSubjectFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const topicId = urlParams.get('topic');
    const subject = urlParams.get('subject') || 'physics';
    return { topicId, subject };
}

// Fetch subtopics using the new API endpoint
async function fetchSubtopics() {
    const { topicId, subject } = getTopicAndSubjectFromURL();
    if (!topicId) throw new Error('No topic specified in URL');
    const response = await fetch(`/api/content/topics/${topicId}/subtopics?subject=${subject}`);
    if (!response.ok) throw new Error('Failed to fetch subtopics');
    return await response.json();
}

// Navigation to learning page
function goToLearning(subtopicId) {
    const { topicId, subject } = getTopicAndSubjectFromURL();
    window.location.href = `/learning?topic=${topicId}&subtopic=${subtopicId}&subject=${subject}`;
} 
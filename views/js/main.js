// Theme Toggle
document.addEventListener('DOMContentLoaded', async () => {
    // Load chapter data first
    await loadAndUpdateChapterData();
    
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            themeToggle.textContent = isDark ? '☀️' : '🌙';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.textContent = '☀️';
        }
    }

    // Learning path card functionality
    const learningPathCards = document.querySelectorAll('.learning-path-card');
    learningPathCards.forEach(card => {
        card.addEventListener('click', () => {
            const chapterId = card.getAttribute('data-chapter-id');
            if (chapterId === 'physics') {
                utils.showLoading(card);
                window.location.href = `/topics?subject=physics`;
            }
        });
    });

    // Test if showTopicsView function is accessible
    console.log('🔍 Testing showTopicsView function:', typeof window.showTopicsView);
    console.log('🔍 Testing showTopicsView function directly:', typeof showTopicsView);
});

// Function to load and update chapter data on homepage
async function loadAndUpdateChapterData() {
    if (!window.dataService) return;
    
    try {
        console.log('📊 Loading chapter data...');
        await window.dataService.loadChapterData();
        
        // Update the Physics card with real data
        updatePhysicsCard();
        
    } catch (error) {
        console.error('❌ Error loading chapter data:', error);
    }
}

// Update the Physics card with real chapter data
function updatePhysicsCard() {
    const chapterInfo = window.dataService.getChapterInfo();
    if (!chapterInfo) return;
    
            // Update goals count - find all stat elements and check labels
        const statElements = document.querySelectorAll('.stat');
        statElements.forEach(stat => {
            const label = stat.querySelector('.stat-label');
            const number = stat.querySelector('.stat-number');
            
            if (label && number) {
                if (label.textContent.toLowerCase().includes('goal')) {
                    number.textContent = chapterInfo.totalGoals;
                }
            }
        });
    
    // Update description with actual chapter description
    const descriptionElement = document.querySelector('.learning-path-card p');
    if (descriptionElement) {
        descriptionElement.textContent = chapterInfo.description + '. Perfect for GCSE Physics preparation.';
    }
    
    console.log('✅ Physics card updated with real data:', chapterInfo);
}

// Show the expandable topics view
function showTopicsView() {
    console.log('🚀 showTopicsView() called!'); // Debug log
    
    try {
        const topicsView = document.getElementById('topicsExpandedView');
        const learningPathsSection = document.querySelector('.learning-paths-section');
        
        console.log('📍 Elements found:', { 
            topicsView: !!topicsView, 
            learningPathsSection: !!learningPathsSection,
            topicsViewElement: topicsView,
            learningPathsElement: learningPathsSection
        }); // Debug log
        
        if (topicsView && learningPathsSection) {
            console.log('✅ Both elements found, proceeding with view change...'); // Debug log
            
            // Hide the main learning paths section
            console.log('🔄 Hiding learning paths section...');
            learningPathsSection.style.display = 'none';
            
            // Show the topics expanded view
            console.log('🔄 Showing topics expanded view...');
            topicsView.style.display = 'block';
            
            console.log('🔄 Loading topics data...');
            // Load and display topics
            loadTopicsInExpandedView();
            
            // Scroll to the topics view
            console.log('🔄 Scrolling to topics view...');
            setTimeout(() => {
                topicsView.scrollIntoView({ behavior: 'smooth', block: 'start' });
                console.log('✅ Scroll initiated');
            }, 100);
            
            console.log('✅ View switch completed successfully!');
        } else {
            console.error('❌ Missing elements:', { 
                topicsView: !!topicsView, 
                learningPathsSection: !!learningPathsSection,
                'topicsView element': topicsView,
                'learningPathsSection element': learningPathsSection
            });
            
            // Try to find elements with different selectors
            console.log('🔍 Trying alternative selectors...');
            const altTopicsView = document.querySelector('#topicsExpandedView');
            const altLearningPaths = document.querySelector('main.learning-paths-section');
            console.log('🔍 Alternative elements:', {
                altTopicsView: !!altTopicsView,
                altLearningPaths: !!altLearningPaths
            });
        }
    } catch (error) {
        console.error('💥 Error in showTopicsView:', error);
        alert('Error: ' + error.message);
    }
}

// Hide the expandable topics view and return to main view
function hideTopicsView() {
    const topicsView = document.getElementById('topicsExpandedView');
    const learningPathsSection = document.querySelector('.learning-paths-section');
    
    if (topicsView && learningPathsSection) {
        // Hide the topics expanded view
        topicsView.style.display = 'none';
        
        // Show the main learning paths section
        learningPathsSection.style.display = 'block';
        
        // Scroll back to the main view
        learningPathsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Make functions globally accessible
window.showTopicsView = showTopicsView;
window.hideTopicsView = hideTopicsView;

// Load topics in the expanded view
async function loadTopicsInExpandedView() {
    console.log('📊 loadTopicsInExpandedView() called'); // Debug log
    
    if (!window.dataService) {
        console.error('❌ dataService not available!');
        // Show a fallback message
        const topicsGrid = document.getElementById('topicsExpandableGrid');
        if (topicsGrid) {
            topicsGrid.innerHTML = `
                <div style="text-align: center; padding: 2rem; background: white; border-radius: 12px;">
                    <h3>Loading...</h3>
                    <p>Please wait while we load your learning data.</p>
                </div>
            `;
        }
        return;
    }
    
    try {
        // Ensure data is loaded first
        await window.dataService.loadChapterData();
        
        const chapterInfo = window.dataService.getChapterInfo();
        const subtopics = window.dataService.getSubtopics();
        const overallProgress = window.dataService.getOverallProgress();
        const currentSubtopic = window.dataService.getCurrentSubtopic();
        
        console.log('📋 Data loaded:', { chapterInfo, subtopics: subtopics?.length, overallProgress });
        
        if (!chapterInfo) {
            console.error('❌ No chapter info available!');
            // Show a fallback message
            const topicsGrid = document.getElementById('topicsExpandableGrid');
            if (topicsGrid) {
                topicsGrid.innerHTML = `
                    <div style="text-align: center; padding: 2rem; background: white; border-radius: 12px;">
                        <h3>⚛️ Physics Course</h3>
                        <p>Your physics learning journey is ready to begin!</p>
                        <p>Click the button below to start with the first topic.</p>
                        <button onclick="window.location.href='/topics'" style="background: var(--primary-color); color: white; padding: 1rem 2rem; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                            Start Learning
                        </button>
                    </div>
                `;
            }
            return;
        }
        
        // Create the expandable topic card
        createExpandableTopicCard(chapterInfo, subtopics, overallProgress);
        
        // Show continue learning section if there's a current subtopic
        if (currentSubtopic) {
            showContinueLearningSection(currentSubtopic);
        }
        
        console.log('✅ Topics loaded successfully in expanded view');
        
    } catch (error) {
        console.error('❌ Error loading topics in expanded view:', error);
        // Show error message
        const topicsGrid = document.getElementById('topicsExpandableGrid');
        if (topicsGrid) {
            topicsGrid.innerHTML = `
                <div style="text-align: center; padding: 2rem; background: white; border-radius: 12px; border: 2px solid #dc2626;">
                    <h3 style="color: #dc2626;">⚠️ Error Loading Data</h3>
                    <p>There was an issue loading your learning data.</p>
                    <button onclick="window.location.reload()" style="background: #dc2626; color: white; padding: 1rem 2rem; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                        Refresh Page
                    </button>
                </div>
            `;
        }
    }
}

// Create an expandable topic card
function createExpandableTopicCard(chapterInfo, subtopics, overallProgress) {
    const topicsGrid = document.getElementById('topicsExpandableGrid');
    if (!topicsGrid) return;
    
    // Clear existing content
    topicsGrid.innerHTML = '';
    
    // Create the expandable topic card
    const topicCard = document.createElement('div');
    topicCard.className = 'expandable-topic-card';
    topicCard.setAttribute('data-topic-id', chapterInfo.id);
    
    // Create header
    const header = document.createElement('div');
    header.className = 'topic-card-header';
    header.onclick = () => toggleTopicExpansion(topicCard);
    
    header.innerHTML = `
        <div class="topic-header-left">
            <span class="topic-icon">⚛️</span>
            <div class="topic-info">
                <h3>${chapterInfo.title}</h3>
                <div class="topic-meta">
                    <span>📖 ${chapterInfo.totalSubtopics} subtopics</span>
                    <span>🎯 ${chapterInfo.totalGoals} goals</span>
                    <span>📊 ${overallProgress.percentage}% complete</span>
                </div>
            </div>
        </div>
        <span class="topic-expand-icon">▼</span>
    `;
    
    // Create subtopics content
    const subtopicsContent = document.createElement('div');
    subtopicsContent.className = 'subtopics-content';
    
    const subtopicsGrid = document.createElement('div');
    subtopicsGrid.className = 'subtopics-grid';
    
    // Add subtopic cards
    subtopics.forEach(subtopic => {
        const progress = window.dataService.getSubtopicProgress(subtopic.id);
        const subtopicCard = createExpandableSubtopicCard(subtopic, progress);
        subtopicsGrid.appendChild(subtopicCard);
    });
    
    subtopicsContent.appendChild(subtopicsGrid);
    
    // Assemble the card
    topicCard.appendChild(header);
    topicCard.appendChild(subtopicsContent);
    
    topicsGrid.appendChild(topicCard);
}

// Create an expandable subtopic card
function createExpandableSubtopicCard(subtopic, progress) {
    const card = document.createElement('div');
    card.className = `expandable-subtopic-card ${progress.status}`;
    card.setAttribute('data-subtopic-id', subtopic.id);
    
    // Determine status icon and text
    let statusIcon, statusText;
    switch (progress.status) {
        case 'completed':
            statusIcon = '✅';
            statusText = 'Completed';
            break;
        case 'current':
            statusIcon = '▶️';
            statusText = 'Current';
            break;
        default:
            statusIcon = '⭕';
            statusText = 'Pending';
    }
    
    card.innerHTML = `
        <div class="subtopic-card-header">
            <span class="subtopic-number">${subtopic.order}</span>
            <span class="subtopic-status ${progress.status}">
                <span class="status-icon">${statusIcon}</span>
                <span class="status-text">${statusText}</span>
            </span>
        </div>
        
        <h3 class="subtopic-title">${subtopic.name}</h3>
        
        <div class="subtopic-progress-info">
            <span>${progress.completed}/${progress.total} goals completed</span>
            <span>${progress.percentage}%</span>
        </div>
        
        <div class="subtopic-progress-bar">
            <div class="subtopic-progress-fill" style="width: ${progress.percentage}%"></div>
        </div>
    `;
    
    // Add click handler
    if (progress.status !== 'pending') {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            utils.showLoading(card);
            window.location.href = `/learning?subtopic=${subtopic.id}`;
        });
    } else {
        card.addEventListener('click', () => {
            showLockedMessage(card);
        });
    }
    
    return card;
}

// Toggle topic expansion
function toggleTopicExpansion(topicCard) {
    const isExpanded = topicCard.classList.contains('expanded');
    
    if (isExpanded) {
        topicCard.classList.remove('expanded');
    } else {
        // Collapse other expanded topics first
        const allTopicCards = document.querySelectorAll('.expandable-topic-card');
        allTopicCards.forEach(card => card.classList.remove('expanded'));
        
        // Expand this topic
        topicCard.classList.add('expanded');
        
        // Smooth scroll to show the expanded content
        setTimeout(() => {
            const subtopicsContent = topicCard.querySelector('.subtopics-content');
            if (subtopicsContent) {
                subtopicsContent.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }
        }, 300);
    }
}

// Show continue learning section
function showContinueLearningSection(currentSubtopic) {
    const continueLearningSection = document.getElementById('continueLearningBottom');
    if (!continueLearningSection) return;
    
    continueLearningSection.style.display = 'block';
    
    // Add click handler to continue learning button
    const continueBtn = document.getElementById('continueMainLearningBtn');
    if (continueBtn) {
        continueBtn.onclick = () => {
            utils.showLoading(continueBtn);
            window.location.href = `/learning?subtopic=${currentSubtopic.id}`;
        };
    }
}

// Show locked message for pending subtopics
function showLockedMessage(card) {
    // Remove any existing locked messages
    const existingMessage = document.querySelector('.locked-message-expandable');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create and show locked message
    const message = document.createElement('div');
    message.className = 'locked-message-expandable';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        z-index: 1000;
        text-align: center;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
        animation: fadeInUp 0.3s ease;
    `;
    
    message.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <span style="font-size: 1.5rem;">🔒</span>
            <strong>Content Locked</strong>
        </div>
        <p style="margin: 0; opacity: 0.9;">Complete previous subtopics to unlock this content</p>
    `;
    
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
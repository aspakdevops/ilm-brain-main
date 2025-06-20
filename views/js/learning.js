/**
 * GOAL CONTEXT MANAGEMENT SYSTEM
 * 
 * This system maintains the current goal's details in a persistent context
 * that gets updated whenever a goal is clicked or loaded.
 * 
 * Features:
 * - Stores goal ID, order, description, content, and context info
 * - Updates automatically when goals are clicked (via API or local data)
 * - Provides global access via window.GOAL_CONTEXT
 * - Triggers 'goalContextChanged' events for other components
 * - Shows visual context display in bottom-right corner
 * - Used by completion/navigation functions for accurate tracking
 * 
 * Usage:
 * - GOAL_CONTEXT.getGoal() - Get current goal data
 * - GOAL_CONTEXT.hasGoal() - Check if context has a goal
 * - GOAL_CONTEXT.clear() - Clear the context
 * 
 * Auto-updates when:
 * - User clicks any goal in the goals list
 * - Goal content is loaded via API
 * - Goal is rendered from local data
 */

// Goal Context Management - Stores current goal details
let GOAL_CONTEXT = {
    currentGoal: null,
    isLoaded: false,
    
    // Save goal details to context
    setGoal: (goalData) => {
        GOAL_CONTEXT.currentGoal = {
            id: goalData.goal.id,
            order: goalData.goal.order,
            description: goalData.goal.description,
            content: goalData.goal.content,
            subject: goalData.subject,
            topic: goalData.topic,
            subtopic: goalData.subtopic,
            loadedAt: new Date().toISOString()
        };
        GOAL_CONTEXT.isLoaded = true;
        
        console.log('💾 Goal context updated:', GOAL_CONTEXT.currentGoal);
        
        // Trigger custom event for other components
        window.dispatchEvent(new CustomEvent('goalContextChanged', {
            detail: GOAL_CONTEXT.currentGoal
        }));
    },
    
    // Get current goal from context
    getGoal: () => {
        return GOAL_CONTEXT.currentGoal;
    },
    
    // Clear context
    clear: () => {
        GOAL_CONTEXT.currentGoal = null;
        GOAL_CONTEXT.isLoaded = false;
        console.log('🗑️ Goal context cleared');
    },
    
    // Check if context has a goal loaded
    hasGoal: () => {
        return GOAL_CONTEXT.isLoaded && GOAL_CONTEXT.currentGoal !== null;
    }
};

// TESTING: Enhanced console logging for debugging
const TESTING_LOG = {
    goalClick: (goalId, goalDescription) => {
        console.group(`🎯 TESTING: Goal ${goalId} Clicked`);
        console.log('Goal Description:', goalDescription);
        console.log('Timestamp:', new Date().toISOString());
        console.log('Current URL:', window.location.href);
        console.log('Context Updated:', GOAL_CONTEXT.hasGoal() ? 'Yes' : 'No');
        console.groupEnd();
    },
    
    apiCall: (endpoint, purpose) => {
        console.log(`🔗 TESTING API: ${endpoint} (${purpose})`);
        console.log(`📅 Timestamp: ${new Date().toISOString()}`);
        console.log(`🔄 Context will be updated with fresh API data`);
    },
    
    progressUpdate: (oldProgress, newProgress) => {
        console.group('📊 TESTING: Progress Update');
        console.log('Old Progress:', oldProgress);
        console.log('New Progress:', newProgress);
        console.groupEnd();
    },
    
    contextChange: (goalData) => {
        console.group('💾 CONTEXT: Goal Context Updated');
        console.log('Goal ID:', goalData.id);
        console.log('Goal Order:', goalData.order);
        console.log('Goal Description:', goalData.description);
        console.log('Content Length:', goalData.content ? goalData.content.length : 0);
        console.log('Subject:', goalData.subject?.name);
        console.log('Topic:', goalData.topic?.title);
        console.log('Subtopic:', goalData.subtopic?.name);
        console.groupEnd();
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    // TESTING MODE: Add visual indicators
    console.log('🔧 TESTING MODE ACTIVATED: All goals are clickable');
    document.title = '🔧 TESTING - ' + document.title;
    
    // Add testing badge to page
    const testingBadge = document.createElement('div');
    testingBadge.innerHTML = '🔧 TESTING MODE - All Goals Unlocked';
    testingBadge.style.cssText = `
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: #ffc107;
        color: #001f3f;
        padding: 8px 15px;
        border-radius: 20px;
        font-weight: bold;
        z-index: 9999;
        font-size: 0.9rem;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(testingBadge);
    
    // Goal context event listener for debugging and UI updates
    window.addEventListener('goalContextChanged', (event) => {
        console.log('🔄 Goal context changed event fired:', event.detail);
        updateContextDisplay(event.detail);
    });
    
    // Function to update context display in UI with drag functionality
    function updateContextDisplay(goalData) {
        let contextDisplay = document.getElementById('goal-context-display');
        
        if (!contextDisplay) {
            // Create context display element
            contextDisplay = document.createElement('div');
            contextDisplay.id = 'goal-context-display';
            contextDisplay.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(0, 31, 63, 0.95);
                color: white;
                padding: 10px 15px;
                border-radius: 15px;
                font-size: 0.8rem;
                z-index: 9998;
                border: 2px solid #28a745;
                min-width: 200px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                cursor: move;
                user-select: none;
                transition: box-shadow 0.2s ease;
            `;
            document.body.appendChild(contextDisplay);
            
            // Make the context display draggable
            makeDraggable(contextDisplay);
        }
        
        // Update context display content
        contextDisplay.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px; color: #28a745; cursor: move; display: flex; justify-content: space-between; align-items: center;">
                <span>📋 Current Goal Context</span>
                <span style="font-size: 0.8rem; opacity: 0.7;">⋮⋮</span>
            </div>
            <div><strong>ID:</strong> ${goalData.id}</div>
            <div><strong>Order:</strong> ${goalData.order}</div>
            <div><strong>Description:</strong> ${goalData.description.substring(0, 50)}${goalData.description.length > 50 ? '...' : ''}</div>
            <div style="margin-top: 8px; color: #ffc107; font-size: 0.7rem;">
                <strong>Context:</strong> ${goalData.subject?.name} → ${goalData.topic?.title}
            </div>
        `;
    }

    // Make element draggable with mouse
    function makeDraggable(element) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            // Get current position
            const rect = element.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            
            // Add dragging class and visual feedback
            element.classList.add('dragging');
            element.style.cursor = 'grabbing';
            element.style.boxShadow = '0 8px 25px rgba(0,0,0,0.5)';
            element.style.transform = 'scale(1.02)';
            element.style.zIndex = '10000'; // Bring to front
            
            // Prevent text selection
            e.preventDefault();
            
            console.log('🖱️ Started dragging goal context display');
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            // Calculate new position
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            let newLeft = startLeft + deltaX;
            let newTop = startTop + deltaY;
            
            // Keep within viewport bounds
            const maxLeft = window.innerWidth - element.offsetWidth;
            const maxTop = window.innerHeight - element.offsetHeight;
            
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));
            
            // Update position
            element.style.left = newLeft + 'px';
            element.style.top = newTop + 'px';
            element.style.right = 'auto';
            element.style.bottom = 'auto';
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                
                // Remove dragging class and reset visual feedback
                element.classList.remove('dragging');
                element.style.cursor = 'move';
                element.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
                element.style.transform = 'scale(1)';
                element.style.zIndex = '9998'; // Reset z-index
                
                console.log('🖱️ Finished dragging goal context display');
                
                // Save position to localStorage for persistence
                const rect = element.getBoundingClientRect();
                localStorage.setItem('goalContextPosition', JSON.stringify({
                    left: rect.left,
                    top: rect.top
                }));
                
                console.log('💾 Goal context position saved:', { left: rect.left, top: rect.top });
            }
        });
        
        // Restore saved position if available
        const savedPosition = localStorage.getItem('goalContextPosition');
        if (savedPosition) {
            try {
                const position = JSON.parse(savedPosition);
                element.style.left = position.left + 'px';
                element.style.top = position.top + 'px';
                element.style.right = 'auto';
                element.style.bottom = 'auto';
                console.log('📍 Restored goal context position:', position);
            } catch (e) {
                console.log('⚠️ Could not restore goal context position');
            }
        }
    }
    
    // Make goal context globally accessible for debugging
    window.GOAL_CONTEXT = GOAL_CONTEXT;
    console.log('🔧 Goal context made globally accessible as window.GOAL_CONTEXT');
    
    // Parse topic, subtopic, and subject from URL
    const urlParams = new URLSearchParams(window.location.search);
    const topicId = urlParams.get('topic');
    const subtopicId = urlParams.get('subtopic');
    const subject = urlParams.get('subject') || 'physics';

    let userProgress = null;
    let goalsData = null;
    let currentGoal = null;

    // Initialize the learning page
    try {
        console.log(`🚀 Initializing learning page for topic:${topicId}, subtopic:${subtopicId}, subject:${subject}`);

        // 1. Fetch user progress first
        console.log('📊 Fetching user progress...');
        const progressResponse = await fetch('/api/user-progress/');
        if (!progressResponse.ok) throw new Error('Failed to fetch user progress');
        const progressData = await progressResponse.json();
        
        if (progressData.status === 'success') {
            userProgress = progressData.data;
            console.log('✅ User progress loaded:', userProgress);
        } else {
            throw new Error('Invalid progress response');
        }

        // 2. Fetch goals for this specific subtopic
    if (topicId && subtopicId) {
            console.log('📖 Fetching goals for subtopic...');
            const goalsResponse = await fetch(`/api/content/topics/${topicId}/subtopics/${subtopicId}/goals?subject=${subject}`);
            if (!goalsResponse.ok) throw new Error('Failed to fetch goals');
            goalsData = await goalsResponse.json();
            console.log('✅ Goals data loaded:', goalsData);
        }

        // 3. Determine current goal based on progress and subtopic
        if (userProgress && goalsData) {
            const completedGoals = userProgress.courses?.physics?.topics?.['1']?.completed_goals || [];
            const userCurrentGoal = userProgress.courses?.physics?.topics?.['1']?.current_goal || 1;
            
            // Find goals in this subtopic
            const subtopicGoals = goalsData.success ? goalsData.subject.topic.subtopic.goals : [];
            const subtopicGoalIds = subtopicGoals.map(g => g.id);
            
            // Determine which goal to start with in this subtopic
            if (subtopicGoalIds.includes(userCurrentGoal)) {
                // User's current goal is in this subtopic
                currentGoal = userCurrentGoal;
                console.log(`🎯 Starting with user's current goal: ${currentGoal}`);
            } else {
                // Find first incomplete goal in this subtopic
                const incompleteGoal = subtopicGoalIds.find(goalId => !completedGoals.includes(goalId));
                currentGoal = incompleteGoal || subtopicGoalIds[0];
                console.log(`🎯 Starting with first incomplete goal in subtopic: ${currentGoal}`);
            }
        }

        // 4. Initialize the learning interface
        initializeLearningInterface();
        
    } catch (error) {
        console.error('❌ Error initializing learning page:', error);
        showError('Failed to load learning content. Please try again.');
    }

    function initializeLearningInterface() {
        console.log('🔧 Initializing learning interface...');
        
        // Update chapter progress display with real data
        updateChapterProgressDisplay();
        
        // Update page content with API data
        updatePageContentFromAPI();
        
        // Render the current goal content using API
        if (currentGoal) {
            console.log('📝 Loading initial goal via API:', currentGoal);
            loadGoalContentFromAPI(currentGoal);
        }
        
        // Attach event listeners
        attachButtonListeners();
    }

    function updatePageContentFromAPI() {
        if (!goalsData || !goalsData.success) return;
        
        const apiData = goalsData.subject;
        console.log('🔄 Updating page content from API:', apiData);
        
        // Update topic title (replaces "Introduction to AI") - using correct selectors
        const topicTitleInHeader = document.querySelector('.learning-header h1');
        const topicTitleInPanel = document.querySelector('.chapter-info h2');
        const topicTitle = apiData.topic.title || 'Topic';
        
        if (topicTitleInHeader) {
            topicTitleInHeader.textContent = topicTitle;
            console.log(`📝 Updated header topic title to: ${topicTitle}`);
        }
        if (topicTitleInPanel) {
            topicTitleInPanel.textContent = topicTitle;
            console.log(`📝 Updated panel topic title to: ${topicTitle}`);
        }
        
        // Update subtopic description (replaces "Learn the basics of artificial intelligence")
        const subtopicDescElement = document.querySelector('.chapter-info h3');
        const subtopicName = apiData.topic.subtopic.title || 'Subtopic';
        const subtopicDescription = `Learn about ${subtopicName.toLowerCase()}`;
        
        if (subtopicDescElement) {
            subtopicDescElement.textContent = subtopicDescription;
            console.log(`📝 Updated subtopic description to: ${subtopicDescription}`);
        }
        
        // Update learning goals list
        updateLearningGoalsList(apiData.topic.subtopic.goals);
        
        // Update progress display
        updateProgressDisplay();
        
        // Update main content area with current goal
        updateMainContent(apiData.topic.subtopic.goals);
    }

    function updateLearningGoalsList(goals) {
        const goalsContainer = document.querySelector('.goals-list');
        if (!goalsContainer || !goals) {
            console.error('❌ Goals container not found or no goals data');
            return;
        }
        
        console.log('📝 Updating learning goals list with', goals.length, 'goals');
        
        // Clear existing goals
        goalsContainer.innerHTML = '';
        
        // Get user's completed goals to show status
        const completedGoals = userProgress?.courses?.physics?.topics?.['1']?.completed_goals || [];
        const userCurrentGoal = userProgress?.courses?.physics?.topics?.['1']?.current_goal || 1;
        
        // TESTING: Generate goal items with all goals clickable
        goals.forEach((goal, index) => {
            const isCompleted = completedGoals.includes(goal.id);
            const isCurrent = goal.id === userCurrentGoal;
            
            // TESTING: Make all goals appear as current/accessible
            let statusIcon, statusClass;
            if (isCompleted) {
                statusIcon = '✓';
                statusClass = 'completed';
            } else if (isCurrent) {
                statusIcon = '▶';
                statusClass = 'current';
            } else {
                // CHANGE: Make pending goals appear clickable
                statusIcon = '→';  // Changed from '○' to arrow
                statusClass = 'testing-accessible';  // New class instead of 'pending'
            }
            
            const goalElement = document.createElement('div');
            goalElement.className = `goal-item ${statusClass}`;
            goalElement.innerHTML = `
                <div class="goal-card">
                    <div class="goal-status">${statusIcon}</div>
                    <div class="goal-text">${goal.description}</div>
                    <div class="testing-indicator">${statusClass === 'testing-accessible' ? '🔧' : ''}</div>
                </div>
            `;
            
            // TESTING: Add goal ID as data attribute for easier selection
            goalElement.setAttribute('data-goal-id', goal.id);
            
            // TESTING: Remove access restrictions - all goals clickable
            goalElement.addEventListener('click', () => {
                jumpToGoal(goal);  // Remove the conditional check
            });
            
            goalsContainer.appendChild(goalElement);
        });
        
        console.log(`✅ Updated learning goals list with ${goals.length} goals`);
    }

    // TESTING: Enhanced goal switching for testing - ALWAYS calls API
    function jumpToGoal(goalData) {
        TESTING_LOG.goalClick(goalData.id, goalData.description);
        console.log(`🎯 TESTING MODE: Jumping to goal ${goalData.id}: ${goalData.description}`);
        console.log(`🔗 FORCE API CALL: Loading goal ${goalData.id} from Goal Details API`);
        
        currentGoal = goalData.id;
        
        // ALWAYS call API for selected goal (ignore local goal data)
        loadGoalContentFromAPI(goalData.id);
        
        // Update URL to reflect current goal
        const url = new URL(window.location);
        url.searchParams.set('goal', goalData.id);
        window.history.pushState({}, '', url);
        
        // TESTING: Update visual state
        updateGoalSelection(goalData.id);
    }

    // TESTING: Enhanced function to load specific goal content from API
    async function loadGoalContentFromAPI(goalId) {
        console.log(`📖 Loading content for goal ${goalId} from Goal Details API`);
        
        // Show loading indicator
        showApiLoadingIndicator(goalId);
        
        try {
            // Call the Goal Details API - ALWAYS fetch fresh data
            TESTING_LOG.apiCall(`/api/content/goals/${goalId}`, 'loading goal details from API');
            const response = await fetch(`/api/content/goals/${goalId}?subject=physics`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                console.log(`✅ Goal content loaded from API:`, data.data);
                console.log(`💾 API Response Data:`, {
                    goalId: data.data.goal.id,
                    goalOrder: data.data.goal.order,
                    description: data.data.goal.description,
                    contentLength: data.data.goal.content ? data.data.goal.content.length : 0,
                    subject: data.data.subject.name,
                    topic: data.data.topic.title,
                    subtopic: data.data.subtopic.name
                });
                
                // 💾 UPDATE GOAL CONTEXT WITH API DATA
                GOAL_CONTEXT.setGoal(data.data);
                TESTING_LOG.contextChange(data.data.goal);
                
                // Update the center panel with full goal content from API
                updateCenterPanelWithGoalContent(data.data);
                hideApiLoadingIndicator();
            } else {
                console.error('❌ API returned error:', data.message);
                showGoalLoadError(data.message || 'Unknown API error');
                hideApiLoadingIndicator();
            }
            
        } catch (error) {
            console.error('❌ Error loading goal content from API:', error);
            showGoalLoadError(`Failed to load goal content: ${error.message}`);
            hideApiLoadingIndicator();
        }
    }

    // Show API loading indicator
    function showApiLoadingIndicator(goalId) {
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;
        
        contentArea.innerHTML = `
            <div class="api-loading">
                <div class="loading-spinner">🔄</div>
                <h3>Loading Goal ${goalId} from API...</h3>
                <p>Fetching fresh goal data and updating context...</p>
                <div class="loading-details">
                    <span class="api-endpoint">GET /api/content/goals/${goalId}</span>
                </div>
            </div>
        `;
        
        console.log(`⏳ API loading indicator shown for goal ${goalId}`);
    }

    // Hide API loading indicator
    function hideApiLoadingIndicator() {
        console.log(`✅ API loading indicator hidden`);
    }

    // Function to update center panel with goal details (context already saved by API function)
    function updateCenterPanelWithGoalContent(goalData) {
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;
        
        // Note: Goal context is already saved by loadGoalContentFromAPI()
        
        contentArea.innerHTML = `
            <div class="goal-content">
                <div class="goal-header">
                    <h3>${goalData.goal.description}</h3>
                    <div class="goal-context">
                        <span class="context-breadcrumb">
                            ${goalData.subject.name} → ${goalData.topic.title} → ${goalData.subtopic.name}
                        </span>
                        <span class="goal-order">Goal ${goalData.goal.order}</span>
                    </div>
                </div>
                <div class="content-card">
                    <div class="goal-content-text">
                        ${goalData.goal.content || goalData.goal.description}
                    </div>
                </div>
                <div class="goal-actions">
                    <button class="btn btn-success complete-goal-btn" onclick="completeCurrentGoal()">
                        Mark as Complete
                    </button>
                    <button class="btn btn-secondary next-goal-btn" onclick="moveToNextGoal()">
                        Next Goal →
                    </button>
                </div>
            </div>
        `;
        
        // Add display info to console for debugging
        console.log('🎯 Goal displayed in UI:', {
            id: goalData.goal.id,
            order: goalData.goal.order,
            description: goalData.goal.description,
            hasContent: !!goalData.goal.content,
            contentSource: 'API'
        });
    }

    // Error handling for goal loading
    function showGoalLoadError(message) {
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;
        
        contentArea.innerHTML = `
            <div class="error-message">
                <div class="error-icon">❌</div>
                <h3>Error Loading Goal</h3>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="window.location.reload()">
                    Try Again
                </button>
            </div>
        `;
    }

    // TESTING: Update visual selection state
    function updateGoalSelection(selectedGoalId) {
        // Remove previous selection highlighting
        document.querySelectorAll('.goal-item').forEach(item => {
            item.classList.remove('selected-for-testing');
        });
        
        // Add highlighting to selected goal
        const selectedGoal = document.querySelector(`[data-goal-id="${selectedGoalId}"]`);
        if (selectedGoal) {
            selectedGoal.classList.add('selected-for-testing');
        }
    }

    function updateChapterProgressDisplay() {
        if (!userProgress) return;
        
        // Get overall progress from user progress data
        const overallProgress = userProgress.overall_progress;
        if (overallProgress) {
            const progressPercentage = overallProgress.progress_percentage || 0;
            const completedGoals = overallProgress.completed_goals || 0;
            const totalGoals = overallProgress.total_goals || 0;
            
            console.log(`📊 Chapter Progress: ${progressPercentage}% (${completedGoals}/${totalGoals} goals)`);
            
            // Update progress bar in header
        const progressBar = document.querySelector('.progress-bar');
        const progressText = document.querySelector('.progress-percentage');
            const chapterProgressText = document.querySelector('.chapter-progress-text');
        
        if (progressBar) {
            progressBar.style.width = `${progressPercentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${progressPercentage}%`;
        }
            
            if (chapterProgressText) {
                chapterProgressText.textContent = `Chapter Progress ${progressPercentage}%`;
            }
            
            // Update any other progress indicators
            const progressElement = document.querySelector('.progress-indicator');
            if (progressElement) {
                progressElement.textContent = `${progressPercentage}% Complete`;
            }
            
            // Update breadcrumb or header info if exists
            const headerProgressElement = document.querySelector('.header-progress');
            if (headerProgressElement) {
                headerProgressElement.textContent = `${progressPercentage}% Complete`;
            }
        }
    }

    // Progress tracking functionality - updated to use real data
    function calculateChapterProgress() {
        if (!userProgress?.overall_progress) return 0;
        return userProgress.overall_progress.progress_percentage || 0;
    }

    function updateProgressDisplay() {
        // Get progress value with proper fallback handling
        let progressValue = 0;
        
        if (userProgress?.overall_progress && !isNaN(userProgress.overall_progress)) {
            progressValue = userProgress.overall_progress;
        } else if (userProgress?.courses?.physics?.topics?.['1']?.progress && !isNaN(userProgress.courses.physics.topics['1'].progress)) {
            progressValue = userProgress.courses.physics.topics['1'].progress;
        }
        
        const progressPercentage = Math.round(progressValue) || 0;
        
        // Update progress text and bar using correct selectors from HTML
        const progressTextElement = document.querySelector('.progress-percentage');
        const progressBarElement = document.querySelector('.progress-bar');
        
        if (progressTextElement) {
            progressTextElement.textContent = `${progressPercentage}%`;
            console.log(`📊 Updated progress text to: ${progressPercentage}%`);
        }
        
        if (progressBarElement) {
            progressBarElement.style.width = `${progressPercentage}%`;
            console.log(`📊 Updated progress bar to: ${progressPercentage}%`);
        }
    }

    function renderGoalContent(goalData) {
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;
        
        // 💾 SAVE GOAL TO CONTEXT - Transform data to match API format
        const contextGoalData = {
            goal: {
                id: goalData.id,
                order: goalData.order,
                description: goalData.description,
                content: goalData.content
            },
            subject: goalsData?.subject ? { name: goalsData.subject.name } : { name: 'Physics' },
            topic: goalsData?.subject?.topic ? { 
                id: goalsData.subject.topic.id,
                title: goalsData.subject.topic.title 
            } : { id: 1, title: 'Topic' },
            subtopic: goalsData?.subject?.topic?.subtopic ? {
                id: goalsData.subject.topic.subtopic.id,
                name: goalsData.subject.topic.subtopic.title
            } : { id: 1, name: 'Subtopic' }
        };
        
        GOAL_CONTEXT.setGoal(contextGoalData);
        TESTING_LOG.contextChange(contextGoalData.goal);
        
        contentArea.innerHTML = `
            <div class="goal-content">
                <div class="goal-header">
                    <h3>Goal ${goalData.order}</h3>
                    <div class="goal-progress">
                        <span class="current-goal">${currentGoal}</span>
                        <span class="progress-text">of ${goalsData.subject.topic.subtopic.goals.length} goals</span>
                    </div>
                </div>
                <div class="content-card">
                    <div class="goal-description">
                        <h4>${goalData.description}</h4>
                    </div>
                    <div class="goal-content-text">
                        ${goalData.content}
                    </div>
                </div>
                <div class="goal-actions">
                    <button class="btn btn-primary complete-goal-btn" onclick="completeCurrentGoal()">
                        Mark as Complete
                    </button>
                    <button class="btn btn-secondary next-goal-btn" onclick="moveToNextGoal()">
                        Next Goal →
                    </button>
                </div>
            </div>
        `;
        
        // Add context info to console for debugging
        console.log('🎯 Goal rendered and saved to context:', {
            id: goalData.id,
            order: goalData.order,
            description: goalData.description,
            hasContent: !!goalData.content
        });
    }

    // Make functions globally accessible
    window.completeCurrentGoal = async function() {
        const contextGoal = GOAL_CONTEXT.getGoal();
        const goalToComplete = contextGoal ? contextGoal.id : currentGoal;
        
        if (!goalToComplete) {
            console.error('❌ No goal to complete - neither context nor currentGoal available');
            return;
        }
        
        try {
            console.log(`✅ Completing goal ${goalToComplete} from context...`, contextGoal ? 'using context' : 'using currentGoal');
            const response = await fetch(`/api/user-progress/goal/${goalToComplete}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) throw new Error('Failed to update progress');
            
            const result = await response.json();
            console.log('✅ Goal completed successfully:', result);
            
            // Update user progress data with the latest from server
            if (result.data && result.data.progress) {
                userProgress = result.data.progress;
                console.log('📊 Updated user progress:', userProgress);
                
                // Log the goal completion with context info
                if (contextGoal) {
                    TESTING_LOG.progressUpdate(
                        { goal: goalToComplete, description: contextGoal.description },
                        result.data.updated_progress
                    );
                }
                
                // Refresh the chapter progress display
                updateChapterProgressDisplay();
            }
            
            // Move to next goal
            moveToNextGoal();
            
        } catch (error) {
            console.error('❌ Error completing goal:', error);
            showError('Failed to save progress. Please try again.');
        }
    };

    window.moveToNextGoal = function() {
        if (!goalsData) return;
        
        const contextGoal = GOAL_CONTEXT.getGoal();
        const currentGoalId = contextGoal ? contextGoal.id : currentGoal;
        
        const subtopicGoals = goalsData.subject.topic.subtopic.goals;
        const currentIndex = subtopicGoals.findIndex(g => g.id === currentGoalId);
        
        console.log(`➡️ Moving from goal ${currentGoalId} (index ${currentIndex}) - context available: ${!!contextGoal}`);
        
        if (currentIndex < subtopicGoals.length - 1) {
            // Move to next goal in same subtopic
            const nextGoal = subtopicGoals[currentIndex + 1];
            currentGoal = nextGoal.id;
            console.log(`➡️ Moving to next goal: ${currentGoal} - "${nextGoal.description}"`);
            loadGoalContentFromAPI(nextGoal.id);  // Use API instead of local data
        } else {
            // Completed all goals in this subtopic
            console.log('🎉 All goals in this subtopic completed!');
            GOAL_CONTEXT.clear(); // Clear context when subtopic is completed
            showCompletionMessage();
        }
    };

    function showCompletionMessage() {
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;
        
        contentArea.innerHTML = `
            <div class="completion-message">
                <div class="completion-icon">🎉</div>
                <h3>Subtopic Completed!</h3>
                <p>You've successfully completed all goals in this subtopic.</p>
                <div class="completion-actions">
                    <button class="btn btn-primary" onclick="goBackToSubtopics()">
                        Back to Subtopics
                    </button>
                    <button class="btn btn-secondary" onclick="goToNextSubtopic()">
                        Next Subtopic →
                    </button>
                </div>
            </div>
        `;
    }

    window.goBackToSubtopics = function() {
        window.location.href = `/subtopics?topic=${topicId}&subject=${subject}`;
    };

    window.goToNextSubtopic = function() {
        // TODO: Determine next subtopic and navigate
        window.location.href = `/subtopics?topic=${topicId}&subject=${subject}`;
    };

    function showError(message) {
        const contentArea = document.querySelector('.content-area');
        if (contentArea) {
            contentArea.innerHTML = `
                <div class="error-message">
                    <div class="error-icon">❌</div>
                    <h3>Error</h3>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="window.location.reload()">
                        Try Again
                    </button>
                </div>
            `;
        }
    }

    const contentArea = document.querySelector('.content-area');
    const nextButton = document.querySelector('.next-button');
    const tryAgainButton = document.querySelector('.try-again-button');
    const submitButton = document.querySelector('.submit-answer');
    const answerInput = document.querySelector('.answer-input textarea');

    // Function to attach event listeners to buttons
    function attachButtonListeners() {
        const newNextButton = document.querySelector('.next-button');
        const newTryAgainButton = document.querySelector('.try-again-button');

        if (newNextButton) {
            newNextButton.addEventListener('click', async () => {
                utils.showLoading(newNextButton);
                try {
                    const response = await fetch('/api/next-content', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error('Failed to load next content');
                    }

                    const data = await response.json();
                    updateContent(data);
                } catch (error) {
                    utils.showError(error.message);
                } finally {
                    utils.hideLoading(newNextButton);
                }
            });
        }

        if (newTryAgainButton) {
            newTryAgainButton.addEventListener('click', () => {
                // Reload the current page to restart the content
                window.location.reload();
            });
        }
    }

    if (nextButton) {
        nextButton.addEventListener('click', async () => {
            utils.showLoading(nextButton);
            try {
                const response = await fetch('/api/next-content', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to load next content');
                }

                const data = await response.json();
                updateContent(data);
            } catch (error) {
                utils.showError(error.message);
            } finally {
                utils.hideLoading(nextButton);
            }
        });
    }

    if (tryAgainButton) {
        tryAgainButton.addEventListener('click', () => {
            // Reload the current page to restart the content
            window.location.reload();
        });
    }

    if (submitButton && answerInput) {
        submitButton.addEventListener('click', async () => {
            const answer = answerInput.value.trim();
            if (!answer) {
                utils.showError('Please enter your answer');
                return;
            }

            utils.showLoading(submitButton);
            try {
                const response = await fetch('/api/submit-answer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ answer })
                });

                if (!response.ok) {
                    throw new Error('Failed to submit answer');
                }

                const data = await response.json();
                handleAnswerResponse(data);
            } catch (error) {
                utils.showError(error.message);
            } finally {
                utils.hideLoading(submitButton);
            }
        });
    }

    function updateContent(data) {
        if (data.question) {
            contentArea.innerHTML = `
                <div class="question-content">
                    <div class="question-header">
                        <h3>Question ${data.question.number}</h3>
                    </div>
                    <div class="content-card">
                        <div class="question-text">
                            ${data.question.text}
                        </div>
                    </div>
                    <div class="answer-input">
                        <textarea placeholder="Type your answer here..."></textarea>
                    </div>
                    <div class="content-actions">
                        <button class="btn-primary submit-answer">Submit Answer</button>
                    </div>
                </div>
            `;
        } else {
            contentArea.innerHTML = `
                <div class="script-content">
                    <div class="content-header">
                        <h3>${data.script.title}</h3>
                    </div>
                    <div class="content-card">
                        <div class="script-text">
                            ${data.script.content}
                        </div>
                    </div>
                    <div class="content-actions">
                        <div class="button-group">
                            <div class="round-button-container">
                                <button class="round-button next-button" id="nextButton">
                                    <span class="button-icon">→</span>
                                </button>
                                <span class="button-label">Next</span>
                            </div>
                            <div class="round-button-container">
                                <button class="round-button try-again-button" id="tryAgainButton">
                                    <span class="button-icon">↻</span>
                                </button>
                                <span class="button-label">Try Again</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Re-attach event listeners to the new buttons
            attachButtonListeners();
        }
    }

    function handleAnswerResponse(data) {
        const feedbackArea = document.createElement('div');
        feedbackArea.className = `feedback-area ${data.correct ? 'success' : 'error'}`;
        feedbackArea.innerHTML = `
            <h4>${data.correct ? 'Correct!' : 'Not quite right'}</h4>
            <p>${data.feedback}</p>
        `;

        const contentActions = document.querySelector('.content-actions');
        contentActions.insertBefore(feedbackArea, contentActions.firstChild);

        if (data.correct) {
            // Mark current goal as completed
            const currentGoal = document.querySelector('.goal-item.current');
            if (currentGoal) {
                updateGoalStatus(currentGoal, 'completed');
            }
            
            // Move to next goal
            const nextGoal = document.querySelector('.goal-item.pending');
            if (nextGoal) {
                updateGoalStatus(nextGoal, 'current');
            }
            
            // Update progress bar
            updateProgressBar();

            submitButton.textContent = 'Continue';
            submitButton.removeEventListener('click', submitAnswer);
            submitButton.addEventListener('click', () => {
                window.location.reload();
            });
        }
    }

    function updateMainContent(goals) {
        if (!goals || goals.length === 0) return;
        
        // Find current goal based on user progress
        const userCurrentGoal = userProgress?.courses?.physics?.topics?.['1']?.current_goal || 1;
        const currentGoal = goals.find(goal => goal.id === userCurrentGoal) || goals[0];
        
        // Update content header
        const contentHeader = document.querySelector('.content-header h3');
        if (contentHeader) {
            contentHeader.textContent = currentGoal.description;
        }
        
        // Update content text
        const contentText = document.querySelector('.script-text');
        if (contentText) {
            contentText.textContent = currentGoal.content;
        }
        
        console.log(`📝 Updated main content with goal: ${currentGoal.description}`);
    }

    // Load goals data for current subtopic
    async function loadGoalsData() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const topicId = urlParams.get('topic') || '1';
            const subtopicId = urlParams.get('subtopic') || '1';
            const subject = urlParams.get('subject') || 'physics';
            
            console.log(`📚 Loading goals for topic ${topicId}, subtopic ${subtopicId}`);
            
            const response = await fetch(`/api/content/topics/${topicId}/subtopics/${subtopicId}/goals?subject=${subject}`);
            const data = await response.json();
            
            if (data.success) {
                const goals = data.subject.topic.subtopic.goals;
                console.log('✅ Goals loaded successfully:', goals);
                updateLearningGoalsList(goals);
                updateMainContent(goals);
            } else {
                console.error('❌ Failed to load goals:', data.message);
            }
        } catch (error) {
            console.error('❌ Error loading goals:', error);
        }
    }

    // Call APIs when page loads
    loadUserProgress();
    loadGoalsData();
    
    // Show 0% progress by default while loading
    updateProgressDisplay();
}); 
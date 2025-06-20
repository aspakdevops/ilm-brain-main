window.addEventListener('DOMContentLoaded', loadTopics);

async function loadTopics() {
    try {
        console.log('📚 Loading topics and progress from API...');
        // Get subject from URL
        const urlParams = new URLSearchParams(window.location.search);
        const subject = urlParams.get('subject') || 'physics';
        
        // Load both content and progress data
        const [contentRes, progressRes] = await Promise.all([
            fetch(`/api/content/topics?subject=${subject}`),
            fetch('/api/user-progress')
        ]);
        
        const contentData = await contentRes.json();
        const progressData = await progressRes.json();

        if (contentData.success && progressData.status === 'success') {
            console.log('✅ Topics and progress loaded successfully');
            console.log('📊 Progress data:', progressData.data);
            
            // Store progress data globally for other functions
            window.userProgress = progressData.data;
            
            // Merge content with progress data for accurate goal counts
            const topicsWithProgress = mergeTopicsWithProgress(contentData.topics, progressData.data);
            
            renderTopics(topicsWithProgress);
            updateProgressOverview();
            updateContinueLearning();
        } else {
            console.error("❌ Failed to load topics or progress");
            showErrorState();
        }
    } catch (err) {
        console.error("❌ Error fetching topics:", err);
        showErrorState();
    }
}

function mergeTopicsWithProgress(topics, progressData) {
    return topics.map(topic => {
        // Get the correct goal count from progress API (not questions count)
        const totalGoals = progressData.overall_progress.total_goals;
        const topicProgress = getTopicProgress(topic.id);
        
        return {
            ...topic,
            goalCount: totalGoals, // Use progress API data instead of question count
            progress: topicProgress
        };
    });
}

function renderTopics(topics) {
    const container = document.getElementById('topicsContainer');
    container.innerHTML = ''; // clear existing content

    if (topics.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No Topics Available</h3>
                <p>No topics are currently available. Please check back later.</p>
            </div>
        `;
        return;
    }

    topics.forEach(topic => {
        const card = document.createElement('div');
        card.className = 'learning-path-card topic-card';
        card.setAttribute('data-topic-id', topic.id);

        // Get real progress for this topic
        const topicProgress = getTopicProgress(topic.id);

        card.innerHTML = `
            <div class="card-header">
                <div class="card-icon">⚡</div>
                <div class="card-badge topic-badge">${topic.subtopicCount} SUBTOPICS</div>
            </div>
            <div class="card-content">
                <h3>${topic.title}</h3>
                <p>${topic.description}</p>
                <div class="card-stats">
                    <div class="stat">
                        <span class="stat-number">${topic.goalCount}</span>
                        <span class="stat-label">GOALS</span>
                    </div>
                </div>
                
                <!-- Progress indicator for this topic -->
                <div class="topic-progress">
                    <div class="topic-progress-bar">
                        <div class="topic-progress-fill" style="width: ${topic.progress.percentage}%"></div>
                    </div>
                    <span class="topic-progress-text">${topic.progress.percentage}% Complete</span>
                </div>
            </div>
            <div class="card-action">
                <button class="start-button topic-button" onclick="goToSubtopics(${topic.id})">
                    <span>View Subtopics</span>
                    <span class="button-arrow">→</span>
                </button>
            </div>
        `;

        container.appendChild(card);
    });

    // Initialize animations after rendering
    initializeAnimations();
}

function getTopicProgress(topicId) {
    if (!window.userProgress) {
        return { percentage: 0, completed: 0, total: 0 };
    }

    // Use overall progress for the Energy topic (topic ID 1)
    if (topicId == 1) {
        const overallProgress = window.userProgress.overall_progress;
        return {
            percentage: overallProgress.progress_percentage || 0,
            completed: overallProgress.completed_goals || 0,
            total: overallProgress.total_goals || 0
        };
    }

    // For other topics (if they exist in the future), use chapter progress
    const topicData = window.userProgress.subject_progress?.physics?.chapter_progress?.[topicId];
    
    if (topicData) {
        return {
            percentage: topicData.progress_percentage || 0,
            completed: topicData.completed_goals || 0,
            total: topicData.total_goals || 0
        };
    }

    return { percentage: 0, completed: 0, total: 0 };
}

function updateProgressOverview() {
    if (!window.userProgress) return;

    const progressOverview = document.querySelector('.progress-overview');
    if (!progressOverview) return;

    const overallProgress = window.userProgress.overall_progress;
    if (!overallProgress) return;

    // Update progress percentage
    const percentageElement = progressOverview.querySelector('.progress-percentage');
    if (percentageElement) {
        percentageElement.textContent = `${overallProgress.progress_percentage}% Complete`;
    }
    
    // Update progress bar
    const progressBar = progressOverview.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = `${overallProgress.progress_percentage}%`;
    }

    // Update progress description
    const descriptionElement = progressOverview.querySelector('.progress-description');
    if (descriptionElement) {
        descriptionElement.textContent = `Continue your learning journey where you left off`;
    }
}

function goToSubtopics(topicId) {
    console.log(`🚀 Navigating to subtopics for topic ${topicId}`);
    const urlParams = new URLSearchParams(window.location.search);
    const subject = urlParams.get('subject') || 'physics'; // Default to physics if not specified
    window.location.href = `/subtopics?topic=${topicId}&subject=${subject}`;
}

function showErrorState() {
    const container = document.getElementById('topicsContainer');
    container.innerHTML = `
        <div class="error-state">
            <h3>Failed to Load Topics</h3>
            <p>There was an error loading the topics. Please try refreshing the page.</p>
            <button onclick="loadTopics()" class="retry-button">Try Again</button>
        </div>
    `;
}

// Initialize page animations
function initializeAnimations() {
    // Animate topic cards with delay
    const topicCards = document.querySelectorAll('.topic-card');
    topicCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });
}

async function updateContinueLearning() {
    try {
        console.log('🔄 Updating continue learning section...');
        
        if (!window.userProgress) {
            console.log('❌ No user progress data available');
            return;
        }

        console.log('📚 Current user progress:', window.userProgress);

        // Extract current learning info from the API response
        const currentLearning = {
            chapterId: window.userProgress.current_session?.chapter_id,
            subtopicId: window.userProgress.current_session?.subtopic_id,
            goalId: window.userProgress.current_session?.goal_id,
            progressInSubtopic: null
        };

        if (!currentLearning.chapterId || !currentLearning.subtopicId) {
            console.log('❌ No current session data available');
            return;
        }

        console.log('📚 Current learning data:', currentLearning);

        // Get chapter progress to show subtopic progress
        const chapterProgress = window.userProgress.subject_progress?.physics?.chapter_progress?.[currentLearning.chapterId];
        if (chapterProgress?.subtopic_progress) {
            currentLearning.progressInSubtopic = chapterProgress.subtopic_progress[currentLearning.subtopicId];
        }

        // Get detailed subtopic information
        if (!window.dataService) {
            console.error('❌ Data service not available');
            return;
        }

        await window.dataService.loadChapterData();
        const subtopicDetails = window.dataService.getSubtopicDetails(
            currentLearning.chapterId,
            currentLearning.subtopicId
        );

        console.log('📖 Subtopic details:', subtopicDetails);

        // Update the continue learning section
        const subtopicText = document.getElementById('continueSubtopicText');
        const topicPath = document.getElementById('continueTopicPath');
        const progressText = document.getElementById('continueProgress');
        const continueButton = document.getElementById('continueButton');

        if (subtopicText && topicPath && progressText && continueButton) {
            if (subtopicDetails) {
                // Update text elements with detailed information
                subtopicText.textContent = `Resume your learning with "${subtopicDetails.subtopicName}"`;
                topicPath.textContent = `${subtopicDetails.chapterTitle} → ${subtopicDetails.subtopicName}`;
            } else {
                // Fallback to basic information
                const chapter = window.userProgress.chapters?.find(c => c.id === currentLearning.chapterId);
                subtopicText.textContent = `Resume your learning with "Subtopic ${currentLearning.subtopicId}"`;
                topicPath.textContent = `${chapter?.title || 'Physics'} → Subtopic ${currentLearning.subtopicId}`;
            }
            
            // Show detailed progress
            if (currentLearning.progressInSubtopic) {
                const progress = currentLearning.progressInSubtopic;
                progressText.textContent = `Goal ${progress.completed_goals + 1} of ${progress.total_goals}`;
            } else {
                progressText.textContent = 'Starting...';
            }

            // Update button click handler
            continueButton.onclick = () => {
                window.location.href = `/learning?topic=${currentLearning.chapterId}&subtopic=${currentLearning.subtopicId}&goal=${currentLearning.goalId}`;
            };

            // Show the section
            const continueSection = document.querySelector('.continue-learning-section');
            if (continueSection) {
                continueSection.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('❌ Error updating continue learning section:', error);
    }
}

// Fetch subtopics for a topic (for preview or other use)
async function fetchSubtopics(topicId, subject) {
    const response = await fetch(`/api/content/topics/${topicId}/subtopics?subject=${subject}`);
    if (!response.ok) {
        throw new Error('Failed to fetch subtopics');
    }
    return await response.json();
} 
// Data Service for managing chapter and subtopic data
class DataService {
    constructor() {
        this.loaded = false;
        this.chapterData = null;
        this.userProgress = null;
    }

    // Load chapter data from JSON file and user progress
    async loadChapterData() {
        if (this.loaded) return this.chapterData;
        
        try {
            // Load both topic structure and user progress
            const [topicsResponse, progressResponse] = await Promise.all([
                fetch('/sample_data/topics.json'),
                fetch('/api/user-progress')
            ]);
            
            if (!topicsResponse.ok) {
                throw new Error(`Failed to load topic data: ${topicsResponse.status}`);
            }
            
            this.chapterData = await topicsResponse.json();
            
            // Load user progress if available
            if (progressResponse.ok) {
                const progressData = await progressResponse.json();
                if (progressData.status === 'success') {
                    this.userProgress = progressData.data;
                    console.log('📊 User progress loaded successfully');
                }
            }
            
            this.loaded = true;
            console.log('📊 Topic data loaded successfully:', this.chapterData);
            return this.chapterData;
        } catch (error) {
            console.error('❌ Error loading topic data:', error);
            // Return fallback data if loading fails
            return this.getFallbackData();
        }
    }

    // Get chapter info
    getChapterInfo() {
        if (!this.chapterData) return null;
        const topic = this.chapterData.subjects[0].topics[0];
        
        // Use total goals from user progress API if available, otherwise calculate from topics
        const totalGoals = this.userProgress?.overall_progress?.total_goals || 
                          topic.subtopics.reduce((sum, s) => sum + s.goals.length, 0);
        
        return {
            id: topic.id,
            title: topic.title,
            description: topic.description,
            totalGoals: totalGoals
        };
    }

    // Get subtopics
    getSubtopics() {
        if (!this.chapterData) return [];
        return this.chapterData.subjects[0].topics[0].subtopics;
    }

    // Get specific subtopic by ID
    getSubtopic(id) {
        if (!this.chapterData?.subjects) {
            console.log('❌ No subtopics data available');
            return null;
        }

        // Convert ID to string for consistent comparison
        const subtopicId = id.toString();
        for (const subject of this.chapterData.subjects) {
            for (const topic of subject.topics) {
                const subtopic = topic.subtopics.find(s => s.id.toString() === subtopicId);
                if (subtopic) return subtopic;
            }
        }
        return null;
    }

    // Get total number of goals across all subtopics
    getTotalGoals() {
        // Prefer user progress API data over calculated data
        return this.userProgress?.overall_progress?.total_goals || 
               this.getChapterInfo()?.totalGoals || 0;
    }

    // Get progress for a specific subtopic
    getSubtopicProgress(subtopicId) {
        const subtopic = this.getSubtopic(subtopicId);
        if (!subtopic) {
            console.log('❌ Subtopic not found:', subtopicId);
            return { 
                completed: 0, 
                total: 0, 
                percentage: 0, 
                status: 'pending' 
            };
        }

        return subtopic.progress;
    }

    // Get overall progress
    getOverallProgress() {
        if (!this.userProgress) {
            return { percentage: 0, completed: 0, total: 0 };
        }

        // Use the overall progress directly from the API response
        const overallProgress = this.userProgress.overall_progress;
        if (overallProgress) {
            return {
                percentage: overallProgress.progress_percentage || 0,
                completed: overallProgress.completed_goals || 0,
                total: overallProgress.total_goals || 0
            };
        }

        // Fallback to manual calculation if overall_progress is not available
        const currentTopic = this.userProgress.courses?.physics?.topics?.[1];
        if (!currentTopic) {
            return { percentage: 0, completed: 0, total: 0 };
        }

        const completed = currentTopic.completed_goals.length;
        const total = this.getTotalGoals();
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { percentage, completed, total };
    }

    // Get current subtopic (the one the user is working on)
    getCurrentSubtopic() {
        const subtopics = this.getSubtopics();
        return subtopics.find(subtopic => subtopic.progress.status === 'current');
    }

    // Get subtopic details by chapter and subtopic ID
    getSubtopicDetails(chapterId, subtopicId) {
        return this.getSubtopic(subtopicId);
    }

    // Get current learning status
    getCurrentLearningStatus() {
        if (!this.userProgress || !this.chapterData) return null;

        const currentSession = this.userProgress.current_session;
        if (!currentSession) return null;

        const subtopic = this.findSubtopicById(currentSession.subtopic_id);
        if (!subtopic) return null;

        return {
            subtopicId: currentSession.subtopic_id,
            subtopicName: subtopic.name,
            goalId: currentSession.goal_id,
            nextGoalId: this.getNextGoalId(currentSession.subtopic_id, currentSession.goal_id)
        };
    }

    // Helper: Find subtopic by ID
    findSubtopicById(subtopicId) {
        const subtopics = this.getSubtopics();
        return subtopics.find(s => s.id === subtopicId);
    }

    // Helper: Get next goal ID
    getNextGoalId(currentSubtopicId, currentGoalId) {
        const subtopic = this.findSubtopicById(currentSubtopicId);
        if (!subtopic) return null;

        const currentGoalIndex = subtopic.goals.findIndex(g => g.id === currentGoalId);
        if (currentGoalIndex === -1 || currentGoalIndex === subtopic.goals.length - 1) {
            return null;
        }

        return subtopic.goals[currentGoalIndex + 1].id;
    }

    // Fallback data if loading fails
    getFallbackData() {
        return {
            subjects: [{
                name: "Physics",
                topics: [{
                    id: 1,
                    title: "Energy",
                    description: "Loading failed. Please try refreshing.",
                    subtopics: []
                }]
            }]
        };
    }
}

// Create and export a singleton instance
window.dataService = new DataService();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataService;
} 
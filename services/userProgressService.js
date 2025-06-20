const fs = require('fs').promises;
const path = require('path');

/**
 * User Progress Service - Refactored for topic-based structure
 * Uses topics.json as metadata source
 */
class UserProgressService {
    constructor() {
        this.metadata = null;
        this.loadMetadata();
    }

    async loadMetadata() {
        try {
            const metadataPath = path.join(__dirname, '..', 'sample_data', 'topics.json');
            const metadataContent = await fs.readFile(metadataPath, 'utf8');
            this.metadata = JSON.parse(metadataContent);
            console.log('📊 Topic data loaded successfully');
        } catch (error) {
            console.error('❌ Error loading topic data:', error);
            throw new Error('Failed to load topic data');
        }
    }

    /**
     * Calculate overall progress for a topic
     */
    calculateOverallProgress(completedGoals, topicId) {
        const subject = this.metadata.subjects[0];
        const topic = subject.topics.find(t => t.id === topicId);
        if (!topic) {
            throw new Error(`Topic ${topicId} not found`);
        }
        const totalGoals = topic.subtopics.reduce((sum, s) => sum + s.goals.length, 0);
        const completedCount = completedGoals.length;
        const progressPercentage = totalGoals > 0 ? Math.round((completedCount / totalGoals) * 100) : 0;
        return {
            chapter_title: topic.title,
            completed_goals: completedCount,
            total_goals: totalGoals,
            progress_percentage: progressPercentage
        };
    }

    /**
     * Calculate progress for all subtopics in a topic
     */
    calculateSubtopicProgress(completedGoals, currentGoal, topicId) {
        const subject = this.metadata.subjects[0];
        const topic = subject.topics.find(t => t.id === topicId);
        if (!topic) {
            throw new Error(`Topic ${topicId} not found`);
        }
        return topic.subtopics.map(subtopic => {
            const subtopicGoals = subtopic.goals.map(g => g.id);
            const completedInSubtopic = completedGoals.filter(goalId => subtopicGoals.includes(goalId));
            const completedCount = completedInSubtopic.length;
            const totalGoals = subtopicGoals.length;
            const progressPercentage = totalGoals > 0 ? Math.round((completedCount / totalGoals) * 100) : 0;
            let status;
            if (completedCount === totalGoals && totalGoals > 0) {
                status = 'completed';
            } else if (subtopicGoals.includes(currentGoal) || completedCount > 0) {
                status = 'current';
            } else {
                status = 'pending';
            }
            return {
                subtopic_id: subtopic.id,
                subtopic_name: subtopic.name,
                status: status,
                completed_goals: completedCount,
                total_goals: totalGoals,
                progress_percentage: progressPercentage
            };
        });
    }

    /**
     * Determine current session information
     */
    getCurrentSession(currentGoal, topicId) {
        const subject = this.metadata.subjects[0];
        const topic = subject.topics.find(t => t.id === topicId);
        if (!topic) {
            throw new Error(`Topic ${topicId} not found`);
        }
        // Find which subtopic contains the current goal
        const currentSubtopic = topic.subtopics.find(subtopic =>
            subtopic.goals.some(g => g.id === currentGoal)
        );
        if (!currentSubtopic) {
            throw new Error(`Current goal ${currentGoal} not found in topic ${topicId}`);
        }
        // Calculate next goal ID
        const allGoalIds = topic.subtopics.flatMap(s => s.goals.map(g => g.id));
        const nextGoalId = currentGoal + 1;
        const validNextGoal = allGoalIds.includes(nextGoalId) ? nextGoalId : null;
        return {
            subject: subject.name.toLowerCase(),
            chapter_id: topicId, // for compatibility with frontend
            subtopic_id: currentSubtopic.id,
            goal_id: currentGoal,
            next_goal_id: validNextGoal
        };
    }

    /**
     * Generate complete progress response from current_status.json
     */
    async generateProgressResponse() {
        try {
            // Load current status data
            const currentStatusPath = path.join(__dirname, '..', 'sample_data', 'current_status.json');
            const currentStatusContent = await fs.readFile(currentStatusPath, 'utf8');
            const currentStatus = JSON.parse(currentStatusContent);
            // Extract data from current status
            const completedGoals = currentStatus.courses.physics.topics['1'].completed_goals;
            const currentGoal = currentStatus.courses.physics.topics['1'].current_goal;
            const topicId = 1; // Currently hardcoded for Energy topic
            // Calculate all progress metrics
            const overallProgress = this.calculateOverallProgress(completedGoals, topicId);
            const subtopicProgress = this.calculateSubtopicProgress(completedGoals, currentGoal, topicId);
            const currentSession = this.getCurrentSession(currentGoal, topicId);
            // Build complete response
            const response = {
                user_id: currentStatus.user_id,
                user_name: currentStatus.user_name,
                last_active: currentStatus.last_active,
                overall_progress: overallProgress,
                subject_progress: {
                    physics: {
                        chapter_progress: {
                            '1': {
                                chapter_title: overallProgress.chapter_title,
                                completed_goals: overallProgress.completed_goals,
                                total_goals: overallProgress.total_goals,
                                progress_percentage: overallProgress.progress_percentage,
                                subtopic_progress: subtopicProgress
                            }
                        }
                    }
                },
                current_session: currentSession
            };
            return response;
        } catch (error) {
            if (error.code === 'ENOENT') {
                throw new Error('current_status.json not found');
            }
            throw error;
        }
    }

    /**
     * Update user progress in current_status.json
     */
    async updateUserProgress(newCompletedGoal) {
        try {
            const currentStatusPath = path.join(__dirname, '..', 'sample_data', 'current_status.json');
            const currentStatusContent = await fs.readFile(currentStatusPath, 'utf8');
            const currentStatus = JSON.parse(currentStatusContent);
            // Add new completed goal if not already present
            const completedGoals = currentStatus.courses.physics.topics['1'].completed_goals;
            if (!completedGoals.includes(newCompletedGoal)) {
                completedGoals.push(newCompletedGoal);
                completedGoals.sort((a, b) => a - b); // Keep sorted
            }
            // Update current goal to the next one (or stay at completed one)
            const nextGoal = newCompletedGoal + 1;
            currentStatus.courses.physics.topics['1'].current_goal = nextGoal;
            // Update current session
            const subject = this.metadata.subjects[0];
            const topic = subject.topics.find(t => t.id === 1);
            if (topic) {
                const nextSubtopic = topic.subtopics.find(subtopic =>
                    subtopic.goals.some(g => g.id === nextGoal)
                );
                if (nextSubtopic) {
                    currentStatus.current_session.subtopic_id = nextSubtopic.id;
                    currentStatus.current_session.goal_id = nextGoal;
                }
            }
            // Update last active timestamp
            currentStatus.last_active = new Date().toISOString();
            // Save updated progress
            await fs.writeFile(currentStatusPath, JSON.stringify(currentStatus, null, 2));
            console.log(`✅ Updated progress: completed goal ${newCompletedGoal}, next goal ${nextGoal}`);
            return currentStatus;
        } catch (error) {
            console.error(`❌ Error updating progress:`, error);
            throw error;
        }
    }

    /**
     * Reset progress to beginning (for testing purposes)
     */
    async resetProgress() {
        try {
            const currentStatusPath = path.join(__dirname, '..', 'sample_data', 'current_status.json');
            const currentStatusContent = await fs.readFile(currentStatusPath, 'utf8');
            const currentStatus = JSON.parse(currentStatusContent);
            // Reset to beginning
            currentStatus.courses.physics.topics['1'].completed_goals = [];
            currentStatus.courses.physics.topics['1'].current_goal = 1;
            currentStatus.current_session.subtopic_id = 1;
            currentStatus.current_session.goal_id = 1;
            currentStatus.last_active = new Date().toISOString();
            await fs.writeFile(currentStatusPath, JSON.stringify(currentStatus, null, 2));
            console.log(`✅ Progress reset to beginning`);
            return currentStatus;
        } catch (error) {
            console.error(`❌ Error resetting progress:`, error);
            throw error;
        }
    }
}

module.exports = UserProgressService; 
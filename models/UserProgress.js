/**
 * User Progress Model
 * Defines the structure and validation for user progress data
 */
class UserProgress {
    constructor(data) {
        this.user_id = data.user_id;
        this.created_at = data.created_at || new Date().toISOString();
        this.last_active = data.last_active || new Date().toISOString();
        this.courses = data.courses || this.getDefaultCourses();
    }

    /**
     * Get default course structure for new users
     */
    getDefaultCourses() {
        return {
            physics: {
                chapters: {
                    "1": {
                        completed_goals: [],
                        current_goal: 1
                    }
                }
            }
        };
    }

    /**
     * Validate user progress data structure
     */
    static validate(data) {
        const errors = [];

        if (!data.user_id) {
            errors.push('user_id is required');
        }

        if (!data.courses) {
            errors.push('courses object is required');
        }

        if (data.courses && !data.courses.physics) {
            errors.push('physics course is required');
        }

        if (data.courses?.physics && !data.courses.physics.chapters) {
            errors.push('chapters object is required');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Convert to JSON representation
     */
    toJSON() {
        return {
            user_id: this.user_id,
            created_at: this.created_at,
            last_active: this.last_active,
            courses: this.courses
        };
    }

    /**
     * Create UserProgress instance from raw data
     */
    static fromJSON(data) {
        const validation = UserProgress.validate(data);
        if (!validation.isValid) {
            throw new Error(`Invalid user progress data: ${validation.errors.join(', ')}`);
        }
        return new UserProgress(data);
    }

    /**
     * Get completed goals for a specific chapter
     */
    getCompletedGoals(subject = 'physics', chapterId = '1') {
        return this.courses[subject]?.chapters[chapterId]?.completed_goals || [];
    }

    /**
     * Get current goal for a specific chapter
     */
    getCurrentGoal(subject = 'physics', chapterId = '1') {
        return this.courses[subject]?.chapters[chapterId]?.current_goal || 1;
    }

    /**
     * Add completed goal
     */
    addCompletedGoal(goalId, subject = 'physics', chapterId = '1') {
        if (!this.courses[subject]) {
            this.courses[subject] = { chapters: {} };
        }
        if (!this.courses[subject].chapters[chapterId]) {
            this.courses[subject].chapters[chapterId] = {
                completed_goals: [],
                current_goal: 1
            };
        }

        const completedGoals = this.courses[subject].chapters[chapterId].completed_goals;
        if (!completedGoals.includes(goalId)) {
            completedGoals.push(goalId);
            completedGoals.sort((a, b) => a - b);
        }

        this.courses[subject].chapters[chapterId].current_goal = goalId;
        this.last_active = new Date().toISOString();
    }

    /**
     * Update last active timestamp
     */
    updateLastActive() {
        this.last_active = new Date().toISOString();
    }
}

module.exports = UserProgress; 
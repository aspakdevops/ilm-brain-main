const UserProgressService = require('../services/userProgressService');

/**
 * User Progress Controller
 * Handles HTTP requests and responses for user progress functionality
 */
class UserProgressController {
    constructor() {
        this.progressService = new UserProgressService();
    }

    /**
     * GET /api/user-progress - Get current user progress
     */
    async getUserProgress(req, res) {
        try {
            console.log(`📊 Fetching current user progress`);

            const progressResponse = await this.progressService.generateProgressResponse();
            
            res.json({
                status: "success",
                message: "User progress retrieved successfully",
                data: progressResponse
            });
            console.log(`✅ Progress response sent`);

        } catch (error) {
            console.error('❌ Error in progress API:', error);
            
            if (error.message.includes('not found')) {
                res.status(404).json({
                    status: "error",
                    message: "current_status.json not found",
                    data: null
                });
            } else {
                res.status(500).json({
                    status: "error",
                    message: "Failed to retrieve user progress",
                    data: null
                });
            }
        }
    }

    /**
     * PUT /api/user-progress/goal/:goalId - Update user progress (complete a goal)
     */
    async updateUserProgress(req, res) {
        try {
            const goalId = parseInt(req.params.goalId);
            
            console.log(`📝 Updating progress: goal ${goalId}`);

            await this.progressService.updateUserProgress(goalId);
            const updatedProgress = await this.progressService.generateProgressResponse();
            
            res.json({
                status: "success",
                message: `Goal ${goalId} completed successfully`,
                data: {
                    goal_completed: goalId,
                    progress: updatedProgress
                }
            });

        } catch (error) {
            console.error('❌ Error updating progress:', error);
            res.status(500).json({
                status: "error",
                message: "Failed to update user progress",
                data: null
            });
        }
    }

    /**
     * POST /api/user-progress/reset - Reset progress to beginning
     */
    async resetUserProgress(req, res) {
        try {
            console.log(`🔄 Resetting progress to beginning`);

            await this.progressService.resetProgress();
            const progressResponse = await this.progressService.generateProgressResponse();
            
            res.json({
                status: "success",
                message: "Progress reset to beginning successfully",
                data: progressResponse
            });

        } catch (error) {
            console.error('❌ Error resetting progress:', error);
            res.status(500).json({
                status: "error",
                message: "Failed to reset progress",
                data: null
            });
        }
    }

    /**
     * GET /api/user-progress/health - Health check
     */
    async healthCheck(req, res) {
        res.json({
            status: "success",
            message: "User Progress API is healthy",
            data: {
                service: 'User Progress API',
                timestamp: new Date().toISOString(),
                metadata_loaded: !!this.progressService.metadata
            }
        });
    }
}

module.exports = UserProgressController; 
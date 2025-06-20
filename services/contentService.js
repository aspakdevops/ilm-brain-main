const fs = require('fs').promises;
const path = require('path');

/**
 * Content Service - Centralized content management
 * Handles topics, subtopics, goals, and questions data
 */
class ContentService {
    constructor() {
        this.topicsData = null;
        this.questionsData = null;
        this.loadStaticData();
    }

    /**
     * Load static data files into memory
     */
    async loadStaticData() {
        try {
            const basePath = path.join(__dirname, '..', 'sample_data');
            
            // Load topics data
            const topicsPath = path.join(basePath, 'topics.json');
            const topicsContent = await fs.readFile(topicsPath, 'utf8');
            this.topicsData = JSON.parse(topicsContent);
            
            // Load questions data
            const questionsPath = path.join(basePath, 'questions.json');
            const questionsContent = await fs.readFile(questionsPath, 'utf8');
            this.questionsData = JSON.parse(questionsContent);
            
            console.log('📚 Content data loaded successfully');
        } catch (error) {
            console.error('❌ Error loading content data:', error);
            throw new Error('Failed to load content data');
        }
    }

    /**
     * Get all topics for a subject
     */
    async getTopics(subject = 'physics') {
        try {
            const normalizedSubject = subject.toLowerCase();
            
            // Find the requested subject
            const subjectData = this.topicsData.subjects.find(s => 
                s.name.toLowerCase() === normalizedSubject
            );
            
            if (!subjectData) {
                throw new Error(`Subject ${subject} not found`);
            }

            // Count questions per subtopic for topic statistics
            const subtopicToQuestionCount = this._getQuestionCountsBySubtopic();

            // Build topics response with statistics
            const topicsWithStats = subjectData.topics.map(topic => {
                const subtopicCount = topic.subtopics.length;
                let questionCount = 0;

                topic.subtopics.forEach(subtopic => {
                    questionCount += subtopicToQuestionCount[subtopic.id] || 0;
                });

                return {
                    id: topic.id,
                    title: topic.title,
                    description: topic.description,
                    subtopicCount,
                    questionCount,
                    goalCount: topic.subtopics.reduce((sum, s) => sum + s.goals.length, 0)
                };
            });

            return {
                success: true,
                subject: subjectData.name,
                description: subjectData.description,
                topics: topicsWithStats
            };
        } catch (error) {
            console.error('❌ Error fetching topics:', error);
            throw error;
        }
    }

    /**
     * Get all subtopics for a specific topic
     */
    async getSubtopics(topicId, subject = 'physics') {
        try {
            const normalizedSubject = subject.toLowerCase();
            
            // Find the requested subject
            const subjectData = this.topicsData.subjects.find(s => 
                s.name.toLowerCase() === normalizedSubject
            );
            
            if (!subjectData) {
                throw new Error(`Subject ${subject} not found`);
            }

            // Find the topic within the subject
            const topicData = subjectData.topics.find(t => t.id == topicId);
            
            if (!topicData) {
                throw new Error(`Topic with ID ${topicId} not found in subject ${subject}`);
            }

            // Build subtopics response with goal information
            const subtopicsWithGoals = topicData.subtopics.map(subtopic => ({
                id: subtopic.id,
                name: subtopic.name,
                order: subtopic.order,
                goals: subtopic.goals,
                goalCount: subtopic.goals.length
            }));

            return {
                success: true,
                subject: subjectData.name,
                topic: {
                    id: topicData.id,
                    title: topicData.title,
                    description: topicData.description
                },
                subtopics: subtopicsWithGoals
            };
        } catch (error) {
            console.error('❌ Error fetching subtopics:', error);
            throw error;
        }
    }

    /**
     * Get all goals for a specific subtopic
     */
    async getGoals(topicId, subtopicId, subject = 'physics') {
        try {
            const normalizedSubject = subject.toLowerCase();
            
            // Find the requested subject
            const subjectData = this.topicsData.subjects.find(s => 
                s.name.toLowerCase() === normalizedSubject
            );
            
            if (!subjectData) {
                throw new Error(`Subject ${subject} not found`);
            }

            // Find the topic within the subject
            const topicData = subjectData.topics.find(t => t.id == topicId);
            
            if (!topicData) {
                throw new Error(`Topic with ID ${topicId} not found in subject ${subject}`);
            }

            // Find the subtopic
            const subtopicData = topicData.subtopics.find(s => s.id == subtopicId);

            if (!subtopicData) {
                throw new Error(`Subtopic with ID ${subtopicId} not found in topic ${topicId}`);
            }

            // Build hierarchical goals response
            const goalsWithContent = subtopicData.goals.map(goal => ({
                id: goal.id,
                order: goal.order,
                description: goal.description,
                content: goal.content || `Learning content for: ${goal.description}`
            }));

            return {
                success: true,
                subject: {
                    name: subjectData.name,
                    topic: {
                        id: topicData.id,
                        title: topicData.title,
                        subtopic: {
                            id: subtopicData.id,
                            title: subtopicData.name,
                            goals: goalsWithContent
                        }
                    }
                }
            };
        } catch (error) {
            console.error('❌ Error fetching goals:', error);
            throw error;
        }
    }

    /**
     * Get questions for a specific subtopic
     */
    async getQuestions(subtopicId) {
        try {
            const subtopicQuestions = this.questionsData.questions.filter(q => 
                q.subtopic_id === parseInt(subtopicId)
            );

            return {
                success: true,
                subtopic_id: parseInt(subtopicId),
                questions: subtopicQuestions.map(q => ({
                    id: q.id,
                    text: q.text,
                    type: q.type,
                    difficulty: q.difficulty,
                    order: q.order
                }))
            };
        } catch (error) {
            console.error(' Error fetching questions:', error);
            throw error;
        }
    }

    /**
     * Get a specific goal by ID across all topics/subtopics
     */
    async getGoalById(goalId, subject = 'physics') {
        try {
            const normalizedSubject = subject.toLowerCase();
            
            const subjectData = this.topicsData.subjects.find(s => 
                s.name.toLowerCase() === normalizedSubject
            );
            
            if (!subjectData) {
                throw new Error(`Subject ${subject} not found`);
            }

            // Search through all topics and subtopics for the goal
            for (const topic of subjectData.topics) {
                for (const subtopic of topic.subtopics) {
                    const goal = subtopic.goals.find(g => g.id === parseInt(goalId));
                    if (goal) {
                        return {
                            success: true,
                            goal: {
                                id: goal.id,
                                order: goal.order,
                                description: goal.description,
                                content: goal.content || `Learning content for: ${goal.description}`
                            },
                            context: {
                                subject: subjectData.name,
                                topic: {
                                    id: topic.id,
                                    title: topic.title
                                },
                                subtopic: {
                                    id: subtopic.id,
                                    name: subtopic.name
                                }
                            }
                        };
                    }
                }
            }

            throw new Error(`Goal with ID ${goalId} not found in subject ${subject}`);
        } catch (error) {
            console.error('❌ Error fetching goal by ID:', error);
            throw error;
        }
    }

    /**
     * Get content statistics for a subject
     */
    async getContentStats(subject = 'physics') {
        try {
            const normalizedSubject = subject.toLowerCase();
            
            const subjectData = this.topicsData.subjects.find(s => 
                s.name.toLowerCase() === normalizedSubject
            );
            
            if (!subjectData) {
                throw new Error(`Subject ${subject} not found`);
            }

            const questionCounts = this._getQuestionCountsBySubtopic();
            
            let totalGoals = 0;
            let totalSubtopics = 0;
            let totalQuestions = 0;

            subjectData.topics.forEach(topic => {
                totalSubtopics += topic.subtopics.length;
                topic.subtopics.forEach(subtopic => {
                    totalGoals += subtopic.goals.length;
                    totalQuestions += questionCounts[subtopic.id] || 0;
                });
            });

            return {
                success: true,
                subject: subjectData.name,
                stats: {
                    topics: subjectData.topics.length,
                    subtopics: totalSubtopics,
                    goals: totalGoals,
                    questions: totalQuestions
                }
            };
        } catch (error) {
            console.error('❌ Error fetching content stats:', error);
            throw error;
        }
    }

    /**
     * Private helper: Count questions by subtopic ID
     */
    _getQuestionCountsBySubtopic() {
        const subtopicToQuestionCount = {};
        
        if (this.questionsData?.questions) {
            this.questionsData.questions.forEach(q => {
                const sid = q.subtopic_id;
                if (!subtopicToQuestionCount[sid]) {
                    subtopicToQuestionCount[sid] = 0;
                }
                subtopicToQuestionCount[sid]++;
            });
        }
        
        return subtopicToQuestionCount;
    }

    /**
     * Validate that content data is loaded
     */
    _validateDataLoaded() {
        if (!this.topicsData || !this.questionsData) {
            throw new Error('Content data not loaded. Call loadStaticData() first.');
        }
    }
}

// Export singleton instance
module.exports = new ContentService(); 
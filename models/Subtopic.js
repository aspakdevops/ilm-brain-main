const mongoose = require('mongoose');

const subtopicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    goal_count: {
        type: Number,
        required: true,
        default: 0
    },
    goal_ids: [{
        type: String,
        required: true
    }],
    chapter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Subtopic', subtopicSchema); 
const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
    title: {
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
    total_goals: {
        type: Number,
        required: true,
        default: 0
    },
    subtopics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subtopic'
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Chapter', chapterSchema); 
const mongoose = require('mongoose');

const PlacementTestSchema = new mongoose.Schema({
    student_name: {
        type: String,
        required: true
    },
    student_age: {
        type: Number,
        required: true
    },
    program: {
        type: String,
        required: true
    },
    scheduled_datetime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Scheduled', 'In Progress', 'Completed']
    },
    sales_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    teacher_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    sales_notes: String,
    grammar_notes: String,
    vocabulary_notes: String,
    fluency_notes: String,
    pronunciation_notes: String,
    recommended_program: String,
    recommended_level: String,
    teacher_comments: String,
    completed_datetime: Date,
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PlacementTest', PlacementTestSchema); 
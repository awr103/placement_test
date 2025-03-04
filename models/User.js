const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password_hash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['SALES', 'TEACHER']
    },
    email: {
        type: String
    }
});

module.exports = mongoose.model('User', UserSchema); 
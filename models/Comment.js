const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // The user who wrote the comment (agent)
        required: true,
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket', // The ticket this comment belongs to
        required: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Comment', CommentSchema);
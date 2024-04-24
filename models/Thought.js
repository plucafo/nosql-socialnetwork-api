const mongoose = require('mongoose');
const User = require('./User');

const thoughtSchema = new mongoose.Schema({
    thoughtText: {
        type: String, 
        required: true,
        minlength: 1,
        maxlength: 280,
      },
    createdAt: {
        type: Date,
        default: Date.now,
        get: function() {
            return this.createdAt.toLocaleString();
        }
    },
    username: {
        type: String,
        required: true,
    },
    reactions: [reactionSchema],
});

const Thought = mongoose.model('Thought', thoughtSchema);

// Add Thought.find and .insertMany to seed

module.exports = Thought;
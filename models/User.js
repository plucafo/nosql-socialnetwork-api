const mongoose = require('mongoose');
const Thought = require('./Thought');

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true,
        unique: true,
        trim: true,
      },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
    },
    thoughts: [thoughtSchema],
    friends: [userSchema],
});

const User = mongoose.model('User', userSchema);

// Add User.find and .insertMany to seed

module.exports = User;
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const User = require("./User");

// Reaction Schema
const reactionSchema = new mongoose.Schema({
  reactionId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new ObjectId(),
  },
  reactionBody: {
    type: String,
    required: true,
    maxlength: 280,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: function () {
      return this.createdAt.toLocaleString();
    },
  },
});

// Thought Schema
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
    get: function () {
      return this.createdAt.toLocaleString();
    },
  },
  username: {
    type: String,
    required: true,
  },
  reactions: [reactionSchema],
});

const Thought = mongoose.model("Thought", thoughtSchema);

// Seed data for Thoughts and Reactions
const thoughtReactionData = [
  {
    thoughtText: "This is the first thought.",
    username: "Admin",
    reaction: {
      reactionBody: "This is a test reaction!",
      username: "Admin",
    },
  },
  {
    thoughtText: "Another thought here.",
    username: "plucafo",
    reaction: {
      reactionBody: "This is a NEW test reaction!",
      username: "plucafo",
    },
  },
];

const reactionData = [
  {
    reactionBody: "This is a test reaction.",
    username: "test",
  },
  {
    reactionBody: "This is a NEW test reaction!",
    username: "newuser",
  },
];

Thought.find({})
  .exec()
  .then((collection) => {
    if (collection.length === 0) {
      Thought.create({
        thoughtText: "This a test thought.",
        username: "Admin",
        reactions: reactionData,
      })
        .then(() => console.log('Successfully seeded Thought and Reaction data!'))
        .catch((err) => console.log(err));
    }
  });

module.exports = Thought;

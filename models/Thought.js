const mongoose = require("mongoose");
const { Schema } = mongoose;
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
const thoughtData = [
  {
    thoughtText: "This is the first thought.",
    username: "Admin",
    reactions: [
      { reactionBody: "Nice thought!", username: "user3" },
      { reactionBody: "Interesting.", username: "user4" },
    ],
  },
  {
    thoughtText: "Another thought here.",
    username: "plucafo",
    reactions: [
      { reactionBody: "Great thought!", username: "user5" },
      { reactionBody: "Well said.", username: "user6" },
    ],
  },
];

Thought.find({})
  .exec()
  .then((collection) => {
    if (collection.length === 0) {
      Thought.insertMany(thoughtData).catch((err) => console.error(err));
      console.log("Successfully seeded Thought and Reaction data!");
    }
  });

module.exports = Thought;

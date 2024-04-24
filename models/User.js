const mongoose = require("mongoose");
const { Schema } = mongoose;
const Thought = require("./Thought");

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
  thoughts: [{ type: Schema.Types.ObjectId, ref: "Thought" }],
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const User = mongoose.model("User", userSchema);

// Seed User collection with documents
User.find({})
  .exec()
  .then((collection) => {
    if (collection.length === 0) {
        console.log('Successfully seeded User data!')
      User.insertMany([
        { username: "Admin", email: "admin@gmail.com" },
        { username: "plucafo", email: "phil@gmail.com" },
      ]).catch((err) => console.error(err));
    }
  });

module.exports = User;

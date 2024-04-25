const express = require("express");
const db = require("./config/connection");
// Require models
const { User, Thought } = require("./models");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// ************************ USER ROUTES ************************
// Find all users
app.get("/all-users", async (req, res) => {
  try {
    const result = await User.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
});

// Find one user
app.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await User.findOne({ _id: userId });
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
  }
});

// ************************ THOUGHT ROUTES ************************
// Find all thoughts
app.get("/all-thoughts", async (req, res) => {
    try {
      const result = await Thought.find({});
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "something went wrong" });
    }
  });

// Find thought by id
app.get("/thought/:id", async (req, res) => {
    try {
      const thoughtId = req.params.id;
      const result = await Thought.findOne({ _id: thoughtId });
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
    }
  });

// Start the server once the database connection is open
db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});

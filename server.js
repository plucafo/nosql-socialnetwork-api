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
app.get("/api/users", async (req, res) => {
  try {
    const result = await User.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
});

// Find one user
app.get("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await User.findOne({ _id: userId });
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
  }
});

// Create new user
app.post('/api/users', async (req, res) => {
    try {
        const newUser = new User({ username: req.body.username, email: req.body.email });
        await newUser.save();
        res.status(201).json(newUser); // HTTP status 201 for "Created"
    } catch (err) {
        // Error handling if username already exists
        if (err.code === 11000) {
            res.status(400).json({ message: 'Username already exists.' });
        } else {
            console.error('Error creating user:', err);
            res.status(500).json({ message: 'Something went wrong.' });
        }
    }
});

// Delete user by id
app.delete('/api/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await User.findOneAndDelete({ _id: userId });
        if (result) {
            res.status(200).json(result);
            console.log(`User deleted successfully: ${result}`);
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (err) {
        console.error('Error deleting user: ', err);
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

// ************************ THOUGHT ROUTES ************************
// Find all thoughts
app.get("/api/thoughts", async (req, res) => {
    try {
      const result = await Thought.find({});
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "something went wrong" });
    }
  });

// Find thought by id
app.get("/api/thoughts/:id", async (req, res) => {
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

const express = require("express");
const db = require("./config/connection");
// Require models
const { User, Thought } = require("./models");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Find all users
app.get("/all-users", async (req, res) => {
  try {
    const result = await User.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "YOU MESSED UP!" });
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

// Start the server once the database connection is open
db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});

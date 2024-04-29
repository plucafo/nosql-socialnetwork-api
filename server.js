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
    const result = await User.find({}).populate("thoughts").populate("friends").exec();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
});

// Find one user
app.get("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await User.findOne({ _id: userId }).populate("thoughts").populate("friends");
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
  }
});

// Create new user
app.post("/api/users", async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
    });
    await newUser.save();
    res.status(201).json(newUser); // HTTP status 201 for "Created"
  } catch (err) {
    // Error handling if username already exists
    if (err.code === 11000) {
      res.status(400).json({ message: "Username already exists." });
    } else {
      console.error("Error creating user:", err);
      res.status(500).json({ message: "Something went wrong." });
    }
  }
});

// Update user by id
app.put("/api/users/:id", async (req, res) => {
    try {
      const userId = req.params.id; // Get the userId from route parameters
  
      // Update user fields based on JSON data from request body
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $set: req.body }, // Use $set to update fields based on request body
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "User updated successfully", updatedUser });
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ message: "Something went wrong." });
    }
  });

// Delete user by id
app.delete("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await User.findOneAndDelete({ _id: userId });
    if (result) {
      res.status(200).json(result);
      console.log(`User deleted successfully: ${result}`);
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (err) {
    console.error("Error deleting user: ", err);
    res.status(500).json({ message: "Something went wrong." });
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

// Create new thought
app.post("/api/thoughts", async (req, res) => {
  try {
    // Save the new thought
    const newThought = new Thought({
      thoughtText: req.body.thoughtText,
      username: req.body.username,
    });
    await newThought.save();
    console.log(newThought);
    // Update the user array of thoughts by pushing the new thought _id
    const updatedUser = await User.findOneAndUpdate({ _id: req.body.userId }, { $push: { thoughts: newThought._id }}, { new: true } );
    if (!updatedUser) {
        return res.status(404).json({ message: "Updated user not found" });
    }
    res.status(201).json({newThought, updatedUser}); // HTTP status 201 for "Created"
  } catch (err) {
    console.error("Error creating thought:", err);
    res.status(500).json({ message: "Something went wrong." });
  }
});

// Update thought
app.put("/api/thoughts/:id", async (req, res) => {
    try {
      const thoughtId = req.params.id; // Get the thoughtId from route parameters
  
      // Update thought fields based on JSON data from request body
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: thoughtId },
        { $set: req.body }, // Use $set to update fields based on request body
        { new: true }
      );
  
      if (!updatedThought) {
        return res.status(404).json({ message: "Thought not found" });
      }
  
      res.status(200).json({ message: "Thought updated successfully", updatedThought });
    } catch (err) {
      console.error("Error updating thought:", err);
      res.status(500).json({ message: "Something went wrong." });
    }
  });

// Delete thought by id
app.delete("/api/thoughts/:id", async (req, res) => {
    try {
      const thoughtId = req.params.id;
      const result = await Thought.findOneAndDelete({ _id: thoughtId });
      if (result) {
        res.status(200).json(result);
        console.log(`Thought deleted successfully: ${result}`);
      } else {
        res.status(404).json({ message: "Thought not found." });
      }
    } catch (err) {
      console.error("Error deleting user: ", err);
      res.status(500).json({ message: "Something went wrong." });
    }
  });

// ************************ REACTION ROUTES ************************
// Create new reaction for a thought
app.post("/api/thoughts/:thoughtId/reactions", async (req, res) => {
    try {
      const { thoughtId } = req.params;
      const { reactionBody, username } = req.body;
  
      // Find the thought by its ID
      const thought = await Thought.findById(thoughtId);
  
      if (!thought) {
        return res.status(404).json({ message: "Thought not found." });
      }
  
      // Create a new reaction
      const newReaction = {
        reactionBody,
        username,
      };
  
      // Add the new reaction to the thought's reactions array
      thought.reactions.push(newReaction);
  
      // Save the updated thought with the new reaction
      await thought.save();
  
      res.status(201).json(thought); // Return the updated thought with the new reaction
    } catch (err) {
      console.error("Error creating reaction:", err);
      res.status(500).json({ message: "Something went wrong." });
    }
  });

// Delete reaction
app.delete("/api/thoughts/:thoughtId/reactions/:reactionId", async (req, res) => {
    try {
        const { thoughtId, reactionId } = req.params;

        // Find the thought by its ID
        const thought = await Thought.findById(thoughtId);

        if (!thought) {
            return res.status(404).json({ message: "Thought not found." });
        }

        // Find the index of the reaction within the thought's reactions array
        const reactionIndex = thought.reactions.findIndex(reaction => reaction.reactionId.toString() === reactionId);

        if (reactionIndex === -1) {
            return res.status(404).json({ message: "Reaction not found." });
        }

        // Remove the reaction at the found index from the thought's reactions array
        thought.reactions.splice(reactionIndex, 1);
        await thought.save();

        res.status(200).json({ message: "Reaction deleted successfully." });
    } catch (err) {
        console.error("Error deleting reaction:", err);
        res.status(500).json({ message: "Something went wrong." });
    }
});
  
// ************************ FRIEND ROUTES ************************
// Add friend
app.post("/api/add-friend", async (req, res) => {
    try {
      const friendId = req.body.friendId; // Assuming you're passing the friend's ID
  
      // Check if the friendId exists in the User collection
      const friend = await User.findById(friendId);
      if (!friend) {
        return res.status(404).json({ message: "Friend not found" });
      }
  
      // Update the user's friends array with the friend's ID
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { friends: friendId } }, // Using $addToSet to avoid duplicates
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "Updated user not found" });
      }
      
      res.status(201).json({ friend, updatedUser });
      res.json({ message: "Friend added successfully!"});
    } catch (err) {
      console.error("Error adding friend:", err);
      res.status(500).json({ message: "Something went wrong." });
    }
  });
  
// Delete friend
app.delete("/api/users/:userId/friends/:friendId", async (req, res) => {
    try {
      const userId = req.params.userId; // Get the userId from route parameters
      const friendId = req.params.friendId; // Get the friendId from route parameters
  
      // Update the user's friends array by removing the friend's ID
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { friends: friendId } }, // Using $pull to remove the friend's ID
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "Friend deleted successfully", updatedUser });
    } catch (err) {
      console.error("Error deleting friend:", err);
      res.status(500).json({ message: "Something went wrong." });
    }
  });

// Delete all friends of a user
app.delete("/api/users/:userId/friends", async (req, res) => {
    try {
      const userId = req.params.userId; // Get the userId from route parameters
  
      // Update the user's friends array with an empty array to delete all friends
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $set: { friends: [] } }, // Set friends array to empty array
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ message: "All friends deleted successfully", updatedUser });
    } catch (err) {
      console.error("Error deleting all friends:", err);
      res.status(500).json({ message: "Something went wrong." });
    }
  });

// Start the server once the database connection is open
db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});

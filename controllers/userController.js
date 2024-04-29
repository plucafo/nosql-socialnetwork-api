const { User, Thought } = require("../models");

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const result = await User.find({})
        .populate("thoughts")
        .populate("friends")
        .exec();
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "something went wrong" });
    }
  },

  // Get a single user
  async getSingleUser(req, res){
    try {
        const userId = req.params.id;
        const result = await User.findOne({ _id: userId }).populate("thoughts").populate("friends");
        res.status(200).json(result);
      } catch (err) {
        console.error(err);
      }
  },

  // Create a new user
  async createUser(req, res) {
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
  },

  // Update a user
  async updateUser(req, res) {
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
  },

  // Delete a user
  async deleteUser(req, res) {
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
  },

  // Add a friend to a user
  async addFriend(req, res) {
    try {
      const friendId = req.body.friendId;
    
      // Check if the friendId exists in the User collection
      const friend = await User.findById(friendId);
      if (!friend) {
        return res.status(404).json({ message: "Friend not found" });
      }
  
      const userId = req.params.userId; // Get the userId from route parameters
    
      // Update the user's friends array with the friend's ID
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { friends: friendId } }, // Using $addToSet to avoid duplicates
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "Updated user not found" });
      }
      
      res.status(201).json({ friend, updatedUser, message: "Friend added successfully!" });
    } catch (err) {
      console.error("Error adding friend:", err);
      res.status(500).json({ message: "Something went wrong." });
    }
  },
  
  // Delete a single friend from a user
  async deleteFriend(req, res) {
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
  },

  // Delete all friends from a user
  async deleteAllFriends(req, res) {
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
  },
};

const { Thought, User } = require('../models');

module.exports = {
    // Get all thoughts
    async getThoughts(req, res) {
        try {
            const result = await Thought.find({});
            res.status(200).json(result);
          } catch (err) {
            res.status(500).json({ message: "something went wrong" });
          }
    },

    // Get one thought
    async getOneThought(req, res) {
        try {
            const thoughtId = req.params.id;
            const result = await Thought.findOne({ _id: thoughtId });
            res.status(200).json(result);
          } catch (err) {
            console.error(err);
          }
    },

    // Create a thought
    async createThought(req, res) {
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
    },

    // Update a thought
    async updateThought(req, res) {
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
    },

    // Delete a thought
    async deleteThought(req, res) {
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
    },
    
    // Add a reaction to a thought
    async addReaction(req, res) {
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
    },

    // Delete a reaction from a thought
    async deleteReaction(req, res) {
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
    },
};
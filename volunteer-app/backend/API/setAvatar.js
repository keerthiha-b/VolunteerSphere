const User = require("../Schema/User");
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

const setAvatar = async (req, res) => {
    try {
      const { id, avatar } = req.body;
  
      // Validate the id format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ errorMsg: "Invalid ID format" });
      }

      // Attempt to update the user's avatar directly
      const result = await User.updateOne(
        { _id: id },          // Filter: find the user by ID
        { $set: { avatar } }  // Update: set the avatar field
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).json({ errorMsg: "User not found." });
      }
  
      res.status(200).json({ successMsg: "Avatar updated successfully." });
    } catch (error) {
      console.error('Error updating avatar:', error);
      res.status(500).json({ errorMsg: "Server error while updating avatar." });
    }
  };
  
module.exports = setAvatar;
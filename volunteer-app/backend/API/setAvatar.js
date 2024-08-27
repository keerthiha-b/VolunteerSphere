const User = require("../Schema/User");
const cors = require('cors');
const express = require('express');

const app = express();
app.use(cors());
app.use(express.json());

const setAvatar = async (req, res) => {
    try {
      const { id, avatar } = req.body;
  
      const user = await User.findOne({ _id: id });
  
      if (!user) {
        return res.status(404).json({ errorMsg: "User not found." });
      }
  
      user.avatar = avatar;
      await user.save(); 
  
      res.status(200).json({ successMsg: "Avatar updated successfully.", avatar: user.avatar });
    } catch (error) {
      console.error('Error updating avatar:', error);
      res.status(500).json({ errorMsg: "Server error while updating avatar." });
    }
  };
  
  module.exports = setAvatar;
const User = require("../Schema/User");
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

const getAvatar = async (req, res) => {
  try {
    const { id } = req.body;

    // Validate the id format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ errorMsg: "Invalid ID format" });
    }

    // Attempt to find a user or organization by the username
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(401).json({ errorMsg: "Cannot find Avatar?" });
    }

    // retrieve successful, return a success message along with userType, name, email, and userId
    res.status(200).json({
        avatar: user.avatar
    });

  } catch (error) {
    console.error('Error retrieving avatar info:', error);
  }
};

module.exports = getAvatar;

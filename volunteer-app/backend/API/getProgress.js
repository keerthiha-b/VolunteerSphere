const mongoose = require('mongoose');
const User = require("../Schema/User");
const cors = require('cors');
const express = require('express');

const app = express();
app.use(cors());
app.use(express.json());

const getProgress = async (req, res) => {
  try {
    const { id } = req.body;

    // Validate the id format
    if (!id || typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ errorMsg: "Invalid ID format. ID must be a valid ObjectId string." });
    }

    // Attempt to find a user by the ObjectId
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ errorMsg: "Cannot find progress?" });
    }

    // Retrieve successful, return the progress details
    res.status(200).json({
      level: user.level,
      points: user.points,
      maxPoints: user.maxPoints
    });

  } catch (error) {
    console.error('Error retrieving progress info:', error);
    res.status(500).json({ errorMsg: 'Internal server error' });
  }
};

module.exports = getProgress;

const User = require("../Schema/User");
const cors = require('cors');
const express = require('express');

const app = express();
app.use(cors());
app.use(express.json());

const getProgress = async (req, res) => {
  try {
    const { id } = req.body;

    // Attempt to find a user or organization by the username
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(401).json({ errorMsg: "Cannot find progress?" });
    }

    const level = user.level;
    const points = user.points;
    const maxPoints = user.maxPoints;

    // retrieve successful, return a success message along with userType, name, email, and userId
    res.status(200).json({
        level: user.level,
        points: user.points,
        maxPoints: user.maxPoints
    });

  } catch (error) {
    console.error('Error retrieving progress info:', error);
  }
};

module.exports = getProgress;

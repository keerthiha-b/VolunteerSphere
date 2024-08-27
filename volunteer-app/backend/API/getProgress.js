const User = require("../Schema/User");
const cors = require('cors');
const express = require('express');

const app = express();
app.use(cors());
app.use(express.json());

const getProgress = async (req, res) => {
  try {
    const { id } = req.body;

    // Validate that id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ errorMsg: "Invalid User ID" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ errorMsg: "User not found" });
    }

    res.status(200).json({
      level: user.level,
      points: user.points,
      maxPoints: user.maxPoints
    });

  } catch (error) {
    console.error('Error retrieving progress info:', error);
    res.status(500).json({ errorMsg: "Internal Server Error" });
  }
};

module.exports = getProgress;
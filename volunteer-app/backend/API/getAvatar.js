const mongoose = require('mongoose');
const User = require("../Schema/User");

const getAvatar = async (req, res) => {
  try {
    const { obtId } = req.body;

    const id = String(obtId);

    // Validate the id format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ errorMsg: "Invalid User ID" });
    }

    // Attempt to find a user by the ObjectId
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ errorMsg: "Cannot find Avatar?" });
    }

    // Retrieve successful, return the avatar
    res.status(200).json({
      avatar: user.avatar
    });

  } catch (error) {
    console.error('Error retrieving avatar info:', error);
    res.status(500).json({ errorMsg: 'Internal server error' });
  }
};

module.exports = getAvatar;

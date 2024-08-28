const express = require('express');
const router = express.Router();
const Mission = require('../Schema/Mission');

// POST /api/missions/populate - Insert 6 fixed missions into the database
router.post('/missions/populate', async (req, res) => {
  try {
    const fixedMissions = [
      {
        title: "Environmental Steward",
        category: "Environment",
        goal: 3,
        goalType: "activity",
        description: "Participate in activities that protect or restore the environment, such as tree planting or beach cleanups."
      },
      {
        title: "Community Helper",
        category: "Community Service",
        goal: 5,
        goalType: "hours",
        description: "Help out in your local community by volunteering for 5 hours."
      },
      {
        title: "Healthy Living Advocate",
        category: "Health and Wellness",
        goal: 2,
        goalType: "activity",
        description: "Participate in activities that promote healthy living, such as fitness events, mental health workshops, or wellness initiatives."
      },
      {
        title: "Educator for Change",
        category: "Education",
        goal: 2,
        goalType: "activity",
        description: "Promote education by attending or assisting in educational activities like tutoring, teaching workshops, or literacy programs."
      }
    ];

    // Insert missions into the database
    await Mission.insertMany(fixedMissions);
    res.status(200).json({ message: "Missions inserted successfully!" });
  } catch (error) {
    console.error('Error inserting missions:', error);
    res.status(500).json({ message: "Error inserting missions", error });
  }
});

module.exports = router;
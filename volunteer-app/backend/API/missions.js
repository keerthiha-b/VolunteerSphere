const express = require('express');
const router = express.Router();
const Mission = require('../Schema/Mission');

// POST /api/missions/populate - Insert missions with new schema into the database
router.post('/missions/populate', async (req, res) => {
  try {
    console.log('Populate endpoint hit');

    const fixedMissions = [
      {
        title: "Environmental Steward",
        category: "Environment",
        goal: 3,
        userProgresses: [], // Ensure this field is included for user-specific progress tracking
        points: 100,
        goalType: "activity",
        description: "Participate in activities that protect or restore the environment, such as tree planting or beach cleanups.",
        expirationDate: new Date(new Date().setDate(new Date().getDate() + 20)), // Expires in 15 days
        completed: false
      },
      {
        title: "Community Helper",
        category: "Community Service",
        goal: 5,
        userProgresses: [], // Same here for user-specific progress tracking
        points: 150,
        goalType: "hours",
        description: "Help out in your local community by volunteering for 5 hours.",
        expirationDate: new Date(new Date().setDate(new Date().getDate() + 20)), // Expires in 15 days
        completed: false
      },
      {
        title: "Healthy Living Advocate",
        category: "Health",
        goal: 2,
        userProgresses: [], // Each mission should have this field
        points: 120,
        goalType: "activity",
        description: "Participate in activities that promote healthy living, such as fitness events, mental health workshops, or wellness initiatives.",
        expirationDate: new Date(new Date().setDate(new Date().getDate() + 20)), // Expires in 15 days
        completed: false
      },
      {
        title: "Educator for Change",
        category: "Education",
        goal: 2,
        userProgresses: [], // Initialize empty for new tracking approach
        points: 130,
        goalType: "activity",
        description: "Promote education by attending or assisting in educational activities like tutoring, teaching workshops, or literacy programs.",
        expirationDate: new Date(new Date().setDate(new Date().getDate() + 20)), // Expires in 15 days
        completed: false
      }
    ];

    // Check if missions already exist in the database
    const existingMissions = await Mission.countDocuments();
    if (existingMissions === 0) {
      await Mission.insertMany(fixedMissions);
      res.status(200).json({ message: "Missions inserted successfully!" });
    } else {
      res.status(200).json({ message: "Missions already exist!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error inserting missions", error });
  }
});

// GET /api/missions - Fetch all missions from the database
router.get('/missions', async (req, res) => {
  try {
    const missions = await Mission.find(); // Fetch all missions from the database
    res.status(200).json(missions); // Send the missions as a JSON response
  } catch (error) {
    console.error('Error fetching missions:', error);
    res.status(500).json({ message: 'Error fetching missions' });
  }
});

module.exports = router;
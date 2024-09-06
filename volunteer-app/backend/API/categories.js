const express = require('express');
const router = express.Router();
const Category = require('../Schema/Category');

// GET /api/categories - Fetch all categories from the database
router.get('/', async (req, res) => {
    try {
      const categories = await Category.find(); // Fetch all catgories from the database
      res.status(200).json(categories); // Send the categories as a JSON response
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: 'Error fetching categories' });
    }
  });
  
  module.exports = router;
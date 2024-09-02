// routes/certificateRoutes.js
const express = require('express');
const mongoose = require('mongoose');
const Certificate = require('../Schema/Certificate'); // Import the Certificate model

const router = express.Router();

// Endpoint to get certificates for a student
router.get('/:studentId', async (req, res) => {
  const { studentId } = req.params;

  // Validate that studentId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ message: 'Invalid student ID.' });
  }

  try {
    // Fetch all certificates for the given studentId
    const certificates = await Certificate.find({ studentId }).populate('activityId', 'name'); // Populating activity name for display

    // If no certificates are found, return a 404 status
    if (!certificates.length) {
      return res.status(404).json({ message: 'No certificates found for this student.' });
    }

    // Return the certificates with a 200 status
    res.status(200).json(certificates);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ message: 'Error fetching certificates', error });
  }
});

module.exports = router;

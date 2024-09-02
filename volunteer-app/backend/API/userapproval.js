const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const UserActivity = require('../Schema/UserActivity'); // Existing model
const ApprovalStatus = require('../Schema/ApprovalStatus'); // New model
const Activity = require('../Schema/Activity'); // To get activity details
const Organization = require('../Schema/Organization'); // To get organization details

// Function to simulate certificate generation with simplified content
const generateCertificate = async (userActivity, activity, organization) => {
  // Define the certificate content with basic details
  const certificateContent = `
    Certificate of Completion

    This certifies that ${userActivity.firstName} ${userActivity.lastName} has successfully completed the volunteer activity titled "${activity.name}" organized by ${organization.organization_name} on ${new Date(activity.date).toDateString()}.
  `;

  // Define the file path for saving the certificate
  const certificatePath = path.join(__dirname, `../certificates/${userActivity._id}.txt`);

  // Write the certificate content to a text file
  fs.writeFileSync(certificatePath, certificateContent);

  // Return the path to the certificate file
  return certificatePath;
};

// Endpoint to approve a user for a specific activity and generate a certificate
router.post('/approve/:id', async (req, res) => {
  try {
    const { id } = req.params; // UserActivity ID

    const userActivity = await UserActivity.findById(id);
    if (!userActivity) {
      return res.status(404).json({ message: 'User sign-up not found' });
    }

    const activity = await Activity.findById(userActivity.opportunityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    const organization = await Organization.findById(activity.userId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Check if activity date is in the past
    if (new Date(activity.date) > new Date()) {
      return res.status(400).json({ message: 'Cannot approve users for future activities.' });
    }

    // Update or create approval status
    let approval = await ApprovalStatus.findOne({ userActivityId: id });
    if (!approval) {
      approval = new ApprovalStatus({ userActivityId: id, status: 'approved' });
    } else {
      approval.status = 'approved';
    }

    // Generate a certificate for the approved user
    if (!approval.certificateGenerated) {
      const certificatePath = await generateCertificate(userActivity, activity, organization);
      approval.certificateUrl = certificatePath; // Store the certificate path in the database
      approval.certificateGenerated = true;
    }

    await approval.save();

    res.json({ message: 'User approved and certificate generated successfully', certificateUrl: approval.certificateUrl });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ message: 'Error approving user', error });
  }
});

// Endpoint to decline a user for a specific activity
router.post('/decline/:id', async (req, res) => {
  try {
    const { id } = req.params; // UserActivity ID

    const userActivity = await UserActivity.findById(id);
    if (!userActivity) {
      return res.status(404).json({ message: 'User sign-up not found' });
    }

    const activity = await Activity.findById(userActivity.opportunityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Check if activity date is in the past
    if (new Date(activity.date) > new Date()) {
      return res.status(400).json({ message: 'Cannot decline users for future activities.' });
    }

    // Update or create approval status
    let approval = await ApprovalStatus.findOne({ userActivityId: id });
    if (!approval) {
      approval = new ApprovalStatus({ userActivityId: id, status: 'declined' });
    } else {
      approval.status = 'declined';
    }

    await approval.save();

    res.json({ message: 'User declined successfully' });
  } catch (error) {
    console.error('Error declining user:', error);
    res.status(500).json({ message: 'Error declining user', error });
  }
});

module.exports = router;

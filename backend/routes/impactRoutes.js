const express = require('express');
const router = express.Router();
const ImpactReport = require('../models/ImpactReport');

// Fetch impact reports for a charity
router.get('/:charityId/reports', async (req, res) => {
  try {
    const { charityId } = req.params;

    // Fetch reports related to the charity
    const reports = await ImpactReport.findAll({ where: { charityId } });

    res.status(200).json({ reports });
  } catch (error) {
    console.error('Error fetching impact reports:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new impact report for a charity
router.post('/:charityId/reports', async (req, res) => {
  try {
    const { charityId } = req.params;
    const { title, content } = req.body; // Extract title and content directly

    // Validate that title and content are provided
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Create the impact report
    const newReport = await ImpactReport.create({
      title,
      content,
      charityId,
    });

    res.status(201).json({ report: newReport });
  } catch (error) {
    console.error('Error creating impact report:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

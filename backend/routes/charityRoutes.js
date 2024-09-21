const express = require('express');
const charityController = require('../controllers/charityController');
const Charity = require('../models/Charity'); 
const { Sequelize } = require('sequelize');
const router = express.Router();
const { Op } = require('sequelize');


router.post('/register', charityController.registerCharity);

router.get('/:id', charityController.getCharityProfile);

router.put('/:id', charityController.updateCharityProfile);
router.get('/search', charityController.searchCharities);
router.get('/categories', charityController.getCategories);
router.get('/locations', charityController.getLocations);
router.get('/', async (req, res) => {
    try {
    const { category, location, search } = req.query;

    // Build query conditions based on search, category, and location
    const whereConditions = {};
    if (category) whereConditions.category = category;
    if (location) whereConditions.location = location;
    if (search) whereConditions.name = { [Sequelize.Op.like]: `%${search}%` };

    // Fetch charities based on the conditions
    const charities = await Charity.findAll({ where: whereConditions });
    
    res.status(200).json({ charities });
  } catch (error) {
    console.error('Error fetching charities:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  });
module.exports = router;

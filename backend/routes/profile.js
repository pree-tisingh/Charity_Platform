const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getDonationHistory } = require('../controllers/profileController');
const authMiddleware = require('../middlewares/auth'); 

router.get('/profile', authMiddleware, getProfile);

router.put('/profile', authMiddleware, updateProfile);

router.get('/donations', authMiddleware, getDonationHistory);

module.exports = router;

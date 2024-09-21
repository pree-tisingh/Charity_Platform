const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const isAuthenticated = require('../middlewares/auth'); 

router.get('/donations', isAuthenticated, donationController.getDonations);
router.get('/download-receipt/:donationId', donationController.downloadReceipt);
router.post('/donations', isAuthenticated, donationController.addDonation);
router.post('/create-order', isAuthenticated, donationController.createOrder);
module.exports = router;

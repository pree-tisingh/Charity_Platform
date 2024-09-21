const express = require('express');
const adminController = require('../controllers/adminController');
const isAdmin = require('../middlewares/isAdmin');
const router = express.Router();

// Get all users and charities for admin to review
router.get('/users', isAdmin, adminController.getAllUsers);

// Approve a charity
router.post('/charities/:id/approve', isAdmin, adminController.approveCharity);

// Reject a charity
router.post('/charities/:id/reject', isAdmin, adminController.rejectCharity);
router.get('/approve' , isAdmin , adminController.getApprovedCharities);

module.exports = router;

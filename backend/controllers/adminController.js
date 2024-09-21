const User = require('../models/User');
const Charity = require('../models/Charity');

exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.findAll();
      const charities = await Charity.findAll({ where: { isApproved: false } });
      res.json({ users, charities });
    } catch (error) {
      console.error('Error fetching users and charities:', error); // Log error to terminal
      res.status(500).json({ error: 'Failed to fetch users and charities' });
    }
  };
  

// Approve a charity
exports.approveCharity = async (req, res) => {
  try {
    const charity = await Charity.findByPk(req.params.id);
    if (!charity) return res.status(404).json({ error: 'Charity not found' });

    charity.isApproved = true;
    await charity.save();
    res.json({ message: 'Charity approved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve charity' });
  }
};

// Reject a charity
exports.rejectCharity = async (req, res) => {
  try {
    const charity = await Charity.findByPk(req.params.id);
    if (!charity) return res.status(404).json({ error: 'Charity not found' });

    await charity.destroy();
    res.json({ message: 'Charity rejected and removed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject charity' });
  }
};
exports.getPendingCharities = async (req, res) => {
    try {
      const pendingCharities = await Charity.findAll({ where: { isApproved: false } });
      if (pendingCharities.length === 0) {
        return res.status(404).json({ message: 'No pending charities found' });
      }
      res.json(pendingCharities);
    } catch (error) {
      console.error('Error fetching pending charities:', error);
      res.status(500).json({ error: 'Failed to fetch pending charities' });
    }
  };
  
  // Get all approved charities for admin (isApproved: true)
  exports.getApprovedCharities = async (req, res) => {
    try {
      const approvedCharities = await Charity.findAll({ where: { isApproved: true } });
      if (approvedCharities.length === 0) {
        return res.status(404).json({ message: 'No approved charities found' });
      }
      res.json(approvedCharities);
    } catch (error) {
      console.error('Error fetching approved charities:', error);
      res.status(500).json({ error: 'Failed to fetch approved charities' });
    }
  };
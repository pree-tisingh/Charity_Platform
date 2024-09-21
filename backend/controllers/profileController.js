const User = require('../models/User'); 
const Donation = require('../models/Donation');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id); 
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findByPk(req.user.id);
    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getDonationHistory = async (req, res) => {
  try {
    const donations = await Donation.findAll({ where: { userId: req.user.id } });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

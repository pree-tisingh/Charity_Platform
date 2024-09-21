const bcrypt = require("bcryptjs");
const Charity = require("../models/Charity");
const Sequelize = require("sequelize");
const sendEmail = require('../utils/emailService');
const User = require('../models/User');

exports.registerCharity = async (req, res) => {
  const {
    name,
    email,
    password,
    mission,
    goals,
    projects,
    category,
    location,
    website,
    phoneNumber,
    dateEstablished,
    logoUrl,
  } = req.body;

  try {
    const existingCharity = await Charity.findOne({ where: { email } });
    if (existingCharity) {
      return res.status(400).json({ message: "Charity already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const charity = await Charity.create({
      name,
      email,
      password: hashedPassword,
      mission,
      goals,
      projects,
      category,
      location,
      website,
      phoneNumber,
      dateEstablished,
      logoUrl,
    });

    res
      .status(201)
      .json({ message: "Charity registered successfully", charity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering charity" });
  }
};

// charityController.js
exports.getCharityProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const charity = await Charity.findByPk(id);
    if (charity) {
      res.status(200).json({ charity });
    } else {
      res.status(404).json({ error: "Charity not found" });
    }
  } catch (error) {
    console.error("Error fetching charity profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateCharityProfile = async (req, res) => {
  const charityId = req.params.id;
  const {
    name,
    mission,
    goals,
    projects,
    category,
    location,
    website,
    phoneNumber,
    dateEstablished,
    logoUrl,
    updateContent,
  } = req.body;

  try {
    const charity = await Charity.findByPk(charityId);
    if (!charity) {
      return res.status(404).json({ message: "Charity not found" });
    }

    charity.name = name || charity.name;
    charity.mission = mission || charity.mission;
    charity.goals = goals || charity.goals;
    charity.projects = projects || charity.projects;
    charity.category = category || charity.category;
    charity.location = location || charity.location;
    charity.website = website || charity.website;
    charity.phoneNumber = phoneNumber || charity.phoneNumber;
    charity.dateEstablished = dateEstablished || charity.dateEstablished;
    charity.logoUrl = logoUrl || charity.logoUrl;

    await charity.save();

    if (updateContent) {
      const newUpdate = await CharityUpdate.create({
        charityId,
        content: updateContent,
      });

      const subscribedUsers = await User.findAll({
        where: { subscribedCharityId: charityId },
      });

      for (const user of subscribedUsers) {
        try {
          const subject = `New Update from ${charity.name}`;
          const message = `
            Hi ${user.name},
            
            ${charity.name} has posted a new update:
            
            "${updateContent}"

            Please visit the charity page for more details.
            
            Regards,
            Charity Donation Platform Team
          `;

          console.log(`Preparing to send email to ${user.email}`);
          await sendEmail(user.email, subject, message);
          console.log(`Email sent to ${user.email}`);
        } catch (error) {
          console.error(`Error sending email to ${user.email}:`, error.message);
        }
      }
    }

    res.status(200).json({ message: "Charity profile updated successfully, and notifications sent if applicable", charity });
  } catch (error) {
    console.error("Error updating charity profile:", error.message);
    res.status(500).json({ message: "Error updating charity profile" });
  }
};

exports.getCategories = async (req, res) => {
    try {
      const categories = await Charity.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('category')), 'category']],
        raw: true
      });
      res.status(200).json({ categories: categories.map(c => c.category) });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  exports.getLocations = async (req, res) => {
    try {
      const locations = await Charity.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('location')), 'location']],
        raw: true
      });
      res.status(200).json({ locations: locations.map(l => l.location) });
    } catch (error) {
      console.error('Error fetching locations:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

exports.searchCharities = async (req, res) => {
  const { category, location, search } = req.query;
  const whereConditions = {};
  if (category) whereConditions.category = category;
  if (location) whereConditions.location = location;
  if (search) whereConditions.name = { [Op.like]: `%${search}%` };

  try {
    const charities = await Charity.findAll({ where: whereConditions });
    res.status(200).json({ charities });
  } catch (error) {
    console.error("Error fetching charities:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

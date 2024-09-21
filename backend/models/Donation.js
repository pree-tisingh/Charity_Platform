const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');
const User = require('./User'); 
const Charity = require('./Charity'); 

const Donation = sequelize.define('Donation', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  amount: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  receiptUrl: {
    type: Sequelize.STRING, // URL to download the receipt
    allowNull: true
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User, 
      key: 'id',
    },
  },
  charityId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Charity, 
      key: 'id',
    },
  },
  paymentId: {
    type: Sequelize.STRING,
  },
  orderId: {
    type: Sequelize.STRING,
  },
  signature: {
    type: Sequelize.STRING,
  }
});

module.exports = Donation;

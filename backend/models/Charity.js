const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const Charity = sequelize.define('Charity', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isApproved:{
    type:DataTypes.BOOLEAN,
    defaultValue:false,
  }, 
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  mission: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  goals: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  projects: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dateEstablished: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  logoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {});

module.exports = Charity;

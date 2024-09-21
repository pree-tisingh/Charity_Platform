const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require('sequelize');

exports.signup = async (req, res) => {
    const { name, email, password, phone, role } = req.body; // Add role to request body
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "User Already Exists" });
      }
  
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name,
        email,
        password: hashPassword,
        phone,
        role: role || 'user' // Assign 'user' as the default role if not provided
      });
  
      const token = jwt.sign({ id: newUser.id, role: newUser.role ,email: newUser.email}, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(201).json({ token, id: newUser.id, role: newUser.role,email: newUser.email }); 
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error", error });
    }
  };
  

  exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res.status(400).json({ message: "Please enter both email and password" });
      }
  
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: "Invalid email id" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid Password" });
      }
  
      const token = jwt.sign({ id: user.id, role: user.role , email: user.email}, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role  // Include role in the response
        }
      });
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

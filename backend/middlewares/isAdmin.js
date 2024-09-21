const jwt = require('jsonwebtoken');

const isAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'Access denied, admin only.' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Failed to authenticate token' });
  }
};

module.exports = isAdmin;
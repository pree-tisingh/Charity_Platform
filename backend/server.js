const express = require('express');
const sequelize = require('./utils/database'); 
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profile');
const donationRoutes = require('./routes/donateRoutes');
const CharityRoutes = require('./routes/charityRoutes');
const impact = require('./routes/impactRoutes');
const adminRoutes = require('./routes/adminRoutes');
const verifyToken = require('./middlewares/auth');
const cors = require('cors');
const path = require('path');
const sendEmail = require('./utils/emailService');

dotenv.config();

const app = express();
app.use(cors()); 
app.use(express.json());
app.use('/receipts', express.static(path.join(__dirname, 'receipts')));
app.use('/api/auth', authRoutes); 
app.use('/api', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', donationRoutes);
app.use('/api/charities' , CharityRoutes);
app.use('/api/impact', impact);
app.get('/', (req, res) => {
  res.send('Welcome to the Charity Donation Platform API');
});
app.post('/send-notification', async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).send('Missing required fields');
  }

  try {
    await sendEmail(to, subject, message);
    res.status(200).send('Notification sent successfully');
  } catch (error) {
    res.status(500).send('Failed to send notification');
  }
});
const PORT = process.env.PORT || 5000;

sequelize.sync({alter:true})
  .then(() => {
    console.log('Database connected and synced...');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log('Error syncing the database: ', err);
  });

const Razorpay = require("razorpay");
const Donation = require("../models/Donation"); 
const Charity = require("../models/Charity");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const sendEmail = require("../utils/emailService");
const generateReceipt = require("../utils/generateReceipt"); 
const sequelize = require('../utils/database'); // Import Sequelize instance

// Initialize Razorpay instance with key_id and key_secret from environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Fetch all donations for the user
exports.getDonations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch donations made by the user
    const donations = await Donation.findAll({ where: { userId } });

    res.status(200).json({ donations });
  } catch (error) {
    console.error("Error fetching donation history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create Razorpay order
exports.createOrder = async (req, res) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: amount * 100, // Razorpay expects the amount in the smallest currency unit (paise for INR)
      currency: "INR",
      receipt: `receipt_${Date.now()}`, // Generate a unique receipt ID
    };

    // Create Razorpay order
    const order = await razorpay.orders.create(options);
    res.status(200).json(order); // Send order details to the frontend
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Error creating payment order" });
  }
};
exports.addDonation = async (req, res) => {
  const {
    amount,
    charityId,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
  } = req.body;

  try {
    const userId = req.user?.id; // Optional chaining to avoid undefined errors
    const userEmail = req.user?.email;

    // Debugging
    console.log("User data in controller:", req.user);

    // Debugging: Log userEmail
    if (!userEmail) {
      console.error("User email is missing");
      return res.status(400).json({ message: "User email not found" });
    }

    // Verify Razorpay signature
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Retrieve the charity details
    const charity = await Charity.findByPk(charityId);
    if (!charity) {
      return res.status(404).json({ message: 'Charity not found' });
    }

    // Create the donation entry
    const newDonation = await Donation.create({
      amount,
      userId,
      charityId,
      paymentId: razorpayPaymentId,
      orderId: razorpayOrderId,
      signature: razorpaySignature,
    });

    // Generate receipt path
    const receiptPath = generateReceipt(newDonation);
    newDonation.receiptUrl = receiptPath;
    await newDonation.save();

    // Construct the email
    const charityName = charity.name;
    const subject = "Donation Confirmation";
    const message = `
      Dear Donor,

      Thank you for your generous donation of ₹${amount} to ${charityName}. We truly appreciate your support.

      Donation Details:
      - Amount: ₹${amount}
      - Charity: ${charityName}
      - Payment ID: ${razorpayPaymentId}

      You can download your donation receipt here: ${receiptPath}

      Best regards,
      Charity Donation Platform Team
    `;

    // Log email details before sending
    console.log("Preparing to send email...");
    console.log("To:", userEmail);
    console.log("Subject:", subject);
    console.log("Message:", message);

    // Send email
    await sendEmail(userEmail, subject, message);

    // Respond with the new donation
    res.status(201).json(newDonation);
  } catch (error) {
    console.error("Error adding donation:", error.message);
    res.status(500).json({ message: "Error adding donation" });
  }
};

// Download receipt for a specific donation
exports.downloadReceipt = async (req, res) => {
  const donationId = req.params.donationId;

  try {
    const donation = await Donation.findByPk(donationId);

    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    // Generate the receipt and get the path
    const receiptPath = await generateReceipt(donation);

    // Check if the file exists before sending
    if (fs.existsSync(receiptPath)) {
      res.download(receiptPath, `receipt-${donationId}.pdf`, (err) => {
        if (err) {
          console.error("Error downloading receipt:", err);
          res.status(500).json({ error: "Could not download receipt" });
        }
      });
    } else {
      res.status(404).json({ error: "Receipt file not found" });
    }
  } catch (error) {
    console.error("Error fetching donation or generating receipt:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

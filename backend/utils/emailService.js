require('dotenv').config();
const mailjet = require('node-mailjet').apiConnect(
  process.env.YOUR_API_KEY, 
  process.env.YOUR_API_SECRET
);

const sendEmail = async (to, subject, message) => {
  try {
    console.log("Preparing to send email...");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Message:", message);

    const request = mailjet.post("send", { 'version': 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: "preeti1709singh@gmail.com", // Ensure this is verified in Mailjet
            Name: "Preeti Singh"
          },
          To: [
            {
              Email: to, // Ensure recipient email is valid
              Name: "Recipient Name"
            }
          ],
          Subject: subject, // Email subject
          TextPart: message, // Simplified message for testing
          CustomID: "DonationReceipt" // Custom ID to track email in Mailjet logs
        }
      ]
    });

    const result = await request;
    console.log('Email sent successfully:', result.body);
  } catch (err) {
    console.error("Error sending email:", err.statusCode, err.response ? JSON.stringify(err.response.body) : err.message);
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;

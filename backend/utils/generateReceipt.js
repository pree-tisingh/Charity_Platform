const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const generateReceipt = (donation) => {
  const receiptDir = path.join(__dirname, '../receipts'); // Path to the receipts directory
  const receiptPath = path.join(receiptDir, `receipt-${donation.id}.pdf`);

  // Check if the directory exists, if not, create it
  if (!fs.existsSync(receiptDir)) {
    fs.mkdirSync(receiptDir, { recursive: true });
  }

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(receiptPath));

  doc.text(`Receipt for Donation: ${donation.amount}`, { align: 'center' });
  doc.text(`Donor: ${donation.userId}`, { align: 'center' });
  doc.text(`Charity: ${donation.charityId}`, { align: 'center' });
  doc.text(`Date: ${donation.date}`, { align: 'center' });

  doc.end();

  return receiptPath;
};

module.exports = generateReceipt; // Export the function

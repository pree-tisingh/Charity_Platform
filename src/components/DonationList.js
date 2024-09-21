import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/DonationList.css';

// Utility function to format the amount in Indian Rupees (INR)
const formatAmountInRupees = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const DonationList = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        const response = await axios.get('http://localhost:5000/api/donations', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });
        setDonations(response.data);
      } catch (error) {
        console.error('Error fetching donations', error);
      }
    };

    fetchDonations();
  }, []);

  // Function to handle receipt download
  const downloadReceipt = async (donationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/download-receipt/${donationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', // Important: this tells axios to handle the response as a blob (binary)
      });

      // Create a URL for the blob and force download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${donationId}.pdf`); // Set the download attribute with a file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Cleanup
    } catch (error) {
      console.error('Error downloading receipt', error);
    }
  };

  return (
    <div className="donation-list">
      <h1>All Donations</h1>
      <ul>
        {donations.map((donation) => (
          <li key={donation.id}>
            <p>Amount: {formatAmountInRupees(donation.amount)}</p>
            <p>User ID: {donation.userId}</p>
            <p>Charity ID: {donation.charityId}</p>
            <p>Date: {new Date(donation.date).toLocaleDateString()}</p>
            {/* Add a button to download the receipt */}
            <button
              className="download-receipt-button"
              onClick={() => downloadReceipt(donation.id)}
            >
              Download Receipt
            </button>
          </li>
        ))}
      </ul>
      
      {/* Add Donation Button */}
      <div className="add-donation-button">
        <Link to="/add-donation" className="add-donation-link">Add Donation</Link>
      </div>
    </div>
  );
};

export default DonationList;

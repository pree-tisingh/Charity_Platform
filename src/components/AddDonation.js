import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import "../styles/AddDonation.css"; // Ensure this file exists

const AddDonation = () => {
  const [amount, setAmount] = useState(""); // Amount in rupees
  const [charityId, setCharityId] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Get state from the location object

  useEffect(() => {
    // Prefill charity ID if it was passed via navigation state
    if (location.state && location.state.charityId) {
      setCharityId(location.state.charityId);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      // Step 1: Create Razorpay order by sending amount to backend
      const response = await axios.post(
        "http://localhost:5000/api/create-order",
        { amount: amount * 100, currency: "INR" }, // Convert amount to paise and set currency to INR
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { id: orderId, currency, amount: orderAmount } = response.data; // orderAmount is in paise

      // Step 2: Configure Razorpay payment options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderAmount, // Amount is already in paise (received from backend)
        currency: currency,
        name: "Charity Donation",
        description: "Donate to charity",
        order_id: orderId,
        handler: async (response) => {
          try {
            await axios.post(
              "http://localhost:5000/api/donations",
              {
                amount: orderAmount / 100, // Convert amount from paise to rupees for storing in the database
                charityId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            alert("Donation successful!");
            navigate("/donations"); // Redirect to donations list page
          } catch (error) {
            console.error("Error completing donation:", error);
            alert("Error completing donation. Please try again.");
          }
        },
        prefill: {
          name: "", // Optionally prefill with user's name and email
          email: "",
        },
        theme: {
          color: "#3399cc",
        },
      };

      // Step 4: Open the Razorpay payment window
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Error creating donation order. Please try again.");
    }
  };

  return (
    <div className="add-donation">
      <h1>Add Donation</h1>
      <div className="d1">
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Amount (INR)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Charity ID"
            value={charityId}
            onChange={(e) => setCharityId(e.target.value)}
            required
            disabled={!!charityId} // Disable the field if charityId is prefilled
          />
          <button type="submit">Add Donation</button>
        </form>
      </div>
    </div>
  );
};

export default AddDonation;

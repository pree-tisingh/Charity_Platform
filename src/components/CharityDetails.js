// CharityDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Use navigate for redirection
import axios from 'axios';
import '../styles/CharityDetail.css';

const CharityDetail = () => {
  const { id } = useParams(); // Extract the charity ID from the URL
  const [charity, setCharity] = useState(null);
  const navigate = useNavigate(); // Use navigate for handling routing

  useEffect(() => {
    const fetchCharityDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/charities/${id}`);
        setCharity(response.data.charity);
      } catch (error) {
        console.error('Error fetching charity details', error);
      }
    };

    fetchCharityDetail();
  }, [id]);

  // Redirect to donation page with charity ID
  const handleDonate = () => {
    navigate(`/add-donation`, { state: { charityId: id } }); // Pass charity ID via state
  };

  if (!charity) {
    return <p>Loading...</p>;
  }

  return (
    <div className='d1'>
      <h1>{charity.name}</h1>
      <p>{charity.mission}</p>
      <p>Category: {charity.category}</p>
      <p>Location: {charity.location}</p>
      <p>Goals: {charity.goals}</p>
      
      {/* Donation Button */}
      <button onClick={handleDonate} className='btn-donate'>Donate</button>
    </div>
  );
};

export default CharityDetail;

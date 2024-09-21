import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          },
        });

        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile data", err);
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = () => {
    navigate('/update-profile'); // Navigate to UpdateProfile component
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <p>Name: {profile.name}</p>
      <p>Email: {profile.email}</p>
      <p>Phone: {profile.phone}</p>
      <button onClick={handleEditClick}>Edit</button> 
    </div>
  );
};

export default Profile;

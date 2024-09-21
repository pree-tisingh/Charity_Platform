import { useState } from 'react';
import axios from 'axios';
import "../../styles/UpdateProfile.css";
import { useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); 

      if (!token) {
        throw new Error('No token found');
      }

      await axios.put('http://localhost:5000/api/profile', 
        { name, email, phone }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      alert('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile', error);
      alert('Error updating profile');
    }
  };

  return (
    <div className="update-profile">
      <h1>Update Profile</h1>
      <div className="center">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button type="submit">Update</button>
      </form>
      </div>
    </div>
  );
};

export default UpdateProfile;

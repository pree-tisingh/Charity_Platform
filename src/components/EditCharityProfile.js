import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/EditCharityProfile.css';

const EditCharityProfile = () => {
  const { id } = useParams(); // Get charity ID from URL
  const navigate = useNavigate(); // For redirecting after update
  const [charity, setCharity] = useState({
    name: '',
    mission: '',
    goals: '',
    projects: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharity = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        const response = await axios.get(`http://localhost:5000/api/charities/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the Authorization header
          },
        });
        setCharity(response.data.charity);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching charity data', error);
      }
    };

    fetchCharity();
  }, [id]);

  const handleChange = (e) => {
    setCharity({
      ...charity,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/charities/${id}`, charity, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the Authorization header
        },
      });
      alert('Charity profile updated successfully!');
      navigate(`/charity/${id}`); // Redirect back to charity profile after update
    } catch (error) {
      console.error('Error updating charity profile', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-charity-profile">
      <h1>Edit Charity Profile</h1>
         <div className="d2">
         <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Charity Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={charity.name}
            onChange={handleChange}
            placeholder="Charity Name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="mission">Mission</label>
          <textarea
            id="mission"
            name="mission"
            value={charity.mission}
            onChange={handleChange}
            placeholder="Mission"
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="goals">Goals</label>
          <textarea
            id="goals"
            name="goals"
            value={charity.goals}
            onChange={handleChange}
            placeholder="Goals"
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="projects">Projects</label>
          <textarea
            id="projects"
            name="projects"
            value={charity.projects}
            onChange={handleChange}
            placeholder="Projects"
            required
          ></textarea>
        </div>
        <button type="submit">Update Charity</button>
      </form>
         </div>
    </div>
  );
};

export default EditCharityProfile;

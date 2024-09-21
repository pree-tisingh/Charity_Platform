import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/CharityRegistration.css';

const CharityRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mission: '',
    goals: '',
    projects: '',
    category: '',
    location: '',
    website: '',
    phoneNumber: '',
    dateEstablished: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Validate inputs before submission
  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'A valid email is required';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await axios.post(
        'http://localhost:5000/api/charities/register',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { id } = response.data.charity;
      alert('Charity registered successfully!');
      navigate(`/charity/${id}`);
    } catch (error) {
      console.error('Error registering charity', error);
      alert('Error registering charity. Please try again.');
    }
  };

  return (
    <div className="charity-registration">
      <h1>Register Charity</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <textarea
          name="mission"
          placeholder="Mission"
          value={formData.mission}
          onChange={handleChange}
        ></textarea>

        <textarea
          name="goals"
          placeholder="Goals"
          value={formData.goals}
          onChange={handleChange}
        ></textarea>

        <textarea
          name="projects"
          placeholder="Projects"
          value={formData.projects}
          onChange={handleChange}
        ></textarea>

        <input
          type="text"
          name="category"
          placeholder="Category (optional)"
          value={formData.category}
          onChange={handleChange}
        />

        <input
          type="text"
          name="location"
          placeholder="Location (optional)"
          value={formData.location}
          onChange={handleChange}
        />

        <input
          type="url"
          name="website"
          placeholder="Website (optional)"
          value={formData.website}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number (optional)"
          value={formData.phoneNumber}
          onChange={handleChange}
        />

        <input
          type="date"
          name="dateEstablished"
          placeholder="Date Established (optional)"
          value={formData.dateEstablished}
          onChange={handleChange}
        />

        <button type="submit">Register Charity</button>
      </form>
    </div>
  );
};

export default CharityRegistration;

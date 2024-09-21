import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();
  
  // State for token and display name
  const [token, setToken] = useState(null);
  const [displayName, setDisplayName] = useState("Guest");

  // Check if user is logged in and retrieve token, username, or name from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedName = localStorage.getItem('name'); // Assuming 'name' is also stored

    setToken(storedToken);

    // Prioritize username, then name, and finally set a default value if neither is found
    if (storedUsername) {
      setDisplayName(storedUsername);
    } else if (storedName) {
      setDisplayName(storedName);
    } else {
      setDisplayName("User!!");  // Default fallback
    }
  }, []); // This runs only once when the component mounts

  const isLoggedIn = !!token; // True if token exists, false otherwise

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('name');
    setToken(null);
    setDisplayName("Guest");
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div className="home-container">
      {/* Top-right corner links */}
      <div className="top-right-links">
        <p>Hello, {displayName}</p> {/* Display the username, name, or fallback */}

        {isLoggedIn ? (
          <button onClick={handleLogout} className="home-link">Logout</button>
        ) : (
          <p>Please signup  or login if you have already registered</p>
        )}
      </div>

      <h1>Welcome to Charity Donation Platform</h1>
      <p>Your one-stop solution for making and managing donations.</p>

      <div className="home-links">
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="home-link">Profile</Link>
            <Link to="/donations" className="home-link">Donations</Link>
            <Link to="/register-charity" className="home-link">Charities Registration</Link>
            <Link to="/charities" className="home-link">Charities</Link>
          </>
        ) : (
          <>
            <Link to="/signup" className="home-link">Sign Up</Link>
            <Link to="/login" className="home-link">Login</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '../styles/CharityList.css'; // Import your CSS file

const CharityList = () => {
  const [charities, setCharities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch charities based on search term (includes category, location, and name)
    const fetchCharities = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/charities", {
          params: { search: searchTerm }, // Search across name, category, and location
        });
        setCharities(response.data.charities);
      } catch (error) {
        console.error("Error fetching charities", error);
      }
    };

    fetchCharities();
  }, [searchTerm]);

  const handleSearch = () => {
    // Trigger search when button is clicked
    setSearchTerm(searchTerm);
  };

  return (
    <div className="charity-list-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name, category, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <ul className="charity-list">
        {charities.map((charity) => (
          <li key={charity.id}>
            <Link to={`/charities/${charity.id}`}>
              <h3>{charity.name}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CharityList;

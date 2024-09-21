import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import '../styles/CharityProfile.css';

const CharityProfile = () => {
  const { id } = useParams(); // Get charity ID from URL
  const [charity, setCharity] = useState({});
  const [loading, setLoading] = useState(true);
  const [impactReports, setImpactReports] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    const fetchCharity = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        const response = await axios.get(`http://localhost:5000/api/charities/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });
  
        // Log the response to check its structure
        console.log('Charity response:', response.data);
  
        // Set the charity state with the correct data
        setCharity(response.data.charity);
        // Make sure response.data matches what you're expecting
  
        // Fetch impact reports
        const reportsResponse = await axios.get(`http://localhost:5000/api/impact/${id}/reports`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });
        setImpactReports(reportsResponse.data.reports);
  
        setLoading(false);
      } catch (error) {
        console.error('Error fetching charity profile', error);
      }
    };
  
    fetchCharity();
  }, [id]);

  const handleCreateReport = async () => {
    setReportLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/impact/${id}/reports`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh the impact reports list after creating a new report
      const response = await axios.get(`http://localhost:5000/api/impact/${id}/reports`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setImpactReports(response.data.reports);
      setTitle(''); // Clear title input
      setContent(''); // Clear content input
    } catch (error) {
      console.error('Error creating impact report', error);
    } finally {
      setReportLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="charity-profile">
      <h1>{charity.name}</h1>
      <p>Mission: {charity.mission || 'No mission available'}</p>
      <p>Goals: {charity.goals || 'No goals available'}</p>
      <p>Projects: {charity.projects || 'No projects available'}</p>
      <Link to={`/charity/${id}/edit`}>
        <button>Edit Profile</button>
      </Link>
      
      <div className="impact-reports">
        <h2>Impact Reports</h2>
        <ul>
          {impactReports.length > 0 ? (
            impactReports.map((report, index) => (
              <li key={index}>{report.title}: {report.content}</li>
            ))
          ) : (
            <p>No impact reports available</p>
          )}
        </ul>
  
        <div className="create-report">
          <h3>Create New Impact Report</h3>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Report Title"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your impact report here..."
          />
          <button onClick={handleCreateReport} disabled={reportLoading}>
            {reportLoading ? 'Creating...' : 'Create Report'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharityProfile;

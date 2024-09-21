import React, { useState, useEffect } from 'react';
import '../styles/AdminDashboard.css';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [charities, setCharities] = useState([]);
  const [approve, setApprove] = useState([]);

  // Fetch users and charities
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data.users);
        setCharities(response.data.charities);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };
    fetchData();
  }, []);

  // Fetch approvals
  useEffect(() => {
    const fetchList = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin/approve', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApprove(response.data);
      } catch (error) {
        console.log('Failed to fetch data', error);
      }
    };
    fetchList();
  }, []);

  // Handle charity approval
  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/admin/charities/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCharities(charities.filter(charity => charity.id !== id));
    } catch (error) {
      console.error('Failed to approve charity', error);
    }
  };

  // Handle charity rejection
  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/admin/charities/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCharities(charities.filter(charity => charity.id !== id));
    } catch (error) {
      console.error('Failed to reject charity', error);
    }
  };

  return (
    <div className="d1">
      <h1>Admin Dashboard</h1>

      <div className="cont">
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} ({user.email})</li>
        ))}
      </ul>

      <h2>Approved Charities</h2>
      <ul>
        {approve.map(approvedCharity => (
          <li key={approvedCharity.id}>{approvedCharity.name}</li>
        ))}
      </ul>

      <h2>Pending Charity Approvals</h2>
      <ul>
        {charities.map(charity => (
          <li key={charity.id}>
            {charity.name} ({charity.email})
            <button onClick={() => handleApprove(charity.id)}>Approve</button>
            <button onClick={() => handleReject(charity.id)}>Reject</button>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;

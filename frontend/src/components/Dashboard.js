import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const agreedToTerms = localStorage.getItem('agreedToTerms');

    if (!token) {
      navigate('/login');
      return;
    }

    if (!agreedToTerms) {
      navigate('/signup');
      return;
    }

    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to Tracevia Dashboard</h1>
        {user && <p>Hello, {user.username}!</p>}
      </header>
      
      <main className="dashboard-content">
        <div className="welcome-section">
          <h2>Getting Started</h2>
          <p>Welcome to your Tracevia dashboard! You can now access all features.</p>
        </div>
        
        <div className="features-section">
          <h3>Available Features</h3>
          <ul>
            <li>Device Management</li>
            <li>Location Tracking</li>
            <li>Analytics & Reports</li>
            <li>User Settings</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

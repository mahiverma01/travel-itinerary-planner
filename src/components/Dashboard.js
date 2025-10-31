import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleSettings = () => {
    navigate('/profile');
  };

  const handleExplore = () => {
    navigate('/countries');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Travel Itinerary Planner</h1>
        <button className="settings-btn" onClick={handleSettings}>⚙️</button>
      </header>
      
      <div className="hero-section">
        <img 
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200" 
          alt="Travel" 
          className="hero-image"
        />
        <div className="hero-content">
          <h2>Plan Your Perfect Trip</h2>
          <p>Discover amazing destinations and create unforgettable memories</p>
          
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search for places you want to visit..."
            />
            <button>Search</button>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <button className="action-btn primary" onClick={handleExplore}>
          Explore Countries
        </button>
        <button className="action-btn secondary">
          My Trips
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
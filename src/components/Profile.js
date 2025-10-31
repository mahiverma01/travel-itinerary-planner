import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile">
      <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
      
      <div className="profile-content">
        <h1>Profile & Settings</h1>
        
        <div className="profile-section">
          <h3>User Information</h3>
          <div className="user-info">
            <p><strong>Username:</strong> {currentUser?.username}</p>
            <p><strong>User ID:</strong> {currentUser?.userId}</p>
          </div>
        </div>

        <div className="profile-section">
          <h3>History</h3>
          <div className="history-list">
            <p>Your trip history will appear here</p>
          </div>
        </div>

        <div className="profile-section">
          <h3>Account Actions</h3>
          <div className="account-actions">
            <button className="logout-btn" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
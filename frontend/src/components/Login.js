import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // Use state for errors instead of alerts
  const [formData, setFormData] = useState({
    name: '', // For signup
    email: '', // For both login and signup
    password: ''
  });

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear previous errors
    
    try {
      console.log('Attempting:', isLogin ? 'Login' : 'Signup', formData);
      
      // Use correct endpoints and field names
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      
      // Prepare data according to backend expectations
      const requestData = isLogin 
        ? { email: formData.email, password: formData.password } // Login data
        : { name: formData.name, email: formData.email, password: formData.password }; // Signup data
      
      const response = await axios.post(`http://localhost:5000/api${endpoint}`, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      });
      
      console.log('Response received:', response.data);
      
      if (response.data.success) {
        if (isLogin) {
          // Login successful - NO ALERT
          login(response.data.user, response.data.token);
          // Silent redirect - no alert
          window.location.href = '/dashboard';
        } else {
          // Signup successful - NO ALERT
          setIsLogin(true); // Switch to login form
          setFormData({ name: '', email: '', password: '' }); // Clear form
          setError(''); // Clear any errors
        }
      } else {
        setError(response.data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Full error details:', error);
      
      let errorMessage = 'An error occurred. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Please make sure backend is running on port 5000.';
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage); // Use state instead of alert
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        
        {/* Error message display */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          )}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              minLength="6"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className={loading ? 'loading' : ''}
          >
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>
        
        <p className="toggle-text">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => !loading && setIsLogin(!isLogin)} 
            className="toggle-link"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
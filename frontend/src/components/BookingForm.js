import React, { useState } from 'react';
import './BookingForm.css';

const BookingForm = ({ destination }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    adults: 1,
    children: 0,
    accommodation: 'standard',
    specialRequests: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking submitted:', formData);
    // Handle booking logic here
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="booking-form-container">
      <div className="destination-header">
        <h1>Book Your Trip to {destination}</h1>
        <div className="destination-info">
          <div className="country-tag">
            <span className="flag">🇫🇷</span>
            {destination}
          </div>
          <p className="description">
            Known for its romantic ambiance, exquisite cuisine, and rich history 
            including the Eiffel Tower and Louvre Museum.
          </p>
          <div className="destination-features">
            <span className="feature">
              📝 Paris
            </span>
            <span className="feature">
              🟐 Euro
            </span>
            <span className="feature safe">
              🟑 Safe
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-section">
          <h3>Trip Dates</h3>
          <div className="date-inputs">
            <div className="input-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Travelers</h3>
          <div className="traveler-inputs">
            <div className="input-group">
              <label>Adults</label>
              <select
                name="adults"
                value={formData.adults}
                onChange={handleChange}
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Children</label>
              <select
                name="children"
                value={formData.children}
                onChange={handleChange}
              >
                {[0, 1, 2, 3, 4].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Accommodation Type</h3>
          <div className="accommodation-options">
            {['standard', 'deluxe', 'luxury'].map(type => (
              <label key={type} className="radio-option">
                <input
                  type="radio"
                  name="accommodation"
                  value={type}
                  checked={formData.accommodation === type}
                  onChange={handleChange}
                />
                <span className="radio-custom"></span>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>Special Requests</h3>
          <div className="input-group">
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              placeholder="Any special requirements or preferences..."
              rows="4"
            />
          </div>
        </div>

        <button type="submit" className="confirm-button">
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
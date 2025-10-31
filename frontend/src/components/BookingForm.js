// frontend/src/components/BookingForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // CHANGED: Import useAuth instead of AuthContext
import './BookingForm.css';

const BookingForm = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // CHANGED: Use the useAuth hook
  
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tripLoading, setTripLoading] = useState(true);
  
  const [bookingData, setBookingData] = useState({
    travelerDetails: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      passportNumber: ''
    },
    paymentInfo: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardHolder: ''
    },
    specialRequests: ''
  });

  // Fetch trip details
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5000/api/trips/${tripId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (response.data.success) {
          setTrip(response.data.trip);
          // Pre-fill traveler email with user's email
          setBookingData(prev => ({
            ...prev,
            travelerDetails: {
              ...prev.travelerDetails,
              email: user?.email || '',
              firstName: user?.name?.split(' ')[0] || '',
              lastName: user?.name?.split(' ')[1] || ''
            }
          }));
        }
      } catch (error) {
        console.error('Error fetching trip:', error);
        alert('Error loading trip details');
      } finally {
        setTripLoading(false);
      }
    };

    if (tripId && user) {
      fetchTrip();
    }
  }, [tripId, user]);

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value
      }
    }));
  };

  const handleBookTrip = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Validation
      if (!bookingData.travelerDetails.firstName || 
          !bookingData.travelerDetails.lastName || 
          !bookingData.travelerDetails.email || 
          !bookingData.travelerDetails.phone) {
        alert('Please fill in all required traveler details');
        setLoading(false);
        return;
      }

      console.log('Sending booking data:', {
        tripId,
        ...bookingData
      });

      const response = await axios.post(
        'http://localhost:5000/api/bookings',
        {
          tripId,
          ...bookingData
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Booking response:', response.data);

      if (response.data.success) {
        alert('Trip booked successfully!');
        navigate('/booking-confirmation', { 
          state: { booking: response.data.booking } 
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
      console.error('Error response:', error.response?.data);
      alert(error.response?.data?.message || 'Failed to book trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (tripLoading) {
    return <div className="loading">Loading trip details...</div>;
  }

  if (!trip) {
    return <div className="error">Trip not found</div>;
  }

  return (
    <div className="booking-form-container">
      <h2>Book Your Trip: {trip.title}</h2>
      
      {/* Trip Summary */}
      <div className="trip-summary">
        <h3>Trip Summary</h3>
        <p><strong>Destination:</strong> {trip.destinations?.[0]?.name || 'Not specified'}</p>
        <p><strong>Dates:</strong> {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
        <p><strong>Total Amount:</strong> ${trip.budget?.total || 0}</p>
      </div>

      <form onSubmit={handleBookTrip} className="booking-form">
        {/* Traveler Details */}
        <div className="form-section">
          <h3>Traveler Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={bookingData.travelerDetails.firstName}
                onChange={(e) => handleInputChange(e, 'travelerDetails')}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={bookingData.travelerDetails.lastName}
                onChange={(e) => handleInputChange(e, 'travelerDetails')}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={bookingData.travelerDetails.email}
                onChange={(e) => handleInputChange(e, 'travelerDetails')}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={bookingData.travelerDetails.phone}
                onChange={(e) => handleInputChange(e, 'travelerDetails')}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={bookingData.travelerDetails.dateOfBirth}
                onChange={(e) => handleInputChange(e, 'travelerDetails')}
              />
            </div>
            <div className="form-group">
              <label>Passport Number</label>
              <input
                type="text"
                name="passportNumber"
                value={bookingData.travelerDetails.passportNumber}
                onChange={(e) => handleInputChange(e, 'travelerDetails')}
              />
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="form-section">
          <h3>Payment Information</h3>
          <div className="form-group">
            <label>Card Holder Name *</label>
            <input
              type="text"
              name="cardHolder"
              value={bookingData.paymentInfo.cardHolder}
              onChange={(e) => handleInputChange(e, 'paymentInfo')}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Card Number *</label>
            <input
              type="text"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={bookingData.paymentInfo.cardNumber}
              onChange={(e) => handleInputChange(e, 'paymentInfo')}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Expiry Date *</label>
              <input
                type="text"
                name="expiryDate"
                placeholder="MM/YY"
                value={bookingData.paymentInfo.expiryDate}
                onChange={(e) => handleInputChange(e, 'paymentInfo')}
                required
              />
            </div>
            <div className="form-group">
              <label>CVV *</label>
              <input
                type="text"
                name="cvv"
                placeholder="123"
                value={bookingData.paymentInfo.cvv}
                onChange={(e) => handleInputChange(e, 'paymentInfo')}
                required
              />
            </div>
          </div>
        </div>

        {/* Special Requests */}
        <div className="form-section">
          <h3>Special Requests</h3>
          <textarea
            name="specialRequests"
            placeholder="Any special requirements or requests..."
            value={bookingData.specialRequests}
            onChange={(e) => setBookingData(prev => ({
              ...prev,
              specialRequests: e.target.value
            }))}
            rows="4"
          />
        </div>

        <button 
          type="submit" 
          className="book-btn"
          disabled={loading}
        >
          {loading ? 'Processing Booking...' : `Confirm Booking - $${trip.budget?.total || 0}`}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
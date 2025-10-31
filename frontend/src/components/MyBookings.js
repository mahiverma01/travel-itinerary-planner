import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './MyBookings.css';

const MyBookings = () => {
    const { currentUser, token } = useAuth(); // Added token
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (currentUser && token) {
            fetchBookings();
        }
    }, [currentUser, token]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/bookings/my-bookings', {
                method: 'GET', // CHANGED from POST to GET
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // ADDED authorization header
                }
                // REMOVED: body: JSON.stringify({ userId: currentUser.userId })
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch bookings');
            }
            
            const data = await response.json();
            
            if (data.success) {
                setBookings(data.bookings || []); // CHANGED: data.bookings instead of just data
            } else {
                setBookings([]);
            }
            
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setError('Failed to load bookings');
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            'pending': 'status-pending',
            'confirmed': 'status-confirmed',
            'cancelled': 'status-cancelled',
            'completed': 'status-completed'
        };
        
        const displayStatus = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending';
        
        return <span className={`status-badge ${statusClasses[status] || 'status-pending'}`}>
            {displayStatus}
        </span>;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="my-bookings-container">
                <div className="loading">Loading your bookings...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-bookings-container">
                <div className="error-message">{error}</div>
                <button onClick={fetchBookings} className="retry-btn">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="my-bookings-container">
            <div className="bookings-header">
                <h1>My Bookings</h1>
                <p>Manage your travel plans and view booking details</p>
            </div>

            {bookings.length === 0 ? (
                <div className="no-bookings">
                    <h3>No bookings yet</h3>
                    <p>Start planning your next adventure!</p>
                    <Link to="/countries" className="explore-btn">
                        Explore Countries
                    </Link>
                </div>
            ) : (
                <div className="bookings-list">
                    {bookings.map(booking => (
                        <div key={booking._id} className="booking-card">
                            <div className="booking-header">
                                <div className="booking-info">
                                    <h3>{booking.trip?.title || 'Unnamed Trip'}</h3>
                                    <p className="booking-ref">
                                        Reference: {booking.bookingReference || 'N/A'}
                                    </p>
                                </div>
                                {getStatusBadge(booking.status)}
                            </div>

                            <div className="booking-details">
                                <div className="detail-group">
                                    <strong>Booking Date:</strong>
                                    <span>{formatDate(booking.bookingDate)}</span>
                                </div>
                                <div className="detail-group">
                                    <strong>Trip Dates:</strong>
                                    <span>
                                        {formatDate(booking.trip?.startDate)} - {formatDate(booking.trip?.endDate)}
                                    </span>
                                </div>
                                <div className="detail-group">
                                    <strong>Travelers:</strong>
                                    <span>
                                        {booking.travelerDetails ? 
                                            `${booking.travelerDetails.firstName} ${booking.travelerDetails.lastName}` 
                                            : 'Not specified'
                                        }
                                    </span>
                                </div>
                                <div className="detail-group">
                                    <strong>Total Amount:</strong>
                                    <span className="cost">${booking.totalAmount || booking.trip?.budget?.total || 0}</span>
                                </div>
                            </div>

                            <div className="booking-actions">
                                <Link 
                                    to={`/booking-confirmation/${booking._id}`} 
                                    className="view-details-btn"
                                >
                                    View Details
                                </Link>
                                {booking.status === 'pending' && (
                                    <button className="cancel-btn">
                                        Cancel Booking
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
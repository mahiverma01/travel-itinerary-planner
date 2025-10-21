import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './MyBookings.css';

const MyBookings = () => {
    const { currentUser } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            fetchBookings();
        }
    }, [currentUser]);

    const fetchBookings = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/bookings/my-bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: currentUser.userId })
            });
            
            const data = await response.json();
            setBookings(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            'Pending': 'status-pending',
            'Confirmed': 'status-confirmed',
            'Cancelled': 'status-cancelled',
            'Completed': 'status-completed'
        };
        
        return <span className={`status-badge ${statusClasses[status]}`}>{status}</span>;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return <div className="loading">Loading your bookings...</div>;
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
                                    <h3>{booking.country?.name}</h3>
                                    <p className="booking-ref">
                                        Reference: {booking.bookingReference}
                                    </p>
                                </div>
                                {getStatusBadge(booking.status)}
                            </div>

                            <div className="booking-details">
                                <div className="detail-group">
                                    <strong>Dates:</strong>
                                    <span>
                                        {formatDate(booking.tripDetails.startDate)} - {formatDate(booking.tripDetails.endDate)}
                                    </span>
                                </div>
                                <div className="detail-group">
                                    <strong>Travelers:</strong>
                                    <span>
                                        {booking.tripDetails.travelers.adults} Adult(s), 
                                        {booking.tripDetails.travelers.children} Child(ren)
                                    </span>
                                </div>
                                <div className="detail-group">
                                    <strong>Accommodation:</strong>
                                    <span>{booking.tripDetails.accommodation}</span>
                                </div>
                                <div className="detail-group">
                                    <strong>Total Cost:</strong>
                                    <span className="cost">${booking.totalCost}</span>
                                </div>
                            </div>

                            <div className="booking-actions">
                                <Link 
                                    to={`/booking-confirmation/${booking._id}`} 
                                    className="view-details-btn"
                                >
                                    View Details
                                </Link>
                                {booking.status === 'Pending' && (
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
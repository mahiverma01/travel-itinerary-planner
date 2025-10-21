import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './BookingConfirmation.css';

const BookingConfirmation = () => {
    const { bookingId } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`);
                const data = await response.json();
                setBooking(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching booking:', error);
                setLoading(false);
            }
        };

        fetchBooking();
    }, [bookingId]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const printConfirmation = () => {
        window.print();
    };

    if (loading) {
        return <div className="loading">Loading booking details...</div>;
    }

    if (!booking) {
        return <div className="error">Booking not found</div>;
    }

    return (
        <div className="confirmation-container">
            <div className="confirmation-header">
                <h1>Booking Confirmation</h1>
                <button onClick={printConfirmation} className="print-btn">
                    🖨️ Print Confirmation
                </button>
            </div>

            <div className="confirmation-card">
                <div className="confirmation-header-section">
                    <div className="confirmation-title">
                        <h2>Travel Itinerary Confirmed!</h2>
                        <p className="confirmation-number">
                            Confirmation #: <strong>{booking.bookingReference}</strong>
                        </p>
                    </div>
                    <div className={`status-badge status-${booking.status.toLowerCase()}`}>
                        {booking.status}
                    </div>
                </div>

                <div className="confirmation-details">
                    <div className="detail-section">
                        <h3>Trip Details</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <strong>Destination:</strong>
                                <span>{booking.country?.name}</span>
                            </div>
                            <div className="detail-item">
                                <strong>Dates:</strong>
                                <span>
                                    {formatDate(booking.tripDetails.startDate)} - {formatDate(booking.tripDetails.endDate)}
                                </span>
                            </div>
                            <div className="detail-item">
                                <strong>Duration:</strong>
                                <span>
                                    {Math.ceil((new Date(booking.tripDetails.endDate) - new Date(booking.tripDetails.startDate)) / (1000 * 60 * 60 * 24))} days
                                </span>
                            </div>
                            <div className="detail-item">
                                <strong>Travelers:</strong>
                                <span>
                                    {booking.tripDetails.travelers.adults} Adult(s), 
                                    {booking.tripDetails.travelers.children} Child(ren)
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3>Cost Summary</h3>
                        <div className="cost-details">
                            <div className="cost-item">
                                <span>Total Cost:</span>
                                <span className="total-cost">${booking.totalCost}</span>
                            </div>
                            <div className="cost-item">
                                <span>Payment Status:</span>
                                <span className={`payment-status ${booking.paymentStatus.toLowerCase()}`}>
                                    {booking.paymentStatus}
                                </span>
                            </div>
                        </div>
                    </div>

                    {booking.itinerary && booking.itinerary.length > 0 && (
                        <div className="detail-section">
                            <h3>Proposed Itinerary</h3>
                            <div className="itinerary">
                                {booking.itinerary.map(day => (
                                    <div key={day.day} className="itinerary-day">
                                        <h4>Day {day.day} - {formatDate(day.date)}</h4>
                                        <div className="activities">
                                            {day.activities.map((activity, index) => (
                                                <div key={index} className="activity">
                                                    <span className="activity-time">{activity.time}</span>
                                                    <span className="activity-details">
                                                        <strong>{activity.activity}</strong>
                                                        {activity.location && ` at ${activity.location}`}
                                                        {activity.notes && ` (${activity.notes})`}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {booking.specialRequests && (
                        <div className="detail-section">
                            <h3>Special Requests</h3>
                            <p className="special-requests">{booking.specialRequests}</p>
                        </div>
                    )}
                </div>

                <div className="confirmation-footer">
                    <p>
                        <strong>Thank you for booking with Travel Itinerary Planner!</strong><br />
                        We're excited to help you plan your adventure to {booking.country?.name}. 
                        You will receive a detailed itinerary and travel tips via email shortly.
                    </p>
                    <div className="contact-info">
                        <p>Need help? Contact us at support@travelitinerary.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmation;
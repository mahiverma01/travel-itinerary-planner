// routes/bookings.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Country = require('../models/Country');
const auth = require('../middleware/auth');

// Get all bookings for authenticated user
router.get('/my-bookings', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('country')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            bookings
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
});

// Create new booking (PROTECTED)
router.post('/', auth, async (req, res) => {
    try {
        console.log('Booking request user:', req.user._id); // Debug log
        console.log('Booking data:', req.body); // Debug log

        const {
            countryId,
            startDate,
            endDate,
            travelers,
            budget,
            accommodation,
            specialRequests
        } = req.body;

        // Validate required fields
        if (!countryId || !startDate || !endDate) {
            return res.status(400).json({ 
                success: false,
                message: 'Country, start date, and end date are required' 
            });
        }

        // Validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (start >= end) {
            return res.status(400).json({ 
                success: false,
                message: 'End date must be after start date' 
            });
        }

        // Calculate trip duration
        const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        // Get country details for cost calculation
        const country = await Country.findById(countryId);
        if (!country) {
            return res.status(404).json({ 
                success: false,
                message: 'Country not found' 
            });
        }

        // Calculate total cost
        const dailyCost = country.budget?.daily || 100;
        const totalTravelers = (travelers?.adults || 1) + (travelers?.children || 0);
        const totalCost = dailyCost * duration * totalTravelers;

        // Generate itinerary
        const itinerary = [];
        for (let i = 1; i <= duration; i++) {
            const currentDate = new Date(start);
            currentDate.setDate(start.getDate() + i - 1);
            
            itinerary.push({
                day: i,
                date: currentDate,
                activities: [
                    {
                        time: '09:00 AM',
                        activity: 'Breakfast',
                        location: 'Hotel',
                        notes: ''
                    },
                    {
                        time: '10:00 AM',
                        activity: 'Explore local attractions',
                        location: 'City Center',
                        notes: 'Guided tour available'
                    }
                ]
            });
        }

        const booking = new Booking({
            user: req.user._id, // Use authenticated user ID
            country: countryId,
            tripDetails: {
                startDate: start,
                endDate: end,
                travelers: travelers || { adults: 1, children: 0 },
                budget: budget || totalCost,
                accommodation: accommodation || 'Standard'
            },
            itinerary,
            totalCost,
            specialRequests: specialRequests || ''
        });

        await booking.save();
        
        // Populate country details in response
        await booking.populate('country');

        res.status(201).json({
            success: true,
            message: 'Booking created successfully!',
            booking: booking,
            confirmationNumber: booking.bookingReference
        });

    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error: ' + error.message 
        });
    }
});

// Get booking by ID (PROTECTED - user can only access their own bookings)
router.get('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('country');
        
        if (!booking) {
            return res.status(404).json({ 
                success: false,
                message: 'Booking not found' 
            });
        }

        // Check if user owns the booking
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ 
                success: false,
                message: 'Access denied' 
            });
        }

        res.json({
            success: true,
            booking
        });
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
});

// Update booking status (PROTECTED)
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        
        const booking = await Booking.findOne({ 
            _id: req.params.id, 
            user: req.user._id 
        });

        if (!booking) {
            return res.status(404).json({ 
                success: false,
                message: 'Booking not found' 
            });
        }

        booking.status = status;
        await booking.save();
        
        await booking.populate('country');

        res.json({ 
            success: true,
            message: 'Booking status updated', 
            booking 
        });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
});

// Cancel booking (PROTECTED)
router.delete('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findOne({ 
            _id: req.params.id, 
            user: req.user._id 
        });

        if (!booking) {
            return res.status(404).json({ 
                success: false,
                message: 'Booking not found' 
            });
        }

        booking.status = 'Cancelled';
        await booking.save();

        res.json({ 
            success: true,
            message: 'Booking cancelled successfully' 
        });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
});

module.exports = router;
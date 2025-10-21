const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Country = require('../models/Country');
const auth = require('../middleware/auth'); // We'll create this

// Get all bookings for a user
router.get('/my-bookings', async (req, res) => {
    try {
        // For now, using user ID from request body - later add proper auth
        const bookings = await Booking.find({ user: req.body.userId })
            .populate('country')
            .sort({ createdAt: -1 });
        
        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new booking
router.post('/', async (req, res) => {
    try {
        const {
            userId,
            countryId,
            startDate,
            endDate,
            travelers,
            budget,
            accommodation,
            specialRequests
        } = req.body;

        // Validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (start >= end) {
            return res.status(400).json({ message: 'End date must be after start date' });
        }

        // Calculate trip duration
        const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        // Get country details for cost calculation
        const country = await Country.findById(countryId);
        if (!country) {
            return res.status(404).json({ message: 'Country not found' });
        }

        // Calculate total cost (simplified calculation)
        const dailyCost = country.budget?.daily || 100;
        const totalTravelers = (travelers.adults || 1) + (travelers.children || 0);
        const totalCost = dailyCost * duration * totalTravelers;

        // Generate itinerary (sample structure)
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
            user: userId,
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
            message: 'Booking created successfully!',
            booking: booking,
            confirmationNumber: booking.bookingReference
        });

    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('country')
            .populate('user', 'username email');
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update booking status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('country');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json({ message: 'Booking status updated', booking });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Cancel booking
router.delete('/:id', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: 'Cancelled' },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
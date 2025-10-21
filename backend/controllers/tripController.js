const Trip = require('../models/Trip');

// Cost data for different destinations
const costData = {
  france: {
    currency: 'EUR',
    categories: {
      accommodation: { perNight: 120, type: 'perNight' },
      food: { perDay: 60, type: 'perDay' },
      transport: { total: 300, type: 'fixed' },
      activities: { perDay: 40, type: 'perDay' },
      miscellaneous: { total: 200, type: 'fixed' }
    }
  },
  japan: {
    currency: 'JPY',
    categories: {
      accommodation: { perNight: 15000, type: 'perNight' },
      food: { perDay: 5000, type: 'perDay' },
      transport: { total: 35000, type: 'fixed' },
      activities: { perDay: 8000, type: 'perDay' },
      miscellaneous: { total: 15000, type: 'fixed' }
    }
  },
  thailand: {
    currency: 'THB',
    categories: {
      accommodation: { perNight: 1500, type: 'perNight' },
      food: { perDay: 800, type: 'perDay' },
      transport: { total: 5000, type: 'fixed' },
      activities: { perDay: 1200, type: 'perDay' },
      miscellaneous: { total: 3000, type: 'fixed' }
    }
  },
  usa: {
    currency: 'USD',
    categories: {
      accommodation: { perNight: 150, type: 'perNight' },
      food: { perDay: 70, type: 'perDay' },
      transport: { total: 400, type: 'fixed' },
      activities: { perDay: 60, type: 'perDay' },
      miscellaneous: { total: 250, type: 'fixed' }
    }
  }
};

// Calculate budget function
const calculateBudget = (destination, duration, travelers) => {
  const destinationKey = destination.toLowerCase();
  const data = costData[destinationKey] || costData.france;
  
  const breakdown = {
    currency: data.currency,
    total: 0,
    categories: []
  };

  // Calculate each category
  Object.entries(data.categories).forEach(([category, config]) => {
    let amount = 0;
    
    switch (config.type) {
      case 'perNight':
        amount = config.perNight * (duration - 1) * travelers.adults;
        break;
      case 'perDay':
        amount = config.perDay * duration * travelers.adults;
        break;
      case 'fixed':
        amount = config.total;
        break;
      default:
        amount = 0;
    }

    // Add children costs (50% of adult costs)
    if (travelers.children > 0) {
      switch (config.type) {
        case 'perNight':
          amount += config.perNight * 0.5 * (duration - 1) * travelers.children;
          break;
        case 'perDay':
          amount += config.perDay * 0.5 * duration * travelers.children;
          break;
      }
    }

    breakdown.categories.push({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      amount: Math.round(amount),
      type: config.type
    });
    
    breakdown.total += amount;
  });

  breakdown.total = Math.round(breakdown.total);
  return breakdown;
};

// Create new trip
exports.createTrip = async (req, res) => {
  try {
    const { destination, startDate, endDate, travelers, accommodation, specialRequests } = req.body;
    
    // Calculate trip duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    // Calculate budget
    const budgetEstimate = calculateBudget(destination, duration, travelers);
    
    const trip = new Trip({
      user: req.userId,
      destination,
      startDate,
      endDate,
      travelers,
      accommodation,
      specialRequests,
      budgetEstimate,
      costData: {
        destination,
        duration,
        travelers
      }
    });

    await trip.save();
    
    // Populate user details if needed
    await trip.populate('user', 'name email');
    
    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      trip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating trip',
      error: error.message
    });
  }
};

// Get all trips for a user
exports.getUserTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .populate('user', 'name email');
    
    res.json({
      success: true,
      trips
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching trips',
      error: error.message
    });
  }
};

// Get single trip
exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('user', 'name email');
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    
    // Check if user owns the trip
    if (trip.user._id.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.json({
      success: true,
      trip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching trip',
      error: error.message
    });
  }
};

// Update trip
exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    
    // Check if user owns the trip
    if (trip.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Recalculate budget if destination, dates, or travelers change
    if (req.body.destination || req.body.startDate || req.body.endDate || req.body.travelers) {
      const destination = req.body.destination || trip.destination;
      const startDate = req.body.startDate ? new Date(req.body.startDate) : trip.startDate;
      const endDate = req.body.endDate ? new Date(req.body.endDate) : trip.endDate;
      const travelers = req.body.travelers || trip.travelers;
      
      const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      const budgetEstimate = calculateBudget(destination, duration, travelers);
      
      req.body.budgetEstimate = budgetEstimate;
      req.body.costData = {
        destination,
        duration,
        travelers
      };
    }
    
    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name email');
    
    res.json({
      success: true,
      message: 'Trip updated successfully',
      trip: updatedTrip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating trip',
      error: error.message
    });
  }
};

// Delete trip
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    
    // Check if user owns the trip
    if (trip.user.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    await Trip.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Trip deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting trip',
      error: error.message
    });
  }
};
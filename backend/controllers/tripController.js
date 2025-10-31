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
  },
  // Add more default destinations
  italy: {
    currency: 'EUR',
    categories: {
      accommodation: { perNight: 100, type: 'perNight' },
      food: { perDay: 50, type: 'perDay' },
      transport: { total: 250, type: 'fixed' },
      activities: { perDay: 35, type: 'perDay' },
      miscellaneous: { total: 150, type: 'fixed' }
    }
  },
  spain: {
    currency: 'EUR',
    categories: {
      accommodation: { perNight: 80, type: 'perNight' },
      food: { perDay: 40, type: 'perDay' },
      transport: { total: 200, type: 'fixed' },
      activities: { perDay: 30, type: 'perDay' },
      miscellaneous: { total: 120, type: 'fixed' }
    }
  }
};

// Calculate budget function
const calculateBudget = (destination, duration, travelers) => {
  if (!destination || !duration || !travelers) {
    return {
      currency: 'USD',
      total: 0,
      categories: []
    };
  }

  const destinationKey = destination.toLowerCase().replace(/\s+/g, '');
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

// Create new trip - FIXED VERSION
exports.createTrip = async (req, res) => {
  try {
    console.log('Received trip data:', req.body); // Debug log
    console.log('User ID:', req.user.id); // Debug log

    const { 
      title, 
      destinations, 
      budget, 
      notes, 
      startDate, 
      endDate,
      travelers 
    } = req.body;

    // Validation - UPDATED
    if (!title || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Title, start date, and end date are required'
      });
    }

    // Calculate duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Calculate budget if destination provided
    let budgetEstimate = budget;
    if (destinations && destinations.length > 0 && travelers) {
      const mainDestination = destinations[0].name || destinations[0];
      budgetEstimate = calculateBudget(mainDestination, duration, travelers);
    }

    const trip = new Trip({
      user: req.user.id, // CHANGED from req.userId to req.user.id
      title,
      destinations: destinations || [],
      budget: budgetEstimate || budget || { total: 0, currency: 'USD' },
      notes: notes || '',
      startDate,
      endDate,
      travelers: travelers || { adults: 1, children: 0 },
      duration
    });

    await trip.save();
    
    console.log('Trip saved successfully:', trip._id);

    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      trip
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating trip',
      error: error.message
    });
  }
};

// Get all trips for a user - FIXED
exports.getUserTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id }) // CHANGED to req.user.id
      .sort({ createdAt: -1 });
    
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

// Get single trip - FIXED
exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    
    // Check if user owns the trip
    if (trip.user.toString() !== req.user.id) { // CHANGED to req.user.id
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

// Update trip - FIXED
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
    if (trip.user.toString() !== req.user.id) { // CHANGED to req.user.id
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
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

// Delete trip - FIXED
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
    if (trip.user.toString() !== req.user.id) {
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

// Get budget estimate (optional helper endpoint)
exports.getBudgetEstimate = async (req, res) => {
  try {
    const { destination, duration, travelers } = req.body;
    
    if (!destination || !duration || !travelers) {
      return res.status(400).json({
        success: false,
        message: 'Destination, duration, and travelers are required'
      });
    }

    const budgetEstimate = calculateBudget(destination, duration, travelers);
    
    res.json({
      success: true,
      budgetEstimate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating budget',
      error: error.message
    });
  }
};
const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  // Basic trip information
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Trip dates
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  
  // Travelers information
  travelers: {
    adults: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    children: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  
  // Accommodation details
  accommodation: {
    type: String,
    enum: ['standard', 'deluxe', 'luxury'],
    default: 'standard'
  },
  
  // Special requests
  specialRequests: {
    type: String,
    trim: true
  },
  
  // Budget estimation (automatically calculated)
  budgetEstimate: {
    total: Number,
    currency: String,
    categories: [{
      name: String,
      amount: Number,
      type: String
    }],
    calculatedAt: {
      type: Date,
      default: Date.now
    }
  },
  
  // Cost data used for calculation
  costData: {
    destination: String,
    duration: Number,
    travelers: {
      adults: Number,
      children: Number
    }
  },
  
  // Trip status
  status: {
    type: String,
    enum: ['planned', 'booked', 'in-progress', 'completed', 'cancelled'],
    default: 'planned'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
tripSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate duration in days (virtual field)
tripSchema.virtual('duration').get(function() {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end days
  }
  return 0;
});

// Ensure virtual fields are serialized
tripSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Trip', tripSchema);
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    tripDetails: {
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        travelers: {
            adults: {
                type: Number,
                default: 1
            },
            children: {
                type: Number,
                default: 0
            }
        },
        budget: Number,
        accommodation: {
            type: String,
            enum: ['Budget', 'Standard', 'Luxury'],
            default: 'Standard'
        }
    },
    itinerary: [{
        day: Number,
        date: Date,
        activities: [{
            time: String,
            activity: String,
            location: String,
            notes: String
        }]
    }],
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
        default: 'Pending'
    },
    bookingReference: {
        type: String,
        unique: true
    },
    totalCost: Number,
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Refunded'],
        default: 'Pending'
    },
    specialRequests: String
}, {
    timestamps: true
});

// Generate booking reference before saving
bookingSchema.pre('save', async function(next) {
    if (this.isNew) {
        const count = await mongoose.model('Booking').countDocuments();
        this.bookingReference = `TRV${Date.now()}${count}`;
    }
    next();
});

module.exports = mongoose.model('Booking', bookingSchema);
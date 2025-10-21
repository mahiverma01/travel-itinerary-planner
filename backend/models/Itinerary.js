const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    country: {
        type: String,
        required: true
    },
    duration: {
        days: Number,
        nights: Number
    },
    budget: Number,
    activities: [{
        day: Number,
        activity: String,
        time: String,
        location: String
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Itinerary', itinerarySchema);
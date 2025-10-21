const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    description: String,
    capital: String,
    currency: String,
    language: String,
    image: {
        type: String,
        default: ''
    },
    budget: {
        daily: Number,
        currency: String
    },
    bestTimeToVisit: [String],
    popularAttractions: [String],
    visaRequired: {
        type: Boolean,
        default: false
    },
    safetyLevel: {
        type: String,
        enum: ['Very Safe', 'Safe', 'Moderate', 'Caution Advised'],
        default: 'Moderate'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Country', countrySchema);
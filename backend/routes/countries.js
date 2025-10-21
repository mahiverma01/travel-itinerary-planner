const express = require('express');
const router = express.Router();
const Country = require('../models/Country');

// Get all countries
router.get('/', async (req, res) => {
    try {
        const countries = await Country.find();
        res.json(countries);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single country
router.get('/:id', async (req, res) => {
    try {
        const country = await Country.findById(req.params.id);
        if (!country) {
            return res.status(404).json({ message: 'Country not found' });
        }
        res.json(country);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add new country (admin feature)
router.post('/', async (req, res) => {
    try {
        const country = new Country(req.body);
        await country.save();
        res.status(201).json(country);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
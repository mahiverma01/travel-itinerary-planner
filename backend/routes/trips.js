// routes/trips.js
const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const auth = require('../middleware/auth');

// Apply auth middleware to all trip routes
router.post('/', auth, tripController.createTrip);
router.get('/', auth, tripController.getUserTrips);
router.get('/:id', auth, tripController.getTrip);
router.put('/:id', auth, tripController.updateTrip);
router.delete('/:id', auth, tripController.deleteTrip);
router.post('/budget-estimate', auth, tripController.getBudgetEstimate);

module.exports = router;
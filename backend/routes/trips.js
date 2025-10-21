const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const auth = require('../middleware/auth');

// All routes are protected
router.use(auth);

// Trip routes
router.post('/', tripController.createTrip);
router.get('/', tripController.getUserTrips);
router.get('/:id', tripController.getTrip);
router.put('/:id', tripController.updateTrip);
router.delete('/:id', tripController.deleteTrip);

module.exports = router;
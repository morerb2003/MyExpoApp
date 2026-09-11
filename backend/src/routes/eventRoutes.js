const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { validateEventCreation } = require('../middleware/validate');

router.get('/', eventController.getAllEvents);
router.post('/', validateEventCreation, eventController.createEvent);

router.get('/:id', eventController.getEventById);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;

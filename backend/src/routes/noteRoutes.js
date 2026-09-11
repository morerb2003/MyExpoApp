const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const { validateNoteCreation } = require('../middleware/validate');

router.get('/', noteController.getAllNotes);
router.post('/', validateNoteCreation, noteController.createNote);

router.get('/:id', noteController.getNoteById);
router.put('/:id', noteController.updateNote);
router.patch('/:id/pin', noteController.togglePin);
router.delete('/:id', noteController.deleteNote);

module.exports = router;

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { validateTaskCreation, validateTaskUpdate } = require('../middleware/validate');

router.get('/', taskController.getAllTasks);
router.post('/', validateTaskCreation, taskController.createTask);

router.get('/:id', taskController.getTaskById);
router.put('/:id', validateTaskUpdate, taskController.updateTask);
router.patch('/:id/toggle', taskController.toggleTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;

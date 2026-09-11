const express = require('express');
const router = express.Router();
const workspaceController = require('../controllers/workspaceController');

router.get('/', workspaceController.getWorkspace);
router.get('/dashboard', workspaceController.getDashboardSummary);
router.put('/settings', workspaceController.updateSettings);
router.post('/reset', workspaceController.resetWorkspace);

module.exports = router;

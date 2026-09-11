const express = require('express');
const router = express.Router();

const taskRoutes = require('./taskRoutes');
const noteRoutes = require('./noteRoutes');
const eventRoutes = require('./eventRoutes');
const teamRoutes = require('./teamRoutes');
const workspaceRoutes = require('./workspaceRoutes');

// API Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'Worko API Backend',
  });
});

// Mount modular sub-routes
router.use('/tasks', taskRoutes);
router.use('/notes', noteRoutes);
router.use('/events', eventRoutes);
router.use('/team', teamRoutes);
router.use('/workspace', workspaceRoutes);

module.exports = router;

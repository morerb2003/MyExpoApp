const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/env');
const apiRoutes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: config.corsOrigin === '*' ? true : config.corsOrigin,
    credentials: true,
  })
);

// Request logger
if (config.nodeEnv !== 'test') {
  app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
}

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    app: 'Worko API Server',
    version: '1.0.0',
    description: 'Complete Backend API Service for Worko Workspace & Productivity Mobile App',
    endpoints: {
      health: '/api/health',
      tasks: '/api/tasks',
      notes: '/api/notes',
      events: '/api/events',
      team: '/api/team',
      workspace: '/api/workspace',
      dashboard: '/api/workspace/dashboard',
    },
    docs: 'https://github.com/morerb2003/MyExpoApp',
  });
});

// API Routes
app.use('/api', apiRoutes);

// Catch 404
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

module.exports = app;

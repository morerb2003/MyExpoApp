const app = require('./app');
const config = require('./config/env');
const { connectDB } = require('./config/db');

async function startServer() {
  try {
    // Attempt database connection if URI configured
    await connectDB();

    const server = app.listen(config.port, () => {
      console.log('====================================================');
      console.log(`🚀 Worko Backend API Server is running!`);
      console.log(`📡 Environment: ${config.nodeEnv}`);
      console.log(`🌐 Local URL:   http://localhost:${config.port}`);
      console.log(`🩺 Healthcheck: http://localhost:${config.port}/api/health`);
      console.log(`📋 API Docs:    http://localhost:${config.port}/api/tasks`);
      console.log('====================================================');
    });

    const shutdown = (signal) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Promise Rejection:', err);
      // Keep server alive or exit cleanly
    });

    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
      process.exit(1);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

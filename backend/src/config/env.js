const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  mongoUri: process.env.MONGODB_URI || '',
  databaseUrl: process.env.DATABASE_URL || '',
  pg: {
    host: process.env.PG_HOST || process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PG_PORT || process.env.PGPORT || '5432', 10),
    database: process.env.PG_DATABASE || process.env.PGDATABASE || 'worko_db',
    user: process.env.PG_USER || process.env.PGUSER || 'postgres',
    password: process.env.PG_PASSWORD || process.env.PGPASSWORD || 'postgres',
  },
};

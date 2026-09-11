const { Pool } = require('pg');
const config = require('./env');

const poolConfig =
  process.env.DATABASE_URL && !process.env.PG_PASSWORD
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.PG_HOST || process.env.PGHOST || 'localhost',
        port: parseInt(process.env.PG_PORT || process.env.PGPORT || '5432', 10),
        database: process.env.PG_DATABASE || process.env.PGDATABASE || 'worko_db',
        user: process.env.PG_USER || process.env.PGUSER || 'postgres',
        password: process.env.PG_PASSWORD || process.env.PGPASSWORD || 'postgres',
      };

const pool = new Pool({
  ...poolConfig,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[PostgreSQL] Unexpected error on idle client:', err);
});

async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  return res;
}

async function getClient() {
  return await pool.connect();
}

async function testConnection() {
  try {
    const res = await query('SELECT current_database(), current_user, version()');
    console.log('[PostgreSQL] Connected successfully to database:', res.rows[0].current_database);
    return true;
  } catch (err) {
    console.warn('[PostgreSQL] Connection warning:', err.message);
    return false;
  }
}

module.exports = {
  pool,
  query,
  getClient,
  testConnection,
};

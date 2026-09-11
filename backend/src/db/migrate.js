const fs = require('fs');
const path = require('path');
const { pool, testConnection } = require('../config/postgres');

async function runMigration() {
  const shouldSeed = process.argv.includes('--seed');

  console.log('====================================================');
  console.log('🐘 Running PostgreSQL Migration for Worko (worko_db)');
  console.log('====================================================');

  const client = await pool.connect();
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Unable to connect to PostgreSQL database. Please check your connection details.');
    }

    const schemaPath = path.join(__dirname, 'schema.sql');
    console.log(`\n📄 Reading schema from: ${schemaPath}`);
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

    console.log('🚀 Applying schema migration...');
    await client.query('BEGIN');
    await client.query(schemaSql);
    await client.query('COMMIT');
    console.log('✅ Schema migration completed successfully!');

    if (shouldSeed) {
      const seedPath = path.join(__dirname, 'seed.sql');
      console.log(`\n🌱 Reading seed data from: ${seedPath}`);
      const seedSql = fs.readFileSync(seedPath, 'utf-8');
      console.log('🚀 Seeding initial records...');
      await client.query(seedSql);
      console.log('✅ Seed data applied successfully!');
    }

    // Verify and list tables
    const tableQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    const tablesRes = await client.query(tableQuery);
    console.log('\n📊 Tables in public schema:');
    tablesRes.rows.forEach((r, idx) => console.log(`   ${idx + 1}. ${r.table_name}`));

    // Verify foreign keys to users
    const fkQuery = `
      SELECT
          tc.table_name, 
          kcu.column_name, 
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name 
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_schema = 'public'
        AND ccu.table_name = 'users';
    `;
    const fksRes = await client.query(fkQuery);
    console.log('\n🔗 Foreign key relationships linked to users (user_id):');
    fksRes.rows.forEach((r) => {
      console.log(`   ✓ ${r.table_name}.${r.column_name} -> ${r.foreign_table_name}.${r.foreign_column_name}`);
    });

    console.log('\n✨ Database migration and setup complete!');
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('\n❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();

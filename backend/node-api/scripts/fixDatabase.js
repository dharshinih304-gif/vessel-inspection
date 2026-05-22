const sequelize = require('../config/database');

async function fixDatabase() {
  try {
    console.log('Adding missing columns to Vessels table...');
    await sequelize.query('ALTER TABLE "Vessels" ADD COLUMN IF NOT EXISTS "status" VARCHAR(255) DEFAULT \'ACTIVE\'');
    await sequelize.query('ALTER TABLE "Vessels" ADD COLUMN IF NOT EXISTS "flag" VARCHAR(255)');
    console.log('Database fix completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to fix database:', err.message);
    process.exit(1);
  }
}

fixDatabase();

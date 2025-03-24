import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!);

async function runMigration() {
  try {
    console.log('Running database migrations...');
    
    // Read SQL files
    const healthRecordTableSQL = fs.readFileSync(
      path.join(process.cwd(), 'db', 'create_health_record_table.sql'),
      'utf8'
    );
    
    const leaveRequestTableSQL = fs.readFileSync(
      path.join(process.cwd(), 'db', 'create_leave_request_table.sql'),
      'utf8'
    );
    
    // Run migrations
    console.log('Creating HealthRecord table...');
    await sql.unsafe(healthRecordTableSQL);
    console.log('HealthRecord table created successfully.');
    
    console.log('Creating LeaveRequest table...');
    await sql.unsafe(leaveRequestTableSQL);
    console.log('LeaveRequest table created successfully.');
    
    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigration(); 
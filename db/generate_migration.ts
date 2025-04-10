import 'dotenv/config';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

console.log('Generating migrations from schema changes...');

// Ensure migrations directory exists
const migrationsDir = path.join(process.cwd(), 'lib', 'drizzle');
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
  console.log(`Created migrations directory at ${migrationsDir}`);
}

// Run drizzle-kit generate command
const command = 'npx drizzle-kit generate:pg --schema=./db/schema.ts --out=./lib/drizzle';

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing command: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`Command stderr: ${stderr}`);
  }
  
  console.log(`Command stdout: ${stdout}`);
  console.log('Migration files generated successfully!');
  console.log(`\nNext steps:
1. Review the generated migration files in ${migrationsDir}
2. Run the update script with: npm run update-db`);
}); 
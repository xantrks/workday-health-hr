import { sql } from '@/lib/db';
import { promises as fs } from 'fs';
import path from 'path';

async function runMigration() {
  try {
    // 读取migrations目录下的所有SQL文件
    const migrationsDir = path.join(process.cwd(), 'db', 'migrations');
    const files = await fs.readdir(migrationsDir);
    
    // 按文件名排序以确保正确的执行顺序
    const sqlFiles = files
      .filter((f: string) => f.endsWith('.sql'))
      .sort();
    
    console.log('Running migrations...');
    
    for (const file of sqlFiles) {
      const filePath = path.join(migrationsDir, file);
      const content = await fs.readFile(filePath, 'utf8');
      
      console.log(`Executing ${file}...`);
      try {
        // 使用模板字符串执行 SQL
        await sql`${content}`;
        console.log(`Completed ${file}`);
      } catch (error) {
        console.error(`Error executing ${file}:`, error);
        throw error;
      }
    }

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();

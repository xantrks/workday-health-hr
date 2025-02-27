import { neon } from '@neondatabase/serverless';
import { Redis } from '@upstash/redis';
import { drizzle } from 'drizzle-orm/neon-http';

// 检查环境变量
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error(
    '缺少 Redis 配置。请确保设置了 UPSTASH_REDIS_REST_URL 和 UPSTASH_REDIS_REST_TOKEN 环境变量。' +
    '如果您在本地开发，请检查 .env.local 文件；' +
    '如果在 Vercel 上部署，请在项目设置中添加这些环境变量。'
  );
}

// PostgreSQL connection
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);

// Redis connection
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

// 添加连接测试
async function testConnection() {
  try {
    const result = await sql`SELECT 1`;
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

// 只在开发环境下测试连接
if (process.env.NODE_ENV === 'development') {
  testConnection();
}

export { sql }; 
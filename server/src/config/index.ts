import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables based on NODE_ENV
const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = nodeEnv === 'production' ? '.env.production' : '.env';
const envPath = path.join(__dirname, '../../', envFile);

try {
  dotenv.config({ path: envPath });
} catch (error) {
  console.warn(`Could not load ${envFile}, using environment variables`);
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  logLevel: process.env.LOG_LEVEL || 'info',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  isProd: process.env.NODE_ENV === 'production',
};

// Validate required environment variables
if (!config.geminiApiKey) {
  const message = '❌ CRITICAL: GEMINI_API_KEY is not set. Set it as an environment variable.';
  console.error(message);
  if (config.isProd) {
    throw new Error(message);
  }
}

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/index.js';
import { initializeGeminiClient } from './config/gemini.js';
import geminiRoutes from './routes/geminiRoutes.js';

const app: Express = express();

// Initialize Gemini Client
try {
  initializeGeminiClient();
  console.log('✅ Gemini API client initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Gemini API client:', error);
  process.exit(1);
}

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  (config.corsOrigin || '').replace(/\/$/, ''), // Remove trailing slash
  'https://samiulla-resume.netlify.app',
  'http://localhost:3000',
  'http://localhost:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        callback(null, true);
      } else {
        // Normalize origin (remove trailing slash for comparison)
        const normalizedOrigin = origin.replace(/\/$/, '');
        const isAllowed = allowedOrigins.some(allowedOrigin => 
          allowedOrigin.replace(/\/$/, '') === normalizedOrigin
        );
        
        if (isAllowed) {
          callback(null, true);
        } else {
          console.warn(`⚠️ CORS blocked request from origin: ${origin}`);
          callback(null, true); // Allow all for now
        }
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
  })
);

// Health check for load balancers
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging middleware
app.use(morgan(config.isDev ? 'dev' : 'combined'));

// Request ID middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  req.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  res.setHeader('X-Request-ID', req.id);
  next();
});

// API routes
app.use('/api/ai', geminiRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'AI Resume Builder API v1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/ai/health',
      generateCareerObjective: 'POST /api/ai/generate/career-objective',
      generateRoleResponsibilities: 'POST /api/ai/generate/role-responsibilities',
      generateSkills: 'POST /api/ai/generate/skills',
      generateImprovements: 'POST /api/ai/generate/improvements',
      generateClarificationQuestions: 'POST /api/ai/generate/clarification-questions',
      generateResumeSection: 'POST /api/ai/generate/resume-section',
      generateProjectDescription: 'POST /api/ai/generate/project-description',
      generateAchievementDescription: 'POST /api/ai/generate/achievement-description',
      generateAwardDescription: 'POST /api/ai/generate/award-description',
      validateATSCompliance: 'POST /api/ai/validate/ats-compliance',
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    method: req.method,
  });
});

// Error handling middleware
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', error);
  res.status(error.status || 500).json({
    error: 'Internal Server Error',
    message: config.isDev ? error.message : 'An error occurred',
    requestId: req.id,
  });
});

// Start server
const PORT = config.port;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Client URL: ${config.clientUrl}`);
  console.log(`✅ Ready for requests\n`);
});

// Graceful shutdown handler
const gracefulShutdown = () => {
  console.log('\n⏹️  Shutdown signal received...');
  server.close(() => {
    console.log('✅ Server closed gracefully');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('❌ Forced shutdown - connections still open');
    process.exit(1);
  }, 10000);
};

// Graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Unhandled error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Declare module augmentation for Request
declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}

export default app;

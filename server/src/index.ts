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
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

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
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Client URL: ${config.clientUrl}\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
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

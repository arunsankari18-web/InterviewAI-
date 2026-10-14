import http from 'http';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { config } from './config/index.js';
import { initDatabase } from './database/store.js';
import { initSocketService } from './services/socket.service.js';

// Route Imports
import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import companyRoutes from './routes/company.routes.js';
import interviewRoutes from './routes/interview.routes.js';
import resumeDefenseRoutes from './routes/resumeDefense.routes.js';
import technicalRoutes from './routes/technical.routes.js';
import autopsyRoutes from './routes/autopsy.routes.js';
import readinessRoutes from './routes/readiness.routes.js';
import challengeRoutes from './routes/challenge.routes.js';
import adminRoutes from './routes/admin.routes.js';
import chatRoutes from './routes/chat.routes.js';

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health Checks
app.get('/', (req, res) => {
  res.json({
    name: 'Interview AI - API Engine',
    status: 'online',
    tagline: 'Practice like the interview is real.',
    version: '1.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/resume-defense', resumeDefenseRoutes);
app.use('/api/technical', technicalRoutes);
app.use('/api/autopsy', autopsyRoutes);
app.use('/api/readiness', readinessRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: err.message || 'Internal server error in Interview AI backend'
  });
});

// Initialize DB & Sockets
async function bootstrap() {
  await initDatabase();
  initSocketService(io);

  server.listen(config.port, () => {
    console.log(`🚀 Interview AI Backend running on http://localhost:${config.port}`);
  });
}

bootstrap().catch(err => {
  console.error('Failed to start server:', err);
});

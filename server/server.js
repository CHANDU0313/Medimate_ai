import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import healthRoutes from './routes/health.js';
import chatRoutes from './routes/chat.js';
import symptomRoutes from './routes/symptoms.js';
import { isAIConfigured } from './services/geminiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../client/dist');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// 1. Security Headers via Helmet
app.use(helmet({
  contentSecurityPolicy: false, // Let frontend handle CSP in development
  crossOriginEmbedderPolicy: false
}));

// 2. CORS restricted to client origin
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Vite server-to-server proxy)
    if (!origin) return callback(null, true);
    if (origin === CLIENT_ORIGIN || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Body parser with strict size limit (protects against DOS/flooding)
app.use(express.json({ limit: '100kb' }));

// 4. Rate Limiter on all /api routes
app.use('/api', apiRateLimiter);

// 5. Mount API Routes
app.use('/api/health', healthRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/symptoms', symptomRoutes);

// 6. Serve static React client in production if client/dist exists
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // Root informational endpoint when running in development
  app.get('/', (req, res) => {
    res.json({
      name: 'MediMate AI Backend API',
      tagline: 'Your health questions, explained simply.',
      status: 'running',
      aiStatus: isAIConfigured() ? 'Gemini AI Connected' : 'Demo Mode Active (Pre-written responses)',
      docs: 'Endpoints: GET /api/health, POST /api/chat, POST /api/symptoms'
    });
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  // Never log health details or sensitive payloads
  console.error('[Server Error]', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error occurred.'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(` MediMate AI Server running on port ${PORT}`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(` Mode: ${isAIConfigured() ? '🟢 LIVE AI (Google Gemini)' : '🟡 DEMO MODE (Pre-written high-quality samples)'}`);
  console.log(` Emergency Safety Checker: 🛡️ ACTIVE (English, Telugu, Hindi)`);
  console.log(`======================================================\n`);
});

export default app;

import dotenv from 'dotenv';
// Load env early so modules that import on load (like firebase admin) see env vars
dotenv.config();

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { initializeDiscordBot } from './services/discord';
import { logger } from './utils/logger';

// Defer importing routes that may initialize firebase until after env is loaded
const joinEdgeRoutes = require('./routes/joinEdge').default;
const verificationRoutes = require('./routes/verification').default;
const webhookRoutes = require('./routes/webhooks').default;
const uploadPfpRoutes = require('./routes/uploadPfp').default;
const adminStatusRoutes = require('./routes/adminStatus').default;

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Support redirecting Discord OAuth callbacks to the frontend callback URL
app.get('/auth/discord/callback', (req, res) => {
  // Frontend base (Vite runtime env) — fall back to root if not set
  const frontendBase = process.env.VITE_API_URL || '';
  const targetBase = frontendBase ? frontendBase.replace(/\/+$/, '') : '';
  const targetPath = targetBase ? `${targetBase}/auth/discord/callback` : '/auth/discord/callback';
  const qs = new URLSearchParams(req.query as Record<string, string>).toString();
  const redirectTo = qs ? `${targetPath}?${qs}` : targetPath;
  res.redirect(redirectTo);
});

// Routes
app.use('/webhooks', webhookRoutes);
app.use('/verify', verificationRoutes);
app.use('/join-edge', joinEdgeRoutes);
app.use('/upload-pfp', uploadPfpRoutes);
app.use('/admin', adminStatusRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Initialize Discord bot and start role sync
async function start() {
  try {
    // Try to initialize Discord bot, but do not fail startup if it errors
    let discordAvailable = false;
    try {
      await initializeDiscordBot();
      discordAvailable = true;
    } catch (err) {
      logger.warn('Discord bot not initialized — continuing without Discord integration', err);
    }

    // Role syncing to Discord is temporarily disabled — the bot will still initialize
    // and can create channels on approve. Re-enable `syncAllRoles()` later when
    // a Postgres instance is available and you want periodic role reconciliation.
    logger.info('Role sync is disabled in this environment — only channel creation will run');

    // Start server regardless of Discord init result
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

start();


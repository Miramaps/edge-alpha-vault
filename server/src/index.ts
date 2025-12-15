import dotenv from 'dotenv';
// Load env early so modules that import on load (like firebase admin) see env vars
dotenv.config();

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { initializeDiscordBot, syncAllRoles } from './services/discord';
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

    // If Discord is available, start periodic role sync
    if (discordAvailable) {
      const syncInterval = parseInt(process.env.ROLE_SYNC_INTERVAL_MS || '120000'); // 2 minutes default
      setInterval(async () => {
        try {
          await syncAllRoles();
        } catch (error) {
          logger.error('Error in periodic role sync:', error);
        }
      }, syncInterval);

      // Initial sync
      try {
        await syncAllRoles();
      } catch (error) {
        logger.error('Initial role sync failed:', error);
      }
    } else {
      logger.info('Skipping role sync because Discord is not initialized');
    }

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


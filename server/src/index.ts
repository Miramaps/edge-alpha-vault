import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { initializeDiscordBot, syncAllRoles } from './services/discord';
import { logger } from './utils/logger';
import webhookRoutes from './routes/webhooks';
import verificationRoutes from './routes/verification';

dotenv.config();

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
    // Initialize Discord bot
    await initializeDiscordBot();
    
    // Start periodic role sync
    const syncInterval = parseInt(process.env.ROLE_SYNC_INTERVAL_MS || '120000'); // 2 minutes default
    setInterval(async () => {
      try {
        await syncAllRoles();
      } catch (error) {
        logger.error('Error in periodic role sync:', error);
      }
    }, syncInterval);
    
    // Initial sync
    await syncAllRoles();
    
    // Start server
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


import { Router, Request, Response } from 'express';
import { validateWebhookSignature, validateApiKey } from '../middleware/security';
import { createTraderChannel } from '../services/discord';
import { query } from '../database/connection';
import { logger } from '../utils/logger';

const router = Router();

/**
 * Webhook endpoint for approved trader applications
 * POST /webhooks/application-approved
 */
router.post(
  '/application-approved',
  validateApiKey,
  validateWebhookSignature,
  async (req: Request, res: Response) => {
    try {
      const { traderWallet, channelName, maxMembers, subscriptionPrice, channelId } = req.body;
      
      // Validate input
      if (!traderWallet || !channelName || !maxMembers || !subscriptionPrice || !channelId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // Store approval
      await query(
        `INSERT INTO application_approvals (trader_wallet, channel_name, max_members, subscription_price)
         VALUES ($1, $2, $3, $4)`,
        [traderWallet, channelName, maxMembers, subscriptionPrice]
      );
      
      // Create Discord channel and role
      const { roleId, channelId: discordChannelId } = await createTraderChannel(
        channelName,
        traderWallet,
        channelId
      );
      
      // Mark as processed
      await query(
        `UPDATE application_approvals 
         SET processed_at = NOW(), status = 'processed'
         WHERE trader_wallet = $1 AND channel_name = $2`,
        [traderWallet, channelName]
      );
      
      logger.info('Application approved and channel created', {
        traderWallet,
        channelName,
        roleId,
        discordChannelId,
      });
      
      res.json({
        success: true,
        roleId,
        discordChannelId,
      });
    } catch (error) {
      logger.error('Error processing application approval:', error);
      
      // Mark as failed
      await query(
        `UPDATE application_approvals 
         SET status = 'failed', error_message = $1
         WHERE trader_wallet = $2 AND channel_name = $3`,
        [
          error instanceof Error ? error.message : 'Unknown error',
          req.body.traderWallet,
          req.body.channelName,
        ]
      );
      
      res.status(500).json({
        error: 'Failed to process application approval',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

export default router;


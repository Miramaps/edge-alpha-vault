import { Router, Request, Response } from 'express';
import { rateLimitMiddleware } from '../utils/rateLimiter';
import { validateWalletAddress, sanitizeInput } from '../middleware/security';
import { verifyWalletSignature } from '../utils/solana';
import { encrypt, hashWalletAddress } from '../utils/encryption';
import { query } from '../database/connection';
import { assignRole, syncAllRoles } from '../services/discord';
import { logger } from '../utils/logger';

const router = Router();

/**
 * Verify wallet ownership
 * POST /verify
 */
router.post(
  '/verify',
  rateLimitMiddleware('verify'),
  async (req: Request, res: Response) => {
    try {
      const { walletAddress, signature, message, discordUserId } = req.body;
      
      // Validate input
      if (!walletAddress || !signature || !message || !discordUserId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      if (!validateWalletAddress(walletAddress)) {
        return res.status(400).json({ error: 'Invalid wallet address format' });
      }
      
      // Verify signature
      const isValid = await verifyWalletSignature(walletAddress, message, signature);
      if (!isValid) {
        logger.warn('Invalid signature verification attempt', { discordUserId, walletAddress });
        return res.status(401).json({ error: 'Invalid signature' });
      }
      
      // Check if already verified
      const existing = await query(
        'SELECT id FROM wallet_verifications WHERE discord_user_id = $1',
        [discordUserId]
      );
      
      if (existing.rows.length > 0) {
        // Update existing verification
        const encrypted = encrypt(walletAddress);
        const hash = hashWalletAddress(walletAddress);
        
        await query(
          `UPDATE wallet_verifications 
           SET wallet_address_encrypted = $1, wallet_address_hash = $2, 
               signature_proof = $3, verification_message = $4, verified_at = NOW()
           WHERE discord_user_id = $5`,
          [encrypted, hash, signature, message, discordUserId]
        );
      } else {
        // Create new verification
        const encrypted = encrypt(walletAddress);
        const hash = hashWalletAddress(walletAddress);
        
        await query(
          `INSERT INTO wallet_verifications 
           (discord_user_id, wallet_address_encrypted, wallet_address_hash, signature_proof, verification_message)
           VALUES ($1, $2, $3, $4, $5)`,
          [discordUserId, encrypted, hash, signature, message]
        );
      }
      
      // Log verification
      await query(
        `INSERT INTO audit_log (action, discord_user_id, wallet_address_hash, details)
         VALUES ('verify_wallet', $1, $2, $3)`,
        [discordUserId, hashWalletAddress(walletAddress), JSON.stringify({ verified: true })]
      );
      
      // Immediately sync roles for this user
      await syncAllRoles();
      
      logger.info('Wallet verified', { discordUserId, walletAddress: hashWalletAddress(walletAddress) });
      
      res.json({
        success: true,
        message: 'Wallet verified successfully',
      });
    } catch (error) {
      logger.error('Error verifying wallet:', error);
      res.status(500).json({
        error: 'Failed to verify wallet',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

export default router;


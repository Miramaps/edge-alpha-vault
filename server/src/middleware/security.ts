import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

/**
 * Validates webhook signature to ensure request is from trusted source
 */
export function validateWebhookSignature(req: Request, res: Response, next: NextFunction) {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) {
    console.warn('WEBHOOK_SECRET not set, skipping signature validation');
    return next();
  }
  
  const signature = req.headers['x-webhook-signature'] as string;
  if (!signature) {
    return res.status(401).json({ error: 'Missing webhook signature' });
  }
  
  const payload = JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  // Constant-time comparison to prevent timing attacks
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return res.status(401).json({ error: 'Invalid webhook signature' });
  }
  
  next();
}

/**
 * Validates API key for protected endpoints
 */
export function validateApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn('API_KEY not set, skipping API key validation');
    return next();
  }
  
  const providedKey = req.headers['x-api-key'] as string;
  if (!providedKey || providedKey !== apiKey) {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }
  
  next();
}

/**
 * Sanitizes and validates wallet address format
 */
export function validateWalletAddress(address: string): boolean {
  // Solana addresses are base58 encoded, 32-44 characters
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
}

/**
 * Sanitizes input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML/script tags
    .substring(0, 255); // Limit length
}


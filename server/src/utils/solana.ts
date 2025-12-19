import { Connection, PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import { decodeBase64 } from 'tweetnacl-util';

const RPC_URL = process.env.SOLANA_RPC_URL || process.env.SOLANA_RPC_URL_DEVNET || 'https://api.devnet.solana.com';
export const connection = new Connection(RPC_URL, 'confirmed');

/**
 * Verifies that a signature was created by signing a message with the given wallet
 */
export async function verifyWalletSignature(
  walletAddress: string,
  message: string,
  signature: string
): Promise<boolean> {
  try {
    const publicKey = new PublicKey(walletAddress);
    const messageBytes = new TextEncoder().encode(message);
    // signature is expected as base64 string
    const signatureBytes = decodeBase64(signature);

    // Verify signature using Ed25519 (Solana's signature algorithm)
    return nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKey.toBytes()
    );
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Queries on-chain subscription status for a wallet
 */
export async function getWalletSubscriptions(walletAddress: string): Promise<Array<{
  channelId: string;
  status: 'active' | 'expired' | 'cancelled';
  expiresAt: Date | null;
}>> {
  try {
    const walletPubkey = new PublicKey(walletAddress);
    const subscriptionProgramId = new PublicKey(process.env.SUBSCRIPTION_PROGRAM_ID!);

    // Query subscription accounts owned by the wallet
    // This is a simplified example - adjust based on your actual program structure
    const accounts = await connection.getParsedProgramAccounts(subscriptionProgramId, {
      filters: [
        {
          memcmp: {
            offset: 8, // Skip discriminator
            bytes: walletPubkey.toBase58(),
          },
        },
      ],
    });

    // Parse subscription data based on your program structure
    // This is a placeholder - implement based on your actual account structure
    return accounts.map((account) => {
      const data = account.account.data as any;
      return {
        channelId: data.channelId || '',
        status: data.status === 1 ? 'active' : data.status === 2 ? 'expired' : 'cancelled',
        expiresAt: data.expiresAt ? new Date(data.expiresAt * 1000) : null,
      };
    });
  } catch (error) {
    console.error('Error querying subscriptions:', error);
    // Return empty array on error to prevent blocking
    return [];
  }
}

/**
 * Validates on-chain data before role assignment
 */
export async function validateSubscriptionData(
  walletAddress: string,
  channelId: string
): Promise<{ valid: boolean; subscription: any | null; error?: string }> {
  try {
    const subscriptions = await getWalletSubscriptions(walletAddress);
    const subscription = subscriptions.find((s) => s.channelId === channelId);

    if (!subscription) {
      return { valid: false, subscription: null, error: 'Subscription not found' };
    }

    if (subscription.status !== 'active') {
      return { valid: false, subscription, error: `Subscription is ${subscription.status}` };
    }

    if (subscription.expiresAt && subscription.expiresAt < new Date()) {
      return { valid: false, subscription, error: 'Subscription has expired' };
    }

    return { valid: true, subscription };
  } catch (error) {
    return {
      valid: false,
      subscription: null,
      error: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Handles RPC failures gracefully with retry logic
 */
export async function queryWithRetry<T>(
  queryFn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T | null> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await queryFn();
    } catch (error) {
      console.error(`Query attempt ${attempt} failed:`, error);

      if (attempt === maxRetries) {
        console.error('All retry attempts exhausted');
        return null;
      }

      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }

  return null;
}


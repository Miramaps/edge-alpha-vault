import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

/**
 * Encrypts sensitive data (wallet addresses) before storing in database
 */
export function encrypt(text: string): Buffer {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  const tag = cipher.getAuthTag();
  
  // Combine: salt + iv + tag + encrypted data
  return Buffer.concat([salt, iv, tag, encrypted]);
}

/**
 * Decrypts encrypted data from database
 */
export function decrypt(encryptedData: Buffer): string {
  const key = getEncryptionKey();
  
  // Extract components
  const salt = encryptedData.slice(0, SALT_LENGTH);
  const iv = encryptedData.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const tag = encryptedData.slice(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
  const encrypted = encryptedData.slice(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString('utf8');
}

/**
 * Creates a hash of wallet address for lookups (one-way, cannot be reversed)
 */
export function hashWalletAddress(walletAddress: string): string {
  return crypto.createHash('sha256').update(walletAddress).digest('hex');
}

/**
 * Gets encryption key from environment, ensures it's 32 bytes
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is required');
  }
  
  // Ensure key is exactly 32 bytes (256 bits for AES-256)
  if (key.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be exactly 32 characters (32 bytes)');
  }
  
  return Buffer.from(key, 'utf8');
}


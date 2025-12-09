#!/usr/bin/env node

/**
 * Script to generate encryption key and webhook secret
 * SECURITY: This script generates sensitive cryptographic keys
 * Run: node scripts/generate-keys.js
 * 
 * Security measures:
 * - Keys are only output to stdout (never written to files)
 * - Uses cryptographically secure random number generator
 * - Warns about security best practices
 * - Validates environment before generation
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Security: Check if running in a secure environment
function checkSecurityEnvironment() {
  // Warn if .env file exists and might be overwritten
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    console.warn('⚠️  WARNING: .env file already exists!');
    console.warn('   Make sure you want to regenerate keys (this may break existing encrypted data)\n');
  }
  
  // Check if .env is in .gitignore
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignore = fs.readFileSync(gitignorePath, 'utf8');
    if (!gitignore.includes('.env')) {
      console.warn('⚠️  WARNING: .env is not in .gitignore!');
      console.warn('   Add .env to .gitignore to prevent accidental commits\n');
    }
  } else {
    console.warn('⚠️  WARNING: .gitignore file not found!');
    console.warn('   Create .gitignore and add .env to prevent accidental commits\n');
  }
}

// Security: Validate key strength
function validateKeyStrength(key, keyName) {
  if (key.length < 32) {
    throw new Error(`Security Error: ${keyName} is too short (minimum 32 bytes)`);
  }
  return true;
}

// Security: Clear sensitive data from memory (best effort)
function clearFromMemory(data) {
  if (typeof data === 'string') {
    // JavaScript strings are immutable, but we can try to minimize exposure
    return null;
  }
  return null;
}

console.log('🔑 Generating security keys...\n');

// Security check before generation
checkSecurityEnvironment();

// Generate 32-byte encryption key (for AES-256)
// Security: Using crypto.randomBytes ensures cryptographically secure randomness
const encryptionKey = crypto.randomBytes(32).toString('hex');
validateKeyStrength(encryptionKey, 'ENCRYPTION_KEY');

// Generate webhook secret (32 bytes = 256 bits)
const webhookSecret = crypto.randomBytes(32).toString('hex');
validateKeyStrength(webhookSecret, 'WEBHOOK_SECRET');

// Generate API key (32 bytes = 256 bits)
const apiKey = crypto.randomBytes(32).toString('hex');
validateKeyStrength(apiKey, 'API_KEY');

// Security: Output keys with warnings
console.log('📋 Generated Keys (copy to .env file):\n');
console.log('ENCRYPTION_KEY=' + encryptionKey);
console.log('WEBHOOK_SECRET=' + webhookSecret);
console.log('API_KEY=' + apiKey);

console.log('\n🔒 Security Best Practices:');
console.log('  ✅ Keys generated using cryptographically secure random number generator');
console.log('  ✅ Keys are 256 bits (32 bytes) - strong enough for production use');
console.log('  ⚠️  IMPORTANT: Copy keys immediately and clear your terminal history');
console.log('  ⚠️  Never commit these keys to git or share them publicly');
console.log('  ⚠️  Store .env file securely and restrict file permissions (chmod 600 .env)');
console.log('  ⚠️  Use different keys for development and production environments');
console.log('  ⚠️  If ENCRYPTION_KEY is lost, encrypted data CANNOT be decrypted');
console.log('  ⚠️  Rotate keys periodically (especially if compromised)');
console.log('  ⚠️  Never log these keys or output them in error messages');
console.log('\n✅ Keys generated successfully. Clear your terminal after copying!');

// Security: Attempt to clear from memory (best effort in JavaScript)
clearFromMemory(encryptionKey);
clearFromMemory(webhookSecret);
clearFromMemory(apiKey);


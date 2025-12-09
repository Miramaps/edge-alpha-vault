#!/usr/bin/env node

/**
 * Script to generate encryption key and webhook secret
 * Run: node scripts/generate-keys.js
 */

const crypto = require('crypto');

console.log('🔑 Generating security keys...\n');

// Generate 32-byte encryption key (for AES-256)
const encryptionKey = crypto.randomBytes(32).toString('hex');
console.log('ENCRYPTION_KEY=' + encryptionKey);

// Generate webhook secret
const webhookSecret = crypto.randomBytes(32).toString('hex');
console.log('WEBHOOK_SECRET=' + webhookSecret);

// Generate API key
const apiKey = crypto.randomBytes(32).toString('hex');
console.log('API_KEY=' + apiKey);

console.log('\n✅ Copy these values to your .env file');
console.log('⚠️  Keep these keys secure and never commit them to git!');


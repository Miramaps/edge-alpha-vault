# Security Guidelines for Key Generation

## Overview

The `generate-keys.js` script generates sensitive cryptographic keys used for:
- **ENCRYPTION_KEY**: Encrypts wallet addresses in the database (AES-256-GCM)
- **WEBHOOK_SECRET**: Validates webhook signatures (HMAC-SHA256)
- **API_KEY**: Protects API endpoints from unauthorized access

## Security Measures Implemented

### 1. **Cryptographically Secure Random Generation**
- Uses `crypto.randomBytes()` which uses the OS's secure random number generator
- 32 bytes (256 bits) for all keys - meets NIST recommendations for AES-256
- Keys are generated with sufficient entropy to resist brute force attacks

### 2. **Key Strength Validation**
- Script validates all keys are at least 32 bytes
- Prevents accidental generation of weak keys

### 3. **Environment Checks**
- Warns if `.env` file already exists (prevents accidental overwrite)
- Checks if `.env` is in `.gitignore` (prevents accidental commits)
- Validates security environment before key generation

### 4. **Secure Output**
- Keys only output to stdout (never written to files automatically)
- Clear warnings about security best practices
- Instructions to clear terminal history after use

## Security Best Practices

### ✅ DO:
1. **Run script in secure environment**
   - Use a trusted machine with secure terminal
   - Ensure no screen sharing or recording is active
   - Close unnecessary applications

2. **Protect generated keys**
   - Copy keys immediately to `.env` file
   - Set file permissions: `chmod 600 .env`
   - Clear terminal history after copying
   - Never share keys via insecure channels (email, Slack, etc.)

3. **Environment separation**
   - Use different keys for development, staging, and production
   - Never reuse production keys in development
   - Rotate keys if they may have been compromised

4. **Version control**
   - Ensure `.env` is in `.gitignore`
   - Never commit keys to git (even in private repos)
   - Use environment variable management in deployment platforms

5. **Key rotation**
   - Rotate keys periodically (every 90-180 days)
   - Rotate immediately if compromise is suspected
   - Plan migration strategy before rotating ENCRYPTION_KEY (requires re-encryption)

### ❌ DON'T:
1. **Never commit keys to git**
   - Even in private repositories
   - Even if encrypted
   - Use secrets management instead

2. **Never log keys**
   - Don't log environment variables
   - Don't include keys in error messages
   - Don't output keys in API responses

3. **Never share keys**
   - Don't email keys
   - Don't send via Slack/Discord
   - Don't store in shared documents
   - Use secure secret sharing tools if needed

4. **Never use weak keys**
   - Don't use predictable patterns
   - Don't reuse keys across environments
   - Don't use keys shorter than 32 bytes

## Key Management by Type

### ENCRYPTION_KEY
- **Purpose**: Encrypts wallet addresses in database
- **Algorithm**: AES-256-GCM
- **Critical**: If lost, encrypted data CANNOT be decrypted
- **Rotation**: Requires data migration (re-encrypt all records)
- **Backup**: Store securely in multiple secure locations

### WEBHOOK_SECRET
- **Purpose**: Validates webhook signatures (HMAC-SHA256)
- **Algorithm**: HMAC-SHA256
- **Rotation**: Update in both sender and receiver
- **Backup**: Store securely, but can be regenerated if needed

### API_KEY
- **Purpose**: Protects API endpoints
- **Rotation**: Update all clients using the API
- **Backup**: Store securely, but can be regenerated if needed

## Deployment Security

### Railway / Cloud Platforms
1. Use platform's secrets management (Railway Variables)
2. Never hardcode keys in Docker images
3. Use different keys per environment
4. Enable audit logging for key access

### Local Development
1. Use `.env` file (in `.gitignore`)
2. Set restrictive file permissions: `chmod 600 .env`
3. Don't share `.env` files between developers
4. Use different keys than production

## Incident Response

If keys are compromised:

1. **Immediately rotate all compromised keys**
2. **Revoke old keys** in all systems
3. **Audit logs** for unauthorized access
4. **Re-encrypt data** if ENCRYPTION_KEY was compromised
5. **Notify affected users** if necessary
6. **Document incident** for future prevention

## Additional Security Measures

### Server-Side Security
- ✅ Webhook signature validation (HMAC-SHA256)
- ✅ API key authentication
- ✅ Rate limiting on endpoints
- ✅ Input validation and sanitization
- ✅ Encrypted database storage (AES-256-GCM)
- ✅ Constant-time comparison (prevents timing attacks)

### Network Security
- ✅ HTTPS only in production
- ✅ CORS configuration
- ✅ Request size limits
- ✅ Timeout configurations

### Monitoring
- ✅ Audit logging for key generation
- ✅ Failed authentication attempts logged
- ✅ Unusual access patterns detected
- ✅ Regular security audits

## Compliance Considerations

- **GDPR**: Encrypted storage of wallet addresses (PII)
- **SOC 2**: Key management and access controls
- **PCI DSS**: If handling payment data (not applicable here)

## Questions or Issues

If you discover a security vulnerability:
1. **DO NOT** create a public issue
2. Contact the security team directly
3. Provide detailed information about the vulnerability
4. Allow time for fix before public disclosure


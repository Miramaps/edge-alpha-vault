/**
 * Browser-compatible TOTP (Time-based One-Time Password) utilities
 * Uses Web Crypto API instead of Node.js crypto
 */

/**
 * Decode base32 string to bytes
 */
function base32Decode(base32: string): Uint8Array {
  const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  base32 = base32.toUpperCase().replace(/=+$/, ''); // Remove padding
  
  const bits: number[] = [];
  for (let i = 0; i < base32.length; i++) {
    const val = base32Chars.indexOf(base32[i]);
    if (val === -1) throw new Error('Invalid base32 character');
    
    // Convert to 5 bits
    for (let j = 4; j >= 0; j--) {
      bits.push((val >> j) & 1);
    }
  }
  
  // Convert bits to bytes
  const bytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8 && i + j < bits.length; j++) {
      byte = (byte << 1) | bits[i + j];
    }
    bytes.push(byte);
  }
  
  return new Uint8Array(bytes);
}

/**
 * Generate HMAC-SHA1 using Web Crypto API
 */
async function hmacSha1(key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);
  return new Uint8Array(signature);
}

/**
 * Generate TOTP code from secret
 */
async function generateTOTP(secret: string, timeStep: number): Promise<string> {
  const key = base32Decode(secret);
  
  // Convert time step to 8-byte big-endian buffer
  const timeBuffer = new ArrayBuffer(8);
  const timeView = new DataView(timeBuffer);
  timeView.setUint32(4, timeStep, false); // Big-endian
  
  // Generate HMAC-SHA1
  const hmac = await hmacSha1(key, new Uint8Array(timeBuffer));
  
  // Dynamic truncation
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code = ((hmac[offset] & 0x7f) << 24) |
               ((hmac[offset + 1] & 0xff) << 16) |
               ((hmac[offset + 2] & 0xff) << 8) |
               (hmac[offset + 3] & 0xff);
  
  const otp = (code % 1000000).toString().padStart(6, '0');
  return otp;
}

/**
 * Verify TOTP code with time window tolerance
 */
export async function verifyTOTP(token: string, secret: string, window: number = 1): Promise<boolean> {
  const normalizedSecret = secret.toUpperCase().replace(/\s/g, '');
  const normalizedToken = token.replace(/\s/g, '');
  
  if (normalizedToken.length !== 6 || !/^\d+$/.test(normalizedToken)) {
    return false;
  }
  
  // Get current time step (30-second intervals)
  const timeStep = Math.floor(Date.now() / 1000 / 30);
  
  // Check current time step and window around it
  for (let i = -window; i <= window; i++) {
    const testTimeStep = timeStep + i;
    const expectedCode = await generateTOTP(normalizedSecret, testTimeStep);
    
    if (expectedCode === normalizedToken) {
      return true;
    }
  }
  
  return false;
}


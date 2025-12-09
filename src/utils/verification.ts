/**
 * Utility functions for trader verification
 */

/**
 * Check if a wallet address is verified
 */
export function isWalletVerified(walletAddress: string): boolean {
  if (typeof window === 'undefined') return false;
  const verified = localStorage.getItem(`verified_${walletAddress}`);
  return verified === "true";
}

/**
 * Get verification transaction for a wallet
 */
export function getVerificationTx(walletAddress: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(`verification_tx_${walletAddress}`);
}

/**
 * Set verification status for a wallet
 */
export function setWalletVerified(walletAddress: string, txSignature: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`verified_${walletAddress}`, "true");
  localStorage.setItem(`verification_tx_${walletAddress}`, txSignature);
}


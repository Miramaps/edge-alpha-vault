/**
 * Currency conversion utilities
 * TODO: Replace with actual EDGE token price from API/on-chain data
 */

// Placeholder EDGE token price in USD
// This should be fetched from an API or on-chain price oracle in production
const EDGE_PRICE_USD = 0.10; // $0.10 per EDGE token

/**
 * Convert EDGE tokens to USD
 */
export function edgeToUSD(edgeAmount: number): number {
  return edgeAmount * EDGE_PRICE_USD;
}

/**
 * Format volume in USD with appropriate units (k, M, etc.)
 */
export function formatVolumeUSD(edgeVolume: number): string {
  const usdAmount = edgeToUSD(edgeVolume);
  
  if (usdAmount >= 1000000) {
    return `$${(usdAmount / 1000000).toFixed(1)}M`;
  } else if (usdAmount >= 1000) {
    return `$${(usdAmount / 1000).toFixed(1)}k`;
  } else {
    return `$${usdAmount.toFixed(0)}`;
  }
}


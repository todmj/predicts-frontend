/**
 * Formats a number as currency (credits) with 2 decimal places.
 * @param amount - The amount to format
 * @returns Formatted string with 2 decimal places
 */
export function formatMoney(amount: number): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0.00';
  }
  return amount.toFixed(2);
}

/**
 * Formats a number as currency with symbol prefix.
 * @param amount - The amount to format
 * @param symbol - The currency symbol (default: '¢' for credits)
 * @returns Formatted string with symbol
 */
export function formatMoneyWithSymbol(amount: number, symbol: string = '¢'): string {
  return `${symbol}${formatMoney(amount)}`;
}

/**
 * Formats a large number with appropriate suffix (K, M, B).
 * @param amount - The amount to format
 * @returns Formatted string with suffix
 */
export function formatLargeNumber(amount: number): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0';
  }

  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(1)}K`;
  }
  return formatMoney(amount);
}


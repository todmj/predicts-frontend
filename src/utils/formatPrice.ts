/**
 * Formats a price (0-1 range) as a 2 decimal number.
 * @param price - The price to format (0-1)
 * @returns Formatted string with 2 decimal places
 */
export function formatPrice(price: number): string {
  if (price === null || price === undefined || isNaN(price)) {
    return '0.00';
  }
  return price.toFixed(2);
}

/**
 * Formats a price as a percentage with 1 decimal place.
 * @param price - The price to format (0-1)
 * @returns Formatted percentage string
 */
export function formatPriceAsPercentage(price: number): string {
  if (price === null || price === undefined || isNaN(price)) {
    return '0.0%';
  }
  return `${(price * 100).toFixed(1)}%`;
}

/**
 * Formats a probability (0-1 range) as percentage.
 * @param probability - The probability (0-1)
 * @returns Formatted percentage string with 1 decimal
 */
export function formatProbability(probability: number): string {
  return formatPriceAsPercentage(probability);
}


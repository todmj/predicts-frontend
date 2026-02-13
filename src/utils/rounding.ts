/**
 * Rounds a number to specified decimal places.
 * @param value - The number to round
 * @param decimals - Number of decimal places (default: 2)
 * @returns Rounded number
 */
export function round(value: number, decimals: number = 2): number {
  if (value === null || value === undefined || isNaN(value)) {
    return 0;
  }
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Rounds down (floor) to specified decimal places.
 * Useful for displaying maximum available shares.
 * @param value - The number to round
 * @param decimals - Number of decimal places (default: 2)
 * @returns Rounded down number
 */
export function roundDown(value: number, decimals: number = 2): number {
  if (value === null || value === undefined || isNaN(value)) {
    return 0;
  }
  const factor = Math.pow(10, decimals);
  return Math.floor(value * factor) / factor;
}

/**
 * Rounds up (ceil) to specified decimal places.
 * Useful for displaying minimum costs.
 * @param value - The number to round
 * @param decimals - Number of decimal places (default: 2)
 * @returns Rounded up number
 */
export function roundUp(value: number, decimals: number = 2): number {
  if (value === null || value === undefined || isNaN(value)) {
    return 0;
  }
  const factor = Math.pow(10, decimals);
  return Math.ceil(value * factor) / factor;
}

/**
 * Clamps a value between min and max.
 * @param value - The value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}


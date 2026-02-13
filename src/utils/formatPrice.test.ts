import { describe, it, expect } from 'vitest';
import { formatPrice, formatPriceAsPercentage, formatProbability } from './formatPrice';

describe('formatPrice', () => {
  it('should format prices with 2 decimal places', () => {
    expect(formatPrice(0.5)).toBe('0.50');
    expect(formatPrice(0.75)).toBe('0.75');
    expect(formatPrice(1)).toBe('1.00');
    expect(formatPrice(0)).toBe('0.00');
  });

  it('should handle edge cases', () => {
    expect(formatPrice(null as unknown as number)).toBe('0.00');
    expect(formatPrice(undefined as unknown as number)).toBe('0.00');
    expect(formatPrice(NaN)).toBe('0.00');
  });

  it('should round correctly', () => {
    expect(formatPrice(0.555)).toBe('0.56');
    expect(formatPrice(0.554)).toBe('0.55');
  });
});

describe('formatPriceAsPercentage', () => {
  it('should convert price to percentage with 1 decimal', () => {
    expect(formatPriceAsPercentage(0.5)).toBe('50.0%');
    expect(formatPriceAsPercentage(0.75)).toBe('75.0%');
    expect(formatPriceAsPercentage(1)).toBe('100.0%');
    expect(formatPriceAsPercentage(0)).toBe('0.0%');
  });

  it('should handle fractional percentages', () => {
    expect(formatPriceAsPercentage(0.333)).toBe('33.3%');
    expect(formatPriceAsPercentage(0.666)).toBe('66.6%');
  });

  it('should handle edge cases', () => {
    expect(formatPriceAsPercentage(null as unknown as number)).toBe('0.0%');
    expect(formatPriceAsPercentage(NaN)).toBe('0.0%');
  });
});

describe('formatProbability', () => {
  it('should be an alias for formatPriceAsPercentage', () => {
    expect(formatProbability(0.5)).toBe('50.0%');
    expect(formatProbability(0.25)).toBe('25.0%');
  });
});


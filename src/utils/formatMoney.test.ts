import { describe, it, expect } from 'vitest';
import { formatMoney, formatMoneyWithSymbol, formatLargeNumber } from './formatMoney';

describe('formatMoney', () => {
  it('should format a positive number with 2 decimal places', () => {
    expect(formatMoney(100)).toBe('100.00');
    expect(formatMoney(100.5)).toBe('100.50');
    expect(formatMoney(100.555)).toBe('100.56');
  });

  it('should format zero correctly', () => {
    expect(formatMoney(0)).toBe('0.00');
  });

  it('should format negative numbers', () => {
    expect(formatMoney(-50)).toBe('-50.00');
    expect(formatMoney(-50.123)).toBe('-50.12');
  });

  it('should handle null, undefined, and NaN', () => {
    expect(formatMoney(null as unknown as number)).toBe('0.00');
    expect(formatMoney(undefined as unknown as number)).toBe('0.00');
    expect(formatMoney(NaN)).toBe('0.00');
  });

  it('should handle very small numbers', () => {
    expect(formatMoney(0.001)).toBe('0.00');
    expect(formatMoney(0.005)).toBe('0.01');
  });

  it('should handle very large numbers', () => {
    expect(formatMoney(1000000)).toBe('1000000.00');
  });
});

describe('formatMoneyWithSymbol', () => {
  it('should add default symbol', () => {
    expect(formatMoneyWithSymbol(100)).toBe('¢100.00');
  });

  it('should use custom symbol', () => {
    expect(formatMoneyWithSymbol(100, '$')).toBe('$100.00');
  });
});

describe('formatLargeNumber', () => {
  it('should format numbers under 1000 normally', () => {
    expect(formatLargeNumber(500)).toBe('500.00');
  });

  it('should format thousands with K suffix', () => {
    expect(formatLargeNumber(1500)).toBe('1.5K');
    expect(formatLargeNumber(10000)).toBe('10.0K');
  });

  it('should format millions with M suffix', () => {
    expect(formatLargeNumber(1500000)).toBe('1.5M');
  });

  it('should format billions with B suffix', () => {
    expect(formatLargeNumber(1500000000)).toBe('1.5B');
  });

  it('should handle edge cases', () => {
    expect(formatLargeNumber(0)).toBe('0.00');
    expect(formatLargeNumber(NaN)).toBe('0');
  });
});


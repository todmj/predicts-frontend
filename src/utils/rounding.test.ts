import { describe, it, expect } from 'vitest';
import { round, roundDown, roundUp, clamp } from './rounding';

describe('round', () => {
  it('should round to 2 decimal places by default', () => {
    expect(round(1.234)).toBe(1.23);
    expect(round(1.235)).toBe(1.24);
    expect(round(1.999)).toBe(2);
  });

  it('should round to specified decimal places', () => {
    expect(round(1.2345, 3)).toBe(1.235);
    expect(round(1.2345, 1)).toBe(1.2);
    expect(round(1.2345, 0)).toBe(1);
  });

  it('should handle edge cases', () => {
    expect(round(null as unknown as number)).toBe(0);
    expect(round(undefined as unknown as number)).toBe(0);
    expect(round(NaN)).toBe(0);
  });
});

describe('roundDown', () => {
  it('should round down to 2 decimal places by default', () => {
    expect(roundDown(1.239)).toBe(1.23);
    expect(roundDown(1.999)).toBe(1.99);
  });

  it('should round down to specified decimal places', () => {
    expect(roundDown(1.99, 1)).toBe(1.9);
    expect(roundDown(1.99, 0)).toBe(1);
  });

  it('should handle edge cases', () => {
    expect(roundDown(null as unknown as number)).toBe(0);
    expect(roundDown(NaN)).toBe(0);
  });
});

describe('roundUp', () => {
  it('should round up to 2 decimal places by default', () => {
    expect(roundUp(1.231)).toBe(1.24);
    expect(roundUp(1.001)).toBe(1.01);
  });

  it('should round up to specified decimal places', () => {
    expect(roundUp(1.01, 1)).toBe(1.1);
    expect(roundUp(1.01, 0)).toBe(2);
  });

  it('should handle edge cases', () => {
    expect(roundUp(null as unknown as number)).toBe(0);
    expect(roundUp(NaN)).toBe(0);
  });
});

describe('clamp', () => {
  it('should clamp values within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('should handle edge cases at boundaries', () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });
});


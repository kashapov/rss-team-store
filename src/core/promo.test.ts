import { describe, expect, it } from 'vitest';
import { calculateDiscount, findPromo, normalizePromoCode } from './promo';

describe('normalizePromoCode', () => {
  it('trims and uppercases', () => {
    expect(normalizePromoCode('  sale10 ')).toBe('SALE10');
  });
});

describe('findPromo', () => {
  it('finds a known code regardless of case and spaces', () => {
    expect(findPromo('SALE10')).toEqual({ percent: 10 });
    expect(findPromo(' sale10 ')).toEqual({ percent: 10 });
  });

  it.each([undefined, '', 'NOPE', 'toString', '__proto__'])('returns undefined for %j', (code) => {
    expect(findPromo(code)).toBeUndefined();
  });
});

describe('calculateDiscount', () => {
  it('takes the percent from the subtotal', () => {
    expect(calculateDiscount(1000, 'SALE10')).toBe(100);
  });
});

import { describe, expect, it } from 'vitest';
import { countCartItems } from './cartCount';

describe('countCartItems', () => {
  it('is 0 for an empty cart', () => {
    expect(countCartItems([])).toBe(0);
  });

  it('counts qty, not lines', () => {
    expect(countCartItems([{ productId: 1, qty: 3 }])).toBe(3);
  });

  it('sums qty across lines', () => {
    expect(
      countCartItems([
        { productId: 1, qty: 2 },
        { productId: 2, qty: 1 },
      ]),
    ).toBe(3);
  });
});

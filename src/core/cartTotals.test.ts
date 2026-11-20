import { describe, expect, it } from 'vitest';
import type { CartLine } from '../types/cart';
import type { Product } from '../types/product';
import { calculateCartTotals } from './cartTotals';

const product = (id: number, price: number): Product => ({
  id,
  name: `p${id}`,
  category: 'family',
  price,
});

describe('calculateCartTotals', () => {
  it('returns zeros for an empty cart', () => {
    expect(calculateCartTotals([])).toEqual({ subtotal: 0, discount: 0, total: 0 });
  });

  it('counts a single line as price × qty', () => {
    const lines: CartLine[] = [{ product: product(1, 995), qty: 3 }];
    expect(calculateCartTotals(lines)).toEqual({
      subtotal: 2985,
      discount: 0,
      total: 2985,
    });
  });
});

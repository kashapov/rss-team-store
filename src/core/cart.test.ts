import { describe, expect, it } from 'vitest';
import type { CartItem } from './cart';
import { addToCart } from './cart';

describe('addToCart', () => {
  it('adds a new line with qty 1 to an empty cart', () => {
    expect(addToCart([], 1)).toEqual([{ productId: 1, qty: 1 }]);
  });

  it('increments qty instead of duplicating the line', () => {
    const once = addToCart([], 1);
    expect(addToCart(once, 1)).toEqual([{ productId: 1, qty: 2 }]);
  });

  it('keeps different products as separate lines in insertion order', () => {
    const items = addToCart(addToCart([], 2), 1);
    expect(items).toEqual([
      { productId: 2, qty: 1 },
      { productId: 1, qty: 1 },
    ]);
  });

  it('keeps line order when an earlier product is added again', () => {
    const items = addToCart(addToCart(addToCart([], 2), 1), 2);
    expect(items).toEqual([
      { productId: 2, qty: 2 },
      { productId: 1, qty: 1 },
    ]);
  });

  it('does not mutate the input', () => {
    const items = Object.freeze([Object.freeze({ productId: 1, qty: 1 })]);
    const snapshot = structuredClone(items);

    addToCart(items, 1);
    addToCart(items, 2);

    expect(items).toEqual(snapshot);
  });

  it('returns a new array with new line objects', () => {
    const items: CartItem[] = [{ productId: 1, qty: 1 }];
    const next = addToCart(items, 1);

    expect(next).not.toBe(items);
    expect(next[0]).not.toBe(items[0]);
  });
});

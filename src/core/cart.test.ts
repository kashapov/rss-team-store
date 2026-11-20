import { describe, expect, it } from 'vitest';
import type { CartItem } from '../types/cart';
import { MIN_QTY, addToCart, decreaseQty, increaseQty, removeFromCart } from './cart';

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

describe('increaseQty / decreaseQty', () => {
  const items: readonly CartItem[] = [
    { productId: 1, qty: 3 },
    { productId: 2, qty: 1 },
  ];

  it('increaseQty adds 1 to the matching line only', () => {
    expect(increaseQty(items, 1)).toEqual([
      { productId: 1, qty: 4 },
      { productId: 2, qty: 1 },
    ]);
  });

  it('decreaseQty subtracts 1 from the matching line only', () => {
    expect(decreaseQty(items, 1)).toEqual([
      { productId: 1, qty: 2 },
      { productId: 2, qty: 1 },
    ]);
  });

  it('decreaseQty does not go below the minimum qty', () => {
    expect(decreaseQty(items, 2)).toEqual(items);
    expect(decreaseQty([{ productId: 1, qty: MIN_QTY }], 1)).toEqual([
      { productId: 1, qty: MIN_QTY },
    ]);
  });

  it.each([increaseQty, decreaseQty])('leaves the cart unchanged for an unknown id', (change) => {
    expect(change(items, 999)).toEqual(items);
  });

  it.each([increaseQty, decreaseQty])(
    'does not mutate the input or touch other lines',
    (change) => {
      const frozen = Object.freeze([
        Object.freeze({ productId: 1, qty: 3 }),
        Object.freeze({ productId: 2, qty: 2 }),
      ]);
      const snapshot = structuredClone(frozen);

      const next = change(frozen, 1);

      expect(frozen).toEqual(snapshot);
      expect(next).not.toBe(frozen);
      expect(next[1]).toBe(frozen[1]);
    },
  );
});

describe('removeFromCart', () => {
  const items: readonly CartItem[] = [
    { productId: 1, qty: 3 },
    { productId: 2, qty: 1 },
    { productId: 3, qty: 2 },
  ];

  it('removes the whole line regardless of qty', () => {
    expect(removeFromCart(items, 1)).toEqual([
      { productId: 2, qty: 1 },
      { productId: 3, qty: 2 },
    ]);
  });

  it('keeps the order of the remaining lines', () => {
    expect(removeFromCart(items, 2).map((item) => item.productId)).toEqual([1, 3]);
  });

  it('returns an empty cart after removing the last line', () => {
    expect(removeFromCart([{ productId: 1, qty: 1 }], 1)).toEqual([]);
  });

  it('leaves the cart unchanged for an unknown id', () => {
    expect(removeFromCart(items, 999)).toEqual(items);
  });

  it('does not mutate the input', () => {
    const frozen = Object.freeze([Object.freeze({ productId: 1, qty: 1 })]);
    const snapshot = structuredClone(frozen);

    removeFromCart(frozen, 1);

    expect(frozen).toEqual(snapshot);
  });
});

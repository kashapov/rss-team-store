import { describe, expect, it } from 'vitest';
import type { Product } from '../types/product';
import { keepKnownItems } from './keepKnownItems';

const catalog = new Map<number, Product>([
  [1, { id: 1, name: 'p1', category: 'family', price: 100 }],
  [2, { id: 2, name: 'p2', category: 'family', price: 200 }],
]);
const getProduct = (id: number): Product | undefined => catalog.get(id);

describe('keepKnownItems', () => {
  it('keeps rows whose product exists', () => {
    const items = [
      { productId: 1, qty: 2 },
      { productId: 2, qty: 1 },
    ];
    expect(keepKnownItems(items, getProduct)).toEqual(items);
  });

  it('drops rows with an unknown product and keeps order of the rest', () => {
    expect(
      keepKnownItems(
        [
          { productId: 1, qty: 1 },
          { productId: 99, qty: 5 },
          { productId: 2, qty: 3 },
        ],
        getProduct,
      ),
    ).toEqual([
      { productId: 1, qty: 1 },
      { productId: 2, qty: 3 },
    ]);
  });

  it('is empty for an empty cart', () => {
    expect(keepKnownItems([], getProduct)).toEqual([]);
  });
});

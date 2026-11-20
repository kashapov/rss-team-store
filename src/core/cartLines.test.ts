import { describe, expect, it } from 'vitest';
import type { CartItem } from '../types/cart';
import type { Product } from '../types/product';
import { toCartLines } from './cartLines';

describe('toCartLines', () => {
  const product = (id: number): Product => ({ id, name: `p${id}`, category: 'family', price: 100 });
  const catalog = new Map([1, 2, 3].map((id) => [id, product(id)]));
  const getProduct = (id: number): Product | undefined => catalog.get(id);

  it('returns an empty list for an empty cart', () => {
    expect(toCartLines([], getProduct)).toEqual([]);
  });

  it('pairs each item with its product and keeps qty and order', () => {
    const items: CartItem[] = [
      { productId: 3, qty: 2 },
      { productId: 1, qty: 5 },
    ];
    expect(toCartLines(items, getProduct)).toEqual([
      { product: product(3), qty: 2 },
      { product: product(1), qty: 5 },
    ]);
  });

  it('drops lines with an unknown product id', () => {
    const items: CartItem[] = [
      { productId: 1, qty: 1 },
      { productId: 999, qty: 4 },
      { productId: 2, qty: 1 },
    ];
    expect(toCartLines(items, getProduct).map((line) => line.product.id)).toEqual([1, 2]);
  });

  it('returns an empty list when every id is unknown', () => {
    expect(toCartLines([{ productId: 999, qty: 1 }], getProduct)).toEqual([]);
  });
});

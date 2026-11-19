import { describe, expect, it } from 'vitest';
import { getProductById } from './productLookup';
import { products } from './products';

describe('getProductById', () => {
  it('returns the product for a known id', () => {
    expect(getProductById(1)).toBe(products[0]);
  });

  it('finds every product in the catalog', () => {
    for (const product of products) expect(getProductById(product.id)).toBe(product);
  });

  // Корзина и итог молча пропускают строки с неизвестным id — этот тест ловит баг раньше.
  it.each([0, -1, 999, 1.5, NaN])('returns undefined for unknown id %j', (id) => {
    expect(getProductById(id)).toBeUndefined();
  });

  it('catalog ids are unique', () => {
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
  });
});

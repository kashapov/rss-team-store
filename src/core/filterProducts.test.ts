import { describe, expect, it } from 'vitest';
import type { Product } from '../types/product';
import { filterAndSortProducts } from './filterProducts';

const sample: Product[] = [
  { id: 1, name: 'Каркассон', category: 'strategy', price: 2790 },
  { id: 2, name: 'Элиас', category: 'party', price: 2290 },
  { id: 3, name: 'Уно', category: 'family', price: 990 },
  { id: 4, name: 'Имаджинариум', category: 'party', price: 2490 },
];

const names = (products: Product[]) => products.map((product) => product.name);

describe('filterAndSortProducts', () => {
  it('finds products by part of the name ignoring case', () => {
    expect(names(filterAndSortProducts(sample, { query: 'КАРК' }))).toEqual(['Каркассон']);
  });
});

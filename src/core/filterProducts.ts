import type { Category, Product } from '../types/product';

export type SortOrder = 'default' | 'price-asc' | 'price-desc';

export type ProductFilters = {
  query?: string;
  category?: Category | 'all';
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOrder;
};

const matchesQuery = (product: Product, query: string): boolean =>
  product.name.toLowerCase().includes(query.trim().toLowerCase());

const matchesCategory = (product: Product, category: Category | 'all'): boolean =>
  category === 'all' || product.category === category;

const inPriceRange = (product: Product, min?: number, max?: number): boolean =>
  (min === undefined || product.price >= min) && (max === undefined || product.price <= max);

export const filterAndSortProducts = (
  products: readonly Product[],
  { query = '', category = 'all', minPrice, maxPrice, sort = 'default' }: ProductFilters = {},
): Product[] => {
  const result = products.filter(
    (product) =>
      matchesQuery(product, query) &&
      matchesCategory(product, category) &&
      inPriceRange(product, minPrice, maxPrice),
  );

  if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);

  return result;
};

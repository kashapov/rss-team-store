import type { Category } from '../data/categories';

export type { Category };

export type Product = {
  id: number;
  name: string;
  category: Category;
  price: number;
};

import type { Product } from '../types/product';
import { products } from './products';

/** Товар по id или undefined: вызывающий сам решает, что делать с неизвестным id. */
export const getProductById = (id: number): Product | undefined =>
  products.find((product) => product.id === id);

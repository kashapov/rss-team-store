import type { Product } from './product';

export type CartItem = {
  productId: number;
  qty: number;
};

export type CartLine = {
  product: Product;
  qty: number;
};

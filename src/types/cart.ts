import type { Product } from './product';

export type CartItem = {
  productId: number;
  qty: number;
};

export type CartLine = {
  product: Product;
  qty: number;
};

export type CartTotals = {
  /** Сумма строк до скидки. */
  subtotal: number;
  /** Размер скидки (0, пока нет промокода). */
  discount: number;
  /** К оплате: subtotal − discount. */
  total: number;
};

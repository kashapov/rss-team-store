import type { CartItem } from '../types/cart';

/** Число товаров в корзине: сумма qty (3 одинаковые игры = 3). */
export const countCartItems = (items: readonly CartItem[]): number =>
  items.reduce((sum, item) => sum + item.qty, 0);

import type { CartItem } from '../types/cart';

export const MIN_QTY = 1;

const shiftQty = (items: readonly CartItem[], productId: number, delta: number): CartItem[] =>
  items.map((item) =>
    item.productId === productId ? { ...item, qty: Math.max(MIN_QTY, item.qty + delta) } : item,
  );

/** Увеличивает qty существующей строки на 1. */
export const increaseQty = (items: readonly CartItem[], productId: number): CartItem[] =>
  shiftQty(items, productId, 1);

/** Уменьшает qty на 1, но не ниже MIN_QTY: удаление строки — отдельная операция. */
export const decreaseQty = (items: readonly CartItem[], productId: number): CartItem[] =>
  shiftQty(items, productId, -1);

/** Добавляет товар в корзину: повторное добавление увеличивает qty, а не дублирует строку. */
export function addToCart(items: readonly CartItem[], productId: number): CartItem[] {
  if (!items.some((item) => item.productId === productId)) {
    return [...items, { productId, qty: 1 }];
  }
  return shiftQty(items, productId, 1);
}

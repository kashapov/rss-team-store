import type { CartItem } from '../types/cart';

/** Добавляет товар в корзину: повторное добавление увеличивает qty, а не дублирует строку. */
export function addToCart(items: readonly CartItem[], productId: number): CartItem[] {
  if (!items.some((item) => item.productId === productId)) {
    return [...items, { productId, qty: 1 }];
  }
  return items.map((item) =>
    item.productId === productId ? { ...item, qty: item.qty + 1 } : item,
  );
}

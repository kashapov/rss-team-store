import type { CartItem, CartLine } from '../types/cart';
import type { Product } from '../types/product';

/**
 * Строки корзины вместе с товарами. Строка с неизвестным id отбрасывается: она не участвует
 * ни в списке, ни в сумме. Экран и calculateCartTotals обязаны брать строки отсюда,
 * чтобы итог всегда сходился со списком.
 */
export function toCartLines(
  items: readonly CartItem[],
  getProduct: (id: number) => Product | undefined,
): CartLine[] {
  return items.flatMap(({ productId, qty }) => {
    const product = getProduct(productId);
    return product ? [{ product, qty }] : [];
  });
}

/** Сумма строки: цена товара × количество. */
export const lineTotal = ({ product, qty }: CartLine): number => product.price * qty;

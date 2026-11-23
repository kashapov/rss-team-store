import type { CartItem } from '../types/cart';
import type { Product } from '../types/product';

/** Оставляет строки, если товар есть в каталоге. */
export const keepKnownItems = (
  items: readonly CartItem[],
  getProduct: (id: number) => Product | undefined,
): CartItem[] => items.filter(({ productId }) => getProduct(productId) !== undefined);

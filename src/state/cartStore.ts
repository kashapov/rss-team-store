import type { CartItem } from '../core/cart';
import { addToCart } from '../core/cart';

// Единственное место, где живёт корзина. Экраны читают её при отрисовке:
// роутер перерисовывает экран при каждом переходе, подписки не нужны.
let items: readonly CartItem[] = [];

export const getCart = (): readonly CartItem[] => items;

export const addProduct = (productId: number): void => {
  items = addToCart(items, productId);
};

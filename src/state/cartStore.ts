import { addToCart } from '../core/cart';
import type { CartItem } from '../types/cart';

// Единственное место, где живёт корзина. Экраны читают её при отрисовке:
// роутер перерисовывает экран при каждом переходе, подписки не нужны.
let items: readonly CartItem[] = [];

export const getCart = (): readonly CartItem[] => items;

export const addProduct = (productId: number): void => {
  items = addToCart(items, productId);
};

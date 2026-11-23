import { parseCart } from '../core/parseCart';
import type { CartItem } from '../types/cart';

const STORAGE_KEY = 'team-store:cart';

/** Читает корзину из localStorage. */
export const readCart = (): CartItem[] => {
  try {
    return parseCart(localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
};

/** Сохраняет в localStorage только { productId, qty }. */
export const saveCart = (items: readonly CartItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Приватный режим, запрет браузера или переполнение, не сохраняем.
  }
};

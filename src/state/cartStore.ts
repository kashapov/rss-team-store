import { addToCart, decreaseQty, increaseQty, removeFromCart } from '../core/cart';
import { findPromo, normalizePromoCode } from '../core/promo';
import type { CartItem } from '../types/cart';

// Единственное место, где живёт корзина. Экраны читают её при отрисовке:
// роутер перерисовывает экран при каждом переходе, подписки не нужны.
let items: readonly CartItem[] = [];

export const getCart = (): readonly CartItem[] => items;

export const addProduct = (productId: number): void => {
  items = addToCart(items, productId);
};

export const increaseProductQty = (productId: number): void => {
  items = increaseQty(items, productId);
};

export const decreaseProductQty = (productId: number): void => {
  items = decreaseQty(items, productId);
};

export const removeProduct = (productId: number): void => {
  items = removeFromCart(items, productId);
};

// Применённый промокод: один и только нормализованный. Скидку не храним, она считается из него.
let promoCode: string | undefined;

export const getPromoCode = (): string | undefined => promoCode;

/** Применяет код. Неизвестный код сбрасывает ранее применённый: без скидки. */
export const applyPromoCode = (code: string): boolean => {
  const isKnown = findPromo(code) !== undefined;
  promoCode = isKnown ? normalizePromoCode(code) : undefined;
  return isKnown;
};

/** Явная отмена применённого кода. */
export const clearPromoCode = (): void => {
  promoCode = undefined;
};

/** Введённый код совпадает с уже применённым (с учётом нормализации). */
export const isPromoCodeApplied = (code: string): boolean =>
  promoCode !== undefined && normalizePromoCode(code) === promoCode;

export type AppliedPromo = { code: string; percent: number };

/** Применённый код с данными из справочника или undefined, если кода нет. */
export const getAppliedPromo = (): AppliedPromo | undefined => {
  if (promoCode === undefined) return undefined;
  const promo = findPromo(promoCode);
  return promo && { code: promoCode, percent: promo.percent };
};

import { addToCart, decreaseQty, increaseQty, removeFromCart } from '../core/cart';
import { findPromo, normalizePromoCode } from '../core/promo';
import type { CartItem } from '../types/cart';

// Единственное место, где живёт корзина. Экраны читают её при отрисовке: роутер
// перерисовывает экран при каждом переходе. Навигация создаётся один раз, поэтому
// узнаёт об изменениях через подписку.
let items: readonly CartItem[] = [];

export const getCart = (): readonly CartItem[] => items;

export type CartListener = (items: readonly CartItem[]) => void;

const listeners = new Set<CartListener>();

/** Подписка на изменения корзины. Возвращает функцию отписки. */
export const subscribe = (listener: CartListener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

// Единственное место, где присваивается items: каждое изменение оповещает подписчиков.
const setItems = (next: readonly CartItem[]): void => {
  items = next;
  listeners.forEach((listener) => listener(items));
};

// Все изменения корзины собираются через mutate, поэтому оповещение не забыть.
const mutate =
  (change: (current: readonly CartItem[], productId: number) => CartItem[]) =>
  (productId: number): void =>
    setItems(change(items, productId));

export const addProduct = mutate(addToCart);
export const increaseProductQty = mutate(increaseQty);
export const decreaseProductQty = mutate(decreaseQty);
export const removeProduct = mutate(removeFromCart);

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

import { promoCodes } from '../data/promoCodes';
import type { Promo } from '../types/promo';

export const normalizePromoCode = (code: string): string => code.trim().toUpperCase();

type PromoTable = ReadonlyMap<string, Promo>;

/** Промокод по введённой строке или undefined, если такого нет. */
export const findPromo = (code?: string, promos: PromoTable = promoCodes): Promo | undefined =>
  code === undefined ? undefined : promos.get(normalizePromoCode(code));

/**
 * Скидка в гривнах, округлённая до целых. Всегда считается от суммы до скидки,
 * поэтому повторное применение того же кода ничего не накапливает.
 */
export const calculateDiscount = (
  subtotal: number,
  code?: string,
  promos: PromoTable = promoCodes,
): number => {
  const promo = findPromo(code, promos);
  return promo ? Math.round((subtotal * promo.percent) / 100) : 0;
};

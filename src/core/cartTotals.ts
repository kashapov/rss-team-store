import type { CartLine, CartTotals } from '../types/cart';
import { lineTotal } from './cartLines';
import { calculateDiscount } from './promo';

/** Итоги по строкам корзины. */
export function calculateCartTotals(lines: readonly CartLine[], promoCode?: string): CartTotals {
  const subtotal = lines.reduce((sum, line) => sum + lineTotal(line), 0);
  const discount = calculateDiscount(subtotal, promoCode);

  return { subtotal, discount, total: subtotal - discount };
}

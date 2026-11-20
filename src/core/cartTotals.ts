import type { CartLine, CartTotals } from '../types/cart';
import { lineTotal } from './cartLines';

/** Итоги по строкам корзины. */
export function calculateCartTotals(lines: readonly CartLine[], _promoCode?: string): CartTotals {
  const subtotal = lines.reduce((sum, line) => sum + lineTotal(line), 0);
  const discount = 0; // TODO (#9): считать скидку по _promoCode и убрать «_» у параметра

  return { subtotal, discount, total: subtotal - discount };
}

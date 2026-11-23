import type { CartItem } from '../types/cart';
import { MIN_QTY } from './cart';

const isIntAtLeast = (value: unknown, min: number): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= min;

const toCartItem = (raw: unknown): CartItem | undefined => {
  if (typeof raw !== 'object' || raw === null) return undefined;
  const { productId, qty } = raw as Record<string, unknown>;
  return isIntAtLeast(productId, 0) && isIntAtLeast(qty, MIN_QTY) ? { productId, qty } : undefined;
};

/** Разбор сохранённой корзины. Существование товара в каталоге не проверяется. */
export function parseCart(raw: string | null): CartItem[] {
  if (raw === null) return [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];

  const merged = new Map<number, CartItem>();
  for (const entry of data) {
    const item = toCartItem(entry);
    if (!item) continue;
    const existing = merged.get(item.productId);
    merged.set(item.productId, existing ? { ...existing, qty: existing.qty + item.qty } : item);
  }
  return [...merged.values()];
}

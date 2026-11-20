import type { Promo } from '../types/promo';

// Ключи — нормализованные коды (верхний регистр). Новый промокод — новая строка здесь.
export const promoCodes: ReadonlyMap<string, Promo> = new Map([['SALE10', { percent: 10 }]]);

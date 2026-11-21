import { beforeEach, describe, expect, it, vi } from 'vitest';

// Состояние корзины живёт в переменных модуля. Чтобы каждый тест начинался с чистого
// состояния и не зависел от порядка, перед каждым тестом импортируем свежую копию стора.
let store: typeof import('./cartStore');

beforeEach(async () => {
  vi.resetModules();
  store = await import('./cartStore');
});

describe('promo code state', () => {
  it('has no code initially', () => {
    expect(store.getPromoCode()).toBeUndefined();
  });

  it('stores a valid code in normalized form', () => {
    expect(store.applyPromoCode(' sale10 ')).toBe(true);
    expect(store.getPromoCode()).toBe('SALE10');
  });

  it('applying the same code again in another spelling keeps one normalized code', () => {
    store.applyPromoCode('SALE10');

    expect(store.applyPromoCode(' sale10 ')).toBe(true);
    expect(store.getPromoCode()).toBe('SALE10');
  });

  it('drops the applied code when an unknown one is entered', () => {
    store.applyPromoCode('SALE10');

    expect(store.applyPromoCode('NOPE')).toBe(false);
    expect(store.getPromoCode()).toBeUndefined();
  });

  it('does not set a code when the very first one is unknown', () => {
    expect(store.applyPromoCode('NOPE')).toBe(false);
    expect(store.getPromoCode()).toBeUndefined();
  });
});

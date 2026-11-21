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

describe('clearPromoCode', () => {
  it('removes the applied code', () => {
    store.applyPromoCode('SALE10');
    store.clearPromoCode();
    expect(store.getPromoCode()).toBeUndefined();
  });

  it('is safe to call without an applied code', () => {
    store.clearPromoCode();
    expect(store.getPromoCode()).toBeUndefined();
  });
});

describe('isPromoCodeApplied', () => {
  it('is false when no code is applied', () => {
    expect(store.isPromoCodeApplied('SALE10')).toBe(false);
  });

  it.each(['SALE10', ' sale10 ', 'Sale10'])('matches the applied code written as %j', (code) => {
    store.applyPromoCode('SALE10');
    expect(store.isPromoCodeApplied(code)).toBe(true);
  });

  it('is false for a different code', () => {
    store.applyPromoCode('SALE10');
    expect(store.isPromoCodeApplied('SALE20')).toBe(false);
  });

  it('is false after the code is cleared', () => {
    store.applyPromoCode('SALE10');
    store.clearPromoCode();
    expect(store.isPromoCodeApplied('SALE10')).toBe(false);
  });
});

describe('getAppliedPromo', () => {
  it('is undefined when no code is applied', () => {
    expect(store.getAppliedPromo()).toBeUndefined();
  });

  it('returns the normalized code with its percent from the table', () => {
    store.applyPromoCode(' sale10 ');
    expect(store.getAppliedPromo()).toEqual({ code: 'SALE10', percent: 10 });
  });

  it('is undefined after the code is cleared', () => {
    store.applyPromoCode('SALE10');
    store.clearPromoCode();
    expect(store.getAppliedPromo()).toBeUndefined();
  });
});

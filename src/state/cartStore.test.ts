import { beforeEach, describe, expect, it, vi } from 'vitest';

// Состояние корзины живёт в переменных модуля. Чтобы каждый тест начинался с чистого
// состояния и не зависел от порядка, перед каждым тестом импортируем свежую копию стора.
let store: typeof import('./cartStore');

beforeEach(async () => {
  vi.resetModules();
  store = await import('./cartStore');
});

describe('subscribe', () => {
  type Mutator = 'addProduct' | 'increaseProductQty' | 'decreaseProductQty' | 'removeProduct';

  // Каждая функция, меняющая корзину. Новая функция изменения — новая строка здесь.
  it.each<Mutator>(['addProduct', 'increaseProductQty', 'decreaseProductQty', 'removeProduct'])(
    '%s notifies the listener with the current items',
    (mutator) => {
      store.addProduct(1);
      store.addProduct(1);
      const listener = vi.fn();
      store.subscribe(listener);

      store[mutator](1);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(store.getCart());
    },
  );

  it('passes the updated items', () => {
    const listener = vi.fn();
    store.subscribe(listener);

    store.addProduct(1);

    expect(listener).toHaveBeenLastCalledWith([{ productId: 1, qty: 1 }]);
  });

  it('is not called on subscribe', () => {
    const listener = vi.fn();
    store.subscribe(listener);
    expect(listener).not.toHaveBeenCalled();
  });

  it('stops calling the listener after unsubscribe', () => {
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    unsubscribe();
    store.addProduct(1);

    expect(listener).not.toHaveBeenCalled();
  });

  it('calls every subscriber', () => {
    const first = vi.fn();
    const second = vi.fn();
    store.subscribe(first);
    store.subscribe(second);

    store.addProduct(1);

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('does not notify on promo code changes', () => {
    const listener = vi.fn();
    store.subscribe(listener);

    store.applyPromoCode('SALE10');

    expect(listener).not.toHaveBeenCalled();
  });
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

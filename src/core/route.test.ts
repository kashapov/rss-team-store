import { describe, expect, it } from 'vitest';
import { ROUTES, hasKnownRoute, parseRoute, routeName, toHash } from './route';

describe('parseRoute', () => {
  it.each(['', '#', '#/', '/'])('empty hash %j opens about', (hash) => {
    expect(parseRoute(hash)).toBe('about');
  });

  it.each([
    ['#/about', 'about'],
    ['#/catalog', 'catalog'],
    ['#/cart', 'cart'],
  ])('%s -> %s', (hash, route) => {
    expect(parseRoute(hash)).toBe(route);
  });

  it('ignores trailing slash and nested segments', () => {
    expect(parseRoute('#/cart/')).toBe('cart');
    expect(parseRoute('#/catalog/xx')).toBe('catalog');
  });

  it('ignores query string', () => {
    expect(parseRoute('#/cart?x=1')).toBe('cart');
    expect(parseRoute('#/catalog/42?x=1')).toBe('catalog');
    expect(parseRoute('#/about?x=1')).toBe('about');
  });

  it('falls back to about for unknown routes', () => {
    expect(parseRoute('#/nope')).toBe('about');
    expect(parseRoute('#/toString')).toBe('about');
  });

  it('is case-sensitive: #/CART is unknown and falls back to about', () => {
    expect(parseRoute('#/CART')).toBe('about');
  });
});

describe('toHash', () => {
  it.each(ROUTES)('builds #/%s and round-trips with parseRoute', (route) => {
    expect(toHash(route)).toBe(`#/${route}`);
    expect(parseRoute(toHash(route))).toBe(route);
  });
});

describe('routeName', () => {
  it('returns the display name', () => {
    expect(routeName('about')).toBe('О нас');
    expect(routeName('cart')).toBe('Корзина');
  });
});

describe('hasKnownRoute', () => {
  it.each(['#/about', '#/cart/', '#/catalog/42', '#/cart?x=1'])('%s is known', (hash) => {
    expect(hasKnownRoute(hash)).toBe(true);
  });

  it.each(['', '#', '#/', '#/nope', '#/toString', '#/CART'])('%j is not known', (hash) => {
    expect(hasKnownRoute(hash)).toBe(false);
  });
});

describe('ROUTES', () => {
  it('keeps navigation order', () => {
    expect(ROUTES).toEqual(['about', 'catalog', 'cart']);
  });
});

import { describe, expect, it } from 'vitest';
import { parseCart } from './parseCart';

describe('parseCart', () => {
  it('restores a valid cart', () => {
    expect(parseCart('[{"productId":1,"qty":2},{"productId":3,"qty":1}]')).toEqual([
      { productId: 1, qty: 2 },
      { productId: 3, qty: 1 },
    ]);
  });

  it('is empty for an empty array', () => {
    expect(parseCart('[]')).toEqual([]);
  });

  it.each([
    ['no key (null)', null],
    ['empty string', ''],
    ['broken JSON', '{oops'],
    ['object', '{"productId":1,"qty":1}'],
    ['number', '5'],
    ['string', '"abc"'],
    ['null', 'null'],
  ])('is empty for %s', (_name, raw) => {
    expect(parseCart(raw)).toEqual([]);
  });

  it.each([
    ['null', 'null'],
    ['number', '7'],
    ['string', '"x"'],
    ['array', '[1,2]'],
    ['no productId', '{"qty":1}'],
    ['no qty', '{"productId":1}'],
    ['string productId', '{"productId":"1","qty":1}'],
    ['string qty', '{"productId":1,"qty":"2"}'],
    ['qty 0', '{"productId":1,"qty":0}'],
    ['negative qty', '{"productId":1,"qty":-1}'],
    ['fractional qty', '{"productId":1,"qty":1.5}'],
    ['fractional productId', '{"productId":1.5,"qty":1}'],
    ['negative productId', '{"productId":-1,"qty":1}'],
  ])('drops a bad row: %s, and keeps the good ones', (_name, bad) => {
    expect(parseCart(`[${bad},{"productId":2,"qty":3}]`)).toEqual([{ productId: 2, qty: 3 }]);
  });

  it('merges duplicate productId by summing qty', () => {
    expect(
      parseCart('[{"productId":1,"qty":2},{"productId":2,"qty":1},{"productId":1,"qty":3}]'),
    ).toEqual([
      { productId: 1, qty: 5 },
      { productId: 2, qty: 1 },
    ]);
  });

  it('ignores extra fields such as a stale price', () => {
    expect(parseCart('[{"productId":1,"qty":1,"price":1}]')).toEqual([{ productId: 1, qty: 1 }]);
  });
});

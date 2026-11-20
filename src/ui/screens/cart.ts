import { toCartLines } from '../../core/cartLines';
import { routeName } from '../../core/route';
import { getProductById } from '../../data/productLookup';
import { getCart } from '../../state/cartStore';
import type { Product } from '../../types/product';
import type { Screen } from '../../types/screen';
import { element } from '../dom';

export const cartScreen: Screen = (container) => {
  const lines = toCartLines(getCart(), getProductById);

  container.append(
    element('h1', { text: routeName('cart') }),
    lines.length === 0
      ? element('p', { text: 'Корзина пуста.' })
      : element(
          'ul',
          {},
          lines.map(({ product, qty }) => cartLine(product, qty)),
        ),
  );
};

const cartLine = (product: Product, qty: number): HTMLElement =>
  element('li', { text: `${product.name} × ${qty}` });

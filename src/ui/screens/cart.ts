import { routeName } from '../../core/route';
import { getProductById } from '../../data/productLookup';
import { getCart } from '../../state/cartStore';
import type { Product } from '../../types/product';
import type { Screen } from '../../types/screen';
import { element } from '../dom';

export const cartScreen: Screen = (container) => {
  // Строка с неизвестным id не участвует ни в списке, ни (позже) в сумме.
  const lines = getCart().flatMap((item) => {
    const product = getProductById(item.productId);
    return product ? [{ product, qty: item.qty }] : [];
  });

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

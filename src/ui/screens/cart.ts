import { MIN_QTY } from '../../core/cart';
import { lineTotal, toCartLines } from '../../core/cartLines';
import { calculateCartTotals } from '../../core/cartTotals';
import { formatPrice } from '../../core/formatPrice';
import { routeName } from '../../core/route';
import { getProductById } from '../../data/productLookup';
import {
  decreaseProductQty,
  getCart,
  increaseProductQty,
  removeProduct,
} from '../../state/cartStore';
import type { CartLine, CartTotals } from '../../types/cart';
import type { Screen } from '../../types/screen';
import { element } from '../dom';

type LineAction = 'dec' | 'inc' | 'remove';

const APPLY: Record<LineAction, (productId: number) => void> = {
  dec: decreaseProductQty,
  inc: increaseProductQty,
  remove: removeProduct,
};

type OnChange = (productId: number, action: LineAction) => void;

export const cartScreen: Screen = (container) => {
  // Роутер не перерисовывает экран при клике внутри него, поэтому перерисовываем сами.
  const render = (): void => {
    const lines = toCartLines(getCart(), getProductById);

    const onChange: OnChange = (productId, action) => {
      APPLY[action](productId);
      render();
    };

    container.replaceChildren(
      element('h1', { text: routeName('cart') }),
      lines.length === 0
        ? element('p', { text: 'Корзина пуста.' })
        : element(
            'ul',
            {},
            lines.map((line) => cartLine(line, onChange)),
          ),
      cartSummary(calculateCartTotals(lines)),
    );
  };

  render();
};

const cartSummary = ({ total }: CartTotals): HTMLElement =>
  element('div', { className: 'cart__summary' }, [
    element('span', { text: 'Итого' }),
    element('output', { className: 'cart__sum', text: formatPrice(total) }),
  ]);

const cartLine = (line: CartLine, onChange: OnChange): HTMLElement => {
  const { product, qty } = line;

  return element('li', { className: 'cart__line' }, [
    element('div', { className: 'cart__info' }, [
      element('span', { className: 'cart__name', text: product.name }),
      element('span', { className: 'cart__price', text: `${formatPrice(product.price)} / шт.` }),
    ]),
    element('div', { className: 'cart__qty' }, [
      lineButton('cart__btn', '−', `Уменьшить количество: ${product.name}`, qty <= MIN_QTY, () =>
        onChange(product.id, 'dec'),
      ),
      element('output', { className: 'cart__count', text: String(qty) }),
      lineButton('cart__btn', '+', `Увеличить количество: ${product.name}`, false, () =>
        onChange(product.id, 'inc'),
      ),
    ]),
    element('span', { className: 'cart__total', text: formatPrice(lineTotal(line)) }),
    lineButton('cart__remove', '×', `Удалить из корзины: ${product.name}`, false, () =>
      onChange(product.id, 'remove'),
    ),
  ]);
};

const lineButton = (
  className: string,
  text: string,
  label: string,
  disabled: boolean,
  onClick: () => void,
): HTMLButtonElement => {
  const button = element('button', {
    className,
    text,
    attrs: { type: 'button', 'aria-label': label },
  });
  button.disabled = disabled;
  button.addEventListener('click', onClick);
  return button;
};

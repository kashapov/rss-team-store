import { MIN_QTY } from '../../core/cart';
import { lineTotal, toCartLines } from '../../core/cartLines';
import { calculateCartTotals } from '../../core/cartTotals';
import { formatPrice } from '../../core/formatPrice';
import { routeName } from '../../core/route';
import { getProductById } from '../../data/productLookup';
import {
  applyPromoCode,
  decreaseProductQty,
  getCart,
  getPromoCode,
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

type PromoMessage = { text: string; isError: boolean };

export const cartScreen: Screen = (container) => {
  // Введённый текст и сообщение живут только на этом экране. Экран перерисовывается
  // целиком при каждом клике, поэтому без этих переменных поле очищалось бы на «+».
  let draft = '';
  let message: PromoMessage | undefined;

  // Роутер не перерисовывает экран при клике внутри него, поэтому перерисовываем сами.
  const render = (): void => {
    const lines = toCartLines(getCart(), getProductById);

    const onChange: OnChange = (productId, action) => {
      APPLY[action](productId);
      render();
    };

    const onApplyPromo = (code: string): void => {
      draft = code;
      if (code.trim() === '') {
        draft = '';
        message = { text: 'Введите промокод.', isError: true };
      } else if (applyPromoCode(code)) {
        message = { text: `Промокод ${getPromoCode()} применён.`, isError: false };
        draft = '';
      } else {
        message = { text: 'Промокод не найден - скидка не применяется', isError: true };
      }
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
      promoForm(draft, message, onApplyPromo, (value) => (draft = value)),
      cartSummary(calculateCartTotals(lines, getPromoCode())),
    );
  };

  render();
};

const promoForm = (
  draft: string,
  message: PromoMessage | undefined,
  onApply: (code: string) => void,
  onInput: (value: string) => void,
): HTMLElement => {
  const input = element('input', {
    className: 'cart__promo-input',
    attrs: {
      type: 'text',
      placeholder: 'Промокод',
      'aria-label': 'Промокод',
      autocomplete: 'off',
    },
  });
  input.value = draft;
  input.addEventListener('input', () => onInput(input.value));

  const form = element('form', { className: 'cart__promo' }, [
    element('div', { className: 'cart__promo-row' }, [
      input,
      element('button', {
        className: 'cart__promo-btn',
        text: 'Применить',
        attrs: { type: 'submit' },
      }),
    ]),
    element('p', {
      className: message?.isError ? 'cart__message cart__message--error' : 'cart__message',
      text: message?.text ?? '',
      attrs: { role: 'status' },
    }),
  ]);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    onApply(input.value);
  });
  return form;
};

const cartSummary = ({ subtotal, discount, total }: CartTotals): HTMLElement =>
  element('div', { className: 'cart__summary' }, [
    ...(discount > 0
      ? [
          summaryRow('Сумма', formatPrice(subtotal)),
          summaryRow('Скидка', `−${formatPrice(discount)}`),
        ]
      : []),
    summaryRow('Итого', formatPrice(total), true),
  ]);

const summaryRow = (label: string, value: string, isTotal = false): HTMLElement =>
  element('div', { className: isTotal ? 'cart__row cart__row--total' : 'cart__row' }, [
    element('span', { text: label }),
    element('output', { className: 'cart__sum', text: value }),
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

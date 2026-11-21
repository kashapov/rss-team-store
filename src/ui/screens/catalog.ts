import { filterAndSortProducts, type SortOrder } from '../../core/filterProducts';
import { formatPrice } from '../../core/formatPrice';
import { routeName } from '../../core/route';
import { categories } from '../../data/categories';
import { products } from '../../data/products';
import { addProduct } from '../../state/cartStore';
import type { Category, Product } from '../../types/product';
import type { Screen } from '../../types/screen';
import { categoryIconUrl } from '../../utils/assetUrl';
import { element } from '../dom';

const ADD_LABEL = 'В корзину';
const ADDED_LABEL = 'Добавлено';
const ADDED_MS = 1000;

const categoryById = new Map(categories.map((category) => [category.id, category]));

const getCategory = (id: Category) => {
  const category = categoryById.get(id);
  if (!category) throw new Error(`Unknown category: ${id}`);
  return category;
};

const SORT_OPTIONS: readonly { value: SortOrder; label: string }[] = [
  { value: 'default', label: 'По умолчанию' },
  { value: 'price-asc', label: 'Цена ↑' },
  { value: 'price-desc', label: 'Цена ↓' },
];

export const catalogScreen: Screen = (container) => {
  const search = element('input', {
    className: 'filters__control',
    attrs: { type: 'search', name: 'query', placeholder: 'Название' },
  });
  const category = select('category', [
    { value: 'all', label: 'Все' },
    ...categories.map(({ id, name }) => ({ value: id, label: name })),
  ]);
  const minPrice = priceInput('minPrice', 'От');
  const maxPrice = priceInput('maxPrice', 'До');
  const sort = select('sort', SORT_OPTIONS);

  const reset = element('button', {
    className: 'filters__reset',
    text: 'Сбросить',
    attrs: { type: 'button' },
  });

  const form = element('form', { className: 'filters', attrs: { role: 'search' } }, [
    field('Поиск', search, 'filters__field--search'),
    field('Категория', category, 'filters__field--category'),
    field('Цена от', minPrice, 'filters__field--price'),
    field('Цена до', maxPrice, 'filters__field--price'),
    field('Сортировка', sort, 'filters__field--sort'),
    reset,
  ]);

  const results = element('div');

  // Перерисовываем только список, чтобы поля фильтров не теряли фокус при вводе.
  const render = (): void => {
    const filtersActive =
      search.value.trim() !== '' ||
      category.value !== 'all' ||
      minPrice.value.trim() !== '' ||
      maxPrice.value.trim() !== '' ||
      sort.value !== 'default';

    reset.disabled = !filtersActive;

    const found = filterAndSortProducts(products, {
      query: search.value,
      category: category.value as Category | 'all',
      minPrice: parsePrice(minPrice.value),
      maxPrice: parsePrice(maxPrice.value),
      sort: sort.value as SortOrder,
    });

    results.replaceChildren(
      found.length === 0
        ? element('p', { className: 'catalog__empty', text: 'Ничего не найдено.' })
        : element(
            'ul',
            { className: 'catalog' },
            found.map((product) => productCard(product)),
          ),
    );
  };

  form.addEventListener('input', render);
  form.addEventListener('submit', (event) => event.preventDefault());
  reset.addEventListener('click', () => {
    form.reset();
    render();
  });

  container.append(
    element('div', { className: 'catalog-toolbar' }, [
      element('h1', { text: routeName('catalog') }),
      form,
    ]),
    results,
  );
  render();
};

const parsePrice = (value: string): number | undefined => {
  if (value.trim() === '') return undefined;
  const price = Number(value);
  return Number.isFinite(price) ? price : undefined;
};

const field = (label: string, control: HTMLElement, modifier: string): HTMLElement =>
  element('label', { className: `filters__field ${modifier}` }, [
    element('span', { className: 'filters__label', text: label }),
    control,
  ]);

const select = (
  name: string,
  options: readonly { value: string; label: string }[],
): HTMLSelectElement =>
  element(
    'select',
    { className: 'filters__control', attrs: { name } },
    options.map(({ value, label }) => element('option', { text: label, attrs: { value } })),
  );

const priceInput = (name: string, placeholder: string): HTMLInputElement =>
  element('input', {
    className: 'filters__control',
    attrs: { type: 'number', name, placeholder, min: '0', step: '10', inputmode: 'numeric' },
  });

const productCard = (product: Product): HTMLElement => {
  const category = getCategory(product.category);

  const button = element('button', {
    className: 'catalog__add',
    text: ADD_LABEL,
    attrs: { type: 'button' },
  });

  let resetTimer: ReturnType<typeof setTimeout> | undefined;

  button.addEventListener('click', () => {
    addProduct(product.id);
    button.textContent = ADDED_LABEL;
    button.disabled = true;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      button.textContent = ADD_LABEL;
      button.disabled = false;
    }, ADDED_MS);
  });

  return element('li', { className: 'catalog__card' }, [
    element('div', { className: 'catalog__top' }, [
      element('img', {
        className: 'catalog__image',
        attrs: {
          src: categoryIconUrl(category.image),
          alt: '',
        },
      }),
      element('div', { className: 'catalog__meta' }, [
        element('h2', { className: 'catalog__name', text: product.name }),
        element('p', { className: 'catalog__category', text: category.name }),
      ]),
    ]),
    element('div', { className: 'catalog__footer' }, [
      element('p', {
        className: 'catalog__price',
        text: formatPrice(product.price),
      }),
      button,
    ]),
  ]);
};

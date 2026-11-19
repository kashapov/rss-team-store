import { routeName } from '../../core/route';
import { categories } from '../../data/categories';
import { products } from '../../data/products';
import { addProduct } from '../../state/cartStore';
import type { Category, Product } from '../../types/product';
import type { Screen } from '../../types/screen';
import { categoryIconUrl } from '../../utils/assetUrl';
import { element } from '../dom';

const categoryById = new Map(categories.map((category) => [category.id, category]));

const getCategory = (id: Category) => {
  const category = categoryById.get(id);
  if (!category) throw new Error(`Unknown category: ${id}`);
  return category;
};

export const catalogScreen: Screen = (container) => {
  container.append(
    element('h1', { text: routeName('catalog') }),
    element(
      'ul',
      { className: 'catalog' },
      products.map((product) => productCard(product)),
    ),
  );
};

const productCard = (product: Product): HTMLElement => {
  const category = getCategory(product.category);

  const button = element('button', {
    className: 'catalog__add',
    text: 'В корзину',
    attrs: { type: 'button' },
  });
  button.addEventListener('click', () => addProduct(product.id));

  return element('li', { className: 'catalog__card' }, [
    element('div', { className: 'catalog__top' }, [
      element('img', {
        className: 'catalog__image',
        attrs: {
          src: categoryIconUrl(category.image),
          alt: category.name,
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
        text: `${product.price} грн`,
      }),
      button,
    ]),
  ]);
};

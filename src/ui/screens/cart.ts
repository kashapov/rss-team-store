import { routeName } from '../../core/route';
import type { Screen } from '../../types/screen';
import { element } from '../dom';

export const cartScreen: Screen = (container) => {
  container.append(
    element('h1', { text: routeName('cart') }),
    element('p', { text: 'Скоро здесь появится содержимое.' }),
  );
};

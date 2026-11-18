import { routeName } from '../../core/route';
import type { Screen } from '../../types/screen';
import { element } from '../dom';

export const catalogScreen: Screen = (container) => {
  container.append(
    element('h1', { text: routeName('catalog') }),
    element('p', { text: 'Скоро здесь появится содержимое.' }),
  );
};

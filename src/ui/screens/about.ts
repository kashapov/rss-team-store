import { routeName } from '../../core/route';
import type { Screen } from '../../types/screen';
import { element } from '../dom';

export const aboutScreen: Screen = (container) => {
  container.append(
    element('h1', { text: routeName('about') }),
    element('p', { text: 'Текст о команде появится в отдельной задаче.' }),
  );
};

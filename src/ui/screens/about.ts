import { routeName } from '../../core/route';
import type { Screen } from '../../types/screen';
import { element } from '../dom';

const REPO_URL = 'https://github.com/kashapov/rss-team-store';
const PAGES_URL = 'https://kashapov.github.io/rss-team-store/';

/** Черновик блока @KsArt-IT — поправит вторым коммитом при необходимости. */
const MEMBERS = [
  {
    login: 'kashapov',
    contributions: [
      'README и правила Git',
      'данные товаров и иконки категорий',
      'каталог: карточки и «В корзину», формат цены',
      'деплой на GitHub Pages',
      'фильтры: поиск, категория, цена, сортировка',
      'страница «О нас»: описание проекта и вклад команды',
    ],
  },
  {
    login: 'KsArt-IT',
    contributions: [
      'каркас: Vite, Vitest, CI',
      'навигация и стартовая «О нас» (со счётчиком у «Корзина»)',
      'корзина: количество, удаление, итог, промокод SALE10',
      'страница «О нас»: описание проекта и вклад команды',
    ],
  },
] as const;

export const aboutScreen: Screen = (container) => {
  container.append(
    element('h1', { text: routeName('about') }),
    element('p', { className: 'about__intro' }, [
      document.createTextNode(
        'Учебный магазин настольных игр: каталог с фильтрами, корзина с итогом и промокодом. Данные в ',
      ),
      externalLink('репозитории', REPO_URL),
      document.createTextNode(', публикация на '),
      externalLink('GitHub Pages', PAGES_URL),
      document.createTextNode('.'),
    ]),
    ...MEMBERS.flatMap(contributionBlock),
  );
};

const externalLink = (text: string, href: string): HTMLAnchorElement =>
  element('a', {
    text,
    attrs: { href, target: '_blank', rel: 'noopener noreferrer' },
  });

const contributionBlock = ({
  login,
  contributions,
}: (typeof MEMBERS)[number]): readonly HTMLElement[] => [
  element('h2', { className: 'about__name' }, [
    externalLink(`@${login}`, `https://github.com/${login}`),
  ]),
  element(
    'ul',
    { className: 'about__list' },
    contributions.map((text) => element('li', { text })),
  ),
];

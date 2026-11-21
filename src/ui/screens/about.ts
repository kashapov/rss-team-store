import { routeName } from '../../core/route';
import type { Screen } from '../../types/screen';
import { element } from '../dom';

const REPO_URL = 'https://github.com/kashapov/rss-team-store';
const PAGES_URL = 'https://kashapov.github.io/rss-team-store/';

const MEMBERS = [
  {
    login: 'kashapov',
    contributions: [
      'README и правила Git: ветки, PR, Issues, канбан',
      'данные товаров: список игр, категории и иконки',
      'каталог: карточки, «В корзину», формат цены',
      'деплой на GitHub Pages: Actions при push в main',
      'фильтры: поиск, категория, цена, сортировка',
      'страница «О нас»: описание магазина и вклад команды',
    ],
  },
  {
    login: 'KsArt-IT',
    contributions: [
      'каркас проекта: Vite + TypeScript, Vitest, Prettier, CI на каждый PR',
      'навигация на хэшах и экраны-заглушки',
      'корзина: добавление, количество, удаление, цена за штуку, итог',
      'промокод SALE10: скидка с округлением, отмена, «уже применён»',
      'счётчик товаров у «Корзина» (подписка на изменения корзины)',
      'ревью PR: данные, каталог, деплой, фильтры',
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

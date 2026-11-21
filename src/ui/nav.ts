import type { Route } from '../core/route';
import { ROUTES, routeName, toHash } from '../core/route';
import { element } from './dom';

const COUNTED_ROUTE: Route = 'cart';

export function createNav(): HTMLElement {
  return element(
    'nav',
    { className: 'nav', attrs: { 'aria-label': 'Основная навигация' } },
    ROUTES.map((route) =>
      element(
        'a',
        {
          text: routeName(route),
          attrs: { href: toHash(route), 'data-route': route },
        },
        route === COUNTED_ROUTE ? [cartCount()] : [],
      ),
    ),
  );
}

// Число видно глазами; скринридер читает aria-label ссылки, поэтому само число скрыто от него.
const cartCount = (): HTMLElement => {
  const count = element('span', { className: 'nav__count', attrs: { 'aria-hidden': 'true' } });
  count.hidden = true;
  return count;
};

export function setActiveNav(nav: HTMLElement, active: Route): void {
  nav.querySelector('[aria-current]')?.removeAttribute('aria-current');
  nav.querySelector(`[data-route="${active}"]`)?.setAttribute('aria-current', 'page');
}

/** Обновляет только счётчик у «Корзины», ссылки не пересоздаются. При 0 счётчик скрыт. */
export function setCartCount(nav: HTMLElement, count: number): void {
  const link = nav.querySelector<HTMLElement>(`[data-route="${COUNTED_ROUTE}"]`);
  const badge = link?.querySelector<HTMLElement>('.nav__count');
  if (!link || !badge) return;

  badge.textContent = String(count);
  badge.hidden = count === 0;

  const name = routeName(COUNTED_ROUTE);
  if (count === 0) link.removeAttribute('aria-label');
  else link.setAttribute('aria-label', `${name}, товаров: ${count}`);
}

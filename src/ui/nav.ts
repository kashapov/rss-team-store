import type { Route } from '../core/route';
import { ROUTES, routeName, toHash } from '../core/route';
import { element } from './dom';

export function createNav(): HTMLElement {
  return element(
    'nav',
    { className: 'nav', attrs: { 'aria-label': 'Основная навигация' } },
    ROUTES.map((route) =>
      element('a', {
        text: routeName(route),
        attrs: { href: toHash(route), 'data-route': route },
      }),
    ),
  );
}

export function setActiveNav(nav: HTMLElement, active: Route): void {
  nav.querySelector('[aria-current]')?.removeAttribute('aria-current');
  nav.querySelector(`[data-route="${active}"]`)?.setAttribute('aria-current', 'page');
}

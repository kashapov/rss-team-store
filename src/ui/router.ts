import type { Route } from '../core/route';
import { DEFAULT_ROUTE, hasKnownRoute, parseRoute, toHash } from '../core/route';
import type { Screen } from '../types/screen';
import { aboutScreen } from './screens/about';
import { cartScreen } from './screens/cart';
import { catalogScreen } from './screens/catalog';

const screens: Record<Route, Screen> = {
  about: aboutScreen,
  catalog: catalogScreen,
  cart: cartScreen,
};

export function startRouter(container: HTMLElement, onChange?: (route: Route) => void): void {
  let current: Route | undefined;

  const render = (): void => {
    // replaceState не пишет в историю и не вызывает hashchange — рисуем сразу.
    if (!hasKnownRoute(location.hash)) {
      history.replaceState(null, '', toHash(DEFAULT_ROUTE));
    }

    const route = parseRoute(location.hash);
    if (route === current) return;

    const isFirstRender = current === undefined;
    current = route;
    container.replaceChildren();
    screens[route](container);
    onChange?.(route);

    // Скринридер узнаёт о смене экрана; при первой загрузке фокус не трогаем.
    if (!isFirstRender) container.focus();
  };

  window.addEventListener('hashchange', render);
  render(); // при первой загрузке hashchange не придёт
}

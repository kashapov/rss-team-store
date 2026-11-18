const ROUTE_NAMES = {
  about: 'О нас',
  catalog: 'Каталог',
  cart: 'Корзина',
} as const;

export type Route = keyof typeof ROUTE_NAMES;

export const ROUTES = Object.keys(ROUTE_NAMES) as Route[];

export const DEFAULT_ROUTE: Route = 'about';

/** Первый сегмент хэша без вложенных частей и query: '#/cart?x=1' -> 'cart'. */
function firstSegment(hash: string): string {
  const [segment = ''] = hash.replace(/^#\/?/, '').split(/[/?]/);
  return segment;
}

export function hasKnownRoute(hash: string): boolean {
  const segment = firstSegment(hash);
  return ROUTES.some((route) => route === segment);
}

export function parseRoute(hash: string): Route {
  const segment = firstSegment(hash);
  return ROUTES.find((route) => route === segment) ?? DEFAULT_ROUTE;
}

export function routeName(id: Route): string {
  return ROUTE_NAMES[id];
}

export function toHash(route: Route): string {
  return `#/${route}`;
}

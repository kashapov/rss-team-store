import { countCartItems } from './core/cartCount';
import { routeName } from './core/route';
import { restoreCart } from './state/cartRestore';
import { saveCart } from './state/cartStorage';
import { getCart, subscribe } from './state/cartStore';
import './style.css';
import type { CartItem } from './types/cart';
import { element } from './ui/dom';
import { createNav, setActiveNav, setCartCount } from './ui/nav';
import { startRouter } from './ui/router';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('#app not found');

app.className = 'app';

const nav = createNav();
const main = element('main', { className: 'screen', attrs: { tabindex: '-1' } });
app.append(nav, main);

// Восстанавливаем корзину до подписок, чтобы загрузка не перезаписывала хранилище.
restoreCart();

// Навигация создаётся один раз, поэтому счётчик корзины узнаёт об изменениях через подписку.
const updateCartCount = (items: readonly CartItem[]): void =>
  setCartCount(nav, countCartItems(items));
updateCartCount(getCart());
subscribe(updateCartCount);
subscribe(saveCart);

startRouter(main, (route) => {
  setActiveNav(nav, route);
  document.title = `${routeName(route)} — Team Store`;
});

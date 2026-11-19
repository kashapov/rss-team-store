import { routeName } from './core/route';
import './style.css';
import { element } from './ui/dom';
import { createNav, setActiveNav } from './ui/nav';
import { startRouter } from './ui/router';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('#app not found');

app.className = 'app';

const nav = createNav();
const main = element('main', { className: 'screen', attrs: { tabindex: '-1' } });
app.append(nav, main);

startRouter(main, (route) => {
  setActiveNav(nav, route);
  document.title = `${routeName(route)} — Team Store`;
});

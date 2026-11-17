# RSS Team Store

Учебный онлайн-магазин **настольных игр** — командный проект [RS School](https://rs.school/).

- **Участники:** [@kashapov](https://github.com/kashapov), [@KsArt-IT](https://github.com/KsArt-IT)
- **Репозиторий:** https://github.com/kashapov/rss-team-store
- **Доска задач:** https://github.com/users/kashapov/projects/3
- **Деплой:** GitHub Pages — ссылка появится после задачи #7

Каталог товаров, корзина с итогом, фильтры. Данные хранятся в репозитории (без бэкенда и внешнего API). Изображения товаров — без чужих обложек игр; при необходимости используются простые SVG-иконки по категориям.

## Стек

- **TypeScript**
- **Vite** (template `vanilla-ts`)
- **Vitest** — unit-тесты
- **Prettier** — форматирование

Без UI-фреймворков.

## Требования

- [Node.js](https://nodejs.org/) 22+ (рекомендуется)
- npm (поставляется с Node.js)

## Запуск

```bash
git clone https://github.com/kashapov/rss-team-store.git
cd rss-team-store
npm ci
npm run dev
```

Открой адрес, который выведет Vite (обычно `http://localhost:5173`).

## Скрипты

| Команда                | Что делает                                                            |
| ---------------------- | --------------------------------------------------------------------- |
| `npm run dev`          | dev-сервер Vite                                                       |
| `npm run build`        | проверка TypeScript + production-сборка в `dist/`                     |
| `npm run preview`      | локальный просмотр сборки                                             |
| `npm test`             | Vitest (`src/**/*.test.ts`); пустой набор тестов не считается ошибкой |
| `npm run format`       | Prettier — записать форматирование                                    |
| `npm run format:check` | Prettier — только проверка                                            |

## Git и Pull Request

Правила работы с репозиторием:

- Ветки от актуального `main`: `feat/…`, `fix/…`, `chore/…`, `docs/…`
- Одна задача = одна ветка = один Pull Request
- Коммиты — [Conventional Commits](https://www.conventionalcommits.org/) на английском: `feat:`, `fix:`, `chore:`, `test:`, `docs:`
- В описании PR: что сделано, как проверить, `Closes #N`
- Ревью: ориентир до 24 часов; автор отвечает на каждое замечание (исправил или объяснил, почему нет)
- В `main` — только через PR после **1 approve**; мержит **автор** PR
- Способ слияния: **merge commit** (не squash / не rebase), чтобы история коммитов сохранилась
- После merge ветку удаляем
- Прямой push в `main` запрещён (branch protection)

Пример начала работы над задачей:

```bash
git switch main
git pull origin main
git switch -c feat/short-name
# …изменения…
git add .
git commit -m "feat: short description"
git push -u origin feat/short-name
```

Затем на GitHub — Pull Request в `main`.

Обсуждение правил: [Issue #14](https://github.com/kashapov/rss-team-store/issues/14).

## Тесты

- Файлы тестов: `src/**/*.test.ts` рядом с кодом (например `cart.ts` и `cart.test.ts`)
- Запуск: `npm test`

## Деплой

Публикация на **GitHub Pages** (задача #7). После появления сайта ссылка будет в списке в начале README.

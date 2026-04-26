# WebSRSP4

Интерактивный комплект для СРСП №4 по теме: современные front-end фреймворки и Vue.js.

## Что внутри

- `index.html` и `src/` — рабочее Vue-демо для публикации на GitHub Pages.
- `docs/kahoot-quest.md` — готовый сюжет квеста на 15 вопросов.
- `docs/question-bank.csv` — вопросный банк в табличном формате.
- `docs/submission-guide.md` — как оформить сдачу.
- `docs/presentation-outline.md` — структура выступления.
- `docs/narrative_plan.md` — логика подачи проекта.

## Идея проекта

Сюжет строится вокруг маршрута Vue-разработчика:

1. Установка зависимостей.
2. Создание компонента.
3. Работа с `data`, `methods`, `ref`, `reactive`.
4. Передача `props`.

Демо показывает:

- компонентную структуру;
- реактивное обновление интерфейса;
- вычисляемые значения;
- передачу данных в дочерние компоненты.

## Как открыть локально

Проект рассчитан на GitHub Pages и использует Vue SFC loader, поэтому его нужно открывать через локальный сервер.

Пример через Python:

```powershell
cd G:\Working\Codex\New2\WebSRSP4
C:\Users\1dias\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m http.server 4173
```

После этого откройте: `http://localhost:4173/`

## Актуальные источники

- [Vue Tooling Guide](https://vuejs.org/guide/scaling-up/tooling)
- [Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Lifecycle Hooks](https://vuejs.org/guide/essentials/lifecycle.html)
- [Props](https://vuejs.org/guide/components/props.html)

## Для сдачи

Желательно приложить:

1. ссылку на GitHub Pages;
2. ссылку на репозиторий;
3. ссылку на Kahoot-квест;
4. презентацию;
5. краткое описание того, что именно демонстрирует проект.

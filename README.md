# 📰 News 43 RUS

> Одностраничное приложение (SPA) для просмотра новостей России на Angular 17+

---

## Возможности

- Список новостей с фильтрацией и поиском
- Поиск с debounce (350мс) и `distinctUntilChanged`
- Фильтры по категории и сортировке
- Система избранного (LocalStorage)
- Детальная страница новости
- Форма создания и редактирования новостей
- Dark / Light тема с сохранением
- Адаптивный дизайн (от 375px до desktop)

---

## Технологический стек

- **Angular 17+** — Standalone Components
- **TypeScript** — строгая типизация
- **Reactive Forms** — управление формами
- **HttpClient** — работа с API
- **Router** с `RouterLinkActive`
- **Signals** — современное управление состоянием
- **LocalStorage** — сохранение данных на клиенте

---

## Структура проекта

```
src/
├── app/
│   ├── core/
│   │   ├── models/           # Article, NewsFilters
│   │   ├── services/         # NewsService, ThemeService
│   │   ├── guards/           # canDeactivateGuard
│   │   └── interceptors/     # (для будущих расширений)
│   ├── features/
│   │   ├── news-list/        # Список новостей
│   │   ├── news-detail/      # Детальная страница
│   │   ├── news-form/        # Создание/редактирование
│   │   └── favorites/        # Страница избранного
│   ├── shared/
│   │   ├── ui-components/    # Header, переиспользуемые компоненты
│   │   ├── pipes/            # timeAgo, truncate
│   │   └── directives/       # (для будущих расширений)
│   ├── app.ts                # Root component
│   ├── app.routes.ts         # Маршруты
│   └── app.config.ts         # Конфигурация приложения
├── environments/
│   ├── environment.ts        # Development
│   └── environment.prod.ts   # Production
├── styles.css                # Глобальные стили + CSS Variables
└── index.html
```

---

## Маршруты

| Маршрут | Компонент | Описание |
|---|---|---|
| `/` | — | Редирект на `/news` |
| `/news` | `NewsListComponent` | Список новостей |
| `/news/new` | `NewsFormComponent` | Создание новости |
| `/news/:id` | `NewsDetailComponent` | Детальная страница |
| `/news/:id/edit` | `NewsFormComponent` | Редактирование новости |
| `/favorites` | `FavoritesComponent` | Избранные новости |
| `**` | — | 404 → `/news` |

---

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm start

# Или
ng serve


Приложение будет доступно по адресу: **http://localhost:4200/**

---

## Валидация форм

Используется **Reactive Forms** со следующими валидаторами:

- `required` — обязательное поле
- `minlength` / `maxlength` — ограничения по длине
- `pattern` — проверка формата URL
- `CustomValidators.urlValidator()` — кастомный валидатор для URL

---

## Темы оформления

- Переключение между светлой и тёмной темой через кнопку в Header
- Выбор сохраняется в **LocalStorage**
- Цвета задаются через **CSS Variables** для удобного переключения

---

## Хранилище данных

| Хранилище | Что хранится |
|---|---|
| **LocalStorage** | Избранные статьи, выбранная тема |
| **NewsAPI.org** | Источник новостей (внешний API) |

---

## Конфигурация API

API-ключ хранится в `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  newsApiKey: '84c1d8a51a264984a3e557818d25e86a',
  newsApiBaseUrl: 'https://newsapi.org/v2'
};
```

---

## Автор

**Якимов Максим Николаевич**

# News 43 RUS

Одностраничное приложение (SPA) для просмотра новостей России на Angular 17+.

## Основные возможности

**Технологический стек:**
- Angular 17+ (Standalone Components)
- TypeScript (строгая типизация)
- Reactive Forms
- HttpClient
- Router с RouterLinkActive
- Signals (современный способ управления состоянием)
- LocalStorage для сохранения данных

**Функциональность:**
- Список новостей с фильтрацией и поиском
- Поиск с debounce (350мс) и distinctUntilChanged
- Фильтры: Категория + Сортировка
- Система избранного (LocalStorage)
- Детальная страница новости
- Форма создания/редактирования новостей
- Dark/Light тема с сохранением
- Адаптивный дизайн (375px - desktop)

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
└── index.html                # HTML страница
```

## Маршруты

| Маршрут | Компонент | Описание |
|---------|-----------|---------|
| `/` | - | Редирект на `/news` |
| `/news` | NewsListComponent | Список новостей |
| `/news/new` | NewsFormComponent | Создание новости |
| `/news/:id` | NewsDetailComponent | Детальная страница |
| `/news/:id/edit` | NewsFormComponent | Редактирование новости |
| `/favorites` | FavoritesComponent | Избранные новости |
| `**` | - | 404 → `/news` |

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm start

# Сборка для production
npm run build

# Запуск тестов (если добавляются)
npm test
```

Приложение будет доступно по адресу: **http://localhost:4200/**

## 📝 Валидация форм

Используется Reactive Forms с валидаторами:
- `required` — обязательное поле
- `minlength / maxlength` — ограничения по длине
- `pattern` — проверка URL
- `CustomValidators.urlValidator()` — кастомный валидатор для URL

## Темы оформления

Приложение поддерживает светлую и тёмную темы:
- Переключение через кнопку в Header
- Сохранение выбора в LocalStorage
- Использование CSS Variables для простого изменения цветов

## Хранилище данных

- **LocalStorage:** избранные статьи, выбранная тема
- **NewsAPI.org:** источник новостей (API ключ в environment.ts)

## API конфигурация

API ключ хранится в `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  newsApiKey: '84c1d8a51a264984a3e557818d25e86a',
  newsApiBaseUrl: 'https://newsapi.org/v2'
};
```

**Автор работы - Якимов Максим Николаевич**

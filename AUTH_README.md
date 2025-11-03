# Простая регистрация и вход (локально, без сервера)

Добавлено:
- `src/context/AuthContext.tsx` — хранит сессию и пользователей (localStorage + SHA‑256).
- `src/components/AuthBubble.tsx` — плавающая кнопка‑«шарик» в правом нижнем углу (как меню языков).
- `src/pages/Profile.tsx` — пример страницы профиля.
- Обновлён `src/App.tsx` — обёртка `<AuthProvider/>`, маршрут `/profile`, вставлен `<AuthBubble/>`.

## Как это работает
- Регистрация и вход происходят целиком в браузере (для демо). Пароль хэшируется (SHA‑256) и вместе с email сохраняется в `localStorage`.
- Сессия хранится в `localStorage` (ключ `iz_session_v1`).
- Для продакшна лучше подключить настоящий сервер (например, ваш `server/server.js`) и заменить логику в `AuthContext` на обращение к API.

## Запуск
```bash
npm i
npm run dev
```

## Интеграция с сервером (опционально)
Если захотите API:
1. В `server/server.js` добавьте эндпоинты `/auth/register` и `/auth/login` с хранением пользователей в базе (или JSON).
2. В `AuthContext.tsx` замените функции `register` и `login` на fetch к серверу.

# Devity Frontend

Клиентская часть платформы Devity (Vue 3, Vite, Pinia). Работает с REST API и real-time (Laravel Reverb / Echo).

## Документация по окружению

- **[ENVIRONMENT.md](ENVIRONMENT.md)** — переменные `VITE_*`, связка с API и Reverb.
- Полная инструкция (Docker backend, порты, типовые ошибки): репозиторий **Devity-backend**, файл `ENVIRONMENT.md`.

## Требования

- Node.js 20+ (или версия из `.nvmrc`, если появится)
- npm

## Настройка `.env`

```bash
cp .env.example .env
```

Проверьте `VITE_APP_BACKEND` (URL API с суффиксом `/api`) и `VITE_WS_*` для WebSocket — они должны соответствовать запущенному backend и Reverb. Подробности в [ENVIRONMENT.md](ENVIRONMENT.md).

## Установка и запуск

```bash
npm install
npm run dev
```

Сборка для продакшена:

```bash
npm run build
```

## Docker

```bash
cp .env.example .env
# отредактируйте .env при необходимости
docker compose build
docker compose up -d
```

Фронт будет доступен на порту **3000** (см. `docker-compose.yml`).

## IDE

Рекомендуется [VS Code](https://code.visualstudio.com/) + [Vue (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar).

## Конфигурация Vite

См. [документацию Vite](https://vite.dev/config/).

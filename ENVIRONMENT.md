# Настройка окружения Devity (backend + frontend)

Краткая инструкция по `.env` для фронтенда и связке с API. **Полная версия** (Docker, Reverb, Sanctum, типовые ошибки) — в репозитории бэкенда: [Devity-backend/ENVIRONMENT.md](../Devity-backend/ENVIRONMENT.md) (если оба проекта лежат рядом в одной папке).

## Файл `.env` на фронте

```bash
cp .env.example .env
```

Обязательно проверьте:

| Переменная | Пример (Docker backend) |
|------------|-------------------------|
| `VITE_APP_BACKEND` | `http://localhost:8080/api` |
| `VITE_WS_HOST` | `127.0.0.1` (не `localhost`, чтобы избежать лишних сюрпризов с IPv6) |
| `VITE_WS_PORT` | `8081` — как внешний порт Reverb в `Devity-backend/docker-compose.yml` |
| `VITE_WS_APP_KEY` | Должен совпадать с `REVERB_APP_KEY` в `.env` бэкенда |

После любого изменения `.env` перезапустите `npm run dev` или пересоберите Docker-образ фронта.

## Docker

В корне фронта `docker-compose.yml` передаёт в build аргументы `VITE_*` из `.env`. Убедитесь, что значения совпадают с реально доступным API и Reverb.

## Дальше

- Развёртывание API, миграции, сиды, Reverb — см. **Devity-backend/README.md** и **Devity-backend/ENVIRONMENT.md**.

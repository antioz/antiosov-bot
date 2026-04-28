# БОТ АНТИОСОВА

Демо-бот для Max (VK) + Mini App. Показывает возможности мессенджер-ботов.

## Что умеет бот

- 🤖 **Поддержка** — AI-диалог с выбором тона (GigaChat)
- 📦 **Статус заказа** — фиктивные заказы по номеру
- 🧀 **Наш колбасный сыр** — FAQ + AI-fallback для каверзных вопросов
- 🎲 **Случайный смайл** — рандомный эмодзи
- 👤 **О создателе** — Mini App с портфолио

## Структура

```
backend/    Node.js, Max Bot API + GigaChat → Railway/Render
miniapp/    Статика → GitHub Pages
```

## Запуск бэкенда

```bash
cd backend
cp .env.example .env
# Заполни .env своими токенами
npm install
npm start
```

## Переменные окружения

| Переменная | Описание |
|---|---|
| `MAX_BOT_TOKEN` | Токен бота Max (создаётся в настройках Max) |
| `GROQ_API_KEY` | API ключ с console.groq.com (бесплатно, без карты) |
| `PORT` | Порт сервера (по умолчанию 3000) |
| `MINIAPP_URL` | URL задеплоенного Mini App |

## ⚠️ Как получить токен Max-бота

Токен Max может получить только владелец бота:

1. Открой Max → Настройки → Создать бота
2. Получи токен
3. Вставь в `MAX_BOT_TOKEN` в Railway/Render → Environment Variables

**При разработке на заказ:** клиент вставляет токен в хостинг сам — разработчик к токену не прикасается.

## Деплой

**Backend:** Railway или Render (Node.js). После деплоя зарегистрируй webhook:
```bash
curl -X POST "https://platform-api.max.ru/subscriptions" \
  -H "Authorization: YOUR_BOT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-server.railway.app/webhook", "update_types": ["message_created", "bot_started", "message_callback"]}'
```

**Mini App:** GitHub Pages → Settings → Pages → Source: `/miniapp`
URL будет: `https://antioz.github.io/antiosov-bot/`

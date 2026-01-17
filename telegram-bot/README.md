# Telegram Bot для раннего доступа — Нейроставки

Микросервис для сбора заявок на ранний доступ через Telegram.

## Быстрый старт

### 1. Установка зависимостей

```bash
cd telegram-bot
pip install -r requirements.txt
```

### 2. Настройка переменных окружения

Создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

Заполните:
- `BOT_TOKEN` — токен бота от @BotFather
- `DATABASE_URL` — URL подключения к PostgreSQL

### 3. Запуск

```bash
python -m bot.main
```

## Деплой на Railway

1. Создайте новый проект на Railway
2. Добавьте PostgreSQL addon
3. Подключите GitHub репозиторий (папка `telegram-bot`)
4. Добавьте переменные окружения:
   - `BOT_TOKEN`
   - `DATABASE_URL` (Railway автоматически добавит)

## Структура

```
telegram-bot/
├── bot/
│   ├── main.py           # Точка входа
│   ├── config.py         # Конфигурация
│   ├── handlers/
│   │   └── start.py      # Обработчик /start
│   ├── keyboards/
│   │   └── preferences.py # Inline-клавиатуры
│   └── database/
│       ├── __init__.py   # SQLAlchemy setup
│       └── models.py     # Модель TelegramSubscriber
├── requirements.txt
├── Dockerfile
└── .env.example
```

## Ссылка на бот

[@neirostavki_bot](https://t.me/neirostavki_bot)

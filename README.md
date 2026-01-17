# НейроСтавки

Лендинг для AI-сервиса прогнозов на спорт.

## Быстрый старт

### 1. Установка зависимостей
```bash
cd neurostavki
npm install
```

### 2. Настройка базы данных

Проект использует **PostgreSQL**. Для локальной разработки можно использовать Docker:

```bash
# Запуск PostgreSQL в Docker
docker run --name neurostavki-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=neurostavki -p 5432:5432 -d postgres:15

# Обновите .env
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/neurostavki"
```

```bash
# Генерация Prisma client
npm run db:generate

# Создание таблиц
npm run db:push

# Заполнение начальными данными
npm run db:seed
```

### 3. Запуск
```bash
npm run dev
```

Откройте:
- **Лендинг**: http://localhost:3000
- **Админка**: http://localhost:3000/admin

## Учётные данные админа
- **Email**: admin@neurostavki.ru
- **Пароль**: admin123

## Telegram Bot

Телеграм-бот для сбора заявок на ранний доступ находится в папке `telegram-bot/`.

- **Бот**: [@neirostavki_bot](https://t.me/neirostavki_bot)
- **Документация**: [telegram-bot/README.md](./telegram-bot/README.md)

## Структура проекта
```
neurostavki/
├── app/                  # Next.js App Router
│   ├── page.tsx          # Главная страница (лендинг)
│   ├── admin/            # Админ-панель
│   │   └── subscribers/  # Статистика Telegram-подписчиков
│   └── api/              # API Routes
├── components/           # React компоненты
├── lib/                  # Утилиты
├── prisma/               # Схема БД и seed
├── telegram-bot/         # Telegram-бот (Python)
└── public/               # Статические файлы
```

## API Endpoints

| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/leads` | Создание заявки |
| GET | `/api/content?section=hero` | Получение контента |
| POST | `/api/auth/login` | Авторизация |
| GET | `/api/admin/leads` | Список заявок (auth) |
| GET/PUT | `/api/admin/content` | Управление контентом (auth) |
| GET | `/api/admin/subscribers` | Статистика Telegram-подписчиков (auth) |

## Технологии
- Next.js 14 (App Router)
- TypeScript
- Prisma + PostgreSQL
- CSS Modules
- Framer Motion
- JWT авторизация
- aiogram 3.x (Telegram Bot)


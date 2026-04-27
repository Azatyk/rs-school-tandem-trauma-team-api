# Niro

Niro - веб-приложение для подготовки к техническим интервью по frontend-разработке. Платформа предоставляет теоретические вопросы с AI-оценкой ответов, систему подсказок, задачи на написание кода, отслеживание прогресса и таблицу лидеров.

## Основные фичи

- **Теоретические вопросы** — вопросы по TypeScript, JavaScript, DOM, алгоритмам и другим frontend-темам
- **AI-оценка ответов** - искусственный интеллект оценивает ответы по шкале 0-10 и предоставляет структурированную обратную связь по критериям: корректность, полнота, ясность, примеры и глубина
- **Система подсказок** - 3 уровня подсказок для каждого вопроса: направляющий вопрос, частичное направление и развёрнутая подсказка
- **Задачи на код** - практические задачи с тест-кейсами и AI-объяснением ошибок
- **Система XP и стриков** - начисление очков за выполненные задания, отслеживание ежедневной активности
- **Таблица лидеров** - рейтинг пользователей по набранным XP
- **Матрица прогресса** - детальная статистика по темам и уровням сложности

## 📹 Видео презентация приложения

Ссылка на видео: 

## 🚀 Деплой

- **Backend:** https://rs-school-tandem-trauma-team-api.onrender.com
- **Frontend:** https://rs-school-tandem-trauma-team-fronte.vercel.app

## 📚 Документация API

Swagger: https://rs-school-tandem-trauma-team-api.onrender.com/api/docs

## 🛠 Технологии

### Backend
- **Runtime:** Node.js 22
- **Framework:** NestJS
- **Database:** PostgreSQL + TypeORM
- **AI:** Groq SDK
- **Storage:** Cloudinary
- **Deploy:** Render (Docker)

### Frontend
- **Framework:** React + TypeScript
- **Deploy:** Vercel

## 👨‍💻 Команда

| Роль | Участник |
|------|----------|
| Backend Developer | [Meir](https://github.com/Anuarbekov) |
| Backend Developer | [Batyrkhan](https://github.com/Batyrkhan-Sk) |
| Frontend Developer | [Alex](https://github.com/devenrgy) |

## 🎓 Ментор

| [Азат]([https://github.com/username](https://github.com/Azatyk)) |

## 🏆 Лучшие PR

1. [Feat/auth](https://github.com/Azatyk/rs-school-tandem-trauma-team-api/pull/4) - Реализована система аутентификации: регистрация и вход пользователей, JWT-токены, защита маршрутов через guard.
2. [feat: add frontend question bank, difficulty filtering, and topic summaries](https://github.com/Azatyk/rs-school-tandem-trauma-team-api/pull/19) - Добавлен банк вопросов по frontend-темам с фильтрацией по сложности, AI-генерацией вопросов и кратким описанием каждого топика.
3. [Feat/user answers](https://github.com/Azatyk/rs-school-tandem-trauma-team-api/pull/7) - Реализован модуль ответов пользователей с AI-оценкой, структурированной обратной связью по критериям и системой streak

## 🗂 Доска задач

Ссылка: [Asana](https://app.asana.com/1/1205378151870243/project/1213558284510777/list/1213558315453510)

Состояние на утро 28.04:

<img width="1919" height="1040" alt="image" src="https://github.com/user-attachments/assets/f1be0e01-1d8b-4d51-8783-5b94b8988b56" />

## 📔 Дневники разработчиков

- [Batyrkhan](https://github.com/Azatyk/rs-school-tandem-trauma-team-api/tree/main/development-notes/Batyrkhan-Sk)
- [Meir](https://github.com/Azatyk/rs-school-tandem-trauma-team-api/tree/main/development-notes/Anuarbekov)
- [Alex](https://github.com/Azatyk/rs-school-tandem-trauma-team-api/tree/main/development-notes/devenrgy)

## 🏫 Организация
The Rolling Scopes (@rollingscopes) - https://github.com/rollingscopes

## 📝 Локальный запуск

### Требования
- Node.js 22+
- PostgreSQL
- npm

### Установка

1. Клонировать репозиторий:
```bash
git clone https://github.com/your-repo.git
cd tandem-trauma-api
```

2. Установить зависимости:
```bash
npm install
```

3. Создать файл `.env` на основе `.env.example`:
```bash
cp .env.example .env
```

4. Заполнить переменные окружения:

| Переменная | Описание | Пример |
|------------|----------|--------|
| DB_HOST | Хост базы данных | localhost |
| DB_PORT | Порт базы данных | 5432 |
| DB_USERNAME | Имя пользователя БД | postgres |
| DB_PASSWORD | Пароль БД | your_password |
| DB_NAME | Название базы данных | tandem_trauma |
| DB_SSL | SSL для БД | false |
| SECRET_KEY | Секрет для JWT токенов | your_jwt_secret |
| GROQ_API_KEY | API ключ Groq | your_groq_key |
| CLOUDINARY_CLOUD_NAME | Название облака Cloudinary | your_cloud_name |
| CLOUDINARY_API_KEY | API ключ Cloudinary | your_api_key |
| CLOUDINARY_API_SECRET | Secret key Cloudinary | your_api_secret |
| CORS_ORIGIN | URL фронтенда | http://localhost:3000 |

5. Запустить миграции:
```bash
npm run migration:run
```

6. Запустить приложение:
```bash

npm run start:dev
```

7. Открыть Swagger: http://localhost:3000/api/docs

📹 Демонстрация обработки состояний (404, loading, error state)

В видео показано следующее:

- **404 Page** - при переходе по несуществующему маршруту отображается кастомная страница с возможностью вернуться назад.
- **Loading State** - во время загрузки данных (API-запросы, навигация между страницами) отображается индикатор загрузки (spinner).
- **API Error Handling** - при ошибках сети или сервера выводится информативное сообщение для пользователя.

**Ссылка на видео:**  

[link](https://drive.google.com/file/d/1KOIG-N0Y_bIteQkq2SGAkuDBcxnLxXdz/view?usp=sharing)

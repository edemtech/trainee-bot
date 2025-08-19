# 🧹 Очистка проекта

Удалите следующие старые файлы и папки:

## Файлы для удаления:
- `demo.js`
- `index.js` 
- `test.js`
- `SETUP.md`
- `QUICKSTART.md`

## Папки в src/ для удаления:
- `src/data/`
- `src/database/`
- `src/handlers/`
- `src/utils.js`

## Итоговая структура должна быть:

```
trainee-bot/
├── app.js                   # 🎯 Главный файл
├── src/
│   ├── config/
│   │   └── index.js        # ⚙️ Конфигурация
│   ├── models/
│   │   ├── User.js         # 👤 Модель пользователя
│   │   └── Workout.js      # 🏋️ Модель тренировки
│   ├── services/
│   │   └── WorkoutService.js # 🧠 Бизнес-логика
│   └── controllers/
│       ├── CommandController.js  # 📝 Команды
│       └── CallbackController.js # 🔘 Кнопки
├── package.json
├── .env
├── .env.example
├── .gitignore
└── README.md
```

Запуск: `BOT_TOKEN=your_token npm start`

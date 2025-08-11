const { exercises, goals, fitnessLevels } = require('../data/exercises');

async function handleStart(bot, msg, db) {
    const chatId = msg.chat.id;
    const user = msg.from;

    try {
        // Создаем или обновляем пользователя в БД
        await db.createOrUpdateUser({
            telegram_id: user.id,
            username: user.username,
            first_name: user.first_name
        });

        // Проверяем, заполнен ли профиль пользователя
        const existingUser = await db.getUser(user.id);
        
        if (!existingUser || !existingUser.age || !existingUser.gender || !existingUser.fitness_level || !existingUser.goals) {
            // Если профиль не заполнен, начинаем сбор информации
            await bot.sendMessage(chatId, 
                `Привет, ${user.first_name}! 👋\n\n` +
                `Я твой персональный фитнес-бот! 💪\n\n` +
                `Для создания персональных тренировок мне нужно узнать о тебе больше.\n` +
                `Давай заполним твой профиль!`,
                {
                    reply_markup: {
                        inline_keyboard: [[
                            { text: "📝 Заполнить профиль", callback_data: "setup_profile" }
                        ]]
                    }
                }
            );
        } else {
            // Если профиль заполнен, показываем главное меню
            await showMainMenu(bot, chatId, user.first_name);
        }
    } catch (error) {
        console.error('Ошибка в handleStart:', error);
        await bot.sendMessage(chatId, 'Произошла ошибка. Попробуйте позже.');
    }
}

async function handleHelp(bot, msg) {
    const chatId = msg.chat.id;
    
    const helpText = `
🤖 *Помощь по использованию бота*

*Основные команды:*
/start - Начать работу с ботом
/help - Показать эту справку

*Возможности бота:*
• 🏋️ Подбор упражнений по группам мышц
• 🎯 Персонализация под ваши цели
• 💾 Сохранение любимых тренировок
• 📊 Учет уровня подготовки

*Группы мышц:*
• Грудь 💪
• Спина 🦵
• Ноги 🦵
• Плечи 🔺
• Руки 💪
• Пресс 🟡

*Цели тренировок:*
• Набор массы
• Сжигание жира
• Поддержка формы

Используйте кнопки меню для навигации!
    `;
    
    await bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
}

async function showMainMenu(bot, chatId, firstName) {
    const keyboard = {
        inline_keyboard: [
            [
                { text: "💪 Грудь", callback_data: "muscle_chest" },
                { text: "🦵 Спина", callback_data: "muscle_back" }
            ],
            [
                { text: "🦵 Ноги", callback_data: "muscle_legs" },
                { text: "🔺 Плечи", callback_data: "muscle_shoulders" }
            ],
            [
                { text: "💪 Руки", callback_data: "muscle_arms" },
                { text: "🟡 Пресс", callback_data: "muscle_abs" }
            ],
            [
                { text: "💾 Мои тренировки", callback_data: "my_workouts" },
                { text: "⚙️ Профиль", callback_data: "profile" }
            ]
        ]
    };

    await bot.sendMessage(chatId, 
        `Привет, ${firstName}! 👋\n\n` +
        `Выбери группу мышц для тренировки:`,
        { reply_markup: keyboard }
    );
}

module.exports = {
    handleStart,
    handleHelp,
    showMainMenu
};

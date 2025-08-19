// Контроллер callback'ов
class CallbackController {
    constructor(userModel, workoutModel, workoutService) {
        this.userModel = userModel;
        this.workoutModel = workoutModel;
        this.workoutService = workoutService;
        this.sessions = new Map(); // Временные данные пользователей
    }

    async handle(bot, query) {
        const { data, from: { id: userId }, message: { chat: { id: chatId } } } = query;
        
        await bot.answerCallbackQuery(query.id);

        if (data === 'setup_profile') return this.startProfileSetup(bot, chatId, userId);
        if (data.startsWith('age_')) return this.handleAge(bot, chatId, userId, data);
        if (data.startsWith('gender_')) return this.handleGender(bot, chatId, userId, data);
        if (data.startsWith('level_')) return this.handleLevel(bot, chatId, userId, data);
        if (data.startsWith('goal_')) return this.handleGoal(bot, chatId, userId, data);
        if (data.startsWith('muscle_')) return this.handleMuscle(bot, chatId, userId, data);
        if (data.startsWith('workout_')) return this.generateWorkout(bot, chatId, userId, data);
        if (data.startsWith('save_')) return this.saveWorkout(bot, chatId, userId, data);
        if (data === 'saved') return this.showSaved(bot, chatId, userId);
    }

    startProfileSetup(bot, chatId, userId) {
        const keyboard = {
            inline_keyboard: [
                [{ text: "16-25", callback_data: "age_16-25" }, { text: "26-35", callback_data: "age_26-35" }],
                [{ text: "36-45", callback_data: "age_36-45" }, { text: "46+", callback_data: "age_46+" }]
            ]
        };
        return bot.sendMessage(chatId, "Ваш возраст:", { reply_markup: keyboard });
    }

    handleAge(bot, chatId, userId, data) {
        const age = data.replace('age_', '');
        this.getSession(userId).age = age;
        
        const keyboard = {
            inline_keyboard: [[
                { text: "👨 М", callback_data: "gender_male" },
                { text: "👩 Ж", callback_data: "gender_female" }
            ]]
        };
        return bot.sendMessage(chatId, "Пол:", { reply_markup: keyboard });
    }

    handleGender(bot, chatId, userId, data) {
        const gender = data.replace('gender_', '');
        this.getSession(userId).gender = gender;
        
        const keyboard = {
            inline_keyboard: [
                [{ text: "🆕 Новичок", callback_data: "level_beginner" }],
                [{ text: "📈 Средний", callback_data: "level_intermediate" }],
                [{ text: "🔥 Продвинутый", callback_data: "level_advanced" }]
            ]
        };
        return bot.sendMessage(chatId, "Уровень подготовки:", { reply_markup: keyboard });
    }

    handleLevel(bot, chatId, userId, data) {
        const level = data.replace('level_', '');
        this.getSession(userId).fitness_level = level;
        
        const keyboard = {
            inline_keyboard: [
                [{ text: "💪 Набор массы", callback_data: "goal_mass_gain" }],
                [{ text: "🔥 Сжигание жира", callback_data: "goal_fat_burn" }],
                [{ text: "⚖️ Поддержка формы", callback_data: "goal_maintenance" }]
            ]
        };
        return bot.sendMessage(chatId, "Цель:", { reply_markup: keyboard });
    }

    async handleGoal(bot, chatId, userId, data) {
        const goal = data.replace('goal_', '');
        const session = this.getSession(userId);
        session.goals = goal;
        
        await this.userModel.updateProfile(userId, session);
        this.sessions.delete(userId);
        
        await bot.sendMessage(chatId, "Профиль настроен! 🎉");
        
        // Показать главное меню
        const user = await this.userModel.findById(userId);
        return this.sendMainMenu(bot, chatId, user.first_name);
    }

    async handleMuscle(bot, chatId, userId, data) {
        const muscle = data.replace('muscle_', '');
        const keyboard = {
            inline_keyboard: [
                [{ text: "🏋️ Создать тренировку", callback_data: `workout_${muscle}` }],
                [{ text: "◀️ Назад", callback_data: "main_menu" }]
            ]
        };
        
        const muscleName = this.workoutService.exercises[muscle]?.name;
        return bot.sendMessage(chatId, `*${muscleName}* 💪`, { 
            parse_mode: 'Markdown', 
            reply_markup: keyboard 
        });
    }

    async generateWorkout(bot, chatId, userId, data) {
        const muscle = data.replace('workout_', '');
        const user = await this.userModel.findById(userId);
        const workout = this.workoutService.generate(muscle, user.goals);
        
        if (!workout) return bot.sendMessage(chatId, "Ошибка генерации тренировки");
        
        const text = this.workoutService.formatWorkout(workout);
        const keyboard = {
            inline_keyboard: [
                [{ text: "💾 Сохранить", callback_data: `save_${muscle}` }],
                [{ text: "🔄 Новая", callback_data: `workout_${muscle}` }],
                [{ text: "🏠 Меню", callback_data: "main_menu" }]
            ]
        };
        
        // Сохраняем текущую тренировку в сессию
        this.getSession(userId).currentWorkout = { muscle, workout };
        
        return bot.sendMessage(chatId, text, { 
            parse_mode: 'Markdown', 
            reply_markup: keyboard 
        });
    }

    async saveWorkout(bot, chatId, userId, data) {
        const muscle = data.replace('save_', '');
        const session = this.getSession(userId);
        const { workout } = session.currentWorkout || {};
        
        if (!workout) return bot.sendMessage(chatId, "Нет тренировки для сохранения");
        
        await this.workoutModel.save(userId, workout.name, workout);
        return bot.sendMessage(chatId, "✅ Тренировка сохранена!");
    }

    async showSaved(bot, chatId, userId) {
        const workouts = await this.workoutModel.findByUserId(userId);
        
        if (!workouts.length) {
            return bot.sendMessage(chatId, "Нет сохраненных тренировок");
        }
        
        let text = "💾 *Сохраненные тренировки:*\n\n";
        workouts.forEach((w, i) => {
            const date = new Date(w.created_at).toLocaleDateString('ru-RU');
            text += `${i+1}. ${w.name} (${date})\n`;
        });
        
        return bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
    }

    sendMainMenu(bot, chatId, name) {
        const keyboard = {
            inline_keyboard: [
                [{ text: "💪 Грудь", callback_data: "muscle_chest" }, { text: "🦵 Спина", callback_data: "muscle_back" }],
                [{ text: "🦵 Ноги", callback_data: "muscle_legs" }, { text: "🔺 Плечи", callback_data: "muscle_shoulders" }],
                [{ text: "💪 Руки", callback_data: "muscle_arms" }, { text: "🟡 Пресс", callback_data: "muscle_abs" }],
                [{ text: "💾 Сохраненные", callback_data: "saved" }]
            ]
        };
        return bot.sendMessage(chatId, `Привет, ${name}! Выберите группу мышц:`, { reply_markup: keyboard });
    }

    getSession(userId) {
        if (!this.sessions.has(userId)) {
            this.sessions.set(userId, {});
        }
        return this.sessions.get(userId);
    }
}

module.exports = CallbackController;

// Контроллер команд
class CommandController {
    constructor(userModel, workoutService) {
        this.userModel = userModel;
        this.workoutService = workoutService;
    }

    async start(bot, msg) {
        const user = msg.from;
        await this.userModel.create({
            telegram_id: user.id,
            username: user.username,
            first_name: user.first_name
        });

        const existingUser = await this.userModel.findById(user.id);
        
        if (!existingUser?.goals) {
            return this.sendProfileSetup(bot, msg.chat.id);
        }
        
        return this.sendMainMenu(bot, msg.chat.id, user.first_name);
    }

    async help(bot, msg) {
        const text = `🤖 *TraineeBot*\n\n/start - Начать\n/help - Справка\n\nВыбирайте группы мышц и получайте персональные тренировки!`;
        await bot.sendMessage(msg.chat.id, text, { parse_mode: 'Markdown' });
    }

    sendProfileSetup(bot, chatId) {
        const keyboard = {
            inline_keyboard: [[
                { text: "📝 Настроить профиль", callback_data: "setup_profile" }
            ]]
        };
        
        return bot.sendMessage(chatId, 
            "Привет! 👋 Настройте профиль для персональных тренировок.",
            { reply_markup: keyboard }
        );
    }

    sendMainMenu(bot, chatId, name) {
        const muscles = this.workoutService.getMuscles();
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
                    { text: "💾 Сохраненные", callback_data: "saved" },
                    { text: "⚙️ Профиль", callback_data: "profile" }
                ]
            ]
        };

        return bot.sendMessage(chatId, 
            `Привет, ${name}! Выберите группу мышц:`,
            { reply_markup: keyboard }
        );
    }
}

module.exports = CommandController;

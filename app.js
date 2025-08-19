// Главное приложение
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Импорты
const config = require('./src/config');
const User = require('./src/models/User');
const Workout = require('./src/models/Workout');
const WorkoutService = require('./src/services/WorkoutService');
const CommandController = require('./src/controllers/CommandController');
const CallbackController = require('./src/controllers/CallbackController');

class App {
    constructor() {
        this.bot = new TelegramBot(config.bot.token, { polling: true });
        this.initModels();
        this.initControllers();
        this.setupRoutes();
        console.log('🤖 Бот запущен');
    }

    initModels() {
        this.userModel = new User(config.db.path);
        this.workoutModel = new Workout(config.db.path);
        this.workoutService = new WorkoutService();
    }

    initControllers() {
        this.commandController = new CommandController(this.userModel, this.workoutService);
        this.callbackController = new CallbackController(this.userModel, this.workoutModel, this.workoutService);
    }

    setupRoutes() {
        // Команды
        this.bot.onText(/\/start/, (msg) => this.commandController.start(this.bot, msg));
        this.bot.onText(/\/help/, (msg) => this.commandController.help(this.bot, msg));
        
        // Callback'и
        this.bot.on('callback_query', (query) => this.callbackController.handle(this.bot, query));
        
        // Обработка ошибок
        this.bot.on('polling_error', console.error);
    }

    stop() {
        this.userModel.close();
        this.workoutModel.close();
        console.log('🛑 Бот остановлен');
    }
}

// Запуск
const app = new App();

process.on('SIGINT', () => {
    app.stop();
    process.exit(0);
});

module.exports = App;

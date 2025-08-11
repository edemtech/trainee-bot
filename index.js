require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const Database = require('./src/database/database');
const { handleStart, handleHelp } = require('./src/handlers/commands');
const { handleCallbackQuery } = require('./src/handlers/callbacks');

// Инициализация бота
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Инициализация базы данных
const db = new Database();

console.log('🤖 Бот запущен!');

// Обработка команд
bot.onText(/\/start/, (msg) => handleStart(bot, msg, db));
bot.onText(/\/help/, (msg) => handleHelp(bot, msg));

// Обработка callback запросов
bot.on('callback_query', (callbackQuery) => {
    handleCallbackQuery(bot, callbackQuery, db);
});

// Обработка ошибок
bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});

process.on('SIGINT', () => {
    console.log('Остановка бота...');
    db.close();
    process.exit(0);
});

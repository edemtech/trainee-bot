// Конфигурация приложения
module.exports = {
    bot: {
        token: process.env.BOT_TOKEN,
        polling: true
    },
    
    db: {
        path: process.env.DB_PATH || './database.sqlite'
    },
    
    app: {
        env: process.env.NODE_ENV || 'development'
    }
};

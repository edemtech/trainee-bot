// Модель пользователя
const sqlite3 = require('sqlite3').verbose();

class User {
    constructor(dbPath) {
        this.db = new sqlite3.Database(dbPath);
        this.init();
    }

    init() {
        this.db.run(`
            CREATE TABLE IF NOT EXISTS users (
                telegram_id INTEGER PRIMARY KEY,
                username TEXT,
                first_name TEXT,
                age TEXT,
                gender TEXT,
                fitness_level TEXT,
                goals TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }

    async create(userData) {
        return new Promise((resolve, reject) => {
            const { telegram_id, username, first_name } = userData;
            this.db.run(
                'INSERT OR REPLACE INTO users (telegram_id, username, first_name) VALUES (?, ?, ?)',
                [telegram_id, username, first_name],
                function(err) { err ? reject(err) : resolve(this.lastID); }
            );
        });
    }

    async findById(telegramId) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT * FROM users WHERE telegram_id = ?',
                [telegramId],
                (err, row) => err ? reject(err) : resolve(row)
            );
        });
    }

    async updateProfile(telegramId, profile) {
        return new Promise((resolve, reject) => {
            const { age, gender, fitness_level, goals } = profile;
            this.db.run(
                'UPDATE users SET age = ?, gender = ?, fitness_level = ?, goals = ? WHERE telegram_id = ?',
                [age, gender, fitness_level, goals, telegramId],
                function(err) { err ? reject(err) : resolve(this.changes); }
            );
        });
    }

    close() {
        this.db.close();
    }
}

module.exports = User;

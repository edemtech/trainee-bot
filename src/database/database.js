const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    constructor() {
        const dbPath = process.env.DB_PATH || './database.sqlite';
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Ошибка подключения к базе данных:', err);
            } else {
                console.log('Подключение к SQLite базе данных установлено');
            }
        });
        this.initialized = false;
    }

    async ensureInit() {
        if (!this.initialized) {
            await this.init();
            this.initialized = true;
        }
    }

    init() {
        return new Promise((resolve, reject) => {
            // Создание таблицы пользователей
            this.db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY,
                    telegram_id INTEGER UNIQUE,
                    username TEXT,
                    first_name TEXT,
                    age TEXT,
                    gender TEXT,
                    fitness_level TEXT,
                    goals TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                // Создание таблицы сохраненных планов
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS saved_workouts (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER,
                        workout_data TEXT,
                        workout_name TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users (telegram_id)
                    )
                `, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log('Таблицы базы данных инициализированы');
                        resolve();
                    }
                });
            });
        });
    }

    // Получить пользователя
    async getUser(telegramId) {
        await this.ensureInit();
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT * FROM users WHERE telegram_id = ?',
                [telegramId],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
    }

    // Создать или обновить пользователя
    async createOrUpdateUser(userData) {
        await this.ensureInit();
        return new Promise((resolve, reject) => {
            const { telegram_id, username, first_name } = userData;
            this.db.run(
                `INSERT OR REPLACE INTO users 
                 (telegram_id, username, first_name, updated_at) 
                 VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
                [telegram_id, username, first_name],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    // Обновить профиль пользователя
    async updateUserProfile(telegramId, profileData) {
        await this.ensureInit();
        return new Promise((resolve, reject) => {
            const { age, gender, fitness_level, goals } = profileData;
            this.db.run(
                `UPDATE users 
                 SET age = ?, gender = ?, fitness_level = ?, goals = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE telegram_id = ?`,
                [age, gender, fitness_level, goals, telegramId],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    }

    // Сохранить тренировку
    async saveWorkout(telegramId, workoutData, workoutName) {
        await this.ensureInit();
        return new Promise((resolve, reject) => {
            this.db.run(
                'INSERT INTO saved_workouts (user_id, workout_data, workout_name) VALUES (?, ?, ?)',
                [telegramId, JSON.stringify(workoutData), workoutName],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    // Получить сохраненные тренировки
    async getSavedWorkouts(telegramId) {
        await this.ensureInit();
        return new Promise((resolve, reject) => {
            this.db.all(
                'SELECT * FROM saved_workouts WHERE user_id = ? ORDER BY created_at DESC',
                [telegramId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }

    close() {
        this.db.close((err) => {
            if (err) {
                console.error('Ошибка закрытия базы данных:', err);
            } else {
                console.log('Соединение с базой данных закрыто');
            }
        });
    }
}

module.exports = Database;

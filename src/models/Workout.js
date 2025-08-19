// Модель тренировки
const sqlite3 = require('sqlite3').verbose();

class Workout {
    constructor(dbPath) {
        this.db = new sqlite3.Database(dbPath);
        this.init();
    }

    init() {
        this.db.run(`
            CREATE TABLE IF NOT EXISTS workouts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                name TEXT,
                data TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }

    async save(userId, name, data) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'INSERT INTO workouts (user_id, name, data) VALUES (?, ?, ?)',
                [userId, name, JSON.stringify(data)],
                function(err) { err ? reject(err) : resolve(this.lastID); }
            );
        });
    }

    async findByUserId(userId) {
        return new Promise((resolve, reject) => {
            this.db.all(
                'SELECT * FROM workouts WHERE user_id = ? ORDER BY created_at DESC',
                [userId],
                (err, rows) => err ? reject(err) : resolve(rows)
            );
        });
    }

    close() {
        this.db.close();
    }
}

module.exports = Workout;

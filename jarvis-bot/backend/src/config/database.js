const sqlite3 = require('sqlite3').verbose();

class Database {
    constructor() {
        this.db = null;
        this.init();
    }

    init() {
        this.db = new sqlite3.Database(':memory:', (err) => {
            if (err) {
                console.error('Erro ao conectar no banco:', err);
            } else {
                console.log('Conectado ao banco SQLite (memoria)');
                this.createTables();
            }
        });
    }

    createTables() {
        this.db.run('CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)');
        this.db.run('CREATE TABLE IF NOT EXISTS conversations (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL, user_message TEXT NOT NULL, assistant_message TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id))');
        this.db.run('CREATE TABLE IF NOT EXISTS context (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL, key TEXT NOT NULL, value TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id), UNIQUE(user_id, key))', (err) => {
            if (err) {
                console.error('Erro ao criar tabelas:', err);
            } else {
                console.log('Tabelas criadas/verificadas');
            }
        });
    }

    get(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(query, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    all(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    run(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(query, params, function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, changes: this.changes });
            });
        });
    }
}

module.exports = new Database();
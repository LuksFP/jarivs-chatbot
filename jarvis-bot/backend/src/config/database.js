const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../database.sqlite');

class Database {
    constructor() {
        this.db = null;
    }
    
    connect() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(DB_PATH, (err) => {
                if (err) {
                    console.error('Erro ao conectar ao banco:', err);
                    reject(err);
                } else {
                    console.log('✅ Conectado ao banco de dados SQLite');
                    resolve();
                }
            });
        });
    }
    
    createTables() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run('CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, last_interaction DATETIME DEFAULT CURRENT_TIMESTAMP)', (err) => {
                    if (err) console.error('Erro ao criar tabela users:', err);
                });
                
                this.db.run('CREATE TABLE IF NOT EXISTS conversations (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL, message TEXT NOT NULL, response TEXT NOT NULL, role TEXT NOT NULL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id))', (err) => {
                    if (err) console.error('Erro ao criar tabela conversations:', err);
                });
                
                this.db.run('CREATE TABLE IF NOT EXISTS user_context (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL, context_key TEXT NOT NULL, context_value TEXT, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id))', (err) => {
                    if (err) console.error('Erro ao criar tabela user_context:', err);
                });
                
                this.db.run('CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id, timestamp DESC)', (err) => {
                    if (err) console.error('Erro ao criar índice conversations:', err);
                });
                
                this.db.run('CREATE INDEX IF NOT EXISTS idx_context_user ON user_context(user_id, context_key)', (err) => {
                    if (err) {
                        console.error('Erro ao criar índice context:', err);
                        reject(err);
                    } else {
                        console.log('✅ Tabelas criadas/verificadas');
                        resolve();
                    }
                });
            });
        });
    }
    
    async initialize() {
        await this.connect();
        await this.createTables();
    }
    
    run(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(query, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, changes: this.changes });
                }
            });
        });
    }
    
    get(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(query, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
    
    all(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    
    close() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.close((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log('✅ Conexão fechada');
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }
}

const database = new Database();
module.exports = database;

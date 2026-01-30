const db = require('../config/database');

class UserModel {
    static async findOrCreate(userId) {
        try {
            let user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
            
            if (!user) {
                await db.run('INSERT INTO users (id) VALUES (?)', [userId]);
                user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
            } else {
                await db.run('UPDATE users SET last_interaction = CURRENT_TIMESTAMP WHERE id = ?', [userId]);
            }
            
            return user;
        } catch (error) {
            console.error('Erro ao buscar/criar usuário:', error);
            throw error;
        }
    }
    
    static async findById(userId) {
        try {
            return await db.get('SELECT * FROM users WHERE id = ?', [userId]);
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            throw error;
        }
    }
}

module.exports = UserModel;

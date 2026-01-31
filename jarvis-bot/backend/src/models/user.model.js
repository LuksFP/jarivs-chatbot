const db = require('../config/database');

class UserModel {
    static async findOrCreate(userId) {
        try {
            let user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
            if (!user) {
                await db.run('INSERT INTO users (id) VALUES (?)', [userId]);
                user = { id: userId };
            }
            return user;
        } catch (error) {
            console.error('Erro ao buscar/criar usuario:', error);
            return { id: userId };
        }
    }
}

module.exports = UserModel;
const db = require('../config/database');

class ContextModel {
    static async saveContext(userId, key, value) {
        try {
            const existing = await db.get(
                'SELECT * FROM context WHERE user_id = ? AND key = ?',
                [userId, key]
            );
            if (existing) {
                await db.run(
                    'UPDATE context SET value = ? WHERE user_id = ? AND key = ?',
                    [value, userId, key]
                );
            } else {
                await db.run(
                    'INSERT INTO context (user_id, key, value) VALUES (?, ?, ?)',
                    [userId, key, value]
                );
            }
            return true;
        } catch (error) {
            console.error('Erro ao salvar contexto:', error);
            return false;
        }
    }

    static async getAllContext(userId) {
        try {
            const contexts = await db.all(
                'SELECT key, value FROM context WHERE user_id = ?',
                [userId]
            );
            const contextObj = {};
            contexts.forEach(item => {
                contextObj[item.key] = item.value;
            });
            return contextObj;
        } catch (error) {
            console.error('Erro ao buscar contexto:', error);
            return {};
        }
    }
}

module.exports = ContextModel;
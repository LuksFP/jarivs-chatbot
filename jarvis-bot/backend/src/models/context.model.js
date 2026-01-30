const db = require('../config/database');

class ContextModel {
    static async saveContext(userId, key, value) {
        try {
            const existing = await db.get(
                'SELECT * FROM user_context WHERE user_id = ? AND context_key = ?',
                [userId, key]
            );
            
            if (existing) {
                await db.run(
                    'UPDATE user_context SET context_value = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND context_key = ?',
                    [value, userId, key]
                );
            } else {
                await db.run(
                    'INSERT INTO user_context (user_id, context_key, context_value) VALUES (?, ?, ?)',
                    [userId, key, value]
                );
            }
            return true;
        } catch (error) {
            console.error('Erro ao salvar contexto:', error);
            throw error;
        }
    }
    
    static async getAllContext(userId) {
        try {
            const contexts = await db.all(
                'SELECT context_key, context_value FROM user_context WHERE user_id = ?',
                [userId]
            );
            const contextObj = {};
            contexts.forEach(item => {
                contextObj[item.context_key] = item.context_value;
            });
            return contextObj;
        } catch (error) {
            console.error('Erro ao buscar contexto:', error);
            throw error;
        }
    }
}

module.exports = ContextModel;

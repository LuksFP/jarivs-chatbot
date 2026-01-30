const db = require('../config/database');

class ConversationModel {
    static async saveMessage(userId, message, response, role = 'user') {
        try {
            const result = await db.run(
                'INSERT INTO conversations (user_id, message, response, role) VALUES (?, ?, ?, ?)',
                [userId, message, response, role]
            );
            return result.id;
        } catch (error) {
            console.error('Erro ao salvar mensagem:', error);
            throw error;
        }
    }
    
    static async getHistory(userId, limit = 10) {
        try {
            const history = await db.all(
                'SELECT message, response, role, timestamp FROM conversations WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?',
                [userId, limit]
            );
            return history.reverse();
        } catch (error) {
            console.error('Erro ao buscar histórico:', error);
            throw error;
        }
    }
    
    static formatHistoryForAI(history) {
        const messages = [];
        history.forEach(item => {
            messages.push({ role: 'user', content: item.message });
            messages.push({ role: 'assistant', content: item.response });
        });
        return messages;
    }
}

module.exports = ConversationModel;

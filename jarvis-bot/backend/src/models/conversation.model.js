const db = require('../config/database');

class ConversationModel {
    static async saveMessage(userId, message, response) {
        try {
            const result = await db.run(
                'INSERT INTO conversations (user_id, user_message, assistant_message) VALUES (?, ?, ?)',
                [userId, message, response]
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
                'SELECT user_message, assistant_message FROM conversations WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
                [userId, limit]
            );
            return history.reverse();
        } catch (error) {
            console.error('Erro ao buscar historico:', error);
            return [];
        }
    }

    static formatHistoryForAI(history) {
        const messages = [];
        history.forEach(item => {
            messages.push({ role: 'user', content: item.user_message });
            messages.push({ role: 'assistant', content: item.assistant_message });
        });
        return messages;
    }
}

module.exports = ConversationModel;
const conversationService = require('../services/conversation.service');

class ChatController {
    async sendMessage(req, res) {
        try {
            const { message, userId, useVoice = false } = req.body;
            
            if (!message || !message.trim()) {
                return res.status(400).json({ error: 'Mensagem não pode estar vazia' });
            }
            
            if (!userId) {
                return res.status(400).json({ error: 'userId é obrigatório' });
            }
            
            const result = await conversationService.processMessage(userId, message.trim(), useVoice);
            
            res.json({
                success: true,
                response: result.response,
                audioUrl: result.audioUrl,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Erro no controller de chat:', error);
            res.status(500).json({ error: 'Erro ao processar mensagem', details: error.message });
        }
    }
}

module.exports = new ChatController();

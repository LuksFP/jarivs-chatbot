const ConversationModel = require('../models/conversation.model');
const ContextModel = require('../models/context.model');
const UserModel = require('../models/user.model');
const groqService = require('./groq.service');
const elevenLabsService = require('./elevenlabs.service');
const { CONVERSATION_CONFIG } = require('../config/ai-config');

class ConversationService {
    async processMessage(userId, message, useVoice = false) {
        try {
            await UserModel.findOrCreate(userId);
            
            const history = await ConversationModel.getHistory(userId, CONVERSATION_CONFIG.maxHistoryMessages);
            const userContext = await ContextModel.getAllContext(userId);
            const messages = ConversationModel.formatHistoryForAI(history);
            messages.push({ role: 'user', content: message });
            
            console.log('🤖 Gerando resposta com Groq...');
            const { response, usage } = await groqService.generateResponse(messages, userContext);
            
            await ConversationModel.saveMessage(userId, message, response);
            
            let audioData = null;
            if (useVoice && elevenLabsService.isConfigured()) {
                try {
                    audioData = await elevenLabsService.textToSpeech(response);
                } catch (audioError) {
                    console.error('Erro ao gerar áudio:', audioError);
                }
            }
            
            return { response: response, audioUrl: audioData?.url || null, usage: usage };
        } catch (error) {
            console.error('Erro ao processar mensagem:', error);
            throw error;
        }
    }
}

module.exports = new ConversationService();

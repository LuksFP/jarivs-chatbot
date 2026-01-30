const axios = require('axios');
const { SYSTEM_PROMPT, AI_CONFIG } = require('../config/ai-config');

class GroqService {
    constructor() {
        this.apiKey = process.env.GROQ_API_KEY;
        this.baseUrl = 'https://api.groq.com/openai/v1';
        this.model = 'llama-3.3-70b-versatile';
    }
    
    async generateResponse(messages, userContext = {}) {
        try {
            const systemPrompt = this.buildSystemPrompt(userContext);
            
            const groqMessages = [
                { role: 'system', content: systemPrompt },
                ...messages
            ];
            
            console.log('📡 Chamando Groq API...');
            console.log('🔑 API Key:', this.apiKey ? 'Configurada ✅' : 'NÃO CONFIGURADA ❌');
            console.log('🤖 Modelo:', this.model);
            
            const response = await axios.post(
                this.baseUrl + '/chat/completions',
                {
                    model: this.model,
                    messages: groqMessages,
                    max_tokens: AI_CONFIG.maxTokens,
                    temperature: AI_CONFIG.temperature,
                },
                {
                    headers: {
                        'Authorization': 'Bearer ' + this.apiKey,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            const aiResponse = response.data.choices[0].message.content;
            
            console.log('✅ Resposta recebida do Groq!');
            
            return { 
                response: aiResponse, 
                usage: response.data.usage
            };
        } catch (error) {
            console.error('❌ Erro na Groq API:', error.response?.data || error.message);
            throw new Error('Erro ao gerar resposta da IA');
        }
    }
    
    buildSystemPrompt(userContext) {
        let prompt = SYSTEM_PROMPT;
        if (Object.keys(userContext).length > 0) {
            prompt += '\n\nCONTEXTO DO USUÁRIO:\n';
            Object.keys(userContext).forEach(key => {
                prompt += '- ' + key + ': ' + userContext[key] + '\n';
            });
        }
        return prompt;
    }
    
    isConfigured() {
        return !!this.apiKey;
    }
}

module.exports = new GroqService();

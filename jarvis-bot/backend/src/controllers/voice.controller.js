const elevenLabsService = require('../services/elevenlabs.service');

class VoiceController {
    async textToSpeech(req, res) {
        try {
            const { text } = req.body;
            
            if (!text || !text.trim()) {
                return res.status(400).json({ error: 'Texto não pode estar vazio' });
            }
            
            if (!elevenLabsService.isConfigured()) {
                return res.status(503).json({ error: 'Serviço de voz não configurado' });
            }
            
            const audio = await elevenLabsService.textToSpeech(text.trim());
            
            res.json({ success: true, audioUrl: audio.url, filename: audio.filename });
        } catch (error) {
            console.error('Erro ao gerar áudio:', error);
            res.status(500).json({ error: 'Erro ao gerar áudio', details: error.message });
        }
    }
}

module.exports = new VoiceController();

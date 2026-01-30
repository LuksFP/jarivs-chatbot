const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const elevenLabsConfig = require('../config/elevenlabs-config');

class ElevenLabsService {
    constructor() {
        this.apiKey = elevenLabsConfig.apiKey;
        this.baseUrl = elevenLabsConfig.baseUrl;
        this.voiceId = elevenLabsConfig.voiceId;
        this.modelId = elevenLabsConfig.modelId;
        this.voiceSettings = elevenLabsConfig.voiceSettings;
        this.audioDir = path.join(__dirname, '../../audio_cache');
    }
    
    async textToSpeech(text) {
        try {
            console.log('🎙️ Gerando áudio com ElevenLabs...');
            
            const response = await axios.post(
                this.baseUrl + '/text-to-speech/' + this.voiceId,
                {
                    text: text,
                    model_id: this.modelId,
                    voice_settings: this.voiceSettings
                },
                {
                    headers: {
                        'Accept': 'audio/mpeg',
                        'xi-api-key': this.apiKey,
                        'Content-Type': 'application/json'
                    },
                    responseType: 'arraybuffer'
                }
            );
            
            const filename = 'jarvis_' + uuidv4() + '.mp3';
            const filepath = path.join(this.audioDir, filename);
            fs.writeFileSync(filepath, response.data);
            
            console.log('✅ Áudio gerado:', filename);
            return { filename: filename, filepath: filepath, url: '/audio/' + filename };
        } catch (error) {
            console.error('Erro ao gerar áudio:', error.response?.data || error.message);
            throw new Error('Erro ao gerar áudio com ElevenLabs');
        }
    }
    
    isConfigured() {
        return !!this.apiKey;
    }
}

module.exports = new ElevenLabsService();

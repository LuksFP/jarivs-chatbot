module.exports = {
    apiKey: process.env.ELEVENLABS_API_KEY,
    voiceId: process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB',
    modelId: process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2',
    voiceSettings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true
    },
    baseUrl: 'https://api.elevenlabs.io/v1',
    voices: {
        adam: 'pNInz6obpgDQGcFmaJgB',
        rachel: '21m00Tcm4TlvDq8ikWAM',
        domi: 'AZnzlk1XvdvUeBnXmlld',
        bella: 'EXAVITQu4vr4xnSDxMaL',
        antoni: 'ErXwobaYiN019PkySvjV',
    }
};

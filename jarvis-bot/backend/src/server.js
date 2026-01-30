// ================================================
// SERVIDOR PRINCIPAL - JARVIS BACKEND
// ================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const chatRoutes = require('./routes/chat.routes');
const voiceRoutes = require('./routes/voice.routes');
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/audio', express.static(path.join(__dirname, '../audio_cache')));

// Logging
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log('[' + timestamp + '] ' + req.method + ' ' + req.path);
    next();
});

// Rotas
app.get('/health', (req, res) => {
    res.json({ status: 'online', timestamp: new Date().toISOString() });
});

app.use('/api/chat', chatRoutes);
app.use('/api/voice', voiceRoutes);

// 404
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Erro:', error);
    res.status(500).json({ error: error.message });
});

// Inicialização
async function startServer() {
    try {
        console.log('📦 Inicializando banco de dados...');
        await db.initialize();
        console.log('✅ Banco pronto');
        
        const fs = require('fs');
        const audioDir = path.join(__dirname, '../audio_cache');
        if (!fs.existsSync(audioDir)) {
            fs.mkdirSync(audioDir, { recursive: true });
        }
        
        app.listen(PORT, () => {
            console.log('');
            console.log('================================================');
            console.log('🤖 JARVIS Backend');
            console.log('================================================');
            console.log('🚀 Servidor: http://localhost:' + PORT);
            console.log('📊 Health: http://localhost:' + PORT + '/health');
            console.log('================================================');
            console.log('');
        });
    } catch (error) {
        console.error('❌ Erro ao iniciar:', error);
        process.exit(1);
    }
}

startServer();

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chatRoutes = require('./routes/chat.routes');

// IMPORTANTE: Inicializar banco de dados
require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use((req, res, next) => {
    console.log('[' + new Date().toISOString() + ']', req.method, req.path);
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'online', 
        message: 'JARVIS Backend is running',
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/api/chat', chatRoutes);

// 404
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

// Start
app.listen(PORT, '0.0.0.0', () => {
    console.log('================================================');
    console.log('🤖 JARVIS Backend');
    console.log('================================================');
    console.log('🚀 Servidor: http://localhost:' + PORT);
    console.log('📊 Health: http://localhost:' + PORT + '/health');
    console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
    console.log('================================================');
});

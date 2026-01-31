# 🤖 J.A.R.V.I.S - Assistente Virtual Inteligente

![JARVIS Banner](https://img.shields.io/badge/JARVIS-AI%20Assistant-00ffff?style=for-the-badge&logo=robot&logoColor=white)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

> Inspirado no assistente virtual do Tony Stark (Homem de Ferro), este projeto é um assistente de voz inteligente com interface futurista estilo Homem de Ferro.

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Como Usar](#-como-usar)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [API Endpoints](#-api-endpoints)
- [Comandos de Voz](#-comandos-de-voz)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

O **J.A.R.V.I.S** (Just A Rather Very Intelligent System) é um assistente virtual completo que combina:

- 🎤 **Reconhecimento de voz** em tempo real
- 🧠 **Inteligência Artificial** para respostas contextuais
- 🎨 **Interface futurista** estilo Homem de Ferro
- 🔊 **Síntese de voz** para respostas faladas
- 💬 **Chat por texto** como alternativa

### Preview
```
┌─────────────────────────────────────────────────────────────┐
│                      J.A.R.V.I.S                            │
│                    ● ONLINE | v1.0.0                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                         ◉                                   │
│                    [  ORB ANIMADO  ]                        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  🔴 Ouvindo...                                              │
│                                                             │
│     "Qual a previsão do tempo para hoje?"                   │
│                                                             │
│            [ENVIAR]     [LIMPAR]                            │
├─────────────────────────────────────────────────────────────┤
│  [____________________] [📤] [✓] [✕] [🛡️] [🎤]              │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Funcionalidades

### 🎤 Reconhecimento de Voz
- **Wake Word**: Diga "JARVIS" para ativar
- **Modo Livre**: Fale diretamente sem wake word
- **Transcrição em tempo real**: Veja o que está sendo captado
- **Envio manual**: Você decide quando enviar a mensagem
- **Cancelamento de ruído**: Filtros de áudio otimizados

### 🧠 Inteligência Artificial
- Respostas contextuais e inteligentes
- Memória de conversação
- Processamento de linguagem natural em Português

### 🎨 Interface
- Design futurista estilo Homem de Ferro
- Orb animado com estados visuais
- Efeitos de glow e scanlines
- Totalmente responsivo
- Tema escuro com cores cyan/azul

### 🔊 Síntese de Voz
- Respostas faladas pelo JARVIS
- Controle de velocidade e tom
- Opção de desativar áudio

---

## 🛠️ Tecnologias

### Frontend
| Tecnologia | Descrição |
|------------|-----------|
| ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react) | Framework principal |
| ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript) | Tipagem estática |
| ![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite) | Build tool |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss) | Estilização |
| ![Lucide](https://img.shields.io/badge/Lucide-Icons-F56565) | Ícones |

### Backend
| Tecnologia | Descrição |
|------------|-----------|
| ![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python) | Linguagem principal |
| ![FastAPI](https://img.shields.io/badge/FastAPI-0.100-009688?logo=fastapi) | Framework API |
| ![LangChain](https://img.shields.io/badge/LangChain-AI-FF6B6B) | Orquestração de IA |
| ![Groq](https://img.shields.io/badge/Groq-LLM-00A67E) | Modelo de linguagem |

### APIs de Voz
| Tecnologia | Descrição |
|------------|-----------|
| Web Speech API | Reconhecimento de voz nativo |
| Speech Synthesis | Síntese de voz nativa |

---

## 🏗️ Arquitetura
```
┌─────────────────────────────────────────────────────────────────┐
│                          FRONTEND                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   React     │  │  TailwindCSS│  │   Web Speech API        │  │
│  │   + Vite    │  │             │  │   (Reconhecimento)      │  │
│  └──────┬──────┘  └─────────────┘  └────────────┬────────────┘  │
│         │                                       │               │
│         └───────────────┬───────────────────────┘               │
│                         │                                       │
└─────────────────────────┼───────────────────────────────────────┘
                          │ HTTP/REST
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                          BACKEND                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   FastAPI   │  │  LangChain  │  │      Groq API           │  │
│  │   (REST)    │──│  (Chain)    │──│   (LLM - Llama 3)       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Instalação

### Pré-requisitos

- **Node.js** 18+ 
- **Python** 3.11+
- **Git**
- **Conta Groq** (para API key)

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/jarvis-bot.git
cd jarvis-bot
```

### 2. Configurar o Backend
```bash
cd backend

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Criar arquivo .env
cp .env.example .env
```

### 3. Configurar o Frontend
```bash
cd frontend

# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env
```

### 4. Iniciar o projeto

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate  # Windows
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Acessar

Abra o navegador em: **http://localhost:5173**

---

## ⚙️ Configuração

### Backend (.env)
```env
# API Keys
GROQ_API_KEY=sua_chave_groq_aqui

# Configurações do servidor
HOST=0.0.0.0
PORT=8000
DEBUG=true

# Configurações do modelo
MODEL_NAME=llama-3.3-70b-versatile
TEMPERATURE=0.7
MAX_TOKENS=1024
```

### Frontend (.env)
```env
# URL do Backend
VITE_API_URL=http://localhost:8000

# Configurações
VITE_APP_NAME=JARVIS
VITE_APP_VERSION=1.0.0
```

### Obter API Key do Groq

1. Acesse [console.groq.com](https://console.groq.com)
2. Crie uma conta gratuita
3. Vá em **API Keys**
4. Clique em **Create API Key**
5. Copie a chave e cole no `.env`

---

## 📖 Como Usar

### Modo Texto
1. Digite sua mensagem no campo de texto
2. Pressione **Enter** ou clique no botão **Enviar**
3. Aguarde a resposta do JARVIS

### Modo Voz (com Wake Word)
1. Clique no botão do **microfone** para ativar
2. Diga **"JARVIS"** para começar
3. Fale sua mensagem
4. Clique em **ENVIAR** quando terminar
5. Ou clique em **LIMPAR** para cancelar

### Modo Voz (Livre)
1. Clique no botão do **microfone**
2. Clique no botão do **escudo** para desativar Wake Word
3. Fale diretamente sua mensagem
4. Clique em **ENVIAR** quando terminar

### Botões da Interface

| Botão | Função |
|-------|--------|
| 📤 | Enviar mensagem de texto |
| ✓ | Enviar mensagem de voz |
| ✕ | Limpar/Cancelar transcrição |
| 🛡️ | Ativar/Desativar Wake Word |
| 🎤 | Ativar/Desativar modo voz |

---

## 📁 Estrutura de Pastas
```
jarvis-bot/
├── 📂 backend/
│   ├── 📂 app/
│   │   ├── 📂 api/
│   │   │   └── routes.py          # Rotas da API
│   │   ├── 📂 core/
│   │   │   ├── config.py          # Configurações
│   │   │   └── security.py        # Segurança
│   │   ├── 📂 services/
│   │   │   ├── ai_service.py      # Serviço de IA
│   │   │   └── speech_service.py  # Serviço de voz
│   │   └── 📂 models/
│   │       └── schemas.py         # Schemas Pydantic
│   ├── main.py                    # Entrada principal
│   ├── requirements.txt           # Dependências Python
│   └── .env                       # Variáveis de ambiente
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── JarvisInterface.tsx   # Interface principal
│   │   │   ├── JarvisInput.tsx       # Campo de entrada
│   │   │   ├── JarvisMessages.tsx    # Lista de mensagens
│   │   │   ├── JarvisOrb.tsx         # Orb animado
│   │   │   └── JarvisHeader.tsx      # Cabeçalho
│   │   ├── 📂 hooks/
│   │   │   └── useSpeechRecognition.ts  # Hook de voz
│   │   ├── 📂 services/
│   │   │   └── jarvisService.ts      # Comunicação com API
│   │   ├── 📂 types/
│   │   │   └── jarvis.ts             # Tipos TypeScript
│   │   ├── 📂 styles/
│   │   │   └── globals.css           # Estilos globais
│   │   ├── App.tsx                   # Componente raiz
│   │   └── main.tsx                  # Entrada React
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── .env
│
└── 📄 README.md
```

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:8000/api
```

### Endpoints

#### Health Check
```http
GET /health
```
**Resposta:**
```json
{
  "status": "online",
  "version": "1.0.0"
}
```

#### Enviar Mensagem
```http
POST /chat
Content-Type: application/json

{
  "message": "Olá JARVIS, como você está?",
  "voice_response": false
}
```
**Resposta:**
```json
{
  "response": "Olá! Estou funcionando perfeitamente...",
  "audio_url": null
}
```

#### Enviar Áudio
```http
POST /speech-to-text
Content-Type: multipart/form-data

audio: [arquivo de áudio]
```
**Resposta:**
```json
{
  "text": "Texto transcrito do áudio"
}
```

---

## 🗣️ Comandos de Voz

### Wake Words Reconhecidas
- "Jarvis"
- "Oi Jarvis"
- "Ei Jarvis"
- "Hey Jarvis"
- "Ok Jarvis"
- "Olá Jarvis"
- "Fala Jarvis"

### Variações Aceitas (tolerância a erros)
O sistema reconhece variações fonéticas como:
- "Jarves", "Jarvs", "Jarvi", "Jarvas"

---

## 🎨 Personalização

### Cores (tailwind.config.js)
```javascript
colors: {
  jarvis: {
    primary: '#00ffff',    // Cyan principal
    secondary: '#0080ff',  // Azul secundário
    accent: '#00ff88',     // Verde accent
    dark: '#0a0e27',       // Fundo escuro
    text: '#ffffff',       // Texto branco
  }
}
```

### Adicionar Nova Wake Word
Edite `src/hooks/useSpeechRecognition.ts`:
```typescript
const wakePatterns = [
  /jarvis/,
  /sua_palavra/,  // Adicione aqui
];
```

---

## 🐛 Troubleshooting

### Microfone não funciona
1. Verifique permissões do navegador
2. Use HTTPS ou localhost
3. Teste em Chrome (melhor suporte)

### Erro de conexão com backend
1. Verifique se o backend está rodando
2. Confirme a URL no `.env` do frontend
3. Verifique CORS no backend

### Wake word não reconhece
1. Fale claramente "JARVIS"
2. Reduza ruído ambiente
3. Desative Wake Word e use modo livre

---

## 🤝 Contribuição

1. Faça um **Fork** do projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/NovaFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add: Nova feature'`)
4. **Push** para a branch (`git push origin feature/NovaFeature`)
5. Abra um **Pull Request**

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Lukas**


---

## 🙏 Agradecimentos

- Inspirado no J.A.R.V.I.S dos filmes do Homem de Ferro (Marvel)
- [Groq](https://groq.com) pela API de IA
- [React](https://react.dev) pela framework
- [TailwindCSS](https://tailwindcss.com) pelos estilos
- [Typescrit] para tipagem
- 

---

<div align="center">

**⭐ Se este projeto te ajudou, deixe uma estrela! ⭐**

</div>

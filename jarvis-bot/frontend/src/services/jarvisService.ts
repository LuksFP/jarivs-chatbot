const API_URL =
  import.meta.env.VITE_API_URL || 'https://jarivs-chatbot-production.up.railway.app';

export interface ChatResponse {
  success: boolean;
  response: string;
  audioUrl?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface Message {
  message: string;
  userId: string;
  useVoice: boolean;
}

// Gerar ou recuperar userId do localStorage
function getUserId(): string {
  let userId = localStorage.getItem('jarvis_user_id');
  if (!userId) {
    userId =
      'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('jarvis_user_id', userId);
  }
  return userId;
}

// Envia mensagem para a API
export async function sendMessage(
  message: string,
  useVoice: boolean = false
): Promise<ChatResponse> {
  try {
    console.log('📤 Enviando para:', `${API_URL}/api/chat`);
    console.log('📝 Mensagem:', message);

    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        userId: getUserId(),
        useVoice,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro HTTP:', response.status, errorText);
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    console.log('✅ Resposta:', data);

    return data;
  } catch (error) {
    console.error('❌ Erro:', error);
    throw error;
  }
}

// Reproduz áudio (se useVoice=true)
export async function playAudio(audioUrl: string): Promise<void> {
  try {
    console.log('🔊 Reproduzindo:', audioUrl);

    const fullUrl = audioUrl.startsWith('http')
      ? audioUrl
      : `${API_URL}${audioUrl}`;

    const audio = new Audio(fullUrl);

    return new Promise((resolve, reject) => {
      audio.onended = () => {
        console.log('✅ Áudio finalizado');
        resolve();
      };

      audio.onerror = (error) => {
        console.error('❌ Erro áudio:', error);
        reject(error);
      };

      audio.play().catch(reject);
    });
  } catch (error) {
    console.error('❌ Erro playAudio:', error);
    throw error;
  }
}

// Verifica se o backend está online
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const data = await response.json();
    console.log('💚 Backend:', data);
    return data.status === 'online';
  } catch (error) {
    console.error('❌ Backend offline:', error);
    return false;
  }
}

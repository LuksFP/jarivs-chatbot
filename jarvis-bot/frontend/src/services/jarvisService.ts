const API_URL = 'http://localhost:3000';

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

function getUserId(): string {
  let userId = localStorage.getItem('jarvis_user_id');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('jarvis_user_id', userId);
  }
  return userId;
}

export async function sendMessage(
  message: string,
  useVoice: boolean = false
): Promise<ChatResponse> {
  try {
    console.log('📤 Enviando mensagem:', message);
    
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
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    console.log('✅ Resposta recebida:', data);
    return data;
  } catch (error) {
    console.error('❌ Erro ao enviar mensagem:', error);
    throw error;
  }
}

export async function playAudio(audioUrl: string): Promise<void> {
  try {
    console.log('🔊 Reproduzindo áudio:', audioUrl);
    const fullUrl = `${API_URL}${audioUrl}`;
    const audio = new Audio(fullUrl);
    
    return new Promise((resolve, reject) => {
      audio.onended = () => {
        console.log('✅ Áudio finalizado');
        resolve();
      };
      audio.onerror = (error) => {
        console.error('❌ Erro ao reproduzir áudio:', error);
        reject(error);
      };
      audio.play().catch(reject);
    });
  } catch (error) {
    console.error('❌ Erro no playAudio:', error);
    throw error;
  }
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    console.log('💚 Backend online:', data);
    return data.status === 'online';
  } catch (error) {
    console.error('❌ Backend offline:', error);
    return false;
  }
}
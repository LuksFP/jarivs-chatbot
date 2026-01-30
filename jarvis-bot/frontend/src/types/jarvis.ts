export type JarvisState = 'idle' | 'initializing' | 'listening' | 'processing' | 'speaking' | 'error';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

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

export interface SpeechRecognitionOptions {
  onWakeWordDetected?: () => void;
  onResult?: (text: string) => void;
  onError?: (error: string) => void;
}
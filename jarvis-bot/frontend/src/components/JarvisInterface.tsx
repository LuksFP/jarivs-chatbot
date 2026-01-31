import { useState, useEffect, useRef } from 'react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { sendMessage, checkHealth } from '@/services/jarvisService';
import JarvisOrb from './JarvisOrb';
import JarvisHeader from './JarvisHeader';
import JarvisMessages from './JarvisMessages';
import JarvisInput from './JarvisInput';
import type { JarvisState, Message } from '@/types/jarvis';

export default function JarvisInterface() {
  const [state, setState] = useState<JarvisState>('initializing');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkHealth().then((online) => {
      setIsBackendOnline(online);
      setState(online ? 'idle' : 'error');
    });
  }, []);

  const {
    isListening,
    transcript,
    currentTranscript,
    wakeWordEnabled,
    startListening,
    stopListening,
    sendCurrentTranscript,
    clearTranscript,
    toggleWakeWord,
  } = useSpeechRecognition({
    onWakeWordDetected: () => {
      setState('listening');
    },
    onResult: (text) => {
      if (text.trim()) {
        handleSendMessage(text);
      }
    },
    onError: () => {
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, state]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setState('processing');

    try {
      const response = await sendMessage(text, false);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setState(isVoiceMode ? 'listening' : 'idle');
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Erro ao processar mensagem.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      setState('error');
      setTimeout(() => setState(isVoiceMode ? 'listening' : 'idle'), 3000);
    }
  };

  const handleToggleVoice = () => {
    if (!isVoiceMode) {
      setIsVoiceMode(true);
      startListening();
    } else {
      setIsVoiceMode(false);
      stopListening();
      setState('idle');
    }
  };

  const handleSendVoiceMessage = () => {
    if (transcript.trim()) {
      sendCurrentTranscript();
    }
  };

  const handleCancelVoiceMessage = () => {
    clearTranscript();
    setState('listening');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] relative overflow-y-auto">
      <div className="scanline" />
      
      <div className="w-full max-w-5xl mx-auto p-6 space-y-8 pb-64 relative z-10">
        
        <JarvisHeader state={state} isBackendOnline={isBackendOnline} />
        
        <div className="flex justify-center py-8">
          <JarvisOrb state={state} isListening={isListening} />
        </div>
        
        {currentTranscript && isVoiceMode && (
          <div className="glass-effect border-glow rounded-2xl p-4 text-center animate-fade-in">
            <p className="text-yellow-400 font-rajdhani text-lg font-bold">
              📝 "{currentTranscript}"
            </p>
          </div>
        )}
        
        <JarvisMessages 
          messages={messages} 
          state={state}
          messagesEndRef={messagesEndRef}
        />
        
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0e27] via-[#0a0e27] to-transparent backdrop-blur-md border-t border-cyan-500/20 p-6 z-50">
        <div className="w-full max-w-5xl mx-auto">
          <JarvisInput
            value={inputValue}
            onChange={setInputValue}
            onSend={() => handleSendMessage(inputValue)}
            onKeyPress={handleKeyPress}
            isVoiceMode={isVoiceMode}
            onToggleVoice={handleToggleVoice}
            state={state}
            onSendVoice={handleSendVoiceMessage}
            onCancelVoice={handleCancelVoiceMessage}
            wakeWordEnabled={wakeWordEnabled}
            onToggleWakeWord={toggleWakeWord}
            hasTranscript={!!transcript.trim()}
          />
        </div>
      </div>
      
    </div>
  );
}
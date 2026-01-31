import { useState, useEffect, useRef } from 'react';
import type { SpeechRecognitionOptions } from '@/types/jarvis';

export function useSpeechRecognition(options: SpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [wakeWordEnabled, setWakeWordEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);
  const wakeWordDetected = useRef(false);
  const sessionActive = useRef(false);

  const WAKE_WORDS = ['jarvis', 'jarviz', 'jarves', 'oi jarvis', 'ei jarvis', 'hey jarvis'];

  const hasWakeWord = (text: string) => {
    return WAKE_WORDS.some(word => text.toLowerCase().includes(word));
  };

  const removeWakeWords = (text: string) => {
    let cleaned = text.toLowerCase();
    WAKE_WORDS.forEach(word => {
      cleaned = cleaned.replace(word, '');
    });
    return cleaned.trim();
  };

  const handleFinalTranscript = (text: string) => {
    const lowerText = text.toLowerCase().trim();
    console.log('📝 Transcript final:', lowerText);

    // Wake word desabilitada - aceita tudo
    if (!wakeWordEnabled) {
      console.log('💬 Wake word OFF - aceitando:', text);
      setTranscript(text);
      return;
    }

    // Sessão já ativa - aceita tudo
    if (sessionActive.current) {
      console.log('💬 Sessão ativa:', text);
      setTranscript(text);
      return;
    }

    // Precisa de wake word e ainda não detectou
    if (!hasWakeWord(lowerText)) return;

    console.log('🎯 Wake word detectada!');
    wakeWordDetected.current = true;
    sessionActive.current = true;
    options.onWakeWordDetected?.();

    const cleaned = removeWakeWords(lowerText);
    setTranscript(cleaned || '');
  };

  useEffect(() => {
    console.log('🔧 Inicializando Speech Recognition...');
    
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      console.error('❌ Speech Recognition não suportado');
      return;
    }

    recognitionRef.current = new SpeechRecognitionAPI();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'pt-BR';
    recognitionRef.current.maxAlternatives = 1;

    console.log('✅ Speech Recognition configurado!');

    recognitionRef.current.onstart = () => console.log('🎤 Reconhecimento iniciado');
    
    recognitionRef.current.onend = () => {
      console.log('🛑 Reconhecimento encerrado');
      if (isListening) {
        setTimeout(() => {
          try {
            recognitionRef.current?.start();
          } catch {}
        }, 100);
      }
    };

    recognitionRef.current.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        event.results[i].isFinal ? finalTranscript += text : interimTranscript += text;
      }

      setCurrentTranscript(interimTranscript || finalTranscript);
      
      if (finalTranscript) {
        handleFinalTranscript(finalTranscript);
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('❌ Erro:', event.error);
      if (event.error === 'not-allowed') {
        alert('⚠️ Permissão de microfone negada!');
      }
      options.onError?.(event.error);
    };

    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {}
    };
  }, [wakeWordEnabled]);

  const startListening = () => {
    if (!recognitionRef.current || isListening) return;
    
    console.log('🎤 Iniciando escuta...');
    setIsListening(true);
    setTranscript('');
    setCurrentTranscript('');
    
    wakeWordDetected.current = !wakeWordEnabled;
    sessionActive.current = !wakeWordEnabled;
    
    try {
      recognitionRef.current.start();
      console.log('✅ Escuta iniciada!');
    } catch (error) {
      console.error('❌ Erro ao iniciar:', error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current || !isListening) return;
    
    console.log('🛑 Parando escuta...');
    setIsListening(false);
    wakeWordDetected.current = false;
    sessionActive.current = false;
    
    try {
      recognitionRef.current.stop();
    } catch {}
  };

  const sendCurrentTranscript = () => {
    if (!transcript.trim()) return;
    
    console.log('📤 Enviando transcript:', transcript);
    options.onResult?.(transcript);
    setTranscript('');
    setCurrentTranscript('');
  };

  const clearTranscript = () => {
    console.log('🗑️ Limpando transcript');
    setTranscript('');
    setCurrentTranscript('');
  };

  const toggleWakeWord = () => {
    const newValue = !wakeWordEnabled;
    setWakeWordEnabled(newValue);
    console.log('🔒 Wake word:', newValue ? 'ATIVADA' : 'DESATIVADA');
  };

  return {
    isListening,
    transcript,
    currentTranscript,
    wakeWordEnabled,
    startListening,
    stopListening,
    sendCurrentTranscript,
    clearTranscript,
    toggleWakeWord,
  };
}
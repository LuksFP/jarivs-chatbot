import { useState, useEffect, useRef } from 'react';
import type { SpeechRecognitionOptions } from '@/types/jarvis';

export function useSpeechRecognition(options: SpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentTranscript, setCurrentTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const wakeWordDetected = useRef(false);
  const sessionActive = useRef(false);

  useEffect(() => {
    console.log('🔧 Inicializando Speech Recognition...');
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error('❌ Speech Recognition não suportado');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'pt-BR';
    recognitionRef.current.maxAlternatives = 1;

    console.log('✅ Speech Recognition configurado!');

    recognitionRef.current.onstart = () => {
      console.log('🎤 Reconhecimento iniciado');
    };

    recognitionRef.current.onend = () => {
      console.log('🛑 Reconhecimento encerrado');
      if (isListening) {
        setTimeout(() => {
          try {
            recognitionRef.current?.start();
          } catch (error) {
            console.log('Erro ao reiniciar');
          }
        }, 100);
      }
    };

    recognitionRef.current.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart;
        } else {
          interimTranscript += transcriptPart;
        }
      }

      setCurrentTranscript(interimTranscript || finalTranscript);

      if (finalTranscript) {
        const lowerTranscript = finalTranscript.toLowerCase().trim();
        console.log('📝 Transcript final:', lowerTranscript);
        
        if (!wakeWordDetected.current && !sessionActive.current) {
          const wakeWords = ['jarvis', 'jarviz', 'jarves', 'oi jarvis', 'ei jarvis', 'hey jarvis'];
          const hasWakeWord = wakeWords.some(word => lowerTranscript.includes(word));
          
          if (hasWakeWord) {
            console.log('🎯 WAKE WORD DETECTADA! Sessão iniciada');
            wakeWordDetected.current = true;
            sessionActive.current = true;
            options.onWakeWordDetected?.();
            
            let cleanedTranscript = lowerTranscript;
            wakeWords.forEach(word => {
              cleanedTranscript = cleanedTranscript.replace(word, '').trim();
            });
            
            if (cleanedTranscript) {
              setTranscript(cleanedTranscript);
            } else {
              setTranscript('');
            }
          }
        } else {
          console.log('💬 Fala capturada (sessão ativa):', finalTranscript);
          setTranscript(finalTranscript);
        }
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
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.log('Já estava parado');
        }
      }
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current || isListening) return;
    
    console.log('🎤 Iniciando escuta...');
    setIsListening(true);
    setTranscript('');
    setCurrentTranscript('');
    wakeWordDetected.current = false;
    sessionActive.current = false;
    
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
    } catch (error) {
      console.error('❌ Erro ao parar:', error);
    }
  };

  const sendCurrentTranscript = () => {
    if (transcript.trim()) {
      console.log('📤 Enviando transcript:', transcript);
      options.onResult?.(transcript);
      setTranscript('');
      setCurrentTranscript('');
    }
  };

  const clearTranscript = () => {
    console.log('🗑️ Limpando transcript');
    setTranscript('');
    setCurrentTranscript('');
  };

  return {
    isListening,
    transcript,
    currentTranscript,
    startListening,
    stopListening,
    sendCurrentTranscript,
    clearTranscript,
  };
}
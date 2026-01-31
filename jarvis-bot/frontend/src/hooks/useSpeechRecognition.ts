import { useState, useEffect, useRef, useCallback } from 'react';
import type { SpeechRecognitionOptions } from '@/types/jarvis';

export function useSpeechRecognition(options: SpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [wakeWordEnabled, setWakeWordEnabled] = useState(true);
  const [isWakeWordActive, setIsWakeWordActive] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const isStartingRef = useRef(false);
  const shouldRestartRef = useRef(false);

  // Inicializar Speech Recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('❌ Speech Recognition nao suportado neste navegador');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'pt-BR';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('🎤 Reconhecimento iniciado');
      setIsListening(true);
      isStartingRef.current = false;
    };

    recognition.onresult = (event: any) => {
      let finalText = '';
      let interimText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;

        if (result.isFinal) {
          finalText += text;
        } else {
          interimText += text;
        }
      }

      const fullText = (finalText + interimText).toLowerCase().trim();
      console.log('📝 Ouvido:', fullText);

      // Verificar wake word
      const wakeWords = ['jarvis', 'oi jarvis', 'ei jarvis', 'hey jarvis', 'ola jarvis'];
      const hasWakeWord = wakeWords.some(word => fullText.includes(word));

      if (wakeWordEnabled && hasWakeWord && !isWakeWordActive) {
        console.log('🔔 Wake word detectada!');
        setIsWakeWordActive(true);
        if (options.onWakeWordDetected) {
          options.onWakeWordDetected();
        }
      }

      // Atualizar transcricao
      if (wakeWordEnabled) {
        if (isWakeWordActive) {
          // Remover wake words do texto
          let cleanText = fullText;
          wakeWords.forEach(word => {
            cleanText = cleanText.replace(new RegExp(word, 'gi'), '').trim();
          });
          
          if (interimText) {
            setCurrentTranscript(cleanText);
          }
          
          if (finalText && cleanText) {
            console.log('✅ Texto final:', cleanText);
            setTranscript(cleanText);
            setCurrentTranscript(cleanText);
          }
        }
      } else {
        // Modo livre - sem wake word
        if (interimText) {
          setCurrentTranscript(fullText);
        }
        
        if (finalText) {
          console.log('✅ Texto final (modo livre):', finalText);
          setTranscript(finalText.trim());
          setCurrentTranscript(finalText.trim());
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.log('❌ Erro:', event.error);
      isStartingRef.current = false;
      
      // Ignorar erro no-speech (normal quando ninguem fala)
      if (event.error === 'no-speech') {
        return;
      }
      
      // Ignorar erro aborted (quando paramos manualmente)
      if (event.error === 'aborted') {
        return;
      }

      if (options.onError) {
        options.onError(event.error);
      }
    };

    recognition.onend = () => {
      console.log('🛑 Reconhecimento encerrado');
      setIsListening(false);
      isStartingRef.current = false;
      
      // Reiniciar automaticamente se necessario
      if (shouldRestartRef.current && recognitionRef.current) {
        console.log('🔄 Reiniciando automaticamente...');
        setTimeout(() => {
          if (shouldRestartRef.current && !isStartingRef.current) {
            try {
              isStartingRef.current = true;
              recognitionRef.current.start();
            } catch (e) {
              console.log('⚠️ Ja estava ativo');
              isStartingRef.current = false;
            }
          }
        }, 100);
      }
    };

    recognitionRef.current = recognition;
    console.log('✅ Speech Recognition configurado');

    return () => {
      shouldRestartRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignorar
        }
      }
    };
  }, [wakeWordEnabled, isWakeWordActive, options]);

  const startListening = useCallback(async () => {
    if (!recognitionRef.current) {
      console.error('❌ Recognition nao inicializado');
      return false;
    }

    if (isStartingRef.current || isListening) {
      console.log('⚠️ Ja esta escutando ou iniciando');
      return true;
    }

    try {
      console.log('🎤 Iniciando escuta...');
      
      // Solicitar permissao do microfone
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('✅ Microfone autorizado');
      
      shouldRestartRef.current = true;
      isStartingRef.current = true;
      recognitionRef.current.start();
      
      return true;
    } catch (error: any) {
      console.error('❌ Erro ao iniciar:', error);
      isStartingRef.current = false;
      
      if (options.onError) {
        options.onError(error?.message || 'Erro desconhecido');
      }
      return false;
    }
  }, [isListening, options]);

  const stopListening = useCallback(() => {
    console.log('🛑 Parando escuta...');
    shouldRestartRef.current = false;
    isStartingRef.current = false;
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignorar
      }
    }
    
    setIsListening(false);
    setIsWakeWordActive(false);
    setCurrentTranscript('');
  }, []);

  const sendCurrentTranscript = useCallback(() => {
    if (transcript.trim() && options.onResult) {
      console.log('📤 Enviando:', transcript);
      options.onResult(transcript);
      setTranscript('');
      setCurrentTranscript('');
      setIsWakeWordActive(false);
    }
  }, [transcript, options]);

  const clearTranscript = useCallback(() => {
    console.log('🗑️ Limpando transcricao');
    setTranscript('');
    setCurrentTranscript('');
    setIsWakeWordActive(false);
  }, []);

  const toggleWakeWord = useCallback(() => {
    setWakeWordEnabled(prev => {
      console.log('🔄 Wake word:', !prev ? 'ativada' : 'desativada');
      return !prev;
    });
    setIsWakeWordActive(false);
    setTranscript('');
    setCurrentTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    currentTranscript,
    wakeWordEnabled,
    isWakeWordActive,
    startListening,
    stopListening,
    sendCurrentTranscript,
    clearTranscript,
    toggleWakeWord,
  };
}
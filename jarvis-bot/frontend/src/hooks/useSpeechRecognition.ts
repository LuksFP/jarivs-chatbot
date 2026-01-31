import { useState, useEffect, useRef, useCallback } from 'react';
import type { SpeechRecognitionOptions } from '@/types/jarvis';

export function useSpeechRecognition(options: SpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [wakeWordEnabled, setWakeWordEnabled] = useState(true);
  const [isWakeWordActive, setIsWakeWordActive] = useState(false);
  const [confidence, setConfidence] = useState(0);
  
  const recognitionRef = useRef<any>(null);
  const isStartingRef = useRef(false);
  const shouldRestartRef = useRef(false);
  const accumulatedTextRef = useRef('');
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Funcao para normalizar texto (remove acentos, lowercase)
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .trim();
  };

  // Wake words com variacoes foneticas
  const checkWakeWord = (text: string) => {
    const normalized = normalizeText(text);
    const wakePatterns = [
      /jarvis/,
      /jarves/,
      /jarvs/,
      /jarvi/,
      /jarvas/,
      /jarvus/,
      /jarves/,
      /oi\s*jarv/,
      /ei\s*jarv/,
      /hey\s*jarv/,
      /ola\s*jarv/,
      /ok\s*jarv/,
      /fala\s*jarv/,
      /e\s*ai\s*jarv/,
    ];
    return wakePatterns.some(pattern => pattern.test(normalized));
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { console.error('Speech Recognition nao suportado'); return; }

    const recognition = new SpeechRecognition();
    
    // CONFIGURACOES OTIMIZADAS PARA MELHOR RECONHECIMENTO
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'pt-BR';
    recognition.maxAlternatives = 5; // Mais alternativas = melhor chance de acertar
    
    // Adicionar gramaticas alternativas se suportado
    if ('grammars' in recognition) {
      try {
        const SpeechGrammarList = (window as any).SpeechGrammarList || (window as any).webkitSpeechGrammarList;
        if (SpeechGrammarList) {
          const grammar = '#JSGF V1.0; grammar commands; public <command> = jarvis | oi jarvis | hey jarvis | ok jarvis;';
          const grammarList = new SpeechGrammarList();
          grammarList.addFromString(grammar, 1);
          recognition.grammars = grammarList;
        }
      } catch (e) { console.log('Gramatica nao suportada'); }
    }

    recognition.onstart = () => { 
      console.log('🎤 Reconhecimento iniciado'); 
      setIsListening(true); 
      isStartingRef.current = false; 
    };

    recognition.onaudiostart = () => { console.log('🔊 Audio capturado'); };
    recognition.onsoundstart = () => { console.log('🔉 Som detectado'); };
    recognition.onspeechstart = () => { console.log('🗣️ Fala detectada'); };

    recognition.onresult = (event: any) => {
      let interimText = '';
      let finalText = '';
      let bestConfidence = 0;
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        
        // Pegar a melhor alternativa baseado na confianca
        let bestAlternative = result[0];
        for (let j = 0; j < result.length; j++) {
          if (result[j].confidence > bestAlternative.confidence) {
            bestAlternative = result[j];
          }
        }
        
        const text = bestAlternative.transcript;
        bestConfidence = Math.max(bestConfidence, bestAlternative.confidence || 0);
        
        if (result.isFinal) { 
          finalText += text + ' '; 
          console.log(`✅ Final (${(bestAlternative.confidence * 100).toFixed(1)}%): "${text}"`);
        } else { 
          interimText += text; 
        }
      }

      setConfidence(bestConfidence);
      const fullText = accumulatedTextRef.current + finalText + interimText;
      
      // Verificar wake word
      if (wakeWordEnabled && !isWakeWordActive && checkWakeWord(fullText)) {
        console.log('🔔 Wake word detectada!');
        setIsWakeWordActive(true);
        accumulatedTextRef.current = '';
        if (options.onWakeWordDetected) { options.onWakeWordDetected(); }
        return;
      }

      // Se wake word ativada, so captura depois de detectar
      if (wakeWordEnabled && !isWakeWordActive) {
        setCurrentTranscript('🎤 Diga "JARVIS" para comecar...');
        return;
      }

      // Limpar wake words do texto
      let cleanText = fullText;
      const wakeWordsToRemove = ['jarvis', 'oi jarvis', 'ei jarvis', 'hey jarvis', 'ola jarvis', 'ok jarvis', 'fala jarvis'];
      wakeWordsToRemove.forEach(word => {
        cleanText = cleanText.replace(new RegExp(word, 'gi'), '').trim();
      });

      if (finalText) { 
        let cleanFinal = finalText;
        wakeWordsToRemove.forEach(word => {
          cleanFinal = cleanFinal.replace(new RegExp(word, 'gi'), '').trim();
        });
        if (cleanFinal) {
          accumulatedTextRef.current += cleanFinal + ' ';
        }
      }
      
      const displayText = cleanText.trim();
      setCurrentTranscript(displayText || '🎤 Ouvindo...');
      setTranscript(accumulatedTextRef.current.trim());
    };

    recognition.onerror = (event: any) => {
      isStartingRef.current = false;
      if (event.error === 'no-speech') { console.log('🔇 Silencio...'); return; }
      if (event.error === 'aborted') return;
      if (event.error === 'audio-capture') { console.error('❌ Erro: Microfone nao encontrado'); }
      if (event.error === 'not-allowed') { console.error('❌ Erro: Permissao negada'); }
      console.error('❌ Erro:', event.error);
      if (options.onError) { options.onError(event.error); }
    };

    recognition.onend = () => {
      console.log('⏸️ Reconhecimento pausou');
      setIsListening(false);
      isStartingRef.current = false;
      
      if (shouldRestartRef.current && recognitionRef.current) {
        setTimeout(() => {
          if (shouldRestartRef.current && !isStartingRef.current) {
            try { 
              isStartingRef.current = true; 
              recognitionRef.current.start(); 
            } catch (e) { 
              isStartingRef.current = false; 
            }
          }
        }, 200);
      }
    };

    recognitionRef.current = recognition;
    
    return () => { 
      shouldRestartRef.current = false; 
      if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch (e) {} }
      if (audioContextRef.current) { try { audioContextRef.current.close(); } catch (e) {} }
    };
  }, [options, wakeWordEnabled, isWakeWordActive]);

  const startListening = useCallback(async () => {
    if (!recognitionRef.current) return false;
    if (isStartingRef.current || isListening) return true;
    
    try {
      // Configuracoes de audio OTIMIZADAS para melhor captacao
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: { ideal: 48000, min: 16000 },
          sampleSize: { ideal: 16, min: 8 },
        } 
      });
      
      // Criar AudioContext para processar audio
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 2048;
        analyserRef.current.smoothingTimeConstant = 0.8;
        source.connect(analyserRef.current);
        console.log('🔊 Audio context criado');
      } catch (e) { console.log('AudioContext nao disponivel'); }
      
      stream.getTracks().forEach(track => track.stop());
      console.log('✅ Microfone configurado');
      
      accumulatedTextRef.current = '';
      setTranscript('');
      setCurrentTranscript(wakeWordEnabled ? '🎤 Diga "JARVIS" para comecar...' : '🎤 Ouvindo...');
      setIsWakeWordActive(!wakeWordEnabled);
      setConfidence(0);
      
      shouldRestartRef.current = true;
      isStartingRef.current = true;
      recognitionRef.current.start();
      
      return true;
    } catch (error: any) {
      console.error('❌ Erro microfone:', error);
      isStartingRef.current = false;
      if (options.onError) { options.onError(error?.message || 'Erro de microfone'); }
      return false;
    }
  }, [isListening, options, wakeWordEnabled]);

  const stopListening = useCallback(() => {
    console.log('🛑 Parando reconhecimento...');
    shouldRestartRef.current = false;
    isStartingRef.current = false;
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch (e) {} }
    if (audioContextRef.current) { try { audioContextRef.current.close(); } catch (e) {} }
    setIsListening(false);
    setIsWakeWordActive(false);
  }, []);

  const sendCurrentTranscript = useCallback(() => {
    const textToSend = accumulatedTextRef.current.trim();
    if (textToSend && options.onResult) { 
      console.log('📤 Enviando:', textToSend);
      options.onResult(textToSend); 
    }
    accumulatedTextRef.current = '';
    setTranscript('');
    setCurrentTranscript(wakeWordEnabled ? '🎤 Diga "JARVIS" para comecar...' : '🎤 Ouvindo...');
    setIsWakeWordActive(!wakeWordEnabled);
  }, [options, wakeWordEnabled]);

  const clearTranscript = useCallback(() => {
    accumulatedTextRef.current = '';
    setTranscript('');
    setCurrentTranscript(wakeWordEnabled ? '🎤 Diga "JARVIS" para comecar...' : '🎤 Ouvindo...');
    setIsWakeWordActive(!wakeWordEnabled);
  }, [wakeWordEnabled]);

  const toggleWakeWord = useCallback(() => { 
    setWakeWordEnabled(prev => {
      const newValue = !prev;
      console.log('🔄 Wake word:', newValue ? 'ON' : 'OFF');
      setIsWakeWordActive(!newValue);
      accumulatedTextRef.current = '';
      setTranscript('');
      setCurrentTranscript(newValue ? '🎤 Diga "JARVIS" para comecar...' : '🎤 Ouvindo...');
      return newValue;
    });
  }, []);

  return { isListening, transcript, currentTranscript, wakeWordEnabled, isWakeWordActive, confidence, startListening, stopListening, sendCurrentTranscript, clearTranscript, toggleWakeWord };
}

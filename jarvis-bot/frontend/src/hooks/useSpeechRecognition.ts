import { useState, useEffect, useRef, useCallback } from 'react';
import type { SpeechRecognitionOptions } from '@/types/jarvis';

export function useSpeechRecognition(options: SpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [wakeWordEnabled, setWakeWordEnabled] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const isStartingRef = useRef(false);
  const shouldRestartRef = useRef(false);
  const accumulatedTextRef = useRef('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { console.error('Speech Recognition nao suportado'); return; }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'pt-BR';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => { setIsListening(true); isStartingRef.current = false; };

    recognition.onresult = (event: any) => {
      let interimText = '';
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;
        if (result.isFinal) { finalText += text + ' '; } else { interimText += text; }
      }
      if (finalText) { accumulatedTextRef.current += finalText; }
      const displayText = accumulatedTextRef.current + interimText;
      setCurrentTranscript(displayText.trim());
      setTranscript(accumulatedTextRef.current.trim());
    };

    recognition.onerror = (event: any) => {
      isStartingRef.current = false;
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        if (options.onError) { options.onError(event.error); }
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      isStartingRef.current = false;
      if (shouldRestartRef.current && recognitionRef.current) {
        setTimeout(() => {
          if (shouldRestartRef.current && !isStartingRef.current) {
            try { isStartingRef.current = true; recognitionRef.current.start(); } catch (e) { isStartingRef.current = false; }
          }
        }, 100);
      }
    };

    recognitionRef.current = recognition;
    return () => { shouldRestartRef.current = false; if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch (e) {} } };
  }, [options]);

  const startListening = useCallback(async () => {
    if (!recognitionRef.current) return false;
    if (isStartingRef.current || isListening) return true;
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      accumulatedTextRef.current = '';
      setTranscript('');
      setCurrentTranscript('');
      shouldRestartRef.current = true;
      isStartingRef.current = true;
      recognitionRef.current.start();
      return true;
    } catch (error: any) {
      isStartingRef.current = false;
      if (options.onError) { options.onError(error?.message || 'Erro desconhecido'); }
      return false;
    }
  }, [isListening, options]);

  const stopListening = useCallback(() => {
    shouldRestartRef.current = false;
    isStartingRef.current = false;
    if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch (e) {} }
    setIsListening(false);
  }, []);

  const sendCurrentTranscript = useCallback(() => {
    const textToSend = accumulatedTextRef.current.trim();
    if (textToSend && options.onResult) { options.onResult(textToSend); }
    accumulatedTextRef.current = '';
    setTranscript('');
    setCurrentTranscript('');
  }, [options]);

  const clearTranscript = useCallback(() => {
    accumulatedTextRef.current = '';
    setTranscript('');
    setCurrentTranscript('');
  }, []);

  const toggleWakeWord = useCallback(() => { setWakeWordEnabled(prev => !prev); }, []);

  return { isListening, transcript, currentTranscript, wakeWordEnabled, isWakeWordActive: true, startListening, stopListening, sendCurrentTranscript, clearTranscript, toggleWakeWord };
}

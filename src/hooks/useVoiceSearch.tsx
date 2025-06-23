
import { useState, useEffect, useRef } from 'react';

interface VoiceSearchHook {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
  confidence: number;
}

// Define Web Speech API types
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

declare var webkitSpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof webkitSpeechRecognition;
  }
}

export const useVoiceSearch = (): VoiceSearchHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const autoStopRef = useRef<NodeJS.Timeout>();

  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();

    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
          setConfidence(event.results[i][0].confidence);
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      if (finalTranscript) {
        const cleanedTranscript = finalTranscript.trim().replace(/[.!?]+$/, '');
        setTranscript(cleanedTranscript);
        
        // Clear existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Auto-stop after 1 second of silence
        timeoutRef.current = setTimeout(() => {
          recognitionInstance.stop();
        }, 1000);
      } else if (interimTranscript) {
        // Show interim results for feedback
        setTranscript(interimTranscript.trim());
      }
    };

    recognitionInstance.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setConfidence(0);
      
      // Auto-stop after 3 seconds regardless
      autoStopRef.current = setTimeout(() => {
        recognitionInstance.stop();
      }, 3000);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (autoStopRef.current) {
        clearTimeout(autoStopRef.current);
      }
    };

    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (autoStopRef.current) {
        clearTimeout(autoStopRef.current);
      }
    };

    setRecognition(recognitionInstance);

    return () => {
      recognitionInstance.stop();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (autoStopRef.current) {
        clearTimeout(autoStopRef.current);
      }
    };
  }, [isSupported]);

  const startListening = () => {
    if (recognition && !isListening) {
      setTranscript('');
      setConfidence(0);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const resetTranscript = () => {
    setTranscript('');
    setConfidence(0);
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
    confidence
  };
};

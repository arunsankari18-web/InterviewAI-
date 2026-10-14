import { useState, useEffect, useRef, useCallback } from 'react';

export function useSpeechRecognition({ onResult, onEnd, defaultLang = 'en-IN' } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [speechError, setSpeechError] = useState(null);
  const [lang, setLang] = useState(defaultLang);

  const recognitionRef = useRef(null);
  const shouldListenRef = useRef(false);
  const restartTimeoutRef = useRef(null);
  const accumulatedTranscriptRef = useRef('');

  // Initialize SpeechRecognition instance
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = lang || 'en-IN';

    recognition.onstart = () => {
      setIsListening(true);
      setSpeechError(null);
    };

    recognition.onresult = (event) => {
      let finalStr = '';
      let interimStr = '';

      for (let i = 0; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          finalStr += res[0].transcript + ' ';
        } else {
          interimStr += res[0].transcript;
        }
      }

      if (finalStr) {
        accumulatedTranscriptRef.current = (accumulatedTranscriptRef.current + ' ' + finalStr).trim();
        setTranscript(accumulatedTranscriptRef.current);
        if (onResult) onResult(accumulatedTranscriptRef.current);
      }

      setInterimTranscript(interimStr);
      if (interimStr) {
        const fullCurrent = (accumulatedTranscriptRef.current + ' ' + interimStr).trim();
        setTranscript(fullCurrent);
        if (onResult) onResult(fullCurrent);
      }
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition notice:', event.error);
      if (event.error === 'not-allowed') {
        setSpeechError('Microphone permission blocked. Please click the lock icon in your browser address bar to allow Microphone access.');
        shouldListenRef.current = false;
        setIsListening(false);
      } else if (event.error === 'network') {
        setSpeechError('Network notice: Chrome speech recognition cloud service is unreachable on this network. You can type directly or click "Restart Mic".');
        setIsListening(false);
      } else if (event.error === 'audio-capture') {
        setSpeechError('Audio capture notice: No microphone found or mic is currently in use by another application.');
        setIsListening(false);
      } else if (event.error === 'no-speech') {
        // Normal silence timeout; auto-restart handles it if shouldListen is true
      }
    };

    recognition.onend = () => {
      if (shouldListenRef.current) {
        // Safe delayed restart in Chromium (avoids synchronous InvalidStateError)
        if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = setTimeout(() => {
          if (shouldListenRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
              setIsListening(true);
            } catch (err) {
              if (err.name !== 'InvalidStateError') {
                console.warn('Speech restart throttled:', err.message);
              }
            }
          }
        }, 250);
      } else {
        setIsListening(false);
        if (onEnd) onEnd();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      shouldListenRef.current = false;
      if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
      try {
        recognition.abort();
      } catch (e) {
        try { recognition.stop(); } catch (_) {}
      }
    };
  }, [lang, onResult, onEnd]);

  const startListening = useCallback(() => {
    shouldListenRef.current = true;
    setSpeechError(null);
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      if (err.name === 'InvalidStateError') {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
        setTimeout(() => {
          if (shouldListenRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
              setIsListening(true);
            } catch (retryErr) {
              console.warn('Speech retry start:', retryErr.message);
            }
          }
        }, 100);
      } else {
        console.warn('Speech start error:', err);
      }
      setIsListening(true);
    }
  }, []);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (err) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    }
    setIsListening(false);
  }, []);

  const restartListening = useCallback(() => {
    shouldListenRef.current = false;
    if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (_) {}
    }
    setIsListening(false);
    setSpeechError(null);
    setTimeout(() => {
      shouldListenRef.current = true;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (err) {
          if (err.name !== 'InvalidStateError') {
            console.warn('Speech restart throttled:', err.message);
          }
          setIsListening(true);
        }
      }
    }, 250);
  }, []);

  const changeLanguage = useCallback((newLang) => {
    setLang(newLang);
    if (recognitionRef.current) {
      const wasListening = shouldListenRef.current;
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current.lang = newLang;
      if (wasListening) {
        setTimeout(() => {
          try {
            recognitionRef.current.start();
            setIsListening(true);
          } catch (e) {}
        }, 300);
      }
    }
  }, []);

  const resetTranscript = useCallback(() => {
    accumulatedTranscriptRef.current = '';
    setTranscript('');
    setInterimTranscript('');
  }, []);

  const updateTranscriptManually = useCallback((newText) => {
    accumulatedTranscriptRef.current = newText;
    setTranscript(newText);
    if (onResult) onResult(newText);
  }, [onResult]);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    speechError,
    lang,
    setLang: changeLanguage,
    startListening,
    stopListening,
    restartListening,
    resetTranscript,
    setTranscript: updateTranscriptManually
  };
}

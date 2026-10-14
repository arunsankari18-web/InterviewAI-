import { useState, useEffect, useCallback, useRef } from 'react';

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const synthRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    } else {
      setIsSupported(false);
    }
  }, []);

  const speak = useCallback((text, { onEnd, rate = 1.0, pitch = 1.0, lang = 'en-US' } = {}) => {
    if (!synthRef.current || !text) return;

    try {
      synthRef.current.cancel(); // Stop any pending utterances
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.lang = lang;

      // Select matching voice
      const voices = synthRef.current.getVoices();
      if (lang.startsWith('ta')) {
        const tamilVoice = voices.find(v => v.lang.startsWith('ta') || v.name.includes('Tamil') || v.name.includes('Valluvar'));
        if (tamilVoice) utterance.voice = tamilVoice;
      } else {
        const preferred = voices.find(v => (v.lang.startsWith('en') || v.lang.includes('IN')) && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('India')));
        if (preferred) utterance.voice = preferred;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        if (onEnd) onEnd();
      };

      synthRef.current.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
      setIsSpeaking(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isSpeaking,
    isSupported,
    speak,
    stop
  };
}

import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer({ initialSeconds = 1200, countDirection = 'down', onTimeUp } = {}) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (countDirection === 'down') {
            if (prev <= 1) {
              clearInterval(intervalRef.current);
              setIsRunning(false);
              if (onTimeUp) onTimeUp();
              return 0;
            }
            return prev - 1;
          } else {
            return prev + 1;
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, countDirection, onTimeUp]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback((newSec = initialSeconds) => {
    setIsRunning(false);
    setSeconds(newSec);
  }, [initialSeconds]);

  const formatTime = useCallback(() => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [seconds]);

  return {
    seconds,
    isRunning,
    start,
    pause,
    reset,
    formatTime
  };
}

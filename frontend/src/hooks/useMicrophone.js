import { useState, useEffect, useRef, useCallback } from 'react';

export function useMicrophone() {
  const [stream, setStream] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [error, setError] = useState(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);

  const startMicrophone = useCallback(async () => {
    setError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone device API is not supported in this browser.');
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      setStream(mediaStream);
      setHasPermission(true);

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;

      const source = audioCtx.createMediaStreamSource(mediaStream);
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setVolumeLevel(normalized);
        animFrameRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (err) {
      console.warn('Microphone access error:', err.message);
      setError(err.name === 'NotAllowedError' ? 'Microphone permission was denied.' : err.message);
      setHasPermission(false);
    }
  }, []);

  const stopMicrophone = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
      setHasPermission(false);
    }
    setVolumeLevel(0);
  }, [stream]);

  useEffect(() => {
    return () => {
      stopMicrophone();
    };
  }, [stopMicrophone]);

  return {
    stream,
    hasPermission,
    volumeLevel,
    error,
    startMicrophone,
    stopMicrophone
  };
}

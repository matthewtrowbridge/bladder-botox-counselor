import { useState, useCallback, useEffect, useRef } from 'react';

export function useSpeech() {
  const [speakingId, setSpeakingId] = useState(null);
  const utteranceRef = useRef(null);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeakingId(null);
    utteranceRef.current = null;
  }, []);

  const speak = useCallback((text, id) => {
    if (!window.speechSynthesis) return;

    // If already speaking this message, stop
    if (speakingId === id) {
      stop();
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1;

    // Prefer a natural-sounding voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) => v.lang.startsWith('en') && v.name.includes('Samantha')
    ) || voices.find(
      (v) => v.lang.startsWith('en') && v.localService
    ) || voices.find(
      (v) => v.lang.startsWith('en')
    );
    if (preferred) utterance.voice = preferred;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    utteranceRef.current = utterance;
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  }, [speakingId, stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  return { speak, stop, speakingId };
}

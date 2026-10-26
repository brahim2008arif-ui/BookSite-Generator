import { useState, useEffect, useRef, useCallback } from 'react';
import { ParagraphItem } from '../data/novelData';

export interface TTSState {
  isPlaying: boolean;
  isPaused: boolean;
  currentParagraphIndex: number;
  rate: number;
  hasVoiceSupport: boolean;
}

export function useTextToSpeech(items: ParagraphItem[]) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(-1);
  const [rate, setRate] = useState(0.95);
  const [hasVoiceSupport, setHasVoiceSupport] = useState(true);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const arabicVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  // Initialize SpeechSynthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      const pickArabicVoice = () => {
        if (!synthRef.current) return;
        const voices = synthRef.current.getVoices();
        // Look for Arabic voices
        const arVoice = voices.find(v => v.lang.startsWith('ar') || v.lang.includes('AR'));
        if (arVoice) {
          arabicVoiceRef.current = arVoice;
        }
      };

      pickArabicVoice();
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = pickArabicVoice;
      }
    } else {
      setHasVoiceSupport(false);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speakIndex = useCallback((index: number, currentRate = rate) => {
    if (!synthRef.current || index < 0 || index >= items.length) {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentParagraphIndex(-1);
      return;
    }

    const item = items[index];
    let textToSpeak = '';

    if (item.type === 'paragraph' || item.type === 'date') {
      textToSpeak = item.text || '';
    } else if (item.type === 'dialogue') {
      textToSpeak = `${item.speaker || ''}: ${item.text || ''}`;
    } else if (item.type === 'quote') {
      textToSpeak = `${item.text || ''}. قائل النص: ${item.author || ''}`;
    }

    if (!textToSpeak.trim()) {
      // skip empty items like break
      speakIndex(index + 1, currentRate);
      return;
    }

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'ar-SA';
    utterance.rate = currentRate;
    utterance.pitch = 0.95;

    if (arabicVoiceRef.current) {
      utterance.voice = arabicVoiceRef.current;
    }

    utterance.onend = () => {
      if (isPlayingRef.current) {
        if (index + 1 < items.length) {
          speakIndex(index + 1, currentRate);
        } else {
          setIsPlaying(false);
          setIsPaused(false);
          setCurrentParagraphIndex(-1);
        }
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentParagraphIndex(-1);
    };

    utteranceRef.current = utterance;
    setCurrentParagraphIndex(index);
    setIsPlaying(true);
    setIsPaused(false);
    synthRef.current.speak(utterance);
  }, [items, rate]);

  const play = useCallback((fromIndex = 0) => {
    if (!synthRef.current) return;
    if (isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      speakIndex(fromIndex, rate);
    }
  }, [isPaused, speakIndex, rate]);

  const pause = useCallback(() => {
    if (!synthRef.current) return;
    synthRef.current.pause();
    setIsPaused(true);
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentParagraphIndex(-1);
  }, []);

  const changeRate = useCallback((newRate: number) => {
    setRate(newRate);
    if (isPlaying && currentParagraphIndex >= 0) {
      speakIndex(currentParagraphIndex, newRate);
    }
  }, [isPlaying, currentParagraphIndex, speakIndex]);

  return {
    isPlaying,
    isPaused,
    currentParagraphIndex,
    rate,
    hasVoiceSupport,
    play,
    pause,
    stop,
    changeRate,
    speakParagraph: speakIndex
  };
}

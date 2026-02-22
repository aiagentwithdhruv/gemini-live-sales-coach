import { useCallback, useRef } from 'react';

const OUTPUT_SAMPLE_RATE = 24000; // Gemini outputs 24kHz PCM

/**
 * Plays raw PCM audio chunks received from Gemini Live API.
 * Used in practice mode where the AI prospect speaks back.
 */
export function useAudioPlayback() {
  const contextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);

  const getContext = useCallback(() => {
    if (!contextRef.current || contextRef.current.state === 'closed') {
      contextRef.current = new AudioContext({ sampleRate: OUTPUT_SAMPLE_RATE });
      nextStartTimeRef.current = 0;
    }
    return contextRef.current;
  }, []);

  const playChunk = useCallback(
    (base64Pcm: string) => {
      const ctx = getContext();

      // Decode base64 to Int16 PCM bytes
      const binary = atob(base64Pcm);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      // Convert Int16 PCM to Float32 for Web Audio API
      const int16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768;
      }

      // Create audio buffer and schedule playback
      const buffer = ctx.createBuffer(1, float32.length, OUTPUT_SAMPLE_RATE);
      buffer.getChannelData(0).set(float32);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);

      // Schedule seamless playback — queue chunks back-to-back
      const now = ctx.currentTime;
      const startAt = Math.max(now, nextStartTimeRef.current);
      source.start(startAt);
      nextStartTimeRef.current = startAt + buffer.duration;
    },
    [getContext]
  );

  const stop = useCallback(() => {
    if (contextRef.current && contextRef.current.state !== 'closed') {
      contextRef.current.close();
    }
    contextRef.current = null;
    nextStartTimeRef.current = 0;
  }, []);

  return { playChunk, stop };
}

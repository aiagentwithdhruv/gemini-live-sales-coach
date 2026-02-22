import { useCallback, useRef, useState } from 'react';

const SAMPLE_RATE = 16000; // Gemini expects 16kHz
const CHUNK_SIZE = 4096;

export function useAudioStream() {
  const [isRecording, setIsRecording] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const onChunkRef = useRef<((base64: string) => void) | null>(null);

  const startRecording = useCallback(async (onChunk: (base64: string) => void) => {
    try {
      onChunkRef.current = onChunk;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: SAMPLE_RATE,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      streamRef.current = stream;

      const audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });
      contextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(CHUNK_SIZE, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (event) => {
        const float32 = event.inputBuffer.getChannelData(0);
        // Convert Float32 to Int16 PCM
        const int16 = new Int16Array(float32.length);
        for (let i = 0; i < float32.length; i++) {
          const s = Math.max(-1, Math.min(1, float32[i]));
          int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }
        // Convert to base64
        const bytes = new Uint8Array(int16.buffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);
        onChunkRef.current?.(base64);
      };

      source.connect(processor);
      processor.connect(audioContext.destination);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start audio recording:', err);
      throw err;
    }
  }, []);

  const stopRecording = useCallback(() => {
    processorRef.current?.disconnect();
    contextRef.current?.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    processorRef.current = null;
    contextRef.current = null;
    streamRef.current = null;
    onChunkRef.current = null;
    setIsRecording(false);
  }, []);

  return { isRecording, startRecording, stopRecording };
}

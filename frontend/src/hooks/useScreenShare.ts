import { useCallback, useRef, useState } from 'react';

const CAPTURE_INTERVAL = 3000; // Capture a frame every 3 seconds
const MAX_WIDTH = 1024;
const MAX_HEIGHT = 768;

export function useScreenShare() {
  const [isSharing, setIsSharing] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const onFrameRef = useRef<((base64: string) => void) | null>(null);

  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;

    const canvas = document.createElement('canvas');
    const scale = Math.min(MAX_WIDTH / video.videoWidth, MAX_HEIGHT / video.videoHeight, 1);
    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
    const base64 = dataUrl.split(',')[1];
    onFrameRef.current?.(base64);
  }, []);

  const startSharing = useCallback(async (onFrame: (base64: string) => void) => {
    try {
      onFrameRef.current = onFrame;

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: MAX_WIDTH, height: MAX_HEIGHT },
        audio: false,
      });
      streamRef.current = stream;

      // Create hidden video element to capture frames
      const video = document.createElement('video');
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;
      await video.play();
      videoRef.current = video;

      // Handle user stopping the share via browser UI
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        stopSharing();
      });

      // Start capturing frames
      intervalRef.current = setInterval(captureFrame, CAPTURE_INTERVAL);
      setIsSharing(true);
    } catch (err) {
      console.error('Failed to start screen sharing:', err);
      throw err;
    }
  }, [captureFrame]);

  const stopSharing = useCallback(() => {
    clearInterval(intervalRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    videoRef.current?.remove();
    streamRef.current = null;
    videoRef.current = null;
    onFrameRef.current = null;
    setIsSharing(false);
  }, []);

  return { isSharing, startSharing, stopSharing };
}

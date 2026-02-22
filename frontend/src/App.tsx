import { useCallback } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import { useAudioStream } from './hooks/useAudioStream';
import { useScreenShare } from './hooks/useScreenShare';
import { useCallMetrics } from './hooks/useCallMetrics';
import { CallControls } from './components/CallControls';
import { CoachingPanel } from './components/CoachingPanel';
import { ScoreCard } from './components/ScoreCard';
import { ObjectionTracker } from './components/ObjectionTracker';
import { SentimentGauge } from './components/SentimentGauge';
import { KeyMoments } from './components/KeyMoments';
import type { CallMode } from './lib/types';

function App() {
  const { state, startCall, endCall, setConnected, handleServerMessage } =
    useCallMetrics();

  const { isConnected, connect, send } = useWebSocket({
    onMessage: handleServerMessage,
    onConnect: () => setConnected(true),
    onDisconnect: () => setConnected(false),
  });

  const { isRecording, startRecording, stopRecording } = useAudioStream();
  const { isSharing, startSharing, stopSharing } = useScreenShare();

  const handleStartCall = useCallback(
    async (mode: CallMode) => {
      startCall(mode);
      send({ type: 'config', mode });

      // Start audio capture
      await startRecording((base64) => {
        send({ type: 'audio', data: base64 });
      });

      // Send initial coaching prompt
      send({
        type: 'text',
        text:
          mode === 'live'
            ? 'A live sales call is starting. Listen to the audio and provide real-time coaching. Start by sending an initial dashboard update with a welcome message.'
            : 'A practice sales session is starting. The user will role-play a sales call. Coach them in real-time.',
      });
    },
    [startCall, startRecording, send]
  );

  const handleEndCall = useCallback(() => {
    stopRecording();
    stopSharing();
    send({ type: 'end' });
    endCall();
  }, [stopRecording, stopSharing, send, endCall]);

  const handleToggleScreenShare = useCallback(async () => {
    if (isSharing) {
      stopSharing();
    } else {
      await startSharing((base64) => {
        send({ type: 'image', data: base64 });
      });
    }
  }, [isSharing, startSharing, stopSharing, send]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold">Live Sales Coach</h1>
              <p className="text-xs text-gray-500">
                Powered by Gemini Live API
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-600">
            Built by{' '}
            <a
              href="https://linkedin.com/in/aiwithdhruv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-500 hover:text-cyan-400"
            >
              AIwithDhruv
            </a>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column -- Coaching */}
          <div className="lg:col-span-2 space-y-6">
            <CoachingPanel tips={state.coachingTips} />
            <ObjectionTracker objections={state.objections} />
            <KeyMoments moments={state.keyMoments} />
          </div>

          {/* Right Column -- Metrics & Controls */}
          <div className="space-y-6">
            <CallControls
              isConnected={isConnected}
              isCallActive={state.isCallActive}
              isRecording={isRecording}
              isSharing={isSharing}
              mode={state.mode}
              onConnect={connect}
              onStartCall={handleStartCall}
              onEndCall={handleEndCall}
              onToggleScreenShare={handleToggleScreenShare}
            />
            <SentimentGauge
              sentiment={state.sentiment}
              talkRatio={state.talkRatio}
              callDuration={state.callDuration}
            />
            <ScoreCard scores={state.scores} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

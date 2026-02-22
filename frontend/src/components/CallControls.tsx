import type { CallMode } from '../lib/types';

interface CallControlsProps {
  isConnected: boolean;
  isCallActive: boolean;
  isRecording: boolean;
  isSharing: boolean;
  mode: CallMode;
  onConnect: () => void;
  onStartCall: (mode: CallMode) => void;
  onEndCall: () => void;
  onToggleScreenShare: () => void;
}

export function CallControls({
  isConnected,
  isCallActive,
  isRecording,
  isSharing,
  mode,
  onConnect,
  onStartCall,
  onEndCall,
  onToggleScreenShare,
}: CallControlsProps) {
  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
          Controls
        </h3>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
          />
          <span className="text-xs text-gray-500">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {!isConnected && (
          <button
            onClick={onConnect}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors"
          >
            Connect to Server
          </button>
        )}

        {isConnected && !isCallActive && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onStartCall('live')}
              className="py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors"
            >
              Live Coach
            </button>
            <button
              onClick={() => onStartCall('practice')}
              className="py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors"
            >
              Practice
            </button>
          </div>
        )}

        {isCallActive && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm text-white">
                  {mode === 'live' ? 'Live Coaching' : 'Practice Mode'}
                </span>
              </div>
              {isRecording && (
                <span className="text-xs text-green-400">Mic active</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onToggleScreenShare}
                className={`py-2 rounded-lg font-medium text-sm transition-colors ${
                  isSharing
                    ? 'bg-yellow-600 hover:bg-yellow-500 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                {isSharing ? 'Stop Share' : 'Share Screen'}
              </button>
              <button
                onClick={onEndCall}
                className="py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium text-sm transition-colors"
              >
                End Call
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

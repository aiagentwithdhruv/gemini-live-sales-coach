import { useState } from 'react';
import type { CallMode } from '../lib/types';

interface CallControlsProps {
  isConnected: boolean;
  isCallActive: boolean;
  isRecording: boolean;
  isSharing: boolean;
  mode: CallMode;
  onConnect: () => void;
  onStartCall: (mode: CallMode, persona?: string) => void;
  onEndCall: () => void;
  onToggleScreenShare: () => void;
}

const PERSONAS = [
  { id: 'sarah-startup', name: 'Sarah Chen', label: 'Easy', color: 'text-green-400' },
  { id: 'marcus-enterprise', name: 'Marcus Williams', label: 'Medium', color: 'text-yellow-400' },
  { id: 'david-gatekeeper', name: 'David Park', label: 'Medium', color: 'text-yellow-400' },
  { id: 'jennifer-skeptic', name: 'Jennifer Rodriguez', label: 'Hard', color: 'text-red-400' },
];

export function CallControls({
  isConnected,
  isCallActive,
  isRecording,
  isSharing,
  mode,
  onStartCall,
  onEndCall,
  onToggleScreenShare,
}: CallControlsProps) {
  const [selectedPersona, setSelectedPersona] = useState('sarah-startup');

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
            {isConnected ? 'Connected' : 'Ready'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {!isCallActive && (
          <>
            {/* Mode buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onStartCall('live')}
                className="py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors"
              >
                Live Coach
              </button>
              <button
                onClick={() => onStartCall('practice', selectedPersona)}
                className="py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors"
              >
                Practice
              </button>
            </div>

            {/* Persona selector for practice mode */}
            <div>
              <label className="text-xs text-gray-500 block mb-1">
                Practice Persona
              </label>
              <select
                value={selectedPersona}
                onChange={(e) => setSelectedPersona(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                {PERSONAS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.label})
                  </option>
                ))}
              </select>
            </div>
          </>
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

import { useEffect, useRef } from 'react';
import type { TranscriptEntry } from '../lib/types';

interface TranscriptPanelProps {
  entries: TranscriptEntry[];
}

export function TranscriptPanel({ entries }: TranscriptPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new entries
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
        Live Transcript
      </h3>

      <div
        ref={scrollRef}
        className="space-y-2 max-h-64 overflow-y-auto pr-2 scrollbar-thin"
      >
        {entries.length === 0 && (
          <p className="text-sm text-gray-600 italic">
            Transcript will appear here once the call starts...
          </p>
        )}

        {entries.map((entry, i) => (
          <div
            key={i}
            className={`text-sm px-3 py-2 rounded-lg ${
              entry.source === 'input'
                ? 'bg-gray-800 text-gray-300 border-l-2 border-cyan-500'
                : 'bg-gray-800/50 text-gray-400 border-l-2 border-purple-500'
            }`}
          >
            <span
              className={`text-xs font-medium ${
                entry.source === 'input' ? 'text-cyan-400' : 'text-purple-400'
              }`}
            >
              {entry.source === 'input' ? 'Rep' : 'AI/Prospect'}
            </span>
            <p className="mt-0.5">{entry.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

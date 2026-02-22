import type { Sentiment, TalkRatio } from '../lib/types';

interface SentimentGaugeProps {
  sentiment: Sentiment;
  talkRatio: TalkRatio;
  callDuration: number;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function SentimentGauge({ sentiment, talkRatio, callDuration }: SentimentGaugeProps) {
  const sentimentConfig = {
    positive: { label: 'Positive', color: 'text-green-400', bg: 'bg-green-900/30' },
    neutral: { label: 'Neutral', color: 'text-gray-400', bg: 'bg-gray-800/30' },
    negative: { label: 'Negative', color: 'text-red-400', bg: 'bg-red-900/30' },
  };

  const s = sentimentConfig[sentiment];
  const talkWarning = talkRatio.rep > 65;

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
        Call Vitals
      </h3>

      <div className="grid grid-cols-3 gap-4">
        {/* Sentiment */}
        <div className={`rounded-lg p-3 text-center ${s.bg}`}>
          <p className="text-xs text-gray-500 mb-1">Sentiment</p>
          <p className={`text-lg font-semibold ${s.color}`}>{s.label}</p>
        </div>

        {/* Duration */}
        <div className="rounded-lg p-3 text-center bg-gray-800/30">
          <p className="text-xs text-gray-500 mb-1">Duration</p>
          <p className="text-lg font-semibold text-white font-mono">
            {formatDuration(callDuration)}
          </p>
        </div>

        {/* Talk Ratio */}
        <div className={`rounded-lg p-3 text-center ${talkWarning ? 'bg-red-900/30' : 'bg-gray-800/30'}`}>
          <p className="text-xs text-gray-500 mb-1">You / Them</p>
          <p className={`text-lg font-semibold font-mono ${talkWarning ? 'text-red-400' : 'text-white'}`}>
            {talkRatio.rep}% / {talkRatio.prospect}%
          </p>
        </div>
      </div>

      {/* Talk ratio bar */}
      <div className="mt-4">
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden flex">
          <div
            className={`h-full transition-all duration-500 ${talkWarning ? 'bg-red-500' : 'bg-cyan-500'}`}
            style={{ width: `${talkRatio.rep}%` }}
          />
          <div
            className="h-full bg-gray-600 transition-all duration-500"
            style={{ width: `${talkRatio.prospect}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">You</span>
          <span className="text-xs text-gray-500">Prospect</span>
        </div>
        {talkWarning && (
          <p className="text-xs text-red-400 mt-2 text-center">
            You're talking too much. Ask a question!
          </p>
        )}
      </div>
    </div>
  );
}

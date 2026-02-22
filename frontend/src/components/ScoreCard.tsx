import type { Scores } from '../lib/types';

interface ScoreCardProps {
  scores: Scores;
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color =
    value >= 70 ? 'bg-green-500' : value >= 40 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-mono">{value}</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function ScoreCard({ scores }: ScoreCardProps) {
  const avg = Math.round(
    (scores.discovery + scores.rapport + scores.objection + scores.nextSteps) / 4
  );

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
          Performance
        </h3>
        <span className="text-2xl font-bold text-white font-mono">{avg}</span>
      </div>
      <div className="space-y-3">
        <ScoreBar label="Discovery" value={scores.discovery} />
        <ScoreBar label="Rapport" value={scores.rapport} />
        <ScoreBar label="Objection Handling" value={scores.objection} />
        <ScoreBar label="Next Steps" value={scores.nextSteps} />
      </div>
    </div>
  );
}

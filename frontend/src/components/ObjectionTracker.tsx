import type { Objection, ObjectionType } from '../lib/types';

interface ObjectionTrackerProps {
  objections: Objection[];
}

const OBJECTION_LABELS: Record<ObjectionType, { name: string; color: string }> = {
  price: { name: 'Price', color: 'bg-red-900/50 text-red-300 border-red-700/50' },
  timing: { name: 'Timing', color: 'bg-orange-900/50 text-orange-300 border-orange-700/50' },
  authority: { name: 'Authority', color: 'bg-purple-900/50 text-purple-300 border-purple-700/50' },
  need: { name: 'Need', color: 'bg-blue-900/50 text-blue-300 border-blue-700/50' },
  trust: { name: 'Trust', color: 'bg-yellow-900/50 text-yellow-300 border-yellow-700/50' },
  competitor: { name: 'Competitor', color: 'bg-pink-900/50 text-pink-300 border-pink-700/50' },
  contract: { name: 'Contract', color: 'bg-indigo-900/50 text-indigo-300 border-indigo-700/50' },
  custom: { name: 'Custom', color: 'bg-gray-800/50 text-gray-300 border-gray-700/50' },
};

export function ObjectionTracker({ objections }: ObjectionTrackerProps) {
  // Count objections by type
  const counts = objections.reduce(
    (acc, obj) => {
      acc[obj.type] = (acc[obj.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
          Objections
        </h3>
        <span className="text-lg font-bold text-white font-mono">{objections.length}</span>
      </div>

      {/* Objection type counters */}
      {Object.keys(counts).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(counts).map(([type, count]) => {
            const label = OBJECTION_LABELS[type as ObjectionType];
            return (
              <span
                key={type}
                className={`px-2 py-1 rounded text-xs border ${label.color}`}
              >
                {label.name} ({count})
              </span>
            );
          })}
        </div>
      )}

      {/* Recent objections with responses */}
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {objections.length === 0 ? (
          <p className="text-gray-600 text-sm italic">No objections detected yet.</p>
        ) : (
          [...objections].reverse().map((obj, i) => (
            <div key={i} className="border-l-2 border-cyan-600 pl-3">
              <p className="text-xs text-gray-500 mb-1">
                {OBJECTION_LABELS[obj.type].name}
              </p>
              <p className="text-sm text-gray-300 mb-1">"{obj.text}"</p>
              <p className="text-sm text-cyan-300">
                Say: "{obj.suggestedResponse}"
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

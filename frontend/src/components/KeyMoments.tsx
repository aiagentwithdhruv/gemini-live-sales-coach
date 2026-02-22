import type { KeyMoment } from '../lib/types';

interface KeyMomentsProps {
  moments: KeyMoment[];
}

export function KeyMoments({ moments }: KeyMomentsProps) {
  const typeConfig = {
    positive: { color: 'border-green-600', dot: 'bg-green-500', text: 'text-green-300' },
    warning: { color: 'border-yellow-600', dot: 'bg-yellow-500', text: 'text-yellow-300' },
    objection: { color: 'border-red-600', dot: 'bg-red-500', text: 'text-red-300' },
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
        Key Moments
      </h3>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {moments.length === 0 ? (
          <p className="text-gray-600 text-sm italic">Key moments will appear as the call progresses.</p>
        ) : (
          moments.map((moment, i) => {
            const config = typeConfig[moment.type];
            return (
              <div key={i} className={`flex items-start gap-2 border-l-2 pl-3 ${config.color}`}>
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${config.dot}`} />
                <p className={`text-sm ${config.text}`}>{moment.text}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

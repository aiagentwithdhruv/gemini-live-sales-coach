interface CoachingPanelProps {
  tips: string[];
}

export function CoachingPanel({ tips }: CoachingPanelProps) {
  if (tips.length === 0) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
          Coach Tips
        </h3>
        <p className="text-gray-600 text-sm italic">
          Listening to the conversation... Tips will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
        Coach Tips
      </h3>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {tips.map((tip, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg text-sm ${
              i === 0
                ? 'bg-cyan-900/40 border border-cyan-700/50 text-cyan-100'
                : 'bg-gray-800/50 text-gray-300'
            }`}
          >
            {tip}
          </div>
        ))}
      </div>
    </div>
  );
}

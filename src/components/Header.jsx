export default function Header({ showRestart, onRestart, fontSizeLabel, onCycleFont }) {
  return (
    <header className="bg-offwhite border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">🌿</span>
        <div>
          <h1 className="text-lg font-semibold text-warmgray leading-tight">
            Bladder Health Guide
          </h1>
          <p className="text-sm text-gray-500 leading-tight">
            Dr. Trowbridge's Practice
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Font size toggle */}
        {onCycleFont && (
          <button
            onClick={onCycleFont}
            className="text-sm px-2.5 py-1.5 rounded-lg border border-gray-300 text-gray-500 hover:text-warmgray hover:border-gray-400 transition-colors font-semibold"
            aria-label="Change text size"
            title="Change text size"
          >
            {fontSizeLabel || 'A'}
          </button>
        )}

        {showRestart && (
          <button
            onClick={onRestart}
            className="text-sm text-gray-400 hover:text-warmgray transition-colors"
            aria-label="Start new conversation"
          >
            Start over
          </button>
        )}
      </div>
    </header>
  );
}

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

      <div className="flex items-center gap-2">
        {onCycleFont && (
          <button
            onClick={onCycleFont}
            className="btn-compact text-sm px-3 py-2 rounded-lg border border-gray-300 text-gray-500 hover:text-warmgray hover:border-gray-400 transition-colors font-semibold flex items-center justify-center"
            aria-label={`Text size: ${fontSizeLabel}. Tap to change.`}
          >
            {fontSizeLabel || 'A'}
          </button>
        )}

        {showRestart && (
          <button
            onClick={onRestart}
            className="btn-compact text-sm px-3 py-2 text-gray-400 hover:text-warmgray transition-colors flex items-center justify-center"
            aria-label="Start new conversation"
          >
            Start over
          </button>
        )}
      </div>
    </header>
  );
}

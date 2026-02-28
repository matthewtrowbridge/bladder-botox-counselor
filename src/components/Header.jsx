export default function Header({ showRestart, onRestart }) {
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
      {showRestart && (
        <button
          onClick={onRestart}
          className="text-sm text-gray-400 hover:text-warmgray transition-colors"
          aria-label="Start new conversation"
        >
          Start over
        </button>
      )}
    </header>
  );
}

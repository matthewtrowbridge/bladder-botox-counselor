export default function QuickReplies({ replies, onSelect, disabled }) {
  if (!replies || replies.length === 0) return null;

  return (
    <div
      role="group"
      aria-label="Suggested responses"
      className="flex flex-wrap gap-2 px-4 py-2"
    >
      {replies.map((text) => (
        <button
          key={text}
          onClick={() => onSelect(text)}
          disabled={disabled}
          aria-label={`Send: ${text}`}
          className="chip-hover px-4 py-2.5 bg-white border border-gray-300 rounded-full text-sm text-warmgray disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {text}
        </button>
      ))}
    </div>
  );
}

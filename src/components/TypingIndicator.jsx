export default function TypingIndicator() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Assistant is typing"
      className="flex items-start gap-2 message-enter"
    >
      <div className="bg-bubble rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5" aria-hidden="true">
        <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full inline-block" />
        <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full inline-block" />
        <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full inline-block" />
      </div>
    </div>
  );
}

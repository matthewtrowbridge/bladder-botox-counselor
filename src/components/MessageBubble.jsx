export default function MessageBubble({ role, content }) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} message-enter`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 text-[17px] leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-teal text-white rounded-2xl rounded-br-sm'
            : 'bg-bubble text-warmgray rounded-2xl rounded-bl-sm'
        }`}
      >
        {content}
      </div>
    </div>
  );
}

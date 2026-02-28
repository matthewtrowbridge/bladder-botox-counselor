import { useRef, useEffect, useState } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import QuickReplies from './QuickReplies';
import PrivacyNotice from './PrivacyNotice';
import { useSpeech } from '../hooks/useSpeech';

export default function ChatWindow({
  messages,
  isLoading,
  quickReplies,
  onSend,
  onQuickReply,
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const { speak, speakingId } = useSpeech();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    onSend(text);
    setInput('');
  };

  const handleRephrase = (originalText, mode) => {
    const prompts = {
      simpler: `Can you explain this in simpler words? Here's what you said: "${originalText.slice(0, 200)}"`,
      list: `Can you turn that into a short bullet-point list? Here's what you said: "${originalText.slice(0, 200)}"`,
      child: `Can you explain that like you would to a child? Here's what you said: "${originalText.slice(0, 200)}"`,
    };
    onSend(prompts[mode] || `Can you explain that differently?`);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto chat-scroll px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            role={msg.role}
            content={msg.content}
            index={i}
            speakingId={speakingId}
            onSpeak={speak}
            onRephrase={handleRephrase}
          />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick replies */}
      <QuickReplies
        replies={quickReplies}
        onSelect={onQuickReply}
        disabled={isLoading}
      />

      {/* Input */}
      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-warmgray placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent disabled:opacity-50"
            style={{ fontSize: 'var(--chat-font-size, 17px)' }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-3 bg-teal text-white rounded-xl font-medium hover:bg-teal-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
            </svg>
          </button>
        </form>
        <div className="mt-2">
          <PrivacyNotice />
        </div>
      </div>
    </div>
  );
}

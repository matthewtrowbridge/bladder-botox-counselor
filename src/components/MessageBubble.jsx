import { useState } from 'react';
import RiskPictograph, { detectRiskStats } from './RiskPictograph';
import ProcedureTimeline, { shouldShowTimeline } from './ProcedureTimeline';
import TreatmentCards, { shouldShowTreatmentCards } from './TreatmentCards';

export default function MessageBubble({ role, content, index, speakingId, onSpeak, onRephrase }) {
  const isUser = role === 'user';
  const isAssistant = role === 'assistant';
  const isSpeaking = speakingId === index;

  // Detect rich content for assistant messages
  const riskStats = isAssistant ? detectRiskStats(content) : [];
  const showTimeline = isAssistant && shouldShowTimeline(content);
  const showTreatments = isAssistant && shouldShowTreatmentCards(content);

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} message-enter`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-teal text-white rounded-2xl rounded-br-sm'
            : 'bg-bubble text-warmgray rounded-2xl rounded-bl-sm'
        }`}
        style={{ fontSize: 'var(--chat-font-size, 17px)' }}
      >
        {content}
      </div>

      {/* Rich visual content below assistant messages */}
      {isAssistant && content && (
        <div className="max-w-[85%] sm:max-w-[75%] w-full">
          {riskStats.map((stat) => (
            <RiskPictograph key={stat.id} {...stat} />
          ))}
          {showTimeline && <ProcedureTimeline />}
          {showTreatments && <TreatmentCards />}
        </div>
      )}

      {/* Action buttons for assistant messages */}
      {isAssistant && content && (
        <div className="flex gap-1 mt-1 ml-1">
          {/* Text-to-speech */}
          {typeof window !== 'undefined' && window.speechSynthesis && (
            <button
              onClick={() => onSpeak?.(content, index)}
              className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                isSpeaking
                  ? 'bg-teal text-white'
                  : 'text-gray-400 hover:text-teal hover:bg-gray-100'
              }`}
              aria-label={isSpeaking ? 'Stop reading' : 'Read aloud'}
            >
              {isSpeaking ? '⏹ Stop' : '🔊 Read aloud'}
            </button>
          )}

          {/* Show me another way */}
          <RephraseButton onSelect={(mode) => onRephrase?.(content, mode)} />
        </div>
      )}
    </div>
  );
}

function RephraseButton({ onSelect }) {
  const [open, setOpen] = useState(false);

  const options = [
    { label: 'Simpler words', mode: 'simpler', icon: '✏️' },
    { label: 'As a list', mode: 'list', icon: '📋' },
    { label: 'For a child to understand', mode: 'child', icon: '👶' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs px-2 py-1 rounded-lg text-gray-400 hover:text-teal hover:bg-gray-100 transition-colors"
      >
        🔄 Another way
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 bottom-full mb-1 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20 min-w-[180px]">
            {options.map((opt) => (
              <button
                key={opt.mode}
                onClick={() => {
                  onSelect(opt.mode);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-warmgray hover:bg-gray-50 flex items-center gap-2"
              >
                <span>{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

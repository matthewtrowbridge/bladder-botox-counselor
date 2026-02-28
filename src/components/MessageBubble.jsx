import { useState, useRef, useEffect } from 'react';
import RiskPictograph, { detectRiskStats } from './RiskPictograph';
import ProcedureTimeline, { shouldShowTimeline } from './ProcedureTimeline';
import TreatmentCards, { shouldShowTreatmentCards } from './TreatmentCards';

export default function MessageBubble({ role, content, index, speakingId, onSpeak, onRephrase }) {
  const isUser = role === 'user';
  const isAssistant = role === 'assistant';
  const isSpeaking = speakingId === index;

  const riskStats = isAssistant ? detectRiskStats(content) : [];
  const showTimeline = isAssistant && shouldShowTimeline(content);
  const showTreatments = isAssistant && shouldShowTreatmentCards(content);

  return (
    <div
      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} message-enter`}
      role="article"
      aria-label={isUser ? 'Your message' : 'Assistant message'}
    >
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

      {isAssistant && content && (
        <div className="max-w-[85%] sm:max-w-[75%] w-full">
          {riskStats.map((stat) => (
            <RiskPictograph key={stat.id} {...stat} />
          ))}
          {showTimeline && <ProcedureTimeline />}
          {showTreatments && <TreatmentCards />}
        </div>
      )}

      {isAssistant && content && (
        <div className="flex gap-1 mt-1 ml-1" role="toolbar" aria-label="Message actions">
          {typeof window !== 'undefined' && window.speechSynthesis && (
            <button
              onClick={() => onSpeak?.(content, index)}
              className={`btn-compact text-xs px-3 py-2 rounded-lg transition-colors ${
                isSpeaking
                  ? 'bg-teal text-white'
                  : 'text-gray-400 hover:text-teal hover:bg-gray-100'
              }`}
              aria-label={isSpeaking ? 'Stop reading aloud' : 'Read this message aloud'}
              aria-pressed={isSpeaking}
            >
              {isSpeaking ? 'Stop' : 'Read aloud'}
            </button>
          )}

          <RephraseMenu onSelect={(mode) => onRephrase?.(content, mode)} />
        </div>
      )}
    </div>
  );
}

function RephraseMenu({ onSelect }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const options = [
    { label: 'Simpler words', mode: 'simpler' },
    { label: 'As a list', mode: 'list' },
    { label: 'For a child to understand', mode: 'child' },
  ];

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  // Focus first item when menu opens
  useEffect(() => {
    if (open && menuRef.current) {
      menuRef.current.querySelector('button')?.focus();
    }
  }, [open]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="btn-compact text-xs px-3 py-2 rounded-lg text-gray-400 hover:text-teal hover:bg-gray-100 transition-colors"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Explain this another way"
      >
        Another way
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden="true" />
          <div
            ref={menuRef}
            role="menu"
            aria-label="Re-explanation options"
            className="absolute left-0 bottom-full mb-1 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-20 min-w-[200px]"
          >
            {options.map((opt) => (
              <button
                key={opt.mode}
                role="menuitem"
                onClick={() => {
                  onSelect(opt.mode);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-sm text-warmgray hover:bg-gray-50"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

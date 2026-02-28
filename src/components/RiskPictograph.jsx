import { useState } from 'react';

const PERSON_ICON = (filled) => (
  <svg viewBox="0 0 12 20" className={`w-3 h-5 ${filled ? '' : 'opacity-20'}`}>
    <circle cx="6" cy="3" r="2.5" fill={filled ? 'currentColor' : '#ccc'} />
    <path
      d="M3 8 C3 6.5 9 6.5 9 8 L9 13 L7.5 13 L7.5 18 L4.5 18 L4.5 13 L3 13 Z"
      fill={filled ? 'currentColor' : '#ccc'}
    />
  </svg>
);

export default function RiskPictograph({ highlighted, total = 100, label, description, color = 'text-coral' }) {
  const [expanded, setExpanded] = useState(false);

  // Render a 10x10 grid
  const rows = [];
  for (let row = 0; row < 10; row++) {
    const cols = [];
    for (let col = 0; col < 10; col++) {
      const index = row * 10 + col;
      const isFilled = index < highlighted;
      cols.push(
        <span key={index} className={isFilled ? color : 'text-gray-300'}>
          {PERSON_ICON(isFilled)}
        </span>
      );
    }
    rows.push(
      <div key={row} className="flex gap-0.5">
        {cols}
      </div>
    );
  }

  return (
    <div className="my-3 p-4 bg-white rounded-xl border border-gray-200 message-enter">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-warmgray">{label}</span>
          <span className="text-xs text-gray-400">
            {expanded ? 'Tap to hide' : 'Tap to see visual'}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-1">{description}</p>
        <div className="flex items-center gap-2 text-sm">
          <span className={`font-bold ${color}`}>{highlighted}</span>
          <span className="text-gray-400">out of {total} people</span>
        </div>
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex flex-col gap-0.5 items-center">
            {rows}
          </div>
          <div className="flex items-center gap-4 mt-3 justify-center text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <span className={color}>{PERSON_ICON(true)}</span>
              <span>Affected ({highlighted})</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-300">{PERSON_ICON(false)}</span>
              <span>Not affected ({total - highlighted})</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Detect risk statistics in a message and return pictograph configs
export function detectRiskStats(text) {
  const stats = [];
  const lower = text.toLowerCase();

  if (/5 to 9 out of 100|5-9%|5 to 9 percent|catheter/i.test(text) && /catheter|retention|empty/i.test(text)) {
    stats.push({
      id: 'catheter',
      highlighted: 7,
      label: 'Temporary Catheter Risk',
      description: 'About 5 to 9 out of 100 people may temporarily need help emptying their bladder.',
      color: 'text-coral',
    });
  }

  if (/18.?24|18 to 24|uti|urinary tract infection/i.test(text) && /risk|chance|percent|out of/i.test(lower)) {
    stats.push({
      id: 'uti',
      highlighted: 21,
      label: 'UTI Risk',
      description: 'About 18 to 24 out of 100 people may get a UTI (only slightly more than without treatment).',
      color: 'text-coral',
    });
  }

  if (/60.?75|60 to 75/i.test(text) && /improv|work|effective|better/i.test(lower)) {
    stats.push({
      id: 'efficacy',
      highlighted: 68,
      label: 'How Well It Works',
      description: 'About 60 to 75 out of 100 people see a big improvement in their symptoms.',
      color: 'text-teal',
    });
  }

  if (/(less than |<)3|rare.*3/i.test(text) && /systemic|body|weakness|flu/i.test(lower)) {
    stats.push({
      id: 'systemic',
      highlighted: 3,
      label: 'Systemic Effects',
      description: 'Fewer than 3 out of 100 people experience temporary body-wide effects.',
      color: 'text-coral',
    });
  }

  return stats;
}

import { useState } from 'react';

const TREATMENTS = [
  {
    name: 'Bladder Botox',
    icon: '💉',
    tagline: 'Office procedure, quick visit',
    efficacy: '60-75%',
    efficacyBar: 68,
    highlights: [
      { label: 'Time', value: '5 min procedure, 1 hr visit' },
      { label: 'How invasive', value: 'Small tube, bladder numbed' },
      { label: 'Lasts', value: '6-12 months, then repeat' },
      { label: 'Main risk', value: 'Temp catheter use (5-9 in 100)' },
      { label: 'Recovery', value: 'Same day, normal activities' },
    ],
    color: 'border-teal',
    bgColor: 'bg-teal',
  },
  {
    name: 'Nerve Stimulation (SNM)',
    icon: '⚡',
    tagline: 'Implanted device, longer-lasting',
    efficacy: '70-85%',
    efficacyBar: 78,
    highlights: [
      { label: 'Time', value: 'Minor surgery + follow-ups' },
      { label: 'How invasive', value: 'Implanted device (most invasive)' },
      { label: 'Lasts', value: 'Years (battery replacement)' },
      { label: 'Main risk', value: 'Surgery risks, device issues' },
      { label: 'Recovery', value: 'A few days' },
    ],
    color: 'border-coral',
    bgColor: 'bg-coral',
  },
  {
    name: 'Ankle Nerve Therapy (PTNS)',
    icon: '🦶',
    tagline: 'Gentle, ongoing sessions',
    efficacy: '55-60%',
    efficacyBar: 58,
    highlights: [
      { label: 'Time', value: 'Weekly for 3 months, then monthly' },
      { label: 'How invasive', value: 'Small needle near ankle (least invasive)' },
      { label: 'Lasts', value: 'Ongoing sessions needed' },
      { label: 'Main risk', value: 'Minimal' },
      { label: 'Recovery', value: 'Immediate' },
    ],
    color: 'border-gray-400',
    bgColor: 'bg-gray-500',
  },
];

function TreatmentCard({ treatment }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`bg-white rounded-xl border-2 ${treatment.color} overflow-hidden transition-all`}
      role="group"
      aria-label={`${treatment.name}: ${treatment.efficacy} effective`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 min-h-0"
        aria-expanded={expanded}
        aria-label={`${treatment.name} — ${treatment.tagline}. ${expanded ? 'Collapse' : 'Expand'} details.`}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl" aria-hidden="true">{treatment.icon}</span>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-warmgray">{treatment.name}</h4>
            <p className="text-xs text-gray-500">{treatment.tagline}</p>
          </div>
          <span className="text-xs text-gray-400" aria-hidden="true">
            {expanded ? '▲' : '▼'}
          </span>
        </div>

        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">How well it works</span>
            <span className="font-semibold text-warmgray">{treatment.efficacy}</span>
          </div>
          <div
            className="w-full bg-gray-100 rounded-full h-2.5"
            role="progressbar"
            aria-valuenow={treatment.efficacyBar}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Effectiveness: ${treatment.efficacy}`}
          >
            <div
              className={`h-2.5 rounded-full ${treatment.bgColor} transition-all duration-500`}
              style={{ width: `${treatment.efficacyBar}%` }}
            />
          </div>
        </div>
      </button>

      {expanded && (
        <dl className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-2">
          {treatment.highlights.map((h) => (
            <div key={h.label} className="flex gap-2 text-sm">
              <dt className="text-gray-500 font-medium shrink-0 w-24">{h.label}</dt>
              <dd className="text-warmgray m-0">{h.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

export default function TreatmentCards() {
  return (
    <div className="my-3 space-y-2 message-enter" role="region" aria-label="Treatment comparison">
      <h3 className="text-sm font-semibold text-warmgray px-1 mb-2">
        Your Treatment Options — tap to compare
      </h3>
      {TREATMENTS.map((t) => (
        <TreatmentCard key={t.name} treatment={t} />
      ))}
      <p className="text-xs text-gray-500 text-center pt-1">
        None is clearly best — it depends on what matters most to you.
        Dr. Trowbridge can help you decide.
      </p>
    </div>
  );
}

export function shouldShowTreatmentCards(text) {
  return /three (main )?(option|approach|treatment)|compare|side by side|all.*(option|treatment)|other option|PTNS.*SNM|SNM.*PTNS|botox.*nerve|three.*advanced/i.test(text);
}

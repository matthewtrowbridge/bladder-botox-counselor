const STEPS = [
  {
    icon: '🏥',
    title: 'Arrive',
    time: '',
    desc: 'Check in at the office. No hospital needed.',
  },
  {
    icon: '💧',
    title: 'Numbing',
    time: '~20-30 min',
    desc: 'Medicine is placed in your bladder to numb it. You wait while it works.',
  },
  {
    icon: '⚡',
    title: 'Procedure',
    time: '~5 min',
    desc: 'A thin tube goes in and small amounts of Botox are placed in the bladder wall.',
  },
  {
    icon: '☕',
    title: 'Brief Wait',
    time: '~15 min',
    desc: 'You rest for a short time to make sure everything is okay.',
  },
  {
    icon: '🚗',
    title: 'Go Home',
    time: '',
    desc: 'Most people drive themselves home and go back to normal activities.',
  },
];

export default function ProcedureTimeline() {
  return (
    <div
      className="my-3 p-4 bg-white rounded-xl border border-gray-200 message-enter"
      role="figure"
      aria-label="Procedure day timeline: 5 steps from arrival to going home"
    >
      <h3 className="text-sm font-semibold text-warmgray mb-4">
        What Happens on Procedure Day
      </h3>

      <ol className="relative list-none m-0 p-0">
        {/* Vertical connector line */}
        <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-gray-200" aria-hidden="true" />

        {STEPS.map((step, i) => (
          <li key={i} className="flex gap-3 relative mb-4 last:mb-0">
            <div className="w-10 h-10 rounded-full bg-offwhite border-2 border-gray-200 flex items-center justify-center text-lg z-10 shrink-0" aria-hidden="true">
              {step.icon}
            </div>

            <div className="flex-1 pb-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-warmgray">
                  {step.title}
                </span>
                {step.time && (
                  <span className="text-xs text-teal font-medium">
                    {step.time}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 leading-snug mt-0.5">
                {step.desc}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-4 pt-3 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-500">
          Total visit: about 1 hour &middot; Procedure itself: about 5 minutes
        </p>
      </div>
    </div>
  );
}

export function shouldShowTimeline(text) {
  return /step.by.step|what happens|walk.*(me|you).*through|procedure day|how.*done|what.*expect|what.*like/i.test(text);
}

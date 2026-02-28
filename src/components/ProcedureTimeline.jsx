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
    <div className="my-3 p-4 bg-white rounded-xl border border-gray-200 message-enter">
      <h3 className="text-sm font-semibold text-warmgray mb-4">
        What Happens on Procedure Day
      </h3>

      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-gray-200" />

        <div className="space-y-4">
          {STEPS.map((step, i) => (
            <div key={i} className="flex gap-3 relative">
              {/* Icon circle */}
              <div className="w-10 h-10 rounded-full bg-offwhite border-2 border-gray-200 flex items-center justify-center text-lg z-10 shrink-0">
                {step.icon}
              </div>

              {/* Content */}
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
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400">
          Total visit: about 1 hour &middot; Procedure itself: about 5 minutes
        </p>
      </div>
    </div>
  );
}

// Detect when the procedure timeline should show
export function shouldShowTimeline(text) {
  return /step.by.step|what happens|walk.*(me|you).*through|procedure day|how.*done|what.*expect|what.*like/i.test(text);
}

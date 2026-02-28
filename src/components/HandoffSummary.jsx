import { useState, useRef } from 'react';

function SummaryCard({ title, subtitle, icon, content, accentClass }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
      <div className={`px-6 py-4 ${accentClass}`}>
        <div className="flex items-center gap-2 text-white">
          <span className="text-xl" aria-hidden="true">{icon}</span>
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm opacity-80">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 text-[15px] text-warmgray leading-relaxed whitespace-pre-wrap">
        {content}
      </div>

      <div className="no-print px-6 py-4 border-t border-gray-100 flex gap-3">
        <button
          onClick={handleCopy}
          className="flex-1 py-3 px-4 bg-gray-100 text-warmgray rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          aria-label="Copy summary to clipboard"
        >
          {copied ? (
            <span role="status" aria-live="polite">Copied!</span>
          ) : (
            'Copy'
          )}
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 py-3 px-4 bg-gray-100 text-warmgray rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          aria-label="Print summary"
        >
          Print
        </button>
      </div>
    </div>
  );
}

export default function HandoffSummary({ providerSummary, patientSummary, onBack, onRestart }) {
  const [tab, setTab] = useState('patient');
  const patientTabRef = useRef(null);
  const providerTabRef = useRef(null);

  const handleTabKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const next = tab === 'patient' ? 'provider' : 'patient';
      setTab(next);
      (next === 'patient' ? patientTabRef : providerTabRef).current?.focus();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-6 overflow-y-auto chat-scroll">
      {/* Accessible tab switcher */}
      <div
        className="no-print flex gap-1 bg-gray-100 rounded-xl p-1 mb-5 max-w-lg w-full"
        role="tablist"
        aria-label="Summary views"
      >
        <button
          ref={patientTabRef}
          role="tab"
          id="tab-patient"
          aria-selected={tab === 'patient'}
          aria-controls="panel-patient"
          tabIndex={tab === 'patient' ? 0 : -1}
          onClick={() => setTab('patient')}
          onKeyDown={handleTabKeyDown}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
            tab === 'patient' ? 'bg-white text-warmgray shadow-sm' : 'text-gray-500'
          }`}
        >
          Your Summary
        </button>
        <button
          ref={providerTabRef}
          role="tab"
          id="tab-provider"
          aria-selected={tab === 'provider'}
          aria-controls="panel-provider"
          tabIndex={tab === 'provider' ? 0 : -1}
          onClick={() => setTab('provider')}
          onKeyDown={handleTabKeyDown}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
            tab === 'provider' ? 'bg-white text-warmgray shadow-sm' : 'text-gray-500'
          }`}
        >
          For Dr. Trowbridge
        </button>
      </div>

      <div className="handoff-summary max-w-lg w-full">
        <div
          role="tabpanel"
          id="panel-patient"
          aria-labelledby="tab-patient"
          hidden={tab !== 'patient'}
        >
          {tab === 'patient' && (
            <SummaryCard
              title="Your Visit Summary"
              subtitle="A recap of what we discussed"
              icon="📝"
              content={patientSummary}
              accentClass="bg-teal"
            />
          )}
        </div>
        <div
          role="tabpanel"
          id="panel-provider"
          aria-labelledby="tab-provider"
          hidden={tab !== 'provider'}
        >
          {tab === 'provider' && (
            <SummaryCard
              title="Visit Preparation Summary"
              subtitle="For Dr. Trowbridge"
              icon="📋"
              content={providerSummary}
              accentClass="bg-warmgray"
            />
          )}
        </div>
      </div>

      <div className="no-print mt-6 space-y-3 text-center">
        <p className="text-gray-500 text-sm">
          You're all set! Bring any questions to your appointment with Dr. Trowbridge.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onBack}
            className="text-teal text-sm font-medium hover:underline px-4 py-2"
          >
            Back to conversation
          </button>
          <button
            onClick={onRestart}
            className="text-gray-400 text-sm font-medium hover:underline px-4 py-2"
          >
            Start over
          </button>
        </div>
      </div>
    </div>
  );
}

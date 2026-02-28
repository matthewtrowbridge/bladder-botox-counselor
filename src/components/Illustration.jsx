import { useState } from 'react';

export default function Illustration({ topic }) {
  const [svg, setSvg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [requested, setRequested] = useState(false);

  const generate = async () => {
    setRequested(true);
    setLoading(true);
    setError(false);

    try {
      const res = await fetch('/api/illustrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      if (!res.ok) throw new Error('Failed');

      const data = await res.json();
      setSvg(data.svg);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (!requested) {
    return (
      <button
        onClick={generate}
        className="my-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-teal font-medium hover:bg-teal hover:text-white transition-colors message-enter flex items-center gap-2"
      >
        🎨 Show me a picture of this
      </button>
    );
  }

  if (loading) {
    return (
      <div className="my-2 p-4 bg-white border border-gray-200 rounded-xl text-center message-enter">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full inline-block" />
          <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full inline-block" />
          <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full inline-block" />
          <span className="ml-2">Drawing an illustration...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-2 p-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-500 message-enter">
        Sorry, I couldn't create an illustration right now. The text explanation above still has all the information you need.
      </div>
    );
  }

  if (svg) {
    return (
      <div className="my-2 bg-white border border-gray-200 rounded-xl overflow-hidden message-enter">
        <div
          className="w-full p-4"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <p className="text-xs text-gray-400 text-center pb-3 px-4">
          Simplified illustration — not to scale. Discuss details with Dr. Trowbridge.
        </p>
      </div>
    );
  }

  return null;
}

// Topics that can be illustrated
export function getIllustrationTopic(text) {
  const lower = text.toLowerCase();

  if (/cystoscope|small tube|thin tube|camera|spaghetti/i.test(text)) {
    return 'Size comparison: a cystoscope tube next to a piece of spaghetti and a pencil, showing how thin it is. Friendly, not scary.';
  }

  if (/bladder.*numb|lidocaine|numbing|anesthetic/i.test(text)) {
    return 'How bladder numbing works: medicine gently filling the bladder to numb it, like dental numbing. Simple cross-section, friendly style.';
  }

  if (/inject|botox.*bladder|bladder.*botox|bladder wall|muscle/i.test(text) && /how|procedure|work|done/i.test(lower)) {
    return 'How bladder Botox works: simplified bladder with tiny dots showing where medicine is placed in the bladder wall to relax the muscle. Friendly, abstract style.';
  }

  if (/overactive|squeeze|bladder.*muscle|urgency|frequency/i.test(text)) {
    return 'Normal bladder vs overactive bladder: two simple bladder shapes side by side. Normal one is calm, overactive one has little lightning bolts showing unexpected squeezing. Friendly style.';
  }

  return null;
}

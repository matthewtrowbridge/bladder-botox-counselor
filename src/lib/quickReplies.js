const KEYWORD_REPLIES = [
  {
    patterns: [/risk/i, /side effect/i, /complication/i, /uti/i, /infection/i],
    replies: ["What about catheterization?", "How common are side effects?", "What if something goes wrong?"],
  },
  {
    patterns: [/catheter/i, /retention/i, /emptying/i],
    replies: ["How long would I need it?", "Is it hard to learn?", "What are the chances I'd need one?"],
  },
  {
    patterns: [/option/i, /alternative/i, /other treatment/i, /compare/i, /ptns|snm|nerve/i],
    replies: ["Tell me more about Botox specifically", "Which works best?", "What's the least invasive?"],
  },
  {
    patterns: [/needle/i, /scar/i, /pain/i, /hurt/i, /afraid/i, /scared/i],
    replies: ["What does it actually feel like?", "How is the numbing done?", "Can I be sedated?"],
  },
  {
    patterns: [/how long/i, /wear off/i, /repeat/i, /last/i, /temporary/i],
    replies: ["What happens when it wears off?", "Can I keep getting it?", "What if it doesn't work?"],
  },
  {
    patterns: [/cost/i, /insurance/i, /cover/i, /pay/i, /afford/i],
    replies: ["Is it usually covered?", "What should I ask my insurance?", "Are there other costs?"],
  },
  {
    patterns: [/procedure|how.*(it|this) work/i, /what happen/i, /step/i, /walk me through/i],
    replies: ["What are the risks?", "How long does it take?", "Can I drive myself home?"],
  },
];

export function getQuickReplies(phase, messages) {
  if (phase === 'welcome') return [];

  if (phase === 'summary') {
    return ["I want to keep asking questions"];
  }

  const messageCount = messages.length;

  // For early conversation, offer broad entry points
  if (messageCount <= 3) {
    return [
      "Tell me more about how it works",
      "What are the risks?",
      "What are my other options?",
      "I'm worried about needles",
    ];
  }

  // Scan the last assistant message for keyword-matched replies
  const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant');
  if (lastAssistant) {
    for (const { patterns, replies } of KEYWORD_REPLIES) {
      if (patterns.some((p) => p.test(lastAssistant.content))) {
        const result = [...replies];
        if (messageCount > 6) {
          result.push("Show me a summary for my doctor");
        }
        return result;
      }
    }
  }

  // Default mid-conversation
  const defaults = [
    "Tell me more",
    "What about side effects?",
    "What are my other options?",
  ];
  if (messageCount > 6) {
    defaults.push("Show me a summary for my doctor");
  }
  return defaults;
}

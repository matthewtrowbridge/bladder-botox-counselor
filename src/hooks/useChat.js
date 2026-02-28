import { useState, useCallback, useRef } from 'react';
import { getQuickReplies } from '../lib/quickReplies';

const WELCOME_MESSAGES = {
  patient: "Hi there! I'm here to help you learn about a bladder treatment that Dr. Trowbridge has suggested. There's no rush — take your time, and ask me anything.\n\nWhat have you heard so far about treatments for bladder problems?",
  caregiver: "Hi! I'm glad you're helping someone learn about this — that support really makes a difference. I'll explain everything in a way that's easy to share.\n\nWhat has the person you're helping told you about their bladder symptoms so far?",
};

const ROLE_CONTEXT = {
  patient: 'The user is the patient themselves. They selected "I\'m the patient" when starting.',
  caregiver: 'The user is a caregiver or family member helping a patient learn. They selected "I\'m helping someone learn about this" when starting.',
};

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [phase, setPhase] = useState('welcome');
  const [userRole, setUserRole] = useState(null);
  const sessionStart = useRef(null);

  const quickReplies = getQuickReplies(phase, messages);

  const startChat = useCallback((role) => {
    setUserRole(role);
    setPhase('chat');
    setMessages([{ role: 'assistant', content: WELCOME_MESSAGES[role] }]);
    sessionStart.current = Date.now();
  }, []);

  const resetChat = useCallback(() => {
    setMessages([]);
    setIsLoading(false);
    setPhase('welcome');
    setUserRole(null);
    sessionStart.current = null;
  }, []);

  // Build API messages with role context prepended
  const buildApiMessages = useCallback((msgs) => {
    if (!userRole) return msgs;
    return [
      { role: 'user', content: `[Context: ${ROLE_CONTEXT[userRole]}]` },
      { role: 'assistant', content: 'Understood. I\'ll adapt my approach accordingly.' },
      ...msgs,
    ];
  }, [userRole]);

  const sendMessage = useCallback(async (text) => {
    const userMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: buildApiMessages(updatedMessages) }),
      });

      if (!res.ok) throw new Error('API request failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              assistantText += parsed.text;
              const currentText = assistantText;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: 'assistant',
                  content: currentText,
                };
                return updated;
              });
            }
          } catch {
            // Skip malformed lines
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, buildApiMessages]);

  const generateHandoff = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/handoff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          role: userRole,
          sessionDuration: sessionStart.current
            ? Math.round((Date.now() - sessionStart.current) / 1000)
            : null,
        }),
      });

      if (!res.ok) throw new Error('Handoff request failed');

      const data = await res.json();
      setPhase('summary');
      return data;
    } catch (error) {
      console.error('Handoff error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [messages, userRole]);

  const backToChat = useCallback(() => {
    setPhase('chat');
  }, []);

  return {
    messages,
    isLoading,
    phase,
    userRole,
    quickReplies,
    startChat,
    sendMessage,
    generateHandoff,
    backToChat,
    resetChat,
    sessionStart,
  };
}

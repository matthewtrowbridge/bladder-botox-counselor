import Anthropic from '@anthropic-ai/sdk';
import { HANDOFF_PROMPT, PATIENT_SUMMARY_PROMPT } from '../src/lib/systemPrompt.js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, role, sessionDuration } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  try {
    const conversationText = messages
      .map((m) => `${m.role === 'user' ? 'Patient' : 'Educator'}: ${m.content}`)
      .join('\n\n');

    const meta = [
      `User role: ${role || 'unknown'}`,
      `Message count: ${messages.length}`,
      sessionDuration ? `Session duration: ${sessionDuration} seconds` : null,
    ].filter(Boolean).join('\n');

    const input = `${meta}\n\nConversation:\n\n${conversationText}`;

    // Generate both summaries in parallel
    const [providerRes, patientRes] = await Promise.all([
      client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1024,
        system: HANDOFF_PROMPT,
        messages: [{ role: 'user', content: input }],
      }),
      client.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 512,
        system: PATIENT_SUMMARY_PROMPT,
        messages: [{ role: 'user', content: input }],
      }),
    ]);

    res.status(200).json({
      providerSummary: providerRes.content[0]?.text || 'Unable to generate summary.',
      patientSummary: patientRes.content[0]?.text || 'Unable to generate summary.',
    });
  } catch (error) {
    console.error('Handoff API error:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
}

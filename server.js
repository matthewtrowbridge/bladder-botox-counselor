import 'dotenv/config';
import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT, HANDOFF_PROMPT, PATIENT_SUMMARY_PROMPT } from './src/lib/systemPrompt.js';

const app = express();
app.use(express.json());

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// --- Rate limiting ---
const rateLimits = new Map();
const RATE_WINDOW = 60_000; // 1 minute
const RATE_MAX = 20; // max requests per window per IP

function rateLimit(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = rateLimits.get(ip);

  if (!entry || now - entry.start > RATE_WINDOW) {
    rateLimits.set(ip, { start: now, count: 1 });
    return next();
  }

  entry.count++;
  if (entry.count > RATE_MAX) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
  }
  next();
}

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimits) {
    if (now - entry.start > RATE_WINDOW) rateLimits.delete(ip);
  }
}, 300_000);

app.use('/api', rateLimit);

// --- Analytics logging ---
function logSession(data) {
  const entry = {
    timestamp: new Date().toISOString(),
    ...data,
  };
  console.log('[analytics]', JSON.stringify(entry));
}

// --- Chat endpoint — streaming SSE ---
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Chat API error:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate response' });
    } else {
      res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`);
      res.end();
    }
  }
});

// --- Handoff summary endpoint ---
app.post('/api/handoff', async (req, res) => {
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

    // Log analytics
    logSession({
      event: 'session_complete',
      role,
      messageCount: messages.length,
      sessionDuration,
    });

    res.json({
      providerSummary: providerRes.content[0]?.text || 'Unable to generate summary.',
      patientSummary: patientRes.content[0]?.text || 'Unable to generate summary.',
    });
  } catch (error) {
    console.error('Handoff API error:', error.message);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

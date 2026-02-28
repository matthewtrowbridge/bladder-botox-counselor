import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ILLUSTRATION_PROMPT = `You are a medical illustrator creating simple, friendly SVG illustrations for patients learning about bladder Botox (onabotulinumtoxinA injection) for overactive bladder.

Generate a clean, simple SVG illustration based on the topic requested. Guidelines:
- Use a warm, friendly style — NOT clinical or scary
- Use soft colors: teal (#5B9A8B), coral (#E8856E), warm gray (#2D2D2D), light gray (#F0EEEB)
- Keep it simple — think infographic, not textbook
- No text labels inside the SVG (captions will be added separately)
- Size: viewBox="0 0 400 300"
- Use rounded shapes, gentle curves
- For anatomy: stylized/abstracted, not realistic
- For comparisons: use simple icons and relative sizing

Return ONLY the SVG code, nothing else. No markdown, no explanation. Just the <svg>...</svg> tag.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'topic is required' });
  }

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      system: ILLUSTRATION_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Create a simple, friendly illustration about: ${topic}`,
        },
      ],
    });

    const svg = response.content[0]?.text || '';
    res.status(200).json({ svg });
  } catch (error) {
    console.error('Illustration API error:', error);
    res.status(500).json({ error: 'Failed to generate illustration' });
  }
}

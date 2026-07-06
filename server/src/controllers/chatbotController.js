import asyncHandler from 'express-async-handler';
import { getGeminiClient } from '../config/gemini.js';

const SYSTEM_INSTRUCTIONS = `
You are the AI assistant for Avibha Consultants Private Limited, a Chartered Accountant and consulting firm.
Keep answers concise, professional, and practical.
Help with these topics only:
- Taxation
- GST
- Audit
- Accounting and bookkeeping
- ROC compliance
- Company registration
- Startup advisory
- Contact and office guidance

If the user asks for pricing, say fees depend on scope and invite them to contact the firm.
If the question is outside the firm's services, politely say you can only help with firm-related queries.
Do not claim to be a human. Do not invent legal or tax advice. Encourage professional consultation where appropriate.
`.trim();

const fallbackReplies = [
  {
    match: ['service', 'services', 'gst', 'tax', 'audit', 'accounting', 'registration'],
    reply:
      'We provide taxation, GST, audit, accounting, ROC compliance, company registration, and advisory support.'
  },
  {
    match: ['contact', 'phone', 'whatsapp', 'reach'],
    reply:
      'You can contact us through the WhatsApp button in the header or visit the Contact page for office details.'
  },
  {
    match: ['price', 'fees', 'cost'],
    reply:
      'Fees depend on the scope of work. Share your requirement and we can guide you on the right service package.'
  },
  {
    match: ['register', 'company', 'llp', 'startup'],
    reply:
      'For company or LLP registration, we handle structure setup, incorporation support, and compliance guidance.'
  }
];

function getFallbackReply(message) {
  const normalized = message.toLowerCase();
  const match = fallbackReplies.find((item) => item.match.some((word) => normalized.includes(word)));
  return (
    match?.reply ||
    'I can help with services, registration, GST, audit, and contact guidance. Please ask in a bit more detail.'
  );
}

export const chat = asyncHandler(async (req, res) => {
  const message = String(req.body?.message || '').trim();

  if (!message) {
    return res.status(400).json({ message: 'message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[Chatbot] Gemini API key is missing');
    return res.status(503).json({
      message: 'Gemini API key is not configured on the server.'
    });
  }

  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  const ai = getGeminiClient();

  if (!ai) {
    return res.status(503).json({
      message: 'Gemini API key is not configured on the server.'
    });
  }

  console.info('[Chatbot] Sending Gemini request', { model, messageLength: message.length });

  try {
    const response = await ai.models.generateContent({
      model,
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS,
        temperature: 0.4,
        maxOutputTokens: 256
      }
    });

    const reply = response?.text?.trim() || 'I could not generate a response right now.';

    console.info('[Chatbot] Gemini success', {
      model,
      replyLength: reply.length
    });

    return res.json({ reply });
  } catch (geminiError) {
    const errorMessage = String(geminiError?.message || 'Gemini request failed');
    console.error('[Chatbot] Gemini API error', {
      model,
      message: errorMessage,
      error: geminiError
    });

    if (/quota|rate limit|resource exhausted|429/i.test(errorMessage)) {
      return res.json({ reply: getFallbackReply(message), fallback: true });
    }

    return res.status(502).json({
      message: errorMessage
    });
  }
});

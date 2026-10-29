import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getAiAvailabilityStatus, buildAiRequestSummary, buildDemoExplanation } from './src/aiBackend.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(cors());
app.use(express.json({ limit: '256kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, status: 'VATGuard backend ready' });
});

app.get('/api/ai/status', (_req, res) => {
  const status = getAiAvailabilityStatus(process.env);
  res.json({ available: status.available, mode: status.mode || 'unavailable', message: status.message });
});

app.post('/api/ai/explain', async (req, res) => {
  const body = req.body || {};
  const availability = getAiAvailabilityStatus(process.env);

  if (!availability.available) {
    return res.status(503).json({
      available: false,
      message: 'AI explanations are unavailable because no API key is configured.',
    });
  }

  if (!body.confirmed) {
    return res.status(400).json({
      available: false,
      message: 'Explicit confirmation is required before sending any information externally.',
    });
  }

  const summary = buildAiRequestSummary({
    summary: body.summary || '',
    findings: body.findings || [],
    redactions: body.redactions || [],
    businessReference: body.businessReference || '',
    reportingPeriod: body.reportingPeriod || '',
  });

  const requestSize = JSON.stringify(summary).length;
  if (requestSize > 2000) {
    return res.status(400).json({
      available: false,
      message: 'The AI request is too large. Please reduce the selected findings and redactions.',
    });
  }

  if (availability.mode === 'demo') {
    return res.json({
      available: true,
      mode: 'demo',
      explanation: buildDemoExplanation(summary),
      summary,
    });
  }

  const providerUrl = `${String(process.env.AI_BASE_URL).replace(/\/$/, '')}/chat/completions`;
  const model = process.env.AI_MODEL || 'gpt-4o-mini';

  try {
    const response = await fetch(providerUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a careful VAT review assistant. Explain only what is supported by the supplied summary and do not invent amounts or legal conclusions.',
          },
          {
            role: 'user',
            content: `Business reference: ${summary.businessReference || 'N/A'}\nReporting period: ${summary.reportingPeriod || 'N/A'}\nSummary: ${summary.summary}\nRedactions: ${JSON.stringify(summary.redactions)}\nExplain in plain language, list likely causes, suggest next checks, and identify what remains uncertain.`,
          },
        ],
        temperature: 0.2,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      await response.text();
      return res.status(response.status).json({
        available: false,
        message: 'The external AI provider rejected the request.',
      });
    }

    const data = await response.json();
    const explanation = data.choices?.[0]?.message?.content || 'No explanation returned by the AI provider.';

    return res.json({
      available: true,
      explanation,
      summary,
    });
  } catch (error) {
    return res.status(502).json({
      available: false,
      message: 'The AI service could not be reached. Please check the backend configuration and provider endpoint.',
    });
  }
});

app.listen(port, () => {
  console.log(`VATGuard backend running on http://localhost:${port}`);
});

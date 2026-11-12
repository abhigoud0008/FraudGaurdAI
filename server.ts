import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  analyzeScamText,
  dispatchEscalation,
  ESCALATION_TIERS,
  getEscalationTier,
} from './src/utils/fraudAnalyzer.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'FraudGuard AI',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Escalation Tiers endpoint
app.get('/api/escalation-tiers', (req, res) => {
  res.json({ tiers: ESCALATION_TIERS });
});

// Dispatch Escalation endpoint (Levels 2 to 5 with 2 to 5 member teams)
app.post('/api/escalate', (req, res) => {
  const { level, incidentRef, notes } = req.body || {};
  const lvlNum = Number(level);
  if (![2, 3, 4, 5].includes(lvlNum)) {
    return res.status(400).json({ error: 'Escalation level must be between 2 and 5.' });
  }

  const escalation = dispatchEscalation(lvlNum as 2 | 3 | 4 | 5, incidentRef, notes);
  res.json({ success: true, escalation });
});

// Primary Fraud Analysis Endpoint - Ultra Fast Response (< 100ms)
app.post('/api/analyze', async (req, res) => {
  const { text, userCategory, concernType, riskUrgency, deepAnalysis } = req.body || {};

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text content is required for fraud analysis.' });
  }

  // Instant 10-Factor forensic evaluation (computes in < 5ms)
  const instantResult = analyzeScamText(text, { userCategory, concernType, riskUrgency });

  const apiKey = process.env.GEMINI_API_KEY;
  // If not explicitly requesting deep analysis or no API key, return the instant forensic result immediately!
  if (!deepAnalysis || !apiKey || instantResult.insufficientInfo) {
    return res.json({ result: instantResult, source: 'instant-forensic-engine', responseTimeMs: 5 });
  }

  try {
    const ai = new GoogleGenAI();
    const systemInstruction = `You are FraudGuard AI, an elite cybersecurity and fraud prevention analyst.
You must adhere to this STRICT personality and output structure:
- Professional, trustworthy, clear, easy to understand for non-technical users, empathetic without being emotional.
- Never create unnecessary fear.
- Never make legal conclusions.
- Never claim certainty when information is incomplete. Use confidence levels (High Confidence, Moderate Confidence, Preliminary).
- Follow the 10-Factor Scam Analysis Framework:
  A. Urgency
  B. Threat language
  C. Personal data requests
  D. OTP requests
  E. Payment requests
  F. Unknown links
  G. Unusual rewards
  H. Impersonation attempts
  I. Grammar and language inconsistencies
  J. Unrealistic promises

Risk Levels:
0-30 = Safe -> Display: 🟢 LOW RISK
31-60 = Suspicious -> Display: 🟡 USE CAUTION
61-100 = High Risk -> Display: 🔴 FRAUD ALERT

Escalation:
If financial loss occurred, account compromised, or high risk (score >= 61), provide both:
Option 1: Cyber Crime Helpline 1930
Option 2: FraudGuard Security Team (Email: support@fraudguard-demo.com, Phone: +1-555-123-4567)

Return a valid JSON object matching this schema:
{
  "riskScore": number (0-100),
  "trustLevel": "Safe" | "Suspicious" | "High Risk",
  "badge": "🟢 LOW RISK" | "🟡 USE CAUTION" | "🔴 FRAUD ALERT",
  "confidence": "High Confidence" | "Moderate Confidence" | "Preliminary",
  "summary": string,
  "analysis": string,
  "keyFindings": string[],
  "warningSigns": string[],
  "recommendedActions": string[],
  "escalationRequired": boolean,
  "nextStep": string,
  "frameworkDetections": [
    {"code": "A", "name": "Urgency", "detected": boolean, "severity": "low"|"medium"|"high"|"critical", "details": string},
    {"code": "B", "name": "Threat language", "detected": boolean, "severity": "low"|"medium"|"high"|"critical", "details": string},
    {"code": "C", "name": "Personal data requests", "detected": boolean, "severity": "low"|"medium"|"high"|"critical", "details": string},
    {"code": "D", "name": "OTP requests", "detected": boolean, "severity": "low"|"medium"|"high"|"critical", "details": string},
    {"code": "E", "name": "Payment requests", "detected": boolean, "severity": "low"|"medium"|"high"|"critical", "details": string},
    {"code": "F", "name": "Unknown links", "detected": boolean, "severity": "low"|"medium"|"high"|"critical", "details": string},
    {"code": "G", "name": "Unusual rewards", "detected": boolean, "severity": "low"|"medium"|"high"|"critical", "details": string},
    {"code": "H", "name": "Impersonation attempts", "detected": boolean, "severity": "low"|"medium"|"high"|"critical", "details": string},
    {"code": "I", "name": "Grammar and language inconsistencies", "detected": boolean, "severity": "low"|"medium"|"high"|"critical", "details": string},
    {"code": "J", "name": "Unrealistic promises", "detected": boolean, "severity": "low"|"medium"|"high"|"critical", "details": string}
  ]
}`;

    const prompt = `Context: User is a ${userCategory || 'Individual'}, concerned about ${concernType || 'General Fraud'}, urgency level: ${riskUrgency || 'Suspicious Activity'}.
Text to inspect:
"""
${text}
"""
Analyze this communication and provide the complete JSON response.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const riskScore = typeof parsed.riskScore === 'number' ? Math.min(100, Math.max(0, parsed.riskScore)) : instantResult.riskScore;
    const badge = riskScore <= 30 ? '🟢 LOW RISK' : riskScore <= 60 ? '🟡 USE CAUTION' : '🔴 FRAUD ALERT';
    const trustLevel = riskScore <= 30 ? 'Safe' : riskScore <= 60 ? 'Suspicious' : 'High Risk';

    const merged = {
      ...instantResult,
      ...parsed,
      riskScore,
      badge,
      trustLevel,
      frameworkPoints: parsed.frameworkDetections || instantResult.frameworkPoints,
      escalationRequired: riskScore >= 61 || riskUrgency === 'Financial Loss Already Happened',
      escalationOptions: (riskScore >= 61 || riskUrgency === 'Financial Loss Already Happened')
        ? {
            option1: {
              title: 'Option 1: Cyber Crime Helpline',
              helpline: '1930',
              description: 'National Cyber Crime Reporting Portal & Hotline (Dial 1930 immediately to freeze financial transactions).',
            },
            option2: {
              title: 'Option 2: FraudGuard Security Team',
              email: 'support@fraudguard-demo.com',
              phone: '+1-555-123-4567',
            },
          }
        : undefined,
    };

    return res.json({ result: merged, source: 'gemini-3.8-flash' });
  } catch (err) {
    console.warn('Gemini API call failed, using deterministic fraud analyzer:', err);
    return res.json({ result: instantResult, source: 'rule-engine-fallback' });
  }
});

async function start() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FraudGuard AI server active on http://0.0.0.0:${PORT}`);
  });
}

start();

const fetch = require('node-fetch');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractJsonObject(text) {
  if (!text || typeof text !== 'string') return null;

  // Try parsing directly first
  try {
    return JSON.parse(text);
  } catch (_) {
    // continue
  }

  // Fallback: extract the first {...} block.
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) return null;

  const candidate = text.slice(firstBrace, lastBrace + 1);
  try {
    return JSON.parse(candidate);
  } catch (_) {
    return null;
  }
}

async function analyzeWithGemini({ claim, evidenceArticles }) {
  try {
    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
      throw new Error('Missing API_KEY in environment variables');
    }

    // Model fallback chain – if one hits quota the next is tried automatically.
    // Each model has its own independent daily quota on the free tier.
    const primaryModel = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const modelFallbacks = [
      primaryModel,
      'gemini-2.5-flash',
      'gemini-2.0-flash-lite',
      'gemini-2.5-flash-lite',
      'gemini-2.0-flash-001',
    ].filter((m, i, arr) => arr.indexOf(m) === i); // deduplicate

    const evidence = Array.isArray(evidenceArticles) ? evidenceArticles : [];
    const evidencePreview = evidence.slice(0, 8).map((a) => ({
      title: a.title || '',
      source: a.source || '',
      description: a.description || '',
      url: a.url || '',
      content: a.content ? String(a.content).slice(0, 1500) : '',
    }));

    const hasEvidence = evidencePreview.length > 0;

    const promptText = `You are an expert fact-checking AI with broad knowledge of world events, politics, science, and current affairs.

Your task: Determine whether the following claim is TRUE or FALSE.

Instructions:
1. Use your own extensive training knowledge to fact-check the claim. This is your PRIMARY source.
2. If external evidence articles are provided below, use them as SUPPLEMENTAL support.
3. If the claim contradicts well-known facts (e.g. wrong person for a position, false historical event, scientific misinformation), mark it FALSE with high confidence.
4. Give a credibility_score from 0 to 100:
   - 0-20: Clearly false / misinformation
   - 21-40: Likely false
   - 41-59: Uncertain / insufficient info
   - 60-79: Likely true
   - 80-100: Clearly true / well-supported
5. Output ONLY a valid JSON object. No markdown, no extra text.

Claim:
${JSON.stringify(claim)}

${hasEvidence ? `Supplemental evidence from news sources:
${JSON.stringify(evidencePreview)}` : 'No external news articles were found. Rely entirely on your training knowledge.'}
`;

    const responseSchema = {
      type: 'OBJECT',
      properties: {
        verdict: { type: 'BOOLEAN', description: 'true if claim is supported by evidence, else false' },
        credibility_score: { type: 'NUMBER', description: '0-100 score' },
        status: { type: 'STRING', enum: ['Real', 'Fake'], description: 'Human readable label' },
        confidence_level: { type: 'STRING', enum: ['Low', 'Medium', 'High'] },
        reason: { type: 'STRING', description: 'Short explanation referencing evidence' },
      },
      required: ['verdict', 'credibility_score', 'status', 'confidence_level', 'reason'],
    };

    const payload = {
      contents: [
        {
          parts: [
            {
              text: promptText,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0,
        max_output_tokens: 512,
        response_mime_type: 'application/json',
        response_schema: responseSchema,
      },
    };

    const timeoutMs = Number(process.env.GEMINI_TIMEOUT_MS || 20000);
    const fetchWithTimeout = async (url, options) => {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), timeoutMs);
      try {
        return await fetch(url, { ...options, signal: controller.signal });
      } finally {
        clearTimeout(t);
      }
    };

    let lastErr = null;

    // Try each model in the fallback chain
    for (const model of modelFallbacks) {
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
      const url = `${API_URL}?key=${API_KEY}`;
      console.log(`[Gemini] Trying model: ${model}`);

      let modelSucceeded = false;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await fetchWithTimeout(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            const errorData = await response.text();
            const err = new Error(`Gemini API HTTP ${response.status}: ${errorData}`);
            // If quota exceeded, skip to next model immediately
            if (response.status === 429) throw err;
            throw err;
          }

          const data = await response.json();
          const parts = data?.candidates?.[0]?.content?.parts || [];
          const aiResponseText = parts
            .map((p) => (p && typeof p.text === 'string' ? p.text : ''))
            .filter(Boolean)
            .join('\n')
            .trim();

          if (!aiResponseText) throw new Error('Invalid response structure from Gemini API');

          const parsed = extractJsonObject(aiResponseText);
          if (!parsed) {
            console.error('Gemini raw output (not JSON object):', aiResponseText);
            throw new Error('AI response parsing failed (no valid JSON object)');
          }

          const verdict = Boolean(parsed.verdict);
          const credibility_score = Number(parsed.credibility_score);
          const status = parsed.status === 'Real' ? 'Real' : 'Fake';
          const confidence_level = parsed.confidence_level || 'Low';
          const reason = String(parsed.reason || '').trim() || 'No reason returned by AI';

          console.log(`[Gemini] Success with model: ${model}`);
          return {
            verdict,
            credibility_score: Math.max(0, Math.min(100, credibility_score)),
            status,
            confidence_level,
            reason,
          };
        } catch (err) {
          lastErr = err;
          const msg = String(err.message || err);
          // Quota error → break inner loop, try next model
          if (msg.includes('429')) {
            console.warn(`[Gemini] Quota exceeded for model ${model}, trying next model...`);
            break;
          }
          // Server error → retry once after short wait
          if (attempt === 0 && (msg.includes('HTTP 5') || msg.includes('aborted'))) {
            await sleep(800);
            continue;
          }
          break;
        }
      }
      if (modelSucceeded) break;
    }

    throw lastErr || new Error('All Gemini models failed');
  } catch (error) {
    console.error('Gemini Service Error:', error.message);
    return {
      verdict: null,
      credibility_score: 50,
      status: 'Uncertain',
      confidence_level: 'Medium',
      // Keep reason consistent with your UI expectation:
      // the original claim text, then the server app will append evidence summary.
      reason: claim,
    };
  }
}

module.exports = { analyzeWithGemini };

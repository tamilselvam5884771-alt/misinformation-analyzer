const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load env from repo root (works even if server is started from `server/`).
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const { analyzeWithGemini } = require('./geminiService.cjs');
const { fetchRelatedNews } = require('./newsService.cjs');
const { extractKeywords, calculateSimilarity, detectFakeSignals } = require('./similarity.cjs');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable JSON parsing and CORS
app.use(cors());
app.use(express.json());

// Basic route to verify server is running
app.get('/', (req, res) => {
  res.send('Backend Server is running.');
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// POST API endpoint `/analyze`
app.post('/analyze', async (req, res) => {
  try {
    const { text } = req.body;

    // Validate input
    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }

    // 1. Fetch Related News (real-time evidence)
    const relatedNews = await fetchRelatedNews(text);

    // 2. Similarity Logic & Score Calculation (used as bonus/penalty)
    let similarityScore = 0;
    let maxKeywordsMatched = 0;
    const inputKeywords = extractKeywords(text);
    
    if (relatedNews.length > 0) {
      const similarityResult = calculateSimilarity(inputKeywords, relatedNews);
      similarityScore = similarityResult.score || 0;
      maxKeywordsMatched = similarityResult.maxMatched || 0;
    }

    // 3. Fake Signal Detection (used as penalty)
    const fakeSignalPenalty = detectFakeSignals(text);
    const clickbaitDetected = fakeSignalPenalty > 0;

    // 4. Get Gemini Verdict (structured output)
    let aiResult;
    try {
      aiResult = await analyzeWithGemini({ claim: text, evidenceArticles: relatedNews });
    } catch (aiError) {
      console.error('Gemini AI failed, using fallback:', aiError);
      aiResult = {
        verdict: null,
        credibility_score: 50,
        status: 'Uncertain',
        confidence_level: 'Medium',
        reason: text,
      };
    }

    // 5. Calculate Final Credibility Score
    let finalCredibility = Number(aiResult.credibility_score);
    if (Number.isNaN(finalCredibility)) finalCredibility = 50;

    const verdict = aiResult.verdict;
    const isVerdictKnown = typeof verdict === 'boolean';
    const isCredible = isVerdictKnown ? verdict : null;

    // Ensure it's between 0 and 100 and a rounded integer
    finalCredibility = Math.max(0, Math.min(100, Math.round(finalCredibility)));

    // Confidence Level
    let confidenceLevel = aiResult.confidence_level || "Low";
    if (!["Low", "Medium", "High"].includes(confidenceLevel)) {
      if (finalCredibility > 75) confidenceLevel = "High";
      else if (finalCredibility >= 40) confidenceLevel = "Medium";
    }

    // Adjust status based on new score
    const finalStatus = isVerdictKnown ? (isCredible ? "Real" : "Fake") : "Uncertain";
    if (finalStatus === 'Uncertain') confidenceLevel = aiResult.confidence_level || 'Medium';

    // Build a cleaner natural-language explanation for the UI.
    const normalizedReason =
      typeof aiResult.reason === 'string' && aiResult.reason.trim() && aiResult.reason.trim() !== text.trim()
        ? aiResult.reason.trim()
        : '';

    const reasonParts = [];
    if (normalizedReason) {
      reasonParts.push(normalizedReason);
    } else if (finalStatus === 'Real') {
      reasonParts.push('This claim appears to be supported by the available evidence.');
    } else if (finalStatus === 'Fake') {
      reasonParts.push('This claim appears to conflict with the available evidence.');
    } else {
      reasonParts.push('We could not verify this claim confidently with the available real-time evidence.');
    }

    if (relatedNews.length > 0) {
      reasonParts.push(`Found ${relatedNews.length} related article${relatedNews.length > 1 ? 's' : ''} from current sources.`);
    } else {
      reasonParts.push('No related articles were found in the current search results.');
    }

    if (maxKeywordsMatched > 0) {
      reasonParts.push(`Keyword overlap score: ${Math.round(similarityScore)}/100.`);
    }

    if (fakeSignalPenalty > 0) {
      reasonParts.push('Some clickbait-style wording was detected in the claim text.');
    }

    const finalReason = reasonParts.join(' ');

    // 6. Final output formatted properly
    return res.json({
      credibility: finalCredibility,
      status: finalStatus,
      is_credible: isCredible,
      confidence_level: confidenceLevel,
      reason: finalReason.trim(),
      signals: {
        clickbait_detected: clickbaitDetected,
        keywords_matched: maxKeywordsMatched
      },
      related_news: relatedNews.map(news => ({
        title: news.title,
        source: news.source,
        url: news.url
      }))
    });

  } catch (error) {
    console.error('Error in /analyze endpoint:', error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// Catch-all to serve React index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

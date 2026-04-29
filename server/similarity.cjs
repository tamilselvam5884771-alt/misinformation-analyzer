// Keyword extraction: A simple approach (splitting words and filtering common stop words)
function extractKeywords(text) {
  if (!text) return [];
  const stopWords = ['the', 'is', 'at', 'which', 'on', 'in', 'a', 'an', 'and', 'or', 'for', 'to', 'of', 'with', 'that', 'this', 'it', 'as', 'by', 'are'];
  const words = text.toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/);
  
  const keywords = words.filter(word => word.length > 3 && !stopWords.includes(word));
  
  // Return top 5 unique keywords
  return [...new Set(keywords)].slice(0, 5);
}

// Compare input news text keywords with fetched articles
function calculateSimilarity(inputKeywords, articles) {
  if (!articles || articles.length === 0 || inputKeywords.length === 0) {
    return { score: 0, maxMatched: 0 };
  }

  let totalScore = 0;
  let maxMatched = 0;

  articles.forEach(article => {
    const articleText = `${article.title} ${article.description || ''} ${article.content || ''}`.toLowerCase();
    
    let commonKeywords = 0;
    inputKeywords.forEach(keyword => {
      if (articleText.includes(keyword)) {
        commonKeywords++;
      }
    });

    if (commonKeywords > maxMatched) {
      maxMatched = commonKeywords;
    }

    const articleScore = (commonKeywords / inputKeywords.length) * 100;
    totalScore += articleScore;
  });

  // Average similarity across top articles
  return {
    score: Math.min(100, totalScore / articles.length),
    maxMatched
  };
}

// Fake Signal Detection
function detectFakeSignals(text) {
  const fakeSignals = ["shocking", "unbelievable", "truth exposed", "breaking secret", "you won't believe", "miracle", "secret"];
  const lowerText = text.toLowerCase();
  
  let penalty = 0;
  fakeSignals.forEach(signal => {
    if (lowerText.includes(signal)) {
      penalty += 10; // Reduce 10 points per fake signal
    }
  });

  return penalty;
}

module.exports = { extractKeywords, calculateSimilarity, detectFakeSignals };

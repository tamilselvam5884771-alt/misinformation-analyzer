const axios = require('axios');
const { extractKeywords } = require('./similarity.cjs');

async function fetchRelatedNews(text) {
  try {
    const keywords = extractKeywords(text);
    const apiKey = process.env.GNEWS_API_KEY;
    if (!apiKey || apiKey === 'your_gnews_api_key_here') {
      console.warn("GNEWS_API_KEY is not set or invalid. Skipping news search.");
      return [];
    }

    // If extraction is weak, fall back to searching the full input text.
    const query = (keywords && keywords.length > 0) ? keywords.join(' OR ') : String(text);

    const timeoutMs = Number(process.env.GNEWS_TIMEOUT_MS || 15000);
    const axiosConfig = { timeout: timeoutMs };

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=5&apikey=${apiKey}`;
        const response = await axios.get(url, axiosConfig);

        if (response.data && response.data.articles) {
          return response.data.articles.map(article => ({
            title: article.title,
            source: article.source?.name || article.source,
            url: article.url,
            description: article.description,
            content: article.content,
          }));
        }

        return [];
      } catch (err) {
        const msg = String(err && err.message ? err.message : err);
        const shouldRetry = attempt < 2 && (msg.includes('429') || msg.includes('500') || msg.toLowerCase().includes('timeout'));
        if (!shouldRetry) break;
      }
    }

    return [];
  } catch (error) {
    console.error('Error fetching related news:', error.message);
    return []; // Fail gracefully, don't break the system
  }
}

module.exports = { fetchRelatedNews };

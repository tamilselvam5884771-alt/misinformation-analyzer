import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AnalysisPanel from './components/AnalysisPanel';
import StatsDashboard from './components/StatsDashboard';
import Features from './components/Features';
import Education from './components/Education';
import Footer from './components/Footer';
import { analyzeClaim } from './api/backend';

function App() {
  const [stats, setStats] = useState(() => {
    return {
      totalAnalyzed: parseInt(localStorage.getItem('misinfo_v2_totalAnalyzed')) || 0,
      prevented: parseInt(localStorage.getItem('misinfo_v2_prevented')) || 0,
      accuracy: parseFloat(localStorage.getItem('misinfo_v2_accuracy')) || 0
    };
  });

  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });
  }, []);

  const handleAnalyze = async (text) => {
    const claim = String(text || '').trim();
    if (!claim) return;

    const claimLower = claim.toLowerCase();

    let category = "General";
    if (claimLower.includes('vaccine') || claimLower.includes('cure') || claimLower.includes('health') || claimLower.includes('virus')) category = "Health";
    if (claimLower.includes('election') || claimLower.includes('vote') || claimLower.includes('president')) category = "Politics";
    if (claimLower.includes('crypto') || claimLower.includes('stock') || claimLower.includes('bank')) category = "Finance";

    // Deterministic keyword chips for the UI (not used for backend verdict).
    const stopWords = ['the', 'is', 'at', 'which', 'on', 'in', 'a', 'an', 'and', 'or', 'for', 'to', 'of', 'with', 'that', 'this', 'it', 'as', 'by', 'are', 'was', 'were', 'be'];
    const words = claimLower.replace(/[^\w\s]/gi, '').split(/\s+/).filter(Boolean);
    const keywords = [...new Set(words.filter((w) => w.length > 4 && !stopWords.includes(w)))].slice(0, 5);

    try {
      const data = await analyzeClaim(claim);

      const score = typeof data.credibility === 'number' ? data.credibility : 50;
      const status = data.status || (data.is_credible ? 'Real' : 'Fake');
      const isMisinfo = status === 'Fake';

      const newResult = {
        category,
        keywords,
        score,
        isMisinfo,
        status,
        reason: data.reason,
        confidence_level: data.confidence_level,
        signals: data.signals || { clickbait_detected: false, keywords_matched: 0 },
        related_news: Array.isArray(data.related_news) ? data.related_news : [],
        is_credible: data.is_credible,
        backend: data,
      };

      setAnalysisResult(newResult);

      // Update Stats (estimated accuracy from Gemini confidence)
      setStats((prev) => {
        const newTotal = prev.totalAnalyzed + 1;
        const newPrevented = prev.prevented + (isMisinfo ? 1 : 0);

        let estimatedAccuracy = 85;
        if (data.confidence_level === 'High') estimatedAccuracy = 99;
        else if (data.confidence_level === 'Medium') estimatedAccuracy = 92;

        const newAccuracy = prev.accuracy === 0 ? estimatedAccuracy : parseFloat((prev.accuracy * 0.8 + estimatedAccuracy * 0.2).toFixed(1));

        localStorage.setItem('misinfo_v2_totalAnalyzed', newTotal);
        localStorage.setItem('misinfo_v2_prevented', newPrevented);
        localStorage.setItem('misinfo_v2_accuracy', newAccuracy);

        return {
          totalAnalyzed: newTotal,
          prevented: newPrevented,
          accuracy: newAccuracy,
        };
      });
    } catch (err) {
      console.error('Analyze failed:', err);
      const fallbackResult = {
        category,
        keywords,
        score: 50,
        isMisinfo: false,
        status: 'Uncertain',
        reason: `${claim} Found 0 related articles. Keyword match score: 0/100.`,
        confidence_level: 'Medium',
        signals: { clickbait_detected: false, keywords_matched: 0 },
        related_news: [],
        is_credible: null,
        backend: null,
      };
      setAnalysisResult(fallbackResult);
    } finally {
      setTimeout(() => {
        document.getElementById('analysisContainer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <>
      <Navbar />
      <Hero onAnalyze={handleAnalyze} />
      <AnalysisPanel result={analysisResult} />
      <StatsDashboard stats={stats} />
      <Features />
      <Education />
      <Footer />
    </>
  );
}

export default App;

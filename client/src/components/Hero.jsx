import React, { useState } from 'react';

const Hero = ({ onAnalyze }) => {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    const trimmed = input.trim();
    if (!trimmed) {
      alert('Please enter a headline or claim to analyze.');
      return;
    }

    setIsAnalyzing(true);

    try {
      await onAnalyze(trimmed);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="hero-section" id="analyze" style={{ position: 'relative', zIndex: 1 }}>
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9" data-aos="fade-up">
            <div className="mb-4 text-primary">
              <i className="fas fa-brain fa-4x" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}></i>
            </div>
            <h1 className="hero-title">AI Misinformation <span>Analyzer</span></h1>
            <p className="hero-subtitle">Instantly verify claims, news headlines, and social media posts. Our advanced AI scans across verified sources to detect potential misinformation in real-time.</p>
            
            <div className="input-wrapper">
              <textarea 
                className="claim-input" 
                placeholder="Paste a headline, tweet, or claim here to analyze..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isAnalyzing}
              ></textarea>
              <button 
                className="btn btn-gradient analyze-btn" 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                <i className="fas fa-search"></i> Analyze
              </button>
            </div>

            {isAnalyzing && (
              <div className="spinner-wrapper text-center" style={{ display: 'block' }}>
                <span className="loader"></span>
                <p className="mt-3 font-monospace text-muted">Running AI models... cross-referencing databases...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

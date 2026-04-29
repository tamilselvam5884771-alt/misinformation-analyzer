import React from 'react';

const Features = () => {
  return (
    <section className="container py-5" id="features">
      <div className="text-center mb-5" data-aos="fade-up">
        <h2 className="fw-bold">How MisinfoX Protects You</h2>
        <p className="text-muted">
          Enterprise-grade AI combined with human-verified fact-checking networks.
        </p>
      </div>
      <div className="row g-4">
        <div className="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="0">
          <div className="glass-card p-4 h-100 text-center">
            <i className="fas fa-brain feature-icon-lg"></i>
            <h5 className="fw-bold mt-3">AI-Powered Analysis</h5>
            <p className="text-muted small">
              Deep learning models trained on millions of verified facts and debunked myths.
            </p>
          </div>
        </div>
        <div className="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="100">
          <div className="glass-card p-4 h-100 text-center">
            <i className="fas fa-tachometer-alt feature-icon-lg"></i>
            <h5 className="fw-bold mt-3">Credibility Scoring</h5>
            <p className="text-muted small">
              Get a clear, color-coded reliability score for any claim instantly.
            </p>
          </div>
        </div>
        <div className="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="200">
          <div className="glass-card p-4 h-100 text-center">
            <i className="fas fa-check-double feature-icon-lg"></i>
            <h5 className="fw-bold mt-3">Fact-Check Sources</h5>
            <p className="text-muted small">
              Direct links and cross-references to verified reports from WHO, Reuters, and more.
            </p>
          </div>
        </div>
        <div className="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="300">
          <div className="glass-card p-4 h-100 text-center">
            <i className="fas fa-bolt feature-icon-lg"></i>
            <h5 className="fw-bold mt-3">Real-Time Detection</h5>
            <p className="text-muted small">
              Analyze emerging narratives before they go viral across social media.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;

import React from 'react';

const Education = () => {
  const scrollToAnalyze = () => {
    document.getElementById('analyze')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="container py-5 mt-4 mb-5" id="education">
      <div className="row align-items-center">
        <div className="col-lg-5 mb-4 mb-lg-0" data-aos="fade-right">
          <h2 className="fw-bold mb-4">How Misinformation Spreads</h2>
          <p className="text-muted mb-4">
            Understanding the mechanics of false information is the first step in protecting
            yourself. Bad actors use specific psychological triggers to make you share before you
            think.
          </p>
          <button
            className="btn btn-outline-primary rounded-pill px-4"
            onClick={scrollToAnalyze}
          >
            Try the Analyzer
          </button>
        </div>
        <div className="col-lg-7">
          <div className="row g-3">
            <div className="col-sm-6" data-aos="fade-up" data-aos-delay="100">
              <div className="glass-card p-4 edu-card h-100">
                <i className="fas fa-mouse-pointer"></i>
                <h5 className="fw-bold">Clickbait Headlines</h5>
                <p className="text-muted small mb-0">
                  Exaggerated or misleading titles designed to exploit curiosity gap.
                </p>
              </div>
            </div>
            <div className="col-sm-6" data-aos="fade-up" data-aos-delay="200">
              <div className="glass-card p-4 edu-card h-100">
                <i className="fas fa-heart-crack"></i>
                <h5 className="fw-bold">Emotional Manipulation</h5>
                <p className="text-muted small mb-0">
                  Content designed to trigger anger, fear, or extreme validation.
                </p>
              </div>
            </div>
            <div className="col-sm-6" data-aos="fade-up" data-aos-delay="300">
              <div className="glass-card p-4 edu-card h-100">
                <i className="fas fa-user-ninja"></i>
                <h5 className="fw-bold">Fake Experts</h5>
                <p className="text-muted small mb-0">
                  Using unverified credentials to establish false authority on complex topics.
                </p>
              </div>
            </div>
            <div className="col-sm-6" data-aos="fade-up" data-aos-delay="400">
              <div className="glass-card p-4 edu-card h-100">
                <i className="fas fa-camera-rotate"></i>
                <h5 className="fw-bold">Deceptive Imagery</h5>
                <p className="text-muted small mb-0">
                  Out-of-context photos or AI-generated deepfakes shaping false narratives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;

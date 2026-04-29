import React, { useEffect, useState } from 'react';

const AnalysisPanel = ({ result }) => {
  const [currentScore, setCurrentScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  
  const circumference = 263.89;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  useEffect(() => {
    if (!result) return;
    
    setShowDetails(false);
    setCurrentScore(0);
    
    const timeout = setTimeout(() => {
      let current = 0;
      const inc = result.score / 30;
      
      const interval = setInterval(() => {
        current += inc;
        if (current >= result.score) {
          setCurrentScore(result.score);
          setShowDetails(true);
          clearInterval(interval);
        } else {
          setCurrentScore(current);
        }
      }, 50);
      
      return () => clearInterval(interval);
    }, 100);

    return () => clearTimeout(timeout);
  }, [result]);

  if (!result) return null;

  let statusBadge = null;
  let explanation = '';
  const status = result.status || (result.isMisinfo ? 'Fake' : 'Real');
  const confidence = result.confidence_level || 'Low';
  const relatedNews = Array.isArray(result.related_news) ? result.related_news : [];
  const clickbaitDetected = Boolean(result.signals?.clickbait_detected);
  const keywordsMatched = Number(result.signals?.keywords_matched || 0);
  
  if (showDetails) {
    if (status === 'Fake') {
      statusBadge = <span className="status-badge bg-danger text-white"><i className="fas fa-times-circle"></i> Likely Misinformation</span>;
      explanation = result.reason || "This claim appears misleading based on the available evidence.";
    } else if (status === 'Real') {
      statusBadge = <span className="status-badge bg-success text-white"><i className="fas fa-check-circle"></i> Likely Credible</span>;
      explanation = result.reason || "This claim appears supported by the available evidence.";
    } else {
      statusBadge = <span className="status-badge bg-warning text-dark"><i className="fas fa-exclamation-triangle"></i> Uncertain</span>;
      explanation = result.reason || "We couldn't verify this claim with enough reliable evidence.";
    }

    explanation = `${explanation} (Confidence: ${confidence})`;
  }

  return (
    <section className="container analysis-container" id="analysisContainer">
      <div className="row justify-content-center" data-aos="zoom-in">
        <div className="col-lg-10">
          <div className="glass-card p-4 p-md-5 mb-5">
            <div className="row g-4">
              {/* Main Result */}
              <div className="col-md-7 border-end border-light">
                <h3 className="fw-bold mb-4">Analysis Results</h3>
                <div className="d-flex align-items-center gap-4 mb-4">
                  <div className="circular-progress-container">
                    <svg className="circular-progress" viewBox="0 0 100 100">
                      <circle className="circular-progress-bg" cx="50" cy="50" r="42"></circle>
                      <circle 
                        className="circular-progress-fill" 
                        cx="50" cy="50" r="42"
                        style={{ 
                          strokeDashoffset, 
                          stroke: showDetails
                            ? (status === 'Fake' ? 'var(--danger)' : status === 'Uncertain' ? 'var(--warning)' : 'var(--success)')
                            : 'var(--success)',
                          transition: 'stroke-dashoffset 0.1s linear, stroke 0.5s ease'
                        }}
                      ></circle>
                    </svg>
                    <div className="circular-progress-value">
                      {Math.floor(currentScore)}%
                    </div>
                  </div>
                  <div className="d-flex flex-column gap-2">
                    <div className="text-muted fw-semibold" style={{ fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Credibility Score
                    </div>
                    <div>
                      {statusBadge}
                    </div>
                  </div>
                </div>

                <p className="fs-5">{explanation}</p>

                <div className="result-reason-card mt-4">
                  <div className="result-reason-header">
                    <i className="fas fa-file-lines text-primary me-2"></i>
                    Reason
                  </div>
                  <p className="result-reason-text mb-0">{result.reason || 'No explanation was returned.'}</p>
                </div>

                <div className="result-meta-grid mt-4">
                  <div className="result-meta-item">
                    <span className="result-meta-label">Status</span>
                    <span className="result-meta-value">{status}</span>
                  </div>
                  <div className="result-meta-item">
                    <span className="result-meta-label">Confidence</span>
                    <span className="result-meta-value">{confidence}</span>
                  </div>
                  <div className="result-meta-item">
                    <span className="result-meta-label">Clickbait Detected</span>
                    <span className="result-meta-value">{clickbaitDetected ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="result-meta-item">
                    <span className="result-meta-label">Keywords Matched</span>
                    <span className="result-meta-value">{keywordsMatched}</span>
                  </div>
                </div>
              </div>

              {/* Details & Sources */}
              <div className="col-md-5 ps-md-4">
                <h5 className="fw-bold mb-3"><i className="fas fa-tags me-2 text-secondary"></i>Detection Details</h5>
                <div className="mb-4">
                  <span className="d-block text-muted small mb-2">Category Detected:</span>
                  <span className="category-chip"><i className="fas fa-folder-open me-1"></i> {result.category}</span>
                </div>
                
                <div className="mb-4">
                  <span className="d-block text-muted small mb-2">Suspicious Keywords Highlights:</span>
                  <div>
                    {result.keywords && result.keywords.length > 0 ? (
                      result.keywords.map((k, idx) => <span key={idx} className="keyword-chip">{k}</span>)
                    ) : (
                      <span className="text-muted small">No specific suspicious triggers identified.</span>
                    )}
                  </div>
                </div>

                <h5 className="fw-bold mb-3 mt-4"><i className="fas fa-newspaper me-2 text-primary"></i>Related News</h5>
                {relatedNews.length > 0 ? (
                  <div className="d-flex flex-column gap-2">
                    {relatedNews.map((item, index) => (
                      <a
                        key={`${item.url || item.title || 'news'}-${index}`}
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-decoration-none border rounded-3 p-3 bg-light text-dark"
                      >
                        <div className="fw-semibold">{item.title || 'Untitled article'}</div>
                        <div className="small text-muted">{item.source || 'Unknown source'}</div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted small">No related articles found.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalysisPanel;

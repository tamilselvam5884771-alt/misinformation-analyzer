import React, { useEffect, useState, useRef } from 'react';

const AnimatedCounter = ({ target, isFloat }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const nodeRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });
    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    const duration = 2000;
    const difference = target - countRef.current;
    if (difference <= 0) {
      setCount(target);
      countRef.current = target;
      return;
    }

    let start;
    const initialCount = countRef.current;
    let animationFrame;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percent = Math.min(progress / duration, 1);
      
      const easeOut = 1 - (1 - percent) * (1 - percent);
      const current = initialCount + difference * easeOut;
      
      setCount(current);
      countRef.current = current;

      if (progress < duration) {
        animationFrame = requestAnimationFrame(step);
      } else {
        setCount(target);
        countRef.current = target;
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, isVisible]);

  const displayValue = isFloat ? count.toFixed(1) : Math.floor(count).toLocaleString();

  return <span ref={nodeRef} className="counter">{displayValue}</span>;
};

const StatsDashboard = ({ stats }) => {
  return (
    <section className="stats-section">
      <div className="bg-shape shape-3"></div>
      <div className="container">
        <div className="row g-4 text-center">
          <div className="col-md-4" data-aos="fade-up" data-aos-delay="0">
            <div className="stat-card">
              <div className="stat-number">
                <AnimatedCounter target={stats.totalAnalyzed} isFloat={false} />+
              </div>
              <div className="text-muted fw-semibold">Total Claims Analyzed</div>
            </div>
          </div>
          <div className="col-md-4" data-aos="fade-up" data-aos-delay="100">
            <div className="stat-card">
              <div className="stat-number text-danger">
                <AnimatedCounter target={stats.prevented} isFloat={false} />
              </div>
              <div className="text-muted fw-semibold">Misinformation Instances Prevented</div>
            </div>
          </div>
          <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
            <div className="stat-card">
              <div className="stat-number text-success">
                <AnimatedCounter target={stats.accuracy} isFloat={true} />%
              </div>
              <div className="text-muted fw-semibold">Detection Accuracy Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsDashboard;

import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="footer-title d-flex align-items-center gap-2">
              <i className="fas fa-shield-halved text-primary"></i> MisinfoX
            </div>
            <p className="small text-muted mb-4">
              Empowering individuals to navigate the digital world with confidence through AI-driven
              truth verification.
            </p>
            <div className="social-links">
              <a href="#">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
          <div className="col-lg-2"></div>
          <div className="col-6 col-lg-3">
            <h5 className="footer-title fs-6">Project</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#">API Access</a>
              </li>
              <li>
                <a href="#">GitHub Repository</a>
              </li>
            </ul>
          </div>
          <div className="col-6 col-lg-3">
            <h5 className="footer-title fs-6">Legal</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <a href="#">Privacy Notice</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="#">Data Ethics</a>
              </li>
              <li>
                <a href="#">Contact Support</a>
              </li>
            </ul>
          </div>
        </div>
        <hr className="mt-5 mb-4 border-secondary opacity-25" />
        <div className="text-center small">
          © 2026 AI Misinformation Analyzer. Built for a safer internet.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

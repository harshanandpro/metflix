import { useState } from 'react';
import './Footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentYear] = useState(new Date().getFullYear());

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const footerLinks = {
    Company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press', href: '#' },
      { name: 'Blog', href: '#' }
    ],
    'Watch Anywhere': [
      { name: 'Mobile Apps', href: '#' },
      { name: 'TV Apps', href: '#' },
      { name: 'Desktop', href: '#' },
      { name: 'Web Browser', href: '#' }
    ],
    'Help Center': [
      { name: 'FAQ', href: '#' },
      { name: 'Contact Us', href: '#' },
      { name: 'Account', href: '#' },
      { name: 'Redeem Gift Cards', href: '#' }
    ],
    Legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Preferences', href: '#' },
      { name: 'Corporate Information', href: '#' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: '📘', href: '#' },
    { name: 'Twitter', icon: '🐦', href: '#' },
    { name: 'Instagram', icon: '📷', href: '#' },
    { name: 'YouTube', icon: '📺', href: '#' },
    { name: 'TikTok', icon: '🎵', href: '#' }
  ];

  return (
    <footer className="footer-enhanced">
      {/* Animated Background */}
      <div className="footer-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-container">
        
        {/* Newsletter Section */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <h3 className="newsletter-title">Stay in the loop</h3>
            <p className="newsletter-subtitle">
              Get the latest movies, shows, and exclusive content delivered to your inbox.
            </p>
            
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <div className="input-container">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="newsletter-input"
                  required
                />
                <button 
                  type="submit" 
                  className={`newsletter-btn ${isSubscribed ? 'subscribed' : ''}`}
                  disabled={isSubscribed}
                >
                  {isSubscribed ? (
                    <>
                      <span className="btn-icon">✓</span>
                      <span>Subscribed!</span>
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">→</span>
                      <span>Subscribe</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Links Grid */}
        <div className="footer-links-section">
          <div className="footer-grid">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="footer-column">
                <h4 className="footer-heading">{category}</h4>
                <ul className="footer-links">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a href={link.href} className="footer-link">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Social & Brand Section */}
        <div className="footer-bottom">
          <div className="footer-brand">
            <div className="brand-section">
              <h2 className="brand-logo">
                <span className="logo-met">Met</span>
                <span className="logo-flix">flix</span>
              </h2>
              <p className="brand-tagline">
                Your ultimate destination for premium entertainment
              </p>
            </div>
          </div>

          <div className="social-section">
            <h4 className="social-heading">Follow Us</h4>
            <div className="social-links">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="social-link"
                  title={social.name}
                >
                  <span className="social-icon">{social.icon}</span>
                  <span className="social-name">{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bar">
          <div className="footer-bar-content">
            <div className="copyright">
              <span className="copyright-symbol">©</span>
              <span>{currentYear} Metflix. All rights reserved.</span>
            </div>
            
            <div className="footer-extras">
              <div className="language-selector">
                <button className="language-btn">
                  <span className="globe-icon">🌐</span>
                  <span>English</span>
                  <span className="dropdown-icon">▼</span>
                </button>
              </div>
              
              <div className="region-info">
                <span className="region-text">Available worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

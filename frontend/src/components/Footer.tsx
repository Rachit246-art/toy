import React from 'react';
import { useNavigate } from 'react-router-dom';
import OnlineStoresBanner from './OnlineStoresBanner';
import './Footer.css';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <OnlineStoresBanner />
      <footer className="site-footer">
        {/* Wave top border */}
      <div className="footer-wave">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,30 C200,60 400,0 600,30 C800,60 1000,0 1200,30 L1200,60 L0,60 Z" fill="#FFF5F8" />
        </svg>
      </div>

      <div className="footer-body">
        <div className="footer-container">

          {/* Brand column */}
          <div className="footer-col footer-brand">
            <div className="footer-logo">
              <span className="text-purple">Pigg</span>
              <span className="text-yellow">l</span>
              <span className="text-orange">i</span>
              <span className="text-blue">t</span>
              <span className="text-pink">z</span>
            </div>
            <p className="footer-tagline">Little Prints. Big Smiles. 🎉</p>
            <p className="footer-desc">
              Handcrafted 3D printed toys made with love by the artisan team at PINAKA TECHNOLOGIES S G PVT LTD.
            </p>
          </div>

          {/* Quick links */}
          <div className="footer-col">
            <h4 className="footer-heading text-purple">Quick Links</h4>
            <ul className="footer-links">
              <li><button onClick={() => navigate('/')}>🏠 Home</button></li>
              <li><button onClick={() => navigate('/shop')}>🧸 Shop Toys</button></li>
              <li><button onClick={() => navigate('/about')}>🌈 About Us</button></li>
              <li><button onClick={() => navigate('/contact')}>💌 Contact</button></li>
              <li><button onClick={() => navigate('/privacy-policy')}>🔒 Privacy Policy</button></li>
              <li><button onClick={() => navigate('/terms-conditions')}>📜 Terms & Conditions</button></li>
              <li><button onClick={() => navigate('/shipping-policy')}>🚚 Shipping Policy</button></li>
              <li><button onClick={() => navigate('/return-policy')}>🔄 Return Policy</button></li>
              <li><button onClick={() => navigate('/payment-policy')}>💳 Payment Policy</button></li>
              <li><button onClick={() => navigate('/personalized-product-policy')}>🎨 Personalized Policy</button></li>
              <li><button onClick={() => navigate('/disclaimer')}>⚠️ Disclaimer</button></li>
              <li><button onClick={() => navigate('/cookie-policy')}>🍪 Cookie Policy</button></li>
            </ul>
          </div>

          {/* Contact info */}
          <div className="footer-col">
            <h4 className="footer-heading text-pink">Get in Touch</h4>
            <ul className="footer-links">
              <li>📍 PINAKA TECHNOLOGIES S G PVT LTD, India</li>
              <li>✉️ pigglits3d@gmail.com</li>
              <li>⏰ Reply within 24 hours</li>
            </ul>
          </div>

          {/* Fun facts */}
          <div className="footer-col">
            <h4 className="footer-heading text-orange">Why Pigglitz?</h4>
            <ul className="footer-links">
              <li>🎨 Unique 3D printed designs</li>
              <li>🛡️ Safe, child-friendly materials</li>
              <li>⭐ Artisan crafted by experts</li>
              <li>🎁 New toys added regularly</li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-inner">
            <p>© 2026 <strong>PINAKA TECHNOLOGIES S G PVT LTD</strong>. All rights reserved.</p>
            <div className="developer-credit">
              Pigglitz | Made with ❤️ by <a href="https://www.linkedin.com/in/rachit-sharma-530316339/" target="_blank" rel="noopener noreferrer"><span>Rachit</span></a>
            </div>
          </div>
        </div>
      </div>
      </footer>
    </>
  );
};

export default Footer;

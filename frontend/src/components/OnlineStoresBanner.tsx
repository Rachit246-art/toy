import React from 'react';
import './OnlineStoresBanner.css';

const OnlineStoresBanner: React.FC = () => {
  return (
    <div className="online-stores-container">
      <div className="online-stores-box">
        <div className="online-stores-header">
          <h2>Online Stores</h2>
        </div>
        <div className="online-stores-logos">
          <a href="https://www.amazon.in" target="_blank" rel="noopener noreferrer" className="store-link">
            <div className="logo-placeholder">
              <span className="logo-amazon">amazon</span>
            </div>
          </a>
          <a href="https://blinkit.com" target="_blank" rel="noopener noreferrer" className="store-link">
            <div className="logo-placeholder">
              <span className="logo-blinkit"><span className="black">Blink</span><span className="green">it</span></span>
            </div>
          </a>
          <a href="https://ondc.org" target="_blank" rel="noopener noreferrer" className="store-link">
            <div className="logo-placeholder">
              <span className="logo-ondc">ONDC</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default OnlineStoresBanner;

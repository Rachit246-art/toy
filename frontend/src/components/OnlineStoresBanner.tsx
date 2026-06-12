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
          <a href="https://www.flipkart.com" target="_blank" rel="noopener noreferrer" className="store-link">
            <div className="logo-placeholder">
              <span className="logo-flipkart">Flipkart</span>
            </div>
          </a>
          <a href="https://www.indiamart.com" target="_blank" rel="noopener noreferrer" className="store-link">
            <div className="logo-placeholder">
              <span className="logo-indiamart">IndiaMART</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default OnlineStoresBanner;

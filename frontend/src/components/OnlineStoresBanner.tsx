import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OnlineStoresBanner.css';
import API_BASE from '../config';

const OnlineStoresBanner: React.FC = () => {
  const [links, setLinks] = useState({
    amazonStoreLink: "https://www.amazon.in/l/27943762031?me=AX3F3SGHVD4DN&ref_=ssf_share",
    flipkartStoreLink: "https://www.flipkart.com",
    indiamartStoreLink: "https://www.indiamart.com/pinakatechnologiessg/"
  });

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/settings/online-stores`);
        if (response.data) {
          setLinks(prev => ({
            amazonStoreLink: response.data.amazonStoreLink || prev.amazonStoreLink,
            flipkartStoreLink: response.data.flipkartStoreLink || prev.flipkartStoreLink,
            indiamartStoreLink: response.data.indiamartStoreLink || prev.indiamartStoreLink
          }));
        }
      } catch (error) {
        console.error("Failed to fetch online store links:", error);
      }
    };
    fetchLinks();
  }, []);

  return (
    <div className="online-stores-container">
      <div className="online-stores-box">
        <div className="online-stores-header">
          <h2>Online Stores</h2>
        </div>
        <div className="online-stores-logos">
          {links.amazonStoreLink && (
            <a href={links.amazonStoreLink} target="_blank" rel="noopener noreferrer" className="store-link">
              <div className="logo-placeholder">
                <span className="logo-amazon">amazon</span>
              </div>
            </a>
          )}
          {links.flipkartStoreLink && (
            <a href={links.flipkartStoreLink} target="_blank" rel="noopener noreferrer" className="store-link">
              <div className="logo-placeholder">
                <span className="logo-flipkart">Flipkart</span>
              </div>
            </a>
          )}
          {links.indiamartStoreLink && (
            <a href={links.indiamartStoreLink} target="_blank" rel="noopener noreferrer" className="store-link">
              <div className="logo-placeholder">
                <span className="logo-indiamart">IndiaMART</span>
              </div>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnlineStoresBanner;

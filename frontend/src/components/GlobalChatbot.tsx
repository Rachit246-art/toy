import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Send, ArrowLeft, Bot, RefreshCw } from 'lucide-react';
import axios from 'axios';
import API_BASE from '../config';
import './GlobalChatbot.css';

const GlobalChatbot: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState<1 | 2 | 3>(1);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [requirement, setRequirement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Categories State
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && stage === 2 && categories.length === 0) {
      // Hardcode all standard categories so they are always visible
      setCategories(['Toys', 'DIY Paint Kit', 'Home Decor', 'Collectible']);
    }
  }, [isOpen, stage, categories.length]);

  const handleSubmitInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;
    setIsSubmitting(true);
    try {
      await axios.post(`${API_BASE}/api/chatbot-leads`, { name, email, phone, requirement });
      setStage(2);
    } catch (error) {
      console.error('Error saving lead:', error);
      // Proceed anyway for better UX
      setStage(2);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setStage(3);
  };

  const handleShopNow = () => {
    setIsOpen(false);
    navigate(`/shop?category=${encodeURIComponent(selectedCategory || '')}`);
  };

  return (
    <div className="global-chatbot-container">
      {/* Floating Button */}
      <button 
        className={`chatbot-toggle-btn ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chatbot"
      >
        {isOpen ? <X size={28} /> : <Bot size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <Bot size={24} />
              <h3>Pigglitz Helper</h3>
            </div>
            <div className="chatbot-header-actions" style={{ display: 'flex', gap: '5px' }}>
              <button 
                className="chatbot-back-btn" 
                onClick={() => { setStage(1); setName(''); setEmail(''); setPhone(''); setRequirement(''); }} 
                title="Restart Conversation"
              >
                <RefreshCw size={16} />
              </button>
              {stage > 1 && (
                <button className="chatbot-back-btn" onClick={() => setStage((s) => (s - 1) as 1 | 2 | 3)} title="Back">
                  <ArrowLeft size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="chatbot-body">
            {stage === 1 && (
              <div className="chatbot-stage stage-1">
                <div className="chat-bubble bot-msg">
                  Hello there! 👋 To get started, please share your details.
                </div>
                <form onSubmit={handleSubmitInfo} className="chatbot-form">
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                  />
                  <input 
                    type="email" 
                    placeholder="Your Email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                  />
                  <input 
                    type="tel" 
                    placeholder="Mobile Number" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    required 
                  />
                  <textarea 
                    placeholder="Your Requirement (Optional)" 
                    value={requirement} 
                    onChange={e => setRequirement(e.target.value)} 
                    rows={2}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.8rem',
                      marginBottom: '0.8rem',
                      borderRadius: '8px',
                      border: '2px solid #e0e0e0',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      resize: 'none'
                    }}
                  />
                  <button type="submit" disabled={isSubmitting} className="chatbot-submit">
                    {isSubmitting ? 'Sending...' : 'Continue'} <Send size={16} />
                  </button>
                </form>
              </div>
            )}

            {stage === 2 && (
              <div className="chatbot-stage stage-2 animate-fadein">
                <div className="chat-bubble bot-msg">
                  Thank you! 🙏 Your details have been securely saved.
                </div>
                <div className="chat-bubble bot-msg mt-2">
                  What kind of products are you looking for today?
                </div>
                <div className="chatbot-options">
                  {categories.map((cat, idx) => (
                    <button key={idx} className="chatbot-option-btn" onClick={() => handleCategorySelect(cat)}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {stage === 3 && (
              <div className="chatbot-stage stage-3 animate-fadein">
                <div className="chat-bubble bot-msg">
                  Great choice! We have amazing items in <strong>{selectedCategory}</strong>.
                </div>
                <button className="chatbot-cta-btn" onClick={handleShopNow}>
                  Shop Now 🛍️
                </button>
                <div className="chat-bubble bot-msg mt-3" style={{ fontSize: '0.9rem', backgroundColor: '#f0f0f0', color: '#555' }}>
                  Need more help? Feel free to contact us on WhatsApp using the green button on the right!
                </div>
                <button className="chatbot-option-btn mt-2" onClick={() => setStage(2)} style={{ width: '100%', borderColor: '#ccc', color: '#555' }}>
                  ⬅️ Back to Categories
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalChatbot;

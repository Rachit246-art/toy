import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../config';
import './Hero.css';

const Hero: React.FC = () => {
  const [heroProduct, setHeroProduct] = useState<any>(null);
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const slidesRes = await axios.get(`${API_BASE}/api/hero-slides`);
        if (slidesRes.data && Array.isArray(slidesRes.data) && slidesRes.data.length > 0) {
          setHeroSlides(slidesRes.data);
        } else {
          const prodRes = await axios.get(`${API_BASE}/api/products/new-arrivals`);
          if (prodRes.data && prodRes.data.length > 0) {
            setHeroProduct(prodRes.data[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch hero data', err);
      }
    };
    fetchHeroData();
  }, []);

  useEffect(() => {
    if (heroSlides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [heroSlides.length]);

  const nextSlide = () => setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlideIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const activeSlide = heroSlides.length > 0 ? heroSlides[currentSlideIndex] : null;

  return (
    <section className="hero" style={activeSlide ? { background: `linear-gradient(135deg, #FFF5F8 0%, ${activeSlide.backgroundColor}33 100%)`, transition: 'background 0.5s ease' } : {}}>
      <div className="container hero-container">
        <div className="hero-content" key={currentSlideIndex}>
          <div className="badge animate-bounce">
            <Sparkles size={16} /> Artisan Series by PINAKA TECHNOLOGIES
          </div>
          
          {activeSlide ? (
            <>
              <h1 className="hero-title">
                <span className="text-purple">{activeSlide.titleLine1}</span><br />
                <span className="text-pink">{activeSlide.titleLine2}</span>
              </h1>
              <p className="hero-subtitle">
                {activeSlide.description}
              </p>
              <div className="hero-actions">
                <button className="btn-playful btn-primary" onClick={() => navigate(activeSlide.buttonLink)}>
                  {activeSlide.buttonText} <ArrowRight size={20} style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="hero-title">
                <span className="text-purple">Little Prints.</span><br />
                <span className="text-pink">Big Smiles.</span>
              </h1>
              <p className="hero-subtitle">
                Welcome to Pigglitz, your 3D Printing Pitara! Discover magical, colorful, and fun 3D printed toys made just for you!
              </p>
              <div className="hero-actions">
                <button className="btn-playful btn-primary" onClick={() => navigate('/toys')}>
                  Shop Now <ArrowRight size={20} style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />
                </button>
                <button className="btn-playful btn-secondary" onClick={() => navigate('/about')}>
                  Explore Magic
                </button>
              </div>
            </>
          )}
        </div>
        <div className="hero-image-container">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          
          {activeSlide ? (
            <div style={{ position: 'relative' }}>
              <div 
                className="hero-image-placeholder animate-bounce"
                style={{
                  background: activeSlide.backgroundColor || 'var(--color-yellow)',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  padding: 0,
                  border: '4px solid white',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'background 0.5s ease'
                }}
              >
                {activeSlide.imageUrl ? (
                  <img src={activeSlide.imageUrl} alt="slide" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span className="hero-toy-emoji">{activeSlide.emoji || '🧸'}</span>
                )}
              </div>
              
              {heroSlides.length > 1 && (
                <div style={{ position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px' }}>
                  <button onClick={prevSlide} style={{ background: 'white', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', color: 'var(--color-purple)' }}><ChevronLeft size={20} /></button>
                  <button onClick={nextSlide} style={{ background: 'white', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', color: 'var(--color-purple)' }}><ChevronRight size={20} /></button>
                </div>
              )}
            </div>
          ) : heroProduct ? (
            <div 
              className="hero-image-placeholder animate-bounce"
              onClick={() => navigate(`/product/${heroProduct._id}`)}
              style={{
                background: heroProduct.imageColor || 'var(--color-yellow)',
                cursor: 'pointer',
                overflow: 'hidden',
                padding: 0,
                border: '4px solid white',
                display: 'flex',
                flexDirection: 'column'
              }}
              title={`View ${heroProduct.name}`}
            >
              {heroProduct.imageUrl ? (
                <img src={heroProduct.imageUrl} alt={heroProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span className="hero-toy-emoji">{heroProduct.emoji || '🧸'}</span>
              )}
              <div style={{
                position: 'absolute',
                bottom: '10px',
                background: 'rgba(255,255,255,0.9)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontWeight: 'bold',
                color: 'var(--color-purple)',
                fontSize: '0.9rem',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                whiteSpace: 'nowrap'
              }}>
                New Launch!
              </div>
            </div>
          ) : (
            <div className="hero-image-placeholder animate-bounce">
              <span className="text-purple" style={{fontSize: '4rem', fontFamily: 'var(--font-heading)'}}>Toy Box!</span>
            </div>
          )}

          {/* Decorative Stars */}
          <div className="star star-1 animate-wiggle">⭐</div>
          <div className="star star-2 animate-wiggle">⭐</div>
          <div className="star star-3 animate-wiggle">⭐</div>
        </div>
      </div>
      
      {/* Wavy bottom */}
      <div className="custom-shape-divider-bottom-1685532000">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;

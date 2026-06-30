import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../config';
import './Hero.css';

const Hero: React.FC = () => {
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
          // Fallback static banner
          setHeroSlides([{
            imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            buttonLink: '/toys'
          }]);
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

  const renderSlides = () => {
    return heroSlides.map((slide, idx) => (
      <div 
        className="hero-slide-wrapper" 
        style={{ width: `${100 / heroSlides.length}%`, cursor: slide.buttonLink ? 'pointer' : 'default' }} 
        key={idx}
        onClick={() => {
          if (slide.buttonLink) {
            if (slide.buttonLink.startsWith('http')) {
              window.open(slide.buttonLink, '_blank');
            } else {
              navigate(slide.buttonLink);
            }
          }
        }}
      >
        <div className="hero-banner-image">
          {slide.imageUrl ? (
             <img src={slide.imageUrl} alt={`Banner ${idx + 1}`} />
          ) : (
             <div className="hero-banner-placeholder">
               <h2>Welcome to Pigglitz</h2>
             </div>
          )}
        </div>
      </div>
    ));
  };

  const slidesCount = Math.max(heroSlides.length, 1);

  return (
    <section className="hero">
      <div className="hero-slider">
        <div 
          className="hero-slider-track" 
          style={{ 
            width: `${slidesCount * 100}%`,
            transform: `translateX(-${(currentSlideIndex / slidesCount) * 100}%)`
          }}
        >
          {renderSlides()}
        </div>
      </div>

      {heroSlides.length > 1 && (
        <div className="hero-nav-buttons">
          <button onClick={prevSlide} className="hero-nav-btn"><ChevronLeft size={24} /></button>
          <div className="hero-dots">
            {heroSlides.map((_, idx) => (
              <span 
                key={idx} 
                className={`hero-dot ${idx === currentSlideIndex ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setCurrentSlideIndex(idx); }}
              />
            ))}
          </div>
          <button onClick={nextSlide} className="hero-nav-btn"><ChevronRight size={24} /></button>
        </div>
      )}
    </section>
  );
};

export default Hero;

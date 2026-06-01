
import { Sparkles, ArrowRight } from 'lucide-react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <div className="badge animate-bounce">
            <Sparkles size={16} /> Artisan Series by PINAKA TECHNOLOGIES
          </div>
          <h1 className="hero-title">
            <span className="text-purple">Little Prints.</span><br />
            <span className="text-pink">Big Smiles.</span>
          </h1>
          <p className="hero-subtitle">
            Welcome to Pigglitz, your 3D Printing Pitara! Discover magical, colorful, and fun 3D printed toys made just for you!
          </p>
          <div className="hero-actions">
            <button className="btn-playful btn-primary">
              Shop Now <ArrowRight size={20} style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />
            </button>
            <button className="btn-playful btn-secondary">
              Explore Magic
            </button>
          </div>
        </div>
        <div className="hero-image-container">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="hero-image-placeholder animate-bounce">
            <span className="text-purple" style={{fontSize: '4rem', fontFamily: 'var(--font-heading)'}}>Toy Box!</span>
          </div>
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

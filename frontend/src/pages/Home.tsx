import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { ShoppingBag, Star, Sparkles, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import VideoReelSection from '../components/VideoReelSection';
import Footer from '../components/Footer';
import './Home.css';

interface Product {
  _id: string;
  name: string;
  price: string;
  imageColor: string;
  badge: string;
}

/* ── New Arrivals data ── */
const NEW_ARRIVALS = [
  { id: 'n1', emoji: '🚀', color: '#C8B6FF', name: 'Space Rocket Jr.', price: '₹649', tag: 'NEW' },
  { id: 'n2', emoji: '🐉', color: '#B5EAD7', name: 'Dragon Flame',     price: '₹849', tag: 'NEW' },
  { id: 'n3', emoji: '🎠', color: '#FFDAC1', name: 'Carousel Pony',    price: '₹699', tag: 'NEW' },
  { id: 'n4', emoji: '🦊', color: '#FFB7B2', name: 'Foxy Tails',       price: '₹599', tag: 'NEW' },
  { id: 'n5', emoji: '🐙', color: '#AED9E0', name: 'Octo Squish',      price: '₹729', tag: 'NEW' },
  { id: 'n6', emoji: '🦋', color: '#E2F0CB', name: 'Flutter Wings',    price: '₹549', tag: 'NEW' },
  { id: 'n7', emoji: '🐻', color: '#FFEAA7', name: 'Honey Bear',       price: '₹679', tag: 'NEW' },
  { id: 'n8', emoji: '🦁', color: '#FFD6A5', name: 'Leo the Lion',     price: '₹719', tag: 'NEW' },
];

/* ── Featured data ── */
const FEATURED_ITEMS = [
  { id: 'f1', emoji: '🦕', color: '#A8E6CF', badge: '⭐ Best Seller', name: 'Dino Roar Rex',    desc: 'Our most-loved 3D printed dinosaur — vibrant, durable, and roar-ready. Perfect for little adventurers aged 3+.', price: '₹899', stars: 5 },
  { id: 'f2', emoji: '🤖', color: '#B5D5FF', badge: '🔥 Hot Pick',    name: 'Robo Buddy X',     desc: 'A friendly robot companion with movable arms. Kids love building stories around him!',                             price: '₹749', stars: 5 },
  { id: 'f3', emoji: '🦄', color: '#FFD6E8', badge: '💜 Fan Fave',    name: 'Sparkle Unicorn',  desc: 'Magical, glittery, and full of rainbow energy. Every child\'s dream companion.',                                  price: '₹799', stars: 4 },
  { id: 'f4', emoji: '🐬', color: '#B2EBF2', badge: '🌊 New Hit',     name: 'Dolphin Dash',     desc: 'Smooth, sleek, and super fun — this 3D printed dolphin is a bath-time favourite!',                               price: '₹669', stars: 4 },
  { id: 'f5', emoji: '🦸', color: '#E1BEE7', badge: '💥 Top Rated',   name: 'Mini Hero Pack',   desc: 'A set of three tiny superheroes ready to save the day. Mix, match, and play!',                                   price: '₹999', stars: 5 },
];

/* ── Reusable star rating ── */
const StarRating: React.FC<{ count: number }> = ({ count }) => (
  <div className="slider-stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} style={{ color: i < count ? 'var(--color-yellow)' : '#ddd', fontSize: '0.95rem' }}>★</span>
    ))}
  </div>
);

/* ══════════════════════════════════════════
   Generic auto-sliding carousel hook
══════════════════════════════════════════ */
function useCarousel(total: number, visibleCount: number, autoMs = 3000) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxIndex = Math.max(0, total - visibleCount);

  const next = useCallback(() => setIndex(i => (i >= maxIndex ? 0 : i + 1)), [maxIndex]);
  const prev = useCallback(() => setIndex(i => (i <= 0 ? maxIndex : i - 1)), [maxIndex]);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, autoMs);
  }, [next, autoMs]);

  useEffect(() => {
    reset();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [reset]);

  const handleNext = () => { next(); reset(); };
  const handlePrev = () => { prev(); reset(); };

  return { index, handleNext, handlePrev, setIndex: (i: number) => { setIndex(i); reset(); } };
}

/* ══════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════ */
const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  /* carousel state */
  const arrivalVisible = 4;
  const featuredVisible = 1;
  const arrivals = useCarousel(NEW_ARRIVALS.length, arrivalVisible, 2800);
  const featured = useCarousel(FEATURED_ITEMS.length, featuredVisible, 4000);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Failed to fetch products', err));
  }, []);

  return (
    <div className="home-page">
      <Navbar />

      {/* ── 1. HERO ── */}
      <Hero />

      {/* ── 2. NEW ARRIVALS (sliding) ── */}
      <section className="home-section arrivals-section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-pill orange-pill">
                <Zap size={13} fill="var(--color-orange)" color="var(--color-orange)" /> Just Landed
              </span>
              <h2 className="section-title text-orange">New Arrivals 🎉</h2>
              <p className="section-sub">Fresh off the 3D printer — be the first to grab them!</p>
            </div>
            <div className="slider-controls">
              <button className="slider-btn" onClick={arrivals.handlePrev} aria-label="Previous">
                <ChevronLeft size={22} />
              </button>
              <button className="slider-btn" onClick={arrivals.handleNext} aria-label="Next">
                <ChevronRight size={22} />
              </button>
            </div>
          </div>

          {/* Track */}
          <div className="slider-viewport">
            <div
              className="arrivals-track"
              style={{ transform: `translateX(calc(-${arrivals.index} * (220px + 1.5rem)))` }}
            >
              {NEW_ARRIVALS.map(item => (
                <div key={item.id} className="arrival-card">
                  <div className="arrival-img" style={{ backgroundColor: item.color }}>
                    <span className="arrival-emoji">{item.emoji}</span>
                    <span className="new-ribbon">NEW</span>
                  </div>
                  <div className="arrival-body">
                    <h4 className="arrival-name">{item.name}</h4>
                    <p className="arrival-price">{item.price}</p>
                    <button className="btn-playful btn-secondary arrival-btn" onClick={() => navigate('/shop')}>
                      <ShoppingBag size={14} /> Add to Box
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="slider-dots">
            {NEW_ARRIVALS.map((_, i) => (
              <button
                key={i}
                className={`dot${arrivals.index === i ? ' dot-active' : ''}`}
                onClick={() => arrivals.setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. FEATURED (sliding) ── */}
      <section className="home-section featured-section">
        {/* decorative bg blobs */}
        <div className="feat-blob feat-blob-1" />
        <div className="feat-blob feat-blob-2" />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-head">
            <div>
              <span className="section-pill purple-pill">
                <Star size={13} fill="var(--color-yellow)" color="var(--color-yellow)" /> Featured Picks
              </span>
              <h2 className="section-title text-purple">Toys Kids Can't Stop Talking About</h2>
              <p className="section-sub">Hand-picked by our team — the absolute best of Pigglitz!</p>
            </div>
            <div className="slider-controls">
              <button className="slider-btn" onClick={featured.handlePrev} aria-label="Previous">
                <ChevronLeft size={22} />
              </button>
              <button className="slider-btn" onClick={featured.handleNext} aria-label="Next">
                <ChevronRight size={22} />
              </button>
            </div>
          </div>

          {/* Single-card featured slider */}
          <div className="featured-slider-viewport">
            <div
              className="featured-track"
              style={{ transform: `translateX(calc(-${featured.index} * 100%))` }}
            >
              {FEATURED_ITEMS.map(item => (
                <div key={item.id} className="featured-slide">
                  <div className="featured-slide-img" style={{ backgroundColor: item.color }}>
                    <span className="featured-slide-emoji">{item.emoji}</span>
                  </div>
                  <div className="featured-slide-body">
                    <span className="feat-badge">{item.badge}</span>
                    <StarRating count={item.stars} />
                    <h3 className="featured-slide-title">{item.name}</h3>
                    <p className="featured-slide-desc">{item.desc}</p>
                    <div className="featured-slide-footer">
                      <span className="featured-slide-price">{item.price}</span>
                      <button
                        className="btn-playful btn-primary"
                        style={{ backgroundColor: 'var(--color-pink)', color: 'white' }}
                        onClick={() => navigate('/shop')}
                      >
                        <ShoppingBag size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
                        Add to Box
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="slider-dots">
            {FEATURED_ITEMS.map((_, i) => (
              <button
                key={i}
                className={`dot dot-purple${featured.index === i ? ' dot-active-purple' : ''}`}
                onClick={() => featured.setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. MAGICAL TOY BOX ── */}
      <section className="home-section toybox-section container">
        <div className="section-head center-head">
          <div>
            <span className="section-pill">🧸 Full Collection</span>
            <h2 className="section-title text-purple">Magical Toy Box</h2>
            <p className="section-sub">Find the perfect 3D printed companion!</p>
          </div>
        </div>

        <div className="products-grid">
          {products.length > 0 ? (
            products.map(product => (
              <ProductCard
                key={product._id}
                name={product.name}
                price={product.price}
                imageColor={product.imageColor}
                badge={product.badge}
                onAddToCart={() =>
                  addToCart({
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    imageColor: product.imageColor,
                    emoji: '',
                  })
                }
              />
            ))
          ) : (
            <p className="text-center toybox-loading">Loading magical toys... 🧸</p>
          )}
        </div>
      </section>

      {/* ── 5. VIDEO SHOWCASE ── */}
      <section className="video-showcase-section">
        <div className="video-blob video-blob-1" />
        <div className="video-blob video-blob-2" />
        <div className="video-blob video-blob-3" />

        <div className="container video-inner">
          <div className="video-text-side">
            <span className="video-section-pill">
              <Sparkles size={13} /> Watch the Magic
            </span>
            <h2 className="video-headline">
              See the <span>Joy</span> on<br />Every Little Face
            </h2>
            <p className="video-subtext">
              Watch real kids light up as they unbox and play with their favourite Pigglitz 3D printed toys.
              Pure smiles, pure magic — straight from our workshop to their hands.
            </p>
            <div className="video-stats">
              <div className="video-stat">
                <div className="video-stat-number">500+</div>
                <div className="video-stat-label">Happy Kids</div>
              </div>
              <div className="video-stat">
                <div className="video-stat-number">50+</div>
                <div className="video-stat-label">Unique Toys</div>
              </div>
              <div className="video-stat">
                <div className="video-stat-number">4.9★</div>
                <div className="video-stat-label">Avg. Rating</div>
              </div>
            </div>
            <div className="video-tags">
              <span className="video-tag">🎨 3D Printed</span>
              <span className="video-tag">🛡️ Child Safe</span>
              <span className="video-tag">🌈 Vibrant Colors</span>
              <span className="video-tag">⚡ Fast Delivery</span>
            </div>
          </div>

          <div className="video-player-side">
            <div className="video-frame-wrapper">
              {/*
                Replace the src with your actual YouTube embed URL:
                https://www.youtube.com/embed/YOUR_VIDEO_ID?rel=0&modestbranding=1
              */}
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1"
                title="Kids playing with Pigglitz 3D printed toys"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. VIDEO REEL SECTION ── */}
      <VideoReelSection />

      {/* ── 7. FOOTER ── */}
      <Footer />
    </div>
  );
};

export default Home;

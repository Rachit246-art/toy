import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, Sparkles, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import VideoReelSection from '../components/VideoReelSection';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import API_BASE from '../config';
import './Home.css';

interface Product {
  _id: string;
  name: string;
  price: string;
  imageColor: string;
  imageUrl: string;
  badge: string;
  emoji: string;
  isFeatured: boolean;
  isNewArrival: boolean;
}



/* ── Reusable star rating ── */
const StarRating: React.FC<{ count: number }> = ({ count }) => (
  <div className="slider-stars">
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} style={{ color: i < count ? 'var(--color-yellow)' : '#ddd', fontSize: '0.95rem' }}>★</span>
    ))}
  </div>
);

/* ── FAQ accordion item ── */
const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item${open ? ' faq-item--open' : ''}`}>
      <button className="faq-question" onClick={() => setOpen(v => !v)}>
        <span>{question}</span>
        <span className="faq-chevron">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="faq-answer">{answer}</div>}
    </div>
  );
};

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

  return { index, handleNext, handlePrev, setIndex: (i: number) => { setIndex(i); reset(); }, maxIndex };
}

/* ══════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════ */
const Home: React.FC = () => {
  const [products, setProducts]         = useState<Product[]>([]);
  const [featuredProducts, setFeatured] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals]   = useState<Product[]>([]);
  const [showcaseUrl, setShowcaseUrl]   = useState('https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [arrivalVisible, setArrivalVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 600) return 1;
      if (window.innerWidth < 900) return 2;
      if (window.innerWidth < 1200) return 3;
    }
    return 4;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) setArrivalVisible(1);
      else if (window.innerWidth < 900) setArrivalVisible(2);
      else if (window.innerWidth < 1200) setArrivalVisible(3);
      else setArrivalVisible(4);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const featuredVisible = 1;
  const arrivals = useCarousel(
    newArrivals.length, arrivalVisible, 2800
  );
  const featured = useCarousel(
    featuredProducts.length, featuredVisible, 4000
  );

  useEffect(() => {
    // All products (Magical Toy Box)
    axios.get(`${API_BASE}/api/products`)
      .then(res => setProducts(res.data))
      .catch(err => console.error('Failed to fetch products', err));

    // Featured products from DB
    axios.get(`${API_BASE}/api/products/featured`)
      .then(res => setFeatured(res.data))
      .catch(() => {});

    // New arrivals from DB
    axios.get(`${API_BASE}/api/products/new-arrivals`)
      .then(res => setNewArrivals(res.data))
      .catch(() => {});

    // Showcase video URL
    axios.get(`${API_BASE}/api/settings/showcase-video`)
      .then(res => {
        if (res.data && res.data.showcaseVideoUrl) {
          setShowcaseUrl(res.data.showcaseVideoUrl);
        }
      })
      .catch(() => {});
  }, []);



  return (
    <div className="home-page">
      <SEO 
        title="Pigglitz - 3D Printing Pitara | Custom 3D Printed Toys" 
        description="Discover magical, colorful, and fun 3D printed toys at Pigglitz. We offer a wide range of custom, personalized, and unique 3D printed gifts for kids and collectors."
        keywords="Pigglitz, 3D printed toys, custom toys, 3d printing india, personalized gifts, kids toys, unique gifts"
      />
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
              style={{ transform: `translateX(calc(-${arrivals.index} * (260px + 1.5rem)))` }}
            >
              {newArrivals.length > 0 ? newArrivals.map((item: any) => (
                <div key={item._id} className="arrival-card" onClick={() => navigate(`/product/${item.name.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase()}`)} style={{ cursor: 'pointer' }}>
                  <div className="arrival-img" style={{ backgroundColor: item.imageUrl ? '#f8f8f8' : item.imageColor }}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} />
                    ) : (
                      <span className="arrival-emoji">{item.emoji || '🧸'}</span>
                    )}
                    <span className="new-ribbon">NEW</span>
                  </div>
                  <div className="arrival-body">
                    <h4 className="arrival-name">{item.name}</h4>
                    <p className="arrival-price">{item.price}</p>
                    <button className="btn-playful btn-secondary arrival-btn" onClick={(e) => {
                      e.stopPropagation();
                      addToCart({
                        _id: item._id,
                        name: item.name,
                        price: item.price,
                        imageColor: item.imageColor,
                        emoji: item.emoji || '🧸',
                        imageUrl: item.imageUrl,
                      });
                    }}>
                      <ShoppingBag size={14} /> Add to Box
                    </button>
                  </div>
                </div>
              )) : (
                <div style={{ padding: '2rem', textAlign: 'center', width: '100%', color: '#888' }}>No new arrivals yet.</div>
              )}
            </div>
          </div>

          {/* Dots */}
          <div className="slider-dots">
            {newArrivals.length > 0 && Array.from({ length: arrivals.maxIndex + 1 }).map((_, i) => (
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
              {featuredProducts.length > 0 ? featuredProducts.map((item: any) => (
                <div key={item._id} className="featured-slide" onClick={() => navigate(`/product/${item.name.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase()}`)} style={{ cursor: 'pointer' }}>
                  <div className="featured-slide-img" style={{ backgroundColor: item.imageUrl ? '#f8f8f8' : item.imageColor }}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <span className="featured-slide-emoji">{item.emoji || '🧸'}</span>
                    )}
                  </div>
                  <div className="featured-slide-body">
                    <span className="feat-badge">{item.badge || '⭐ Featured'}</span>
                    <StarRating count={item.stars || 5} />
                    <h3 className="featured-slide-title">{item.name}</h3>
                    <p className="featured-slide-desc">{item.desc || item.badge || ''}</p>
                    <div className="featured-slide-footer">
                      <span className="featured-slide-price">{item.price}</span>
                      <button
                        className="btn-playful btn-primary"
                        style={{ backgroundColor: 'var(--color-pink)', color: 'white' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart({
                            _id: item._id,
                            name: item.name,
                            price: item.price,
                            imageColor: item.imageColor,
                            emoji: item.emoji || '🧸',
                            imageUrl: item.imageUrl,
                          });
                        }}
                      >
                        <ShoppingBag size={16} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
                        Add to Box
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div style={{ padding: '2rem', textAlign: 'center', width: '100%', color: '#888' }}>No featured toys yet.</div>
              )}
            </div>
          </div>

          {/* Dots */}
          <div className="slider-dots">
            {featuredProducts.length > 0 && Array.from({ length: featured.maxIndex + 1 }).map((_, i) => (
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
                _id={product._id}
                name={product.name}
                price={product.price}
                imageColor={product.imageColor}
                imageUrl={product.imageUrl}
                badge={product.badge}
                emoji={product.emoji}
                onAddToCart={() =>
                  addToCart({
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    imageColor: product.imageColor,
                    emoji: product.emoji || '',
                    imageUrl: product.imageUrl,
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
              <iframe
                src={`${showcaseUrl}${showcaseUrl.includes('?') ? '&' : '?'}autoplay=1&mute=1&loop=1&playlist=${showcaseUrl.split('embed/')[1]?.split('?')[0] || ''}`}
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

      {/* ── 7. WHY CHOOSE US ── */}
      <section className="why-section">
        <div className="container">
          <div className="section-head center-head">
            <div>
              <span className="section-pill purple-pill">🏆 Why Pigglitz</span>
              <h2 className="section-title text-purple">Why Parents & Kids Love Us</h2>
              <p className="section-sub">Made with heart, designed for joy — here's what makes us different.</p>
            </div>
          </div>
          <div className="why-grid">
            {[
              { icon: '🌱', title: 'Plant-Based & Safe',    color: '#A8E6CF', desc: 'Every toy is made from non-toxic PLA (polylactic acid), a plant-based plastic that is completely safe for little hands.' },
              { icon: '🎨', title: 'Uniquely Designed',     color: '#B5D5FF', desc: 'No two toys look alike. Our in-house designers craft every piece with creativity and colour in mind.' },
              { icon: '🏭', title: 'Made in Kanpur',        color: '#FFDAC1', desc: 'Proudly designed, printed & shipped from our workshop in Naubasta, Kanpur — straight to your door.' },
              { icon: '⚡', title: '48-Hour Dispatch',      color: '#FFD6E8', desc: 'We aim to ship every order within 48 hours so your little one doesn\'t have to wait long!' },
              { icon: '🛡️', title: 'Durable & Tested',     color: '#C8B6FF', desc: 'Engineered for strength and built to last. Suitable for children aged 3 and above.' },
              { icon: '💜', title: 'With Love from Pinaka', color: '#E2F0CB', desc: 'Pigglitz is a Pinaka Technologies brand — our "PI" logo and passion for making smiles is at our core.' },
            ].map(item => (
              <div key={item.title} className="why-card">
                <div className="why-icon-box" style={{ backgroundColor: item.color }}>{item.icon}</div>
                <h3 className="why-title">{item.title}</h3>
                <p className="why-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. FAQ ── */}
      <section className="faq-section">
        <div className="container">
          <div className="section-head center-head">
            <div>
              <span className="section-pill orange-pill">❓ Got Questions</span>
              <h2 className="section-title text-orange">Frequently Asked Questions</h2>
              <p className="section-sub">Everything you need to know about Pigglitz toys.</p>
            </div>
          </div>
          <div className="faq-list">
            {[
              { q: 'What material are the toys made from?', a: 'Our toys are manufactured using high-quality PLA material through advanced 3D printing technology.' },
              { q: 'Are the toys safe for children?', a: 'Yes. Our toys are designed for children aged 3 years and above. Adult supervision is recommended for younger children.' },
              { q: 'Do the toys move?', a: 'Many of our products feature articulated and flexible joints that allow realistic movement.' },
              { q: 'Do you offer Cash on Delivery?', a: 'Availability of COD depends on serviceability in your location.' },
              { q: 'How long does delivery take?', a: 'Most orders are delivered within 3–10 business days across India.' },
              { q: 'Can I return a product?', a: 'Returns are not accepted except in cases of manufacturing defects, damage during transit, or incorrect products.' },
              { q: 'Do you accept bulk orders?', a: 'Yes. We offer special pricing for birthday return gifts, schools, events, and corporate gifting.' },
              { q: 'Can I customize products?', a: 'Certain products may be customized depending on quantity and design requirements.' },
              { q: 'Are the products made in India?', a: 'Yes. All products are proudly designed and manufactured in India.' },
              { q: 'How can I contact support?', a: 'You can reach us through the Contact Us page or email support@pigglitz.com.' },
            ].map((item, i) => (
              <FaqItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. VIDEO REEL SECTION ── */}
      {/* ── 9. FOOTER ── */}
      <Footer />
    </div>
  );
};

export default Home;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronDown, ChevronUp, Plus, Minus, Star, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import API_BASE from '../config';
import SEO from '../components/SEO';
import { Helmet } from 'react-helmet-async';
import './ProductDetailsPage.css';

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ProductDetails {
  _id: string;
  name: string;
  price: string;
  imageColor: string;
  imageUrl: string;
  galleryUrls: string[];
  emoji: string;
  badge: string;
  description: string;
  features: string;
  additionalInfo: string;
  models: string;
  reviews: Review[];
  seoKeywords?: string;
  category?: string;
}

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [mainImage, setMainImage] = useState('');
  const [qty, setQty] = useState(1);
  const [selectedModel, setSelectedModel] = useState('');
  
  const [openAccordion, setOpenAccordion] = useState<string | null>('description');

  // Review Form State
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/products/${id}`);
        setProduct(res.data);
        setMainImage(res.data.imageUrl);
        const modelsArr = res.data.models ? res.data.models.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
        if (modelsArr.length > 0) setSelectedModel(modelsArr[0]);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Toy not found or server error.');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    // Call addToCart multiple times to add the requested quantity, 
    // or we can update CartContext to support quantity in addToCart.
    // Our CartContext `addToCart` only increments by 1 if existing, or adds new with qty 1.
    // So we can loop, or ideally update CartContext. For now, looping is safe.
    for (let i = 0; i < qty; i++) {
      addToCart({
        _id: product._id,
        name: selectedModel ? `${product.name} (${selectedModel})` : product.name,
        price: product.price,
        imageColor: product.imageColor,
        emoji: product.emoji || '🧸',
        imageUrl: product.imageUrl
      });
    }
    
    // Provide a small visual feedback or redirect to cart
    navigate('/cart');
  };

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!reviewName.trim() || reviewRating === 0 || !reviewComment.trim()) {
      setReviewMsg('❌ Please provide a name, rating, and comment.');
      return;
    }
    
    setSubmittingReview(true);
    setReviewMsg('');
    
    try {
      const res = await axios.post(`${API_BASE}/api/products/${product._id}/reviews`, {
        name: reviewName,
        rating: reviewRating,
        comment: reviewComment
      });
      // Update local state with the new product data (including the new review)
      setProduct(res.data);
      // Reset form
      setReviewName('');
      setReviewRating(0);
      setReviewComment('');
      setReviewMsg('✅ Review submitted successfully!');
      setTimeout(() => setReviewMsg(''), 3000);
    } catch (err) {
      console.error(err);
      setReviewMsg('❌ Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="product-details-page">
        <Navbar />
        <div className="product-loading">
          <div className="spinner">🧸</div>
          <h2>Loading magic...</h2>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-page">
        <Navbar />
        <div className="product-error">
          <h2>Oops!</h2>
          <p>{error}</p>
          <button className="btn-playful btn-primary" onClick={() => navigate('/shop')}>Back to Shop</button>
        </div>
        <Footer />
      </div>
    );
  }

  // Combine main image and gallery for the thumbnail list
  const allImages = [product.imageUrl, ...(product.galleryUrls || [])].filter(Boolean);
  const modelsList = product.models ? product.models.split(',').map(s => s.trim()).filter(Boolean) : [];
  const featuresList = product.features ? product.features.split('\n').map(s => s.trim()).filter(Boolean) : [];

  const productTitle = `${product.name} | Pigglitz 3D Toys`;
  const productDesc = product.description || `Buy ${product.name} from Pigglitz. High-quality 3D printed toys.`;
  const productKeywords = product.seoKeywords || `${product.name}, ${product.category || 'toys'}, 3D printed toy, kids gift, pigglitz`;

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": allImages.length > 0 ? allImages : ["https://pigglitz.com/logo.png"],
    "description": productDesc,
    "sku": product._id,
    "offers": {
      "@type": "Offer",
      "url": `https://pigglitz.com/product/${product._id}`,
      "priceCurrency": "INR",
      "price": product.price.replace(/[^0-9.]/g, '') || "0",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <div className="product-details-page">
      <SEO 
        title={productTitle} 
        description={productDesc} 
        keywords={productKeywords} 
        url={`https://pigglitz.com/product/${product._id}`} 
        image={mainImage || 'https://pigglitz.com/logo.png'} 
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>
      <Navbar />
      
      <div className="container product-details-container">
        
        {/* Top Section: Images and Info */}
        <div className="product-top-section">
          
          {/* Left: Image Gallery */}
          <div className="product-gallery">
            <div className="thumbnail-list">
              {allImages.length > 0 ? (
                allImages.map((imgUrl, idx) => (
                  <div 
                    key={idx} 
                    className={`thumbnail-item ${mainImage === imgUrl ? 'active' : ''}`}
                    onClick={() => setMainImage(imgUrl)}
                  >
                    <img src={imgUrl} alt={`${product.name} thumbnail ${idx}`} />
                  </div>
                ))
              ) : (
                <div className="thumbnail-item active" style={{ backgroundColor: product.imageColor }}>
                  <span style={{ fontSize: '2rem' }}>{product.emoji || '🧸'}</span>
                </div>
              )}
            </div>
            
            <div className="main-image-display" style={{ backgroundColor: mainImage ? '#f8f8f8' : product.imageColor }}>
              {product.badge && <span className="product-badge-detail">{product.badge}</span>}
              {mainImage ? (
                <img src={mainImage} alt={product.name} />
              ) : (
                <span className="main-emoji">{product.emoji || '🧸'}</span>
              )}
            </div>
          </div>
          
          {/* Right: Product Info */}
          <div className="product-info-panel">
            <h1 className="product-title text-purple">{product.name}</h1>
            <div className="product-price-section">
              <span className="product-price">{product.price}</span>
              <span className="product-mrp-note">MRP is inclusive of all taxes.</span>
              {product.reviews && product.reviews.length > 0 && (
                <div className="product-avg-rating" onClick={() => setOpenAccordion('reviews')} style={{ cursor: 'pointer' }}>
                  <div className="stars">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const avg = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
                      return (
                        <Star key={i} size={16} fill={i < Math.round(avg) ? 'var(--color-yellow)' : 'transparent'} color={i < Math.round(avg) ? 'var(--color-yellow)' : '#ccc'} />
                      )
                    })}
                  </div>
                  <span className="review-count">({product.reviews.length} Reviews)</span>
                </div>
              )}
            </div>
            
            {featuresList.length > 0 && (
              <div className="product-features">
                <h3 className="features-title">Features:</h3>
                <ul className="features-list">
                  {featuresList.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            

            
            {modelsList.length > 0 && (
              <div className="models-section">
                <h4 className="models-title">MODEL</h4>
                <div className="models-grid">
                  {modelsList.map((mod, idx) => (
                    <button 
                      key={idx}
                      className={`model-btn ${selectedModel === mod ? 'active' : ''}`}
                      onClick={() => setSelectedModel(mod)}
                    >
                      {mod}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="add-to-cart-section">
              <div className="qty-selector">
                <button onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={16}/></button>
                <input type="number" value={qty} readOnly />
                <button onClick={() => setQty(qty + 1)}><Plus size={16}/></button>
              </div>
              <button className="add-to-cart-action-btn" onClick={handleAddToCart}>
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Section: Accordions */}
        <div className="product-bottom-section">
          
          {/* Description Accordion */}
          <div className="accordion-item">
            <button className="accordion-header" onClick={() => toggleAccordion('description')}>
              <span>Description</span>
              {openAccordion === 'description' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            <div className={`accordion-content ${openAccordion === 'description' ? 'open' : ''}`}>
              <div className="accordion-inner-content">
                {product.description ? (
                  product.description.split('\n').map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))
                ) : (
                  <p>A magical toy ready to bring smiles!</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Additional Info Accordion */}
          <div className="accordion-item">
            <button className="accordion-header" onClick={() => toggleAccordion('additionalInfo')}>
              <span>Additional Information</span>
              {openAccordion === 'additionalInfo' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            <div className={`accordion-content ${openAccordion === 'additionalInfo' ? 'open' : ''}`}>
              <div className="accordion-inner-content">
                {product.additionalInfo ? (
                  product.additionalInfo.split('\n').map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))
                ) : (
                  <p>No additional information available.</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Reviews Accordion */}
          <div className="accordion-item">
            <button className="accordion-header" onClick={() => toggleAccordion('reviews')}>
              <span>Reviews ({product.reviews?.length || 0})</span>
              {openAccordion === 'reviews' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            <div className={`accordion-content ${openAccordion === 'reviews' ? 'open' : ''}`}>
              <div className="accordion-inner-content reviews-content">
                
                {/* Existing Reviews List */}
                <div className="reviews-list">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map(review => (
                      <div key={review._id} className="review-card">
                        <div className="review-header">
                          <strong className="review-author">{review.name}</strong>
                          <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="review-stars">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={14} fill={i < review.rating ? 'var(--color-yellow)' : 'transparent'} color={i < review.rating ? 'var(--color-yellow)' : '#ccc'} />
                          ))}
                        </div>
                        <p className="review-text">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="no-reviews">No reviews yet. Be the first to review this magical toy!</p>
                  )}
                </div>

                {/* Leave a Review Form */}
                <div className="review-form-container">
                  <h4 className="review-form-title">Leave a Review</h4>
                  <form onSubmit={handleReviewSubmit} className="review-form">
                    
                    <div className="review-form-row">
                      <div className="review-input-group">
                        <label>Your Name *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Papa Bear"
                          value={reviewName}
                          onChange={e => setReviewName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="review-input-group rating-group">
                        <label>Your Rating *</label>
                        <div className="interactive-stars">
                          {[1, 2, 3, 4, 5].map(num => (
                            <button 
                              key={num}
                              type="button"
                              className="star-btn"
                              onMouseEnter={() => setReviewHoverRating(num)}
                              onMouseLeave={() => setReviewHoverRating(0)}
                              onClick={() => setReviewRating(num)}
                            >
                              <Star 
                                size={24} 
                                fill={(reviewHoverRating || reviewRating) >= num ? 'var(--color-yellow)' : 'transparent'} 
                                color={(reviewHoverRating || reviewRating) >= num ? 'var(--color-yellow)' : '#ccc'} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="review-input-group">
                      <label>Your Review *</label>
                      <textarea 
                        rows={4}
                        placeholder="Tell us how much your little one loved it!"
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        required
                      />
                    </div>

                    <div className="review-submit-row">
                      <button type="submit" className="btn-playful btn-primary" disabled={submittingReview}>
                        {submittingReview ? 'Submitting...' : <><Send size={16} /> Submit Review</>}
                      </button>
                      {reviewMsg && <span className={`review-msg ${reviewMsg.startsWith('✅') ? 'success' : 'error'}`}>{reviewMsg}</span>}
                    </div>

                  </form>
                </div>

              </div>
            </div>
          </div>
          
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;

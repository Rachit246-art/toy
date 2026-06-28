import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, Search, Star, User, X, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import API_BASE from '../config';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [announcement1, setAnnouncement1] = useState('🔥 FREE SHIPPING ABOVE ₹1000');
  const [announcement2, setAnnouncement2] = useState('🎉 USE CODE WIGGLE10 FOR 10% OFF.');

  useEffect(() => {
    fetch(`${API_BASE}/api/settings/announcements`)
      .then(res => res.json())
      .then(data => {
        if (data.announcementText1) setAnnouncement1(data.announcementText1);
        if (data.announcementText2) setAnnouncement2(data.announcementText2);
      })
      .catch(err => console.error("Error fetching announcements:", err));
  }, []);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const goTo = (path: string) => {
    navigate(path);
    setMenuOpen(false);
    setShowProfileMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = () => {
    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setMenuOpen(false);
      setShowProfileMenu(false);
    } else {
      goTo('/');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowProfileMenu(false);
    navigate('/');
  };

  return (
    <>
      <div className="announcement-bar">
        <div className="announcement-content">
          <span>{announcement1}</span>
          <span>{announcement2}</span>
          <span>{announcement1}</span>
          <span>{announcement2}</span>
          <span>{announcement1}</span>
          <span>{announcement2}</span>
          <span>{announcement1}</span>
          <span>{announcement2}</span>
        </div>
      </div>
      <nav className="navbar">
        <div className="container navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={handleLogoClick}>
          <span className="logo-text text-purple">Pigg</span>
          <span className="logo-text text-yellow">l</span>
          <span className="logo-text text-orange">i</span>
          <span className="logo-text text-blue">t</span>
          <span className="logo-text text-pink">z</span>
        </div>

        {/* Desktop Links */}
        <div className="navbar-links">
          <button className="nav-link-btn text-purple" onClick={() => goTo('/shop?category=Toys')}>
            Toys <Star size={14} fill="var(--color-yellow)" color="var(--color-yellow)" style={{ verticalAlign: 'middle' }} />
          </button>
          <button className="nav-link-btn text-pink" onClick={() => goTo('/bundle')}>Bundle</button>
          <button className="nav-link-btn text-pink" onClick={() => goTo('/shop?category=DIY Paint Kit')}>DIY Paint Kit</button>
          <button className="nav-link-btn text-orange" onClick={() => goTo('/shop?category=Collectible')}>Collectible</button>
          <button className="nav-link-btn text-blue" onClick={() => goTo('/shop?category=Home Decor')}>Home Decor</button>
          <button className="nav-link-btn text-blue" onClick={() => goTo('/about')}>About Us</button>
          <button className="nav-link-btn text-orange" onClick={() => goTo('/contact')}>Contact</button>
        </div>

        {/* Action Icons */}
        <div className="navbar-actions">
          <button className="icon-btn text-pink" onClick={() => goTo('/shop')} title="Search">
            <Search size={22} />
          </button>
          <button className="icon-btn text-red cart-btn" onClick={() => goTo('/wishlist')} title="Wishlist">
            <Heart size={22} />
            {wishlistCount > 0 && <span className="cart-badge bg-pink">{wishlistCount}</span>}
          </button>
          <button className="icon-btn text-purple cart-btn" onClick={() => goTo('/cart')} title="Cart">
            <ShoppingCart size={22} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          
          {user ? (
            <div className="nav-profile-container" style={{ position: 'relative' }}>
              <button 
                className="icon-btn text-blue user-profile-btn" 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{ fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', width: 'auto', padding: '0 0.5rem' }}
              >
                <User size={20} />
                <span className="hide-mobile">{user.name ? user.name.split(' ')[0] : 'User'}</span>
              </button>
              
              {showProfileMenu && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">Hi, {user.name || 'User'}!</div>
                  {user.role === 'admin' ? (
                    <button onClick={() => goTo('/admin')}>Admin Panel</button>
                  ) : (
                    <button onClick={() => goTo('/profile')}>My Profile & Orders</button>
                  )}
                  <button onClick={handleLogout} style={{ color: '#dc3545' }}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <button className="icon-btn text-blue" onClick={() => goTo('/login')} title="Login / Sign Up">
              <User size={22} />
            </button>
          )}

          {/* Hamburger — mobile only */}
          <button className="icon-btn mobile-menu-btn text-purple" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="mobile-nav-menu">
          <button className="mobile-nav-link text-purple" onClick={() => goTo('/shop?category=Toys')}>🧸 Toys</button>
          <button className="mobile-nav-link text-pink" onClick={() => goTo('/bundle')}>🎁 Create Bundle</button>
          <button className="mobile-nav-link text-pink" onClick={() => goTo('/shop?category=DIY Paint Kit')}>🎨 DIY Paint Kit</button>
          <button className="mobile-nav-link text-orange" onClick={() => goTo('/shop?category=Collectible')}>💎 Collectible</button>
          <button className="mobile-nav-link text-blue" onClick={() => goTo('/shop?category=Home Decor')}>🏠 Home Decor</button>
          <button className="mobile-nav-link text-blue" onClick={() => goTo('/about')}>🌈 About Us</button>
          <button className="mobile-nav-link text-orange" onClick={() => goTo('/contact')}>💌 Contact</button>
          <button className="mobile-nav-link text-red" onClick={() => goTo('/wishlist')}>❤️ My Wishlist ({wishlistCount})</button>
          <button className="mobile-nav-link text-pink" onClick={() => goTo('/cart')}>🛒 My Cart ({cartCount})</button>
          
          {user ? (
            <>
              {user.role === 'admin' ? (
                <button className="mobile-nav-link text-purple" onClick={() => goTo('/admin')}>🔐 Admin Panel</button>
              ) : (
                <button className="mobile-nav-link text-purple" onClick={() => goTo('/profile')}>👤 My Profile</button>
              )}
              <button className="mobile-nav-link text-blue" onClick={handleLogout}>👋 Logout ({user.name || 'User'})</button>
            </>
          ) : (
            <button className="mobile-nav-link text-purple" onClick={() => goTo('/login')}>🔐 Login / Sign Up</button>
          )}
        </div>
      )}
    </nav>
    </>
  );
};

export default Navbar;

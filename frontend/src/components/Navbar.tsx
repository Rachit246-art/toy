import React from 'react';
import { ShoppingCart, Menu, Search, Star, User, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const goTo = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => goTo('/')}>
          <span className="logo-text text-purple">Pigg</span>
          <span className="logo-text text-yellow">l</span>
          <span className="logo-text text-orange">i</span>
          <span className="logo-text text-blue">t</span>
          <span className="logo-text text-pink">z</span>
        </div>

        {/* Desktop Links */}
        <div className="navbar-links">
          <button className="nav-link-btn text-purple" onClick={() => goTo('/shop')}>
            Shop Toys <Star size={14} fill="var(--color-yellow)" color="var(--color-yellow)" style={{ verticalAlign: 'middle' }} />
          </button>
          <button className="nav-link-btn text-blue" onClick={() => goTo('/about')}>About Us</button>
          <button className="nav-link-btn text-orange" onClick={() => goTo('/contact')}>Contact</button>
        </div>

        {/* Action Icons */}
        <div className="navbar-actions">
          <button className="icon-btn text-pink" onClick={() => goTo('/shop')} title="Search">
            <Search size={22} />
          </button>
          <button className="icon-btn text-purple cart-btn" onClick={() => goTo('/cart')} title="Cart">
            <ShoppingCart size={22} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button className="icon-btn text-blue" onClick={() => goTo('/login')} title="Admin">
            <User size={22} />
          </button>
          {/* Hamburger — mobile only */}
          <button className="icon-btn mobile-menu-btn text-purple" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="mobile-nav-menu">
          <button className="mobile-nav-link text-purple" onClick={() => goTo('/shop')}>🧸 Shop Toys</button>
          <button className="mobile-nav-link text-blue" onClick={() => goTo('/about')}>🌈 About Us</button>
          <button className="mobile-nav-link text-orange" onClick={() => goTo('/contact')}>💌 Contact</button>
          <button className="mobile-nav-link text-pink" onClick={() => goTo('/cart')}>🛒 My Cart ({cartCount})</button>
          <button className="mobile-nav-link text-purple" onClick={() => goTo('/login')}>🔐 Admin Login</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

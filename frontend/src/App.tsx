import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import ShopPage from './pages/ShopPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import UserDashboard from './pages/UserDashboard';
import BundlePage from './pages/BundlePage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CursorSprinkles from './components/CursorSprinkles';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import GlobalChatbot from './components/GlobalChatbot';

function App() {
  return (
    <HelmetProvider>
      <WishlistProvider>
        <CartProvider>
        <Router>
          <div className="App">
            <CursorSprinkles />
            <FloatingWhatsApp />
            <GlobalChatbot />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/profile" element={<UserDashboard />} />
              <Route path="/bundle" element={<BundlePage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            </Routes>
          </div>
        </Router>
        </CartProvider>
      </WishlistProvider>
    </HelmetProvider>
  );
}

export default App;

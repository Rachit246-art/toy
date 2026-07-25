import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ToyManagement from './pages/admin/ToyManagement';
import OrderManagement from './pages/admin/OrderManagement';
import UserManagement from './pages/admin/UserManagement';
import CouponManagement from './pages/admin/CouponManagement';
import VideoReelsManagement from './pages/admin/VideoReelsManagement';
import HeroBannersManagement from './pages/admin/HeroBannersManagement';
import PartnerBannersManagement from './pages/admin/PartnerBannersManagement';
import SiteSettingsManagement from './pages/admin/SiteSettingsManagement';
import ChatbotLeads from './pages/admin/ChatbotLeads';
import BlogManagement from './pages/admin/BlogManagement';
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
import TermsConditions from './pages/TermsConditions';
import ShippingPolicy from './pages/ShippingPolicy';
import ReturnPolicy from './pages/ReturnPolicy';
import PaymentPolicy from './pages/PaymentPolicy';
import PersonalizedProductPolicy from './pages/PersonalizedProductPolicy';
import Disclaimer from './pages/Disclaimer';
import CookiePolicy from './pages/CookiePolicy';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
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
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="toys" element={<ToyManagement />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="coupons" element={<CouponManagement />} />
                <Route path="reels" element={<VideoReelsManagement />} />
                <Route path="hero-banners" element={<HeroBannersManagement />} />
                <Route path="partner-banners" element={<PartnerBannersManagement />} />
                <Route path="site-settings" element={<SiteSettingsManagement />} />
                <Route path="leads" element={<ChatbotLeads />} />
                <Route path="blogs" element={<BlogManagement />} />
              </Route>
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
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/return-policy" element={<ReturnPolicy />} />
              <Route path="/payment-policy" element={<PaymentPolicy />} />
              <Route path="/personalized-product-policy" element={<PersonalizedProductPolicy />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogPostPage />} />
            </Routes>
          </div>
        </Router>
        </CartProvider>
      </WishlistProvider>
    </HelmetProvider>
  );
}

export default App;

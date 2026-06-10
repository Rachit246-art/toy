import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API_BASE from '../config';
import './Login.css';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  
  const navigate = useNavigate();

  // If already logged in
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'admin') navigate('/admin', { replace: true });
        else navigate('/shop', { replace: true });
      } catch (e) {
        // Handle parse error
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        // Login Request
        const res = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        if (res.data.user.role === 'admin') navigate('/admin');
        else navigate('/shop');
        
      } else {
        // Signup Request
        if (!name.trim() || !phone.trim() || !email.trim() || !password.trim()) {
          setError('All fields are required for sign up.');
          setLoading(false);
          return;
        }
        const res = await axios.post(`${API_BASE}/api/auth/register`, { name, phone, email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/shop');
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(isLogin ? 'Invalid email or password.' : 'Failed to create account.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Navbar />

      <div className="login-card-wrapper">
        <div className="login-card">
          
          <div className="auth-tabs">
            <button 
              className={`auth-tab ${isLogin ? 'active' : ''}`} 
              onClick={() => { setIsLogin(true); setError(''); }}
            >
              Login
            </button>
            <button 
              className={`auth-tab ${!isLogin ? 'active' : ''}`} 
              onClick={() => { setIsLogin(false); setError(''); }}
            >
              Sign Up
            </button>
          </div>

          <div className="login-header">
            <div className="login-icon animate-bounce-slow">{isLogin ? '👋' : '✨'}</div>
            <h2 className="text-purple login-title">{isLogin ? 'Welcome Back!' : 'Join the Magic'}</h2>
            <p className="login-sub">
              {isLogin ? 'Login to access your account' : 'Create an account to track your orders and more'}
            </p>
          </div>

          {error && (
            <div className="login-error">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            
            {!isLogin && (
              <>
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Papa Bear"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required={!isLogin}
                    className="playful-input"
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required={!isLogin}
                    className="playful-input"
                  />
                </div>
              </>
            )}

            {/* Email */}
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="playful-input"
                autoComplete="email"
              />
            </div>

            {/* Password with show/hide */}
            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="pw-wrapper">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder={isLogin ? 'Enter your password' : 'Create a secure password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="playful-input pw-input"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  className="pw-toggle"
                  onClick={() => setShowPw(v => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-playful btn-primary login-submit-btn"
              disabled={loading}
            >
              {loading ? '⏳ Please wait…' : (isLogin ? '🚀 Login' : '✨ Create Account')}
            </button>
          </form>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;

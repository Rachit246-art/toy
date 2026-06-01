import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <Navbar />

      <section className="contact-hero">
        <div className="floating-star star-a">💌</div>
        <div className="floating-star star-b">⭐</div>
        <h1>Say Hello!</h1>
        <p>We'd love to hear from you — questions, ideas, or just a fun hello!</p>
      </section>

      <div className="container contact-layout">
        <div className="contact-info">
          <div className="info-card">
            <div className="info-icon">📍</div>
            <h3>Our Location</h3>
            <p>PINAKA TECHNOLOGIES<br />India</p>
          </div>
          <div className="info-card">
            <div className="info-icon">✉️</div>
            <h3>Email Us</h3>
            <p>connect2rachit882@gmail.com</p>
          </div>
          <div className="info-card">
            <div className="info-icon">⏰</div>
            <h3>Response Time</h3>
            <p>We reply within 24 hours!</p>
          </div>
        </div>

        <div className="contact-form-wrapper">
          {submitted ? (
            <div className="success-message animate-bounce-slow">
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
              <h2 className="text-purple">Message Sent!</h2>
              <p>Thanks for reaching out! We'll get back to you soon.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <h2 className="text-purple">Send us a Message</h2>
              <input
                type="text"
                placeholder="Your Name"
                className="playful-input"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                className="playful-input"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <textarea
                placeholder="Your Message ✨"
                className="playful-input"
                rows={5}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                required
              />
              <button type="submit" className="btn-playful btn-primary" style={{ width: '100%', display: 'block', backgroundColor: 'var(--color-pink)', color: 'white' }}>
                Send Message 🚀
              </button>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;

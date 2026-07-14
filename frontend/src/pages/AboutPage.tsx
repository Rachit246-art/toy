import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <SEO 
        title="About Us | Pigglitz 3D Toys" 
        description="Learn about Pigglitz, the ultimate 3D Printing Pitara! We create eco-friendly, magical, and colorful 3D printed toys with love and care."
        keywords="about pigglitz, 3d printed toys company, artisan 3d toys, eco-friendly toys"
        url="https://pigglitz.com/about"
      />
      <Navbar />

      <section className="about-hero">
        <div className="floating-star star-a">🌟</div>
        <div className="floating-star star-b">⭐</div>
        <h1>About Us</h1>
        <p>Welcome to Pigglitz 3D Printing Pitara!</p>
      </section>

      <section className="container about-section" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="about-card card-purple" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
          <div className="about-icon">🎁</div>
          <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
            Pigglitz 3D Printing Pitara is a creative toy brand by <strong>PINAKA TECHNOLOGIES S G PVT LTD</strong>, dedicated to bringing imagination to life through innovative 3D printing technology.
          </p>
          <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
            We design and manufacture unique articulated toys, flexible animals, fidget toys, collectibles, and educational products that inspire creativity and fun for children and adults alike.
          </p>
          <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
            Our products are proudly designed and manufactured in India using high-quality 3D printing technology. Every product is carefully inspected to ensure quality, durability, and customer satisfaction.
          </p>
          <p style={{ lineHeight: '1.6' }}>
            Whether you're looking for birthday return gifts, educational toys, collectible figures, or unique gifts, Pigglitz offers something special for everyone.
          </p>
        </div>

        <div className="about-card card-pink" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
          <div className="about-icon">🌈</div>
          <h2 style={{ marginBottom: '1rem' }}>Our Mission:</h2>
          <p style={{ fontSize: '1.1rem', fontStyle: 'italic' }}>
            To make innovative and affordable 3D printed toys accessible to every child.
          </p>
        </div>

        <div className="about-card card-blue" style={{ width: '100%', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
          <div className="about-icon">⚡</div>
          <h2 style={{ marginBottom: '1rem' }}>Why Choose Pigglitz?</h2>
          <ul className="about-list" style={{ marginLeft: '1.5rem', listStyleType: 'disc', lineHeight: '1.8' }}>
            <li>Made in India</li>
            <li>Premium 3D Printed Products</li>
            <li>Unique Designs</li>
            <li>Safe Materials</li>
            <li>Fast Shipping Across India</li>
            <li>Trusted Customer Support</li>
          </ul>
        </div>
      </section>

      <section className="about-team container" style={{ paddingBottom: '4rem' }}>
        <h2 className="text-purple text-center">Company:</h2>
        <p className="text-center" style={{ marginTop: '0.5rem', color: '#666', fontSize: '1.2rem', fontWeight: 'bold' }}>
          PINAKA TECHNOLOGIES S G PVT LTD
        </p>
        <p className="text-center" style={{ marginTop: '1.5rem', fontSize: '1.1rem' }}>
          <strong>Website:</strong><br/>
          <a href="http://www.pigglitz.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-blue)', textDecoration: 'underline', marginTop: '0.5rem', display: 'inline-block' }}>www.pigglitz.com</a>
        </p>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;

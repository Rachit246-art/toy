import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <Navbar />

      <section className="about-hero">
        <div className="floating-star star-a">🌟</div>
        <div className="floating-star star-b">⭐</div>
        <h1>About Pigglitz!</h1>
        <p>Where imagination meets 3D printing magic!</p>
      </section>

      <section className="container about-section">
        <div className="about-card card-purple">
          <div className="about-icon">🎁</div>
          <h2>Our Story</h2>
          <p>
            Pigglitz — the <strong>3D Printing Pitara</strong> — was born from a simple dream: to bring
            joy and wonder to every child through the magic of 3D printing. Every toy is crafted with
            care, color, and a whole lot of love by our artisan team at PINAKA TECHNOLOGIES.
          </p>
        </div>

        <div className="about-card card-pink">
          <div className="about-icon">🌈</div>
          <h2>Our Mission</h2>
          <p>
            We believe every child deserves unique, vibrant, and creative toys. Our 3D printed
            creations are safe, colorful, and designed to spark imagination. <em>Little Prints. Big Smiles.</em>
          </p>
        </div>

        <div className="about-card card-blue">
          <div className="about-icon">⚡</div>
          <h2>Why Pigglitz?</h2>
          <ul className="about-list">
            <li>🎨 Unique 3D printed designs</li>
            <li>🧸 Safe, child-friendly materials</li>
            <li>🌟 Artisan crafted by experts</li>
            <li>🎉 New toys added regularly</li>
          </ul>
        </div>
      </section>

      <section className="about-team container">
        <h2 className="text-purple text-center">Made with ❤️ by PINAKA TECHNOLOGIES</h2>
        <p className="text-center" style={{ marginTop: '1rem', color: '#666', fontSize: '1.1rem' }}>
          A passionate team of designers and engineers dedicated to redefining the toy experience.
        </p>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import './PolicyPage.css'; // We will create this generic CSS for policy pages

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="policy-page">
      <SEO 
        title="Privacy Policy | Pigglitz 3D Toys" 
        description="Privacy Policy for Pigglitz 3D Printing Pitara. Learn how we collect, use, and protect your personal information."
      />
      <Navbar />
      
      <div className="container policy-container">
        <h1 className="text-purple">Privacy Policy</h1>
        <p className="policy-date">Last Updated: June 2026</p>
        
        <div className="policy-content">
          <p><strong>Pigglitz 3D Printing Pitara</strong> respects your privacy and is committed to protecting your personal information.</p>

          <h3>Information We Collect:</h3>
          <ul>
            <li>Name</li>
            <li>Email Address</li>
            <li>Phone Number</li>
            <li>Shipping Address</li>
            <li>Billing Information</li>
            <li>Order History</li>
          </ul>

          <h3>How We Use Information:</h3>
          <ul>
            <li>Process orders</li>
            <li>Deliver products</li>
            <li>Provide customer support</li>
            <li>Improve website experience</li>
            <li>Send order updates</li>
          </ul>

          <h3>Payment Security:</h3>
          <p>Payments are processed through secure third-party payment gateways. We do not store your complete card or banking information.</p>

          <h3>Data Sharing:</h3>
          <p>We do not sell or rent customer information to third parties. Information may only be shared with shipping partners and payment providers for order fulfillment.</p>

          <h3>Cookies:</h3>
          <p>Our website may use cookies to improve user experience and website performance.</p>

          <h3>Your Rights:</h3>
          <p>Customers may request correction or deletion of personal information by contacting our support team.</p>

          <h3>Policy Updates:</h3>
          <p>We reserve the right to update this Privacy Policy at any time.</p>

          <h3>Contact:</h3>
          <p><a href="mailto:pigglits3d@gmail.com" className="text-blue">pigglits3d@gmail.com</a></p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

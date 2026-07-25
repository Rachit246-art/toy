import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import './PolicyPage.css';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="policy-page">
      <SEO 
        title="Privacy Policy | Pigglitz 3D Toys" 
        description="Privacy Policy for Pigglitz. Learn how we collect, use, and protect your personal information."
      />
      <Navbar />
      
      <div className="container policy-container">
        <h1 className="text-purple">Privacy Policy</h1>
        <p className="policy-date">Effective Date: July 24, 2026</p>
        
        <div className="policy-content">
          <h3>1. Introduction</h3>
          <p>
            Welcome to <strong>Pigglitz</strong>, operated by <strong>Pinaka Technologies SG Pvt. Ltd.</strong> ("Pigglitz", "Company", "we", "our", or "us").
          </p>
          <p>
            Your privacy is important to us. This Privacy Policy explains how we collect, use, store, disclose, and protect your personal information when you visit <strong>https://pigglitz.com</strong>, use our website, place an order, upload content for personalized products, or communicate with us.
          </p>
          <p>
            By accessing or using our website, you acknowledge that you have read and understood this Privacy Policy.
          </p>

          <h3>2. Company Information</h3>
          <ul>
            <li><strong>Legal Name:</strong> Pinaka Technologies SG Pvt. Ltd.</li>
            <li><strong>Brand Name:</strong> Pigglitz</li>
            <li><strong>Registered Office:</strong> 86 Sanjay Gandhi Nagar, Naubasta, Kanpur, Uttar Pradesh – 208021, India</li>
            <li><strong>Support Email:</strong> <a href="mailto:pigglitz3d@gmail.com" className="text-blue">pigglitz3d@gmail.com</a></li>
            <li><strong>Phone:</strong> +91 8299475268</li>
          </ul>

          <h3>3. Scope of this Policy</h3>
          <p>This Privacy Policy applies to:</p>
          <ul>
            <li>Visitors to our website</li>
            <li>Individual consumers (B2C)</li>
            <li>Business customers (B2B)</li>
            <li>Customers purchasing personalized products</li>
            <li>Individuals contacting customer support</li>
            <li>Users uploading names, photographs, artwork, logos, or other files for customization</li>
          </ul>

          <h3>4. Information We Collect</h3>
          <p>Depending on how you use our website, we may collect the following information.</p>
          
          <h4>Personal Information</h4>
          <ul>
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Billing address</li>
            <li>Shipping address</li>
            <li>Company name (for business orders)</li>
          </ul>

          <h4>Order Information</h4>
          <ul>
            <li>Products purchased</li>
            <li>Quantity</li>
            <li>Order history</li>
            <li>Delivery preferences</li>
            <li>Payment status</li>
            <li>Invoice details</li>
          </ul>

          <h4>Personalized Product Information</h4>
          <p>To manufacture personalized products, you may upload:</p>
          <ul>
            <li>Names</li>
            <li>Text</li>
            <li>Children's names</li>
            <li>Photographs</li>
            <li>Artwork</li>
            <li>Logos</li>
            <li>Custom graphics</li>
            <li>Design files</li>
          </ul>
          <p>You confirm that you have the legal right or necessary permission to upload any content you provide.</p>

          <h3>5. Payment Information</h3>
          <p>
            Payments are processed securely through trusted payment providers such as <strong>Razorpay</strong> and supported UPI services.
          </p>
          <p>
            Pigglitz <strong>does not store</strong> your complete debit card, credit card, UPI PIN, CVV, or banking credentials.
          </p>
          <p>
            Payment processing is handled by secure third-party payment providers in accordance with their own privacy and security practices.
          </p>

          <h3>6. Technical Information</h3>
          <p>When you visit our website, we may automatically collect:</p>
          <ul>
            <li>IP address</li>
            <li>Browser type</li>
            <li>Device information</li>
            <li>Operating system</li>
            <li>Pages viewed</li>
            <li>Time spent on pages</li>
            <li>Referral source</li>
            <li>Cookies</li>
            <li>Session information</li>
          </ul>
          <p>This information helps us improve website performance and security.</p>

          <h3>7. How We Use Your Information</h3>
          <p>We use your information to:</p>
          <ul>
            <li>Process orders</li>
            <li>Deliver products</li>
            <li>Manufacture personalized items</li>
            <li>Verify payments</li>
            <li>Provide customer support</li>
            <li>Respond to enquiries</li>
            <li>Improve our products and services</li>
            <li>Prevent fraud</li>
            <li>Detect misuse</li>
            <li>Comply with legal obligations</li>
            <li>Send order confirmations</li>
            <li>Send shipping updates</li>
            <li>Issue refunds where applicable</li>
          </ul>
          <p>
            If you choose to receive promotional communications, we may also send updates regarding new products, offers, or events. You may opt out of marketing communications at any time.
          </p>

          <h3>8. Legal Basis for Processing</h3>
          <p>Where applicable, we process personal information based on one or more of the following:</p>
          <ul>
            <li>Your consent</li>
            <li>Performance of a contract</li>
            <li>Compliance with legal obligations</li>
            <li>Protection of legitimate business interests</li>
            <li>Fraud prevention</li>
            <li>Customer service</li>
          </ul>

          <h3>9. Children's Privacy</h3>
          <p>
            Pigglitz sells children's products; however, purchases are intended to be made by adults.
          </p>
          <p>
            We do not knowingly collect personal information directly from children without appropriate authorization from a parent or legal guardian where required by law.
          </p>
          <p>
            Parents or guardians who believe that personal information relating to a child has been submitted inappropriately may contact us to request review or deletion, subject to applicable legal obligations.
          </p>

          <h3>10. Customer Uploaded Content</h3>
          <p>For personalized products, customers may upload: Images, Photographs, Artwork, Names, Logos, Graphics.</p>
          <p>By uploading such content, you represent and warrant that:</p>
          <ul>
            <li>You own the content, or</li>
            <li>You have obtained all necessary permissions to use it.</li>
          </ul>
          <p>You must not upload content that:</p>
          <ul>
            <li>Infringes intellectual property rights</li>
            <li>Violates privacy rights</li>
            <li>Contains unlawful material</li>
            <li>Contains harmful or malicious software</li>
            <li>Is defamatory, abusive, hateful, or obscene</li>
          </ul>
          <p>Pigglitz reserves the right to refuse any customization request that violates applicable law or these terms.</p>

          <h3>11. Sharing of Information</h3>
          <p>We may share information with trusted service providers only where necessary, including:</p>
          <ul>
            <li>Payment processors</li>
            <li>Courier and logistics partners</li>
            <li>Cloud hosting providers</li>
            <li>Technology service providers</li>
            <li>Professional advisers</li>
            <li>Government or regulatory authorities when legally required</li>
          </ul>
          <p>We do not sell personal information to third parties.</p>

          <h3>12. Data Security</h3>
          <p>
            We implement reasonable technical, organizational, and administrative measures to protect personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
          <p>
            While we strive to maintain appropriate safeguards, no method of internet transmission or electronic storage is completely secure. Accordingly, we cannot guarantee absolute security.
          </p>

          <h3>13. Data Retention</h3>
          <p>We retain personal information only for as long as necessary to:</p>
          <ul>
            <li>Fulfil orders</li>
            <li>Provide customer support</li>
            <li>Meet legal and accounting obligations</li>
            <li>Resolve disputes</li>
            <li>Enforce agreements</li>
            <li>Protect our legitimate business interests</li>
          </ul>
          <p>
            After the applicable retention period, information may be deleted, anonymized, or securely archived in accordance with applicable law.
          </p>

          <h3>14. Cookies</h3>
          <p>Our website may use cookies and similar technologies to:</p>
          <ul>
            <li>Remember user preferences</li>
            <li>Maintain login sessions</li>
            <li>Improve website functionality</li>
            <li>Analyze website traffic</li>
            <li>Enhance user experience</li>
          </ul>
          <p>You may manage cookie preferences through your browser settings, although disabling cookies may affect certain website features.</p>

          <h3>15. Third-Party Links</h3>
          <p>
            Our website may contain links to third-party websites or services. We are not responsible for the privacy practices, content, or security of external websites. Users should review the privacy policies of those third parties before providing personal information.
          </p>

          <h3>16. Your Rights</h3>
          <p>Subject to applicable law, you may have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of personal information where appropriate</li>
            <li>Withdraw consent where processing is based on consent</li>
            <li>Object to certain processing activities</li>
            <li>Request information about how your data is used</li>
          </ul>
          <p>To exercise these rights, contact us using the details provided below.</p>

          <h3>17. Changes to this Policy</h3>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our business practices, legal requirements, or services.
          </p>
          <p>
            The updated version will be posted on our website with a revised Effective Date. Continued use of the website after changes become effective constitutes acceptance of the updated Privacy Policy.
          </p>

          <h3>18. Governing Law</h3>
          <p>
            This Privacy Policy shall be governed by and interpreted in accordance with the laws of India. Any disputes arising from or relating to this Privacy Policy shall be subject to the exclusive jurisdiction of the competent courts located in Kanpur, Uttar Pradesh, India, unless otherwise required by applicable law.
          </p>

          <h3>19. Contact Us</h3>
          <p>For questions, requests, or concerns regarding this Privacy Policy or our handling of personal information, please contact:</p>
          <address>
            <strong>Pinaka Technologies SG Pvt. Ltd.</strong><br />
            86 Sanjay Gandhi Nagar<br />
            Naubasta<br />
            Kanpur, Uttar Pradesh – 208021<br />
            India<br /><br />
            <strong>Email:</strong> <a href="mailto:pigglitz3d@gmail.com" className="text-blue">pigglitz3d@gmail.com</a><br />
            <strong>Phone:</strong> +91 8299475268
          </address>

          <h3>20. Acceptance</h3>
          <p>
            By accessing or using the Pigglitz website, placing an order, or providing information through our services, you acknowledge that you have read and understood this Privacy Policy and agree to the collection, use, and disclosure of information as described herein.
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;

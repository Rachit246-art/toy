import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import './PolicyPage.css';

const CookiePolicy: React.FC = () => {
  return (
    <div className="policy-page">
      <SEO 
        title="Cookie Policy | Pigglitz 3D Toys" 
        description="Cookie Policy for Pigglitz. Discover how we use cookies and similar technologies to enhance your experience."
      />
      <Navbar />
      
      <div className="container policy-container">
        <h1 className="text-purple">Cookie Policy</h1>
        <p className="policy-date">Effective Date: July 24, 2026</p>
        
        <div className="policy-content">
          <h3>1. Introduction</h3>
          <p>This Cookie Policy ("Policy") explains how Pigglitz, a brand owned and operated by Pinaka Technologies SG Pvt. Ltd., uses cookies and similar technologies when you visit https://pigglitz.com ("Website").</p>
          <p>This Policy should be read together with our Privacy Policy.</p>
          <p>By continuing to use our Website, you agree to the use of cookies as described in this Policy, subject to your browser settings and any cookie preferences you choose.</p>

          <h3>2. Company Information</h3>
          <p><strong>Legal Name:</strong> Pinaka Technologies SG Pvt. Ltd.</p>
          <p><strong>Brand:</strong> Pigglitz</p>
          <p><strong>Website:</strong> https://pigglitz.com</p>
          <address>
            <strong>Registered Office:</strong><br />
            86 Sanjay Gandhi Nagar<br />
            Naubasta<br />
            Kanpur, Uttar Pradesh – 208021<br />
            India<br /><br />
            <strong>Support Email:</strong> <a href="mailto:pigglitz3d@gmail.com" className="text-blue">pigglitz3d@gmail.com</a><br />
            <strong>Phone:</strong> +91 8299475268
          </address>

          <h3>3. What Are Cookies?</h3>
          <p>Cookies are small text files that are stored on your computer, smartphone, tablet, or other device when you visit a website.</p>
          <p>Cookies help websites:</p>
          <ul>
            <li>Remember your preferences.</li>
            <li>Keep you signed in (where applicable).</li>
            <li>Improve website performance.</li>
            <li>Understand how visitors use the website.</li>
            <li>Enhance your browsing experience.</li>
            <li>Support website security.</li>
          </ul>
          <p>Cookies do not usually contain information that directly identifies you, but they may be linked with information that can identify you when combined with other data.</p>

          <h3>4. Types of Cookies We Use</h3>
          <p>Depending on how you use our Website, Pigglitz may use the following categories of cookies.</p>
          
          <h4>A. Essential Cookies</h4>
          <p>These cookies are necessary for the Website to function properly.</p>
          <p>They may be used to:</p>
          <ul>
            <li>Maintain user sessions.</li>
            <li>Enable shopping cart functionality.</li>
            <li>Process secure checkouts.</li>
            <li>Protect against fraudulent activity.</li>
            <li>Remember security settings.</li>
          </ul>
          <p>Without these cookies, certain parts of the Website may not operate correctly.</p>

          <h4>B. Functional Cookies</h4>
          <p>These cookies remember your preferences to improve your experience.</p>
          <p>Examples include:</p>
          <ul>
            <li>Preferred language.</li>
            <li>Saved delivery location.</li>
            <li>Recently viewed products.</li>
            <li>Login preferences (where applicable).</li>
            <li>Website display settings.</li>
          </ul>

          <h4>C. Analytics Cookies</h4>
          <p>Analytics cookies help us understand how visitors use our Website.</p>
          <p>They may collect information such as:</p>
          <ul>
            <li>Pages visited.</li>
            <li>Time spent on pages.</li>
            <li>Navigation paths.</li>
            <li>Device type.</li>
            <li>Browser type.</li>
            <li>Approximate location (based on IP).</li>
            <li>Website performance metrics.</li>
          </ul>
          <p>This information helps us improve our products, services, and user experience.</p>

          <h4>D. Performance Cookies</h4>
          <p>Performance cookies monitor how well our Website functions.</p>
          <p>These cookies help us:</p>
          <ul>
            <li>Improve loading speed.</li>
            <li>Identify technical issues.</li>
            <li>Monitor system performance.</li>
            <li>Improve reliability.</li>
          </ul>

          <h4>E. Advertising & Marketing Cookies</h4>
          <p>Where applicable, Pigglitz may use cookies to:</p>
          <ul>
            <li>Display relevant advertisements.</li>
            <li>Measure advertising performance.</li>
            <li>Limit repeated advertisements.</li>
            <li>Understand customer interests.</li>
            <li>Improve marketing campaigns.</li>
          </ul>
          <p>These cookies may be placed by Pigglitz or trusted advertising partners.</p>

          <h3>5. Third-Party Cookies</h3>
          <p>Some cookies may be placed by third-party service providers that support our Website.</p>
          <p>Examples may include:</p>
          <ul>
            <li>Payment gateway providers.</li>
            <li>Website analytics providers.</li>
            <li>Customer support tools.</li>
            <li>Marketing platforms.</li>
            <li>Social media integrations.</li>
            <li>Embedded content providers.</li>
          </ul>
          <p>These third parties operate under their own privacy and cookie policies. Pigglitz does not control third-party cookies.</p>

          <h3>6. Why We Use Cookies</h3>
          <p>Cookies help us:</p>
          <ul>
            <li>Operate our Website securely.</li>
            <li>Process purchases.</li>
            <li>Remember shopping cart contents.</li>
            <li>Improve navigation.</li>
            <li>Personalize customer experience.</li>
            <li>Analyze Website traffic.</li>
            <li>Detect fraud.</li>
            <li>Improve customer support.</li>
            <li>Maintain Website performance.</li>
          </ul>

          <h3>7. Information Collected Through Cookies</h3>
          <p>Depending on the cookie used, information collected may include:</p>
          <ul>
            <li>IP address.</li>
            <li>Browser type.</li>
            <li>Device information.</li>
            <li>Operating system.</li>
            <li>Screen resolution.</li>
            <li>Language preference.</li>
            <li>Pages visited.</li>
            <li>Time spent on pages.</li>
            <li>Referral source.</li>
            <li>Shopping cart activity.</li>
            <li>Session identifiers.</li>
          </ul>
          <p>Pigglitz does not use cookies to intentionally collect sensitive personal information.</p>

          <h3>8. Managing Cookies</h3>
          <p>Most web browsers allow you to:</p>
          <ul>
            <li>View stored cookies.</li>
            <li>Delete cookies.</li>
            <li>Block cookies.</li>
            <li>Restrict certain categories of cookies.</li>
            <li>Receive notifications before cookies are stored.</li>
          </ul>
          <p>You can manage your cookie preferences through your browser settings.</p>
          <p>Please note that disabling essential cookies may affect the functionality of the Website.</p>

          <h3>9. Browser Controls</h3>
          <p>You may manage cookies through your browser settings, including popular browsers such as:</p>
          <ul>
            <li>Google Chrome</li>
            <li>Mozilla Firefox</li>
            <li>Microsoft Edge</li>
            <li>Safari</li>
            <li>Opera</li>
          </ul>
          <p>Each browser provides different options for managing cookies.</p>

          <h3>10. Do Not Track (DNT)</h3>
          <p>Some web browsers provide a "Do Not Track" (DNT) feature.</p>
          <p>Because there is currently no universally accepted standard for responding to DNT signals, Pigglitz may not respond to all DNT requests. We continue to monitor developments in this area and may update our practices if industry standards evolve.</p>

          <h3>11. Cookie Retention</h3>
          <p>Some cookies remain on your device only while your browser session is active.</p>
          <p>Others may remain for a longer period to remember your preferences on future visits.</p>
          <p>The retention period depends on the purpose of the cookie and applicable legal requirements.</p>

          <h3>12. Children's Privacy</h3>
          <p>Pigglitz sells products intended for children; however, our Website is intended to be used by adults purchasing products for children.</p>
          <p>We do not knowingly use cookies to profile children or intentionally collect personal information directly from children.</p>

          <h3>13. Changes to this Cookie Policy</h3>
          <p>Pigglitz may update this Cookie Policy from time to time to reflect changes in technology, legal requirements, or business practices.</p>
          <p>The revised Policy will be published on the Website with an updated Effective Date.</p>
          <p>Continued use of the Website after changes become effective constitutes acceptance of the updated Policy.</p>

          <h3>14. Contact Us</h3>
          <p>If you have any questions regarding this Cookie Policy or our use of cookies, please contact:</p>
          <address>
            <strong>Pinaka Technologies SG Pvt. Ltd.</strong><br />
            Brand: Pigglitz<br />
            86 Sanjay Gandhi Nagar<br />
            Naubasta<br />
            Kanpur, Uttar Pradesh – 208021<br />
            India<br /><br />
            <strong>Support Email:</strong> <a href="mailto:pigglitz3d@gmail.com" className="text-blue">pigglitz3d@gmail.com</a><br />
            <strong>Phone:</strong> +91 8299475268
          </address>
          <p>We will make reasonable efforts to respond to your enquiry promptly.</p>

          <h3>15. Acceptance</h3>
          <p>By continuing to browse or use the Pigglitz Website, you acknowledge that you have read, understood, and agree to this Cookie Policy, subject to your browser settings and applicable law.</p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CookiePolicy;

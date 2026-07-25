import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import './PolicyPage.css';

const Disclaimer: React.FC = () => {
  return (
    <div className="policy-page">
      <SEO 
        title="Disclaimer | Pigglitz 3D Toys" 
        description="Disclaimer for Pigglitz. Please review our legal disclaimers regarding products and information."
      />
      <Navbar />
      
      <div className="container policy-container">
        <h1 className="text-purple">Disclaimer</h1>
        <p className="policy-date">Effective Date: July 24, 2026</p>
        
        <div className="policy-content">
          <h3>1. Introduction</h3>
          <p>This Disclaimer ("Disclaimer") applies to the website https://pigglitz.com ("Website"), owned and operated by Pinaka Technologies SG Pvt. Ltd. under the brand name Pigglitz.</p>
          <p>By accessing or using the Website, purchasing products, or relying on any information provided by Pigglitz, you acknowledge that you have read, understood, and agree to this Disclaimer.</p>

          <h3>2. Company Information</h3>
          <p><strong>Legal Name:</strong> Pinaka Technologies SG Pvt. Ltd.</p>
          <p><strong>Brand:</strong> Pigglitz</p>
          <address>
            <strong>Registered Office:</strong><br />
            86 Sanjay Gandhi Nagar<br />
            Naubasta<br />
            Kanpur, Uttar Pradesh – 208021<br />
            India<br /><br />
            <strong>Support Email:</strong> <a href="mailto:pigglitz3d@gmail.com" className="text-blue">pigglitz3d@gmail.com</a><br />
            <strong>Phone:</strong> +91 8299475268
          </address>

          <h3>3. General Information</h3>
          <p>The information available on the Website is provided for general informational and commercial purposes only.</p>
          <p>While Pigglitz makes reasonable efforts to ensure that information is accurate and up to date, we do not guarantee that all content is complete, accurate, reliable, or error-free at all times.</p>
          <p>Nothing on the Website should be interpreted as professional legal, financial, medical, engineering, educational, or other specialist advice.</p>

          <h3>4. Product Information</h3>
          <p>Pigglitz sells toys, educational products, accessories, and personalized 3D-printed products.</p>
          <p>We strive to provide accurate product descriptions, specifications, dimensions, colors, and photographs. However:</p>
          <ul>
            <li>Product colors may vary depending on your screen or device settings.</li>
            <li>Product dimensions may include reasonable manufacturing tolerances.</li>
            <li>Images shown on the Website are for illustrative purposes and may not exactly represent the delivered product.</li>
            <li>Packaging may differ from images shown online due to updates or operational requirements.</li>
          </ul>
          <p>Minor variations do not constitute manufacturing defects.</p>

          <h3>5. Personalized Products Disclaimer</h3>
          <p>Pigglitz manufactures personalized products based on information and materials supplied by customers.</p>
          <p>Customers are solely responsible for ensuring that:</p>
          <ul>
            <li>Names, spellings, dates, and customization details are correct.</li>
            <li>Uploaded photographs and artwork are of sufficient quality.</li>
            <li>They have the legal right to use any uploaded content.</li>
            <li>Submitted content does not infringe the intellectual property or privacy rights of others.</li>
          </ul>
          <p>Pigglitz is not responsible for errors resulting from incorrect or incomplete information provided by the customer.</p>

          <h3>6. 3D Printing Disclaimer</h3>
          <p>Many Pigglitz products are manufactured using modern 3D-printing technology.</p>
          <p>Customers acknowledge that:</p>
          <ul>
            <li>Minor layer lines, texture differences, or slight color variations are natural characteristics of the manufacturing process.</li>
            <li>Small dimensional tolerances may occur.</li>
            <li>These characteristics are normal and do not affect the intended functionality or quality of the product.</li>
          </ul>
          <p>Unless they materially affect functionality or safety, such variations are not considered defects.</p>

          <h3>7. Children's Product Safety</h3>
          <p>Pigglitz products are intended to be used in accordance with the age recommendations and safety instructions provided with the product or on its packaging.</p>
          <p>Parents, guardians, teachers, and caregivers are responsible for:</p>
          <ul>
            <li>Selecting products appropriate for the child's age and abilities.</li>
            <li>Supervising children during use where appropriate.</li>
            <li>Following all safety warnings and usage instructions.</li>
          </ul>
          <p>Some products may contain small parts and may present a choking hazard for young children.</p>
          <p>Children should not use products without appropriate adult supervision where recommended.</p>

          <h3>8. Educational & Creative Use</h3>
          <p>Any educational, developmental, or creative benefits described for our products are intended as general information.</p>
          <p>Individual experiences may vary depending on the child's age, abilities, interests, supervision, and manner of use.</p>
          <p>Pigglitz does not guarantee any specific educational, developmental, or learning outcomes.</p>

          <h3>9. Website Availability</h3>
          <p>Pigglitz aims to keep the Website available and functioning properly.</p>
          <p>However, we do not guarantee uninterrupted access.</p>
          <p>The Website may occasionally be unavailable due to:</p>
          <ul>
            <li>Maintenance;</li>
            <li>Technical failures;</li>
            <li>Internet disruptions;</li>
            <li>Security incidents;</li>
            <li>Software updates; or</li>
            <li>Circumstances beyond our reasonable control.</li>
          </ul>

          <h3>10. Third-Party Services</h3>
          <p>The Website may contain links to third-party websites, payment providers, courier services, or other external resources.</p>
          <p>Pigglitz does not control these third-party services and is not responsible for:</p>
          <ul>
            <li>Their content;</li>
            <li>Privacy practices;</li>
            <li>Availability;</li>
            <li>Security; or</li>
            <li>Terms of use.</li>
          </ul>
          <p>Your interactions with third-party services are governed by their own policies and terms.</p>

          <h3>11. Limitation of Liability</h3>
          <p>To the fullest extent permitted by applicable law, Pigglitz shall not be liable for:</p>
          <ul>
            <li>Indirect, incidental, consequential, special, or punitive damages;</li>
            <li>Loss of profits, revenue, business opportunities, or goodwill;</li>
            <li>Data loss;</li>
            <li>Delays caused by third-party service providers;</li>
            <li>Customer misuse of products;</li>
            <li>Customer-provided customization errors;</li>
            <li>Events beyond our reasonable control.</li>
          </ul>
          <p>Where liability cannot be excluded by law, it will be limited to the maximum extent permitted by applicable law.</p>

          <h3>12. Product Use</h3>
          <p>Customers are responsible for using products safely and for their intended purpose.</p>
          <p>Pigglitz is not responsible for damage or injury arising from:</p>
          <ul>
            <li>Misuse;</li>
            <li>Improper storage;</li>
            <li>Unauthorized modifications;</li>
            <li>Failure to follow instructions;</li>
            <li>Use contrary to age recommendations or safety guidance.</li>
          </ul>

          <h3>13. Intellectual Property</h3>
          <p>All Website content, including text, graphics, logos, product photographs, product descriptions, icons, branding, and designs (excluding customer-submitted content), is owned by or licensed to Pinaka Technologies SG Pvt. Ltd.</p>
          <p>No content may be copied, reproduced, distributed, or used without prior written permission.</p>

          <h3>14. Customer Uploads</h3>
          <p>Customers who upload names, logos, artwork, photographs, or other files confirm that they:</p>
          <ul>
            <li>Own the content or have the legal authority to use it.</li>
            <li>Accept responsibility for any legal consequences arising from the submitted content.</li>
            <li>Grant Pigglitz permission to use the content solely for manufacturing, fulfilling, and supporting the relevant order.</li>
          </ul>
          <p>Pigglitz reserves the right to refuse content that is unlawful, offensive, or infringes the rights of others.</p>

          <h3>15. No Warranties</h3>
          <p>Except as expressly provided by applicable law or any written warranty issued by Pigglitz, the Website, products, and services are provided on an "as is" and "as available" basis.</p>
          <p>Pigglitz disclaims all implied warranties to the fullest extent permitted by law, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>
          <p>This disclaimer does not limit any rights that cannot legally be excluded.</p>

          <h3>16. Governing Law</h3>
          <p>This Disclaimer shall be governed by the laws of India.</p>
          <p>Any dispute relating to this Disclaimer shall be subject to the exclusive jurisdiction of the competent courts located in Kanpur, Uttar Pradesh, India, unless otherwise required by applicable law.</p>

          <h3>17. Changes to this Disclaimer</h3>
          <p>Pigglitz may update this Disclaimer from time to time to reflect changes in our business practices, legal obligations, or services.</p>
          <p>The revised version will be published on the Website with an updated Effective Date.</p>
          <p>Continued use of the Website after changes become effective constitutes acceptance of the revised Disclaimer.</p>

          <h3>18. Contact Us</h3>
          <p>If you have any questions regarding this Disclaimer, please contact:</p>
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

          <h3>19. Acceptance</h3>
          <p>By accessing or using the Pigglitz Website or purchasing our products, you acknowledge that you have read, understood, and agreed to this Disclaimer.</p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Disclaimer;

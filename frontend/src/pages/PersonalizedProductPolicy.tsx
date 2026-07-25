import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import './PolicyPage.css';

const PersonalizedProductPolicy: React.FC = () => {
  return (
    <div className="policy-page">
      <SEO 
        title="Personalized Product Policy | Pigglitz 3D Toys" 
        description="Personalized Product Policy for Pigglitz. Learn about our terms for custom-made and personalized items."
      />
      <Navbar />
      
      <div className="container policy-container">
        <h1 className="text-purple">Personalized Product Policy</h1>
        <p className="policy-date">Effective Date: July 24, 2026</p>
        
        <div className="policy-content">
          <h3>1. Introduction</h3>
          <p>This Personalized Product Policy ("Policy") governs the purchase, design, manufacture, delivery, return, and use of personalized and custom-made products offered by Pigglitz, a brand owned and operated by Pinaka Technologies SG Pvt. Ltd.</p>
          <p>By placing an order for a personalized product, you acknowledge that you have read, understood, and agree to this Policy in addition to our Terms & Conditions, Privacy Policy, Shipping & Delivery Policy, and Return, Refund & Exchange Policy.</p>

          <h3>2. Company Information</h3>
          <p><strong>Legal Name:</strong> Pinaka Technologies SG Pvt. Ltd.</p>
          <p><strong>Brand Name:</strong> Pigglitz</p>
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

          <h3>3. What is a Personalized Product?</h3>
          <p>A personalized product is any item manufactured or customized specifically according to your instructions.</p>
          <p>Personalization may include, but is not limited to:</p>
          <ul>
            <li>Child's name</li>
            <li>Initials</li>
            <li>Custom text or messages</li>
            <li>Photographs</li>
            <li>Artwork</li>
            <li>Logos</li>
            <li>Character designs</li>
            <li>3D models</li>
            <li>Custom colours (where available)</li>
            <li>Special design requests</li>
          </ul>
          <p>Each personalized product is produced specifically for the customer and may not be suitable for resale.</p>

          <h3>4. Customer Responsibility</h3>
          <p>Customers are responsible for ensuring that all customization information submitted is accurate and complete.</p>
          <p>Before placing an order, please verify:</p>
          <ul>
            <li>Correct spelling</li>
            <li>Dates</li>
            <li>Names</li>
            <li>Uploaded photographs</li>
            <li>Colours selected</li>
            <li>Size or product options</li>
            <li>Delivery address</li>
            <li>Contact details</li>
          </ul>
          <p>Pigglitz is not responsible for errors caused by incorrect information submitted by the customer.</p>

          <h3>5. Uploading Photos, Artwork & Designs</h3>
          <p>Customers may upload:</p>
          <ul>
            <li>Photographs</li>
            <li>Children's drawings</li>
            <li>Artwork</li>
            <li>Logos</li>
            <li>Design files</li>
            <li>Graphics</li>
            <li>Other creative content</li>
          </ul>
          <p>By uploading content, you confirm that:</p>
          <ul>
            <li>You own the content or have the legal right to use it.</li>
            <li>The content does not infringe any copyright, trademark, privacy, or other legal rights.</li>
            <li>The content complies with applicable laws.</li>
          </ul>
          <p>Pigglitz may refuse any order containing content that is unlawful, offensive, defamatory, discriminatory, obscene, or otherwise inappropriate.</p>

          <h3>6. Design Approval</h3>
          <p>For certain products, Pigglitz may provide a digital proof, design preview, or mock-up before production.</p>
          <p>Customers are responsible for carefully reviewing the proof.</p>
          <p>Approval confirms that you accept:</p>
          <ul>
            <li>Design layout</li>
            <li>Spelling</li>
            <li>Colours</li>
            <li>Placement of text</li>
            <li>Images</li>
            <li>Overall appearance</li>
          </ul>
          <p>Once production has started, further changes may not be possible.</p>

          <h3>7. Production Process</h3>
          <p>Personalized products are manufactured using advanced 3D-printing technologies and other production methods.</p>
          <p>Production generally begins after:</p>
          <ul>
            <li>Successful payment;</li>
            <li>Receipt of all required customization information; and</li>
            <li>Approval of the design proof, where applicable.</li>
          </ul>
          <p>Production timelines may vary depending on product complexity, order volume, and material availability.</p>

          <h3>8. Manufacturing Variations</h3>
          <p>Due to the nature of personalized manufacturing and 3D printing, products may include:</p>
          <ul>
            <li>Minor layer lines</li>
            <li>Slight colour variations</li>
            <li>Small dimensional tolerances</li>
            <li>Minor texture differences</li>
            <li>Small support marks removed during finishing</li>
          </ul>
          <p>These characteristics are normal and are not considered manufacturing defects unless they materially affect the product's intended use or safety.</p>

          <h3>9. Colour Accuracy</h3>
          <p>We make reasonable efforts to accurately display product colours on our Website.</p>
          <p>However, actual colours may vary due to:</p>
          <ul>
            <li>Device screens</li>
            <li>Browser settings</li>
            <li>Lighting conditions</li>
            <li>Material properties</li>
            <li>Manufacturing processes</li>
          </ul>
          <p>Slight colour differences do not qualify as defects.</p>

          <h3>10. Customer-Supplied Content License</h3>
          <p>By submitting names, photographs, artwork, logos, or other content, you grant Pigglitz a limited, non-exclusive, royalty-free license to:</p>
          <ul>
            <li>Manufacture your personalized product;</li>
            <li>Prepare production files;</li>
            <li>Perform quality checks;</li>
            <li>Provide customer support;</li>
            <li>Resolve disputes related to your order.</li>
          </ul>
          <p>This license is limited to fulfilling your order and does not transfer ownership of your intellectual property to Pigglitz.</p>

          <h3>11. Intellectual Property</h3>
          <p>Customers retain ownership of their original uploaded content.</p>
          <p>Pigglitz retains ownership of:</p>
          <ul>
            <li>Product designs created by Pigglitz;</li>
            <li>Manufacturing methods;</li>
            <li>Product catalogues;</li>
            <li>Branding;</li>
            <li>Website content;</li>
            <li>Trademarks;</li>
            <li>Logos;</li>
            <li>Software;</li>
            <li>Design templates.</li>
          </ul>
          <p>No ownership rights are transferred except as expressly stated.</p>

          <h3>12. Order Changes</h3>
          <p>Customers may request changes before production begins.</p>
          <p>Once production has started, Pigglitz may not be able to accept modifications because materials and manufacturing resources have already been committed.</p>
          <p>Whether a requested change can be accommodated will depend on the stage of production.</p>

          <h3>13. Order Cancellation</h3>
          <p>Personalized orders may be cancelled only before production has commenced.</p>
          <p>Once manufacturing begins, cancellation requests may be refused or subject to charges reflecting work already completed, unless otherwise required by applicable law.</p>

          <h3>14. Returns & Refunds</h3>
          <p>Because personalized products are manufactured specifically for individual customers, they generally cannot be returned, exchanged, or refunded simply because:</p>
          <ul>
            <li>The customer changes their mind;</li>
            <li>The customer ordered the wrong product;</li>
            <li>Incorrect personalization details were submitted;</li>
            <li>The customer no longer wants the product.</li>
          </ul>
          <p>However, Pigglitz will review claims where a personalized product:</p>
          <ul>
            <li>Is damaged upon delivery;</li>
            <li>Contains a verified manufacturing defect;</li>
            <li>Does not match the approved customization due to our error.</li>
          </ul>
          <p>Approved remedies may include repair, replacement, or refund, depending on the circumstances and applicable law.</p>

          <h3>15. Quality Inspection</h3>
          <p>Each personalized product undergoes reasonable quality checks before dispatch.</p>
          <p>Despite these inspections, customers should inspect products upon delivery and report any issues promptly.</p>
          <p>Supporting photographs and, where possible, an unboxing video may assist us in investigating concerns.</p>

          <h3>16. Product Care</h3>
          <p>Customers should:</p>
          <ul>
            <li>Handle products with care.</li>
            <li>Keep products away from excessive heat unless specified otherwise.</li>
            <li>Avoid exposure to harsh chemicals.</li>
            <li>Clean products using a soft, dry, or slightly damp cloth unless different care instructions are provided.</li>
          </ul>
          <p>Improper handling or maintenance may affect product appearance or durability.</p>

          <h3>17. Children's Safety</h3>
          <p>Personalized products intended for children should always be used in accordance with any age recommendations and safety instructions.</p>
          <p>Parents and guardians remain responsible for supervising children where appropriate.</p>
          <p>Some products may contain small parts and may not be suitable for very young children.</p>

          <h3>18. Limitation of Liability</h3>
          <p>To the fullest extent permitted by law, Pigglitz is not responsible for:</p>
          <ul>
            <li>Errors in customer-submitted information;</li>
            <li>Copyright or trademark infringement arising from customer-uploaded content;</li>
            <li>Delays caused by incomplete customization information;</li>
            <li>Minor manufacturing variations inherent to the personalization process;</li>
            <li>Misuse of products after delivery.</li>
          </ul>
          <p>Nothing in this Policy excludes liability that cannot legally be excluded under applicable law.</p>

          <h3>19. Changes to this Policy</h3>
          <p>Pigglitz may revise this Personalized Product Policy from time to time.</p>
          <p>The updated version will be published on the Website with a revised Effective Date.</p>
          <p>Continued use of the Website after the updated Policy becomes effective constitutes acceptance of the revised Policy.</p>

          <h3>20. Governing Law</h3>
          <p>This Policy shall be governed by and interpreted in accordance with the laws of India.</p>
          <p>Any disputes arising under this Policy shall be subject to the exclusive jurisdiction of the competent courts located in Kanpur, Uttar Pradesh, India, unless applicable law provides otherwise.</p>

          <h3>21. Contact Us</h3>
          <p>For questions about personalized products or this Policy, please contact:</p>
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

          <h3>22. Acceptance</h3>
          <p>By placing an order for a personalized product through the Pigglitz Website, you acknowledge that you have read, understood, and agree to this Personalized Product Policy.</p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PersonalizedProductPolicy;

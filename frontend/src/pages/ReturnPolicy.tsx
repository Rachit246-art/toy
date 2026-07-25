import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import './PolicyPage.css';

const ReturnPolicy: React.FC = () => {
  return (
    <div className="policy-page">
      <SEO 
        title="Return, Refund & Exchange Policy | Pigglitz 3D Toys" 
        description="Return, Refund & Exchange Policy for Pigglitz. Read about our process for returning or exchanging products."
      />
      <Navbar />
      
      <div className="container policy-container">
        <h1 className="text-purple">Return, Refund & Exchange Policy</h1>
        <p className="policy-date">Effective Date: July 24, 2026</p>
        
        <div className="policy-content">
          <h3>1. Introduction</h3>
          <p>This Return, Refund & Exchange Policy ("Policy") governs returns, refunds, replacements, and exchanges for products purchased from Pigglitz, a brand owned and operated by Pinaka Technologies SG Pvt. Ltd.</p>
          <p>Our goal is to ensure a fair, transparent, and customer-friendly experience while recognizing the unique nature of personalized and 3D-printed products.</p>
          <p>By placing an order with Pigglitz, you agree to this Policy.</p>

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

          <h3>3. Return Eligibility</h3>
          <p>Most standard (non-personalized) products may be returned within <strong>7 calendar days</strong> from the date of delivery, provided that they:</p>
          <ul>
            <li>Are unused and undamaged;</li>
            <li>Are returned in their original packaging, where reasonably possible;</li>
            <li>Include all accessories, manuals, and promotional items originally supplied;</li>
            <li>Are accompanied by proof of purchase or the order number.</li>
          </ul>
          <p>Pigglitz reserves the right to inspect returned products before approving a refund, replacement, or exchange.</p>

          <h3>4. Personalized & Custom-Made Products</h3>
          <p>Because personalized products are manufactured specifically for each customer, they <strong>cannot ordinarily be returned, exchanged, or refunded</strong> simply because:</p>
          <ul>
            <li>You changed your mind;</li>
            <li>You ordered the wrong item;</li>
            <li>You entered an incorrect name, message, or customization;</li>
            <li>You selected the wrong colour, size, or design option;</li>
            <li>You no longer require the product.</li>
          </ul>
          <p>However, Pigglitz will review requests where a personalized product:</p>
          <ul>
            <li>Arrives damaged;</li>
            <li>Contains a manufacturing defect;</li>
            <li>Does not match the approved customization;</li>
            <li>Is materially different from what was ordered due to our error.</li>
          </ul>
          <p>Nothing in this Policy limits any rights that cannot be excluded under applicable consumer protection laws.</p>

          <h3>5. Products That Cannot Be Returned</h3>
          <p>The following items are generally not eligible for return unless defective or required by law:</p>
          <ul>
            <li>Personalized products</li>
            <li>Custom 3D-printed products</li>
            <li>Products made to customer specifications</li>
            <li>Items damaged through misuse</li>
            <li>Products showing signs of use</li>
            <li>Products altered after delivery</li>
            <li>Items without proof of purchase where verification is not otherwise possible</li>
          </ul>

          <h3>6. Damaged, Defective or Incorrect Products</h3>
          <p>If you receive a product that is damaged, defective, or incorrect, please notify Pigglitz <strong>within 48 hours of delivery</strong> by contacting our support team.</p>
          <p>To help us investigate your request, please provide:</p>
          <ul>
            <li>Your order number;</li>
            <li>A description of the issue;</li>
            <li>Clear photographs of the product;</li>
            <li>Photographs of the packaging; and</li>
            <li>If possible, an unboxing video showing the condition of the package upon opening.</li>
          </ul>
          <p>Providing these materials helps us process your request more efficiently, but we will consider all available evidence in accordance with applicable law.</p>

          <h3>7. Exchange Policy</h3>
          <p>Where eligible, Pigglitz may offer an exchange if:</p>
          <ul>
            <li>The wrong product was shipped;</li>
            <li>The product is damaged in transit;</li>
            <li>The product has a verified manufacturing defect.</li>
          </ul>
          <p>Exchanges are subject to product availability. If a replacement is unavailable, an alternative remedy, including a refund where appropriate, may be offered.</p>

          <h3>8. Refund Process</h3>
          <p>Once an eligible return or claim is approved:</p>
          <ul>
            <li>The product may need to be returned to Pigglitz, unless we advise otherwise.</li>
            <li>Returned items will be inspected.</li>
            <li>If approved, the refund will be initiated using the original payment method, unless another method is agreed upon.</li>
          </ul>
          <p>Refunds are typically processed within <strong>45 days</strong> after approval. Actual crediting time may vary depending on banks, payment providers, or other financial institutions.</p>

          <h3>9. Return Shipping</h3>
          <p>If the return is due to:</p>
          <ul>
            <li>A manufacturing defect;</li>
            <li>An incorrect product shipped by Pigglitz; or</li>
            <li>Damage attributable to Pigglitz or our logistics arrangements,</li>
          </ul>
          <p>Pigglitz may arrange return shipping or reimburse reasonable return shipping costs, where appropriate.</p>
          <p>If the return is requested for any other eligible reason, the customer may be responsible for return shipping costs unless otherwise stated.</p>

          <h3>10. Order Cancellations</h3>
          <p>Orders may be cancelled before production or dispatch begins.</p>
          <p>For personalized or custom-made products, cancellation requests received after manufacturing has started may not be accepted because materials, labour, and production resources have already been committed.</p>
          <p>Any accepted cancellation will be processed in accordance with our Cancellation Policy.</p>

          <h3>11. Failed Deliveries</h3>
          <p>If an order is returned to Pigglitz because:</p>
          <ul>
            <li>The delivery address was incorrect;</li>
            <li>The customer could not be contacted;</li>
            <li>Delivery was repeatedly attempted but unsuccessful; or</li>
            <li>The shipment was refused without valid reason,</li>
          </ul>
          <p>Pigglitz may deduct reasonable shipping or handling charges incurred before issuing any eligible refund, where permitted by applicable law.</p>

          <h3>12. Inspection of Returned Products</h3>
          <p>Returned items may be inspected to verify:</p>
          <ul>
            <li>Product condition;</li>
            <li>Manufacturing defects;</li>
            <li>Signs of misuse;</li>
            <li>Missing accessories;</li>
            <li>Compliance with return requirements.</li>
          </ul>
          <p>If the returned product does not meet the conditions of this Policy, Pigglitz may decline the return or offer an alternative resolution where appropriate.</p>

          <h3>13. Non-Returnable Circumstances</h3>
          <p>Returns or refunds may be declined where the issue arises from:</p>
          <ul>
            <li>Incorrect customization details provided by the customer;</li>
            <li>Normal wear and tear;</li>
            <li>Improper use, storage, or maintenance;</li>
            <li>Accidental damage after delivery;</li>
            <li>Unauthorized modifications or repairs;</li>
            <li>Minor variations in colour, texture, or finish that are inherent to the 3D printing process and do not affect functionality.</li>
          </ul>

          <h3>14. Fraud Prevention</h3>
          <p>Pigglitz reserves the right to refuse returns or refunds where there is evidence of:</p>
          <ul>
            <li>Fraudulent claims;</li>
            <li>Abuse of this Policy;</li>
            <li>Repeated misuse of return privileges;</li>
            <li>Submission of false information;</li>
            <li>Return of products different from those supplied.</li>
          </ul>
          <p>Where fraud is suspected, Pigglitz may take appropriate legal action.</p>

          <h3>15. Consumer Rights</h3>
          <p>This Policy is intended to operate alongside your rights under applicable consumer protection laws.</p>
          <p>Where any provision of this Policy conflicts with mandatory legal rights, those mandatory rights will prevail.</p>

          <h3>16. Changes to this Policy</h3>
          <p>Pigglitz may revise this Return, Refund & Exchange Policy from time to time.</p>
          <p>The latest version will be published on the Website with an updated Effective Date.</p>

          <h3>17. Contact Us</h3>
          <p>If you need assistance with a return, refund, or exchange, please contact:</p>
          <address>
            <strong>Pinaka Technologies SG Pvt. Ltd.</strong><br />
            Pigglitz<br />
            86 Sanjay Gandhi Nagar<br />
            Naubasta<br />
            Kanpur, Uttar Pradesh – 208021<br />
            India<br /><br />
            <strong>Email:</strong> <a href="mailto:pigglitz3d@gmail.com" className="text-blue">pigglitz3d@gmail.com</a><br />
            <strong>Phone:</strong> +91 8299475268
          </address>
          <p>Please include your order number and a description of the issue so we can assist you as quickly as possible.</p>

          <h3>18. Acceptance</h3>
          <p>By placing an order through the Pigglitz Website, you acknowledge that you have read, understood, and agree to this Return, Refund & Exchange Policy.</p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ReturnPolicy;

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import './PolicyPage.css';

const ShippingPolicy: React.FC = () => {
  return (
    <div className="policy-page">
      <SEO 
        title="Shipping & Delivery Policy | Pigglitz 3D Toys" 
        description="Shipping & Delivery Policy for Pigglitz. Learn about our shipping times, methods, and delivery procedures."
      />
      <Navbar />
      
      <div className="container policy-container">
        <h1 className="text-purple">Shipping & Delivery Policy</h1>
        <p className="policy-date">Effective Date: July 24, 2026</p>
        
        <div className="policy-content">
          <h3>1. Introduction</h3>
          <p>This Shipping & Delivery Policy ("Policy") explains how Pigglitz, a brand owned and operated by Pinaka Technologies SG Pvt. Ltd., processes, ships, and delivers orders placed through https://pigglitz.com.</p>
          <p>By placing an order with Pigglitz, you agree to the terms outlined in this Policy.</p>

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

          <h3>3. Shipping Coverage</h3>
          <p>Currently, Pigglitz delivers products <strong>within India only</strong>.</p>
          <p>We do not currently offer international shipping. If international shipping becomes available in the future, this Policy will be updated accordingly.</p>

          <h3>4. Order Processing</h3>
          <p>Orders are processed after successful payment confirmation.</p>
          <p>Processing time depends on the type of product ordered.</p>
          <h4>Standard Products</h4>
          <p>Most standard (non-personalized) products are processed within <strong>1–3 business days</strong>.</p>
          <h4>Personalized & 3D-Printed Products</h4>
          <p>Personalized or custom-made products require additional manufacturing time. Processing typically takes <strong>3–7 business days</strong>, depending on the complexity of the design, order volume, and production schedule.</p>
          <p>Processing times are estimates and may vary.</p>
          <p>Orders are generally processed on business days (Monday to Saturday), excluding public holidays.</p>

          <h3>5. Shipping Partners</h3>
          <p>Pigglitz works with trusted third-party courier and logistics providers to deliver orders safely and efficiently.</p>
          <p>The courier partner assigned to your shipment may vary based on your delivery location, package size, and service availability.</p>

          <h3>6. Estimated Delivery Time</h3>
          <p>Delivery times vary depending on the destination and courier service.</p>
          <p>Typical delivery estimates after dispatch are:</p>
          <ul>
            <li><strong>Metro Cities:</strong> 2–5 Business Days</li>
            <li><strong>Tier 2 & Tier 3 Cities:</strong> 3–7 Business Days</li>
            <li><strong>Remote or Rural Areas:</strong> 5–10 Business Days</li>
          </ul>
          <p>Delivery timelines are estimates only and are not guaranteed.</p>

          <h3>7. Shipping Charges</h3>
          <p>Shipping charges, if applicable, will be displayed during checkout before payment.</p>
          <p>Pigglitz may occasionally offer:</p>
          <ul>
            <li>Free shipping promotions</li>
            <li>Discounted shipping</li>
            <li>Minimum order value for free shipping</li>
            <li>Special delivery offers</li>
          </ul>
          <p>Such promotions are subject to change without prior notice.</p>

          <h3>8. Order Confirmation</h3>
          <p>After placing an order, customers will receive an order confirmation via email, SMS, or other available communication channels.</p>
          <p>The confirmation will include:</p>
          <ul>
            <li>Order number</li>
            <li>Purchased products</li>
            <li>Billing information</li>
            <li>Shipping address</li>
            <li>Payment status</li>
          </ul>

          <h3>9. Shipment Tracking</h3>
          <p>Once an order is dispatched, customers will receive shipment tracking details, where available.</p>
          <p>Tracking information may include:</p>
          <ul>
            <li>Courier partner</li>
            <li>Tracking number</li>
            <li>Tracking link</li>
            <li>Estimated delivery date</li>
          </ul>
          <p>Tracking updates are provided by the courier service and may occasionally be delayed.</p>

          <h3>10. Delivery Attempts</h3>
          <p>Courier partners may make one or more delivery attempts.</p>
          <p>If delivery cannot be completed due to reasons such as:</p>
          <ul>
            <li>Customer unavailable</li>
            <li>Incorrect address</li>
            <li>Incorrect phone number</li>
            <li>Refusal to accept delivery</li>
          </ul>
          <p>the shipment may be returned to Pigglitz.</p>
          <p>Additional shipping charges may apply if re-dispatch is requested.</p>

          <h3>11. Customer Responsibilities</h3>
          <p>Customers are responsible for ensuring that:</p>
          <ul>
            <li>Shipping information is accurate.</li>
            <li>Contact details are current.</li>
            <li>Someone is available to receive the package, if required.</li>
            <li>Delivery instructions are provided where necessary.</li>
          </ul>
          <p>Pigglitz is not responsible for delays or failed deliveries caused by inaccurate information provided by the customer.</p>

          <h3>12. Personalized Products</h3>
          <p>Personalized and made-to-order products require additional production time before dispatch.</p>
          <p>Production begins after:</p>
          <ul>
            <li>Successful payment,</li>
            <li>Receipt of required personalization details, and</li>
            <li>Approval of any design proof, where applicable.</li>
          </ul>
          <p>Production cannot begin if required customization information is incomplete or inaccurate.</p>

          <h3>13. Delays Beyond Our Control</h3>
          <p>Delivery may be delayed due to circumstances beyond our reasonable control, including but not limited to:</p>
          <ul>
            <li>Severe weather</li>
            <li>Floods</li>
            <li>Natural disasters</li>
            <li>Public holidays</li>
            <li>Government restrictions</li>
            <li>Transportation disruptions</li>
            <li>Strikes</li>
            <li>Civil disturbances</li>
            <li>Technical failures</li>
            <li>Courier network delays</li>
          </ul>
          <p>Pigglitz will make reasonable efforts to keep customers informed of significant delays.</p>

          <h3>14. Damaged Shipments</h3>
          <p>If your package appears damaged upon delivery:</p>
          <ol>
            <li>Take clear photographs of the package before opening it.</li>
            <li>If possible, record an unboxing video.</li>
            <li>Contact Pigglitz as soon as possible.</li>
            <li>Retain all original packaging materials until the matter is resolved.</li>
          </ol>
          <p>Providing supporting photographs or videos may help us investigate and resolve your claim more efficiently.</p>

          <h3>15. Missing or Lost Shipments</h3>
          <p>If your order has not been delivered within a reasonable period after dispatch:</p>
          <ul>
            <li>Contact our customer support team.</li>
            <li>We will coordinate with the courier partner to investigate the shipment.</li>
            <li>If a shipment is confirmed lost in transit, Pigglitz will determine an appropriate resolution, which may include replacement or refund, subject to investigation and applicable law.</li>
          </ul>

          <h3>16. Incorrect Delivery Address</h3>
          <p>Customers are responsible for entering the correct delivery address during checkout.</p>
          <p>If an incorrect address is provided:</p>
          <ul>
            <li>We will make reasonable efforts to update it before dispatch, if requested in time.</li>
            <li>Once dispatched, address changes may not be possible.</li>
            <li>Additional shipping charges may apply if the shipment must be redirected or resent.</li>
          </ul>

          <h3>17. Refused Deliveries</h3>
          <p>If a customer refuses delivery without a valid reason or fails to accept delivery after reasonable attempts by the courier:</p>
          <ul>
            <li>The order may be returned to Pigglitz.</li>
            <li>Any refund or reshipment will be handled in accordance with our Return, Refund & Exchange Policy.</li>
            <li>Shipping and handling costs already incurred may be deducted where permitted by applicable law.</li>
          </ul>

          <h3>18. Partial Shipments</h3>
          <p>In certain situations, Pigglitz may ship items separately due to:</p>
          <ul>
            <li>Product availability,</li>
            <li>Manufacturing schedules,</li>
            <li>Packaging requirements, or</li>
            <li>Operational considerations.</li>
          </ul>
          <p>Customers will be informed where reasonably practicable.</p>

          <h3>19. Risk of Loss</h3>
          <p>Ownership and risk of loss generally pass to the customer upon successful delivery to the shipping address provided in the order, except where applicable law provides otherwise.</p>

          <h3>20. Changes to this Policy</h3>
          <p>Pigglitz reserves the right to modify this Shipping & Delivery Policy at any time.</p>
          <p>The updated version will be published on the Website with a revised Effective Date.</p>
          <p>Continued use of the Website or placement of orders after the updated Policy becomes effective constitutes acceptance of the revised Policy.</p>

          <h3>21. Contact Us</h3>
          <p>If you have questions regarding shipping or delivery, please contact:</p>
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
          <p>Our customer support team will make reasonable efforts to respond to your enquiry as promptly as possible.</p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ShippingPolicy;

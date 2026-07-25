import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import './PolicyPage.css';

const PaymentPolicy: React.FC = () => {
  return (
    <div className="policy-page">
      <SEO 
        title="Payment Policy | Pigglitz 3D Toys" 
        description="Payment Policy for Pigglitz. Discover our accepted payment methods, security measures, and refund processing."
      />
      <Navbar />
      
      <div className="container policy-container">
        <h1 className="text-purple">Payment Policy</h1>
        <p className="policy-date">Effective Date: July 24, 2026</p>
        
        <div className="policy-content">
          <h3>1. Introduction</h3>
          <p>This Payment Policy ("Policy") explains how payments are accepted, processed, verified, and refunded for purchases made through Pigglitz, a brand owned and operated by Pinaka Technologies SG Pvt. Ltd.</p>
          <p>By placing an order on our website, you agree to this Payment Policy.</p>

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

          <h3>3. Accepted Payment Methods</h3>
          <p>Pigglitz currently accepts payments through secure and authorized payment channels, including:</p>
          <ul>
            <li>Unified Payments Interface (UPI)</li>
            <li>Debit Cards</li>
            <li>Credit Cards</li>
            <li>Net Banking (where supported by the payment gateway)</li>
            <li>Wallets (where supported by the payment gateway)</li>
            <li>Razorpay-supported payment methods</li>
          </ul>
          <p>The payment methods available at checkout may change from time to time.</p>

          <h3>4. Payment Processing</h3>
          <p>All payments are processed through trusted third-party payment service providers.</p>
          <p>When you complete a payment:</p>
          <ul>
            <li>Your payment information is transmitted securely.</li>
            <li>Payment authorization is performed by the relevant financial institution or payment provider.</li>
            <li>Your order will be processed only after successful payment confirmation unless otherwise agreed by Pigglitz.</li>
          </ul>
          <p>Pigglitz does not directly process banking transactions.</p>

          <h3>5. Payment Security</h3>
          <p>Pigglitz is committed to protecting your payment information.</p>
          <p>We do <strong>not</strong> store:</p>
          <ul>
            <li>Debit card numbers</li>
            <li>Credit card numbers</li>
            <li>CVV numbers</li>
            <li>Card PINs</li>
            <li>UPI PINs</li>
            <li>Internet banking passwords</li>
          </ul>
          <p>Payment processing is handled by secure payment gateway providers using industry-standard encryption and security measures.</p>

          <h3>6. Pricing</h3>
          <p>All prices displayed on the Website are in <strong>Indian Rupees (INR)</strong> unless otherwise stated.</p>
          <p>Prices are subject to change without prior notice.</p>
          <p>The final amount payable will be displayed during checkout and may include:</p>
          <ul>
            <li>Product price</li>
            <li>Applicable taxes (if any)</li>
            <li>Shipping charges (if applicable)</li>
            <li>Discounts or promotional offers, where applicable</li>
          </ul>

          <h3>7. Taxes</h3>
          <p>Applicable taxes will be charged in accordance with Indian laws.</p>
          <p>Where required, tax invoices will be generated for completed purchases.</p>
          <p>Business customers are responsible for providing accurate billing information, including GST details where applicable.</p>

          <h3>8. Payment Confirmation</h3>
          <p>Once payment is successfully completed, customers will receive an order confirmation via email, SMS, or other available communication channels.</p>
          <p>If you do not receive confirmation within a reasonable time, please contact our customer support team.</p>

          <h3>9. Failed Transactions</h3>
          <p>A payment may fail due to reasons including:</p>
          <ul>
            <li>Insufficient funds</li>
            <li>Incorrect payment details</li>
            <li>Bank authorization failure</li>
            <li>Technical issues</li>
            <li>Network interruptions</li>
            <li>Payment gateway downtime</li>
          </ul>
          <p>If your payment fails:</p>
          <ul>
            <li>No order will be confirmed until payment is successfully received.</li>
            <li>You may attempt the transaction again using the same or another available payment method.</li>
          </ul>

          <h3>10. Duplicate or Incorrect Payments</h3>
          <p>If you believe you have been charged more than once for the same order, please contact Pigglitz promptly.</p>
          <p>After verification, any confirmed duplicate payment will be refunded using the original payment method, subject to the policies and processing times of the payment provider and financial institution.</p>

          <h3>11. Fraud Prevention</h3>
          <p>Pigglitz reserves the right to verify payment information before accepting or dispatching any order.</p>
          <p>To protect customers and the Company, we may:</p>
          <ul>
            <li>Verify customer identity;</li>
            <li>Request additional information where necessary;</li>
            <li>Delay processing while verification is completed;</li>
            <li>Cancel or refuse orders involving suspected fraud, unauthorized transactions, or unlawful activity.</li>
          </ul>
          <p>Pigglitz may also cooperate with banks, payment gateways, and law enforcement authorities where required by law.</p>

          <h3>12. Personalized Product Payments</h3>
          <p>Because personalized and custom-made products are manufactured specifically for each customer:</p>
          <ul>
            <li>Full payment is generally required before production begins.</li>
            <li>Manufacturing may commence only after payment is confirmed and required customization details have been received.</li>
            <li>Once production has started, cancellation or refund may be limited in accordance with our Cancellation Policy and Return, Refund & Exchange Policy.</li>
          </ul>

          <h3>13. Business (B2B) Payments</h3>
          <p>Business customers may be offered alternative payment arrangements under separate written agreements, quotations, or purchase orders.</p>
          <p>Unless otherwise agreed in writing:</p>
          <ul>
            <li>Payment is due in full before dispatch.</li>
            <li>Ownership of products remains with Pigglitz until payment obligations are fulfilled, where permitted by law.</li>
          </ul>

          <h3>14. Refunds</h3>
          <p>Approved refunds will be processed in accordance with the Pigglitz Return, Refund & Exchange Policy.</p>
          <p>Unless otherwise required by law:</p>
          <ul>
            <li>Refunds will generally be issued using the original payment method.</li>
            <li>Approved refunds may take up to <strong>45 days</strong> to be processed.</li>
            <li>Actual crediting times depend on the customer's bank, card issuer, payment provider, or financial institution.</li>
          </ul>

          <h3>15. Chargebacks</h3>
          <p>Customers are encouraged to contact Pigglitz before initiating a chargeback with their bank or payment provider.</p>
          <p>If a chargeback is initiated:</p>
          <ul>
            <li>Pigglitz may suspend order processing while the matter is investigated.</li>
            <li>We may provide supporting documentation to the payment provider.</li>
            <li>Fraudulent or abusive chargebacks may result in account suspension or legal action where appropriate.</li>
          </ul>
          <p>Nothing in this section limits your legal rights to dispute unauthorized transactions.</p>

          <h3>16. Promotional Offers & Discounts</h3>
          <p>Discounts, promotional codes, coupons, and special offers:</p>
          <ul>
            <li>May be subject to eligibility requirements;</li>
            <li>Cannot ordinarily be combined unless expressly stated;</li>
            <li>May have expiry dates or usage limits;</li>
            <li>May be modified or withdrawn at any time unless prohibited by applicable law.</li>
          </ul>
          <p>If an order is cancelled or refunded, any promotional benefits associated with that order may also be cancelled or adjusted.</p>

          <h3>17. Currency</h3>
          <p>Unless otherwise stated, all transactions are conducted in <strong>Indian Rupees (INR)</strong>.</p>
          <p>Customers are responsible for any currency conversion charges, foreign exchange fees, or bank charges imposed by their financial institution.</p>

          <h3>18. Payment Disputes</h3>
          <p>If you believe there is an error relating to a payment, please contact Pigglitz as soon as possible.</p>
          <p>We will make reasonable efforts to investigate and resolve payment-related issues promptly.</p>
          <p>Customers should provide:</p>
          <ul>
            <li>Order number;</li>
            <li>Transaction reference number;</li>
            <li>Payment date;</li>
            <li>Amount paid; and</li>
            <li>A description of the issue.</li>
          </ul>

          <h3>19. Limitation of Liability</h3>
          <p>Pigglitz is not responsible for losses arising from:</p>
          <ul>
            <li>Bank failures;</li>
            <li>Payment gateway outages;</li>
            <li>Network interruptions;</li>
            <li>Customer errors when entering payment information;</li>
            <li>Delays caused by financial institutions.</li>
          </ul>
          <p>Where liability cannot legally be excluded, it will be limited to the extent permitted by applicable law.</p>

          <h3>20. Changes to this Policy</h3>
          <p>Pigglitz may update this Payment Policy from time to time.</p>
          <p>The revised version will be published on the Website with an updated Effective Date.</p>
          <p>Continued use of the Website after changes become effective constitutes acceptance of the revised Policy.</p>

          <h3>21. Governing Law</h3>
          <p>This Payment Policy shall be governed by the laws of India.</p>
          <p>Any disputes relating to payments shall be subject to the exclusive jurisdiction of the competent courts located in Kanpur, Uttar Pradesh, India, unless otherwise required by applicable law.</p>

          <h3>22. Contact Us</h3>
          <p>If you have any questions regarding payments, billing, or transaction issues, please contact:</p>
          <address>
            <strong>Pinaka Technologies SG Pvt. Ltd.</strong><br />
            Brand: Pigglitz<br />
            Registered Office:<br />
            86 Sanjay Gandhi Nagar<br />
            Naubasta<br />
            Kanpur, Uttar Pradesh – 208021<br />
            India<br /><br />
            <strong>Support Email:</strong> <a href="mailto:pigglitz3d@gmail.com" className="text-blue">pigglitz3d@gmail.com</a><br />
            <strong>Phone:</strong> +91 8299475268
          </address>
          <p>We will make reasonable efforts to respond to payment-related enquiries promptly.</p>

          <h3>23. Acceptance</h3>
          <p>By making a payment through the Pigglitz Website, you acknowledge that you have read, understood, and agree to this Payment Policy.</p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentPolicy;

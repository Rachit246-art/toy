import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import './PolicyPage.css';

const TermsConditions: React.FC = () => {
  return (
    <div className="policy-page">
      <SEO 
        title="Terms & Conditions | Pigglitz 3D Toys" 
        description="Terms and Conditions for using Pigglitz. Please read carefully before using our website or services."
      />
      <Navbar />
      
      <div className="container policy-container">
        <h1 className="text-purple">Terms & Conditions</h1>
        <p className="policy-date">Effective Date: July 24, 2026</p>
        
        <div className="policy-content">
          <p>
            These Terms & Conditions ("Terms") govern your access to and use of the Pigglitz website, products, and services. By accessing or using the website, creating an account, placing an order, or otherwise interacting with Pigglitz, you agree to be bound by these Terms.
          </p>
          <p>
            If you do not agree with these Terms, please do not use our website or services.
          </p>

          <h3>1. Company Information</h3>
          <p>Pigglitz is owned and operated by:</p>
          <address>
            <strong>Pinaka Technologies SG Pvt. Ltd.</strong><br />
            Registered Office:<br />
            86 Sanjay Gandhi Nagar<br />
            Naubasta<br />
            Kanpur, Uttar Pradesh – 208021<br />
            India<br /><br />
            <strong>Email:</strong> <a href="mailto:pigglitz3d@gmail.com" className="text-blue">pigglitz3d@gmail.com</a><br />
            <strong>Phone:</strong> +91 8299475268
          </address>

          <h3>2. Definitions</h3>
          <p>For the purpose of these Terms:</p>
          <ul>
            <li><strong>Company, Pigglitz, we, our,</strong> or <strong>us</strong> means Pinaka Technologies SG Pvt. Ltd.</li>
            <li><strong>Website</strong> means https://pigglitz.com and any related online services operated by the Company.</li>
            <li><strong>Customer, you,</strong> or <strong>your</strong> means any individual or business using our website or purchasing our products.</li>
            <li><strong>Consumer (B2C)</strong> means an individual purchasing products for personal or household use.</li>
            <li><strong>Business Customer (B2B)</strong> means a company, institution, school, retailer, distributor, reseller, or other commercial entity purchasing products for business purposes.</li>
            <li><strong>Products</strong> include toys, educational items, personalized 3D-printed products, accessories, and any other goods offered by Pigglitz.</li>
            <li><strong>Personalized Product</strong> means any product manufactured or modified based on customer-provided names, photographs, artwork, logos, or other customization requests.</li>
          </ul>

          <h3>3. Eligibility</h3>
          <p>You may use our website only if you:</p>
          <ul>
            <li>Are at least 18 years of age, or</li>
            <li>Are using the website under the supervision and consent of a parent or legal guardian where permitted by law.</li>
          </ul>
          <p>By using our services, you represent that you have the legal capacity to enter into a binding agreement.</p>
          <p>Business customers represent that the individual placing an order has the authority to bind the organization they represent.</p>

          <h3>4. Acceptance of Orders</h3>
          <p>All orders placed through the website are subject to acceptance by Pigglitz. Submitting an order does not guarantee acceptance.</p>
          <p>We reserve the right to:</p>
          <ul>
            <li>Reject any order;</li>
            <li>Cancel any order before dispatch;</li>
            <li>Refuse service where fraud, misuse, or unlawful activity is suspected;</li>
            <li>Limit quantities purchased;</li>
            <li>Decline orders that cannot be fulfilled due to stock or production constraints.</li>
          </ul>
          <p>If an order is cancelled after payment has been received, an appropriate refund will be processed in accordance with our Refund Policy.</p>

          <h3>5. Customer Accounts</h3>
          <p>To access certain features, you may be required to create an account. You agree to:</p>
          <ul>
            <li>Provide accurate and complete information.</li>
            <li>Keep your account credentials confidential.</li>
            <li>Promptly update any changes to your information.</li>
            <li>Notify us immediately of any unauthorized use of your account.</li>
          </ul>
          <p>You are responsible for all activities conducted under your account. Pigglitz may suspend or terminate accounts used in violation of these Terms.</p>

          <h3>6. Product Information</h3>
          <p>We make reasonable efforts to ensure that product descriptions, specifications, dimensions, colors, and images are accurate. However:</p>
          <ul>
            <li>Colors may vary depending on screen settings.</li>
            <li>Measurements may include reasonable manufacturing tolerances.</li>
            <li>Personalized 3D-printed products may contain minor layer lines, texture variations, or slight color differences inherent to the manufacturing process.</li>
          </ul>
          <p>These variations do not constitute defects.</p>

          <h3>7. Personalized Products</h3>
          <p>Pigglitz specializes in customized and personalized products. Customers may submit: Names, Initials, Messages, Photographs, Logos, Artwork, Design files.</p>
          <p>By submitting such content, you confirm that:</p>
          <ul>
            <li>You own the content, or</li>
            <li>You have obtained all required permissions to use it.</li>
          </ul>
          <p>You agree not to upload content that:</p>
          <ul>
            <li>Infringes intellectual property rights;</li>
            <li>Violates privacy or publicity rights;</li>
            <li>Contains unlawful, defamatory, obscene, hateful, or offensive material;</li>
            <li>Contains viruses or malicious software.</li>
          </ul>
          <p>Pigglitz reserves the right to reject any personalization request that violates these Terms or applicable law.</p>

          <h3>8. Approval of Personalized Designs</h3>
          <p>Where a proof, mock-up, or preview is provided, customers are responsible for reviewing and approving it before production begins. Once production has started, changes may not be possible.</p>
          <p>Pigglitz is not responsible for errors that were present in a customer-approved design, including spelling mistakes, formatting choices, or uploaded images.</p>

          <h3>9. Pricing</h3>
          <p>All prices displayed on the website are in Indian Rupees (INR) unless otherwise stated. Prices may be changed at any time without prior notice.</p>
          <p>Applicable taxes, shipping charges, and other fees will be displayed during checkout where required.</p>
          <p>Pricing errors may occasionally occur. If a pricing error is identified after an order is placed, Pigglitz reserves the right to cancel the order and issue a refund.</p>

          <h3>10. Payments</h3>
          <p>Pigglitz currently accepts payments through approved payment methods, including UPI and Razorpay-supported payment options.</p>
          <p>Payment must be successfully completed before an order is processed unless otherwise agreed in writing.</p>
          <p>Pigglitz does not store full card details, UPI PINs, CVV numbers, or banking credentials. Payment processing is performed by authorized third-party payment providers.</p>

          <h3>11. Fraud Prevention</h3>
          <p>Pigglitz reserves the right to verify customer identity and payment information before accepting or dispatching any order.</p>
          <p>Orders may be delayed, cancelled, or refused if fraud, unauthorized payment activity, or suspicious transactions are detected.</p>

          <h3>12. B2C Purchases</h3>
          <p>Individual consumers purchasing products agree that:</p>
          <ul>
            <li>Products are intended for lawful personal use.</li>
            <li>Information provided during purchase is accurate.</li>
            <li>Products should be used according to any instructions or safety guidance supplied.</li>
            <li>Adult supervision is recommended where appropriate for children's products.</li>
          </ul>

          <h3>13. B2B Purchases</h3>
          <p>Business customers, including schools, retailers, distributors, and corporate buyers, agree that:</p>
          <ul>
            <li>Purchase orders are placed by authorized representatives.</li>
            <li>Products may not be resold in a misleading or unlawful manner.</li>
            <li>Pigglitz branding, trademarks, and product information may not be altered without permission.</li>
            <li>Commercial orders may be subject to additional written agreements, quotations, or negotiated pricing.</li>
          </ul>
          <p>Where a separate commercial agreement exists, that agreement will prevail in the event of any inconsistency with these Terms.</p>

          <h3>14. Availability of Products</h3>
          <p>Product availability is subject to stock, production capacity, and raw material availability. Pigglitz reserves the right to:</p>
          <ul>
            <li>Discontinue products;</li>
            <li>Modify product specifications;</li>
            <li>Limit purchase quantities;</li>
            <li>Substitute packaging where necessary.</li>
          </ul>
          <p>Such changes will not materially reduce the quality or intended function of the product.</p>

          <h3>15. Product Safety</h3>
          <p>Pigglitz designs products with care; however, customers remain responsible for ensuring that products are used appropriately.</p>
          <p>Customers should:</p>
          <ul>
            <li>Follow all safety instructions;</li>
            <li>Supervise children where necessary;</li>
            <li>Use products only for their intended purpose;</li>
            <li>Inspect products upon delivery and discontinue use if a product appears damaged or unsafe.</li>
          </ul>
          <p>Some products may contain small parts and may not be suitable for children below the recommended age indicated on the product or packaging.</p>

          <h3>16. Customer Responsibilities</h3>
          <p>You agree to:</p>
          <ul>
            <li>Provide accurate information.</li>
            <li>Cooperate with verification requests.</li>
            <li>Use the website lawfully.</li>
            <li>Refrain from disrupting website operations.</li>
            <li>Respect the rights of other users.</li>
            <li>Not engage in fraudulent, abusive, or unlawful conduct.</li>
          </ul>
          <p>Failure to comply with these obligations may result in suspension of your account, cancellation of orders, or legal action where appropriate.</p>

          <h3>17. Communications</h3>
          <p>By creating an account or placing an order, you consent to receive communications related to:</p>
          <ul>
            <li>Order confirmations</li>
            <li>Payment receipts</li>
            <li>Shipping updates</li>
            <li>Customer service requests</li>
            <li>Important legal notices</li>
            <li>Product recall or safety information where applicable</li>
          </ul>
          <p>Marketing communications will be sent only where permitted by law or where you have provided the necessary consent. You may opt out of marketing messages at any time.</p>

          <h3>18. Shipping & Delivery</h3>
          <p>Pigglitz currently ships products within India only.</p>
          <p>Estimated delivery times displayed on the Website are provided for informational purposes and may vary due to factors beyond our control, including weather conditions, transportation disruptions, public holidays, government restrictions, or courier delays.</p>
          <p>Risk of loss or damage passes to the customer upon successful delivery to the shipping address provided during checkout.</p>
          <p>Customers are responsible for providing accurate shipping information. Pigglitz is not liable for delays or additional costs arising from incorrect or incomplete delivery details.</p>

          <h3>19. Inspection of Products</h3>
          <p>Customers should inspect all products immediately upon delivery. If a package appears damaged or tampered with, customers should:</p>
          <ul>
            <li>Take photographs before opening the package;</li>
            <li>Notify Pigglitz promptly;</li>
            <li>Retain the packaging until the issue is resolved.</li>
          </ul>
          <p>Failure to report visible transit damage within a reasonable period may affect the ability to investigate the claim.</p>

          <h3>20. Returns, Refunds & Exchanges</h3>
          <p>Returns, refunds, and exchanges are governed by the Pigglitz Return, Refund & Exchange Policy. Unless otherwise stated:</p>
          <ul>
            <li>Eligible products may be returned within <strong>7 days</strong> of delivery.</li>
            <li>Returned products must be unused, in their original condition, and include original packaging where reasonably possible.</li>
            <li>Refunds approved by Pigglitz may take up to <strong>45 days</strong> to be processed, depending on the payment method and financial institution.</li>
          </ul>
          <p>Customized or personalized products are generally <strong>not eligible for return, exchange, or refund solely because the customer changes their mind</strong>, provided the product matches the approved customization and is free from manufacturing defects. This does not affect any rights available under applicable consumer protection laws.</p>

          <h3>21. Cancellation of Orders</h3>
          <p>Customers may request cancellation before production or dispatch begins. Orders for personalized or made-to-order products may not be cancelled once manufacturing has commenced.</p>
          <p>Pigglitz reserves the right to cancel any order if:</p>
          <ul>
            <li>Payment cannot be verified;</li>
            <li>Fraud or unauthorized activity is suspected;</li>
            <li>Required materials become unavailable;</li>
            <li>An obvious pricing or technical error has occurred;</li>
            <li>Delivery cannot reasonably be completed.</li>
          </ul>
          <p>Where applicable, refunds will be processed in accordance with our Refund Policy.</p>

          <h3>22. Intellectual Property</h3>
          <p>All intellectual property rights relating to the Website and its content, including text, graphics, logos, icons, product designs (except customer-provided content), photographs, videos, software, layouts, trademarks, and branding, are owned by or licensed to Pinaka Technologies SG Pvt. Ltd.</p>
          <p>No part of the Website may be copied, reproduced, modified, distributed, published, or commercially exploited without prior written permission.</p>
          <p>Nothing in these Terms transfers ownership of our intellectual property to you.</p>

          <h3>23. Customer Content & License</h3>
          <p>When you upload photographs, artwork, names, logos, or other content for personalization, you confirm that:</p>
          <ul>
            <li>You own the content or have the legal right to use it;</li>
            <li>The content does not infringe any third-party rights;</li>
            <li>The content does not violate applicable laws.</li>
          </ul>
          <p>You grant Pigglitz a limited, non-exclusive, royalty-free license to use the submitted content solely for:</p>
          <ul>
            <li>Manufacturing your personalized product;</li>
            <li>Quality assurance;</li>
            <li>Customer support;</li>
            <li>Resolving disputes related to your order.</li>
          </ul>
          <p>This license ends once it is no longer reasonably necessary to fulfill these purposes, except where retention is required by law.</p>
          <p>Pigglitz does not claim ownership of customer-submitted content.</p>

          <h3>24. Prohibited Conduct</h3>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Website for unlawful purposes;</li>
            <li>Attempt unauthorized access to systems or accounts;</li>
            <li>Introduce malware, viruses, or harmful code;</li>
            <li>Interfere with Website functionality;</li>
            <li>Upload content that is defamatory, abusive, obscene, hateful, discriminatory, or illegal;</li>
            <li>Infringe the intellectual property rights of others;</li>
            <li>Misrepresent your identity or authority.</li>
          </ul>
          <p>Pigglitz may suspend or terminate access for violations of these Terms.</p>

          <h3>25. Product Warranty</h3>
          <p>Unless expressly stated otherwise, Pigglitz warrants that products will substantially conform to their description at the time of delivery.</p>
          <p>This warranty does not cover damage arising from:</p>
          <ul>
            <li>Misuse;</li>
            <li>Improper storage;</li>
            <li>Accidents;</li>
            <li>Normal wear and tear;</li>
            <li>Unauthorized modifications or repairs;</li>
            <li>Failure to follow product care or safety instructions.</li>
          </ul>
          <p>Nothing in this clause limits any non-excludable rights under applicable consumer protection laws.</p>

          <h3>26. Limitation of Liability</h3>
          <p>To the fullest extent permitted by law, Pigglitz shall not be liable for:</p>
          <ul>
            <li>Indirect, incidental, special, consequential, or punitive damages;</li>
            <li>Loss of profits, business opportunities, or goodwill;</li>
            <li>Loss of data;</li>
            <li>Delays caused by third-party service providers;</li>
            <li>Events beyond our reasonable control.</li>
          </ul>
          <p>Where liability cannot be excluded by law, Pigglitz's total liability arising from any claim relating to a product or order shall not exceed the amount paid by the customer for the relevant product, except where applicable law requires otherwise.</p>

          <h3>27. Indemnification</h3>
          <p>You agree to indemnify and hold harmless Pinaka Technologies SG Pvt. Ltd., its directors, officers, employees, affiliates, and representatives from any claims, losses, liabilities, damages, costs, or expenses arising out of:</p>
          <ul>
            <li>Your breach of these Terms;</li>
            <li>Your misuse of the Website;</li>
            <li>Your violation of applicable laws;</li>
            <li>Content uploaded by you that infringes the rights of others.</li>
          </ul>

          <h3>28. Force Majeure</h3>
          <p>Pigglitz shall not be liable for any delay or failure to perform its obligations where such delay or failure results from events beyond its reasonable control, including but not limited to:</p>
          <ul>
            <li>Natural disasters;</li>
            <li>Floods;</li>
            <li>Fires;</li>
            <li>Epidemics or pandemics;</li>
            <li>War or civil unrest;</li>
            <li>Government actions;</li>
            <li>Strikes or labor disputes;</li>
            <li>Power failures;</li>
            <li>Internet or telecommunications outages;</li>
            <li>Supply chain disruptions.</li>
          </ul>
          <p>Performance of affected obligations will be suspended for the duration of the force majeure event.</p>

          <h3>29. Privacy</h3>
          <p>Your use of the Website is also governed by the Pigglitz Privacy Policy, which explains how personal information is collected, used, stored, and protected.</p>

          <h3>30. Third-Party Services</h3>
          <p>The Website may integrate or link to third-party services, including payment processors, logistics providers, analytics services, or social media platforms.</p>
          <p>Pigglitz is not responsible for the content, availability, privacy practices, or terms of third-party services. Your use of those services is subject to their own terms and policies.</p>

          <h3>31. Suspension & Termination</h3>
          <p>Pigglitz reserves the right to suspend or terminate access to the Website or services if:</p>
          <ul>
            <li>These Terms are violated;</li>
            <li>Fraudulent or unlawful activity is suspected;</li>
            <li>Customer conduct threatens the security or integrity of the Website or business operations.</li>
          </ul>
          <p>Termination does not affect rights or obligations that accrued prior to termination.</p>

          <h3>32. Governing Law</h3>
          <p>These Terms shall be governed by and interpreted in accordance with the laws of India.</p>

          <h3>33. Dispute Resolution & Jurisdiction</h3>
          <p>The parties will endeavor to resolve disputes amicably through good-faith discussions.</p>
          <p>If a dispute cannot be resolved informally, it shall be subject to the exclusive jurisdiction of the competent courts located in Kanpur, Uttar Pradesh, India, unless applicable law provides otherwise.</p>

          <h3>34. Changes to These Terms</h3>
          <p>Pigglitz may amend these Terms from time to time to reflect changes in legal requirements, business practices, or services.</p>
          <p>The updated Terms will be published on the Website with a revised Effective Date. Continued use of the Website after the effective date of the updated Terms constitutes acceptance of those changes.</p>

          <h3>35. Severability</h3>
          <p>If any provision of these Terms is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall remain in full force and effect.</p>

          <h3>36. Waiver</h3>
          <p>Failure by Pigglitz to enforce any provision of these Terms shall not constitute a waiver of that provision or any other rights.</p>

          <h3>37. Entire Agreement</h3>
          <p>These Terms, together with the Privacy Policy and any other policies expressly incorporated by reference, constitute the entire agreement between you and Pigglitz regarding your use of the Website and purchase of products.</p>

          <h3>38. Contact Information</h3>
          <address>
            <strong>Pinaka Technologies SG Pvt. Ltd.</strong><br />
            Pigglitz<br />
            86 Sanjay Gandhi Nagar<br />
            Naubasta<br />
            Kanpur, Uttar Pradesh – 208021<br />
            India<br /><br />
            <strong>Support Email:</strong> <a href="mailto:pigglitz3d@gmail.com" className="text-blue">pigglitz3d@gmail.com</a><br />
            <strong>Phone:</strong> +91 8299475268
          </address>
          <p>For legal notices or questions regarding these Terms, please contact us using the details above.</p>

          <h3>39. Acceptance</h3>
          <p>By accessing or using the Pigglitz Website, creating an account, placing an order, or purchasing products, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.</p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsConditions;

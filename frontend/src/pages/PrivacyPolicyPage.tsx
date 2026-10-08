import React from 'react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="border-b border-cocoa-100 pb-4">
        <h1 className="font-serif text-3xl font-bold text-cocoa-950">Privacy Policy</h1>
        <p className="text-xs text-cocoa-500 mt-1">Last Updated: September 2026</p>
      </div>

      <div className="prose prose-stone text-xs sm:text-sm text-cocoa-700 leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-cocoa-950">1. Information We Collect</h2>
          <p>
            Cocoa Bliss collects customer names, delivery addresses, telephone numbers, and email addresses solely for processing chocolate orders, coordinating doorstep delivery, and sending shipment updates.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-cocoa-950">2. Payment Data Security</h2>
          <p>
            We do not store complete credit/debit card numbers or UPI PINs on our servers. All transactions are handled securely through certified payment gateways or via Cash on Delivery.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-cocoa-950">3. Contact & Inquiries</h2>
          <p>
            If you have questions regarding your personal information or wish to delete your account, please reach out to privacy@cocoabliss.com.
          </p>
        </section>
      </div>
    </div>
  );
};

import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="border-b border-cocoa-100 pb-4">
        <h1 className="font-serif text-3xl font-bold text-cocoa-950">Terms & Conditions</h1>
        <p className="text-xs text-cocoa-500 mt-1">Last Updated: September 2026</p>
      </div>

      <div className="prose prose-stone text-xs sm:text-sm text-cocoa-700 leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-cocoa-950">1. Homemade Chocolate Freshness</h2>
          <p>
            All chocolates from Cocoa Bliss are handcrafted in small batches without artificial preservatives. We recommend storing chocolates in a cool, dry place between 15°C and 20°C away from direct sunlight and strong odors.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-cocoa-950">2. Order Delivery & Shipping</h2>
          <p>
            We use specialized thermal insulated packaging to protect chocolates during transit. Orders placed before 2:00 PM are generally prepared and dispatched within 24–48 hours.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-cocoa-950">3. Cancellations & Returns</h2>
          <p>
            Orders can be cancelled through the website as long as their status is "Pending" or "Confirmed". Due to the perishable nature of homemade chocolates, returns after dispatch are only accepted in cases of transit damage.
          </p>
        </section>
      </div>
    </div>
  );
};

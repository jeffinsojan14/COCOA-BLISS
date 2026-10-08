import React from 'react';
import { Heart, Sparkles, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-caramel-600 block">Our Sweet Origin</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-cocoa-950 tracking-tight leading-tight">
          Handmade Chocolates, <br />
          Crafted with Love & Pure Passion.
        </h1>
        <p className="text-xs sm:text-sm text-cocoa-600 leading-relaxed max-w-xl mx-auto">
          Born out of a small artisan kitchen in Bengaluru, Cocoa Bliss was founded with a singular mission: to bring back the magic of genuine homemade chocolates, free from artificial additives, palm oil, and industrial shortcuts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="rounded-3xl overflow-hidden shadow-xl border border-cocoa-200">
          <img
            src="/products/hazelnut-truffles.jpg"
            alt="Handcrafting truffles"
            className="w-full h-80 sm:h-96 object-cover"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('unsplash')) {
                target.src = 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=800&q=80';
              }
            }}
          />
        </div>
        <div className="space-y-5 text-xs sm:text-sm text-cocoa-700 leading-relaxed">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cocoa-950">Slow Small-Batch Craftsmanship</h2>
          <p>
            Unlike commercial brands that replace rich cocoa butter with cheap hydrogenated vegetable oils, every single Cocoa Bliss chocolate uses <strong>100% pure cocoa butter</strong> and ethically sourced cocoa beans from sustainable plantations.
          </p>
          <p>
            From slow-roasting California almonds to simmering our signature salted caramel on copper kettles and hand-rolling velvety ganache truffles, our process is slow, deliberate, and deeply personal.
          </p>
          <div className="p-4 bg-cocoa-50 rounded-2xl border border-cocoa-100 text-xs italic text-cocoa-900">
            "We believe that real chocolate should melt smoothly on the tongue, release complex floral aromas, and leave you with genuine happiness."
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
        <div className="bg-white p-6 rounded-2xl border border-[#ebdccd] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-cocoa-50 text-caramel-600 flex items-center justify-center">
            <Heart size={22} />
          </div>
          <h3 className="font-serif font-bold text-base text-cocoa-950">Small Batch Pride</h3>
          <p className="text-xs text-cocoa-600 leading-relaxed">
            We make no more than 50 boxes a day so each customer receives fresh chocolate at the absolute peak of flavor.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#ebdccd] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-cocoa-50 text-caramel-600 flex items-center justify-center">
            <Sparkles size={22} />
          </div>
          <h3 className="font-serif font-bold text-base text-cocoa-950">No Preservatives</h3>
          <p className="text-xs text-cocoa-600 leading-relaxed">
            Pure natural dairy, real Bourbon vanilla, unrefined cane sugar, and zero chemical stabilizers or artificial wax.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#ebdccd] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-cocoa-50 text-caramel-600 flex items-center justify-center">
            <Award size={22} />
          </div>
          <h3 className="font-serif font-bold text-base text-cocoa-950">Celebration Packaging</h3>
          <p className="text-xs text-cocoa-600 leading-relaxed">
            Designed for gifting. Tied with luxurious satin ribbons, stamped with our gold seal, and thermally packed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

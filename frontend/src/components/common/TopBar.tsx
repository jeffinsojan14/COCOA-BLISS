import React from 'react';
import { Phone, Mail, Heart, Truck } from 'lucide-react';

export const TopBar: React.FC = () => {
  return (
    <div className="bg-[#1e0d06] text-[#e8ded5] text-xs py-2 px-4 border-b border-[#2d140a] transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Contact Info */}
        <div className="flex items-center gap-4 text-xs">
          <a
            href="tel:+919876543210"
            className="flex items-center gap-1.5 hover:text-caramel-400 transition-colors"
          >
            <Phone size={13} className="text-caramel-400" />
            <span>+91 98765 43210</span>
          </a>
          <span className="text-cocoa-700">|</span>
          <a
            href="mailto:support@cocoabliss.com"
            className="flex items-center gap-1.5 hover:text-caramel-400 transition-colors"
          >
            <Mail size={13} className="text-caramel-400" />
            <span>support@cocoabliss.com</span>
          </a>
        </div>

        {/* Center: Brand Value Note */}
        <div className="hidden md:flex items-center gap-1.5 text-xs font-medium text-cocoa-200">
          <span>Handmade with</span>
          <Heart size={12} className="text-red-500 fill-red-500 inline mx-0.5" />
          <span>|</span>
          <span className="text-caramel-300">100% Premium Ingredients</span>
        </div>

        {/* Right: Shipping Offer */}
        <div className="flex items-center gap-1.5 text-xs font-medium text-caramel-300">
          <Truck size={13} className="text-caramel-400" />
          <span>Free Shipping on Orders Above ₹999</span>
        </div>
      </div>
    </div>
  );
};

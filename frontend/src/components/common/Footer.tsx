import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[#1e0d06] text-[#e8ded5] pt-16 pb-10 border-t-4 border-caramel-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-cocoa-800">
          
          {/* Col 1: Brand & Story */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-caramel-500 flex items-center justify-center text-cocoa-950 font-bold">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C8.5 2 5.2 3.8 3.5 6.8C1.8 9.8 1.9 13.5 3.8 16.3C5.7 19.1 8.8 20.8 12 20.8C15.2 20.8 18.3 19.1 20.2 16.3C22.1 13.5 22.2 9.8 20.5 6.8C18.8 3.8 15.5 2 12 2Z" />
                </svg>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-white block leading-tight">
                  Cocoa Bliss
                </span>
                <span className="text-[10px] tracking-widest text-caramel-400 uppercase font-medium">
                  Homemade Chocolates
                </span>
              </div>
            </div>
            <p className="text-xs text-cocoa-300 leading-relaxed">
              Crafting joy one batch at a time. Made with 100% pure cocoa butter, single-origin cacao, and natural ingredients. No preservatives, only pure chocolate love.
            </p>
            <div className="pt-2 text-xs space-y-2 text-cocoa-200">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-caramel-400" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-caramel-400" />
                <span>support@cocoabliss.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-caramel-400" />
                <span>12 Artisan Way, Indiranagar, Bengaluru</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs text-cocoa-300">
              <li>
                <Link to="/" className="hover:text-caramel-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-caramel-400 transition-colors">
                  All Chocolates
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-caramel-400 transition-colors">
                  Chocolate Categories
                </Link>
              </li>
              <li>
                <Link to="/shop?category=gift-boxes" className="hover:text-caramel-400 transition-colors">
                  Luxury Gift Boxes
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-caramel-400 transition-colors">
                  Our Story & Heritage
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-caramel-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div>
            <h4 className="font-serif text-lg font-bold text-white mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-xs text-cocoa-300">
              <li>
                <Link to="/orders" className="hover:text-caramel-400 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-caramel-400 transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-caramel-400 transition-colors">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-caramel-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-caramel-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <span className="text-caramel-400 block font-medium mt-2">
                  🚚 Free Shipping over ₹999
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 className="font-serif text-lg font-bold text-white mb-2">Sweet Privileges</h4>
            <p className="text-xs text-cocoa-300 mb-4">
              Subscribe to receive exclusive secret tasting invitations, festive chocolate releases, and 10% off your first handcrafted box.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-3.5 py-2.5 bg-cocoa-900 border border-cocoa-700 rounded-lg text-xs text-white placeholder-cocoa-500 focus:outline-none focus:border-caramel-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-caramel-500 hover:bg-caramel-600 text-cocoa-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Subscribe</span>
                <ArrowRight size={13} />
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-caramel-400 mt-2">
                🤎 Welcome to the Cocoa Bliss family!
              </p>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-cocoa-400 gap-4">
          <p>
            &copy; {new Date().getFullYear()} Cocoa Bliss Homemade Chocolates. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <span>Handcrafted with</span>
            <Heart size={12} className="text-red-500 fill-red-500 inline" />
            <span>for Chocolate Lovers Everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

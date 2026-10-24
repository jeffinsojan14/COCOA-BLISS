import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, Heart, Truck, ShieldCheck, Gift, ArrowRight } from 'lucide-react';
import { productService } from '../services/api';
import { Product, Category } from '../types';
import { ProductCard } from '../components/products/ProductCard';

export const HomePage: React.FC = () => {
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          productService.getProducts({ bestseller: true }),
          productService.getCategories(),
        ]);
        setBestsellers(productsData.slice(0, 6));
        setCategories(categoriesData);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#1b0a04] via-[#2a1309] to-[#1e0d06] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5 z-10">
              <span className="text-xs sm:text-sm font-bold tracking-[0.25em] text-caramel-400 uppercase inline-block font-sans">
                INDULGE IN PURE HAPPINESS
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] text-white">
                Homemade Chocolates, <br />
                <span className="text-[#f7e6d4]">Made with Love. 🤎</span>
              </h1>
              <p className="text-sm sm:text-base text-cocoa-200 max-w-xl leading-relaxed font-sans font-light">
                Crafted with the finest ingredients and lots of love, delivered to make your moments sweeter.
              </p>
              <div className="pt-3 flex flex-wrap items-center gap-4">
                <Link
                  to="/shop"
                  className="px-6 sm:px-8 py-3 bg-[#c58b35] hover:bg-[#b47b2a] text-cocoa-950 font-bold text-xs sm:text-sm rounded-full transition-all shadow-lg hover:shadow-caramel-500/20 flex items-center gap-2 group"
                >
                  <span>SHOP NOW</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/shop?category=gift-boxes"
                  className="px-6 sm:px-8 py-3 bg-transparent border border-white/40 hover:bg-white/10 hover:border-white text-white font-medium text-xs sm:text-sm rounded-full transition-all"
                >
                  EXPLORE GIFT BOXES
                </Link>
              </div>
              <div className="pt-6 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-caramel-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
              </div>
            </div>
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md lg:max-w-none">
                <div className="absolute -inset-4 bg-caramel-500/10 rounded-3xl filter blur-2xl" />
                <div className="relative rounded-2xl overflow-hidden border-2 border-caramel-500/30 shadow-2xl">
                  <img
                    src="/hero-chocolate.jpg"
                    alt="Cocoa Bliss Artisan Chocolates"
                    className="w-full h-80 sm:h-96 object-cover object-center"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes('unsplash')) {
                        target.src = 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1000&q=85';
                      }
                    }}
                  />
                  <div className="absolute bottom-4 right-4 bg-cocoa-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-caramel-500/30 text-right">
                    <span className="font-serif text-xs font-bold text-white block">Cocoa Bliss</span>
                    <span className="text-[9px] tracking-widest text-caramel-300 uppercase block">HOMEMADE CHOCOLATES</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Ribbon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-[#ebdccd] shadow-xs py-6 px-4 sm:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center lg:text-left">
            <div className="flex flex-col lg:flex-row items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-cocoa-50 flex items-center justify-center text-cocoa-900 shrink-0">
                <Sparkles size={20} className="text-caramel-600" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-cocoa-950">Premium Ingredients</h4>
                <p className="text-[11px] text-cocoa-500">Finest quality, always</p>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-cocoa-50 flex items-center justify-center text-cocoa-900 shrink-0">
                <Heart size={20} className="text-caramel-600" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-cocoa-950">Handmade with Love</h4>
                <p className="text-[11px] text-cocoa-500">Made in small batches</p>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-cocoa-50 flex items-center justify-center text-cocoa-900 shrink-0">
                <Truck size={20} className="text-caramel-600" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-cocoa-950">Fast & Reliable Delivery</h4>
                <p className="text-[11px] text-cocoa-500">Right to your doorstep</p>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-cocoa-50 flex items-center justify-center text-cocoa-900 shrink-0">
                <ShieldCheck size={20} className="text-caramel-600" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-cocoa-950">Secure Payments</h4>
                <p className="text-[11px] text-cocoa-500">100% safe & secure</p>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-3 col-span-2 sm:col-span-1">
              <div className="w-11 h-11 rounded-full bg-cocoa-50 flex items-center justify-center text-cocoa-900 shrink-0">
                <Gift size={20} className="text-caramel-600" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-cocoa-950">Beautiful Packaging</h4>
                <p className="text-[11px] text-cocoa-500">Perfect for gifting</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 relative">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cocoa-950 tracking-tight flex items-center justify-center gap-2">
            <span>BEST SELLERS</span>
            <span className="text-caramel-600 text-xl">🤎</span>
          </h2>
          <p className="text-xs sm:text-sm text-cocoa-500 mt-1">Our customers' most loved chocolates</p>
          <Link
            to="/shop?bestseller=true"
            className="absolute right-0 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-xs font-bold text-cocoa-900 hover:text-caramel-600 transition-colors"
          >
            <span>View All</span>
            <ChevronRight size={14} />
          </Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 border border-cocoa-100 animate-pulse h-72" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {bestsellers.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
        <div className="sm:hidden text-center mt-6">
          <Link
            to="/shop?bestseller=true"
            className="inline-flex items-center gap-1 text-xs font-bold text-cocoa-900 hover:text-caramel-600"
          >
            <span>View All Best Sellers</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </section>

      {/* Explore By Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cocoa-950 tracking-tight">Explore By Category</h2>
          <p className="text-xs sm:text-sm text-cocoa-500 mt-1">Discover your favorite flavor profile</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group bg-white rounded-2xl border border-[#ebdccd] hover:border-caramel-400 p-3 text-center transition-all duration-300 hover:shadow-lg flex flex-col items-center"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 border-2 border-cocoa-100 group-hover:border-caramel-400 transition-colors">
                <img
                  src={cat.display_image || cat.image_url || '/placeholder-chocolate.jpg'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/placeholder-chocolate.jpg')) {
                      target.src = '/placeholder-chocolate.jpg';
                    }
                  }}
                />
              </div>
              <h3 className="font-serif font-bold text-xs sm:text-sm text-cocoa-950 group-hover:text-caramel-700 transition-colors">
                {cat.name}
              </h3>
              <span className="text-[10px] text-cocoa-500 mt-0.5">{cat.products_count} Varieties</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Festive Gifting Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-cocoa-950 via-[#3a1b11] to-cocoa-900 text-white p-8 sm:p-12 overflow-hidden relative shadow-xl border border-caramel-600/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-4">
              <span className="px-3 py-1 bg-caramel-500 text-cocoa-950 text-[11px] font-bold rounded-full uppercase tracking-wider inline-block">
                Festive Gifting & Celebrations
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight leading-tight">
                Gift Pure Chocolate Happiness to Someone Special
              </h3>
              <p className="text-xs sm:text-sm text-cocoa-200 leading-relaxed max-w-lg">
                Personalized wooden gift boxes, handwritten greeting cards, and artisan chocolate collections customized for birthdays, anniversaries, and corporate celebrations.
              </p>
              <div className="pt-2">
                <Link
                  to="/shop?category=gift-boxes"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-cocoa-950 font-bold text-xs sm:text-sm rounded-full hover:bg-caramel-400 transition-colors"
                >
                  <span>Explore Gift Collections</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src={
                  categories.find((c) => c.slug === 'gift-boxes')?.display_image ||
                  categories.find((c) => c.slug === 'gift-boxes')?.image_url ||
                  bestsellers.find((p) => p.category_slug === 'gift-boxes')?.display_image ||
                  bestsellers.find((p) => p.category_slug === 'gift-boxes')?.image_url ||
                  'https://ruchoks.com/cdn/shop/files/BR006_E.jpg?v=1756196598&width=1100'
                }
                alt="Celebration Chocolate Gift Box"
                className="rounded-2xl shadow-2xl border border-white/20 max-h-72 object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('ruchoks.com')) {
                    target.src = 'https://ruchoks.com/cdn/shop/files/BR006_E.jpg?v=1756196598&width=1100';
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cocoa-950 tracking-tight">Words From Chocolate Lovers</h2>
          <p className="text-xs sm:text-sm text-cocoa-500 mt-1">Real stories from our Cocoa Bliss community</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#ebdccd] shadow-xs space-y-3">
            <div className="text-amber-500 text-sm">★★★★★</div>
            <p className="text-xs text-cocoa-800 leading-relaxed italic">
              "The Assorted Chocolate Box was beyond expectations! Every bonbon had a distinct, silky flavor. You can truly taste that they are handmade with pure cocoa butter."
            </p>
            <div className="pt-2 border-t border-cocoa-50 flex items-center justify-between text-xs">
              <span className="font-bold text-cocoa-950">Priya Sharma</span>
              <span className="text-cocoa-400 text-[11px]">Bengaluru</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#ebdccd] shadow-xs space-y-3">
            <div className="text-amber-500 text-sm">★★★★★</div>
            <p className="text-xs text-cocoa-800 leading-relaxed italic">
              "Finally found dark chocolate that isn't bitter or waxy! The 75% bar snaps perfectly and melts like silk. It is now our permanent family treat."
            </p>
            <div className="pt-2 border-t border-cocoa-50 flex items-center justify-between text-xs">
              <span className="font-bold text-cocoa-950">Rahul Verma</span>
              <span className="text-cocoa-400 text-[11px]">Mumbai</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#ebdccd] shadow-xs space-y-3">
            <div className="text-amber-500 text-sm">★★★★★</div>
            <p className="text-xs text-cocoa-800 leading-relaxed italic">
              "Ordered hazelnut truffles for my best friend's birthday. The packaging with the satin ribbon was so royal, and delivery was right on time. 10/10!"
            </p>
            <div className="pt-2 border-t border-cocoa-50 flex items-center justify-between text-xs">
              <span className="font-bold text-cocoa-950">Ananya Roy</span>
              <span className="text-cocoa-400 text-[11px]">Kolkata</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

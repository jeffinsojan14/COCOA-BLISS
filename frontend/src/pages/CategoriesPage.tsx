import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { productService } from '../services/api';
import { Category } from '../types';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await productService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cocoa-950">Chocolate Categories</h1>
        <p className="text-xs sm:text-sm text-cocoa-600 mt-2">
          From intense 85% single-origin dark chocolate to melt-in-your-mouth hazelnut truffles and luxury gift boxes.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="bg-white rounded-3xl h-64 border border-cocoa-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group bg-white rounded-3xl border border-[#ebdccd] overflow-hidden shadow-xs hover:shadow-xl hover:border-caramel-400 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/10] bg-cocoa-50 overflow-hidden">
                <img
                  src={cat.display_image || cat.image_url || '/placeholder-chocolate.jpg'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/placeholder-chocolate.jpg')) {
                      target.src = '/placeholder-chocolate.jpg';
                    }
                  }}
                />
                <span className="absolute bottom-3 right-3 bg-cocoa-950/80 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full">
                  {cat.products_count} Creations
                </span>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-serif font-bold text-xl text-cocoa-950 group-hover:text-caramel-700 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-cocoa-600 mt-1 leading-relaxed">{cat.description}</p>
                </div>
                <div className="pt-2 flex items-center gap-1 text-xs font-bold text-cocoa-950 group-hover:text-caramel-700">
                  <span>Explore Collection</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;

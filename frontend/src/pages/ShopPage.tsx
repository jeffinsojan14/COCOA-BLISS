import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import { Product, Category } from '../types';
import { productService } from '../services/api';
import { ProductCard } from '../components/products/ProductCard';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync URL search params
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlSearch = searchParams.get('search');
    const urlBestseller = searchParams.get('bestseller');

    if (urlCategory !== null) setSelectedCategory(urlCategory);
    if (urlSearch !== null) setSearch(urlSearch);
    if (urlBestseller === 'true') setSortOption('featured');
  }, [searchParams]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [prodList, catList] = await Promise.all([
          productService.getProducts(),
          productService.getCategories(),
        ]);
        setProducts(prodList);
        setCategories(catList);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query filter
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.short_description.toLowerCase().includes(q) ||
          p.category_name.toLowerCase().includes(q) ||
          (p.ingredients && p.ingredients.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(
        (p) =>
          p.category_slug.toLowerCase() === selectedCategory.toLowerCase() ||
          p.category_name.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Price filter
    result = result.filter((p) => {
      const price = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
      return price <= maxPrice;
    });

    // In Stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.is_available && p.stock_quantity > 0);
    }

    // Bestseller filter from url
    if (searchParams.get('bestseller') === 'true') {
      result = result.filter((p) => p.is_bestseller);
    }

    // Sorting
    if (sortOption === 'price_asc') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortOption === 'price_desc') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortOption === 'rating') {
      result.sort((a, b) => Number(b.rating) - Number(a.rating));
    } else if (sortOption === 'newest') {
      result.sort((a, b) => (b.id || 0) - (a.id || 0));
    } else {
      // Featured: bestsellers first
      result.sort((a, b) => (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0));
    }

    return result;
  }, [products, search, selectedCategory, maxPrice, inStockOnly, sortOption, searchParams]);

  const clearAllFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setMaxPrice(1500);
    setInStockOnly(false);
    setSortOption('featured');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cocoa-950 tracking-tight">
          Our Handcrafted Chocolates
        </h1>
        <p className="text-xs sm:text-sm text-cocoa-600 mt-2">
          Pure cocoa butter, single-origin cacao, and natural ingredients. Small batches made fresh daily with love.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#ebdccd] shadow-xs space-y-6 sticky top-28">
            
            <div className="flex items-center justify-between pb-3 border-b border-cocoa-100">
              <span className="font-serif font-bold text-base text-cocoa-950 flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-caramel-600" />
                <span>Filters</span>
              </span>
              {(selectedCategory || search || inStockOnly || maxPrice < 1500) && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-caramel-700 hover:underline font-semibold"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Categories filter */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cocoa-900">Category</h4>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === ''
                      ? 'bg-cocoa-950 text-white'
                      : 'text-cocoa-700 hover:bg-cocoa-50'
                  }`}
                >
                  All Categories ({products.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      selectedCategory === cat.slug
                        ? 'bg-cocoa-950 text-white'
                        : 'text-cocoa-700 hover:bg-cocoa-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] opacity-75">
                      {products.filter((p) => p.category_slug === cat.slug).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-2 pt-2 border-t border-cocoa-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-wider text-cocoa-900">Max Price</span>
                <span className="font-bold text-caramel-700">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="200"
                max="1500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-cocoa-950 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-cocoa-400">
                <span>₹200</span>
                <span>₹1,500</span>
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="pt-2 border-t border-cocoa-100">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-cocoa-800">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-cocoa-300 text-cocoa-950 focus:ring-caramel-500 w-4 h-4 cursor-pointer"
                />
                <span>In Stock Only</span>
              </label>
            </div>

          </div>
        </aside>

        {/* Product Catalog Main Content */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Controls Bar: Search & Sort */}
          <div className="bg-white p-4 rounded-2xl border border-[#ebdccd] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cocoa-400" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search chocolates..."
                className="w-full pl-9 pr-8 py-2 bg-cocoa-50/70 border border-cocoa-200 rounded-xl text-xs text-cocoa-950 placeholder-cocoa-400 focus:outline-none focus:border-cocoa-950"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-cocoa-400 hover:text-cocoa-700"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle & Sort Dropdown */}
            <div className="flex items-center justify-between w-full sm:w-auto gap-3">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-cocoa-50 border border-cocoa-200 rounded-xl text-xs font-semibold text-cocoa-900"
              >
                <Filter size={14} />
                <span>Filters</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-cocoa-500 whitespace-nowrap hidden sm:inline">
                  Sort By:
                </span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-3 py-2 bg-white border border-cocoa-200 rounded-xl text-xs font-medium text-cocoa-900 focus:outline-none focus:border-cocoa-950"
                >
                  <option value="featured">Featured / Best Sellers</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>

          </div>

          {/* Active Filter Tags */}
          {(selectedCategory || search || inStockOnly || maxPrice < 1500) && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-cocoa-500 font-medium">Active Filters:</span>
              {selectedCategory && (
                <span className="bg-cocoa-100 text-cocoa-900 px-2.5 py-1 rounded-full flex items-center gap-1">
                  Category: {selectedCategory}
                  <X size={12} className="cursor-pointer" onClick={() => setSelectedCategory('')} />
                </span>
              )}
              {search && (
                <span className="bg-cocoa-100 text-cocoa-900 px-2.5 py-1 rounded-full flex items-center gap-1">
                  Search: "{search}"
                  <X size={12} className="cursor-pointer" onClick={() => setSearch('')} />
                </span>
              )}
              {maxPrice < 1500 && (
                <span className="bg-cocoa-100 text-cocoa-900 px-2.5 py-1 rounded-full flex items-center gap-1">
                  Under ₹{maxPrice}
                  <X size={12} className="cursor-pointer" onClick={() => setMaxPrice(1500)} />
                </span>
              )}
              {inStockOnly && (
                <span className="bg-cocoa-100 text-cocoa-900 px-2.5 py-1 rounded-full flex items-center gap-1">
                  In Stock Only
                  <X size={12} className="cursor-pointer" onClick={() => setInStockOnly(false)} />
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-red-600 hover:underline font-semibold ml-1"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-4 border border-cocoa-100 animate-pulse h-80"></div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-cocoa-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-cocoa-50 text-cocoa-400 flex items-center justify-center mx-auto text-2xl">
                🍫
              </div>
              <h3 className="font-serif font-bold text-lg text-cocoa-950">
                No Chocolates Found
              </h3>
              <p className="text-xs text-cocoa-500 max-w-sm mx-auto">
                We couldn't find any chocolates matching your selected filters. Try searching for something else or reset your filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2 bg-cocoa-950 text-white rounded-full text-xs font-semibold hover:bg-caramel-600 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {filteredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}

        </main>

      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)}></div>
          <div className="relative ml-auto w-80 bg-white h-full p-6 space-y-6 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-cocoa-100 pb-4">
              <h3 className="font-serif font-bold text-lg text-cocoa-950">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="text-cocoa-500">
                <X size={20} />
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-cocoa-900">Categories</h4>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setMobileFiltersOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
                    selectedCategory === '' ? 'bg-cocoa-950 text-white' : 'text-cocoa-800'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      setMobileFiltersOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
                      selectedCategory === cat.slug ? 'bg-cocoa-950 text-white' : 'text-cocoa-800'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2 pt-4 border-t border-cocoa-100">
              <div className="flex justify-between text-xs font-bold text-cocoa-900">
                <span>Max Price:</span>
                <span>₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="200"
                max="1500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* In Stock */}
            <div className="pt-4 border-t border-cocoa-100">
              <label className="flex items-center gap-2 text-xs text-cocoa-900 font-medium">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full py-2.5 bg-cocoa-950 text-white rounded-xl text-xs font-bold uppercase"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

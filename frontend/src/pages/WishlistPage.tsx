import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export const WishlistPage: React.FC = () => {
  const { wishlist, removeItem, moveToCart, isLoading } = useWishlist();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-cocoa-50 flex items-center justify-center mx-auto text-cocoa-400">
          <Heart size={32} />
        </div>
        <h2 className="font-serif text-2xl font-bold text-cocoa-950">Save Your Favorites</h2>
        <p className="text-xs sm:text-sm text-cocoa-600 max-w-md mx-auto">
          Please log in to your account to manage your wishlist and move items to your shopping cart.
        </p>
        <Link
          to="/login"
          className="inline-block px-8 py-3 bg-cocoa-950 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-caramel-600 transition-colors shadow-md"
        >
          Login to View Wishlist
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-caramel-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-cocoa-600 font-medium">Loading saved chocolates...</p>
      </div>
    );
  }

  const items = wishlist?.items || [];

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto shadow-inner">
          <Heart size={36} />
        </div>
        <h2 className="font-serif text-3xl font-bold text-cocoa-950">Your Wishlist is Empty</h2>
        <p className="text-xs sm:text-sm text-cocoa-500 max-w-sm mx-auto">
          "Save your favorite chocolates here." Click the heart icon on any handcrafted chocolate to save it for later.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-cocoa-950 hover:bg-caramel-600 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-md"
        >
          <span>Explore Chocolates</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="border-b border-cocoa-100 pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cocoa-950">
          My Saved Chocolates ({items.length})
        </h1>
        <p className="text-xs text-cocoa-500 mt-0.5">Your personal collection of favorite homemade chocolates</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => {
          const product = item.product_details;
          const isOutOfStock = !product?.is_available || (product?.stock_quantity ?? 0) <= 0;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#ebdccd] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div>
                <div className="relative aspect-square bg-cocoa-50 overflow-hidden">
                  <img
                    src={product?.display_image || product?.image_url || '/placeholder-chocolate.jpg'}
                    alt={product?.name || 'Chocolate'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.endsWith('/placeholder-chocolate.jpg')) {
                        target.src = '/placeholder-chocolate.jpg';
                      }
                    }}
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 text-red-500 hover:bg-white flex items-center justify-center shadow-xs transition-colors"
                    title="Remove"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="p-4 space-y-1">
                  <Link
                    to={`/products/${product?.id}`}
                    className="font-serif font-bold text-sm text-cocoa-950 hover:text-caramel-700 transition-colors line-clamp-1 block"
                  >
                    {product?.name}
                  </Link>
                  <p className="text-xs text-cocoa-500">{product?.weight}</p>
                  <p className="text-sm font-bold text-cocoa-950 pt-1">₹{product?.price}</p>
                </div>
              </div>

              <div className="p-4 pt-0">
                {isOutOfStock ? (
                  <button
                    disabled
                    className="w-full py-2 bg-gray-100 text-gray-400 text-xs font-semibold rounded-lg cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                ) : (
                  <button
                    onClick={() => moveToCart(item.id)}
                    className="w-full py-2 bg-cocoa-950 hover:bg-caramel-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag size={14} />
                    <span>Move to Cart</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistPage;

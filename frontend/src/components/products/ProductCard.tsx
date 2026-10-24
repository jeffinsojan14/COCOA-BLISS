import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { RatingStars } from '../common/RatingStars';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  const inWishlist = isWishlisted(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.is_available || product.stock_quantity <= 0) return;
    try {
      setIsAdding(true);
      await addToCart(product.id, 1);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (err: any) {
      if (err.message?.includes('login')) {
        navigate('/login');
      } else {
        alert(err.message || 'Could not add to cart');
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsTogglingWishlist(true);
      await toggleWishlist(product.id);
    } catch (err: any) {
      if (err.message?.includes('login')) {
        navigate('/login');
      }
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const isOutOfStock = !product.is_available || product.stock_quantity <= 0;

  return (
    <div className="group bg-white rounded-2xl border border-[#ebdccd] hover:border-caramel-300 hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden relative">
      <Link to={`/products/${product.id}`} className="relative block w-full aspect-square overflow-hidden bg-cocoa-50/50 shrink-0">
        <img
          src={product.display_image || product.image_url || '/placeholder-chocolate.jpg'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.endsWith('/placeholder-chocolate.jpg')) {
              target.src = '/placeholder-chocolate.jpg';
            }
          }}
        />
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.is_bestseller && (
            <span className="bg-[#781b1b] text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded shadow-xs">
              BEST SELLER
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-gray-800 text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded shadow-xs">
              OUT OF STOCK
            </span>
          )}
        </div>
        <button
          onClick={handleToggleWishlist}
          disabled={isTogglingWishlist}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs transition-colors z-10 ${
            inWishlist ? 'text-red-500' : 'text-cocoa-500 hover:text-red-500'
          }`}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={16} className={inWishlist ? 'fill-red-500' : ''} />
        </button>
      </Link>

      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          <Link to={`/products/${product.id}`}>
            <h3
              className="font-serif font-bold text-sm sm:text-base text-cocoa-950 group-hover:text-caramel-700 transition-colors line-clamp-2 min-h-[2.5rem] leading-snug"
              title={product.name}
            >
              {product.name}
            </h3>
          </Link>
          <p className="text-[11px] sm:text-xs text-cocoa-500 mt-0.5">{product.weight}</p>
          <div className="mt-2 flex items-center gap-1.5">
            <RatingStars
              rating={typeof product.rating === 'string' ? parseFloat(product.rating) : product.rating}
              size={13}
              reviewCount={product.review_count}
              showCount={true}
            />
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-cocoa-950 font-sans">₹{price}</span>
            {product.original_price && (
              <span className="text-xs text-cocoa-400 line-through">₹{product.original_price}</span>
            )}
          </div>
        </div>

        <div className="mt-4 pt-2">
          {isOutOfStock ? (
            <button
              disabled
              className="w-full py-2 px-3 rounded-lg border border-cocoa-200 text-cocoa-400 text-xs font-semibold cursor-not-allowed text-center"
            >
              Out of Stock
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`w-full py-2 px-3 rounded-lg border border-cocoa-300 text-cocoa-900 text-xs font-semibold hover:border-cocoa-950 hover:bg-cocoa-950 hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5 ${
                justAdded ? 'bg-emerald-700 border-emerald-700 text-white' : ''
              }`}
            >
              {justAdded ? (
                <>
                  <Check size={14} />
                  <span>Added!</span>
                </>
              ) : isAdding ? (
                <span>Adding...</span>
              ) : (
                <>
                  <ShoppingBag size={14} />
                  <span>ADD TO CART</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

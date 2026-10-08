import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  AlertCircle,
  Package,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { productService } from '../services/api';
import { Product } from '../types';
import { RatingStars } from '../components/common/RatingStars';
import { ProductCard } from '../components/products/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (id) {
        try {
          setIsLoading(true);
          const data = await productService.getProductDetail(id);
          setProduct(data.product);
          setRelatedProducts(data.related_products);
          setQuantity(1);
        } catch (err) {
          console.error('Failed to load product details', err);
        } finally {
          setIsLoading(false);
        }
      }
    })();
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-caramel-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-cocoa-600 font-medium">Loading delicious details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-cocoa-950">Product Not Found</h2>
        <p className="text-xs text-cocoa-600">The chocolate you are looking for does not exist or has been retired.</p>
        <Link to="/shop" className="inline-block px-6 py-2.5 bg-cocoa-950 text-white rounded-full text-xs font-bold">
          Return to Shop
        </Link>
      </div>
    );
  }

  const inWishlist = isWishlisted(product.id);
  const isOutOfStock = !product.is_available || product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 10;

  const handleToggleWishlist = async () => {
    try {
      await toggleWishlist(product.id);
    } catch (err: any) {
      if (err.message?.includes('login')) {
        navigate('/login');
      }
    }
  };

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    try {
      setIsAdding(true);
      await addToCart(product.id, quantity);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 3000);
    } catch (err: any) {
      if (err.message?.includes('login')) {
        navigate('/login');
      } else {
        alert(err.message || 'Error adding to cart');
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setReviewError(null);
    setReviewSuccess(null);
    setIsSubmittingReview(true);
    try {
      const res = await productService.addReview(product.id, {
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewSuccess(res.message);
      setReviewComment('');
      const data = await productService.getProductDetail(product.id);
      setProduct(data.product);
    } catch (err: any) {
      setReviewError(err.response?.data?.error || 'Failed to submit review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumbs */}
      <nav className="text-xs text-cocoa-500 flex items-center gap-2">
        <Link to="/" className="hover:text-caramel-600">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-caramel-600">Shop</Link>
        <span>/</span>
        <Link to={`/shop?category=${product.category_slug}`} className="hover:text-caramel-600">
          {product.category_name}
        </Link>
        <span>/</span>
        <span className="text-cocoa-900 font-semibold">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Product Image */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative bg-white rounded-3xl border border-[#ebdccd] overflow-hidden shadow-md aspect-square flex items-center justify-center">
            <img
              src={product.display_image || product.image_url || '/placeholder-chocolate.jpg'}
              alt={product.name}
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('/placeholder-chocolate.jpg')) {
                  target.src = '/placeholder-chocolate.jpg';
                }
              }}
            />
            {product.is_bestseller && (
              <span className="absolute top-4 left-4 bg-[#781b1b] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded shadow-xs">
                BEST SELLER
              </span>
            )}
            <button
              onClick={handleToggleWishlist}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-md transition-colors ${
                inWishlist ? 'text-red-500' : 'text-cocoa-600 hover:text-red-500'
              }`}
            >
              <Heart size={20} className={inWishlist ? 'fill-red-500' : ''} />
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-caramel-600">
              {product.category_name}
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-cocoa-950 mt-1">
              {product.name}
            </h1>
            <p className="text-xs text-cocoa-500 mt-1 font-medium">
              Pack / Weight: <span className="text-cocoa-800 font-semibold">{product.weight}</span>
            </p>
            <div className="flex items-center gap-3 mt-3">
              <RatingStars
                rating={typeof product.rating === 'string' ? parseFloat(product.rating) : product.rating}
                size={16}
                reviewCount={product.review_count}
                showCount={true}
              />
              <span className="text-xs text-cocoa-400">|</span>
              <span className="text-xs text-emerald-700 font-semibold">100% Verified Homemade</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3 p-4 bg-cocoa-50/60 rounded-2xl border border-cocoa-100">
            <span className="font-serif text-3xl font-bold text-cocoa-950">₹{product.price}</span>
            {product.original_price && (
              <span className="text-sm text-cocoa-400 line-through">₹{product.original_price}</span>
            )}
            <span className="text-[11px] text-caramel-700 font-semibold bg-caramel-100 px-2.5 py-0.5 rounded-full ml-auto">
              Inclusive of all taxes
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cocoa-900">About this Chocolate</h4>
            <p className="text-xs sm:text-sm text-cocoa-700 leading-relaxed">
              {product.description || product.short_description}
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#ebdccd] space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cocoa-950 flex items-center gap-1.5">
              <span>Pure Ingredients</span>
            </h4>
            <p className="text-xs text-cocoa-600 leading-relaxed">{product.ingredients}</p>
          </div>

          <div>
            {isOutOfStock ? (
              <div className="flex items-center gap-2 text-xs font-bold text-red-600">
                <AlertCircle size={16} />
                <span>Currently Out of Stock</span>
              </div>
            ) : isLowStock ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
                <Package size={16} />
                <span>Only {product.stock_quantity} boxes left in current batch!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <Check size={16} />
                <span>In Stock & Freshly Prepared ({product.stock_quantity} available)</span>
              </div>
            )}
          </div>

          {!isOutOfStock && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <div className="flex items-center justify-between border border-cocoa-300 rounded-xl bg-white px-3 py-2 w-full sm:w-36">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="text-cocoa-700 hover:text-cocoa-950 disabled:opacity-30 p-1"
                >
                  <Minus size={14} />
                </button>
                <span className="font-bold text-sm text-cocoa-950">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
                  disabled={quantity >= product.stock_quantity}
                  className="text-cocoa-700 hover:text-cocoa-950 disabled:opacity-30 p-1"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`flex-grow py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 ${
                  justAdded
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#2d140a] hover:bg-[#1e0d06] text-white hover:shadow-lg'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check size={16} />
                    <span>Added {quantity} Box(es) to Cart!</span>
                  </>
                ) : isAdding ? (
                  <span>Adding to Cart...</span>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>ADD TO CART • ₹{Number(product.price) * quantity}</span>
                  </>
                )}
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-cocoa-100 text-xs text-cocoa-700">
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-caramel-600 shrink-0" />
              <span>Free delivery on orders &gt; ₹999</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-caramel-600 shrink-0" />
              <span>Safe thermal packaging</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="bg-white rounded-3xl border border-[#ebdccd] p-6 sm:p-10 shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cocoa-100 pb-6">
          <div>
            <h3 className="font-serif text-2xl font-bold text-cocoa-950">Customer Reviews</h3>
            <p className="text-xs text-cocoa-500 mt-0.5">
              Based on {product.review_count} ratings from verified buyers
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="font-serif text-3xl font-bold text-cocoa-950">{product.rating}</div>
            <RatingStars
              rating={typeof product.rating === 'string' ? parseFloat(product.rating) : product.rating}
              size={18}
            />
          </div>
        </div>

        <div className="space-y-4 divide-y divide-cocoa-100">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev) => (
              <div key={rev.id} className="pt-4 first:pt-0 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cocoa-950">{rev.user_name}</span>
                  <span className="text-[11px] text-cocoa-400">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </span>
                </div>
                <RatingStars rating={rev.rating} size={13} />
                <p className="text-xs text-cocoa-700 leading-relaxed mt-1">{rev.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-cocoa-500 italic py-2">
              No written reviews yet. Be the first to share your experience!
            </p>
          )}
        </div>

        <div className="pt-6 border-t border-cocoa-200">
          <h4 className="font-serif font-bold text-base text-cocoa-950 mb-3">Leave Your Review</h4>
          {reviewSuccess && (
            <div className="p-3 mb-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
              {reviewSuccess}
            </div>
          )}
          {reviewError && (
            <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
              {reviewError}
            </div>
          )}
          {isAuthenticated ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-semibold text-cocoa-900 mb-1">Your Rating</label>
                <RatingStars
                  rating={reviewRating}
                  size={20}
                  interactive={true}
                  onRatingChange={(r) => setReviewRating(r)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-cocoa-900 mb-1">Your Review</label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share what you loved about the flavor, texture, and packaging..."
                  required
                  className="w-full p-3 bg-cocoa-50/60 border border-cocoa-200 rounded-xl text-xs text-cocoa-950 focus:outline-none focus:border-cocoa-950"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingReview}
                className="px-6 py-2.5 bg-cocoa-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-caramel-600 transition-colors disabled:opacity-50"
              >
                {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div className="p-4 bg-cocoa-50 rounded-xl text-xs text-cocoa-700">
              Please{' '}
              <Link to="/login" className="font-bold text-cocoa-950 underline">
                login
              </Link>{' '}
              to write a review.
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-6">
          <h3 className="font-serif text-2xl font-bold text-cocoa-950 tracking-tight">
            You May Also Indulge In
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;

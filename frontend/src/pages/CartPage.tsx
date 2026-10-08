import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, Truck, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeItem, clearCart, isLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-cocoa-50 flex items-center justify-center mx-auto text-cocoa-400">
          <ShoppingBag size={32} />
        </div>
        <h2 className="font-serif text-2xl font-bold text-cocoa-950">Your Cart Awaits</h2>
        <p className="text-xs sm:text-sm text-cocoa-600 max-w-md mx-auto">
          Please log in to your Cocoa Bliss account to view your shopping cart and complete your checkout.
        </p>
        <Link
          to="/login"
          className="inline-block px-8 py-3 bg-cocoa-950 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-caramel-600 transition-colors shadow-md"
        >
          Login to View Cart
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-caramel-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-cocoa-600 font-medium">Fetching your shopping bag...</p>
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = Number(cart?.subtotal || 0);
  const deliveryCharge = Number(cart?.delivery_charge || 0);
  const finalTotal = Number(cart?.final_total || 0);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-cocoa-50 text-caramel-500 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag size={36} />
        </div>
        <h2 className="font-serif text-3xl font-bold text-cocoa-950">Your Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-cocoa-500 max-w-sm mx-auto">
          "Your cart is waiting for something delicious." Indulge in our freshly prepared artisan truffles, gift boxes, or chocolate bars.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-cocoa-950 hover:bg-caramel-600 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-md"
        >
          <span>Shop Chocolates</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  const remainingForFree = Math.max(0, 999 - subtotal);
  const freeProgress = Math.min(100, (subtotal / 999) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cocoa-100 pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cocoa-950">
            Shopping Cart ({cart?.total_items} items)
          </h1>
          <p className="text-xs text-cocoa-500 mt-0.5">Handcrafted homemade chocolates fresh in your cart</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-700 hover:underline font-semibold flex items-center gap-1"
        >
          <Trash2 size={13} />
          <span>Clear Cart</span>
        </button>
      </div>

      {/* Free Delivery Bar */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <Truck size={22} className="text-caramel-600 shrink-0" />
          <div className="text-xs">
            {remainingForFree > 0 ? (
              <p className="text-cocoa-900 font-medium">
                Add <span className="font-bold text-caramel-700">₹{remainingForFree}</span> more to unlock{' '}
                <span className="font-bold">FREE Delivery!</span>
              </p>
            ) : (
              <p className="text-emerald-800 font-bold">🎉 Congratulations! You have unlocked FREE Express Delivery!</p>
            )}
            <div className="w-48 sm:w-64 bg-amber-200/80 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-caramel-600 h-full rounded-full transition-all duration-300" style={{ width: `${freeProgress}%` }} />
            </div>
          </div>
        </div>
        {remainingForFree > 0 && (
          <Link to="/shop" className="text-xs font-bold text-caramel-700 hover:underline shrink-0">
            + Add More Chocolates
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-[#ebdccd] divide-y divide-cocoa-100 overflow-hidden shadow-xs">
            {items.map((item) => {
              const product = item.product_details;
              const price = Number(product?.price || 0);
              return (
                <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <Link
                    to={`/products/${item.product}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-cocoa-50 shrink-0 border border-cocoa-100"
                  >
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
                  </Link>
                  <div className="flex-grow text-center sm:text-left space-y-1">
                    <Link
                      to={`/products/${item.product}`}
                      className="font-serif font-bold text-base text-cocoa-950 hover:text-caramel-700 transition-colors"
                    >
                      {product?.name}
                    </Link>
                    <p className="text-xs text-cocoa-500">{product?.weight}</p>
                    <p className="text-xs font-bold text-cocoa-900">₹{price}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-cocoa-300 rounded-lg bg-cocoa-50/50 px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-cocoa-700 hover:text-cocoa-950"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-cocoa-950">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= (product?.stock_quantity ?? 0)}
                        className="p-1 text-cocoa-700 hover:text-cocoa-950 disabled:opacity-30"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <div className="w-20 text-right font-bold text-sm text-cocoa-950">₹{item.subtotal}</div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-cocoa-400 hover:text-red-600 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center pt-2 text-xs">
            <Link to="/shop" className="text-cocoa-700 hover:text-cocoa-950 font-semibold flex items-center gap-1">
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl border border-[#ebdccd] p-6 shadow-md space-y-6 sticky top-28">
            <h3 className="font-serif font-bold text-lg text-cocoa-950 border-b border-cocoa-100 pb-3">
              Order Summary
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-cocoa-700">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-cocoa-950">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-cocoa-700">
                <span>Delivery Charge:</span>
                <span className="font-semibold text-cocoa-950">
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase">FREE</span>
                  ) : (
                    `₹${deliveryCharge}`
                  )}
                </span>
              </div>
              <div className="border-t border-cocoa-200 pt-3 flex justify-between text-base font-bold text-cocoa-950">
                <span>Grand Total:</span>
                <span className="text-caramel-700">₹{finalTotal}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 bg-[#2d140a] hover:bg-[#1e0d06] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight size={14} />
            </button>

            <div className="text-[11px] text-cocoa-500 text-center space-y-1 pt-1">
              <p>🔒 100% Safe & Secure Checkout</p>
              <p>Fresh batch guarantee & thermal packaging included</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

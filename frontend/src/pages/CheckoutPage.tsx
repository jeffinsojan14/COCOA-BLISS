import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AlertCircle,
  Truck,
  CreditCard,
  Banknote,
  QrCode,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';

export const CheckoutPage: React.FC = () => {
  const { cart, refreshCart } = useCart();
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    city: '',
    state: '',
    postal_code: '',
    payment_method: 'cod',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customer_name: user.full_name || user.username,
        customer_email: user.email,
        customer_phone: user.phone || '',
        shipping_address: user.address || '',
        city: user.city || 'Bengaluru',
        state: user.state || 'Karnataka',
        postal_code: user.postal_code || '560001',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login?redirect=/checkout');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-caramel-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const items = cart?.items || [];
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-cocoa-950">No Items to Checkout</h2>
        <p className="text-xs text-cocoa-600">Your cart is currently empty.</p>
        <Link
          to="/shop"
          className="inline-block px-6 py-2.5 bg-cocoa-950 text-white rounded-full text-xs font-bold"
        >
          Shop Chocolates
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await orderService.createOrder(formData);
      await refreshCart();
      navigate(`/order-confirmation/${res.order.order_number}`);
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        'Failed to place order. Please check your details.';
      setError(msg);
      window.scrollTo(0, 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = Number(cart?.subtotal || 0);
  const deliveryCharge = Number(cart?.delivery_charge || 0);
  const finalTotal = Number(cart?.final_total || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="border-b border-cocoa-100 pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cocoa-950">Secure Checkout</h1>
        <p className="text-xs text-cocoa-500 mt-0.5">
          Please enter your delivery destination and select your preferred payment mode
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-3">
          <AlertCircle size={18} className="shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Details Form */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-2xl border border-[#ebdccd] p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-cocoa-100">
                <Truck className="text-caramel-600" size={20} />
                <h3 className="font-serif font-bold text-lg text-cocoa-950">1. Delivery Details</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-cocoa-900">Full Name *</label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 bg-cocoa-50/50 border border-cocoa-200 rounded-xl text-xs text-cocoa-950 focus:outline-none focus:border-cocoa-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-cocoa-900">Phone Number *</label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-cocoa-50/50 border border-cocoa-200 rounded-xl text-xs text-cocoa-950 focus:outline-none focus:border-cocoa-950"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-semibold text-cocoa-900">Email Address *</label>
                  <input
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 bg-cocoa-50/50 border border-cocoa-200 rounded-xl text-xs text-cocoa-950 focus:outline-none focus:border-cocoa-950"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-semibold text-cocoa-900">
                    Delivery Address (House/Flat No, Street, Landmark) *
                  </label>
                  <textarea
                    rows={2}
                    name="shipping_address"
                    value={formData.shipping_address}
                    onChange={handleChange}
                    required
                    placeholder="Enter complete shipping address"
                    className="w-full px-3.5 py-2.5 bg-cocoa-50/50 border border-cocoa-200 rounded-xl text-xs text-cocoa-950 focus:outline-none focus:border-cocoa-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-cocoa-900">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 bg-cocoa-50/50 border border-cocoa-200 rounded-xl text-xs text-cocoa-950 focus:outline-none focus:border-cocoa-950"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-cocoa-900">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-3.5 py-2.5 bg-cocoa-50/50 border border-cocoa-200 rounded-xl text-xs text-cocoa-950 focus:outline-none focus:border-cocoa-950"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-cocoa-900">Postal Code *</label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleChange}
                      required
                      className="w-full px-3.5 py-2.5 bg-cocoa-50/50 border border-cocoa-200 rounded-xl text-xs text-cocoa-950 focus:outline-none focus:border-cocoa-950"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="block text-xs font-semibold text-cocoa-900">
                    Delivery Instructions / Gift Message (Optional)
                  </label>
                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="e.g. Ring bell, leave with security, or note for gift card"
                    className="w-full px-3.5 py-2.5 bg-cocoa-50/50 border border-cocoa-200 rounded-xl text-xs text-cocoa-950 focus:outline-none focus:border-cocoa-950"
                  />
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-2xl border border-[#ebdccd] p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-cocoa-100">
                <CreditCard className="text-caramel-600" size={20} />
                <h3 className="font-serif font-bold text-lg text-cocoa-950">2. Select Payment Method</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    formData.payment_method === 'cod'
                      ? 'border-cocoa-950 bg-cocoa-50/60 shadow-xs'
                      : 'border-cocoa-200 hover:border-cocoa-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Banknote className="text-cocoa-800" size={22} />
                    <input
                      type="radio"
                      name="payment_method"
                      value="cod"
                      checked={formData.payment_method === 'cod'}
                      onChange={handleChange}
                      className="text-cocoa-950 focus:ring-caramel-500"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-cocoa-950">Cash on Delivery</h4>
                    <p className="text-[11px] text-cocoa-500 mt-0.5">Pay in cash or UPI at delivery</p>
                  </div>
                </label>

                <label
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    formData.payment_method === 'upi'
                      ? 'border-cocoa-950 bg-cocoa-50/60 shadow-xs'
                      : 'border-cocoa-200 hover:border-cocoa-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <QrCode className="text-cocoa-800" size={22} />
                    <input
                      type="radio"
                      name="payment_method"
                      value="upi"
                      checked={formData.payment_method === 'upi'}
                      onChange={handleChange}
                      className="text-cocoa-950 focus:ring-caramel-500"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-cocoa-950">UPI / GPay / PhonePe</h4>
                    <p className="text-[11px] text-cocoa-500 mt-0.5">Instant mock online transfer</p>
                  </div>
                </label>

                <label
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    formData.payment_method === 'card'
                      ? 'border-cocoa-950 bg-cocoa-50/60 shadow-xs'
                      : 'border-cocoa-200 hover:border-cocoa-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <CreditCard className="text-cocoa-800" size={22} />
                    <input
                      type="radio"
                      name="payment_method"
                      value="card"
                      checked={formData.payment_method === 'card'}
                      onChange={handleChange}
                      className="text-cocoa-950 focus:ring-caramel-500"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-cocoa-950">Credit / Debit Card</h4>
                    <p className="text-[11px] text-cocoa-500 mt-0.5">Visa, Mastercard, RuPay</p>
                  </div>
                </label>
              </div>

              {formData.payment_method !== 'cod' && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                  <span>Simulated Sandbox Payment Gateway: Instant verification on click. No actual card charge required.</span>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Right Panel */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-[#ebdccd] p-6 shadow-md space-y-6 sticky top-28">
              <h3 className="font-serif font-bold text-lg text-cocoa-950 border-b border-cocoa-100 pb-3">
                Order Review
              </h3>

              <div className="max-h-60 overflow-y-auto divide-y divide-cocoa-100 pr-1 space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.product_details?.display_image || item.product_details?.image_url || '/placeholder-chocolate.jpg'}
                        alt={item.product_details?.name}
                        className="w-10 h-10 rounded-lg object-cover bg-cocoa-50"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.endsWith('/placeholder-chocolate.jpg')) {
                            target.src = '/placeholder-chocolate.jpg';
                          }
                        }}
                      />
                      <div>
                        <p className="font-semibold text-cocoa-950 line-clamp-1">{item.product_details?.name}</p>
                        <p className="text-[10px] text-cocoa-500">
                          Qty: {item.quantity} × ₹{item.product_details?.price}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-cocoa-900 shrink-0">₹{item.subtotal}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-cocoa-100 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-cocoa-700">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-cocoa-950">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-cocoa-700">
                  <span>Shipping:</span>
                  <span className="font-semibold text-cocoa-950">
                    {deliveryCharge === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      `₹${deliveryCharge}`
                    )}
                  </span>
                </div>
                <div className="border-t border-cocoa-200 pt-3 flex justify-between text-base font-bold text-cocoa-950">
                  <span>Total Amount:</span>
                  <span className="text-caramel-700 font-serif">₹{finalTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#2d140a] hover:bg-[#1e0d06] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <span>PLACE ORDER • ₹{finalTotal}</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>

              <div className="text-[11px] text-cocoa-500 text-center space-y-1">
                <p>🍫 Freshly prepared upon order confirmation</p>
                <p>Tracking updates sent via in-app notifications</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;

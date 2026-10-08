import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User as UserIcon, Mail, Phone, MapPin, Package, Heart, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    postal_code: user?.postal_code || '',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(null);
    try {
      await updateProfile(formData);
      setSuccess('Profile and delivery address updated successfully!');
      setTimeout(() => setSuccess(null), 4000);
    } catch {
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cocoa-100 pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cocoa-950">
            My Account & Profile
          </h1>
          <p className="text-xs text-cocoa-500 mt-0.5">
            Manage your personal contact info, saved delivery address, and preferences
          </p>
        </div>
        {isAdmin && (
          <Link
            to="/admin"
            className="px-4 py-2 bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-amber-200 transition-colors"
          >
            <ShieldAlert size={15} />
            <span>Open Admin Dashboard</span>
          </Link>
        )}
      </div>

      {/* Quick Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/orders"
          className="bg-white p-5 rounded-2xl border border-[#ebdccd] shadow-xs flex items-center gap-4 hover:border-caramel-400 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-cocoa-50 text-caramel-600 flex items-center justify-center shrink-0">
            <Package size={24} />
          </div>
          <div>
            <span className="text-xs text-cocoa-500 block">My Past Orders</span>
            <span className="font-bold text-sm text-cocoa-950">View History &rarr;</span>
          </div>
        </Link>

        <Link
          to="/wishlist"
          className="bg-white p-5 rounded-2xl border border-[#ebdccd] shadow-xs flex items-center gap-4 hover:border-caramel-400 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <Heart size={24} />
          </div>
          <div>
            <span className="text-xs text-cocoa-500 block">Saved Wishlist</span>
            <span className="font-bold text-sm text-cocoa-950">{wishlistCount} Chocolates &rarr;</span>
          </div>
        </Link>

        <Link
          to="/cart"
          className="bg-white p-5 rounded-2xl border border-[#ebdccd] shadow-xs flex items-center gap-4 hover:border-caramel-400 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Package size={24} />
          </div>
          <div>
            <span className="text-xs text-cocoa-500 block">Shopping Cart</span>
            <span className="font-bold text-sm text-cocoa-950">{cartCount} Items &rarr;</span>
          </div>
        </Link>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-3xl border border-[#ebdccd] p-6 sm:p-10 shadow-xs space-y-6">
        <h3 className="font-serif font-bold text-lg text-cocoa-950 border-b border-cocoa-100 pb-3">
          Personal Information & Default Delivery Address
        </h3>

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-cocoa-900">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cocoa-400" size={16} />
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-3 py-2 bg-cocoa-50/50 border border-cocoa-200 rounded-xl text-xs text-cocoa-950 focus:outline-none focus:border-cocoa-950"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-cocoa-900">
                Email Address (Cannot be modified)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cocoa-400" size={16} />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full pl-9 pr-3 py-2 bg-gray-100 border border-cocoa-200 rounded-xl text-xs text-cocoa-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-cocoa-900">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cocoa-400" size={16} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2 bg-cocoa-50/50 border border-cocoa-200 rounded-xl text-xs text-cocoa-950 focus:outline-none focus:border-cocoa-950"
                />
              </div>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-semibold text-cocoa-900">
                Default Delivery Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 text-cocoa-400" size={16} />
                <textarea
                  rows={2}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Apartment, Street, Landmark"
                  className="w-full pl-9 pr-3 py-2 bg-cocoa-50/50 border border-cocoa-200 rounded-xl text-xs text-cocoa-950 focus:outline-none focus:border-cocoa-950"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-cocoa-900">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-cocoa-50/50 border border-cocoa-200 rounded-xl text-xs text-cocoa-950 focus:outline-none focus:border-cocoa-950"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-cocoa-900">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-cocoa-50/50 border border-cocoa-200 rounded-xl text-xs text-cocoa-950 focus:outline-none focus:border-cocoa-950"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-cocoa-900">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-cocoa-50/50 border border-cocoa-200 rounded-xl text-xs text-cocoa-950 focus:outline-none focus:border-cocoa-950"
                />
              </div>
            </div>

          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-cocoa-950 hover:bg-caramel-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving Updates...' : 'Save Profile Details'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, MapPin, ShieldAlert, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirm_password: '',
    role: 'customer' as 'customer' | 'admin',
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Password validation rules
  const passwordRules = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
    noSpaces: formData.password.length > 0 && !/\s/.test(formData.password),
  };

  const isPasswordValid =
    passwordRules.length &&
    passwordRules.upper &&
    passwordRules.lower &&
    passwordRules.number &&
    passwordRules.special &&
    passwordRules.noSpaces;

  const validateField = (name: string, value: string): string => {
    const trimmed = value.trim();

    switch (name) {
      case 'full_name':
        if (!trimmed) return 'Full Name is required.';
        if (trimmed.length < 2) return 'Full Name must be at least 2 characters.';
        return '';

      case 'email':
        if (!trimmed) return 'Email address is required.';
        if (/\s/.test(value)) return 'Email cannot contain spaces.';
        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(trimmed)) {
          return 'Only valid @gmail.com email addresses are allowed (e.g. name@gmail.com).';
        }
        return '';

      case 'phone':
        if (!trimmed) return 'Phone number is required.';
        if (/\s/.test(value)) return 'Phone number cannot contain spaces.';
        if (!/^\+?[0-9]{10,15}$/.test(trimmed)) {
          return 'Enter a valid phone number (10-15 digits without spaces).';
        }
        return '';

      case 'address':
        if (!trimmed) return 'Address is required.';
        if (trimmed.length < 5) return 'Please enter a complete address (min 5 characters).';
        return '';

      case 'password':
        if (!value) return 'Password is required.';
        if (/\s/.test(value)) return 'Password cannot contain spaces.';
        if (value.length < 8) return 'Password must be at least 8 characters.';
        if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter.';
        if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter.';
        if (!/[0-9]/.test(value)) return 'Password must contain at least one number.';
        if (!/[^A-Za-z0-9]/.test(value)) return 'Password must contain at least one special character (!@#$%^&* etc.).';
        return '';

      case 'confirm_password':
        if (!value) return 'Please confirm your password.';
        if (value !== formData.password) return 'Passwords do not match.';
        return '';

      default:
        return '';
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, (formData as any)[field] || '');
    setFieldErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Disallow spaces immediately for email, phone, and password fields
    let sanitizedValue = value;
    if (name === 'email' || name === 'phone' || name === 'password' || name === 'confirm_password') {
      sanitizedValue = value.replace(/\s/g, '');
    }

    setFormData((prev) => {
      const updated = { ...prev, [name]: sanitizedValue };
      return updated;
    });

    if (touched[name]) {
      const err = validateField(name, sanitizedValue);
      setFieldErrors((prev) => ({ ...prev, [name]: err }));
    }

    // Also re-validate confirm_password if password changes
    if (name === 'password' && touched.confirm_password) {
      if (formData.confirm_password && formData.confirm_password !== sanitizedValue) {
        setFieldErrors((prev) => ({ ...prev, confirm_password: 'Passwords do not match.' }));
      } else if (formData.confirm_password === sanitizedValue) {
        setFieldErrors((prev) => ({ ...prev, confirm_password: '' }));
      }
    }
  };

  const validateAll = (): boolean => {
    const errors: Record<string, string> = {
      full_name: validateField('full_name', formData.full_name),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
      address: validateField('address', formData.address),
      password: validateField('password', formData.password),
      confirm_password: validateField('confirm_password', formData.confirm_password),
    };

    setFieldErrors(errors);
    setTouched({
      full_name: true,
      email: true,
      phone: true,
      address: true,
      password: true,
      confirm_password: true,
    });

    const hasErrors = Object.values(errors).some((msg) => msg.length > 0);
    return !hasErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Run all validations
    if (!validateAll()) {
      setError('Please resolve all validation errors highlighted below.');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the Terms & Conditions and Privacy Policy.');
      return;
    }

    // Clean data by trimming strings before submission
    const cleanPayload = {
      full_name: formData.full_name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      password: formData.password,
      confirm_password: formData.confirm_password,
      role: formData.role,
    };

    try {
      setIsLoading(true);
      await register(cleanPayload);
      navigate('/');
    } catch (err: any) {
      const data = err.response?.data;
      let msg = 'Registration failed. Please check the fields and try again.';
      if (data) {
        if (typeof data === 'string') {
          msg = data;
        } else if (data.email) {
          msg = Array.isArray(data.email) ? data.email[0] : data.email;
        } else if (data.password) {
          msg = Array.isArray(data.password) ? data.password[0] : data.password;
        } else if (data.confirm_password) {
          msg = Array.isArray(data.confirm_password) ? data.confirm_password[0] : data.confirm_password;
        } else if (data.phone) {
          msg = Array.isArray(data.phone) ? data.phone[0] : data.phone;
        } else if (data.address) {
          msg = Array.isArray(data.address) ? data.address[0] : data.address;
        } else if (data.full_name) {
          msg = Array.isArray(data.full_name) ? data.full_name[0] : data.full_name;
        } else if (data.non_field_errors) {
          msg = data.non_field_errors[0];
        }
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    const demoEmail = `chocolover_${Math.floor(1000 + Math.random() * 9000)}@gmail.com`;
    setFormData({
      full_name: 'Priya Sharma',
      email: demoEmail,
      phone: '+919876543210',
      address: '12 Garden Street, Bengaluru, Karnataka 560001',
      password: 'Password@123',
      confirm_password: 'Password@123',
      role: 'customer',
    });
    setFieldErrors({});
    setTouched({});
    setAgreeTerms(true);
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#fdfbf7]">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-[#ebdccd] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side Banner */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#1b0a04] via-[#2a1309] to-[#1e0d06] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Join Cocoa Bliss!
            </h2>
            <p className="text-sm sm:text-base text-cocoa-200 leading-relaxed font-light">
              Create your account and start your sweet journey with us. 💛
            </p>
          </div>
          <div className="relative z-10 my-8 flex justify-center">
            <div className="relative rounded-2xl overflow-hidden border border-caramel-500/30 shadow-2xl max-w-xs">
              <img
                src="/auth-chocolate.jpg"
                alt="Artisan Chocolate Box"
                className="w-full h-64 sm:h-72 object-cover object-center"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('unsplash')) {
                    target.src = 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=700&q=80';
                  }
                }}
              />
              <div className="absolute bottom-3 left-3 bg-cocoa-950/80 backdrop-blur-xs px-3 py-1 rounded-md text-[10px] text-caramel-300 font-semibold tracking-wider uppercase">
                100% Handcrafted
              </div>
            </div>
          </div>
          <div className="relative z-10 space-y-2 text-xs text-cocoa-300 border-t border-cocoa-800 pt-4">
            <div className="flex items-center gap-2">
              <span className="text-caramel-400">✓</span>
              <span>Express checkout with saved delivery addresses</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-caramel-400">✓</span>
              <span>Real-time order preparation and shipment tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-caramel-400">✓</span>
              <span>Exclusive festive gifting discounts & reviews</span>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="max-w-lg w-full mx-auto space-y-5">
            <div className="text-center space-y-1">
              <h3 className="font-serif text-3xl font-bold text-cocoa-950 tracking-tight flex items-center justify-center gap-1.5">
                <span>Register</span>
                <span className="text-amber-500 text-xl">💛</span>
              </h3>
              <p className="text-xs text-cocoa-500">Create a new account with your Google Gmail credentials.</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2 animate-in fade-in duration-200">
                <AlertCircle size={16} className="shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
              {/* Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-cocoa-900">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cocoa-400" size={16} />
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      onBlur={() => handleBlur('full_name')}
                      placeholder="e.g. Priya Sharma"
                      required
                      className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl text-xs text-cocoa-950 placeholder-cocoa-400 focus:outline-none focus:ring-2 transition-all ${
                        touched.full_name && fieldErrors.full_name
                          ? 'border-red-400 focus:ring-red-100 focus:border-red-500 bg-red-50/20'
                          : 'border-cocoa-200 focus:ring-cocoa-900/10 focus:border-cocoa-900'
                      }`}
                    />
                  </div>
                  {touched.full_name && fieldErrors.full_name && (
                    <p className="text-[10px] text-red-600 font-medium">{fieldErrors.full_name}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-cocoa-900">
                    Email Address (@gmail.com) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cocoa-400" size={16} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur('email')}
                      placeholder="username@gmail.com"
                      required
                      className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl text-xs text-cocoa-950 placeholder-cocoa-400 focus:outline-none focus:ring-2 transition-all ${
                        touched.email && fieldErrors.email
                          ? 'border-red-400 focus:ring-red-100 focus:border-red-500 bg-red-50/20'
                          : 'border-cocoa-200 focus:ring-cocoa-900/10 focus:border-cocoa-900'
                      }`}
                    />
                  </div>
                  {touched.email && fieldErrors.email && (
                    <p className="text-[10px] text-red-600 font-medium">{fieldErrors.email}</p>
                  )}
                </div>
              </div>

              {/* Phone & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-cocoa-900">
                    Phone Number (No spaces) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cocoa-400" size={16} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={() => handleBlur('phone')}
                      placeholder="e.g. +919876543210"
                      required
                      className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl text-xs text-cocoa-950 placeholder-cocoa-400 focus:outline-none focus:ring-2 transition-all ${
                        touched.phone && fieldErrors.phone
                          ? 'border-red-400 focus:ring-red-100 focus:border-red-500 bg-red-50/20'
                          : 'border-cocoa-200 focus:ring-cocoa-900/10 focus:border-cocoa-900'
                      }`}
                    />
                  </div>
                  {touched.phone && fieldErrors.phone && (
                    <p className="text-[10px] text-red-600 font-medium">{fieldErrors.phone}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-cocoa-900">
                    Full Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cocoa-400" size={16} />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      onBlur={() => handleBlur('address')}
                      placeholder="Street, City, Pincode"
                      required
                      className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl text-xs text-cocoa-950 placeholder-cocoa-400 focus:outline-none focus:ring-2 transition-all ${
                        touched.address && fieldErrors.address
                          ? 'border-red-400 focus:ring-red-100 focus:border-red-500 bg-red-50/20'
                          : 'border-cocoa-200 focus:ring-cocoa-900/10 focus:border-cocoa-900'
                      }`}
                    />
                  </div>
                  {touched.address && fieldErrors.address && (
                    <p className="text-[10px] text-red-600 font-medium">{fieldErrors.address}</p>
                  )}
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-cocoa-900">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cocoa-400" size={16} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={() => handleBlur('password')}
                      placeholder="Min 8 chars, 1 Upper, 1 Lower, 1 Number, 1 Special"
                      required
                      className={`w-full pl-9 pr-10 py-2 bg-white border rounded-xl text-xs text-cocoa-950 placeholder-cocoa-400 focus:outline-none focus:ring-2 transition-all ${
                        touched.password && fieldErrors.password
                          ? 'border-red-400 focus:ring-red-100 focus:border-red-500 bg-red-50/20'
                          : 'border-cocoa-200 focus:ring-cocoa-900/10 focus:border-cocoa-900'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-cocoa-400 hover:text-cocoa-700"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {touched.password && fieldErrors.password && (
                    <p className="text-[10px] text-red-600 font-medium">{fieldErrors.password}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-cocoa-900">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cocoa-400" size={16} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      onBlur={() => handleBlur('confirm_password')}
                      placeholder="Re-enter password"
                      required
                      className={`w-full pl-9 pr-10 py-2 bg-white border rounded-xl text-xs text-cocoa-950 placeholder-cocoa-400 focus:outline-none focus:ring-2 transition-all ${
                        touched.confirm_password && fieldErrors.confirm_password
                          ? 'border-red-400 focus:ring-red-100 focus:border-red-500 bg-red-50/20'
                          : 'border-cocoa-200 focus:ring-cocoa-900/10 focus:border-cocoa-900'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-cocoa-400 hover:text-cocoa-700"
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {touched.confirm_password && fieldErrors.confirm_password && (
                    <p className="text-[10px] text-red-600 font-medium">{fieldErrors.confirm_password}</p>
                  )}
                </div>
              </div>

              {/* Real-Time Password Criteria Checklist */}
              {formData.password.length > 0 && (
                <div className="p-3 bg-cocoa-50/60 border border-cocoa-200/80 rounded-xl space-y-1.5 animate-in fade-in duration-150">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-cocoa-800">
                    Password Requirements:
                  </p>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                    <div className={`flex items-center gap-1.5 ${passwordRules.length ? 'text-emerald-700 font-medium' : 'text-cocoa-500'}`}>
                      {passwordRules.length ? <CheckCircle2 size={13} className="text-emerald-600 shrink-0" /> : <XCircle size={13} className="text-cocoa-400 shrink-0" />}
                      <span>At least 8 characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordRules.upper ? 'text-emerald-700 font-medium' : 'text-cocoa-500'}`}>
                      {passwordRules.upper ? <CheckCircle2 size={13} className="text-emerald-600 shrink-0" /> : <XCircle size={13} className="text-cocoa-400 shrink-0" />}
                      <span>1 Uppercase letter (A-Z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordRules.lower ? 'text-emerald-700 font-medium' : 'text-cocoa-500'}`}>
                      {passwordRules.lower ? <CheckCircle2 size={13} className="text-emerald-600 shrink-0" /> : <XCircle size={13} className="text-cocoa-400 shrink-0" />}
                      <span>1 Lowercase letter (a-z)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordRules.number ? 'text-emerald-700 font-medium' : 'text-cocoa-500'}`}>
                      {passwordRules.number ? <CheckCircle2 size={13} className="text-emerald-600 shrink-0" /> : <XCircle size={13} className="text-cocoa-400 shrink-0" />}
                      <span>1 Number (0-9)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordRules.special ? 'text-emerald-700 font-medium' : 'text-cocoa-500'}`}>
                      {passwordRules.special ? <CheckCircle2 size={13} className="text-emerald-600 shrink-0" /> : <XCircle size={13} className="text-cocoa-400 shrink-0" />}
                      <span>1 Special character (!@#$)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordRules.noSpaces ? 'text-emerald-700 font-medium' : 'text-cocoa-500'}`}>
                      {passwordRules.noSpaces ? <CheckCircle2 size={13} className="text-emerald-600 shrink-0" /> : <XCircle size={13} className="text-cocoa-400 shrink-0" />}
                      <span>No spaces</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Role Selection */}
              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-cocoa-900">
                  Account Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-cocoa-200 rounded-xl text-xs text-cocoa-950 focus:outline-none focus:ring-2 focus:ring-cocoa-900/10 focus:border-cocoa-900 transition-all cursor-pointer"
                >
                  <option value="customer">Customer (Browse, Purchase, Track Orders)</option>
                  <option value="admin">Administrator (Requires Super Admin Approval)</option>
                </select>
                {formData.role === 'admin' && (
                  <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2 animate-fadeIn">
                    <ShieldAlert size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Approval Required:</strong> Administrator registrations remain pending until reviewed and approved by the Super Admin (<span className="font-semibold text-amber-950">admin@cocoabliss.com</span>). You can continue shopping as a customer in the meantime.
                    </span>
                  </div>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agree-terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded border-cocoa-300 text-cocoa-950 focus:ring-caramel-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="agree-terms" className="text-[11px] text-cocoa-700 cursor-pointer">
                  I agree to the{' '}
                  <Link to="/terms" className="font-semibold text-cocoa-950 underline hover:text-caramel-700">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy-policy" className="font-semibold text-cocoa-950 underline hover:text-caramel-700">
                    Privacy Policy
                  </Link>{' '}
                  <span className="text-red-500">*</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#2d140a] hover:bg-[#1e0d06] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 mt-2 cursor-pointer"
              >
                {isLoading ? 'Validating & Creating Account...' : 'Register'}
              </button>
            </form>

            <div className="relative flex items-center justify-center py-0.5">
              <div className="border-t border-cocoa-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-semibold text-cocoa-400 uppercase tracking-widest absolute">
                OR
              </span>
            </div>

            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2.5 px-4 bg-white border border-cocoa-200 rounded-xl text-xs font-semibold text-cocoa-800 hover:bg-cocoa-50 transition-colors flex items-center justify-center gap-2.5 shadow-2xs cursor-pointer"
            >
              <span>⚡ Auto-fill Valid Demo Details</span>
            </button>

            <p className="text-center text-xs text-cocoa-600">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-caramel-700 hover:underline">
                Login Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

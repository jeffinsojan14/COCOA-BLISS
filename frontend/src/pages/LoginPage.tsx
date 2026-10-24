import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const redirectPath = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login({ email, password });
      navigate(redirectPath, { replace: true });
    } catch (err: any) {
      const msg =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        err.response?.data?.error ||
        'Invalid email or password. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#fdfbf7]">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-[#ebdccd] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side Banner */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#1b0a04] via-[#2a1309] to-[#1e0d06] p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-caramel-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Welcome Back!
            </h2>
            <p className="text-sm sm:text-base text-cocoa-200 leading-relaxed font-light">
              Login to continue your Cocoa Bliss journey. 💛
            </p>
          </div>
          <div className="relative z-10 my-8 flex justify-center">
            <div className="relative rounded-2xl overflow-hidden border border-caramel-500/30 shadow-2xl max-w-sm">
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
              <span>100% handcrafted homemade artisan chocolates</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-caramel-400">✓</span>
              <span>Live order tracking and personalized gift hampers</span>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="text-center space-y-1">
              <h3 className="font-serif text-3xl font-bold text-cocoa-950 tracking-tight flex items-center justify-center gap-1.5">
                <span>Login</span>
                <span className="text-amber-500 text-xl">💛</span>
              </h3>
              <p className="text-xs text-cocoa-500">Enter your email and password to access your account.</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2 animate-in fade-in duration-200">
                <AlertCircle size={16} className="shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-cocoa-900">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cocoa-400" size={17} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-cocoa-200 rounded-xl text-xs text-cocoa-950 placeholder-cocoa-400 focus:outline-none focus:ring-2 focus:ring-cocoa-900/10 focus:border-cocoa-900 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-cocoa-900">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cocoa-400" size={17} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-10 pr-11 py-2.5 bg-white border border-cocoa-200 rounded-xl text-xs text-cocoa-950 placeholder-cocoa-400 focus:outline-none focus:ring-2 focus:ring-cocoa-900/10 focus:border-cocoa-900 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cocoa-400 hover:text-cocoa-700"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => alert('Please contact store support at support@cocoabliss.com to reset your account password.')}
                  className="text-xs text-cocoa-600 hover:text-caramel-700 font-medium transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#2d140a] hover:bg-[#1e0d06] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {isLoading ? 'Signing In...' : 'Login'}
              </button>
            </form>


            <p className="text-center text-xs text-cocoa-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-caramel-700 hover:underline">
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

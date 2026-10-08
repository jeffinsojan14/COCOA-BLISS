import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Star,
  ArrowLeft,
  ShieldCheck,
  LogOut,
  Clock,
  Crown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cocoa-50">
        <div className="w-10 h-10 border-4 border-caramel-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If user applied for admin and is pending approval by Super Admin
  if (user && user.admin_status === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-cocoa-50">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-amber-200 text-center max-w-md space-y-4 shadow-xl animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <Clock size={32} />
          </div>
          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Pending Super Admin Approval
          </span>
          <h2 className="font-serif text-2xl font-bold text-cocoa-950">Administrator Access Pending</h2>
          <p className="text-xs text-cocoa-600 leading-relaxed">
            Your application for Administrator privileges has been recorded and is currently awaiting approval by the Super Admin (<span className="font-semibold text-cocoa-950">admin@cocoabliss.com</span>).
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/"
              className="px-6 py-2.5 bg-cocoa-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-cocoa-900"
            >
              Browse Store as Customer
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-cocoa-700 hover:underline pt-1 cursor-pointer"
            >
              Check Status (Reload)
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isSuperAdmin = !!user && (user.email?.toLowerCase() === 'admin@cocoabliss.com' || user.is_superuser);
  const isApprovedAdmin = isSuperAdmin || (!!user && (user.role === 'admin' || user.is_staff) && user.admin_status === 'approved');

  if (!isApprovedAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-cocoa-50">
        <div className="bg-white p-8 rounded-3xl border border-cocoa-200 text-center max-w-md space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <ShieldCheck size={32} />
          </div>
          <h2 className="font-serif text-2xl font-bold text-cocoa-950">Administrator Access Required</h2>
          <p className="text-xs text-cocoa-600">
            You must be logged in with an approved administrator account to access the Cocoa Bliss admin dashboard.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/login"
              className="px-6 py-2.5 bg-cocoa-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Sign In as Admin
            </Link>
            <Link to="/" className="text-xs text-cocoa-700 hover:underline">
              Return to Customer Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Products & Stock', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Customer Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Reviews Moderation', path: '/admin/reviews', icon: Star },
  ];

  const isNavActive = (path: string, exact: boolean = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-cocoa-50/40 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#1e0d06] text-white flex flex-col justify-between shrink-0 shadow-xl border-r border-[#2d140a]">
        <div>
          {/* Admin Header */}
          <div className="p-6 border-b border-cocoa-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-caramel-500 text-cocoa-950 flex items-center justify-center font-bold">
                CB
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-white block leading-none">
                  Cocoa Bliss
                </span>
                <span className="text-[10px] tracking-widest text-caramel-400 font-bold uppercase block mt-1">
                  ADMIN CONSOLE
                </span>
                {isSuperAdmin && (
                  <span className="inline-flex items-center gap-1 text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mt-1 border border-amber-500/30">
                    <Crown size={10} /> Super Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isNavActive(item.path, item.exact);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-caramel-500 text-cocoa-950 font-bold shadow-xs'
                      : 'text-cocoa-300 hover:bg-cocoa-900 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User & Return to Store controls */}
        <div className="p-4 border-t border-cocoa-800 space-y-2 text-xs">
          <Link
            to="/"
            className="flex items-center gap-2 px-3.5 py-2 text-cocoa-300 hover:text-white hover:bg-cocoa-900 rounded-xl transition-colors font-medium"
          >
            <ArrowLeft size={14} />
            <span>Customer Website</span>
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-red-400 hover:bg-red-950/40 rounded-xl transition-colors font-medium text-left"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Work Area */}
      <main className="flex-grow p-4 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl">
        <Outlet />
      </main>

    </div>
  );
};

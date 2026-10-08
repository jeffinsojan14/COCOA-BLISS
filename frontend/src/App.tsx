import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { NotificationProvider } from './context/NotificationContext';

// Common Components
import { TopBar } from './components/common/TopBar';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';

// Admin Suite
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';

// Helper component to scroll top on route changes
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Customer Layout wrapper with TopBar, Navbar, and Footer
const CustomerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7]">
      <TopBar />
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <NotificationProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                
                {/* Admin Nested Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="categories" element={<AdminCategoriesPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="customers" element={<AdminCustomersPage />} />
                  <Route path="reviews" element={<AdminReviewsPage />} />
                </Route>

                {/* Customer Facing Routes */}
                <Route
                  path="/"
                  element={
                    <CustomerLayout>
                      <HomePage />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/shop"
                  element={
                    <CustomerLayout>
                      <ShopPage />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/products/:id"
                  element={
                    <CustomerLayout>
                      <ProductDetailPage />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/categories"
                  element={
                    <CustomerLayout>
                      <CategoriesPage />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <CustomerLayout>
                      <CartPage />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    <CustomerLayout>
                      <WishlistPage />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <CustomerLayout>
                      <CheckoutPage />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/order-confirmation/:id"
                  element={
                    <CustomerLayout>
                      <OrderConfirmationPage />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <CustomerLayout>
                      <OrderHistoryPage />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/orders/:id"
                  element={
                    <CustomerLayout>
                      <OrderDetailPage />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <CustomerLayout>
                      <ProfilePage />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <CustomerLayout>
                      <LoginPage />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <CustomerLayout>
                      <RegisterPage />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <CustomerLayout>
                      <AboutPage />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <CustomerLayout>
                      <ContactPage />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/privacy-policy"
                  element={
                    <CustomerLayout>
                      <PrivacyPolicyPage />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/terms"
                  element={
                    <CustomerLayout>
                      <TermsPage />
                    </CustomerLayout>
                  }
                />

                {/* 404 Fallback */}
                <Route
                  path="*"
                  element={
                    <CustomerLayout>
                      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
                        <h2 className="font-serif text-3xl font-bold text-cocoa-950">Page Not Found</h2>
                        <p className="text-xs text-cocoa-600">The page you requested could not be located.</p>
                      </div>
                    </CustomerLayout>
                  }
                />

              </Routes>
            </BrowserRouter>
          </NotificationProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;

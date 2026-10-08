import axios from 'axios';
import {
  User,
  Category,
  Product,
  Cart,
  Wishlist,
  Order,
  Notification,
  DashboardStats,
  AdminCustomer,
  AdminStaffRequest
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api` : '/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Auth Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cocoa_bliss_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Interceptor for 401 handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if invalid
      localStorage.removeItem('cocoa_bliss_token');
      localStorage.removeItem('cocoa_bliss_user');
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  register: async (data: any) => {
    const res = await api.post('/auth/register/', data);
    return res.data;
  },
  login: async (credentials: any) => {
    const res = await api.post('/auth/login/', credentials);
    return res.data;
  },
  logout: async () => {
    const res = await api.post('/auth/logout/');
    return res.data;
  },
  getMe: async (): Promise<User> => {
    const res = await api.get('/auth/me/');
    return res.data;
  },
  updateProfile: async (data: any): Promise<{ message: string; user: User }> => {
    const res = await api.put('/auth/me/', data);
    return res.data;
  },
};

// Product & Category Services
export const productService = {
  getCategories: async (): Promise<Category[]> => {
    const res = await api.get('/categories/');
    return res.data;
  },
  getProducts: async (params?: {
    search?: string;
    category?: string | number;
    min_price?: number;
    max_price?: number;
    in_stock?: boolean;
    bestseller?: boolean;
    featured?: boolean;
    sort?: string;
  }): Promise<Product[]> => {
    const res = await api.get('/products/', { params });
    return res.data;
  },
  getProductDetail: async (idOrSlug: string | number): Promise<{ product: Product; related_products: Product[] }> => {
    const res = await api.get(`/products/${idOrSlug}/`);
    return res.data;
  },
  addReview: async (productId: number, data: { rating: number; comment: string }) => {
    const res = await api.post(`/products/${productId}/reviews/`, data);
    return res.data;
  },
};

// Cart Services
export const cartService = {
  getCart: async (): Promise<Cart> => {
    const res = await api.get('/cart/');
    return res.data;
  },
  addToCart: async (productId: number, quantity: number = 1): Promise<{ message: string; cart: Cart }> => {
    const res = await api.post('/cart/items/', { product_id: productId, quantity });
    return res.data;
  },
  updateItemQuantity: async (itemId: number, quantity: number): Promise<{ message: string; cart: Cart }> => {
    const res = await api.patch(`/cart/items/${itemId}/`, { quantity });
    return res.data;
  },
  removeItem: async (itemId: number): Promise<{ message: string; cart: Cart }> => {
    const res = await api.delete(`/cart/items/${itemId}/remove/`);
    return res.data;
  },
  clearCart: async (): Promise<{ message: string; cart: Cart }> => {
    const res = await api.delete('/cart/clear/');
    return res.data;
  },
};

// Wishlist Services
export const wishlistService = {
  getWishlist: async (): Promise<Wishlist> => {
    const res = await api.get('/wishlist/');
    return res.data;
  },
  toggleWishlist: async (productId: number): Promise<{ message: string; is_in_wishlist: boolean; wishlist: Wishlist }> => {
    const res = await api.post('/wishlist/toggle/', { product_id: productId });
    return res.data;
  },
  removeItem: async (itemId: number): Promise<{ message: string; wishlist: Wishlist }> => {
    const res = await api.delete(`/wishlist/items/${itemId}/remove/`);
    return res.data;
  },
  moveToCart: async (itemId: number): Promise<{ message: string; wishlist: Wishlist }> => {
    const res = await api.post(`/wishlist/items/${itemId}/move-to-cart/`);
    return res.data;
  },
};

// Order Services
export const orderService = {
  getOrders: async (): Promise<Order[]> => {
    const res = await api.get('/orders/');
    return res.data;
  },
  createOrder: async (data: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    city: string;
    state: string;
    postal_code: string;
    payment_method: string;
    notes?: string;
  }): Promise<{ message: string; order: Order }> => {
    const res = await api.post('/orders/', data);
    return res.data;
  },
  getOrderDetail: async (orderIdOrNumber: string | number): Promise<Order> => {
    const res = await api.get(`/orders/${orderIdOrNumber}/`);
    return res.data;
  },
  cancelOrder: async (orderIdOrNumber: string | number): Promise<{ message: string; order: Order }> => {
    const res = await api.post(`/orders/${orderIdOrNumber}/cancel/`);
    return res.data;
  },
};

// Notification Services
export const notificationService = {
  getNotifications: async (): Promise<{ unread_count: number; notifications: Notification[] }> => {
    const res = await api.get('/notifications/');
    return res.data;
  },
  markAsRead: async (id: number) => {
    const res = await api.patch(`/notifications/${id}/read/`);
    return res.data;
  },
  markAllAsRead: async () => {
    const res = await api.post('/notifications/mark-all-read/');
    return res.data;
  },
};

// Admin Services
export const adminService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await api.get('/admin/dashboard/stats/');
    return res.data;
  },
  getProducts: async (): Promise<Product[]> => {
    const res = await api.get('/admin/products/');
    return res.data;
  },
  createProduct: async (formData: FormData): Promise<Product> => {
    const res = await api.post('/admin/products/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  updateProduct: async (id: number, formData: FormData): Promise<Product> => {
    const res = await api.put(`/admin/products/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  deleteProduct: async (id: number) => {
    const res = await api.delete(`/admin/products/${id}/`);
    return res.data;
  },
  getCategories: async (): Promise<Category[]> => {
    const res = await api.get('/admin/categories/');
    return res.data;
  },
  createCategory: async (data: any): Promise<Category> => {
    const res = await api.post('/admin/categories/', data);
    return res.data;
  },
  updateCategory: async (id: number, data: any): Promise<Category> => {
    const res = await api.put(`/admin/categories/${id}/`, data);
    return res.data;
  },
  deleteCategory: async (id: number) => {
    const res = await api.delete(`/admin/categories/${id}/`);
    return res.data;
  },
  getOrders: async (params?: { status?: string; search?: string }): Promise<Order[]> => {
    const res = await api.get('/admin/orders/', { params });
    return res.data;
  },
  updateOrderStatus: async (orderId: string | number, status: string): Promise<{ message: string; order: Order }> => {
    const res = await api.patch(`/admin/orders/${orderId}/status/`, { order_status: status });
    return res.data;
  },
  getCustomers: async (): Promise<AdminCustomer[]> => {
    const res = await api.get('/admin/customers/');
    return res.data;
  },
  getReviews: async () => {
    const res = await api.get('/admin/reviews/');
    return res.data;
  },
  deleteReview: async (id: number) => {
    const res = await api.delete(`/admin/reviews/${id}/`);
    return res.data;
  },
  getAdminRequests: async (): Promise<{ requests: AdminStaffRequest[]; pending_count: number }> => {
    const res = await api.get('/admin/staff-requests/');
    return res.data;
  },
  handleAdminRequest: async (userId: number, action: 'approve' | 'reject'): Promise<{ message: string; user: User }> => {
    const res = await api.post(`/admin/staff-requests/${userId}/action/`, { action });
    return res.data;
  },
};

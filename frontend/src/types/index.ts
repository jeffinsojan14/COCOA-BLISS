export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  role: 'customer' | 'admin';
  admin_status: 'none' | 'pending' | 'approved' | 'rejected';
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image?: string;
  image_url?: string;
  display_image: string;
  is_active: boolean;
  products_count: number;
  created_at: string;
}

export interface Review {
  id: number;
  product: number;
  user: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Product {
  id: number;
  category: number;
  category_name: string;
  category_slug: string;
  name: string;
  slug: string;
  short_description: string;
  description?: string;
  ingredients?: string;
  price: string | number;
  original_price?: string | number | null;
  weight: string;
  image?: string;
  image_url?: string;
  display_image: string;
  stock_quantity: number;
  is_available: boolean;
  is_bestseller: boolean;
  is_featured: boolean;
  rating: string | number;
  review_count: number;
  reviews?: Review[];
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: number;
  product: number;
  product_details: Product;
  quantity: number;
  subtotal: string | number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total_items: number;
  subtotal: string | number;
  delivery_charge: string | number;
  final_total: string | number;
  updated_at: string;
}

export interface WishlistItem {
  id: number;
  product: number;
  product_details: Product;
  created_at: string;
}

export interface Wishlist {
  id: number;
  items: WishlistItem[];
  total_items: number;
}

export interface OrderItem {
  id: number;
  product?: number | null;
  product_name_snapshot: string;
  product_image_snapshot?: string;
  product_weight_snapshot?: string;
  unit_price: string | number;
  quantity: number;
  subtotal: string | number;
}

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  subtotal: string | number;
  delivery_charge: string | number;
  total_amount: string | number;
  payment_method: 'cod' | 'upi' | 'card';
  payment_method_display: string;
  payment_status: 'pending' | 'completed' | 'failed';
  order_status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  status_display: string;
  notes?: string;
  delivery_instructions?: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface DashboardStats {
  total_sales: number;
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
  total_products: number;
  low_stock_products: number;
  total_customers: number;
  recent_orders: Order[];
}

export interface AdminCustomer {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  role?: 'customer' | 'admin';
  admin_status?: 'none' | 'pending' | 'approved' | 'rejected';
  date_joined: string;
  orders_count: number;
  total_spent: number;
}

export interface AdminStaffRequest {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  role: 'customer' | 'admin';
  admin_status: 'none' | 'pending' | 'approved' | 'rejected';
  is_staff: boolean;
  date_joined: string;
}

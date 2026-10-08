# Implementation Plan: Cocoa Bliss E-Commerce Website

Build a complete, production-quality, fully functional e-commerce website for **Cocoa Bliss** ("*Homemade Chocolates, Made with Love.*"). This solution faithfully replicates the visual design from the provided UI reference images (Homepage & Best Sellers, Register page, and Login page) while providing a robust full-stack architecture using **React + TypeScript + Vite + Tailwind CSS** on the frontend, and **Python + Django + Django REST Framework + MySQL / SQLite** on the backend.

---

## User Review Required

> [!IMPORTANT]
> **Database Configuration**:
> The backend will be engineered with a dynamic database configuration supporting **MySQL** (via `pymysql`) as requested for the college demonstration, with a seamless default to **SQLite** for instant local execution if MySQL service is not yet started. Switching between MySQL and SQLite is accomplished via a single `.env` setting (`DB_ENGINE=mysql` vs `DB_ENGINE=sqlite3`).
>
> **Design Fidelity**:
> The UI will strictly mirror the color palette, typography (Playfair Display + Inter), header announcement bar, logo, hero section, trust badges, product cards, split-screen auth layouts, and checkout experience from the provided reference images.

---

## Architecture & Project Structure

```text
d:/PROJECTS/COCOA BLISS/
├── backend/
│   ├── config/              # Django settings, URLs, WSGI, ASGI
│   ├── accounts/            # Custom User, Profile, Address, Authentication views
│   ├── products/            # Categories, Products, Reviews, Seeding command
│   ├── cart/                # Cart & CartItem models and endpoints
│   ├── wishlist/            # Wishlist & WishlistItem models and endpoints
│   ├── orders/              # Orders, OrderItems, Order status lifecycle, Invoicing
│   ├── notifications/       # In-app notifications
│   ├── media/               # Product and category images
│   ├── requirements.txt     # Django, DRF, django-cors-headers, Pillow, PyMySQL
│   ├── .env.example
│   └── manage.py
├── frontend/
│   ├── public/              # Static assets, chocolate images, icons
│   ├── src/
│   │   ├── components/      # Common UI, Product cards, Filter, Navbar, Footer, Admin
│   │   ├── context/         # AuthContext, CartContext, WishlistContext, NotificationContext
│   │   ├── pages/           # Home, Shop, ProductDetail, Cart, Wishlist, Checkout, Orders,
│   │   │                    # OrderDetail, Profile, Login, Register, About, Contact,
│   │   │                    # Admin (Dashboard, Products, Categories, Orders, Customers)
│   │   ├── services/        # Axios API client, Auth, Products, Orders, Admin services
│   │   ├── types/           # TypeScript interfaces
│   │   ├── index.css        # Tailwind directives + custom chocolate theme tokens
│   │   ├── App.tsx          # Router configuration with protected routes
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env.example
├── database/                # MySQL schema dump and setup scripts
└── README.md                # Comprehensive documentation, setup, credentials & presentation guide
```

---

## Proposed Changes

### Backend Components (Django REST Framework)

#### 1. Configuration & Core Settings
- Configure `config/settings.py` with:
  - Custom user model `AUTH_USER_MODEL = 'accounts.User'`.
  - CORS settings allowing Vite frontend (`http://localhost:5173`).
  - Media & Static file URLs and directories.
  - REST framework authentication (`SessionAuthentication` and Token/Header authentication).
  - Database engine switcher (`mysql` with `pymysql.install_as_MySQLdb()` or `sqlite3`).

#### 2. App: `accounts`
- **Model**: `User` extending `AbstractUser`:
  - `email` (unique identifier for login)
  - `full_name`
  - `phone`
  - `address`, `city`, `state`, `postal_code`, `country`
  - `role` ('customer' | 'admin')
- **Endpoints**:
  - `POST /api/auth/register/` (Full Name, Email, Phone, Password, Address, Role)
  - `POST /api/auth/login/` (Email, Password, Token generation)
  - `POST /api/auth/logout/`
  - `GET /api/auth/me/` & `PUT /api/auth/me/` (Profile update, address update)
  - `GET /api/admin/customers/` (Admin customer list with purchase counts)

#### 3. App: `products`
- **Models**:
  - `Category`: `name`, `slug`, `description`, `image`, `is_active`
  - `Product`: `category` (FK), `name`, `slug`, `description`, `ingredients`, `price`, `weight`, `image`, `stock_quantity`, `is_available`, `rating`, `review_count`, `is_bestseller`
  - `Review`: `product` (FK), `user` (FK), `rating` (1-5), `comment`, `created_at`
- **Endpoints**:
  - `GET /api/categories/`
  - `GET /api/products/` (search query, category filter, price range, sorting)
  - `GET /api/products/<id>/` (with reviews & related products)
  - `POST /api/products/<id>/reviews/` (add review)
  - Admin CRUD endpoints: `/api/admin/products/`, `/api/admin/categories/`, `/api/admin/reviews/`
- **Management Command**:
  - `python manage.py seed_data`: Populates 6 categories, 14 realistic chocolate products, demo admin account (`admin@cocoabliss.com`), demo customer (`customer@cocoabliss.com`), sample reviews, and orders.

#### 4. App: `cart` & App: `wishlist`
- **Models**:
  - `Cart` & `CartItem`: Links `user`, `product`, and `quantity` with stock limits.
  - `Wishlist` & `WishlistItem`: Prevents duplicates; enables 1-click move to cart.
- **Endpoints**:
  - `GET /api/cart/`, `POST /api/cart/items/`, `PATCH /api/cart/items/<id>/`, `DELETE /api/cart/items/<id>/`, `DELETE /api/cart/clear/`
  - `GET /api/wishlist/`, `POST /api/wishlist/toggle/`, `POST /api/wishlist/items/<id>/move-to-cart/`

#### 5. App: `orders` & App: `notifications`
- **Models**:
  - `Order`: `order_number` (e.g. `CB-2026-98124`), `user` (FK), customer contact, shipping address, `subtotal`, `delivery_charge`, `total_amount`, `payment_method` (`cod`, `upi`, `card`), `payment_status` (`pending`, `completed`), `order_status` (`pending`, `confirmed`, `preparing`, `shipped`, `delivered`, `cancelled`).
  - `OrderItem`: Snapshot of `product_name`, `product_image`, `unit_price`, `quantity`, `subtotal`.
  - `Notification`: In-app updates when order status changes or when stock is low.
- **Endpoints**:
  - `GET /api/orders/` (customer's orders)
  - `POST /api/orders/` (validate stock, decrement inventory, empty cart, generate order & notification)
  - `GET /api/orders/<id>/` (order tracking timeline & printable invoice data)
  - `POST /api/orders/<id>/cancel/`
  - `GET /api/admin/orders/` & `PATCH /api/admin/orders/<id>/status/`
  - `GET /api/admin/dashboard/stats/` (Total revenue, order counts by status, low stock warnings, customer count)
  - `GET /api/notifications/`, `POST /api/notifications/<id>/read/`

---

### Frontend Components (React + TypeScript + Tailwind CSS)

#### 1. Theme & Design Tokens (`src/index.css`)
- Recreate the rich Cocoa Bliss aesthetic from reference images:
  - Deep Espresso / Chocolate: `#1e0d06`, `#23120b`
  - Warm Cocoa / Milk Chocolate: `#3e1d13`, `#4a2517`
  - Warm Caramel / Honey Gold: `#c58b43`, `#d49a5b`
  - Light Cream / Off-White background: `#fdfbf7`, `#faf6f0`
  - Typography: Serif font (*Playfair Display*) for titles and headings; sans-serif (*Inter* / *Plus Jakarta Sans*) for body, navigation, and badges.

#### 2. Key Pages & Visuals
1. **Home Page (`/`)** - *Matches Image 1*:
   - Top announcement banner: Phone `+91 98765 43210` | Email `support@cocoabliss.com` | `Handmade with ❤️ | 100% Premium Ingredients` | `🚚 Free Shipping on Orders Above ₹999`.
   - Brand Header: Stylized cocoa pod logo, navigation links (`Home`, `Shop ⌄`, `Categories ⌄`, `Gift Boxes`, `About Us`, `Contact Us`), search bar trigger, user profile dropdown, cart badge counter.
   - Luxury Hero Banner: Dark chocolate gradient, truffles gift box photo, "INDULGE IN PURE HAPPINESS", "Homemade Chocolates, Made with Love. 🤎", primary button "SHOP NOW >", secondary button "EXPLORE GIFT BOXES".
   - 5 Trust Badges Ribbon: Premium Ingredients, Handmade with Love, Fast & Reliable Delivery, Secure Payments, Beautiful Packaging.
   - "BEST SELLERS 🤎" Section: Filtered chocolate cards with "BEST SELLER" badge, ratings, price in ₹, and "ADD TO CART" outline button.
   - Promotional Gift Box Showcase, Customer Reviews carousel, and elegant Footer.
2. **Auth Pages (`/login` & `/register`)** - *Matches Images 2 & 3*:
   - Split-screen layout: Chocolate luxury box imagery on the left side with branded message.
   - Clean rounded card on the right with custom styled inputs, leading icons (User, Mail, Phone, Lock with visibility toggle, Address pin), role selection, terms checkbox, dark chocolate submit button, "OR", "Continue with Google" button, and switch links.
3. **Shop & Product Catalog (`/shop`, `/categories`)**:
   - Live search input, category selector, price range filter, in-stock toggle, and 5 sorting modes.
4. **Product Details (`/products/:id`)**:
   - Gallery image, badges, price, stock counter, weight, ingredients list, quantity picker, Add to Cart & Wishlist, interactive 1-5 star review submission form, and recommended chocolates.
5. **Cart (`/cart`) & Wishlist (`/wishlist`)**:
   - Real-time quantity adjustment, stock validation, delivery fee breakdown, and seamless checkout transition.
6. **Checkout (`/checkout`)**:
   - Saved or new address input, summary recalculation, payment method selection (Cash on Delivery or Instant Mock Online UPI/Card with QR simulation).
7. **Order Confirmation & Tracking (`/order-confirmation/:id`, `/orders/:id`)**:
   - Interactive order timeline: `Pending` ➔ `Confirmed` ➔ `Preparing` ➔ `Shipped` ➔ `Delivered`.
   - Formatted printable / downloadable PDF-ready invoice.
8. **Admin Suite (`/admin/*`)**:
   - Dedicated dashboard with key metrics (Total Sales, Total Orders, Products, Low Stock alerts, Customers).
   - CRUD management for Products (with image file upload), Categories, Orders (with status changer), and Customer lists.

---

## Verification Plan

### Automated & Sanity Checks
- **Backend**:
  - Run `python manage.py test` or verify migrations: `python manage.py makemigrations && python manage.py migrate`.
  - Run database seeder: `python manage.py seed_data`.
  - Validate endpoints with Python script (testing auth registration, login, product list, cart add, checkout, order placement).
- **Frontend**:
  - Run `npm run build` or `npm run lint` / TypeScript check (`npx tsc --noEmit`) to verify 0 syntax or type errors.
  - Launch Vite dev server.

### Visual & End-to-End Workflow Verification
1. Open Vite frontend in browser.
2. Verify visual fidelity against Reference Image 1 (Announcement bar, Logo, Hero, Badges, Best Sellers cards).
3. Test Customer Registration (`/register`) matching Reference Image 2.
4. Test Customer Login (`/login`) matching Reference Image 3.
5. Browse products, search "Truffle", filter by category.
6. Add product to cart, update quantity, observe badge count and stock limit.
7. Add item to wishlist and move to cart.
8. Complete checkout with Cash on Delivery and verify stock reduction.
9. View order tracking timeline and test printable invoice.
10. Submit a product rating and review.
11. Login as Administrator (`admin@cocoabliss.com`), review admin dashboard stats, update order status to `Confirmed`/`Shipped`, edit product stock.
12. Check in-app notification count and delivery status updates.

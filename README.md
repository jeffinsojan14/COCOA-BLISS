# 🍫 COCOA BLISS — Homemade Chocolates, Made with Love

<div align="center">

![Cocoa Bliss Banner](https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1200&q=80)

[![React](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Django](https://img.shields.io/badge/Django-6.1-092e20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/Django_REST_Framework-3.18-a30000?style=for-the-badge&logo=django&logoColor=white)](https://www.django-rest-framework.org/)
[![Python](https://img.shields.io/badge/Python-3.14-3776ab?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Database](https://img.shields.io/badge/Database-MySQL_%7C_SQLite-4479a1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

**"Homemade Chocolates, Made with Love."**  
*A complete, production-quality, full-stack e-commerce web platform for a dedicated handcrafted chocolate brand.*

[Features](#-key-features) • [Tech Stack](#-technology-stack) • [Super Admin Workflow](#-super-admin-approval-workflow) • [Quick Start](#-quick-start-guide) • [API Documentation](#-api-endpoints) • [College Viva Q&A](#-college-project-viva-notes)

</div>

---

## 📖 Overview

**Cocoa Bliss** is a dedicated online boutique for a single homemade chocolate business (not a multi-vendor marketplace). Customers can discover single-origin artisan chocolates, customize gift hampers, manage their cart and wishlist, checkout with Cash on Delivery (COD) or instant digital payments, track live order fulfillment progress, download official invoices, and submit product reviews.

The platform includes a secured **Administrator Suite** featuring executive KPI metrics, chocolate product & stock management, category management with relational protection, order status progression, customer directories, and review moderation.

---

## 🎨 Visual Design System

Built to replicate the visual references of a luxury chocolate confectionary:
- **Warm Cocoa Palette**: Tailored `#1e0d06` deep cocoa, `#c68b59` golden caramel, `#fdfbf7` soft cream canvas, and burgundy accent tags.
- **Editorial Typography**: Pairing Google Fonts' *Playfair Display* (luxury serif headings) with *Plus Jakarta Sans* (readable body text).
- **Interactive UI**: Micro-animations, responsive price sliders, live category badges, and celebration confetti on checkout completion.
- **Split-Screen Authentication**: Left-hand artisan chocolate showcase with 1-click Quick Demo Fill buttons on both Login and Register screens.

---

## 🌟 Key Features

### 🛒 Customer Storefront
- **Live Search & Multi-Filters**: Instant search by chocolate name, description, ingredients, or category slug, paired with an interactive price range slider and in-stock toggles.
- **Dynamic Inventory Verification**: Strict real-time inventory limits that prevent overselling and display low-stock alerts.
- **Free Shipping Progress Tracker**: Dynamic notification bar displaying progress toward the free delivery threshold (*"Add ₹X more to unlock FREE Delivery"*).
- **Persistent Cart & Wishlist**: Fully synchronized with the backend database for authenticated customers.
- **Streamlined Checkout**: Auto-populates delivery details from the customer's profile, offering Cash on Delivery (COD), UPI (GPay/PhonePe/Paytm sandbox), and Credit/Debit Cards.
- **5-Stage Order Tracking Timeline**: Visual timeline indicating:  
  $$\text{Pending} \longrightarrow \text{Confirmed} \longrightarrow \text{Preparing} \longrightarrow \text{Shipped} \longrightarrow \text{Delivered}$$
- **Printable Tax Invoices**: Downloadable and printable order invoices complete with itemized tables, GST breakdown, customer shipping details, and official branding.
- **Ratings & Reviews**: 1–5 star ratings with rich feedback submission.
- **In-App Notifications**: Real-time notification center for order confirmation, preparation, and delivery updates.

### 🛡️ Administrator Suite (`/admin`)
- **Executive Analytics Dashboard**: Real-time total revenue (₹), total orders, pending orders, completed orders, low-stock alerts, and registered customer counts.
- **Product Management (CRUD)**: Create, update, or remove chocolate varieties; manage batch stock; toggle Best Seller tags.
- **Category Management (CRUD)**: Add, edit, and organize chocolate collections with relational integrity checks.
- **Order Processing**: Update order fulfillment statuses with automatic customer notification triggers.
- **Customer Directory**: Inspect registered customers, total orders placed, and lifetime spend.
- **Review Moderation**: Moderate customer reviews and remove inappropriate content.

---

## 👑 Super Admin Approval Workflow

To ensure strict security and prevent unauthorized administrative access:
1. **Public Self-Registration**: Anyone can apply as an Administrator on the registration page (`/register`) by selecting **"Administrator (Requires Super Admin Approval)"**.
2. **Safe Default State**: Newly registered administrator accounts are initialized with:
   - `role = 'customer'`
   - `admin_status = 'pending'`
   - `is_staff = False`
   - Unapproved users are blocked with `403 Forbidden` if they try to access any admin endpoints. If they visit `/admin`, they are greeted by an informative **"Access Pending Approval"** screen.
3. **Super Admin Exclusivity**: **Only the primary Super Admin (`admin@cocoabliss.com`)** has the privilege to review, accept, or reject administrator requests.
4. **1-Click Approvals**: Inside `/admin/customers` ➔ **"Admin Approvals"**, the Super Admin can review applicants and approve them with one click, which instantly promotes them to `role = 'admin'` (`is_staff = True`) and dispatches a notification to the applicant.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS, React Router DOM, Lucide Icons, Canvas Confetti, Axios |
| **Backend** | Python 3.14+, Django 6.1+, Django REST Framework (DRF), django-cors-headers, Pillow |
| **Database** | MySQL (with PyMySQL connector) with zero-setup SQLite automatic fallback |
| **Authentication** | Token-based DRF Authentication & Django Session Auth with PBKDF2 password hashing |

---

## 📁 Project Structure

```text
COCOA BLISS/
│
├── backend/                         # Django REST Framework Backend
│   ├── config/                      # Settings, URLs, WSGI, ASGI
│   ├── accounts/                    # Custom User, authentication, Super Admin approval
│   ├── products/                    # Products, categories, ratings & reviews
│   ├── cart/                        # Shopping cart and cart items
│   ├── wishlist/                    # Customer wishlist management
│   ├── orders/                      # Orders, items, timeline status, and invoice generation
│   ├── notifications/               # Real-time customer and admin in-app notifications
│   ├── manage.py                    # Django CLI entrypoint
│   └── requirements.txt             # Python dependencies
│
├── frontend/                        # React + TypeScript + Vite Frontend
│   ├── src/
│   │   ├── components/              # Navbar, Footer, TopBar, ProductCard, Timeline, AdminLayout
│   │   ├── pages/                   # Home, Shop, ProductDetail, Cart, Checkout, OrderTracking
│   │   ├── pages/admin/             # Dashboard, Products, Categories, Orders, Customers & Approvals
│   │   ├── context/                 # AuthContext, CartContext, WishlistContext, NotificationContext
│   │   ├── services/api.ts          # Central Axios API service layer
│   │   └── types/                   # TypeScript interfaces and data models
│   ├── index.html                   # HTML entrypoint
│   ├── vite.config.ts               # Vite configuration with proxy
│   └── package.json                 # Frontend dependencies
│
├── database/
│   └── setup.sql                    # MySQL database schema setup script
│
├── run_backend.bat                  # 1-Click launcher for Django server (Windows)
├── run_frontend.bat                 # 1-Click launcher for Vite dev server (Windows)
├── seed_database.bat                # 1-Click database seeder script
├── .gitignore                       # Production-grade GitHub ignore configuration
└── README.md                        # Documentation
```

---

## 🚀 Quick Start Guide

### Option 1: 1-Click Launchers (Windows)
1. **Start Backend**: Double-click `run_backend.bat` (runs on `http://127.0.0.1:8000/`)
2. **Start Frontend**: Double-click `run_frontend.bat` (runs on `http://127.0.0.1:5173/`)
3. Open your browser at **`http://localhost:5173/`**

---

### Option 2: Manual Terminal Setup (macOS / Linux / Windows)

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/cocoa-bliss.git
cd cocoa-bliss
```

#### 2. Backend Setup (Django)
```bash
cd backend

# Create and activate a Python virtual environment
python -m venv backend_env

# On Windows:
backend_env\Scripts\activate
# On macOS/Linux:
source backend_env/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Seed database with 14 products, 6 categories, demo accounts, and reviews
python manage.py seed_data

# Start development server
python manage.py runserver 127.0.0.1:8000
```

#### 3. Frontend Setup (React + Vite)
Open a new terminal tab:
```bash
cd frontend

# Install Node modules
npm install

# Start Vite development server
npm run dev
```
Visit **`http://localhost:5173/`** in your browser!

---

## 🔑 Demo Accounts

Both Login (`/login`) and Registration (`/register`) pages include **1-Click "Quick Demo Fill"** buttons:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@cocoabliss.com` | `Admin@123` | Full access to `/admin` dashboard, product CRUD, order transitions, customer directory, and **Admin Approvals** |
| **Standard Customer** | `customer@cocoabliss.com` | `Customer@123` | Browse, cart, wishlist, checkout, live order tracking, profile, write reviews |
| **Pending Admin Applicant** | `rohit.admin@example.com` | `Applicant@123` | Demonstrates the pending approval screen until accepted by Super Admin |

---

## 🔌 API Endpoints

### Authentication & Profiles
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register/` | Register new customer or request admin access |
| `POST` | `/api/auth/login/` | Authenticate user & retrieve DRF token |
| `POST` | `/api/auth/logout/` | Invalidate active auth token |
| `GET` | `/api/auth/me/` | Retrieve current authenticated user profile |
| `PUT` | `/api/auth/me/` | Update user profile and shipping address |

### Products & Categories
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/categories/` | List all active chocolate categories |
| `GET` | `/api/products/` | Filterable chocolate catalog (search, price, sort) |
| `GET` | `/api/products/<id>/` | Detailed chocolate information with reviews |
| `POST` | `/api/products/<id>/reviews/` | Submit a customer rating and review |

### Cart & Wishlist
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/cart/` | Retrieve customer cart with subtotal & delivery charges |
| `POST` | `/api/cart/add/` | Add chocolate to cart with stock validation |
| `PATCH` | `/api/cart/items/<id>/` | Adjust quantity of cart item |
| `DELETE` | `/api/cart/items/<id>/` | Remove item from cart |
| `GET` | `/api/wishlist/` | Retrieve customer wishlist items |
| `POST` | `/api/wishlist/toggle/` | Add or remove chocolate from wishlist |
| `POST` | `/api/wishlist/items/<id>/move-to-cart/` | Move item from wishlist into shopping cart |

### Orders & Checkout
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/orders/` | List authenticated customer order history |
| `POST` | `/api/orders/` | Place atomic order, deduct stock, and clear cart |
| `GET` | `/api/orders/<id_or_number>/` | Detailed order timeline status and printable invoice |
| `POST` | `/api/orders/<id_or_number>/cancel/` | Cancel pending order and restock inventory |

### Super Admin Suite
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard/stats/` | Retrieve revenue, orders, stock alerts, and customers |
| `GET` | `/api/admin/customers/` | List customer directory with order counts and spend |
| `GET` | `/api/admin/staff-requests/` | List admin registration applicants *(Super Admin only)* |
| `POST` | `/api/admin/staff-requests/<id>/action/` | Approve or reject admin applicants *(Super Admin only)* |
| `PATCH` | `/api/admin/orders/<id>/status/` | Advance order status (*pending* ➔ *delivered*) |
| `POST` | `/api/admin/products/` | Add new chocolate variety |
| `PUT` | `/api/admin/products/<id>/` | Update chocolate recipe details, price, or stock |
| `DELETE` | `/api/admin/products/<id>/` | Remove chocolate variety |

---

## 🎓 College Project Viva Notes

### Q1: Why did you choose React + Vite instead of a traditional multi-page template?
> **Answer**: React with Vite enables a lightning-fast Single Page Application (SPA) architecture with instant client-side transitions, component modularity, and hot module replacement (HMR). State synchronization across Cart, Wishlist, and Notifications occurs seamlessly without full-page reloads.

### Q2: How is transaction safety and inventory consistency maintained during checkout?
> **Answer**: Checkout utilizes Django's `with transaction.atomic():` block. Before creating an order, the system locks product rows, checks available batch quantities, decrements stock atomically, and clears the user's cart. If any product has insufficient stock or a step fails, the entire transaction rolls back cleanly.

### Q3: How does the Super Admin approval mechanism work?
> **Answer**: Standard registration defaults all self-registered users to `role = 'customer'`. When a user requests the Administrator role, their `admin_status` is marked as `'pending'` and `is_staff` remains `False`. Only the hard-designated Super Admin (`admin@cocoabliss.com`) can invoke the approval API endpoint to elevate the user to `role = 'admin'` and `is_staff = True`.

### Q4: How is database portability achieved between development and production?
> **Answer**: The backend settings read `DB_ENGINE` from `.env`. If set to `mysql`, PyMySQL connects to a production MySQL server. If left on `sqlite3`, Django automatically falls back to a zero-configuration SQLite database, allowing the project to run immediately on any evaluator's computer without installing a database server.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).

<div align="center">
Made with ❤️ for chocolate lovers everywhere.
</div>

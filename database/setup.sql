-- ==========================================================
-- Cocoa Bliss - Homemade Chocolates, Made with Love
-- Complete Relational Database DDL Schema for MySQL (InnoDB)
-- ==========================================================

-- 1. Create the Database
CREATE DATABASE IF NOT EXISTS cocoa_bliss
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE cocoa_bliss;

-- Disable foreign key checks during schema creation
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------
-- Table 1: accounts_user
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS accounts_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    password VARCHAR(128) NOT NULL,
    last_login DATETIME NULL,
    is_superuser TINYINT(1) NOT NULL DEFAULT 0,
    username VARCHAR(150) NOT NULL UNIQUE,
    first_name VARCHAR(150) NOT NULL DEFAULT '',
    last_name VARCHAR(150) NOT NULL DEFAULT '',
    is_staff TINYINT(1) NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    date_joined DATETIME NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL DEFAULT '',
    phone VARCHAR(20) NULL,
    address TEXT NULL,
    city VARCHAR(100) NULL,
    state VARCHAR(100) NULL,
    postal_code VARCHAR(20) NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    role VARCHAR(20) NOT NULL DEFAULT 'customer',
    admin_status VARCHAR(20) NOT NULL DEFAULT 'none'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- Table 2: products_category
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS products_category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    image VARCHAR(100) NULL,
    image_url VARCHAR(500) NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- Table 3: products_product
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS products_product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,
    short_description VARCHAR(255) NOT NULL DEFAULT '',
    description TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2) NULL,
    weight VARCHAR(50) NOT NULL DEFAULT '150g',
    image VARCHAR(100) NULL,
    image_url VARCHAR(500) NULL,
    stock_quantity INT UNSIGNED NOT NULL DEFAULT 25,
    is_available TINYINT(1) NOT NULL DEFAULT 1,
    is_bestseller TINYINT(1) NOT NULL DEFAULT 0,
    is_featured TINYINT(1) NOT NULL DEFAULT 0,
    rating DECIMAL(3, 1) NOT NULL DEFAULT 5.0,
    review_count INT UNSIGNED NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    category_id BIGINT NOT NULL,
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) 
        REFERENCES products_category (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_product_category_id ON products_product (category_id);

-- ----------------------------------------------------------
-- Table 4: products_review
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS products_review (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    rating SMALLINT UNSIGNED NOT NULL DEFAULT 5,
    comment TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    product_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_review_product FOREIGN KEY (product_id) 
        REFERENCES products_product (id) ON DELETE CASCADE,
    CONSTRAINT fk_review_user FOREIGN KEY (user_id) 
        REFERENCES accounts_user (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_review_product_id ON products_review (product_id);
CREATE INDEX idx_review_user_id ON products_review (user_id);

-- ----------------------------------------------------------
-- Table 5: cart_cart
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS cart_cart (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    user_id BIGINT NOT NULL UNIQUE,
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) 
        REFERENCES accounts_user (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- Table 6: cart_cartitem
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS cart_cartitem (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quantity INT UNSIGNED NOT NULL DEFAULT 1,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    CONSTRAINT uq_cart_product UNIQUE (cart_id, product_id),
    CONSTRAINT fk_cartitem_cart FOREIGN KEY (cart_id) 
        REFERENCES cart_cart (id) ON DELETE CASCADE,
    CONSTRAINT fk_cartitem_product FOREIGN KEY (product_id) 
        REFERENCES products_product (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_cartitem_cart_id ON cart_cartitem (cart_id);
CREATE INDEX idx_cartitem_product_id ON cart_cartitem (product_id);

-- ----------------------------------------------------------
-- Table 7: wishlist_wishlist
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS wishlist_wishlist (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at DATETIME NOT NULL,
    user_id BIGINT NOT NULL UNIQUE,
    CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) 
        REFERENCES accounts_user (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- Table 8: wishlist_wishlistitem
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS wishlist_wishlistitem (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    created_at DATETIME NOT NULL,
    product_id BIGINT NOT NULL,
    wishlist_id BIGINT NOT NULL,
    CONSTRAINT uq_wishlist_product UNIQUE (wishlist_id, product_id),
    CONSTRAINT fk_wishlistitem_wishlist FOREIGN KEY (wishlist_id) 
        REFERENCES wishlist_wishlist (id) ON DELETE CASCADE,
    CONSTRAINT fk_wishlistitem_product FOREIGN KEY (product_id) 
        REFERENCES products_product (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_wishlistitem_wishlist_id ON wishlist_wishlistitem (wishlist_id);
CREATE INDEX idx_wishlistitem_product_id ON wishlist_wishlistitem (product_id);

-- ----------------------------------------------------------
-- Table 9: orders_order
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders_order (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(254) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    shipping_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_charge DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL DEFAULT 'cod',
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    order_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    notes TEXT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) 
        REFERENCES accounts_user (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_order_user_id ON orders_order (user_id);

-- ----------------------------------------------------------
-- Table 10: orders_orderitem
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders_orderitem (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_name_snapshot VARCHAR(200) NOT NULL,
    product_image_snapshot VARCHAR(500) NULL,
    product_weight_snapshot VARCHAR(50) NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    quantity INT UNSIGNED NOT NULL DEFAULT 1,
    subtotal DECIMAL(10, 2) NOT NULL,
    order_id BIGINT NOT NULL,
    product_id BIGINT NULL,
    CONSTRAINT fk_orderitem_order FOREIGN KEY (order_id) 
        REFERENCES orders_order (id) ON DELETE CASCADE,
    CONSTRAINT fk_orderitem_product FOREIGN KEY (product_id) 
        REFERENCES products_product (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_orderitem_order_id ON orders_orderitem (order_id);
CREATE INDEX idx_orderitem_product_id ON orders_orderitem (product_id);

-- ----------------------------------------------------------
-- Table 11: notifications_notification
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications_notification (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(255) NULL,
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,
    user_id BIGINT NOT NULL,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) 
        REFERENCES accounts_user (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_notification_user_id ON notifications_notification (user_id);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

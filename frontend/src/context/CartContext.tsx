import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Cart } from '../types';
import { cartService } from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  cartCount: number;
  isLoading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<string>;
  updateQuantity: (itemId: number, quantity: number) => Promise<string>;
  removeItem: (itemId: number) => Promise<string>;
  clearCart: () => Promise<string>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    try {
      setIsLoading(true);
      const data = await cartService.getCart();
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId: number, quantity: number = 1): Promise<string> => {
    if (!isAuthenticated) {
      throw new Error('Please login to add items to your cart.');
    }
    const res = await cartService.addToCart(productId, quantity);
    setCart(res.cart);
    return res.message;
  };

  const updateQuantity = async (itemId: number, quantity: number): Promise<string> => {
    const res = await cartService.updateItemQuantity(itemId, quantity);
    setCart(res.cart);
    return res.message;
  };

  const removeItem = async (itemId: number): Promise<string> => {
    const res = await cartService.removeItem(itemId);
    setCart(res.cart);
    return res.message;
  };

  const clearCart = async (): Promise<string> => {
    const res = await cartService.clearCart();
    setCart(res.cart);
    return res.message;
  };

  const cartCount = cart ? cart.total_items : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        isLoading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

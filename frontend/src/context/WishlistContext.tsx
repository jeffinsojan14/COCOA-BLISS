import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Wishlist } from '../types';
import { wishlistService } from '../services/api';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

interface WishlistContextType {
  wishlist: Wishlist | null;
  wishlistCount: number;
  isLoading: boolean;
  isWishlisted: (productId: number) => boolean;
  toggleWishlist: (productId: number) => Promise<{ message: string; is_in_wishlist: boolean }>;
  removeItem: (itemId: number) => Promise<string>;
  moveToCart: (itemId: number) => Promise<string>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { refreshCart } = useCart();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist(null);
      return;
    }
    try {
      setIsLoading(true);
      const data = await wishlistService.getWishlist();
      setWishlist(data);
    } catch {
      setWishlist(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const isWishlisted = (productId: number): boolean => {
    if (!wishlist || !wishlist.items) return false;
    return wishlist.items.some((item) => item.product === productId || item.product_details?.id === productId);
  };

  const toggleWishlist = async (productId: number): Promise<{ message: string; is_in_wishlist: boolean }> => {
    if (!isAuthenticated) {
      throw new Error('Please login to save items to your wishlist.');
    }
    const res = await wishlistService.toggleWishlist(productId);
    setWishlist(res.wishlist);
    return { message: res.message, is_in_wishlist: res.is_in_wishlist };
  };

  const removeItem = async (itemId: number): Promise<string> => {
    const res = await wishlistService.removeItem(itemId);
    setWishlist(res.wishlist);
    return res.message;
  };

  const moveToCart = async (itemId: number): Promise<string> => {
    const res = await wishlistService.moveToCart(itemId);
    setWishlist(res.wishlist);
    await refreshCart();
    return res.message;
  };

  const wishlistCount = wishlist ? wishlist.total_items : 0;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        isLoading,
        isWishlisted,
        toggleWishlist,
        removeItem,
        moveToCart,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface CartItem {
  _id: string;
  name: string;
  price: string;
  imageColor: string;
  emoji: string;
  quantity: number;
  imageUrl?: string;
  isBundle?: boolean;
  bundleDetails?: {
    type?: string;
    packSize?: number;
    size?: string;
    items: { name: string; qty: number; imageUrl?: string }[];
  };
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prev => {
      // For bundles, we check if an identical bundle already exists
      if (item.isBundle) {
        const existingBundle = prev.find(i => 
          i.isBundle && 
          i.bundleDetails?.type === item.bundleDetails?.type &&
          i.bundleDetails?.packSize === item.bundleDetails?.packSize &&
          i.bundleDetails?.size === item.bundleDetails?.size &&
          JSON.stringify(i.bundleDetails?.items) === JSON.stringify(item.bundleDetails?.items)
        );
        if (existingBundle) {
          return prev.map(i => i._id === existingBundle._id ? { ...i, quantity: i.quantity + 1 } : i);
        }
        return [...prev, { ...item, quantity: 1, _id: `bundle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }];
      }

      const existing = prev.find(i => i._id === item._id && !i.isBundle);
      if (existing) {
        return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(i => i._id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) { removeFromCart(id); return; }
    setCartItems(prev => prev.map(i => i._id === id ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const cartTotal = cartItems.reduce((sum, i) => {
    const num = parseFloat(i.price.replace(/[^\d.]/g, ''));
    return sum + (isNaN(num) ? 0 : num * i.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

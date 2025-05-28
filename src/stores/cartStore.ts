import { create } from 'zustand';
import { CartItem, MenuItem } from '../types';

interface CartStore {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  
  addItem: (item: MenuItem) => {
    const { items } = get();
    const existingItem = items.find(i => i.id === item.id);
    
    if (existingItem) {
      set({
        items: items.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 } 
            : i
        )
      });
    } else {
      set({ items: [...items, { ...item, quantity: 1 }] });
    }
  },
  
  removeItem: (itemId: number) => {
    const { items } = get();
    set({ items: items.filter(i => i.id !== itemId) });
  },
  
  updateQuantity: (itemId: number, quantity: number) => {
    const { items } = get();
    
    if (quantity <= 0) {
      set({ items: items.filter(i => i.id !== itemId) });
    } else {
      set({
        items: items.map(i => 
          i.id === itemId 
            ? { ...i, quantity } 
            : i
        )
      });
    }
  },
  
  clearCart: () => set({ items: [] }),
  
  total: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
}));

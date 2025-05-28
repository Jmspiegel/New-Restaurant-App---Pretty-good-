import { create } from 'zustand';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  
  addItem: (item: MenuItem) => {
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      
      return {
        items: [
          ...state.items,
          {
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            image_url: item.image_url,
          },
        ],
      };
    });
  },
  
  removeItem: (id: number) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    }));
  },
  
  updateQuantity: (id: number, quantity: number) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
      ),
    }));
  },
  
  clearCart: () => {
    set({ items: [] });
  },
  
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
  
  getTotalPrice: () => {
    return get().items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },
}));

interface AuthStore {
  user: any | null;
  isLoggedIn: boolean;
  setUser: (user: any | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoggedIn: false,
  
  setUser: (user) => {
    set({
      user,
      isLoggedIn: !!user,
    });
  },
  
  logout: () => {
    set({
      user: null,
      isLoggedIn: false,
    });
  },
}));

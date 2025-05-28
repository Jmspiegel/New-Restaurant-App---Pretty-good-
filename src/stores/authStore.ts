import { create } from 'zustand';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
  checkSession: () => Promise<User | null>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  error: null,
  initialized: false,
  
  setUser: (user) => set({ user, loading: false }),
  
  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null });
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message });
      }
    }
  },
  
  checkSession: async () => {
    try {
      set({ loading: true });
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // For demo purposes, we'll set all users to have admin role
        // In a real app, you would fetch the user's role from a database
        const user = {
          id: session.user.id,
          email: session.user.email || '',
          role: 'admin', // Set all users to admin for demo
        };
        
        set({ 
          user,
          initialized: true,
        });
        
        return user;
      } else {
        set({ user: null, initialized: true });
        return null;
      }
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message });
      }
      return null;
    } finally {
      set({ loading: false });
    }
  }
}));

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  created_at: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  preparation_time: number;
  available: boolean;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: number;
  order_id: string;
  menu_item_id: number;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
  status: string;
  menu_item?: {
    id: number;
    name: string;
    price: number;
  };
}

export interface Order {
  id: string;
  user_id: string;
  created_at: string;
  status: string;
  total: number;
  items: OrderItem[];
  special_instructions?: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

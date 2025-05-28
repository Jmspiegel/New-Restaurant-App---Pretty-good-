export interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  category: string
  available: boolean
  preparation_time: number
}

export interface CartItem extends MenuItem {
  quantity: number
}

export interface Order {
  id: number | string
  created_at: string
  user_id: string
  status: string
  total: number
  table_number?: number | null
  special_instructions?: string | null
  items?: OrderItem[]
}

export interface OrderItem {
  id: number
  order_id: number | string
  menu_item_id: number
  menu_item?: MenuItem
  name?: string
  quantity: number
  price?: number
  subtotal: number
  status: string
}

export interface User {
  id: string
  email: string
  role?: string
  full_name?: string
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
export type OrderItemStatus = 'pending' | 'preparing' | 'ready' | 'delivered'
export type UserRole = 'customer' | 'staff' | 'admin'

export interface Category {
  id: string
  name: string
}

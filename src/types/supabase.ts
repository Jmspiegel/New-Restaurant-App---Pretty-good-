export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      menu_items: {
        Row: {
          id: number
          created_at: string
          name: string
          description: string
          price: number
          image_url: string
          category: string
          available: boolean
          preparation_time: number
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          description: string
          price: number
          image_url: string
          category: string
          available?: boolean
          preparation_time: number
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          description?: string
          price?: number
          image_url?: string
          category?: string
          available?: boolean
          preparation_time?: number
        }
      }
      orders: {
        Row: {
          id: number
          created_at: string
          user_id: string
          status: string
          total: number
          table_number: number | null
          special_instructions: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          user_id: string
          status?: string
          total: number
          table_number?: number | null
          special_instructions?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          user_id?: string
          status?: string
          total?: number
          table_number?: number | null
          special_instructions?: string | null
        }
      }
      order_items: {
        Row: {
          id: number
          created_at: string
          order_id: number
          menu_item_id: number
          quantity: number
          subtotal: number
          status: string
        }
        Insert: {
          id?: number
          created_at?: string
          order_id: number
          menu_item_id: number
          quantity: number
          subtotal: number
          status?: string
        }
        Update: {
          id?: number
          created_at?: string
          order_id?: number
          menu_item_id?: number
          quantity?: number
          subtotal?: number
          status?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string | null
          role: string
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          role?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          role?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

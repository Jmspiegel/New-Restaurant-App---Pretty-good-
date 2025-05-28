import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Order } from '../types';
import { useAuthStore } from '../stores/authStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import OrderCard from '../components/OrderCard';

export default function Orders() {
  const { user, checkSession } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const init = async () => {
      const session = await checkSession();
      
      if (!session) {
        navigate('/login');
        return;
      }
      
      // Fetch orders
      fetchOrders();
    };
    
    init();
  }, [checkSession, navigate]);
  
  const fetchOrders = async () => {
    setLoading(true);
    
    try {
      // In a real app with Supabase, we would fetch from the database
      // For now, using mock data to ensure consistent display
      
      // Simulated orders data
      const mockOrders: Order[] = [
        {
          id: '1',
          user_id: 'user1',
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          status: 'delivered',
          total: 32.97,
          items: [
            {
              id: 1,
              order_id: '1',
              menu_item_id: 1,
              name: 'Margherita Pizza',
              quantity: 1,
              price: 12.99,
              subtotal: 12.99,
              status: 'delivered'
            },
            {
              id: 2,
              order_id: '1',
              menu_item_id: 4,
              name: 'Pasta Carbonara',
              quantity: 1,
              price: 14.99,
              subtotal: 14.99,
              status: 'delivered'
            },
            {
              id: 3,
              order_id: '1',
              menu_item_id: 7,
              name: 'Iced Tea',
              quantity: 1,
              price: 3.99,
              subtotal: 3.99,
              status: 'delivered'
            }
          ]
        },
        {
          id: '2',
          user_id: 'user1',
          created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          status: 'preparing',
          total: 26.97,
          items: [
            {
              id: 4,
              order_id: '2',
              menu_item_id: 8,
              name: 'Grilled Salmon',
              quantity: 1,
              price: 18.99,
              subtotal: 18.99,
              status: 'preparing'
            },
            {
              id: 5,
              order_id: '2',
              menu_item_id: 5,
              name: 'Garlic Bread',
              quantity: 1,
              price: 5.99,
              subtotal: 5.99,
              status: 'preparing'
            },
            {
              id: 6,
              order_id: '2',
              menu_item_id: 11,
              name: 'Lemonade',
              quantity: 1,
              price: 4.99,
              subtotal: 4.99,
              status: 'ready'
            }
          ],
          special_instructions: 'Please make the salmon well-done.'
        }
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center h-64">
          <p className="text-xl text-gray-600">Loading your orders...</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Orders</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">No orders found</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <button 
              onClick={() => navigate('/menu')}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

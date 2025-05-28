import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Order, OrderItem } from '../types';
import { useAuthStore } from '../stores/authStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { formatDate } from '../utils/formatters';

export default function Kitchen() {
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
      
      if (session.role !== 'admin' && session.role !== 'staff') {
        navigate('/menu');
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
          created_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
          status: 'preparing',
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
              status: 'preparing',
              menu_item: {
                id: 1,
                name: 'Margherita Pizza',
                price: 12.99
              }
            },
            {
              id: 2,
              order_id: '1',
              menu_item_id: 4,
              name: 'Pasta Carbonara',
              quantity: 1,
              price: 14.99,
              subtotal: 14.99,
              status: 'pending',
              menu_item: {
                id: 4,
                name: 'Pasta Carbonara',
                price: 14.99
              }
            },
            {
              id: 3,
              order_id: '1',
              menu_item_id: 7,
              name: 'Iced Tea',
              quantity: 1,
              price: 3.99,
              subtotal: 3.99,
              status: 'ready',
              menu_item: {
                id: 7,
                name: 'Iced Tea',
                price: 3.99
              }
            }
          ],
          special_instructions: 'Extra cheese on the pizza please'
        },
        {
          id: '2',
          user_id: 'user2',
          created_at: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
          status: 'pending',
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
              status: 'pending',
              menu_item: {
                id: 8,
                name: 'Grilled Salmon',
                price: 18.99
              }
            },
            {
              id: 5,
              order_id: '2',
              menu_item_id: 5,
              name: 'Garlic Bread',
              quantity: 1,
              price: 5.99,
              subtotal: 5.99,
              status: 'pending',
              menu_item: {
                id: 5,
                name: 'Garlic Bread',
                price: 5.99
              }
            },
            {
              id: 6,
              order_id: '2',
              menu_item_id: 11,
              name: 'Lemonade',
              quantity: 1,
              price: 4.99,
              subtotal: 4.99,
              status: 'pending',
              menu_item: {
                id: 11,
                name: 'Lemonade',
                price: 4.99
              }
            }
          ]
        }
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const updateItemStatus = (orderId: string | number, itemId: number, newStatus: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          const updatedItems = order.items?.map(item => 
            item.id === itemId ? { ...item, status: newStatus } : item
          );
          
          // Check if all items are in the same status to update the order status
          const allItemsStatus = updatedItems?.every(item => item.status === newStatus);
          
          return {
            ...order,
            items: updatedItems,
            status: allItemsStatus ? newStatus : order.status
          };
        }
        return order;
      })
    );
    
    toast.success(`Item status updated to ${newStatus}`);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center h-64">
          <p className="text-xl text-gray-600">Loading kitchen orders...</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Kitchen Dashboard</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">No active orders</h2>
            <p className="text-gray-600">There are no orders to prepare at the moment.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'ready' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="px-6 py-4">
                  {order.special_instructions && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm font-medium text-yellow-800">
                        Special Instructions: {order.special_instructions}
                      </p>
                    </div>
                  )}
                  
                  <h4 className="text-md font-medium text-gray-700 mb-3">Items to Prepare:</h4>
                  
                  <div className="space-y-4">
                    {order.items?.map((item) => (
                      <div 
                        key={item.id}
                        className={`p-4 border rounded-md ${
                          item.status === 'pending' ? 'border-yellow-200 bg-yellow-50' :
                          item.status === 'preparing' ? 'border-blue-200 bg-blue-50' :
                          item.status === 'ready' ? 'border-green-200 bg-green-50' :
                          'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-800">
                              {item.quantity}x {item.name || item.menu_item?.name}
                            </span>
                            <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                              item.status === 'preparing' ? 'bg-blue-200 text-blue-800' :
                              item.status === 'ready' ? 'bg-green-200 text-green-800' :
                              'bg-gray-200 text-gray-800'
                            }`}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="flex space-x-2">
                            {item.status === 'pending' && (
                              <button
                                onClick={() => updateItemStatus(order.id, item.id, 'preparing')}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                              >
                                Start Preparing
                              </button>
                            )}
                            
                            {item.status === 'preparing' && (
                              <button
                                onClick={() => updateItemStatus(order.id, item.id, 'ready')}
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                              >
                                Mark as Ready
                              </button>
                            )}
                            
                            {item.status === 'ready' && (
                              <button
                                onClick={() => updateItemStatus(order.id, item.id, 'delivered')}
                                className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700"
                              >
                                Mark as Delivered
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

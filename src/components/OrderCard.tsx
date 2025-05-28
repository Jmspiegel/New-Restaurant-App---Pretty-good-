import { motion } from 'framer-motion';
import { Order } from '../types';
import { formatDate, formatCurrency } from '../utils/formatters';

interface OrderCardProps {
  order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => {
  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
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
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="px-6 py-4">
        <h4 className="text-md font-medium text-gray-700 mb-3">Order Items:</h4>
        
        <div className="space-y-3 mb-4">
          {order.items?.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center">
                <span className="font-medium text-gray-800">
                  {item.quantity}x
                </span>
                <span className="ml-2 text-gray-800">
                  {item.name || item.menu_item?.name}
                </span>
                {item.status && item.status !== order.status && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                )}
              </div>
              <span className="text-gray-600">
                {formatCurrency(item.subtotal)}
              </span>
            </div>
          ))}
        </div>
        
        {order.special_instructions && (
          <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Special Instructions:</span> {order.special_instructions}
            </p>
          </div>
        )}
        
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="font-medium text-gray-700">Total:</span>
          <span className="font-bold text-gray-900">{formatCurrency(order.total)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderCard;

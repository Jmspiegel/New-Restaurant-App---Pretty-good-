import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiClock, FiCheck } from 'react-icons/fi'
import { Order, OrderItem, OrderItemStatus } from '../types'
import { formatDate, formatTime } from '../utils/formatters'
import { supabase } from '../lib/supabase'
import { toast } from 'react-hot-toast'

interface KitchenOrderCardProps {
  order: Order
  onStatusUpdate: () => void
}

const KitchenOrderCard = ({ order, onStatusUpdate }: KitchenOrderCardProps) => {
  const [isUpdating, setIsUpdating] = useState(false)

  const getItemStatusColor = (status: string) => {
    switch (status as OrderItemStatus) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'preparing':
        return 'bg-blue-100 text-blue-800'
      case 'ready':
        return 'bg-green-100 text-green-800'
      case 'delivered':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const updateItemStatus = async (item: OrderItem, newStatus: OrderItemStatus) => {
    setIsUpdating(true)
    try {
      const { error } = await supabase
        .from('order_items')
        .update({ status: newStatus })
        .eq('id', item.id)

      if (error) throw error

      // Check if all items are ready, then update order status
      if (newStatus === 'ready') {
        const { data: updatedItems } = await supabase
          .from('order_items')
          .select('status')
          .eq('order_id', order.id)

        const allReady = updatedItems?.every(item => item.status === 'ready')
        
        if (allReady) {
          await supabase
            .from('orders')
            .update({ status: 'ready' })
            .eq('id', order.id)
        }
      }

      toast.success(`Item status updated to ${newStatus}`)
      onStatusUpdate()
    } catch (error) {
      console.error('Error updating item status:', error)
      toast.error('Failed to update item status')
    } finally {
      setIsUpdating(false)
    }
  }

  const getNextStatus = (currentStatus: OrderItemStatus): OrderItemStatus => {
    switch (currentStatus) {
      case 'pending':
        return 'preparing'
      case 'preparing':
        return 'ready'
      case 'ready':
        return 'delivered'
      default:
        return currentStatus
    }
  }

  return (
    <motion.div
      className="card overflow-hidden mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="font-semibold text-lg">Order #{order.id}</h3>
            <p className="text-sm text-gray-600 flex items-center">
              <FiClock className="mr-1" />
              {formatTime(order.created_at)} ({formatDate(order.created_at)})
            </p>
          </div>
          
          <div className="text-right">
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
              order.status === 'ready' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            {order.table_number && (
              <p className="text-sm font-medium mt-1">Table #{order.table_number}</p>
            )}
          </div>
        </div>
        
        <div className="border-t border-b border-gray-100 py-3 mb-3">
          <h4 className="font-medium mb-2">Items to Prepare</h4>
          <ul className="space-y-3">
            {order.items?.map((item) => (
              <li key={item.id} className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="bg-gray-100 text-gray-800 w-6 h-6 rounded-full flex items-center justify-center mr-2">
                    {item.quantity}
                  </span>
                  <span>{item.menu_item?.name}</span>
                </div>
                
                <div className="flex items-center">
                  <span className={`text-xs px-2 py-1 rounded-full mr-2 ${getItemStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                  
                  {item.status !== 'delivered' && (
                    <motion.button
                      className="btn-primary rounded-full flex items-center text-xs px-2 py-1"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateItemStatus(item, getNextStatus(item.status as OrderItemStatus))}
                      disabled={isUpdating}
                    >
                      <FiCheck className="mr-1" />
                      {getNextStatus(item.status as OrderItemStatus)}
                    </motion.button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        {order.special_instructions && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm mb-1">Special Instructions:</h4>
            <p className="text-sm text-gray-700">{order.special_instructions}</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default KitchenOrderCard

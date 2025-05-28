import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { MenuItem as MenuItemType } from '../types';
import { useCartStore } from '../stores/cartStore';

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItem = ({ item }: MenuItemProps) => {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    if (!item.available) {
      toast.error('This item is currently unavailable');
      return;
    }
    
    addItem(item);
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md overflow-hidden"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <img 
        src={item.image_url} 
        alt={item.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold">{item.name}</h3>
          <span className="font-bold text-blue-600">${item.price.toFixed(2)}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4">{item.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Prep time: {item.preparation_time} mins</span>
          <button
            onClick={handleAddToCart}
            disabled={!item.available}
            className={`px-4 py-2 rounded ${
              item.available 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {item.available ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItem;

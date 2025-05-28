import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiCheck } from 'react-icons/fi';
import { MenuItem, Category } from '../types';
import { useAuthStore } from '../stores/authStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MenuManagement() {
  const { user, checkSession } = useAuthStore();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<MenuItem> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const init = async () => {
      const session = await checkSession();
      
      if (!session) {
        navigate('/login');
        return;
      }
      
      if (session.role !== 'admin') {
        toast.error('You do not have permission to access this page');
        navigate('/menu');
        return;
      }
      
      // Fetch menu items and categories
      fetchMenuItems();
      fetchCategories();
    };
    
    init();
  }, [checkSession, navigate]);
  
  const fetchMenuItems = async () => {
    setLoading(true);
    
    try {
      // In a real app with Supabase, we would fetch from the database
      // For now, using mock data to ensure consistent display
      
      // Simulated menu items data
      const mockMenuItems: MenuItem[] = [
        {
          id: 1,
          name: 'Margherita Pizza',
          description: 'Classic pizza with tomato sauce, mozzarella, and basil',
          price: 12.99,
          image_url: 'https://images.pexels.com/photos/2619970/pexels-photo-2619970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          category: 'pizza',
          available: true,
          preparation_time: 15
        },
        {
          id: 2,
          name: 'Pepperoni Pizza',
          description: 'Pizza topped with pepperoni slices and cheese',
          price: 14.99,
          image_url: 'https://images.pexels.com/photos/4109111/pexels-photo-4109111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          category: 'pizza',
          available: true,
          preparation_time: 18
        },
        {
          id: 3,
          name: 'Vegetarian Pizza',
          description: 'Pizza with bell peppers, mushrooms, onions, and olives',
          price: 13.99,
          image_url: 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          category: 'pizza',
          available: true,
          preparation_time: 16
        },
        {
          id: 4,
          name: 'Pasta Carbonara',
          description: 'Spaghetti with creamy sauce, bacon, and parmesan',
          price: 14.99,
          image_url: 'https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          category: 'pasta',
          available: true,
          preparation_time: 12
        },
        {
          id: 5,
          name: 'Garlic Bread',
          description: 'Toasted bread with garlic butter and herbs',
          price: 5.99,
          image_url: 'https://images.pexels.com/photos/1252841/pexels-photo-1252841.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          category: 'sides',
          available: true,
          preparation_time: 8
        }
      ];
      
      setMenuItems(mockMenuItems);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    try {
      // Simulated categories data
      const mockCategories: Category[] = [
        { id: '1', name: 'pizza' },
        { id: '2', name: 'pasta' },
        { id: '3', name: 'sides' },
        { id: '4', name: 'drinks' },
        { id: '5', name: 'desserts' }
      ];
      
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  
  const handleAddItem = () => {
    setCurrentItem({
      name: '',
      description: '',
      price: 0,
      image_url: '',
      category: '',
      available: true,
      preparation_time: 10
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };
  
  const handleEditItem = (item: MenuItem) => {
    setCurrentItem({ ...item });
    setIsEditing(true);
    setIsModalOpen(true);
  };
  
  const handleDeleteItem = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        // In a real app, this would be an API call to delete the item
        
        // Update local state
        setMenuItems(prevItems => prevItems.filter(item => item.id !== id));
        toast.success('Item deleted successfully');
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Failed to delete item');
      }
    }
  };
  
  const handleToggleAvailability = async (id: number, available: boolean) => {
    try {
      // In a real app, this would be an API call to update the item
      
      // Update local state
      setMenuItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, available: !available } : item
        )
      );
      
      toast.success(`Item ${available ? 'unavailable' : 'available'} now`);
    } catch (error) {
      console.error('Error updating item availability:', error);
      toast.error('Failed to update item availability');
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (currentItem) {
      if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setCurrentItem({ ...currentItem, [name]: checked });
      } else if (name === 'price' || name === 'preparation_time') {
        setCurrentItem({ ...currentItem, [name]: parseFloat(value) || 0 });
      } else {
        setCurrentItem({ ...currentItem, [name]: value });
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentItem?.name || !currentItem?.description || !currentItem?.price || !currentItem?.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      if (isEditing && currentItem.id) {
        // In a real app, this would be an API call to update the item
        
        // Update local state
        setMenuItems(prevItems => 
          prevItems.map(item => 
            item.id === currentItem.id ? { ...item, ...currentItem as MenuItem } : item
          )
        );
        
        toast.success('Item updated successfully');
      } else {
        // In a real app, this would be an API call to create the item
        
        // Create a new item with a temporary ID
        const newItem: MenuItem = {
          id: Math.max(...menuItems.map(item => item.id)) + 1,
          name: currentItem.name || '',
          description: currentItem.description || '',
          price: currentItem.price || 0,
          image_url: currentItem.image_url || 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          category: currentItem.category || '',
          available: currentItem.available !== undefined ? currentItem.available : true,
          preparation_time: currentItem.preparation_time || 10
        };
        
        // Update local state
        setMenuItems(prevItems => [...prevItems, newItem]);
        
        toast.success('Item added successfully');
      }
      
      // Close the modal
      setIsModalOpen(false);
      setCurrentItem(null);
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Failed to save item');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center h-64">
          <p className="text-xl text-gray-600">Loading menu items...</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Menu Management</h1>
          
          <button
            onClick={handleAddItem}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700"
          >
            <FiPlus className="mr-2" />
            Add New Item
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prep Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {menuItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={item.image_url} 
                            alt={item.name} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.preparation_time} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleAvailability(item.id, item.available)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.available 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {item.available ? 'Available' : 'Unavailable'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <FiEdit2 className="inline" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 className="inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      {/* Modal for adding/editing items */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={currentItem?.name || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={currentItem?.description || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={currentItem?.price || ''}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="preparation_time" className="block text-sm font-medium text-gray-700 mb-1">
                    Preparation Time (minutes) *
                  </label>
                  <input
                    type="number"
                    id="preparation_time"
                    name="preparation_time"
                    value={currentItem?.preparation_time || ''}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={currentItem?.category || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    id="image_url"
                    name="image_url"
                    value={currentItem?.image_url || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="available"
                      name="available"
                      checked={currentItem?.available || false}
                      onChange={(e) => setCurrentItem({ ...currentItem, available: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="available" className="ml-2 block text-sm text-gray-700">
                      Available for ordering
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center"
                >
                  <FiCheck className="mr-2" />
                  {isEditing ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}

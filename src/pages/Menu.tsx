import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MenuItem as MenuItemType } from '../types';
import Navbar from '../components/Navbar';
import MenuItem from '../components/MenuItem';
import Footer from '../components/Footer';

export default function Menu() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItemType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Simulated menu data
  useEffect(() => {
    // In a real app, this would be fetched from an API
    const fetchMenuItems = () => {
      setLoading(true);
      
      // Simulated API response
      const items: MenuItemType[] = [
        {
          id: 1,
          name: 'Margherita Pizza',
          description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
          price: 12.99,
          image_url: 'https://images.pexels.com/photos/2983101/pexels-photo-2983101.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          category: 'main',
          preparation_time: 20,
          available: true
        },
        {
          id: 2,
          name: 'Caesar Salad',
          description: 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan',
          price: 8.99,
          image_url: 'https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          category: 'appetizers',
          preparation_time: 10,
          available: true
        },
        {
          id: 3,
          name: 'Chocolate Lava Cake',
          description: 'Warm chocolate cake with a molten center, served with ice cream',
          price: 8.99,
          image_url: 'https://images.pexels.com/photos/1251198/pexels-photo-1251198.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          category: 'desserts',
          preparation_time: 15,
          available: true
        },
        {
          id: 4,
          name: 'Pasta Carbonara',
          description: 'Creamy pasta with pancetta, egg, and parmesan cheese',
          price: 14.99,
          image_url: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          category: 'main',
          preparation_time: 25,
          available: true
        },
        {
          id: 5,
          name: 'Garlic Bread',
          description: 'Toasted bread with garlic butter and herbs',
          price: 5.99,
          image_url: 'https://images.pexels.com/photos/1252841/pexels-photo-1252841.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          category: 'appetizers',
          preparation_time: 8,
          available: true
        },
        {
          id: 6,
          name: 'Tiramisu',
          description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
          price: 7.99,
          image_url: 'https://images.pexels.com/photos/6341404/pexels-photo-6341404.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          category: 'desserts',
          preparation_time: 0,
          available: true
        },
        {
          id: 7,
          name: 'Iced Tea',
          description: 'Refreshing iced tea with lemon',
          price: 3.99,
          image_url: 'https://images.pexels.com/photos/792613/pexels-photo-792613.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          category: 'drinks',
          preparation_time: 5,
          available: true
        },
        {
          id: 8,
          name: 'Grilled Salmon',
          description: 'Fresh salmon fillet grilled to perfection with lemon and herbs',
          price: 18.99,
          image_url: 'https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          category: 'main',
          preparation_time: 20,
          available: true
        },
        {
          id: 9,
          name: 'Mozzarella Sticks',
          description: 'Breaded and fried mozzarella sticks with marinara sauce',
          price: 7.99,
          image_url: 'https://images.pexels.com/photos/15805386/pexels-photo-15805386/free-photo-of-mozzarella-sticks-on-plate.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          category: 'appetizers',
          preparation_time: 12,
          available: true
        },
        {
          id: 10,
          name: 'Cheesecake',
          description: 'Creamy New York style cheesecake with berry compote',
          price: 8.99,
          image_url: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          category: 'desserts',
          preparation_time: 0,
          available: true
        },
        {
          id: 11,
          name: 'Lemonade',
          description: 'Freshly squeezed lemonade with mint',
          price: 4.99,
          image_url: 'https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          category: 'drinks',
          preparation_time: 5,
          available: true
        },
        {
          id: 12,
          name: 'Beef Burger',
          description: 'Juicy beef patty with cheese, lettuce, tomato, and special sauce',
          price: 13.99,
          image_url: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          category: 'main',
          preparation_time: 15,
          available: true
        }
      ];
      
      setMenuItems(items);
      setLoading(false);
    };
    
    fetchMenuItems();
  }, []);
  
  // Filter items based on category and search query
  useEffect(() => {
    let filtered = [...menuItems];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        item => 
          item.name.toLowerCase().includes(query) || 
          item.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredItems(filtered);
  }, [menuItems, selectedCategory, searchQuery]);
  
  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'appetizers', name: 'Appetizers' },
    { id: 'main', name: 'Main Courses' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'drinks', name: 'Drinks' }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Our Menu</h1>
          <p className="text-gray-600">
            Browse our selection of delicious dishes and drinks. Filter by category or search for your favorites.
          </p>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="md:w-1/3">
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="md:w-2/3 flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Menu Items */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-600">Loading menu items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No items found. Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <MenuItem item={item} />
              </motion.div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Banner() {
  return (
    <div className="relative bg-blue-700 text-white py-12 md:py-24">
      <div className="container mx-auto px-4 z-10 relative">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0 md:w-1/2">
            <motion.h1 
              className="text-3xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Delicious Food, Delivered Fast
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl mb-6 text-blue-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Experience the best cuisine from our kitchen to your table. Fresh ingredients, amazing flavors.
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link 
                to="/menu" 
                className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium"
              >
                View Menu
              </Link>
              <Link 
                to="/orders" 
                className="bg-blue-600 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-medium border border-blue-500"
              >
                Track Order
              </Link>
            </motion.div>
          </div>
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <img 
              src="https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Delicious food" 
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </motion.div>
        </div>
        
        {/* Popular Categories */}
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/menu?category=appetizers" className="bg-blue-600 hover:bg-blue-800 p-4 rounded-lg text-center">
              Appetizers
            </Link>
            <Link to="/menu?category=main" className="bg-blue-600 hover:bg-blue-800 p-4 rounded-lg text-center">
              Main Courses
            </Link>
            <Link to="/menu?category=desserts" className="bg-blue-600 hover:bg-blue-800 p-4 rounded-lg text-center">
              Desserts
            </Link>
            <Link to="/menu?category=drinks" className="bg-blue-600 hover:bg-blue-800 p-4 rounded-lg text-center">
              Drinks
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}></div>
      </div>
    </div>
  );
}

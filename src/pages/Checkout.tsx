import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiCreditCard, FiMapPin, FiInfo } from 'react-icons/fi';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Checkout() {
  const { items, total, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    specialInstructions: '',
    tableNumber: '',
    deliveryOption: 'delivery' // 'delivery' or 'pickup'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }
    
    // Basic validation
    if (!formData.name || !formData.email || 
        (formData.deliveryOption === 'delivery' && (!formData.address || !formData.city || !formData.zipCode)) ||
        !formData.cardNumber || !formData.cardExpiry || !formData.cardCvc) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call to create the order
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const subtotal = total();
  const deliveryFee = formData.deliveryOption === 'delivery' ? 3.99 : 0;
  const tax = subtotal * 0.08;
  const orderTotal = subtotal + deliveryFee + tax;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>
        
        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">You need to add items to your cart before checking out.</p>
            <button 
              onClick={() => navigate('/menu')}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Delivery Options */}
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold mb-4">Delivery Options</h2>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className={`flex-1 p-4 border rounded-lg cursor-pointer ${
                      formData.deliveryOption === 'delivery' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}>
                      <input
                        type="radio"
                        name="deliveryOption"
                        value="delivery"
                        checked={formData.deliveryOption === 'delivery'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                          formData.deliveryOption === 'delivery' ? 'border-blue-500' : 'border-gray-400'
                        }`}>
                          {formData.deliveryOption === 'delivery' && (
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">Delivery</p>
                          <p className="text-sm text-gray-600">Delivered to your address</p>
                        </div>
                      </div>
                    </label>
                    
                    <label className={`flex-1 p-4 border rounded-lg cursor-pointer ${
                      formData.deliveryOption === 'pickup' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}>
                      <input
                        type="radio"
                        name="deliveryOption"
                        value="pickup"
                        checked={formData.deliveryOption === 'pickup'}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                          formData.deliveryOption === 'pickup' ? 'border-blue-500' : 'border-gray-400'
                        }`}>
                          {formData.deliveryOption === 'pickup' && (
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">Pickup</p>
                          <p className="text-sm text-gray-600">Pick up at the restaurant</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
                
                {/* Contact Information */}
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Delivery Address (only shown for delivery) */}
                {formData.deliveryOption === 'delivery' && (
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <FiMapPin className="mr-2" />
                      Delivery Address
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required={formData.deliveryOption === 'delivery'}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required={formData.deliveryOption === 'delivery'}
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                            ZIP Code *
                          </label>
                          <input
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            required={formData.deliveryOption === 'delivery'}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Table Number (only shown for pickup) */}
                {formData.deliveryOption === 'pickup' && (
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold mb-4">Table Information</h2>
                    
                    <div>
                      <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Table Number (optional)
                      </label>
                      <input
                        type="text"
                        id="tableNumber"
                        name="tableNumber"
                        value={formData.tableNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
                
                {/* Payment Information */}
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <FiCreditCard className="mr-2" />
                    Payment Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                          Expiration Date *
                        </label>
                        <input
                          type="text"
                          id="cardExpiry"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700 mb-1">
                          CVC *
                        </label>
                        <input
                          type="text"
                          id="cardCvc"
                          name="cardCvc"
                          value={formData.cardCvc}
                          onChange={handleInputChange}
                          placeholder="123"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Special Instructions */}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <FiInfo className="mr-2" />
                    Additional Information
                  </h2>
                  
                  <div>
                    <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-1">
                      Special Instructions (optional)
                    </label>
                    <textarea
                      id="specialInstructions"
                      name="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Any special requests or delivery instructions..."
                    ></textarea>
                  </div>
                </div>
              </form>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="max-h-60 overflow-y-auto mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between py-2 border-b">
                      <div>
                        <span className="font-medium">{item.quantity}x </span>
                        <span>{item.name}</span>
                      </div>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {formData.deliveryOption === 'delivery' ? 'Delivery Fee' : 'Pickup Fee'}
                    </span>
                    <span>{formData.deliveryOption === 'delivery' ? '$3.99' : 'Free'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${orderTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </motion.button>
                
                <div className="mt-4 text-center text-sm text-gray-500">
                  <p>By placing your order, you agree to our</p>
                  <p>
                    <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                    {' and '}
                    <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

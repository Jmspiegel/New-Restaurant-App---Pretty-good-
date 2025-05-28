import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy-loaded components
const Home = lazy(() => import('./pages/Home'));
const Menu = lazy(() => import('./pages/Menu'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Kitchen = lazy(() => import('./pages/Kitchen'));
const MenuManagement = lazy(() => import('./pages/MenuManagement'));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-xl text-gray-600">Loading...</div>
  </div>
);

function App() {
  const { checkSession } = useAuthStore();
  
  useEffect(() => {
    // Check user session on app load
    checkSession();
  }, [checkSession]);
  
  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/kitchen" element={
            <ProtectedRoute roles={['staff', 'admin']}>
              <Kitchen />
            </ProtectedRoute>
          } />
          <Route path="/admin/menu" element={
            <ProtectedRoute roles={['admin']}>
              <MenuManagement />
            </ProtectedRoute>
          } />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      
      <Toaster position="top-right" />
    </>
  );
}

export default App;

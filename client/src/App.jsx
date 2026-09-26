import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import Home from './pages/Home';
import Reserve from './pages/Reserve';
import Track from './pages/Track';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function RequireAdmin({ children }) {
  const { isAuthed, checking } = useAuth();
  if (checking) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center text-gold">
        <i className="fa-solid fa-utensils fa-spin text-3xl" />
      </div>
    );
  }
  if (!isAuthed) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/reserve" element={<Reserve />} />
              <Route path="/track" element={<Track />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <AdminDashboard />
                  </RequireAdmin>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

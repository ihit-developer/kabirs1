import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/api';
import DashboardTab from '../components/admin/DashboardTab';
import OrdersTab from '../components/admin/OrdersTab';
import MenuTab from '../components/admin/MenuTab';
import CouponsTab from '../components/admin/CouponsTab';
import ReservationsTab from '../components/admin/ReservationsTab';
import LoyaltyTab from '../components/admin/LoyaltyTab';
import AnalyticsTab from '../components/admin/AnalyticsTab';

const TABS = [
  ['dashboard', 'fa-gauge-high', 'Dashboard'],
  ['orders', 'fa-receipt', 'Orders'],
  ['menu', 'fa-utensils', 'Menu Items'],
  ['coupons', 'fa-tag', 'Promo Codes'],
  ['reservations', 'fa-calendar-check', 'Reservations'],
  ['loyalty', 'fa-star', 'Loyalty Points'],
  ['analytics', 'fa-chart-line', 'Analytics'],
];

export default function AdminDashboard() {
  const [tab, setTab] = useState('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCount = () => {
      api.get('/orders/stats').then((s) => setPendingCount(s.pending || 0)).catch(() => {});
    };
    loadCount();
    const id = setInterval(loadCount, 30000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const goTo = (t) => { setTab(t); setMobileNavOpen(false); };

  return (
    <div className="min-h-screen bg-bg text-white flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-bg2 border-r border-white/10 flex flex-col transition-transform duration-300 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 border-b border-white/10">
          <h1 className="font-serif font-bold text-xl">
            <span className="text-gold">Kabir's</span> Admin
          </h1>
          <p className="text-white/40 text-xs mt-1">Signed in as {admin?.name || admin?.username}</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {TABS.map(([key, icon, label]) => (
            <button
              key={key}
              onClick={() => goTo(key)}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                tab === key ? 'bg-gold text-bg' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-3">
                <i className={`fa-solid ${icon} w-4`} /> {label}
              </span>
              {key === 'orders' && pendingCount > 0 && (
                <span
                  className={`text-[11px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 ${
                    tab === key ? 'bg-bg text-gold' : 'bg-gold text-bg'
                  }`}
                >
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-1">
          <a
            href="/"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:bg-white/5 transition"
          >
            <i className="fa-solid fa-arrow-left w-4" /> View Site
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red hover:bg-red/10 transition"
          >
            <i className="fa-solid fa-right-from-bracket w-4" /> Logout
          </button>
        </div>
      </aside>

      {mobileNavOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setMobileNavOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 bg-bg2 sticky top-0 z-20">
          <button onClick={() => setMobileNavOpen(true)} className="text-xl">
            <i className="fa-solid fa-bars" />
          </button>
          <span className="font-semibold flex items-center gap-2">
            {TABS.find((t) => t[0] === tab)?.[2]}
            {tab === 'orders' && pendingCount > 0 && (
              <span className="bg-gold text-bg text-[11px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                {pendingCount}
              </span>
            )}
          </span>
          <span className="w-6" />
        </header>

        <main className="p-4 md:p-8 max-w-7xl mx-auto">
          {tab === 'dashboard' && <DashboardTab onNavigate={goTo} />}
          {tab === 'orders' && <OrdersTab />}
          {tab === 'menu' && <MenuTab />}
          {tab === 'coupons' && <CouponsTab />}
          {tab === 'reservations' && <ReservationsTab />}
          {tab === 'loyalty' && <LoyaltyTab />}
          {tab === 'analytics' && <AnalyticsTab />}
        </main>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';
import { api } from '../../api/api';
import { useToast } from '../../context/ToastContext';

const STAT_CARDS = [
  ['total', 'Total Orders', 'fa-receipt', 'text-white'],
  ['pending', 'Pending', 'fa-hourglass-half', 'text-amber-400'],
  ['preparing', 'Preparing', 'fa-fire-burner', 'text-orange-400'],
  ['delivered', 'Delivered', 'fa-circle-check', 'text-emerald-400'],
  ['cancelled', 'Cancelled', 'fa-circle-xmark', 'text-red'],
];

export default function AnalyticsTab() {
  const [stats, setStats] = useState(null);
  const [sendingReport, setSendingReport] = useState(false);
  const revenueRef = useRef(null);
  const itemsRef = useRef(null);
  const chartsRef = useRef([]);
  const { showToast } = useToast();

  useEffect(() => {
    api.get('/orders/stats').then(setStats).catch(() => showToast('Could not load analytics', 'error'));
  }, [showToast]);

  useEffect(() => {
    if (!stats) return;
    chartsRef.current.forEach((c) => c.destroy());
    chartsRef.current = [];

    if (revenueRef.current) {
      const c1 = new Chart(revenueRef.current, {
        type: 'line',
        data: {
          labels: stats.weeklyChart.map((d) => d._id.slice(5)),
          datasets: [
            {
              label: 'Revenue (Rs.)',
              data: stats.weeklyChart.map((d) => d.revenue),
              borderColor: '#f0c14b',
              backgroundColor: 'rgba(240,193,75,0.15)',
              tension: 0.35,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { labels: { color: '#fff' } } },
          scales: {
            x: { ticks: { color: '#999' }, grid: { color: 'rgba(255,255,255,.05)' } },
            y: { ticks: { color: '#999' }, grid: { color: 'rgba(255,255,255,.05)' } },
          },
        },
      });
      chartsRef.current.push(c1);
    }

    if (itemsRef.current) {
      const c2 = new Chart(itemsRef.current, {
        type: 'bar',
        data: {
          labels: stats.topItems.map((i) => i._id),
          datasets: [
            {
              label: 'Qty Sold',
              data: stats.topItems.map((i) => i.totalQty),
              backgroundColor: '#d4242a',
              borderRadius: 6,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: '#999' }, grid: { color: 'rgba(255,255,255,.05)' } },
            y: { ticks: { color: '#999' }, grid: { display: false } },
          },
        },
      });
      chartsRef.current.push(c2);
    }

    return () => chartsRef.current.forEach((c) => c.destroy());
  }, [stats]);

  const sendReport = async () => {
    setSendingReport(true);
    try {
      await api.get('/orders/daily-report');
      showToast('Daily sales report sent to admin email', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSendingReport(false);
    }
  };

  if (!stats) return <p className="text-white/40">Loading analytics…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-serif text-2xl font-bold">Analytics</h2>
        <button onClick={sendReport} disabled={sendingReport} className="bg-gold text-bg font-bold px-4 py-2 rounded-xl text-sm hover:brightness-110 disabled:opacity-60">
          {sendingReport ? 'Sending…' : '📧 Email Daily Report'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {STAT_CARDS.map(([key, label, icon, color]) => (
          <div key={key} className="bg-bg2 border border-white/10 rounded-2xl p-4 text-center">
            <i className={`fa-solid ${icon} text-xl ${color} mb-2`} />
            <p className="text-2xl font-extrabold">{stats[key] ?? 0}</p>
            <p className="text-white/40 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-gold/10 border border-gold/25 rounded-2xl p-5 mb-8 flex items-center justify-between">
        <div>
          <p className="text-white/50 text-sm">Total Revenue (Delivered Orders)</p>
          <p className="text-3xl font-extrabold text-gold mt-1">Rs. {stats.revenue?.toLocaleString()}</p>
        </div>
        <i className="fa-solid fa-sack-dollar text-4xl text-gold/40" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-bg2 border border-white/10 rounded-2xl p-5">
          <h6 className="font-semibold mb-4">Last 7 Days Revenue</h6>
          <canvas ref={revenueRef} height="220" />
        </div>
        <div className="bg-bg2 border border-white/10 rounded-2xl p-5">
          <h6 className="font-semibold mb-4">Top Selling Items</h6>
          <canvas ref={itemsRef} height="220" />
        </div>
      </div>
    </div>
  );
}

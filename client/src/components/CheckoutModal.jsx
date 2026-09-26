import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { api } from '../api/api';
import { printReceipt } from '../utils/printReceipt';

const PAYMENT_METHODS = [
  ['cod', '💵 Cash on Delivery / Pickup'],
  ['jazzcash', '📱 JazzCash'],
  ['easypaisa', '💚 EasyPaisa'],
  ['bank-transfer', '🏦 Bank Transfer'],
];

const initialForm = {
  branch: 'cantt',
  orderType: 'delivery',
  customerName: '',
  phone: '',
  email: '',
  address: '',
  tableNumber: '',
  pickupTime: '',
  paymentMethod: 'cod',
  senderNumber: '',
  transactionId: '',
  couponInput: '',
};

export default function CheckoutModal({ onClose }) {
  const { cart, total, clearCart } = useCart();
  const { showToast } = useToast();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMsg, setCouponMsg] = useState(null);
  const [couponChecking, setCouponChecking] = useState(false);
  const [loyalty, setLoyalty] = useState(null);
  const [loyaltyRedeem, setLoyaltyRedeem] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const couponDiscount = appliedCoupon?.discount || 0;
  const loyaltyDiscount = loyaltyRedeem && loyalty?.points >= 100 ? Math.floor(loyalty.points / 100) * 50 : 0;
  const finalTotal = Math.max(0, total - couponDiscount - loyaltyDiscount);
  const pointsPreview = Math.floor(finalTotal / 10);

  const checkLoyalty = async () => {
    const phone = form.phone.trim();
    if (phone.length < 10) return;
    try {
      const data = await api.get(`/loyalty/${encodeURIComponent(phone)}`);
      setLoyalty(data);
    } catch (e) {
      /* silent */
    }
  };

  const applyCoupon = async () => {
    const code = form.couponInput.trim().toUpperCase();
    if (!code) return setCouponMsg({ ok: false, text: 'Enter a coupon code first' });
    setCouponChecking(true);
    try {
      const data = await api.post('/coupons/validate', { code, orderTotal: total, branch: form.branch });
      setAppliedCoupon(data.coupon);
      setCouponMsg({ ok: true, text: `Coupon applied! You save Rs.${data.coupon.discount}` });
    } catch (e) {
      setAppliedCoupon(null);
      setCouponMsg({ ok: false, text: e.message });
    } finally {
      setCouponChecking(false);
    }
  };

  const validatePayment = () => {
    const { paymentMethod, senderNumber, transactionId } = form;
    const errs = {};
    if (paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash') {
      if (!senderNumber || senderNumber.trim().length < 10) errs.senderNumber = `Enter your ${paymentMethod === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'} number (e.g. 03xx-xxxxxxx)`;
      if (!transactionId.trim()) errs.transactionId = 'Enter the Transaction ID from your confirmation SMS';
    } else if (paymentMethod === 'bank-transfer') {
      if (!transactionId.trim()) errs.transactionId = 'Enter the Bank Transfer Reference Number';
    }
    if (form.orderType === 'delivery' && !form.address.trim()) errs.address = 'Delivery address required';
    if (!form.customerName.trim()) errs.customerName = 'Name is required';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart.length) return;
    if (!validatePayment()) return;

    let paymentDetails = {};
    if (form.paymentMethod === 'jazzcash' || form.paymentMethod === 'easypaisa') {
      paymentDetails = { senderNumber: form.senderNumber.trim(), transactionId: form.transactionId.trim() };
    } else if (form.paymentMethod === 'bank-transfer') {
      paymentDetails = { transactionId: form.transactionId.trim() };
    }

    const order = {
      customerName: form.customerName,
      phone: form.phone,
      email: form.email,
      address: form.orderType === 'delivery' ? form.address : '',
      paymentMethod: form.paymentMethod,
      paymentDetails,
      orderType: form.orderType,
      branch: form.branch,
      tableNumber: form.orderType === 'dine-in' ? form.tableNumber : '',
      pickupTime: form.orderType === 'takeaway' ? form.pickupTime : '',
      items: cart.map((c) => ({ name: c.name, price: c.price, qty: c.qty })),
      subtotal: total,
      discount: couponDiscount,
      total: finalTotal,
      couponCode: appliedCoupon?.code || '',
      loyaltyRedeem,
    };

    setSubmitting(true);
    try {
      const data = await api.post('/orders', order);
      clearCart();
      setPlacedOrder(data.order);
    } catch (err) {
      showToast(err.message || 'Could not place order — please try again', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (placedOrder) {
    const shortId = String(placedOrder._id).slice(-6).toUpperCase();
    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <div className="absolute inset-0 bg-black/70" onClick={onClose} />
        <div className="relative bg-bg2 rounded-3xl max-w-md w-full p-8 text-center animate-scaleIn shadow-deep">
          <div className="text-6xl mb-3">🎉</div>
          <h2 className="font-serif text-2xl font-bold mb-2">Order Placed!</h2>
          <p className="text-white/60 mb-1">
            We'll contact you on <strong className="text-white">{placedOrder.phone}</strong> shortly.
          </p>
          {placedOrder.loyaltyPointsEarned > 0 && (
            <p className="text-gold text-sm font-semibold mb-4">
              ⭐ You earned {placedOrder.loyaltyPointsEarned} loyalty points!
            </p>
          )}

          <div className="bg-bg3 rounded-xl p-4 my-5">
            <p className="text-white/40 text-xs mb-1">Order ID</p>
            <p className="text-gold font-mono font-bold text-lg">{shortId}</p>
          </div>

          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => printReceipt(placedOrder)}
              className="w-full bg-gold text-bg font-bold py-3 rounded-full hover:brightness-110 transition"
            >
              <i className="fa-solid fa-print mr-2" /> Print Receipt
            </button>
            <Link
              to={`/track?id=${shortId}`}
              onClick={onClose}
              className="w-full border border-white/15 text-white/80 py-3 rounded-full hover:bg-white/5 transition"
            >
              <i className="fa-solid fa-location-dot mr-2" /> Track This Order
            </Link>
            <button onClick={onClose} className="text-white/40 hover:text-white text-sm mt-1">
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="relative bg-bg2 rounded-3xl max-w-4xl w-full my-6 animate-scaleIn shadow-deep">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h3 className="font-semibold text-lg">
            <i className="fa-solid fa-receipt text-gold mr-2" /> Checkout
          </h3>
          <button onClick={onClose} className="text-white/50 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1.4fr_1fr] gap-6 p-5">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold block mb-2">🏪 Branch</label>
              <div className="grid grid-cols-2 gap-2">
                {[['cantt', '🏛️ Cantt'], ['hayatabad', '🌆 Hayatabad']].map(([val, label]) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setForm((f) => ({ ...f, branch: val }))}
                    className={`py-2.5 rounded-xl text-sm font-semibold border transition ${
                      form.branch === val ? 'bg-gold text-bg border-gold' : 'border-white/15 text-white/70 hover:border-gold/40'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold block mb-2">Order Type</label>
              <div className="grid grid-cols-3 gap-2">
                {[['delivery', 'fa-motorcycle', 'Delivery'], ['takeaway', 'fa-bag-shopping', 'Takeaway'], ['dine-in', 'fa-utensils', 'Dine-In']].map(([val, icon, label]) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setForm((f) => ({ ...f, orderType: val }))}
                    className={`py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition ${
                      form.orderType === val ? 'bg-gold text-bg border-gold' : 'border-white/15 text-white/70 hover:border-gold/40'
                    }`}
                  >
                    <i className={`fa-solid ${icon} mr-1`} /> {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold block mb-1.5">Full Name</label>
                <input value={form.customerName} onChange={set('customerName')} placeholder="Your name" className="w-full bg-bg3 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold/50" />
                {errors.customerName && <p className="text-red text-xs mt-1">{errors.customerName}</p>}
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1.5">Phone</label>
                <input value={form.phone} onChange={set('phone')} onBlur={checkLoyalty} placeholder="03xx-xxxxxxx" className="w-full bg-bg3 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold/50" />
                {errors.phone && <p className="text-red text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold block mb-1.5">
                Email <span className="text-white/40 font-normal">(optional)</span>
              </label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" className="w-full bg-bg3 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold/50" />
            </div>

            {form.orderType === 'delivery' && (
              <div>
                <label className="text-sm font-semibold block mb-1.5">Delivery Address</label>
                <textarea value={form.address} onChange={set('address')} rows={2} placeholder="Street, Area, City" className="w-full bg-bg3 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold/50" />
                {errors.address && <p className="text-red text-xs mt-1">{errors.address}</p>}
              </div>
            )}
            {form.orderType === 'takeaway' && (
              <div>
                <label className="text-sm font-semibold block mb-1.5">Pickup Time</label>
                <input type="time" value={form.pickupTime} onChange={set('pickupTime')} className="w-full bg-bg3 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold/50" />
              </div>
            )}
            {form.orderType === 'dine-in' && (
              <div>
                <label className="text-sm font-semibold block mb-1.5">Table Number</label>
                <input value={form.tableNumber} onChange={set('tableNumber')} placeholder="e.g. T5" className="w-full bg-bg3 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold/50" />
              </div>
            )}

            <div>
              <label className="text-sm font-semibold block mb-1.5">Payment Method</label>
              <select value={form.paymentMethod} onChange={set('paymentMethod')} className="w-full bg-bg3 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-gold/50">
                {PAYMENT_METHODS.map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>

            {(form.paymentMethod === 'jazzcash' || form.paymentMethod === 'easypaisa') && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-2">
                <p className="text-xs text-white/60">
                  Send payment to <strong className="text-gold">03295931738</strong> (Kabir's Restaurant)
                </p>
                <input value={form.senderNumber} onChange={set('senderNumber')} placeholder={`Your ${form.paymentMethod === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'} number`} className="w-full bg-bg3 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50" />
                {errors.senderNumber && <p className="text-red text-xs">{errors.senderNumber}</p>}
                <input value={form.transactionId} onChange={set('transactionId')} placeholder="Transaction ID / Reference No." className="w-full bg-bg3 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50" />
                {errors.transactionId && <p className="text-red text-xs">{errors.transactionId}</p>}
              </div>
            )}
            {form.paymentMethod === 'bank-transfer' && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-2 text-xs text-white/60 leading-relaxed">
                <p>Bank: <strong className="text-white">HBL</strong></p>
                <p>Account: <strong className="text-white">0123-4567890-001</strong></p>
                <p>IBAN: <strong className="text-white">PK00HABB0000000123456789</strong></p>
                <p>Name: <strong className="text-white">Kabir's Restaurant</strong></p>
                <input value={form.transactionId} onChange={set('transactionId')} placeholder="Transaction Reference No." className="w-full bg-bg3 border border-white/10 rounded-lg px-3 py-2 text-sm mt-2 focus:outline-none focus:border-gold/50" />
                {errors.transactionId && <p className="text-red text-xs">{errors.transactionId}</p>}
              </div>
            )}

            <div>
              <label className="text-sm font-semibold block mb-1.5">
                🎟️ Promo Code <span className="text-white/40 font-normal">(optional)</span>
              </label>
              <div className="flex gap-2">
                <input
                  value={form.couponInput}
                  onChange={set('couponInput')}
                  placeholder="e.g. KABIR20"
                  className="flex-1 bg-bg3 border border-white/10 rounded-xl px-3 py-2.5 text-sm uppercase tracking-wide focus:outline-none focus:border-gold/50"
                  disabled={!!appliedCoupon}
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={couponChecking || !!appliedCoupon}
                  className="px-4 rounded-xl border border-gold/50 text-gold text-sm font-semibold hover:bg-gold hover:text-bg transition disabled:opacity-50"
                >
                  {appliedCoupon ? '✓ Applied' : couponChecking ? '…' : 'Apply'}
                </button>
              </div>
              {couponMsg && (
                <p className={`text-xs mt-1.5 ${couponMsg.ok ? 'text-emerald-400' : 'text-red'}`}>
                  {couponMsg.ok ? '✅ ' : '❌ '} {couponMsg.text}
                </p>
              )}
            </div>

            {loyalty?.points > 0 && (
              <div className="bg-gold/10 border border-gold/25 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <p className="text-gold text-sm font-bold">⭐ Loyalty Points: {loyalty.points}</p>
                  <p className="text-white/40 text-xs mt-1">100 points = Rs.50 discount</p>
                </div>
                {loyalty.points >= 100 && (
                  <label className="flex items-center gap-2 text-xs font-semibold text-gold cursor-pointer">
                    <input type="checkbox" checked={loyaltyRedeem} onChange={(e) => setLoyaltyRedeem(e.target.checked)} className="accent-gold w-4 h-4" />
                    Redeem
                  </label>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gold text-bg font-bold py-3.5 rounded-xl hover:brightness-110 transition disabled:opacity-60"
            >
              {submitting ? (
                <><i className="fa-solid fa-spinner fa-spin mr-2" /> Placing Order…</>
              ) : (
                <><i className="fa-solid fa-check mr-2" /> Place Order</>
              )}
            </button>
          </div>

          <div className="bg-bg3 rounded-2xl p-5 h-fit">
            <h6 className="text-gold font-semibold mb-3">
              <i className="fa-solid fa-receipt mr-2" /> Order Summary
            </h6>
            <div className="space-y-2 mb-3 max-h-48 overflow-y-auto pr-1">
              {cart.map((i) => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span className="text-white/70">{i.name} ×{i.qty}</span>
                  <span className="text-gold font-semibold">Rs. {i.price * i.qty}</span>
                </div>
              ))}
            </div>

            {couponDiscount > 0 && (
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-white/50">🎟️ Coupon Discount</span>
                <span className="text-emerald-400 font-semibold">- Rs.{couponDiscount.toLocaleString()}</span>
              </div>
            )}
            {loyaltyDiscount > 0 && (
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-white/50">⭐ Loyalty Discount</span>
                <span className="text-gold font-semibold">- Rs.{loyaltyDiscount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between items-center border-t border-white/10 pt-3 mt-2">
              <span className="font-bold">Total</span>
              <span className="text-gold font-extrabold text-lg">Rs. {finalTotal.toLocaleString()}</span>
            </div>
            <p className="text-white/30 text-xs text-right mt-2">
              You'll earn {pointsPreview} loyalty points with this order
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { api } from '../api/api';

const FALLBACK_REVIEWS = [
  { customerName: 'Ahmed Khan', rating: 5, comment: "Best BBQ in Peshawar! The Malai Boti is absolutely amazing and the delivery was super fast.", branch: 'Cantt, Peshawar' },
  { customerName: 'Sara Ali', rating: 4.5, comment: 'Their Zinger Burger and Fries combo is my go-to order every weekend. Highly recommended!', branch: 'University Town, Peshawar' },
  { customerName: 'Bilal Ahmed', rating: 5, comment: 'Excellent quality and taste. The Chicken Chow Mein tastes just like restaurant style. Will order again!', branch: 'Hayatabad, Peshawar' },
];

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="text-gold mb-3">
      {'★'.repeat(full)}
      {half && '⯪'}
      {'☆'.repeat(5 - full - (half ? 1 : 0))}
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState(FALLBACK_REVIEWS);

  useEffect(() => {
    api
      .get('/reviews')
      .then((data) => {
        if (data?.reviews?.length) {
          setReviews(
            data.reviews.slice(0, 9).map((r) => ({
              customerName: r.customerName,
              rating: r.rating,
              comment: r.comment || `Loved the ${r.menuItemName}!`,
              branch: r.branch === 'hayatabad' ? 'Hayatabad, Peshawar' : 'Cantt, Peshawar',
            })),
          );
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="reviews" className="section-pad">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-gold text-xs font-bold uppercase tracking-widest">Testimonials</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2">
            Customer <span className="text-gold">Reviews</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((r, i) => (
            <div key={i} className="bg-bg3 border border-white/5 rounded-2xl p-6 text-center card-hover">
              <Stars rating={r.rating} />
              <p className="text-white/70 italic text-sm mb-4">"{r.comment}"</p>
              <h5 className="text-gold font-semibold">{r.customerName}</h5>
              <p className="text-white/40 text-xs mt-1">{r.branch}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

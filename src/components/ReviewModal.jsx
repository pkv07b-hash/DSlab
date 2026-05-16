import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Modals.css';

const ReviewModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('aura_reviews');
    return saved ? JSON.parse(saved) : [
      { id: 1, author: 'Alex M.', rating: 5, text: 'This app completely transformed my morning routine!' },
      { id: 2, author: 'Sarah K.', rating: 4, text: 'Love the premium features and the AI coaching is surprisingly good.' },
      { id: 3, author: 'Michael R.', rating: 5, text: '' },
      { id: 4, author: 'Priya D.', rating: 5, text: 'The focus mode is a game changer for my study sessions.' },
      { id: 5, author: 'John Doe', rating: 4, text: 'Simple and effective.' },
      { id: 6, author: 'Emily W.', rating: 5, text: '' },
      { id: 7, author: 'Chris T.', rating: 5, text: 'Finally a wellness app that feels professional.' },
      { id: 8, author: 'Jessica L.', rating: 4, text: 'Great UI/UX.' },
      { id: 9, author: 'David B.', rating: 5, text: 'Highly recommended!' },
      { id: 10, author: 'Nisha P.', rating: 4, text: '' }
    ];
  });
  
  const [rating, setRating] = useState(0); 
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    localStorage.setItem('aura_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const averageRating = (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1);
  const totalReviews = reviews.length;

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;

    const newReview = {
      id: Date.now(),
      author: user?.name || 'Guest User',
      rating,
      text: comment.trim() // Can be empty now
    };

    setReviews([newReview, ...reviews]);
    setComment('');
    setRating(0);
  };

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="modal-content"
          style={{ maxWidth: '1000px', minHeight: '85vh' }}
          onClick={e => e.stopPropagation()}
        >
          <button className="modal-close" onClick={onClose}>
            <X size={32} />
          </button>
          
          <h2 className="modal-title" style={{ fontSize: '32px', marginBottom: '20px' }}>
            <MessageSquare size={32} className="text-primary" />
            Website Experience & Reviews
          </h2>

          <div className="rating-summary" style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.03)', padding: '20px 32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '40px' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#fbbf24' }}>{averageRating}</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3, 4, 5].map((s) => {
                  const fillAmount = Math.max(0, Math.min(1, averageRating - (s - 1))) * 100;
                  const gradId = `grad-${s}-${fillAmount}`;
                  return (
                    <div key={s} style={{ position: 'relative', width: 24, height: 24 }}>
                      <Star size={24} color="#fbbf2430" style={{ position: 'absolute' }} />
                      <div style={{ width: `${fillAmount}%`, overflow: 'hidden', position: 'absolute' }}>
                        <Star size={24} color="#fbbf24" fill="#fbbf24" />
                      </div>
                    </div>
                  );
                })}
              </div>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>Based on {totalReviews} user reviews</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '48px' }}>
            <div>
              <h3 style={{ marginBottom: '20px', color: 'var(--text-main)' }}>Share Your Feedback</h3>
              <form onSubmit={handleSubmit} className="review-form" style={{ background: 'rgba(255,255,255,0.02)', padding: '32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-muted)', fontSize: '16px' }}>Rate your experience (required)</label>
                  <div className="star-rating" style={{ gap: '12px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${(hoverRating || rating) >= star ? 'active' : ''}`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{ transform: (hoverRating || rating) >= star ? 'scale(1.2)' : 'scale(1)', transition: 'transform 0.2s' }}
                      >
                        <Star fill={(hoverRating || rating) >= star ? 'currentColor' : 'none'} size={36} />
                      </button>
                    ))}
                  </div>
                </div>
                
                <textarea 
                  className="review-input"
                  placeholder="Optional: Tell us what you like or how we can improve..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{ minHeight: '150px', fontSize: '16px', padding: '16px' }}
                />
                
                <button 
                  type="submit" 
                  className="btn-submit-review"
                  style={{ padding: '16px 40px', fontSize: '18px', marginTop: '16px' }}
                  disabled={rating === 0}
                >
                  Post Review
                </button>
              </form>
            </div>

            <div className="reviews-column">
              <h3 style={{ marginBottom: '20px', color: 'var(--text-main)' }}>Community Feedbacks</h3>
              <div className="reviews-list" style={{ maxHeight: '550px', overflowY: 'auto', paddingRight: '10px' }}>
                {reviews.map((review) => (
                  <div key={review.id} className="review-item" style={{ padding: '20px', marginBottom: '16px' }}>
                    <div className="review-header" style={{ marginBottom: '8px' }}>
                      <span className="review-author" style={{ fontSize: '16px', fontWeight: 600 }}>{review.author}</span>
                      <div className="review-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} color={i < review.rating ? '#fbbf24' : 'var(--text-dim)'} />
                        ))}
                      </div>
                    </div>
                    {review.text && <p className="review-text" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{review.text}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReviewModal;

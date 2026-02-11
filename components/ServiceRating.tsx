import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { useLanguage } from '../context/LanguageContext';

const ServiceRating: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [average, setAverage] = useState(5);
  const [total, setTotal] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchRating = async () => {
      const docRef = doc(db, 'analytics', 'ratings');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAverage(data.average || 5);
        setTotal(data.count || 0);
      }
    };
    fetchRating();
    
    // Simple local check to prevent spamming
    if (localStorage.getItem('hasRated')) {
      setHasRated(true);
    }
  }, []);

  const handleRating = async (value: number) => {
    if (hasRated) return;

    setRating(value);
    setHasRated(true);
    localStorage.setItem('hasRated', 'true');

    // Update Firestore
    const ref = doc(db, 'analytics', 'ratings');
    const snap = await getDoc(ref);
    
    if (snap.exists()) {
      const data = snap.data();
      const newCount = (data.count || 0) + 1;
      const newTotal = (data.totalStars || 0) + value;
      await updateDoc(ref, {
        count: increment(1),
        totalStars: increment(value),
        average: newTotal / newCount
      });
      setTotal(newCount);
      setAverage(newTotal / newCount);
    } else {
      await setDoc(ref, {
        count: 1,
        totalStars: value,
        average: value
      });
      setTotal(1);
      setAverage(value);
    }
  };

  return (
    <div className="bg-navy-800/50 rounded-2xl p-8 border border-white/5 text-center backdrop-blur-sm">
      <h3 className="text-xl font-bold text-white mb-2">
        {language === 'ar' ? 'تقييم الخدمات' : 'Rate Services'}
      </h3>
      <div className="flex justify-center items-center gap-1 mb-4">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <button
              key={index}
              type="button"
              className={`transition-colors ${hasRated ? 'cursor-default' : 'cursor-pointer'}`}
              onClick={() => handleRating(ratingValue)}
              onMouseEnter={() => !hasRated && setHover(ratingValue)}
              onMouseLeave={() => !hasRated && setHover(0)}
            >
              <Star
                size={32}
                className={`${
                  ratingValue <= (hover || rating || Math.round(average))
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-600'
                }`}
              />
            </button>
          );
        })}
      </div>
      <div className="text-gray-400 text-sm">
        <span className="text-white font-bold text-lg">{average.toFixed(1)}</span>/5 
        <span className="mx-2">•</span>
        {total} {language === 'ar' ? 'تقييم' : 'Ratings'}
      </div>
      {hasRated && (
        <p className="text-green-400 text-sm mt-2 animate-pulse">
          {language === 'ar' ? 'شكراً لتقييمك!' : 'Thanks for rating!'}
        </p>
      )}
    </div>
  );
};

export default ServiceRating;
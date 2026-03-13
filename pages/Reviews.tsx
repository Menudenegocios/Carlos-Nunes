
import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Review } from '../types';
import { Star, ThumbsUp } from 'lucide-react';

export const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const { data, error } = await supabase.from('reviews').select('*');
      if (data) {
        setReviews(data as any);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Avaliações</h1>
            <p className="text-gray-500">Média geral: <span className="text-yellow-600 font-bold">4.9 / 5.0</span></p>
          </div>
          <div className="text-right">
             <span className="block text-3xl font-bold text-indigo-600">{reviews.length}</span>
             <span className="text-xs text-gray-500 uppercase tracking-wide">Total de avaliações</span>
          </div>
       </div>

       <div className="grid gap-4">
          {reviews.map(review => (
            <div key={review.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
               <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                     <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                        {review.author.charAt(0)}
                     </div>
                     <div>
                        <h3 className="font-bold text-gray-900">{review.author}</h3>
                        <span className="text-xs text-gray-400">{review.date}</span>
                     </div>
                  </div>
                  <div className="flex text-yellow-400">
                     {Array.from({length: 5}).map((_, i) => (
                       <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                     ))}
                  </div>
               </div>
               
               <p className="text-gray-700 mb-4">{review.comment}</p>
               
               {review.reply ? (
                 <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-500">
                    <p className="text-xs font-bold text-indigo-600 mb-1">Sua resposta:</p>
                    <p className="text-sm text-gray-600">{review.reply}</p>
                 </div>
               ) : (
                 <button className="text-indigo-600 text-sm font-bold hover:underline">Responder avaliação</button>
               )}
            </div>
          ))}
       </div>
    </div>
  );
};

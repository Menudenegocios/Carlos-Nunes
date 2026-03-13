
import React, { useEffect, useState } from 'react';
import { supabaseService } from '../services/supabaseService';
import { Quote } from '../types';
import { MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';

export const Quotes: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await supabaseService.getQuotes();
        setQuotes(data);
      } catch (error) {
        console.error('Error loading quotes:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="p-8 text-center">Carregando orçamentos...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Orçamentos Recebidos</h1>
      </div>

      <div className="grid gap-4">
        {quotes.map(quote => (
          <div key={quote.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="font-bold text-lg text-gray-900">{quote.client_name}</h3>
                  <p className="text-sm text-gray-500">Interesse: {quote.service_interest}</p>
               </div>
               <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                 quote.status === 'pendente' ? 'bg-yellow-100 text-yellow-700' : 
                 quote.status === 'respondido' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
               }`}>
                 {quote.status}
               </span>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm text-gray-700">
               "{quote.message}"
            </div>
            
            <div className="flex justify-between items-center text-sm text-gray-500 border-t border-gray-100 pt-4">
               <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {quote.date}</span>
               
               <div className="flex gap-2">
                 <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                   <MessageSquare className="w-4 h-4" /> Responder
                 </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

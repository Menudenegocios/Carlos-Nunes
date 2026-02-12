
import React, { useEffect, useState } from 'react';
import { mockBackend } from '../services/mockBackend';
import { LoyaltyCard } from '../types';
import { Check, Gift } from 'lucide-react';

export const Loyalty: React.FC = () => {
  const [cards, setCards] = useState<LoyaltyCard[]>([]);

  useEffect(() => {
    const loadCards = async () => {
      const data = await mockBackend.getLoyaltyCards();
      setCards(data);
    };
    loadCards();
  }, []);

  const handleStamp = async (id: string) => {
    const updated = await mockBackend.stampLoyaltyCard(id);
    setCards(prev => prev.map(c => c.id === id ? updated : c));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Meus Cartões Fidelidade</h1>
        <p className="text-gray-500 mt-2">Complete os carimbos para ganhar recompensas nos seus lugares favoritos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map(card => {
          const isComplete = card.currentStamps >= card.totalStamps;
          
          return (
            <div key={card.id} className={`${card.color} rounded-2xl p-6 text-white shadow-lg relative overflow-hidden`}>
               <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
               
               <div className="relative z-10">
                 <h2 className="text-2xl font-bold mb-1">{card.businessName}</h2>
                 <p className="text-white/80 text-sm mb-6 flex items-center gap-2">
                   <Gift className="w-4 h-4" /> Prêmio: {card.reward}
                 </p>

                 <div className="grid grid-cols-5 gap-3 mb-6">
                    {Array.from({ length: card.totalStamps }).map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`aspect-square rounded-full flex items-center justify-center border-2 border-white/30 ${
                          idx < card.currentStamps ? 'bg-white text-gray-900' : 'bg-transparent'
                        }`}
                      >
                        {idx < card.currentStamps && <Check className="w-5 h-5 font-bold" />}
                      </div>
                    ))}
                 </div>

                 <div className="flex justify-between items-center">
                   <span className="font-mono text-sm opacity-70">{card.currentStamps} / {card.totalStamps} carimbos</span>
                   {isComplete ? (
                     <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold shadow hover:bg-gray-100">
                       Resgatar Prêmio
                     </button>
                   ) : (
                     <button 
                       onClick={() => handleStamp(card.id)}
                       className="bg-black/20 hover:bg-black/40 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                     >
                       + Simular Carimbo
                     </button>
                   )}
                 </div>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

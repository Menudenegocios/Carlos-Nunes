
import React, { useState } from 'react';
import { Offer } from '../types';
import { MapPin, Instagram, MessageCircle, Globe, ExternalLink, Play, Image as ImageIcon, Star, ArrowRight, Store } from 'lucide-react';

interface OfferCardProps {
  offer: Offer;
  onClick?: () => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer, onClick }) => {
  const [showVideo, setShowVideo] = useState(false);

  const getEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const embedUrl = offer.videoUrl ? getEmbedUrl(offer.videoUrl) : null;

  return (
    <div 
      onClick={onClick}
      className={`group relative bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-sm transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] dark:hover:shadow-none hover:-translate-y-2 flex flex-col h-[520px] ${onClick ? 'cursor-pointer' : ''}`}
    >
      
      {/* 1. IMAGE/VIDEO AREA */}
      <div className="relative h-[280px] w-full overflow-hidden bg-gray-50 dark:bg-zinc-800">
        {showVideo && embedUrl ? (
          <iframe 
            src={embedUrl} 
            title={offer.title}
            className="w-full h-full"
            frameBorder="0" 
            allowFullScreen
          ></iframe>
        ) : (
          <img 
            src={offer.imageUrl || `https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=800`} 
            alt={offer.title} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        )}
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent"></div>
        
        <div className="absolute top-5 left-5 right-5 flex justify-between items-center z-10">
           <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/40 dark:border-white/10 shadow-sm">
              <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">{offer.category}</span>
           </div>
           {offer.videoUrl && (
             <button 
               onClick={(e) => { e.stopPropagation(); setShowVideo(!showVideo); }}
               className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center shadow-lg text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-transform"
             >
                {showVideo ? <ImageIcon className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
             </button>
           )}
        </div>

        {/* Business Logo Overlay */}
        <div className="absolute -bottom-4 right-8 w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 p-1 border border-gray-100 dark:border-zinc-800 shadow-xl z-20 overflow-hidden transform rotate-3 group-hover:rotate-0 transition-transform flex items-center justify-center">
           <Store className="w-8 h-8 text-indigo-600 dark:text-brand-primary" />
        </div>
      </div>

      {/* 2. CONTENT AREA */}
      <div className="p-8 flex-1 flex flex-col pt-10">
        <div className="flex items-center gap-2 mb-3">
           <Star className="w-3 h-3 text-yellow-500 fill-current" />
           <span className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Verificado</span>
        </div>

        <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-[1.1] mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
          {offer.title}
        </h3>
        
        <p className="text-gray-500 dark:text-zinc-400 text-sm font-medium leading-relaxed line-clamp-2 mb-8">
          {offer.description}
        </p>

        <div className="mt-auto pt-6 border-t border-gray-50 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400 dark:text-zinc-500">
             <MapPin className="w-4 h-4" />
             <span className="text-xs font-bold uppercase tracking-tight truncate max-w-[100px]">{offer.city}</span>
          </div>

          <div className="flex items-center gap-2">
             {offer.socialLinks?.whatsapp && (
               <a 
                href={`https://wa.me/${offer.socialLinks.whatsapp}`} 
                target="_blank" 
                onClick={(e) => e.stopPropagation()}
                className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
               >
                 <MessageCircle className="w-5 h-5" />
               </a>
             )}
             <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-sm">
                <ArrowRight className="w-5 h-5" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

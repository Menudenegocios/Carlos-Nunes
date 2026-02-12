
import React, { useState } from 'react';
import { Offer } from '../types';
import { MapPin, Instagram, MessageCircle, Globe, ExternalLink, Play, Image as ImageIcon } from 'lucide-react';

interface OfferCardProps {
  offer: Offer;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  const [showVideo, setShowVideo] = useState(false);

  // Default gradients if no image provided
  const getGradient = (cat: string) => {
    switch (cat) {
      case 'Gastronomia': return 'from-orange-500 to-red-600';
      case 'Serviço': return 'from-blue-500 to-indigo-600';
      case 'Produto': return 'from-emerald-500 to-teal-600';
      case 'Cursos e Mentorias': return 'from-violet-600 to-fuchsia-600';
      case 'Evento': return 'from-purple-500 to-pink-600';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const defaultLogo = `https://api.dicebear.com/7.x/initials/svg?seed=${offer.title.substring(0, 2)}`;

  // Helper to get YouTube Embed URL
  const getEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const embedUrl = offer.videoUrl ? getEmbedUrl(offer.videoUrl) : null;

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-[450px] flex flex-col">
      
      {/* 1. HERO IMAGE / VIDEO */}
      <div className="relative h-3/5 w-full overflow-hidden bg-gray-100">
        {showVideo && embedUrl ? (
          <iframe 
            src={embedUrl} 
            title={offer.title}
            className="w-full h-full"
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        ) : offer.imageUrl ? (
          <img 
            src={offer.imageUrl} 
            alt={offer.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${getGradient(offer.category)} flex items-center justify-center`}>
            <span className="text-white text-4xl font-bold opacity-20 text-center px-4">{offer.category}</span>
          </div>
        )}
        
        {/* Cinematic Gradient Overlay (Only if not showing video) */}
        {!showVideo && (
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
        
        {/* Toggle Video/Image Button */}
        {offer.videoUrl && embedUrl && (
          <button 
            onClick={() => setShowVideo(!showVideo)}
            className="absolute bottom-4 right-4 z-20 bg-white/90 backdrop-blur-md text-gray-800 p-2 rounded-full hover:bg-white transition-colors shadow-lg"
            title={showVideo ? "Ver Imagem" : "Ver Vídeo"}
          >
            {showVideo ? <ImageIcon className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
          </button>
        )}

        {/* Category Tag */}
        <div className="absolute top-4 right-4 z-10 pointer-events-none">
           <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-xs font-bold text-gray-800 uppercase tracking-wider rounded-full shadow-sm">
            {offer.category}
          </span>
        </div>

        {/* 2. LOGO/AVATAR (Instagram Style) */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <div className="relative">
            <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 shadow-lg">
               <img 
                src={offer.logoUrl || defaultLogo} 
                alt="Logo" 
                className="w-full h-full rounded-full border-2 border-white bg-white object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. CONTENT & ACTIONS */}
      <div className="relative flex-1 p-5 flex flex-col justify-between bg-white">
        
        {/* Text Content */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold leading-tight line-clamp-2 text-gray-900 group-hover:text-indigo-600 transition-colors">
              {offer.title}
            </h3>
            {offer.price && (
              <span className="ml-2 text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                {offer.price}
              </span>
            )}
          </div>
          
          <p className="text-gray-500 text-sm line-clamp-3 mb-4 leading-relaxed">
            {offer.description}
          </p>
        </div>

        {/* Footer: Location & Social Actions */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
          <div className="flex items-center text-xs text-gray-400 gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate max-w-[100px]">{offer.city}</span>
          </div>

          <div className="flex items-center gap-3">
             {offer.socialLinks?.instagram && (
              <a 
                href={`https://instagram.com/${offer.socialLinks.instagram}`} 
                target="_blank" 
                rel="noreferrer" 
                title="Instagram"
                className="text-gray-400 hover:text-pink-600 transition-colors p-1.5 hover:bg-pink-50 rounded-full"
              >
                <Instagram className="w-5 h-5" />
              </a>
             )}
             
             {offer.socialLinks?.whatsapp && (
              <a 
                href={`https://wa.me/${offer.socialLinks.whatsapp}`} 
                target="_blank" 
                rel="noreferrer" 
                title="WhatsApp"
                className="text-gray-400 hover:text-green-600 transition-colors p-1.5 hover:bg-green-50 rounded-full"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
             )}

             {offer.socialLinks?.website && (
              <a 
                href={offer.socialLinks.website} 
                target="_blank" 
                rel="noreferrer" 
                title="Website"
                className="text-gray-400 hover:text-blue-600 transition-colors p-1.5 hover:bg-blue-50 rounded-full"
              >
                <Globe className="w-5 h-5" />
              </a>
             )}
             
             {!offer.socialLinks?.instagram && !offer.socialLinks?.whatsapp && !offer.socialLinks?.website && (
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <ExternalLink className="w-5 h-5" />
                </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { Profile, Product, BioLink, BioShowcaseItem } from '../types';
import { 
  Zap, Calendar, Star, QrCode, Instagram, MessageCircle, 
  Globe, Smartphone, ArrowLeft, Image as ImageIcon, MapPin
} from 'lucide-react';

export const BioView: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) loadBioData();
  }, [userId]);

  const loadBioData = async () => {
    try {
      const prof = await supabaseService.getProfile(userId!);
      setProfile(prof);
    } catch (error) {
      console.error('Error loading bio data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white/50 font-black uppercase text-xs tracking-widest">Carregando Bio Pro...</div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center">Perfil não encontrado.</div>;

  const bio = profile.bioConfig;
  const colors = bio?.customColors || { background: '#064e3b', button: '#059669', text: '#ffffff' };
  const links = bio?.links?.filter(l => l.active) || [];
  const showcaseItems = bio?.showcase?.items || [];

  return (
    <div 
      className={`min-h-screen w-full flex flex-col items-center pt-16 pb-20 px-6 transition-all duration-500 overflow-x-hidden ${bio?.fontFamily || 'font-sans'}`}
      style={{ 
        backgroundColor: colors.background || '#064e3b', 
        color: colors.text || '#ffffff',
        backgroundImage: bio?.meshGradient ? `radial-gradient(at 0% 0%, ${colors.button}66 0px, transparent 50%), radial-gradient(at 100% 0%, ${colors.button}33 0px, transparent 50%), radial-gradient(at 50% 100%, ${colors.button}44 0px, transparent 50%)` : 'none'
      }}
    >
        <div className="w-24 h-24 rounded-full border-4 border-white/20 shadow-2xl overflow-hidden mb-6 flex-shrink-0 bg-white/10 flex items-center justify-center">
          {profile.logoUrl ? (
            <img src={profile.logoUrl} className="w-full h-full object-cover" alt="Me" />
          ) : (
            <Smartphone className="w-12 h-12 opacity-20" />
          )}
        </div>
        
        <h1 className="font-black text-2xl text-center leading-tight mb-2 uppercase italic tracking-tighter">{profile.businessName}</h1>
        <p className="text-sm opacity-80 text-center font-medium max-w-xs mb-10 leading-relaxed">{profile.bio}</p>

        {profile.storeConfig?.schedulingEnabled && (
           <div 
             className="w-full max-w-sm py-5 px-6 rounded-3xl text-center font-black text-xs shadow-2xl mb-6 border border-white/10 animate-pulse flex items-center justify-center gap-3"
             style={{ backgroundColor: colors.text, color: colors.background }}
           >
              <Calendar className="w-4 h-4" /> AGENDAR CONSULTA AGORA
           </div>
        )}

        <div className="w-full max-w-sm space-y-4 mb-12">
          {links.map(link => (
            <a 
              key={link.id} 
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-5 px-6 rounded-3xl text-center font-black text-sm shadow-xl transform transition-all active:scale-95 hover:brightness-110"
              style={{ backgroundColor: colors.button, color: colors.text }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {bio?.showcase?.enabled && showcaseItems.length > 0 && (
            <div className="w-full max-w-sm mb-12">
                <p className="text-[11px] font-black text-white mb-6 text-center border-b border-white/20 pb-2 w-fit mx-auto uppercase tracking-widest">{bio.showcase.title || 'Destaques'}</p>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x px-2 pb-4">
                    {showcaseItems.map(item => (
                        <a key={item.id} 
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="min-w-[280px] rounded-[2.5rem] border-2 flex-shrink-0 snap-center overflow-hidden flex p-4 gap-4 shadow-2xl transition-transform hover:scale-105"
                            style={{ backgroundColor: colors.button + '33', borderColor: colors.button + '66' }}
                        >
                             <div className="w-24 h-24 rounded-[1.8rem] bg-white/10 flex-shrink-0 overflow-hidden border border-white/10">
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-white/10"><ImageIcon className="w-8 h-8" /></div>
                                )}
                             </div>
                             <div className="flex-1 flex flex-col justify-center text-left">
                                 <h5 className="text-xs font-black text-white uppercase italic leading-tight mb-2 line-clamp-2">{item.name}</h5>
                                 <div className="flex items-center justify-between">
                                    <span className="text-sm font-black" style={{ color: colors.text }}>R$ {item.price.toFixed(2)}</span>
                                    <button className="bg-white/20 p-2 rounded-xl"><ArrowLeft className="w-4 h-4 rotate-180" /></button>
                                 </div>
                             </div>
                        </a>
                    ))}
                </div>
            </div>
        )}

        {bio?.socialProof && bio.socialProof.length > 0 && (
          <div className="w-full max-w-sm space-y-4 mb-12">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 text-center">Experiência dos Clientes</p>
            {bio.socialProof.map(proof => (
              <div key={proof.id} className="bg-white/10 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/5 shadow-xl">
                <div className="flex text-yellow-400 gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <p className="text-xs font-medium leading-relaxed opacity-90 italic">"{proof.text}"</p>
                <p className="text-[10px] font-black mt-3 uppercase tracking-widest">— {proof.author}</p>
              </div>
            ))}
          </div>
        )}

        {bio?.shareCard?.enabled && (
            <div className="w-full max-w-sm mt-8 p-8 rounded-[3rem] border border-white/10 text-center space-y-6 shadow-2xl"
                style={{ backgroundColor: colors.button + '44' }}
            >
                 <p className="text-xs font-black text-white uppercase italic tracking-tighter border-b border-white/10 pb-3">Compartilhar Cartão</p>
                 <div className="w-16 h-16 rounded-full border-2 border-white mx-auto overflow-hidden shadow-lg">
                    {profile.logoUrl && <img src={profile.logoUrl} className="w-full h-full object-cover" />}
                 </div>
                 <div className="p-4 bg-white rounded-[2rem] w-48 h-48 mx-auto shadow-2xl">
                    <QrCode className="w-full h-full text-black" />
                 </div>
                 <button className="text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">Salvar Código QR</button>
            </div>
        )}

        <div className="mt-20 flex items-center gap-2 opacity-30 group cursor-default">
           <Zap className="w-4 h-4 fill-current text-indigo-400" />
           <span className="text-[9px] font-black uppercase tracking-[0.5em]">Menu de Negócios Pro</span>
        </div>
    </div>
  );
};

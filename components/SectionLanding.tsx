
import React from 'react';
import { Play, CheckCircle, ArrowRight, X } from 'lucide-react';

interface SectionLandingProps {
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  youtubeId?: string;
  summaryText?: string;
  ctaLabel: string;
  onStart: () => void;
  icon: React.ElementType;
  accentColor?: string;
}

export const SectionLanding: React.FC<SectionLandingProps> = ({
  title,
  subtitle,
  description,
  benefits,
  youtubeId,
  summaryText,
  ctaLabel,
  onStart,
  icon: Icon,
  accentColor = "indigo"
}) => {
  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-600 text-indigo-600 border-indigo-600",
    emerald: "bg-emerald-600 text-emerald-600 border-emerald-600",
    brand: "bg-brand-primary text-brand-primary border-brand-primary",
    rose: "bg-rose-600 text-rose-600 border-rose-600",
    purple: "bg-purple-600 text-purple-600 border-purple-600"
  };

  const currentColors = colorMap[accentColor] || colorMap.indigo;
  const [bgClass, textClass, borderClass] = currentColors.split(' ');

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Header Centralizado */}
      <div className="text-center space-y-6 mb-16">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${bgClass} bg-opacity-10 ${textClass} border ${borderClass} border-opacity-20 text-[10px] font-black uppercase tracking-[0.2em]`}>
          <Icon className="w-4 h-4" /> {subtitle}
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] tracking-tighter max-w-3xl mx-auto">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA]">
            {title}
          </span>
        </h1>
        <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-medium">
          {description}
        </p>
      </div>

      {/* Summary Text (New) */}
      {summaryText && (
        <div className="relative group mb-20">
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/10 via-brand-primary/10 to-purple-500/10 rounded-[3rem] blur-2xl opacity-50"></div>
          <div className="relative p-10 bg-white/50 backdrop-blur-xl rounded-[2.5rem] border border-gray-100 shadow-xl">
             <p className="text-gray-700 text-lg md:text-xl font-medium leading-relaxed italic text-center">
                "{summaryText}"
             </p>
          </div>
        </div>
      )}

      {/* Vídeo Central e Flutuante - Opcional, only if summaryText is NOT present */}
      {youtubeId && !summaryText && (
        <div className="relative group mb-20">
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-brand-primary/20 to-purple-500/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
          <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-white/10 bg-black">
            <iframe 
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
              title="Explicação da Funcionalidade"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Grid de Benefícios */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {benefits.map((benefit, idx) => (
          <div key={idx} className="flex items-start gap-4 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className={`mt-1 ${textClass}`}>
              <CheckCircle className="w-6 h-6 fill-current bg-white rounded-full" />
            </div>
            <span className="text-gray-700 font-bold text-base leading-tight">{benefit}</span>
          </div>
        ))}
      </div>

      {/* CTA Final */}
      <div className="text-center">
        <button 
          onClick={onStart}
          className={`${bgClass} text-white px-16 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-4 mx-auto group active:scale-95`}
        >
          {ctaLabel} <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>

      {/* Stats Integrados */}
      <div className="mt-24 grid grid-cols-2 md:grid-cols-3 gap-8 pt-12 border-t border-gray-100">
        <div className="text-center">
           <p className="text-3xl font-black text-gray-900 mb-1 tracking-tighter">+40%</p>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Crescimento</p>
        </div>
        <div className="text-center">
           <p className="text-3xl font-black text-gray-900 mb-1 tracking-tighter">ZERO</p>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Taxas</p>
        </div>
        <div className="text-center col-span-2 md:col-span-1">
           <p className="text-3xl font-black text-gray-900 mb-1 tracking-tighter">100%</p>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Foco Local</p>
        </div>
      </div>
    </div>
  );
};

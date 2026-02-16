
import React from 'react';
import { Play, CheckCircle, ArrowRight, X } from 'lucide-react';

interface SectionLandingProps {
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  youtubeId: string;
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
  ctaLabel,
  onStart,
  icon: Icon,
  accentColor = "indigo"
}) => {
  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-600 text-indigo-600",
    emerald: "bg-emerald-600 text-emerald-600",
    brand: "bg-brand-primary text-brand-primary",
    rose: "bg-rose-600 text-rose-600",
    purple: "bg-purple-600 text-purple-600"
  };

  const currentColors = colorMap[accentColor] || colorMap.indigo;
  const [bgClass, textClass] = currentColors.split(' ');

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-zinc-800">
        <div className="grid lg:grid-cols-2 gap-0">
          
          {/* Lado Esquerdo: Conteúdo e Benefícios */}
          <div className="p-10 md:p-16 flex flex-col justify-center space-y-10">
            <div className="space-y-6">
              <div className={`w-16 h-16 rounded-2xl ${bgClass} bg-opacity-10 flex items-center justify-center ${textClass}`}>
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter mb-4">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] dark:from-brand-primary dark:to-brand-accent">
                    {title}
                  </span>
                </h1>
                <p className={`text-xl font-bold uppercase tracking-widest text-sm mb-4 ${textClass}`}>
                  {subtitle}
                </p>
                <p className="text-gray-500 dark:text-zinc-400 text-lg leading-relaxed">
                  {description}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Principais Benefícios</p>
              <div className="grid sm:grid-cols-1 gap-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3 group">
                    <div className={`${textClass} group-hover:scale-110 transition-transform`}>
                      <CheckCircle className="w-5 h-5 fill-current bg-white dark:bg-zinc-900 rounded-full" />
                    </div>
                    <span className="text-gray-700 dark:text-zinc-300 font-bold text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button 
                onClick={onStart}
                className={`${bgClass} text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:opacity-90 transition-all flex items-center gap-3 group active:scale-95`}
              >
                {ctaLabel} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Lado Direito: Vídeo do YouTube */}
          <div className="bg-gray-50 dark:bg-zinc-950 p-10 md:p-16 flex items-center justify-center relative overflow-hidden">
            <div className="relative z-10 w-full aspect-video rounded-[2rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-white/10 group">
              <iframe 
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                title="Explicação da Funcionalidade"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            {/* Elementos decorativos */}
            <div className={`absolute top-0 right-0 w-64 h-64 ${bgClass} opacity-5 rounded-full blur-[80px] -mr-32 -mt-32`}></div>
            <div className={`absolute bottom-0 left-0 w-64 h-64 ${bgClass} opacity-5 rounded-full blur-[80px] -ml-32 -mb-32`}></div>
          </div>
        </div>
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
        <div className="p-6">
           <p className="text-2xl font-black text-gray-900 dark:text-white mb-1">+40%</p>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Aumento em Conversão</p>
        </div>
        <div className="p-6 border-x border-gray-100 dark:border-zinc-800">
           <p className="text-2xl font-black text-gray-900 dark:text-white mb-1">ZERO</p>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Taxas de Intermediação</p>
        </div>
        <div className="p-6">
           <p className="text-2xl font-black text-gray-900 dark:text-white mb-1">100%</p>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Foco no Seu Bairro</p>
        </div>
      </div>
    </div>
  );
};

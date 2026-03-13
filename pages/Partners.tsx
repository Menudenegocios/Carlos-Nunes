
import React, { useEffect, useState } from 'react';
import { Handshake, Shield, Zap, TrendingUp, Users, ArrowRight, MessageSquare, Briefcase, Globe, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';

export const Partners: React.FC = () => {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await supabaseService.getPartners();
        setPartners(data);
      } catch (error) {
        console.error("Erro ao carregar parceiros:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-24 pb-32 pt-32 px-6">
      
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
           <Handshake className="w-3 h-3" /> Ecossistema de Crescimento
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-tight max-w-4xl mx-auto uppercase overflow-visible">
          Ninguém cresce <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] italic title-fix">sozinho.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Conheça as empresas e instituições que somam forças com o Menu de Negócios para potencializar o seu crescimento.
        </p>
      </section>

      {/* 2. PARTNERS GRID */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Carregando Ecossistema...</p>
        </div>
      ) : partners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {partners.map((partner) => (
            <a 
              key={partner.id} 
              href={partner.link || '#'} 
              target={partner.link ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-lg flex flex-col items-center text-center space-y-6 hover:shadow-2xl hover:-translate-y-2 transition-all group"
            >
              <div className="h-20 w-full flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
                {partner.logo_url ? (
                    <img src={partner.logo_url} alt={partner.title} className="max-h-full max-w-full object-contain" />
                ) : (
                    <Briefcase className="w-12 h-12 text-slate-200" />
                )}
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-lg leading-tight group-hover:text-brand-primary transition-colors">{partner.title}</h3>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">{partner.subtitle}</p>
                {partner.whatsapp && (
                    <span className="text-[9px] font-bold text-emerald-600 mt-2 block">{partner.whatsapp}</span>
                )}
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
            <Handshake className="w-16 h-16 text-slate-200 mx-auto mb-6" />
            <h3 className="text-xl font-black text-slate-400 uppercase italic">Aguardando novos parceiros</h3>
            <p className="text-slate-400 font-medium mt-2">Em breve, grandes marcas estarão aqui.</p>
        </div>
      )}

      {/* 3. BENEFITS OF PARTNERSHIP */}
      <section className="bg-white rounded-[4rem] p-12 md:p-24 border border-gray-100 shadow-2xl relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 relative z-10">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Vantagens de ser um <br/><span className="text-indigo-600">Parceiro Menu ADS</span></h2>
            <div className="space-y-8">
               <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0"><Globe className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-black text-gray-900 text-lg">Exposição Global</h4>
                    <p className="text-gray-500 text-sm font-medium">Sua marca em destaque para milhares de empreendedores locais ativos todos os meses.</p>
                  </div>
               </div>
               <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0"><Zap className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-black text-gray-900 text-lg">Integração Tecnológica</h4>
                    <p className="text-gray-500 text-sm font-medium">Acesso a APIs exclusivas e colaboração técnica para criar soluções para negócios locais.</p>
                  </div>
               </div>
               <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0"><TrendingUp className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-black text-gray-900 text-lg">Growth Co-branding</h4>
                    <p className="text-gray-500 text-sm font-medium">Ações conjuntas de marketing, webinars e conteúdos no nosso Blog e Academy.</p>
                  </div>
               </div>
            </div>
          </div>
          <div className="relative">
             <div className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 space-y-8">
                <div className="p-6 bg-white rounded-3xl shadow-xl border border-gray-100 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center"><Handshake className="w-5 h-5" /></div>
                   <p className="text-sm font-bold text-gray-900">Nova Parceria Ativada!</p>
                </div>
                <div className="p-6 bg-white rounded-3xl shadow-xl border border-gray-100 flex items-center gap-4 translate-x-12">
                   <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center"><Zap className="w-5 h-5" /></div>
                   <p className="text-sm font-bold text-gray-900">Sincronização Completa</p>
                </div>
                <div className="p-6 bg-white rounded-3xl shadow-xl border border-gray-100 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center"><Users className="w-5 h-5" /></div>
                   <p className="text-sm font-bold text-gray-900">+500 Leads Alcançados</p>
                </div>
             </div>
          </div>
        </div>
        {/* Decor */}
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[80px] -mb-40 -mr-40"></div>
      </section>

      {/* 4. BECOME A PARTNER CTA */}
      <section className="bg-gray-900 rounded-[3.5rem] p-16 text-center text-white relative overflow-hidden">
         <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Quer escalar o impacto local conosco?</h2>
            <p className="text-gray-400 text-lg font-medium leading-relaxed">Estamos sempre em busca de parceiros estratégicos que compartilham nosso amor pelo empreendedorismo regional.</p>
            <div className="pt-4">
               <button className="bg-white text-gray-900 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center gap-2 mx-auto shadow-2xl active:scale-95">
                 FALAR COM TIME DE PARCERIAS <ArrowRight className="w-4 h-4" />
               </button>
            </div>
         </div>
         <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
      </section>
    </div>
  );
};

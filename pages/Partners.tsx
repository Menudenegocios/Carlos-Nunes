
import React from 'react';
import { Handshake, Shield, Zap, TrendingUp, Users, ArrowRight, MessageSquare, Briefcase, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_PARTNERS = [
  { name: "Google Cloud", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg", role: "Infraestrutura de Dados" },
  { name: "Stripe Brasil", logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg", role: "Processamento de Pagamentos" },
  { name: "Sebrae (Parceiro Mock)", logo: "https://api.dicebear.com/7.x/initials/svg?seed=Sebrae", role: "Capacitação Empreendedora" },
  { name: "WhatsApp Business", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg", role: "Integração Oficial de Chat" }
];

export const Partners: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-24 pb-32 pt-8 px-6">
      
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
           <Handshake className="w-3 h-3" /> Ecossistema de Crescimento
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-none max-w-4xl mx-auto">
          Ninguém cresce <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600 dark:from-brand-primary dark:to-brand-accent">sozinho.</span>
        </h1>
        <p className="text-xl text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed">
          Conheça as empresas e instituições que somam forças com o Menu ADS para potencializar o seu negócio local.
        </p>
      </section>

      {/* 2. PARTNERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {MOCK_PARTNERS.map((partner, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-gray-100 dark:border-zinc-800 shadow-lg flex flex-col items-center text-center space-y-6 hover:shadow-2xl hover:-translate-y-2 transition-all">
            <div className="h-16 w-full flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500">
              <img src={partner.logo} alt={partner.name} className="max-h-full max-w-[150px] object-contain dark:invert dark:brightness-200" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 dark:text-white text-lg leading-tight">{partner.name}</h3>
              <p className="text-[10px] font-black text-indigo-600 dark:text-brand-primary uppercase tracking-widest mt-1">{partner.role}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. BENEFITS OF PARTNERSHIP */}
      <section className="bg-white dark:bg-zinc-900 rounded-[4rem] p-12 md:p-24 border border-gray-100 dark:border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 relative z-10">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none">Vantagens de ser um <br/><span className="text-indigo-600 dark:text-brand-primary">Parceiro Menu ADS</span></h2>
            <div className="space-y-8">
               <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-brand-primary flex items-center justify-center flex-shrink-0"><Globe className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-black text-gray-900 dark:text-white text-lg">Exposição Global</h4>
                    <p className="text-gray-500 dark:text-zinc-400 text-sm font-medium">Sua marca em destaque para milhares de empreendedores locais ativos todos os meses.</p>
                  </div>
               </div>
               <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0"><Zap className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-black text-gray-900 dark:text-white text-lg">Integração Tecnológica</h4>
                    <p className="text-gray-500 dark:text-zinc-400 text-sm font-medium">Acesso a APIs exclusivas e colaboração técnica para criar soluções para negócios locais.</p>
                  </div>
               </div>
               <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0"><TrendingUp className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-black text-gray-900 dark:text-white text-lg">Growth Co-branding</h4>
                    <p className="text-gray-500 dark:text-zinc-400 text-sm font-medium">Ações conjuntas de marketing, webinars e conteúdos no nosso Blog e Academy.</p>
                  </div>
               </div>
            </div>
          </div>
          <div className="relative">
             <div className="p-10 bg-gray-50 dark:bg-black/20 rounded-[3rem] border border-gray-100 dark:border-zinc-800 space-y-8">
                <div className="p-6 bg-white dark:bg-zinc-800 rounded-3xl shadow-xl border border-gray-100 dark:border-zinc-700 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center"><Handshake className="w-5 h-5" /></div>
                   <p className="text-sm font-bold text-gray-900 dark:text-white">Nova Parceria Ativada!</p>
                </div>
                <div className="p-6 bg-white dark:bg-zinc-800 rounded-3xl shadow-xl border border-gray-100 dark:border-zinc-700 flex items-center gap-4 translate-x-12">
                   <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center"><Zap className="w-5 h-5" /></div>
                   <p className="text-sm font-bold text-gray-900 dark:text-white">Sincronização Completa</p>
                </div>
                <div className="p-6 bg-white dark:bg-zinc-800 rounded-3xl shadow-xl border border-gray-100 dark:border-zinc-700 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center"><Users className="w-5 h-5" /></div>
                   <p className="text-sm font-bold text-gray-900 dark:text-white">+500 Leads Alcançados</p>
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

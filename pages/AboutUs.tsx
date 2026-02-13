
import React from 'react';
import { Target, Eye, Heart, Rocket, Shield, Users, ArrowRight, Store } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutUs: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-24 pb-32 pt-8 px-6">
      
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest">
           <Sparkles className="w-3 h-3" /> Propósito & Tecnologia
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none max-w-4xl mx-auto">
          Acreditamos no potencial do <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Comércio Local.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
          O Menu ADS nasceu para dar voz e visibilidade aos empreendedores que movem a economia real: os vizinhos, os autônomos e as pequenas empresas.
        </p>
      </section>

      {/* 2. BENTO MISSION/VISION/VALUES */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl space-y-6 group hover:border-indigo-200 transition-all">
          <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Target className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-gray-900">Missão</h3>
          <p className="text-gray-500 font-medium leading-relaxed">
            Eliminar barreiras tecnológicas para pequenos negócios, fornecendo ferramentas de elite para quem antes não tinha acesso ao marketing digital de ponta.
          </p>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl space-y-6 group hover:border-purple-200 transition-all">
          <div className="w-16 h-16 rounded-[1.5rem] bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Eye className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-gray-900">Visão</h3>
          <p className="text-gray-500 font-medium leading-relaxed">
            Ser o ecossistema número um em conexões locais no Brasil, sendo a ponte definitiva entre o desejo do consumidor e a oferta do produtor regional.
          </p>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl space-y-6 group hover:border-emerald-200 transition-all">
          <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-gray-900">Valores</h3>
          <p className="text-gray-500 font-medium leading-relaxed">
            Transparência total (zero comissões), inovação acessível e o fortalecimento da comunidade como centro de tudo o que desenvolvemos.
          </p>
        </div>
      </div>

      {/* 3. STORY SECTION */}
      <section className="grid lg:grid-cols-2 gap-16 items-center bg-gray-900 rounded-[4rem] p-12 md:p-24 text-white overflow-hidden relative">
        <div className="space-y-8 relative z-10">
          <h2 className="text-4xl font-black tracking-tight leading-none">Por que o <br/><span className="text-indigo-400">Menu ADS?</span></h2>
          <div className="space-y-6 text-gray-400 font-medium leading-relaxed">
            <p>
              Em um mundo dominado por grandes marketplaces que cobram taxas abusivas, percebemos que o pequeno empreendedor estava perdendo sua margem de lucro apenas para estar online.
            </p>
            <p>
              Criamos uma plataforma onde o foco não é a transação intermediada por nós, mas a conexão direta entre você e seu cliente no WhatsApp. Sem taxas, sem burocracia, apenas resultado.
            </p>
          </div>
          <div className="pt-6 flex gap-10">
             <div>
                <p className="text-3xl font-black text-white">5k+</p>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Usuários Ativos</p>
             </div>
             <div>
                <p className="text-3xl font-black text-white">100k</p>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Leads Gerados</p>
             </div>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-square rounded-[3rem] overflow-hidden rotate-3 shadow-2xl">
             <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-80" />
          </div>
          <div className="absolute -bottom-10 -left-10 bg-indigo-600 p-8 rounded-3xl shadow-2xl animate-float">
             <Users className="w-10 h-10 text-white mb-4" />
             <p className="font-black text-lg">Comunidade Viva</p>
          </div>
        </div>
        {/* Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
      </section>

      {/* 4. TEAM CALL TO ACTION */}
      <section className="text-center space-y-10">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Faça parte desta revolução.</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link to="/register" className="bg-gray-900 text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl">
             CADASTRAR MEU NEGÓCIO
          </Link>
          <Link to="/partners" className="bg-white text-gray-900 border border-gray-200 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
             SEJA UM PARCEIRO
          </Link>
        </div>
      </section>
    </div>
  );
};

const Sparkles = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);

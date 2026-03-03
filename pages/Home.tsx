
import React, { useEffect, useState } from 'react';
import { mockBackend } from '../services/mockBackend';
import { Offer, OfferCategory } from '../types';
import { 
  Search, MapPin, ArrowRight, Zap, Briefcase, 
  ShoppingBag, Heart, CheckCircle, 
  Sparkles, Star, TrendingUp, 
  Users, Ticket, Handshake, GraduationCap, Rocket, MessageCircle, ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const [filters, setFilters] = useState({ search: '', city: '', category: '' });

  const marqueeItems = [
    { label: "Produtos Locais", icon: ShoppingBag, color: "text-emerald-500" },
    { label: "Serviços Profissionais", icon: Briefcase, color: "text-blue-500" },
    { label: "Oportunidades B2B", icon: Handshake, color: "text-brand-primary" },
    { label: "Mentorias Estratégicas", icon: GraduationCap, color: "text-purple-500" },
    { label: "Ofertas da Cidade", icon: Ticket, color: "text-indigo-500" },
    { label: "Conexão Inteligente", icon: Zap, color: "text-amber-500" },
  ];

  return (
    <div className="flex flex-col bg-brand-surface dark:bg-brand-dark transition-colors duration-500">
      
      {/* 1. NEW ECOSYSTEM HERO */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/5 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-800 shadow-xl rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-gray-100 dark:border-slate-700">
                    <Sparkles className="w-4 h-4 text-brand-primary fill-current" /> O Ecossistema da sua Cidade
                </div>
                <h1 className="text-5xl md:text-8xl font-black text-brand-dark dark:text-white tracking-tighter leading-[0.9]">
                  Menu de Negócios <br/>
                  <span className="text-brand-primary italic">Ecossistema de Economia Colaborativa</span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed">
                  Ganhe ao comprar, indicar e fazer negócios dentro da rede.
                </p>
            </div>

            {/* Smart Search Bar */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-zinc-900 p-3 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] dark:shadow-none border border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row gap-2 ring-8 ring-brand-primary/5">
                    <div className="flex-1 relative flex items-center px-6">
                        <Search className="w-6 h-6 text-brand-primary absolute left-8" />
                        <input 
                            type="text" 
                            placeholder="O que você precisa hoje? (Ex: Pizzaria, Mentor...)" 
                            className="w-full bg-transparent border-none py-5 pl-12 font-bold text-lg text-brand-dark dark:text-white focus:ring-0 placeholder:text-gray-400"
                            value={filters.search}
                            onChange={(e) => setFilters({...filters, search: e.target.value})}
                        />
                    </div>
                    <div className="w-px h-10 bg-gray-100 dark:bg-slate-800 hidden md:block self-center"></div>
                    <div className="flex-1 relative flex items-center px-6">
                        <MapPin className="w-6 h-6 text-indigo-600 absolute left-8" />
                        <input 
                            type="text" 
                            placeholder="Sua Cidade ou Região" 
                            className="w-full bg-transparent border-none py-5 pl-12 font-bold text-lg text-brand-dark dark:text-white focus:ring-0 placeholder:text-gray-400"
                            value={filters.city}
                            onChange={(e) => setFilters({...filters, city: e.target.value})}
                        />
                    </div>
                    <button className="bg-brand-dark dark:bg-brand-primary text-white px-12 py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-all shadow-2xl active:scale-95">
                        EXPLORAR
                    </button>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INFINITE MARQUEE VITRINE */}
      <div className="marquee-container py-12 border-y border-gray-100 dark:border-zinc-800 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
        <div className="marquee-content animate-marquee">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 px-12 group cursor-default">
              <div className={`p-4 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm border border-gray-100 dark:border-zinc-700 ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter group-hover:text-brand-primary transition-colors">
                {item.label}
              </span>
              <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-zinc-700 ml-8"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. O PROBLEMA */}
      <section className="max-w-7xl mx-auto w-full px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-900">
              O Desafio
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-none tracking-tighter uppercase italic">
              Empreender sozinho é <br/><span className="text-brand-primary">mais difícil</span> do que deveria ser.
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">A maioria dos empreendedores enfrenta:</p>
              <ul className="space-y-3">
                {[
                  'Falta de visibilidade',
                  'Networking que não gera negócios',
                  'Desorganização comercial',
                  'Dificuldade para escalar',
                  'Falta de direcionamento estratégico'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-zinc-300 font-bold">
                    <div className="w-1.5 h-1.5 bg-brand-primary rounded-full"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xl font-black text-gray-900 dark:text-white italic">Você não precisa crescer sozinho.</p>
          </div>
          <div className="relative">
             <div className="aspect-square bg-gradient-to-br from-indigo-100 to-orange-100 dark:from-indigo-900/20 dark:to-orange-900/20 rounded-[4rem] flex items-center justify-center p-12 border border-indigo-100 dark:border-indigo-900/30">
                <div className="text-8xl">😫</div>
             </div>
             <div className="absolute -bottom-6 -right-6 bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-zinc-800 animate-bounce">
                <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">Solidão Empresarial</p>
             </div>
          </div>
        </div>
      </section>

      {/* 3. A SOLUÇÃO */}
      <section className="bg-brand-dark py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
           <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary rounded-full blur-[120px]"></div>
           <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-[120px]"></div>
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-brand-primary/20">
            3️⃣ A SOLUÇÃO
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-white leading-none tracking-tighter uppercase italic">
            Um ecossistema completo para estruturar e <span className="text-brand-primary">expandir seu negócio.</span>
          </h2>
          <p className="text-slate-400 text-xl md:text-2xl font-medium leading-relaxed">
            O Menu de Negócios integra presença digital, gestão comercial, economia colaborativa e capacitação estratégica em uma única plataforma.
          </p>
          <div className="pt-8 space-y-4">
            <p className="text-white font-bold text-lg">Você não precisa de várias ferramentas desconectadas.</p>
            <p className="text-brand-primary font-black text-xl italic uppercase tracking-widest">Você precisa de um sistema que trabalhe a seu favor.</p>
          </div>
        </div>
      </section>

      {/* 4. OS 4 PILARES DO ECOSSISTEMA */}
      <section className="max-w-7xl mx-auto w-full px-6 py-32">
        <div className="mb-20 text-center space-y-4">
           <div className="text-brand-primary font-black text-xs uppercase tracking-[0.3em]">4️⃣ OS 4 PILARES DO ECOSSISTEMA</div>
           <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">Ferramentas para o sucesso do seu <span className="text-brand-primary">negócio.</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Menu Pages */}
            <div className="group p-10 bg-white dark:bg-zinc-900 rounded-[3.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all flex flex-col md:flex-row gap-10">
                <div className="flex-1 space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shadow-sm">
                        <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight">🌍 Menu Pages</h3>
                      <p className="text-brand-primary text-[10px] font-black uppercase tracking-widest mt-1">Sua presença digital estratégica</p>
                    </div>
                    <p className="text-gray-500 dark:text-zinc-400 font-medium leading-relaxed">Crie sua landing page exclusiva para apresentar seus produtos e serviços de forma profissional.</p>
                    <ul className="space-y-2">
                      {['Página personalizada', 'Captação estruturada de leads', 'Agendamento online integrado', 'Foco em conversão'].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-zinc-300">
                          <CheckCircle className="w-4 h-4 text-emerald-500" /> {item}
                        </li>
                      ))}
                    </ul>
                    <Link to="/register" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all">
                      Criar minha página <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="hidden lg:block w-1/3 bg-emerald-50 dark:bg-emerald-900/10 rounded-[2rem] border border-emerald-100 dark:border-emerald-800/30"></div>
            </div>

            {/* Menu CRM */}
            <div className="group p-10 bg-white dark:bg-zinc-900 rounded-[3.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all flex flex-col md:flex-row gap-10">
                <div className="flex-1 space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center shadow-sm">
                        <TrendingUp className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight">📊 Menu CRM</h3>
                      <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mt-1">Gestão inteligente do seu negócio</p>
                    </div>
                    <p className="text-gray-500 dark:text-zinc-400 font-medium leading-relaxed">Organize sua operação e tenha controle total da sua jornada comercial.</p>
                    <ul className="space-y-2">
                      {['Qualificação de leads', 'Pipeline de vendas', 'Controle financeiro', 'Visão estratégica'].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-zinc-300">
                          <CheckCircle className="w-4 h-4 text-blue-500" /> {item}
                        </li>
                      ))}
                    </ul>
                    <Link to="/register" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all">
                      Organizar meu negócio <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="hidden lg:block w-1/3 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-800/30"></div>
            </div>

            {/* Menu Club */}
            <div className="group p-10 bg-white dark:bg-zinc-900 rounded-[3.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all flex flex-col md:flex-row gap-10">
                <div className="flex-1 space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-950 text-brand-primary flex items-center justify-center shadow-sm">
                        <Handshake className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight">🏆 Menu Club</h3>
                      <p className="text-brand-primary text-[10px] font-black uppercase tracking-widest mt-1">O motor da economia colaborativa</p>
                    </div>
                    <p className="text-gray-500 dark:text-zinc-400 font-medium leading-relaxed">Aqui os negócios acontecem dentro da própria rede.</p>
                    <ul className="space-y-2">
                      {['Negócios B2B', 'Indicações premiadas', 'Menu Cash (moeda interna)', 'Crescimento colaborativo'].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-zinc-300">
                          <CheckCircle className="w-4 h-4 text-brand-primary" /> {item}
                        </li>
                      ))}
                    </ul>
                    <Link to="/register" className="inline-flex items-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all">
                      Ativar meu crescimento <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="hidden lg:block w-1/3 bg-orange-50 dark:bg-orange-900/10 rounded-[2rem] border border-orange-100 dark:border-orange-800/30"></div>
            </div>

            {/* Menu Academy */}
            <div className="group p-10 bg-white dark:bg-zinc-900 rounded-[3.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all flex flex-col md:flex-row gap-10">
                <div className="flex-1 space-y-6">
                    <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center shadow-sm">
                        <GraduationCap className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight">🎓 Menu Academy</h3>
                      <p className="text-purple-600 text-[10px] font-black uppercase tracking-widest mt-1">Capacitação estratégica com IA</p>
                    </div>
                    <p className="text-gray-500 dark:text-zinc-400 font-medium leading-relaxed">Aprenda, aplique e evolua continuamente.</p>
                    <ul className="space-y-2">
                      {['Treinamentos gravados', 'Mentoria online semanal', 'Biblioteca de prompts', 'Agentes de IA'].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-zinc-300">
                          <CheckCircle className="w-4 h-4 text-purple-500" /> {item}
                        </li>
                      ))}
                    </ul>
                    <Link to="/register" className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-purple-700 transition-all">
                      Evoluir agora <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="hidden lg:block w-1/3 bg-purple-50 dark:bg-purple-900/10 rounded-[2rem] border border-purple-100 dark:border-purple-800/30"></div>
            </div>
        </div>
      </section>

      {/* 5. COMO FUNCIONA */}
      <section className="bg-gray-50 dark:bg-zinc-950 py-32 border-y border-gray-100 dark:border-zinc-900">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20 space-y-4">
               <div className="text-brand-primary font-black text-xs uppercase tracking-[0.3em]">5️⃣ COMO FUNCIONA</div>
               <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">O Caminho do <span className="text-brand-primary">Crescimento</span></h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
               <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200 dark:bg-zinc-800 hidden md:block -translate-y-1/2 z-0"></div>
               {[
                 { step: '1️⃣', title: 'Crie sua presença digital', desc: 'Sua vitrine profissional' },
                 { step: '2️⃣', title: 'Organize sua operação', desc: 'Controle total do negócio' },
                 { step: '3️⃣', title: 'Conecte-se com empreendedores', desc: 'Networking qualificado' },
                 { step: '4️⃣', title: 'Movimente a economia interna', desc: 'Use o Menu Cash' },
                 { step: '5️⃣', title: 'Cresça com estratégia e direção', desc: 'Escala e resultados' }
               ].map((item, i) => (
                 <div key={i} className="relative z-10 bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-100 dark:border-zinc-800 text-center space-y-4 shadow-sm hover:shadow-xl transition-all">
                    <div className="text-4xl">{item.step}</div>
                    <h4 className="font-black text-gray-900 dark:text-white text-sm uppercase leading-tight">{item.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">{item.desc}</p>
                 </div>
               ))}
            </div>
            <div className="mt-16 text-center">
               <p className="text-xl font-black text-gray-900 dark:text-white italic uppercase tracking-widest">Simples. Estruturado. Escalável.</p>
            </div>
         </div>
      </section>

      {/* 6. PROVA SOCIAL */}
      <section className="max-w-7xl mx-auto w-full px-6 py-32">
         <div className="text-center mb-20 space-y-4">
            <div className="text-brand-primary font-black text-xs uppercase tracking-[0.3em]">6️⃣ PROVA SOCIAL</div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">Empreendedores que já estão <span className="text-brand-primary">crescendo</span></h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-10 bg-white dark:bg-zinc-900 rounded-[3rem] border border-gray-100 dark:border-zinc-800 shadow-sm space-y-8">
               <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xl">
                     <img src="https://api.dicebear.com/7.x/initials/svg?seed=CB" className="w-full h-full object-cover" alt="User" />
                  </div>
                  <div>
                     <h4 className="text-xl font-black text-gray-900 dark:text-white">Carlos Batida</h4>
                     <p className="text-xs font-black text-indigo-600 uppercase">Batida Sound • Eventos</p>
                     <p className="text-[10px] font-bold text-emerald-600 uppercase mt-1">Resultado: Primeiros contratos na rede</p>
                  </div>
               </div>
               <p className="text-lg text-gray-500 dark:text-zinc-400 font-medium leading-relaxed italic">“Fechei meus primeiros contratos dentro da própria rede. O networking aqui é focado em resultados reais.”</p>
            </div>

            <div className="p-10 bg-white dark:bg-zinc-900 rounded-[3rem] border border-gray-100 dark:border-zinc-800 shadow-sm space-y-8">
               <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xl">
                     <img src="https://api.dicebear.com/7.x/initials/svg?seed=AD" className="w-full h-full object-cover" alt="User" />
                  </div>
                  <div>
                     <h4 className="text-xl font-black text-gray-900 dark:text-white">Ana Doces</h4>
                     <p className="text-xs font-black text-indigo-600 uppercase">Gourmet Fit • Alimentação</p>
                     <p className="text-[10px] font-bold text-emerald-600 uppercase mt-1">Resultado: Aumento de previsibilidade</p>
                  </div>
               </div>
               <p className="text-lg text-gray-500 dark:text-zinc-400 font-medium leading-relaxed italic">“Organizei meu comercial e aumentei minha previsibilidade. O CRM do Menu mudou a forma como gerencio meus pedidos.”</p>
            </div>
         </div>
      </section>

      {/* 7. DIFERENCIAL E POSICIONAMENTO */}
      <section className="bg-[#0F172A] py-32 relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-brand-primary/20">
                    7️⃣ DIFERENCIAL
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter uppercase italic">Não é apenas uma plataforma. <br/><span className="text-brand-primary">É um ecossistema.</span></h2>
                  <p className="text-slate-400 text-lg font-medium leading-relaxed">
                    Enquanto outras soluções oferecem ferramentas isoladas, o Menu integra tudo o que você precisa para crescer de forma sustentável.
                  </p>
                  <div className="grid grid-cols-2 gap-6">
                     {['Presença digital', 'Gestão', 'Economia colaborativa', 'Capacitação com IA'].map((item, i) => (
                       <div key={i} className="flex items-center gap-3 text-white font-bold">
                          <CheckCircle className="w-5 h-5 text-brand-primary" /> {item}
                       </div>
                     ))}
                  </div>
                  <p className="text-brand-primary font-black text-xl italic uppercase tracking-widest pt-4">Tudo conectado.</p>
               </div>
               <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-brand-primary/20 to-indigo-600/20 rounded-[3rem] border border-white/5 flex items-center justify-center">
                     <Rocket className="w-24 h-24 text-brand-primary animate-pulse" />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 8. CTA FINAL */}
      <section className="py-32 bg-white dark:bg-brand-dark">
         <div className="max-w-5xl mx-auto px-6">
            <div className="bg-brand-primary rounded-[4rem] p-12 md:p-24 text-center space-y-10 relative overflow-hidden shadow-2xl">
               <div className="relative z-10 space-y-6">
                  <h2 className="text-4xl md:text-7xl font-black text-white leading-none tracking-tighter uppercase italic">Entre para a economia colaborativa do Menu.</h2>
                  <p className="text-white/80 text-xl md:text-2xl font-medium max-w-2xl mx-auto">
                    Se você quer crescer com estrutura, visibilidade e conexão estratégica, este é o seu ambiente.
                  </p>
                  <div className="pt-8">
                    <Link to="/register" className="inline-flex items-center gap-4 bg-white text-brand-primary px-16 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
                      Quero fazer parte agora <ArrowRight className="w-6 h-6" />
                    </Link>
                  </div>
               </div>
               <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
               <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-[100px] -ml-48 -mb-48"></div>
            </div>
         </div>
      </section>
      
    </div>
  );
};
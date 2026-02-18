
import React, { useEffect, useState } from 'react';
import { mockBackend } from '../services/mockBackend';
import { Offer, OfferCategory } from '../types';
import { 
  Search, MapPin, ArrowRight, Zap, Briefcase, 
  ShoppingBag, Heart, Home as HomeIcon, CheckCircle, 
  Sparkles, HelpCircle, ChevronDown, Star, TrendingUp, 
  Users, Store, Ticket, ShieldCheck, LayoutGrid, Timer,
  Handshake, GraduationCap, Rocket, MessageCircle, ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', city: '', category: '' });

  useEffect(() => { loadOffers(); }, [filters]);

  const loadOffers = async () => {
    setIsLoading(true);
    try {
      const data = await mockBackend.getOffers(filters);
      setOffers(data);
    } catch (error) { console.error('Failed to load offers', error); } finally { setIsLoading(false); }
  };

  const marqueeItems = [
    { label: "Produtos Locais", icon: ShoppingBag, color: "text-emerald-500" },
    { label: "Serviços Profissionais", icon: Briefcase, color: "text-blue-500" },
    { label: "Oportunidades B2B", icon: Handshake, color: "text-brand-primary" },
    { label: "Mentorias Estratégicas", icon: GraduationCap, color: "text-purple-500" },
    { label: "Ofertas da Cidade", icon: Ticket, color: "text-rose-500" },
    { label: "Conexão Inteligente", icon: Zap, color: "text-amber-500" },
  ];

  return (
    <div className="flex flex-col bg-brand-surface dark:bg-brand-dark transition-colors duration-500">
      
      {/* 1. NEW ECOSYSTEM HERO */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        {/* Background Elements */}
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
                <h1 className="text-6xl md:text-8xl font-black text-brand-dark dark:text-white tracking-tighter leading-[0.9]">
                  Tudo o que sua cidade oferece, <br/>
                  <span className="text-brand-primary italic">em um só lugar.</span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed">
                  Conectamos você aos melhores produtos, serviços, oportunidades e mentorias locais. Sem taxas, sem burocracia, 100% regional.
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

      {/* 3. THE 4 VERTICALS (BENTO GRID) */}
      <section className="max-w-7xl mx-auto w-full px-6 py-24">
        <div className="mb-16 text-center space-y-4">
           <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">As 4 Verticais do <span className="text-brand-primary">Crescimento</span></h2>
           <p className="text-slate-500 font-medium max-w-xl mx-auto">Tudo o que um ecossistema próspero precisa para conectar valor entre pessoas e empresas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Vertical 1: Produtos */}
            <Link to="/marketplace" className="group p-8 bg-white dark:bg-zinc-900 rounded-[3rem] border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col justify-between h-[420px] relative overflow-hidden">
                <div className="relative z-10">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                        <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight mb-4">Produtos <br/>Locais</h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium leading-relaxed">Encontre itens exclusivos e estoque imediato na sua região. Compre direto de quem produz.</p>
                </div>
                <div className="relative z-10 pt-6">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 group-hover:gap-4 transition-all">
                        VER CATÁLOGO <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-50 dark:bg-emerald-900/10 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors"></div>
            </Link>

            {/* Vertical 2: Serviços */}
            <Link to="/stores" className="group p-8 bg-white dark:bg-zinc-900 rounded-[3rem] border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col justify-between h-[420px] relative overflow-hidden">
                <div className="relative z-10">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                        <Briefcase className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight mb-4">Serviços <br/>Profissionais</h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium leading-relaxed">Contrate especialistas qualificados na sua cidade. De advogados a técnicos, tudo por perto.</p>
                </div>
                <div className="relative z-10 pt-6">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 group-hover:gap-4 transition-all">
                        CONTRATAR AGORA <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
            </Link>

            {/* Vertical 3: Oportunidades */}
            <Link to="/marketplace-b2b" className="group p-8 bg-white dark:bg-zinc-900 rounded-[3rem] border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col justify-between h-[420px] relative overflow-hidden">
                <div className="relative z-10">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-orange-50 dark:bg-orange-950 text-brand-primary flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                        <Handshake className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight mb-4">Oportunidades <br/>de Negócio</h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium leading-relaxed">Conexões B2B, acordos entre empresas e parcerias estratégicas para crescimento mútuo.</p>
                </div>
                <div className="relative z-10 pt-6">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-primary group-hover:gap-4 transition-all">
                        BUSCAR MATCH <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-50 dark:bg-orange-900/10 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors"></div>
            </Link>

            {/* Vertical 4: Mentorias */}
            <Link to="/academy" className="group p-8 bg-white dark:bg-zinc-900 rounded-[3rem] border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col justify-between h-[420px] relative overflow-hidden">
                <div className="relative z-10">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                        <GraduationCap className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight mb-4">Mentorias <br/>de Elite</h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium leading-relaxed">Aprenda com quem já domina o mercado. Mentorias práticas focadas em resultados reais.</p>
                </div>
                <div className="relative z-10 pt-6">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-purple-600 group-hover:gap-4 transition-all">
                        ACESSAR ACADEMY <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-50 dark:bg-purple-900/10 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors"></div>
            </Link>
        </div>
      </section>

      {/* 4. COMO FUNCIONA A CONEXÃO LOCAL */}
      <section className="bg-[#0F172A] py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
             <div className="grid lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-12">
                   <div className="space-y-6">
                      <h2 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter uppercase italic">Conexão Local em <br/><span className="text-brand-primary">3 Passos Simples.</span></h2>
                      <p className="text-slate-400 text-lg font-medium leading-relaxed">Criamos o caminho mais curto entre quem precisa e quem oferece, sem intermediários e sem taxas ocultas.</p>
                   </div>
                   
                   <div className="space-y-8">
                      {[
                        { step: '01', title: 'Explore', desc: 'Filtre por categoria, cidade ou palavra-chave para encontrar exatamente o que sua região oferece agora.', icon: Search },
                        { step: '02', title: 'Conecte', desc: 'Fale direto com o responsável via WhatsApp ou Chat Inteligente. Tire dúvidas e negocie em tempo real.', icon: MessageCircle },
                        { step: '03', title: 'Evolua', desc: 'Feche negócios, realize pagamentos sem taxas de plataforma e suba de nível no Clube ADS.', icon: Rocket },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-8 group">
                           <div className="text-4xl font-black text-white/10 italic group-hover:text-brand-primary/40 transition-colors">{item.step}</div>
                           <div className="space-y-2">
                              <h4 className="text-xl font-black text-white uppercase italic tracking-tight flex items-center gap-2">
                                <item.icon className="w-5 h-5 text-brand-primary" /> {item.title}
                              </h4>
                              <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm">{item.desc}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="relative">
                   <div className="aspect-square bg-gradient-to-br from-brand-primary/20 to-indigo-600/20 rounded-[4rem] animate-float relative overflow-hidden border border-white/5 flex items-center justify-center">
                      <div className="p-12 text-center space-y-6">
                         <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto border border-white/10">
                            <Zap className="w-12 h-12 text-brand-primary fill-current" />
                         </div>
                         <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none italic">Acelerando a <br/>Economia Local</h3>
                         <Link to="/register" className="bg-white text-gray-900 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">COMEÇAR AGORA</Link>
                      </div>
                      {/* Decoration icons around */}
                      <ShoppingBag className="absolute top-10 left-10 w-8 h-8 text-white/10 -rotate-12" />
                      <Handshake className="absolute bottom-10 right-10 w-12 h-12 text-white/10 rotate-12" />
                      <Users className="absolute top-20 right-20 w-6 h-6 text-white/10" />
                   </div>
                   <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
                </div>
             </div>
          </div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none"></div>
      </section>

      {/* 5. MURAL DA CIDADE (MURAL VIVO) */}
      <section className="max-w-7xl mx-auto w-full px-6 py-24">
         <div className="bg-white dark:bg-zinc-900 rounded-[4rem] p-12 md:p-20 border border-gray-100 dark:border-zinc-800 shadow-xl overflow-hidden relative">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 relative z-10">
               <div className="space-y-4">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-brand-primary font-black text-[10px] uppercase tracking-widest">
                     <Users className="w-4 h-4" /> Mural da Cidade
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-none tracking-tighter uppercase italic">O que está acontecendo <span className="text-brand-primary">agora.</span></h2>
                  <p className="text-slate-500 font-medium max-w-lg">Confira as últimas movimentações, parcerias e novidades do nosso ecossistema regional.</p>
               </div>
               <Link to="/register" className="bg-gray-900 dark:bg-brand-primary text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 hover:opacity-90 transition-all active:scale-95">
                  PARTICIPAR DA REDE <ArrowUpRight className="w-4 h-4" />
               </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
               {/* Post Simulado 1 */}
               <div className="p-8 bg-gray-50 dark:bg-zinc-800/40 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md">
                        <img src="https://api.dicebear.com/7.x/initials/svg?seed=CB" className="w-full h-full object-cover" alt="User" />
                     </div>
                     <div>
                        <h4 className="font-black text-gray-900 dark:text-white text-sm">Carlos Batida</h4>
                        <p className="text-[9px] font-black text-indigo-600 uppercase">Batida Sound • São Paulo</p>
                     </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium leading-relaxed italic">"Acabei de fechar uma parceria incrível com a Ana Doces via Marketplace B2B. A força local é real! 🚀"</p>
                  <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase">
                     <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> 24</span>
                     <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> 8</span>
                  </div>
               </div>

               {/* Post Simulado 2 */}
               <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white space-y-6 shadow-xl relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md bg-white/20 border border-white/20">
                            <img src="https://api.dicebear.com/7.x/initials/svg?seed=AD" className="w-full h-full object-cover" alt="User" />
                        </div>
                        <div>
                            <h4 className="font-black text-sm">Ana Doces</h4>
                            <p className="text-[9px] font-black text-brand-primary uppercase">Gourmet Fit • Curitiba</p>
                        </div>
                    </div>
                    <p className="text-sm text-indigo-50 font-medium leading-relaxed mt-6 italic">"Lancei meu novo catálogo de Páscoa e os pedidos pelo Zap já começaram! O Menu ADS mudou meu jogo."</p>
                    <div className="flex items-center justify-between mt-8">
                       <span className="bg-white/10 px-4 py-1.5 rounded-full text-[9px] font-black uppercase">NOVA OFERTA ATIVA</span>
                       <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-indigo-600"><Star className="w-4 h-4 fill-current" /></div>
                    </div>
                  </div>
                  <Zap className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 rotate-12" />
               </div>

               {/* Post Simulado 3 */}
               <div className="p-8 bg-gray-50 dark:bg-zinc-800/40 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md">
                        <img src="https://api.dicebear.com/7.x/initials/svg?seed=MS" className="w-full h-full object-cover" alt="User" />
                     </div>
                     <div>
                        <h4 className="font-black text-gray-900 dark:text-white text-sm">Marcos Silva</h4>
                        <p className="text-[9px] font-black text-indigo-600 uppercase">Construção Pro • Belo Horizonte</p>
                     </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium leading-relaxed italic">"Dica para os colegas: usem a Mentoria IA do Studio Flow para criar suas copys. Meus orçamentos dobraram!"</p>
                  <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase">
                     <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> 15</span>
                     <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> 3</span>
                  </div>
               </div>
            </div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] -mr-40 -mt-40"></div>
         </div>
      </section>

      {/* 6. NEWSLETTER CIDADE VIP */}
      <section className="bg-white dark:bg-zinc-950 py-24">
         <div className="max-w-4xl mx-auto px-6 text-center space-y-10">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-sm">
               <TrendingUp className="w-10 h-10 text-brand-primary" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-none tracking-tighter uppercase italic">As melhores oportunidades da sua cidade no seu Zap.</h2>
            <p className="text-gray-500 dark:text-zinc-400 text-lg font-medium leading-relaxed">Assine nossa newsletter regional e receba insights, mentorias gratuitas e avisos de novos parceiros antes de todo mundo.</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto pt-4">
               <input 
                 type="text" 
                 placeholder="Seu WhatsApp ou E-mail" 
                 className="bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl px-8 py-5 placeholder:text-gray-400 text-gray-900 dark:text-white font-bold focus:ring-2 focus:ring-brand-primary outline-none flex-1 transition-all" 
               />
               <button className="bg-brand-dark dark:bg-brand-primary text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-brand-primary dark:hover:bg-brand-accent transition-all active:scale-95">RECEBER INSIGHTS</button>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Respeitamos sua privacidade • Sem Spam Regional</p>
         </div>
      </section>
      
      {/* 7. FAQ SIMPLIFICADO */}
      <section className="max-w-4xl mx-auto px-6 py-24 space-y-12">
          <div className="text-center">
             <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight">Dúvidas Frequentes</h3>
          </div>
          <div className="space-y-4">
             {[
               { q: "O Menu de Negócios cobra comissão?", a: "Não. Diferente de outros marketplaces, nós não tiramos porcentagem das suas vendas. A plataforma é uma ferramenta de conexão direta, e todo o lucro das negociações feitas via WhatsApp ou catálogo é 100% seu." },
               { q: "Como meu negócio aparece para as pessoas certas?", a: "Utilizamos inteligência de geolocalização e categorias inteligentes. Além disso, perfis que utilizam o Clube ADS e possuem selos de verificação ganham prioridade máxima no nosso algoritmo de busca da cidade." },
               { q: "Posso anunciar produtos e serviços?", a: "Sim! Nossa vitrine é híbrida. Você pode cadastrar produtos físicos com controle de estoque no Catálogo ou listar serviços profissionais com agendamento integrado." }
             ].map((faq, i) => (
               <div key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm group">
                  <h4 className="font-black text-gray-900 dark:text-white text-lg mb-4 flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-brand-primary" /> {faq.q}
                  </h4>
                  <p className="text-gray-500 dark:text-zinc-400 text-sm font-medium leading-relaxed">{faq.a}</p>
               </div>
             ))}
          </div>
      </section>

    </div>
  );
};

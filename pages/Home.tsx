
import React, { useEffect, useState } from 'react';
import { mockBackend } from '../services/mockBackend';
import { Offer, OfferCategory } from '../types';
import { OfferCard } from '../components/OfferCard';
import { 
  Search, MapPin, ArrowRight, Zap, Briefcase, 
  ShoppingBag, Heart, Home as HomeIcon, CheckCircle, 
  Sparkles, HelpCircle, ChevronDown, Star, TrendingUp, 
  Users, Store, Ticket, ShieldCheck, LayoutGrid, Timer,
  Handshake
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', city: '', category: '' });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => { loadOffers(); }, [filters]);

  const loadOffers = async () => {
    setIsLoading(true);
    try {
      const data = await mockBackend.getOffers(filters);
      setOffers(data);
    } catch (error) { console.error('Failed to load offers', error); } finally { setIsLoading(false); }
  };

  const categories = [
    { title: 'Serviços', val: OfferCategory.SERVICOS_PROFISSIONAIS, icon: Briefcase, color: 'text-brand-primary', count: '120+' },
    { title: 'Negócios', val: OfferCategory.NEGOCIOS_LOCAIS, icon: ShoppingBag, color: 'text-indigo-600', count: '450+' },
    { title: 'Saúde', val: OfferCategory.SAUDE_BEM_ESTAR, icon: Heart, color: 'text-rose-600', count: '85+' },
    { title: 'Imóveis', val: OfferCategory.IMOVEIS_SERVICOS, icon: HomeIcon, color: 'text-amber-500', count: '60+' }
  ];

  const faqs = [
    {
      q: "O que é o Menu de Negócios?",
      a: "Somos um marketplace de conexão local inteligente que permite a empreendedores criarem vitrines digitais de alto impacto para atrair clientes do seu próprio bairro ou cidade."
    },
    {
      q: "Realmente não há taxas de venda?",
      a: "Exatamente. O lucro das suas vendas é 100% seu. Nós facilitamos o contato direto via WhatsApp ou seu próprio catálogo digital, eliminando intermediários caros."
    },
    {
        q: "Como meu negócio aparece nos destaques?",
        a: "Negócios com perfis completos, boas avaliações e selos de verificação ganham prioridade no nosso algoritmo de busca regional."
    }
  ];

  return (
    <div className="flex flex-col bg-brand-surface dark:bg-black transition-colors duration-500">
      
      {/* 1. NEW MARKETPLACE HERO */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/5 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-zinc-900 shadow-xl rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-gray-100 dark:border-zinc-800 animate-bounce">
                    <Sparkles className="w-4 h-4 text-brand-primary fill-current" /> O Shopping do seu bairro
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-brand-contrast dark:text-white tracking-tighter leading-[0.9]">
                  Tudo o que você busca, <br/>
                  <span className="text-brand-primary italic">está logo ali.</span>
                </h1>
                <p className="text-xl md:text-2xl text-brand-contrast/60 dark:text-zinc-400 font-medium max-w-3xl mx-auto leading-relaxed">
                  Conectamos consumidores reais aos melhores negócios locais. Sem taxas, sem burocracia, 100% regional.
                </p>
            </div>

            {/* Smart Search Bar (Amazon Style) */}
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-zinc-900 p-3 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] dark:shadow-none border border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row gap-2 ring-8 ring-brand-primary/5">
                    <div className="flex-1 relative flex items-center px-6">
                        <Search className="w-6 h-6 text-brand-primary absolute left-8" />
                        <input 
                            type="text" 
                            placeholder="O que você precisa hoje? (Ex: Pizzaria, Advogado...)" 
                            className="w-full bg-transparent border-none py-5 pl-12 font-bold text-lg text-brand-contrast dark:text-white focus:ring-0 placeholder:text-gray-400"
                            value={filters.search}
                            onChange={(e) => setFilters({...filters, search: e.target.value})}
                        />
                    </div>
                    <div className="w-px h-10 bg-gray-100 dark:bg-zinc-800 hidden md:block self-center"></div>
                    <div className="flex-1 relative flex items-center px-6">
                        <MapPin className="w-6 h-6 text-indigo-600 absolute left-8" />
                        <input 
                            type="text" 
                            placeholder="Sua Cidade/Bairro" 
                            className="w-full bg-transparent border-none py-5 pl-12 font-bold text-lg text-brand-contrast dark:text-white focus:ring-0 placeholder:text-gray-400"
                            value={filters.city}
                            onChange={(e) => setFilters({...filters, city: e.target.value})}
                        />
                    </div>
                    <button className="bg-brand-contrast dark:bg-brand-primary text-white px-12 py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-all shadow-2xl active:scale-95">
                        EXPLORAR
                    </button>
                </div>
                
                {/* Hot Tags */}
                <div className="flex flex-wrap justify-center gap-6 mt-10">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <TrendingUp className="w-4 h-4 text-emerald-500" /> Populares:
                    </div>
                    {['#Hamburgueria', '#PetShop', '#Advocacia', '#Manutenção'].map(tag => (
                        <button key={tag} className="text-[10px] font-black text-brand-contrast/40 dark:text-zinc-500 hover:text-brand-primary transition-colors uppercase tracking-widest">{tag}</button>
                    ))}
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BENTO GRID HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto w-full px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Box 1: Destaque da Semana */}
            <div className="md:col-span-2 md:row-span-2 bg-white dark:bg-zinc-900 rounded-[3.5rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-xl overflow-hidden relative group cursor-pointer">
                <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                            <Star className="w-4 h-4 fill-current" /> Negócio em Destaque
                        </div>
                        <h3 className="text-4xl font-black text-gray-900 dark:text-white leading-none tracking-tighter">Empório das Artes <br/><span className="text-brand-primary">Artesanal & Local</span></h3>
                        <p className="text-gray-500 dark:text-zinc-400 font-medium max-w-xs">A melhor curadoria de produtos do bairro, agora com delivery gratuito pelo WhatsApp.</p>
                    </div>
                    <Link to="/store/destaque" className="w-fit bg-gray-900 dark:bg-brand-primary text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl group-hover:scale-105 transition-all">VISITAR LOJA</Link>
                </div>
                <img src="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&q=80&w=800" className="absolute top-0 right-0 w-1/2 h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity" />
            </div>

            {/* Box 2: Cupons Ativos */}
            <div className="bg-indigo-600 rounded-[3rem] p-8 text-white shadow-xl flex flex-col justify-between group hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 mb-4">
                    <Ticket className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h4 className="text-4xl font-black leading-none">24</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">Cupons Ativos Hoje</p>
                </div>
                <Link to="/coupons" className="mt-6 flex items-center justify-between text-[10px] font-black uppercase tracking-widest bg-white/10 p-4 rounded-xl hover:bg-white/20 transition-all">
                    RESGATAR AGORA <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Box 3: Network B2B */}
            <div className="bg-brand-contrast dark:bg-zinc-800 rounded-[3rem] p-8 text-white shadow-xl flex flex-col justify-between group hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 mb-4">
                    <Handshake className="w-6 h-6 text-brand-primary" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary mb-1">Para sua Empresa</p>
                    <h4 className="text-xl font-black leading-tight">Encontre novos <br/>parceiros B2B</h4>
                </div>
                <Link to="/marketplace" className="mt-6 flex items-center justify-between text-[10px] font-black uppercase tracking-widest bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all border border-white/5">
                    VER ACORDOS <ChevronDown className="w-4 h-4 -rotate-90" />
                </Link>
            </div>

            {/* Box 4: Contador de Usuários */}
            <div className="md:col-span-2 bg-gray-50 dark:bg-zinc-900 rounded-[3rem] p-8 border border-gray-100 dark:border-zinc-800 flex items-center justify-between group">
                <div className="space-y-1">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Comunidade Ativa</h4>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">+5.000 Vizinhos Conectados</p>
                </div>
                <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-zinc-900 bg-gray-200 overflow-hidden shadow-lg">
                            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${i}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                    <div className="w-12 h-12 rounded-full border-4 border-white dark:border-zinc-900 bg-brand-primary flex items-center justify-center text-white text-[10px] font-black shadow-lg">
                        +
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 3. CATEGORIES HORIZONTAL CAROUSEL */}
      <section className="max-w-7xl mx-auto w-full px-6 py-24 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-2">
              <h2 className="text-4xl font-black text-brand-contrast dark:text-white tracking-tight leading-none">Navegue por Categorias</h2>
              <p className="text-gray-500 dark:text-zinc-500 font-medium">Explore milhares de ofertas verificadas pela nossa rede.</p>
           </div>
           <Link to="/categories" className="text-[11px] font-black uppercase tracking-widest text-brand-primary flex items-center gap-2 hover:translate-x-1 transition-transform">VER TODAS AS CATEGORIAS <ArrowRight className="w-4 h-4" /></Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setFilters({...filters, category: cat.val})}
              className={`group bg-white dark:bg-zinc-900 p-8 rounded-[3rem] border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center gap-6 hover:shadow-2xl hover:border-brand-primary/20 transition-all ${filters.category === cat.val ? 'ring-4 ring-brand-primary/10 border-brand-primary' : ''}`}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gray-50 dark:bg-black/20 ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                 <cat.icon className="w-7 h-7" />
              </div>
              <div className="text-left">
                <h4 className="text-xl font-black text-brand-contrast dark:text-white">{cat.title}</h4>
                <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">{cat.count} negócios</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. FLASH DEALS / COUPONS (URGENCY) */}
      <section className="bg-indigo-900 py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 space-y-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
             <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase text-indigo-200 border border-white/10">
                    <Timer className="w-3.5 h-3.5" /> Ofertas Relâmpago
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">Economia em Tempo Real</h2>
                <p className="text-indigo-200 text-lg max-w-xl font-medium">Os melhores descontos do bairro, válidos apenas por tempo limitado. Pegue o seu código!</p>
             </div>
             <Link to="/coupons" className="bg-white text-indigo-900 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">VER TODOS OS CUPONS</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                { title: 'Sushi Express', discount: '30% OFF', desc: 'Válido para pedidos acima de R$ 80', color: 'indigo' },
                { title: 'Academia Fit', discount: 'Isenção Matrícula', desc: 'Válido apenas para novos planos Pro', color: 'emerald' },
                { title: 'Pet Shop Bairro', discount: 'R$ 20 OFF', desc: 'Cupom válido para banho e tosa completa', color: 'rose' }
            ].map((deal, i) => (
                <div key={i} className="bg-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-gray-50 rounded-2xl">
                                <ShoppingBag className="w-6 h-6 text-gray-900" />
                            </div>
                            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase">Expira em 4h</span>
                        </div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{deal.title}</h4>
                        <h3 className="text-3xl font-black text-gray-900 mb-2">{deal.discount}</h3>
                        <p className="text-xs text-gray-500 font-medium mb-8 leading-relaxed">{deal.desc}</p>
                        <button className="w-full py-4 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-colors">RESGATAR CUPOM</button>
                    </div>
                    <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-gray-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                </div>
            ))}
          </div>
        </div>
        {/* Decor */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-800/30 skew-x-12 translate-x-1/2"></div>
      </section>

      {/* 5. FEATURED STORES (TRUST) */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-primary/10 rounded-full text-[10px] font-black uppercase text-brand-primary border border-brand-primary/20">
                <ShieldCheck className="w-3.5 h-3.5" /> Negócios Verificados
             </div>
             <h2 className="text-4xl md:text-5xl font-black text-brand-contrast dark:text-white tracking-tight">O Que Há de Melhor no Bairro</h2>
             <p className="text-gray-500 dark:text-zinc-500 font-medium max-w-2xl mx-auto">Conheça as lojas e serviços que estão transformando o comércio regional com qualidade e excelência.</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[1, 2, 3].map(i => <div key={i} className="bg-white dark:bg-zinc-900 h-[450px] rounded-[3rem] border border-gray-100 dark:border-zinc-800 animate-pulse"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {offers.slice(0, 6).map(offer => <OfferCard key={offer.id} offer={offer} />)}
            </div>
          )}
          
          <div className="text-center pt-8">
             <Link to="/stores" className="inline-flex items-center gap-3 px-12 py-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-xl hover:-translate-y-1 transition-all text-brand-contrast dark:text-white">
                VER TODA A VITRINE <ArrowRight className="w-4 h-4" />
             </Link>
          </div>
        </div>
      </section>

      {/* 6. B2B VS B2C SECTION (DIVISION) */}
      <section className="max-w-7xl mx-auto w-full px-6 py-24">
         <div className="grid lg:grid-cols-2 gap-10">
            {/* Consumer Side */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/20 dark:to-indigo-900/10 rounded-[4rem] p-12 md:p-16 space-y-8 border border-indigo-200/50 dark:border-indigo-800/30 overflow-hidden relative">
                <div className="relative z-10 space-y-6">
                    <h3 className="text-4xl font-black text-indigo-900 dark:text-indigo-300 tracking-tighter leading-none">Para Você <br/>Consumidor.</h3>
                    <p className="text-indigo-700/70 dark:text-indigo-400 font-medium text-lg leading-relaxed">Descubra ofertas, peça pelo WhatsApp e apoie quem produz perto de você. Sem taxas escondidas no preço final.</p>
                    <ul className="space-y-4">
                        {['Cupons Exclusivos', 'Busca por Bairro', 'Contato Direto'].map(item => (
                            <li key={item} className="flex items-center gap-3 text-indigo-900 dark:text-indigo-300 font-bold text-sm">
                                <CheckCircle className="w-5 h-5 text-indigo-600" /> {item}
                            </li>
                        ))}
                    </ul>
                    <Link to="/marketplace" className="inline-block bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all">COMEÇAR A EXPLORAR</Link>
                </div>
                <ShoppingBag className="absolute -bottom-10 -right-10 w-64 h-64 text-indigo-600/10 -rotate-12" />
            </div>

            {/* Business Side */}
            <div className="bg-brand-contrast dark:bg-zinc-900 rounded-[4rem] p-12 md:p-16 space-y-8 overflow-hidden relative shadow-2xl">
                <div className="relative z-10 space-y-6">
                    <h3 className="text-4xl font-black text-white tracking-tighter leading-none">Para o seu <br/>Negócio.</h3>
                    <p className="text-gray-400 font-medium text-lg leading-relaxed">Coloque sua empresa no digital em minutos. Gere leads qualificados e controle seu funil de vendas sem intermediários.</p>
                    <ul className="space-y-4">
                        {['Vitrine com IA', 'CRM de Vendas', 'Zero Comissões'].map(item => (
                            <li key={item} className="flex items-center gap-3 text-white font-bold text-sm">
                                <CheckCircle className="w-5 h-5 text-brand-primary" /> {item}
                            </li>
                        ))}
                    </ul>
                    <Link to="/register" className="inline-block bg-brand-primary text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-orange-600 transition-all">ANUNCIAR GRÁTIS</Link>
                </div>
                <Store className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 -rotate-12" />
            </div>
         </div>
      </section>

      {/* 7. FAQ */}
      <section className="max-w-4xl mx-auto w-full px-6 py-24">
         <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-accent/10 text-brand-contrast dark:text-brand-surface rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-accent/30">
               <HelpCircle className="w-3 h-3 text-brand-primary" /> Central de Dúvidas
            </div>
            <h2 className="text-4xl font-black text-brand-contrast dark:text-white">Perguntas Frequentes</h2>
         </div>

         <div className="space-y-4">
            {faqs.map((faq, idx) => (
               <div key={idx} className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-8 flex items-center justify-between text-left group"
                  >
                     <span className={`text-lg font-black transition-colors ${openFaq === idx ? 'text-brand-primary' : 'text-brand-contrast dark:text-zinc-200 group-hover:text-brand-primary'}`}>
                        {faq.q}
                     </span>
                     <div className={`p-2 rounded-xl transition-all ${openFaq === idx ? 'bg-brand-primary text-white rotate-180' : 'bg-gray-50 dark:bg-zinc-800 text-gray-400 group-hover:bg-brand-primary group-hover:text-white'}`}>
                        <ChevronDown className="w-5 h-5" />
                     </div>
                  </button>
                  {openFaq === idx && (
                     <div className="px-8 pb-8 animate-fade-in">
                        <div className="h-px bg-gray-50 dark:bg-zinc-800 mb-6"></div>
                        <p className="text-gray-500 dark:text-zinc-400 font-medium leading-relaxed">{faq.a}</p>
                     </div>
                  )}
               </div>
            ))}
         </div>
      </section>

      {/* 8. CTA FINAL */}
      <section className="max-w-7xl mx-auto w-full px-6 py-16">
         <div className="bg-brand-contrast dark:bg-zinc-950 rounded-[4rem] p-12 md:p-24 text-center text-brand-surface relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-10 max-w-3xl mx-auto">
               <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">Seu bairro nunca foi tão <br/><span className="text-brand-primary italic">digital.</span></h2>
               <p className="text-brand-secondary/80 text-xl font-medium leading-relaxed">Seja para comprar ou para vender, o Menu de Negócios é a sua vitrine regional inteligente.</p>
               <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
                  <Link to="/register" className="bg-brand-primary text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-3">
                    CADASTRAR MEU NEGÓCIO <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/marketplace" className="bg-white/10 text-brand-surface border border-white/20 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all backdrop-blur-md">
                    VER O MARKETPLACE
                  </Link>
               </div>
            </div>
            <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-brand-primary/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]"></div>
         </div>
      </section>

    </div>
  );
};

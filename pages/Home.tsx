
import React, { useEffect, useState } from 'react';
import { mockBackend } from '../services/mockBackend';
import { Offer, OfferCategory } from '../types';
import { OfferCard } from '../components/OfferCard';
import { Search, MapPin, ArrowRight, Zap, Briefcase, ShoppingBag, Heart, Home as HomeIcon, CheckCircle, Sparkles, HelpCircle, ChevronDown } from 'lucide-react';
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
    { title: 'Serviços', val: OfferCategory.SERVICOS_PROFISSIONAIS, icon: Briefcase, color: 'text-brand-primary', bg: 'bg-white' },
    { title: 'Negócios', val: OfferCategory.NEGOCIOS_LOCAIS, icon: ShoppingBag, color: 'text-brand-contrast', bg: 'bg-white' },
    { title: 'Saúde', val: OfferCategory.SAUDE_BEM_ESTAR, icon: Heart, color: 'text-rose-600', bg: 'bg-white' },
    { title: 'Imóveis', val: OfferCategory.IMOVEIS_SERVICOS, icon: HomeIcon, color: 'text-brand-accent', bg: 'bg-white' }
  ];

  const faqs = [
    {
      q: "O que é o Menu de Negócios?",
      a: "Somos uma plataforma de conexão local inteligente que permite a empreendedores, freelancers e profissionais liberais criarem vitrines digitais de alto impacto para atrair clientes do seu próprio bairro ou cidade."
    },
    {
      q: "Realmente não há taxas de venda?",
      a: "Exatamente. O lucro das suas vendas é 100% seu. Nós não intermediamos o pagamento com cobrança de comissões. Facilitamos o contato direto via WhatsApp ou seu próprio catálogo digital."
    },
    {
        q: "Como funciona o Clube ADS?",
        a: "Ao utilizar a plataforma, completar seu perfil e indicar outros empreendedores, você ganha pontos. Esses pontos aumentam seu nível de autoridade na rede e podem ser trocados por recompensas exclusivas."
    }
  ];

  return (
    <div className="flex flex-col bg-brand-surface">
      
      {/* 1. HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-6 py-12 lg:py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-10 animate-in fade-in slide-in-from-left-10 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-primary/20">
             <Zap className="w-3 h-3 text-brand-primary fill-current animate-pulse" /> Onde seu bairro acontece
          </div>
          
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-black text-brand-contrast tracking-tighter leading-none">
              Menu de <br/>
              <span className="text-brand-primary">Negócios.</span>
            </h1>
            <p className="text-xl text-brand-contrast/70 font-bold leading-relaxed max-w-xl">
              Conectamos empreendedores locais a consumidores reais. Sem taxas de comissão, sem barreiras digitais.
            </p>
          </div>

          <div className="bg-white p-2 rounded-[2.5rem] shadow-xl border border-brand-secondary/30 flex flex-col md:flex-row gap-2 max-w-2xl ring-4 ring-brand-primary/5">
             <div className="flex-1 relative flex items-center px-4">
                <Search className="w-5 h-5 text-brand-secondary absolute left-6" />
                <input 
                  type="text" 
                  placeholder="O que você busca?" 
                  className="w-full bg-transparent border-none p-4 pl-10 font-black text-brand-contrast focus:ring-0 placeholder:text-brand-secondary"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
             </div>
             <div className="w-px h-8 bg-brand-secondary/20 hidden md:block self-center"></div>
             <div className="flex-1 relative flex items-center px-4">
                <MapPin className="w-5 h-5 text-brand-secondary absolute left-6" />
                <input 
                  type="text" 
                  placeholder="Sua Cidade" 
                  className="w-full bg-transparent border-none p-4 pl-10 font-black text-brand-contrast focus:ring-0 placeholder:text-brand-secondary"
                  value={filters.city}
                  onChange={(e) => setFilters({...filters, city: e.target.value})}
                />
             </div>
             <button className="bg-brand-primary text-white px-10 py-4 rounded-[1.8rem] font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-xl active:scale-95">
                BUSCAR
             </button>
          </div>

          <div className="flex items-center gap-8 pt-4">
             <div className="flex items-center gap-2 text-[10px] font-black text-brand-contrast uppercase tracking-widest">
                <CheckCircle className="w-4 h-4 text-brand-primary" /> Cadastro Gratuito
             </div>
             <div className="flex items-center gap-2 text-[10px] font-black text-brand-contrast uppercase tracking-widest">
                <Sparkles className="w-4 h-4 text-brand-accent" /> Marketing com IA
             </div>
          </div>
        </div>

        <div className="relative animate-in fade-in slide-in-from-right-10 duration-1000 delay-200">
           <div className="relative z-10 aspect-square rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white ring-1 ring-brand-secondary/20">
              <img 
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1600" 
                className="w-full h-full object-cover"
                alt="Equipe"
              />
              <div className="absolute inset-0 bg-brand-primary/10"></div>
           </div>
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none"></div>
           <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      </section>

      {/* 2. CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto w-full px-6 py-24 space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-brand-contrast tracking-tight leading-none">Explore por <br/>Categorias.</h2>
              <p className="text-brand-secondary font-bold max-w-md">Encontre parceiros e serviços verificados no seu bairro.</p>
           </div>
           <Link to="/categories" className="px-8 py-3 bg-brand-contrast text-brand-surface rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary transition-all flex items-center gap-3">VER TODAS <ArrowRight className="w-4 h-4" /></Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setFilters({...filters, category: cat.val})}
              className={`group bg-white p-10 rounded-[3rem] border border-brand-secondary/30 shadow-sm flex flex-col items-center text-center space-y-6 hover:shadow-2xl hover:-translate-y-2 transition-all ${filters.category === cat.val ? 'ring-4 ring-brand-primary/10 border-brand-primary' : ''}`}
            >
              <div className={`w-16 h-16 rounded-[1.8rem] ${cat.bg} ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm border border-brand-secondary/10`}>
                 <cat.icon className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-black text-brand-contrast">{cat.title}</h4>
                <p className="text-[10px] font-black text-brand-secondary uppercase tracking-widest mt-1">Verificados</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. FEATURED OFFERS */}
      <section className="bg-brand-secondary/5 py-24 border-y border-brand-secondary/20">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4">
             <h2 className="text-4xl md:text-5xl font-black text-brand-contrast tracking-tight">Destaques Locais</h2>
             <p className="text-brand-secondary font-bold max-w-2xl mx-auto">Confira as melhores ofertas e serviços da nossa rede hoje.</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[1, 2, 3].map(i => <div key={i} className="bg-white h-[450px] rounded-[3rem] border border-brand-secondary/20 animate-pulse"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {offers.map(offer => <OfferCard key={offer.id} offer={offer} />)}
            </div>
          )}
        </div>
      </section>

      {/* 4. FAQ */}
      <section className="max-w-4xl mx-auto w-full px-6 py-24">
         <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-accent/10 text-brand-contrast rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-accent/30">
               <HelpCircle className="w-3 h-3 text-brand-primary" /> Central de Dúvidas
            </div>
            <h2 className="text-4xl font-black text-brand-contrast">Perguntas Frequentes</h2>
         </div>

         <div className="space-y-4">
            {faqs.map((faq, idx) => (
               <div key={idx} className="bg-white rounded-3xl border border-brand-secondary/30 overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-8 flex items-center justify-between text-left group"
                  >
                     <span className={`text-lg font-black transition-colors ${openFaq === idx ? 'text-brand-primary' : 'text-brand-contrast group-hover:text-brand-primary'}`}>
                        {faq.q}
                     </span>
                     <div className={`p-2 rounded-xl transition-all ${openFaq === idx ? 'bg-brand-primary text-white rotate-180' : 'bg-brand-surface text-brand-secondary group-hover:bg-brand-primary group-hover:text-white'}`}>
                        <ChevronDown className="w-5 h-5" />
                     </div>
                  </button>
                  {openFaq === idx && (
                     <div className="px-8 pb-8 animate-fade-in">
                        <div className="h-px bg-brand-surface mb-6"></div>
                        <p className="text-brand-secondary font-bold leading-relaxed">{faq.a}</p>
                     </div>
                  )}
               </div>
            ))}
         </div>
      </section>

      {/* 5. CTA */}
      <section className="max-w-7xl mx-auto w-full px-6 py-16">
         <div className="bg-brand-contrast rounded-[3rem] p-10 md:p-16 text-center text-brand-surface relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
               <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-none">Venda no digital sem taxas de venda.</h2>
               <p className="text-brand-secondary text-lg font-bold">O lucro é 100% seu. Oferecemos a vitrine, você faz o show.</p>
               <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                  <Link to="/register" className="bg-brand-primary text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-3">
                    CADASTRAR GRÁTIS <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/plans" className="bg-white/10 text-brand-surface border border-white/20 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all backdrop-blur-md">
                    VER PLANOS PRO
                  </Link>
               </div>
            </div>
            <div className="absolute top-0 left-0 w-72 h-72 bg-brand-primary/10 rounded-full blur-[100px]"></div>
         </div>
      </section>

    </div>
  );
};

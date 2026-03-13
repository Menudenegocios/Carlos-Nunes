import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { Profile, BlogPost } from '../types';
import { 
  ArrowRight, Globe, Settings, TrendingUp, 
  CheckCircle, Star, ArrowUpRight, BookOpen,
  Search, MapPin, Store, Users, Calendar, Briefcase, Award,
  HelpCircle, ChevronDown
} from 'lucide-react';

import { AIChatAgent } from '../components/AIChatAgent';

export const Home: React.FC = () => {
  const [featuredProfiles, setFeaturedProfiles] = useState<Profile[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [filters, setFilters] = useState({ search: '', city: '', category: '' });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profiles, posts] = await Promise.all([
        supabaseService.getPublishedProfiles(),
        supabaseService.getBlogPosts()
      ]);
      
      // Get top 4 profiles (e.g., just the first 4 published)
      const sortedProfiles = profiles.slice(0, 4);
      setFeaturedProfiles(sortedProfiles);

      // Get 3 most recent posts
      const sortedPosts = posts.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      }).slice(0, 3);
      setRecentPosts(sortedPosts);
    } catch (error) {
      console.error("Error loading home data:", error);
    }
  };

  return (
    <div 
      className="flex flex-col transition-colors duration-500"
      style={{ backgroundColor: 'var(--bg-main)' }}
    >
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/5 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/5 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow-xl rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-gray-100">
                <Star className="w-4 h-4 text-brand-primary fill-current" /> O Ecossistema Definitivo
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9]">
              A Plataforma <span className="text-brand-primary italic">All-in-One</span> <br className="hidden md:block"/> para conectar, gerenciar e escalar o seu negócio.
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed">
              Abandone as planilhas e dezenas de aplicativos. Tenha sua vitrine digital, CRM, agenda, controle financeiro e networking B2B em um único ecossistema.
            </p>
            
            {/* Smart Search Bar */}
            <div className="max-w-4xl mx-auto pt-8">
                <div className="bg-white p-3 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col md:flex-row gap-2 ring-8 ring-brand-primary/5">
                    <div className="flex-1 relative flex items-center px-6">
                        <Search className="w-6 h-6 text-brand-primary absolute left-8" />
                        <input 
                            type="text" 
                            placeholder="O que você precisa hoje? (Ex: Pizzaria, Mentor...)" 
                            className="w-full bg-transparent border-none py-5 pl-12 font-bold text-lg text-brand-dark focus:ring-0 placeholder:text-gray-400 outline-none"
                            value={filters.search}
                            onChange={(e) => setFilters({...filters, search: e.target.value})}
                        />
                    </div>
                    <div className="w-px h-10 bg-gray-100 hidden md:block self-center"></div>
                    <div className="flex-1 relative flex items-center px-6">
                        <MapPin className="w-6 h-6 text-indigo-600 absolute left-8" />
                        <input 
                            type="text" 
                            placeholder="Sua Cidade ou Região" 
                            className="w-full bg-transparent border-none py-5 pl-12 font-bold text-lg text-brand-dark focus:ring-0 placeholder:text-gray-400 outline-none"
                            value={filters.city}
                            onChange={(e) => setFilters({...filters, city: e.target.value})}
                        />
                    </div>
                    <button className="bg-brand-dark text-white px-12 py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-all shadow-2xl active:scale-95">
                        EXPLORAR
                    </button>
                </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. FERRAMENTAS */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase italic">
              Ferramentas para <span className="text-brand-primary">impulsionar</span> o seu negócio
            </h2>
            <p className="text-lg text-slate-500 font-medium">
              Tudo o que você precisa para atrair clientes, organizar sua rotina e vender mais, sem complicação.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Store, title: 'Vitrine Digital', desc: 'Seu site profissional pronto em minutos. Exponha produtos, serviços e receba pedidos diretamente no seu WhatsApp.', color: 'text-blue-500', bg: 'bg-blue-100' },
              { icon: Users, title: 'CRM de Clientes', desc: 'Acompanhe cada negociação. Saiba exatamente quem são seus clientes, o histórico de compras e não perca nenhuma venda.', color: 'text-emerald-500', bg: 'bg-emerald-100' },
              { icon: Calendar, title: 'Agenda Inteligente', desc: 'Organize seus horários e compromissos. Permita que seus clientes agendem serviços diretamente pela sua vitrine.', color: 'text-purple-500', bg: 'bg-purple-100' },
              { icon: Briefcase, title: 'Marketplace B2B', desc: 'Conecte-se com outros empreendedores. Encontre fornecedores, parceiros de negócios e novas oportunidades na sua região.', color: 'text-amber-500', bg: 'bg-amber-100' },
              { icon: Award, title: 'Programa de Recompensas', desc: 'Ganhe Menu Cash ao indicar a plataforma ou fechar negócios. Troque seus pontos por benefícios exclusivos e destaque.', color: 'text-brand-primary', bg: 'bg-orange-100' },
              { icon: TrendingUp, title: 'Gestão Financeira', desc: 'Controle suas entradas e saídas de forma simples. Tenha clareza sobre o lucro do seu negócio para tomar melhores decisões.', color: 'text-indigo-500', bg: 'bg-indigo-100' }
            ].map((tool, idx) => (
              <div key={idx} className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 hover:shadow-xl transition-all group">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${tool.bg}`}>
                  <tool.icon className={`w-7 h-7 ${tool.color}`} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{tool.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  {tool.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. VITRINES EM DESTAQUE */}
      <section className="py-24 bg-brand-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase italic">
                Empreendedores em <span className="text-brand-primary">Destaque</span>
              </h2>
              <p className="text-lg text-slate-500 font-medium">
                Conheça os negócios que estão escalando e gerando resultados reais na plataforma.
              </p>
            </div>
            <Link to="/vitrine" className="flex items-center gap-2 text-brand-primary font-black uppercase tracking-widest text-sm hover:gap-4 transition-all">
              Ver todas as vitrines <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProfiles.map((profile) => (
              <Link 
                key={profile.id}
                to={profile.slug ? `/${profile.slug}` : `/store/${profile.user_id}`}
                className="bg-white rounded-[2rem] p-6 border border-gray-100 hover:shadow-xl transition-all group flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-gray-50 group-hover:scale-110 transition-transform duration-500">
                  <img src={profile.logo_url || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400'} alt={profile.business_name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-black text-gray-900 text-lg mb-1 line-clamp-1">{profile.business_name}</h3>
                <p className="text-xs font-bold text-brand-primary uppercase tracking-widest mb-4">{profile.category || 'Negócio Local'}</p>
                <div className="mt-auto w-full pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-slate-400 group-hover:text-brand-primary transition-colors">
                  <span className="text-[10px] font-black uppercase tracking-widest">Ver Vitrine</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
            {featuredProfiles.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-500">
                Nenhuma vitrine em destaque no momento.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. COMO FUNCIONA */}
      <section className="py-24 bg-white text-brand-dark relative overflow-hidden transition-colors border-y border-gray-100">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-primary via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-slate-900">
              Transforme a gestão do seu negócio em <span className="text-brand-primary">4 passos</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Configure seu Perfil', desc: 'Crie sua vitrine digital e seu link personalizado em minutos.' },
              { step: '02', title: 'Organize sua Operação', desc: 'Cadastre produtos, serviços e centralize seus clientes no CRM.' },
              { step: '03', title: 'Expanda seu Networking', desc: 'Conecte-se no Marketplace B2B e interaja na Comunidade.' },
              { step: '04', title: 'Alcance Novos Níveis', desc: 'Acumule pontos por resultados e desbloqueie benefícios exclusivos.' }
            ].map((item, idx) => (
              <div key={idx} className="relative p-8 rounded-[2rem] bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-all">
                <div className="text-5xl font-black text-brand-primary/10 mb-6 italic">{item.step}</div>
                <h3 className="text-xl font-black mb-3">{item.title}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BLOG & CONTEÚDO */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase italic">
                Insights para o seu <span className="text-brand-primary">Crescimento</span>
              </h2>
              <p className="text-lg text-slate-500 font-medium">
                Artigos, dicas e estratégias para ajudar você a escalar sua empresa.
              </p>
            </div>
            <Link to="/blog" className="flex items-center gap-2 text-brand-primary font-black uppercase tracking-widest text-sm hover:gap-4 transition-all">
              Acessar o Blog Completo <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`} className="group flex flex-col bg-gray-50 rounded-[2rem] overflow-hidden border border-gray-100 hover:shadow-xl transition-all">
                <div className="h-48 overflow-hidden relative">
                  <img src={post.image_url || 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&q=80&w=800'} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-brand-primary">
                    {post.category || 'Artigo'}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-black text-gray-900 mb-3 line-clamp-2 group-hover:text-brand-primary transition-colors">{post.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1">{post.summary}</p>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mt-auto pt-4 border-t border-gray-200">
                    <span>{post.date}</span>
                    <span className="flex items-center gap-1 text-brand-primary group-hover:gap-2 transition-all">Ler Artigo <ArrowRight className="w-3 h-3" /></span>
                  </div>
                </div>
              </Link>
            ))}
            {recentPosts.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-500">
                Nenhum artigo publicado ainda.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                <HelpCircle className="w-4 h-4" /> Dúvidas Comuns
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase italic">
              Perguntas <span className="text-brand-primary">Frequentes</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { q: "O que é o Menu de Negócios?", a: "É uma plataforma completa que une vitrine digital, CRM, agendamento e marketplace B2B para impulsionar seu negócio." },
              { q: "Quanto custa para usar?", a: "Temos planos de adesão flexíveis para começar e opções premium com recursos avançados como domínio personalizado e taxas menores." },
              { q: "Preciso ter CNPJ?", a: "Não! Você pode começar como autônomo ou freelancer e profissionalizar sua gestão conosco." },
              { q: "Como funciona o Programa de Recompensas?", a: "Você ganha pontos (Menu Cash) ao completar tarefas, indicar amigos e fechar negócios, trocando por benefícios exclusivos." },
              { q: "Posso cancelar quando quiser?", a: "Sim, não temos fidelidade. Você tem total liberdade sobre sua assinatura." }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden transition-all hover:shadow-lg">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-black text-gray-900 text-lg">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === idx ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="px-6 pb-6 text-slate-500 font-medium leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CHAMADA FINAL */}
      <section className="py-32 relative overflow-hidden bg-brand-surface">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000" alt="Equipe trabalhando" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-brand-surface/80 to-transparent"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-10">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white shadow-xl rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-gray-100">
            <CheckCircle className="w-4 h-4 text-emerald-500" /> O Próximo Passo
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight tracking-tighter uppercase italic overflow-visible">
            Pronto para elevar o nível do seu <span className="text-brand-primary title-fix">negócio?</span>
          </h2>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
            Junte-se ao ecossistema que centraliza e impulsiona o empreendedorismo.
          </p>
          <div className="pt-8">
            <Link to="/register" className="inline-flex items-center gap-3 bg-brand-primary text-white px-12 py-6 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
              Criar Minha Conta <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Assistente de IA Global (Apenas na Home) */}
      <AIChatAgent />

    </div>
  );
};

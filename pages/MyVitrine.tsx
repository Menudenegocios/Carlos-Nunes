
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// Added LayoutGrid to the imports from lucide-react
import { 
  Store, Smartphone, Package, BookOpen, 
  Eye, ArrowUpRight, Plus, Trash2, Edit2, Calendar,
  X, Send, RefreshCw, Image as ImageIcon, Camera, Sparkles,
  Home as HomeIcon, Layout, FileText, ChevronRight, AlignLeft,
  Quote, Palette, Share2, Settings, ListTodo, Medal, Gift, History,
  LayoutGrid
} from 'lucide-react';
import { BioBuilder } from './BioBuilder';
import { MyCatalog } from './MyCatalog';
import { mockBackend } from '../services/mockBackend';
import { BlogPost } from '../types';
import { SectionLanding } from '../components/SectionLanding';

type VitrineTab = 'bio' | 'catalog' | 'blog';

export const MyVitrine: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<VitrineTab>('bio');
  
  // States para sub-abas (reseta ao trocar de activeTab)
  const [bioSubTab, setBioSubTab] = useState('home');
  const [catalogSubTab, setCatalogSubTab] = useState('home');
  const [blogSubTab, setBlogSubTab] = useState('home');

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoadingBlog, setIsLoadingBlog] = useState(false);

  // Troca de aba principal reseta para Início
  const handleTabChange = (tab: VitrineTab) => {
    setActiveTab(tab);
    setBioSubTab('home');
    setCatalogSubTab('home');
    setBlogSubTab('home');
  };

  useEffect(() => {
    if (activeTab === 'blog') loadBlogData();
  }, [activeTab]);

  const loadBlogData = async () => {
    if (!user) return;
    setIsLoadingBlog(true);
    try {
      const posts = await mockBackend.getBlogPosts();
      setBlogPosts(posts.filter(p => p.userId === user.id));
    } finally {
      setIsLoadingBlog(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 animate-[fade-in_0.4s_ease-out] font-sans">
      
      {/* 1. NAVEGAÇÃO SUPERIOR (HUB) */}
      <div className="bg-[#0F172A] rounded-[2.5rem] p-4 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/5 shadow-2xl">
        <div className="flex bg-white/5 rounded-[1.8rem] p-1.5 gap-1 overflow-x-auto scrollbar-hide">
          {[
            { id: 'bio', label: 'BIO DIGITAL', desc: 'Links e Estilo', icon: Smartphone },
            { id: 'catalog', label: 'CATÁLOGO & LOJA', desc: 'Produtos/Vendas', icon: Package },
            { id: 'blog', label: 'BLOG & ARTIGOS', desc: 'Autoridade', icon: BookOpen },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => handleTabChange(tab.id as VitrineTab)} 
              className={`flex items-center gap-3 px-8 py-4 rounded-[1.4rem] transition-all duration-300 whitespace-nowrap ${activeTab === tab.id ? 'bg-[#F67C01] text-white shadow-lg scale-105' : 'text-slate-400 hover:bg-white/5'}`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-brand-primary'}`} />
              <div className="text-left">
                <p className="font-black text-[11px] tracking-widest uppercase italic leading-none">{tab.label}</p>
                <p className={`text-[8px] font-medium opacity-60 ${activeTab === tab.id ? 'text-white' : ''}`}>{tab.desc}</p>
              </div>
            </button>
          ))}
        </div>
        
        <a 
          href={`/#/store/${user.id}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-8 py-5 bg-white/5 text-white border border-white/10 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
        >
          <Eye className="w-4 h-4" /> VER MINHA VITRINE <ArrowUpRight className="w-4 h-4 opacity-30" />
        </a>
      </div>

      {/* 2. CONTEÚDO DINÂMICO CONFORME O HUB */}
      <div className="bg-[#0F172A] rounded-[3.5rem] p-8 md:p-12 border border-white/5 shadow-2xl space-y-12 min-h-[700px]">
        
        {/* RENDERIZADOR DA FERRAMENTA SELECIONADA */}
        {activeTab === 'bio' && (
          <ToolLayout 
            title="BIO DIGITAL" 
            icon={Smartphone} 
            subTabs={[
              { id: 'home', label: 'INÍCIO', desc: 'Painel geral', icon: HomeIcon },
              { id: 'content', label: 'CONTEÚDO', desc: 'Links e bio', icon: AlignLeft },
              { id: 'social', label: 'PROVA SOCIAL', desc: 'Depoimentos', icon: Quote },
              { id: 'blog_link', label: 'BLOG', desc: 'Artigos', icon: BookOpen },
              { id: 'design', label: 'DESIGN', desc: 'Temas e cores', icon: Palette },
              { id: 'share', label: 'ATIVAR', desc: 'Compartilhar', icon: Share2 },
            ]}
            activeSubTab={bioSubTab}
            onSubTabChange={setBioSubTab}
          >
            {bioSubTab === 'home' ? (
              <SectionLanding 
                title="Sua presença profissional em um único link."
                subtitle="Cartão Digital Inteligente"
                description="Crie uma vitrine premium que reúne contatos, depoimentos e seu catálogo em uma interface elegante feita para converter."
                benefits={["Design mobile-first", "Integração direta com catálogo", "Bloco de depoimentos", "SEO Otimizado"]}
                youtubeId="dQw4w9WgXcQ"
                ctaLabel="TURBINAR MINHA BIO"
                onStart={() => setBioSubTab('content')}
                icon={Smartphone}
              />
            ) : <div className="text-white text-center py-20 opacity-40">Funcionalidade do Editor em desenvolvimento...</div>}
          </ToolLayout>
        )}

        {activeTab === 'catalog' && (
          <ToolLayout 
            title="CATÁLOGO & LOJA" 
            icon={Package} 
            subTabs={[
              { id: 'home', label: 'INÍCIO', desc: 'Boas-vindas', icon: HomeIcon },
              { id: 'identity', label: 'IDENTIDADE', desc: 'Marca e logo', icon: Store },
              { id: 'ops', label: 'OPERAÇÃO', desc: 'Configurações', icon: Settings },
              { id: 'cats', label: 'CATEGORIAS', desc: 'Organização', icon: LayoutGrid },
              { id: 'products', label: 'PRODUTOS', desc: 'Gerenciar itens', icon: Package },
            ]}
            activeSubTab={catalogSubTab}
            onSubTabChange={setCatalogSubTab}
          >
            {catalogSubTab === 'home' ? (
              <SectionLanding 
                title="Sua vitrine digital que vende 24h por dia."
                subtitle="Catálogo & Loja Online"
                description="Organize seus produtos e serviços em uma vitrine profissional de alta conversão. Receba pedidos direto no Zap."
                benefits={["Cadastro ilimitado", "Pedidos no WhatsApp", "Gestão de Estoque", "Checkout Rápido"]}
                youtubeId="dQw4w9WgXcQ"
                ctaLabel="CADASTRAR PRODUTOS"
                onStart={() => setCatalogSubTab('identity')}
                icon={Package}
              />
            ) : <div className="text-white text-center py-20 opacity-40">Funcionalidade do Catálogo em desenvolvimento...</div>}
          </ToolLayout>
        )}

        {activeTab === 'blog' && (
          <ToolLayout 
            title="BLOG & ARTIGOS" 
            icon={BookOpen} 
            subTabs={[
              { id: 'home', label: 'INÍCIO', desc: 'Destaques', icon: HomeIcon },
              { id: 'manage', label: 'GESTÃO', desc: 'Seus artigos', icon: FileText },
            ]}
            activeSubTab={blogSubTab}
            onSubTabChange={setBlogSubTab}
          >
            {blogSubTab === 'home' ? (
              <SectionLanding 
                title="Gere autoridade e eduque seu bairro."
                subtitle="Blog & Artigos"
                description="Escreva artigos sobre seu nicho de atuação para atrair clientes qualificados. Conteúdos educativos ajudam seu perfil a aparecer melhor no Google."
                benefits={["Publicação direta no blog principal", "SEO regional otimizado", "Aumento do índice de confiança", "Compartilhamento fácil"]}
                youtubeId="dQw4w9WgXcQ"
                ctaLabel="GERENCIAR MEUS ARTIGOS"
                onStart={() => setBlogSubTab('manage')}
                icon={BookOpen}
              />
            ) : (
              <div className="space-y-8 animate-fade-in">
                <div className="flex justify-between items-center px-4">
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Sua Biblioteca</h3>
                  <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2">
                    <Plus className="w-4 h-4" /> NOVO ARTIGO
                  </button>
                </div>
                {isLoadingBlog ? (
                  <div className="text-center py-20 text-slate-400">Carregando...</div>
                ) : (
                  <div className="grid gap-4">
                    {blogPosts.map(post => (
                      <div key={post.id} className="p-6 bg-white/5 rounded-[2rem] border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-6">
                           <img src={post.imageUrl} className="w-16 h-16 rounded-2xl object-cover" />
                           <div>
                              <h4 className="font-black text-white text-lg uppercase italic">{post.title}</h4>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{post.category} • {post.date}</p>
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <button className="p-3 bg-white/5 rounded-xl text-indigo-400"><Edit2 className="w-4 h-4" /></button>
                           <button className="p-3 bg-white/5 rounded-xl text-rose-400"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </ToolLayout>
        )}

      </div>
    </div>
  );
};

// COMPONENTE DE CABEÇALHO E SUB-NAVEGAÇÃO (ESTILO IMAGEM)
interface ToolLayoutProps {
  title: string;
  icon: any;
  subTabs: { id: string, label: string, desc: string, icon: any }[];
  activeSubTab: string;
  onSubTabChange: (id: string) => void;
  children: React.ReactNode;
}

const ToolLayout: React.FC<ToolLayoutProps> = ({ title, icon: Icon, subTabs, activeSubTab, onSubTabChange, children }) => {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header Banner PRO */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white/5 rounded-[1.8rem] flex items-center justify-center border border-white/10 shadow-inner">
             <Icon className="w-10 h-10 text-[#F67C01]" />
          </div>
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
              {title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#9333EA] to-pink-500">PRO</span>
            </h2>
            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.25em] mt-2">TRANSFORME SUA PRESENÇA EM RESULTADO REAL.</p>
          </div>
        </div>
        <button className="bg-[#F67C01] text-white px-12 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_20px_50px_-10px_rgba(246,124,1,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
          <Plus className="w-5 h-5" /> PUBLICAR AGORA
        </button>
      </div>

      {/* Sub-Navegação de Funções */}
      <div className="bg-white/5 rounded-[2.5rem] p-1.5 flex gap-1 overflow-x-auto scrollbar-hide border border-white/5">
        {subTabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => onSubTabChange(tab.id)}
            className={`flex items-center gap-4 px-8 py-4 rounded-[1.8rem] transition-all min-w-[160px] ${activeSubTab === tab.id ? 'bg-[#F67C01] text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}
          >
            <tab.icon className={`w-4 h-4 ${activeSubTab === tab.id ? 'text-white' : 'text-[#F67C01]'}`} />
            <div className="text-left">
              <p className="font-black text-[10px] uppercase tracking-widest leading-none mb-1 italic">{tab.label}</p>
              <p className={`text-[8px] font-medium opacity-50 ${activeSubTab === tab.id ? 'text-white' : ''}`}>{tab.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Área de Conteúdo da Aba */}
      <div className="pt-4">
        {children}
      </div>
    </div>
  );
};

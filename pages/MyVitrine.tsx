
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
  LayoutGrid, Clock
} from 'lucide-react';
import { BioBuilder } from './BioBuilder';
import { MyCatalog } from './MyCatalog';
import { mockBackend } from '../services/mockBackend';
import { BlogPost } from '../types';
import { SectionLanding } from '../components/SectionLanding';

type VitrineTab = 'inicio' | 'resumo' | 'identidade' | 'blog_seo' | 'todos' | 'produtos' | 'projetos' | 'configuracoes';

export const MyVitrine: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<VitrineTab>('inicio');
  
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoadingBlog, setIsLoadingBlog] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [allVitrines, setAllVitrines] = useState<Profile[]>([]);

  // Troca de aba principal
  const handleTabChange = (tab: VitrineTab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (activeTab === 'blog_seo') loadBlogData();
    if (activeTab === 'produtos') loadCatalogData();
    if (activeTab === 'projetos') loadProjectsData();
    if (activeTab === 'todos') loadAllVitrinesData();
  }, [activeTab]);

  const loadAllVitrinesData = async () => {
    const vitrines = await mockBackend.getAllProfiles();
    setAllVitrines(vitrines);
  };

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

  const loadCatalogData = async () => {
    if (!user) return;
    const products = await mockBackend.getProducts(user.id);
    setProducts(products);
    const coupons = await mockBackend.getCoupons(user.id);
    setCoupons(coupons);
  };

  const loadProjectsData = async () => {
    if (!user) return;
    const projects = await mockBackend.getProjects(user.id);
    setProjects(projects);
  };

  // Handlers para Projetos
  const handleCreateProject = async () => {
    if (!user) return;
    const newProject: Omit<Project, 'id' | 'createdAt'> = {
      userId: user.id,
      name: 'Novo Projeto',
      description: 'Descrição'
    };
    await mockBackend.createProject(newProject);
    loadProjectsData();
  };

  const handleDeleteProject = async (id: string) => {
    await mockBackend.deleteProject(id);
    loadProjectsData();
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 animate-[fade-in_0.4s_ease-out] font-sans">
      
      {/* 1. NAVEGAÇÃO SUPERIOR (HUB) */}
      <div className="bg-[#0F172A] rounded-[2.5rem] p-4 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/5 shadow-2xl">
        <div className="flex bg-white/5 rounded-[1.8rem] p-1.5 gap-1 overflow-x-auto scrollbar-hide">
          {[
            { id: 'inicio', label: 'INÍCIO', icon: HomeIcon },
            { id: 'resumo', label: 'RESUMO', icon: Layout },
            { id: 'identidade', label: 'IDENTIDADE', icon: Palette },
            { id: 'blog_seo', label: 'BLOG & SEO', icon: BookOpen },
            { id: 'todos', label: 'TODOS', icon: Eye },
            { id: 'produtos', label: 'PRODUTOS', icon: Package },
            { id: 'projetos', label: 'PROJETOS', icon: ListTodo },
            { id: 'configuracoes', label: 'CONFIGURAÇÕES', icon: Settings },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => handleTabChange(tab.id as VitrineTab)} 
              className={`flex items-center gap-3 px-8 py-4 rounded-[1.4rem] transition-all duration-300 whitespace-nowrap ${activeTab === tab.id ? 'bg-[#F67C01] text-white shadow-lg scale-105' : 'text-slate-400 hover:bg-white/5'}`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-brand-primary'}`} />
              <p className="font-black text-[11px] tracking-widest uppercase italic leading-none">{tab.label}</p>
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

      {/* 2. CONTEÚDO DINÂMICO */}
      <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] p-8 md:p-12 border border-gray-100 dark:border-zinc-800 shadow-xl space-y-12 min-h-[700px]">
        <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">
          {activeTab === 'inicio' && 'Início'}
          {activeTab === 'resumo' && 'Resumo da Vitrine'}
          {activeTab === 'identidade' && 'Identidade: Marca e Logo'}
          {activeTab === 'blog_seo' && 'Blog & SEO: Gerar Autoridade'}
          {activeTab === 'produtos' && 'Produtos: Itens & Categorias'}
          {activeTab === 'configuracoes' && 'Configurações'}
        </h2>
        {activeTab === 'inicio' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#0F172A] p-10 rounded-[3rem] border border-white/5 shadow-xl text-white">
              <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Início</h3>
              <p className="text-white">Bem-vindo à sua vitrine inteligente. Gerencie sua presença digital aqui.</p>
            </div>
          </div>
        )}

        {activeTab === 'resumo' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#0F172A] p-10 rounded-[3rem] border border-white/5 shadow-xl text-white">
              <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Funil de Vendas</h3>
              <p className="text-white">Gestão de leads e acompanhamento de vendas.</p>
            </div>
            <div className="bg-[#0F172A] p-10 rounded-[3rem] border border-white/5 shadow-xl text-white">
              <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Caixa</h3>
              <p className="text-white">Controle financeiro e lançamentos.</p>
            </div>
            <div className="bg-[#0F172A] p-10 rounded-[3rem] border border-white/5 shadow-xl text-white">
              <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">MenuZap</h3>
              <p className="text-white">Gerenciamento de mensagens e automação no WhatsApp.</p>
            </div>
          </div>
        )}

        {activeTab === 'todos' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#0F172A] p-10 rounded-[3rem] border border-white/5 shadow-xl text-white">
              <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-8">Todas as Vitrines</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allVitrines.map(vitrine => (
                  <div key={vitrine.id} className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <h4 className="text-xl font-bold mb-2">{vitrine.businessName}</h4>
                    <p className="text-white/70 text-sm">{vitrine.category}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'produtos' && (
          <div className="space-y-12 animate-fade-in">
            {/* Seção Produtos */}
            <div className="bg-[#0F172A] p-10 rounded-[3rem] border border-white/5 shadow-xl text-white">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Itens do Catálogo</h3>
                  <p className="text-white">Produtos ou serviços que aparecem na sua Vitrine.</p>
                </div>
                <button onClick={handleCreateProduct} className="bg-[#F67C01] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                  ADICIONAR ITEM
                </button>
              </div>
              <div className="grid gap-4">
                {products.map(product => (
                  <div key={product.id} className="bg-white/10 p-6 rounded-2xl flex justify-between items-center">
                    <span>{product.name} - R$ {product.price}</span>
                    <div className="flex gap-2">
                       <button className="bg-white/10 text-white px-4 py-2 rounded-xl text-[10px] uppercase font-black">EDITAR</button>
                       <button onClick={() => handleDeleteProduct(product.id)} className="bg-rose-600 text-white px-4 py-2 rounded-xl text-[10px] uppercase font-black">EXCLUIR</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seção Cupons */}
            <div className="bg-[#F67C01] p-10 rounded-[3rem] border border-white/10 shadow-xl text-white">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Cupons de Desconto</h3>
                  <p className="text-white">Crie promoções para atrair mais clientes.</p>
                </div>
                <button onClick={handleCreateCoupon} className="bg-white text-[#F67C01] px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                  NOVO CUPOM
                </button>
              </div>
              <div className="grid gap-4">
                {coupons.map(coupon => (
                  <div key={coupon.id} className="bg-white/30 p-6 rounded-2xl flex justify-between items-center">
                    <span>{coupon.title} ({coupon.code})</span>
                    <div className="flex gap-2">
                       <button className="bg-white/20 text-white px-4 py-2 rounded-xl text-[10px] uppercase font-black">EDITAR</button>
                       <button onClick={() => handleDeleteCoupon(coupon.id)} className="bg-rose-600 text-white px-4 py-2 rounded-xl text-[10px] uppercase font-black">EXCLUIR</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projetos' && (
          <div className="space-y-12 animate-fade-in">
            <div className="bg-[#0F172A] p-10 rounded-[3rem] border border-white/5 shadow-xl text-white">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Meus Projetos</h3>
                  <p className="text-white">Gerencie seus projetos aqui.</p>
                </div>
                <button onClick={handleCreateProject} className="bg-[#F67C01] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                  NOVO PROJETO
                </button>
              </div>
              <div className="grid gap-4">
                {projects.map(project => (
                  <div key={project.id} className="bg-white/10 p-6 rounded-2xl flex justify-between items-center">
                    <span>{project.name}</span>
                    <div className="flex gap-2">
                       <button className="bg-white/10 text-white px-4 py-2 rounded-xl text-[10px] uppercase font-black">EDITAR</button>
                       <button onClick={() => handleDeleteProject(project.id)} className="bg-rose-600 text-white px-4 py-2 rounded-xl text-[10px] uppercase font-black">EXCLUIR</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

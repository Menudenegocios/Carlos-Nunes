
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

type VitrineTab = 'inicio' | 'resumo' | 'identidade' | 'blog_seo' | 'produtos' | 'configuracoes';

export const MyVitrine: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<VitrineTab>('inicio');
  
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoadingBlog, setIsLoadingBlog] = useState(false);

  // Troca de aba principal
  const handleTabChange = (tab: VitrineTab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (activeTab === 'blog_seo') loadBlogData();
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
            { id: 'inicio', label: 'INÍCIO', icon: HomeIcon },
            { id: 'resumo', label: 'RESUMO', icon: Layout },
            { id: 'identidade', label: 'IDENTIDADE', icon: Palette },
            { id: 'blog_seo', label: 'BLOG & SEO', icon: BookOpen },
            { id: 'produtos', label: 'PRODUTOS', icon: Package },
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

        {activeTab === 'produtos' && (
          <div className="space-y-12 animate-fade-in">
            {/* Seção Produtos */}
            <div className="bg-[#0F172A] p-10 rounded-[3rem] border border-white/5 shadow-xl text-white">
              <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Itens do Catálogo</h3>
              <p className="text-white mb-8">Produtos ou serviços que aparecem na sua Vitrine.</p>
              <div className="flex gap-4">
                <button className="bg-[#F67C01] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                  ADICIONAR ITEM
                </button>
                <button className="bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all">
                  EDITAR
                </button>
                <button className="bg-rose-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all">
                  EXCLUIR
                </button>
              </div>
            </div>

            {/* Seção Cupons */}
            <div className="bg-[#F67C01] p-10 rounded-[3rem] border border-white/10 shadow-xl text-white">
              <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">Cupons de Desconto</h3>
              <p className="text-white mb-8">Crie promoções para atrair mais clientes.</p>
              <div className="flex gap-4">
                <button className="bg-white text-[#F67C01] px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                  NOVO CUPOM
                </button>
                <button className="bg-white/20 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/30 transition-all">
                  EDITAR
                </button>
                <button className="bg-rose-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-all">
                  EXCLUIR
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

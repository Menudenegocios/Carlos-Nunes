
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';
import { BlogPost } from '../types';
import { 
  BookOpen, Plus, FileText, Home as HomeIcon, Layout, 
  ChevronRight, Calendar, Edit2, Trash2, X, Send, RefreshCw,
  Image as ImageIcon, AlignLeft, Type, Sparkles, Camera, ShieldAlert,
  Lock, Crown, Search, Share2, Eye, Briefcase, Smartphone
} from 'lucide-react';
import { SectionLanding } from '../components/SectionLanding';
import { Link } from 'react-router-dom';

export const MyBlog: React.FC = () => {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'home' | 'manage'>('home');
  const [modalTab, setModalTab] = useState<'content' | 'seo' | 'social'>('content');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isAdmin = user?.role === 'admin';
  const hasAccess = isAdmin || (user?.plan !== 'basic');

  const [blogForm, setBlogForm] = useState({
    title: '',
    category: 'Estratégia',
    summary: '',
    content: '',
    image_url: '',
    author: user?.name || '',
    // SEO
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    slug: '',
    alt_text: '',
    google_my_business_sync: false,
    // Social
    og_title: '',
    og_description: '',
    og_image: ''
  });

  useEffect(() => { if (user && hasAccess) loadPosts(); }, [user, hasAccess]);

  const loadPosts = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      if (isAdmin) {
          const { data } = await supabase.from('blog_posts').select('*');
          setPosts(data as any || []);
      } else {
          const { data } = await supabase.from('blog_posts').select('*').eq('user_id', user.id);
          setPosts(data as any || []);
      }
    } finally { setIsLoading(false); }
  };

  if (!hasAccess) {
      return (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
              <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl border border-indigo-100">
                  <Lock className="w-10 h-10 text-indigo-600" />
              </div>
              <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">Blog & Autoridade PRO</h2>
              <p className="text-gray-500 max-w-md text-lg font-medium leading-relaxed mb-10">
                  A ferramenta de criação de Artigos e Blog para o diretório está reservada para assinantes <span className="text-indigo-600 font-bold">PRO</span> e <span className="text-emerald-600 font-bold">Business</span>.
              </p>
              <Link to="/plans" className="bg-indigo-600 text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
                  <Crown className="w-5 h-5" /> CONHECER PLANOS PRO
              </Link>
          </div>
      );
  }

  const handleOpenModal = (post?: BlogPost) => {
    setModalTab('content');
    if (post) {
      setEditingPost(post);
      setBlogForm({
        title: post.title,
        category: post.category,
        summary: post.summary,
        content: post.content,
        image_url: post.image_url,
        author: post.author,
        seo_title: post.seo_title || '',
        seo_description: post.seo_description || '',
        seo_keywords: post.seo_keywords?.join(', ') || '',
        slug: post.slug || '',
        alt_text: post.alt_text || '',
        google_my_business_sync: post.google_my_business_sync || false,
        og_title: post.og_title || '',
        og_description: post.og_description || '',
        og_image: post.og_image || ''
      });
    } else {
      setEditingPost(null);
      setBlogForm({
        title: '',
        category: 'Marketing',
        summary: '',
        content: '',
        image_url: '',
        author: user?.name || '',
        seo_title: '',
        seo_description: '',
        seo_keywords: '',
        slug: '',
        alt_text: '',
        google_my_business_sync: false,
        og_title: '',
        og_description: '',
        og_image: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Deseja excluir este artigo permanentemente?')) return;
    try {
      await supabase.from('blog_posts').delete().eq('id', id);
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      alert('Erro ao excluir artigo.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBlogForm(prev => ({ ...prev, image_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      const payload = {
        ...blogForm,
        seo_keywords: blogForm.seo_keywords.split(',').map(k => k.trim()).filter(k => k),
        user_id: editingPost?.user_id || user.id,
        date: editingPost?.date || new Date().toLocaleDateString('pt-BR')
      };

      // Mapping to snake_case for the database insertion
      const dbPayload = {
        title: payload.title,
        category: payload.category,
        summary: payload.summary,
        content: payload.content,
        image_url: payload.image_url,
        author: payload.author,
        seo_title: payload.seo_title,
        seo_description: payload.seo_description,
        seo_keywords: payload.seo_keywords,
        slug: payload.slug,
        alt_text: payload.alt_text,
        google_my_business_sync: payload.google_my_business_sync,
        og_title: payload.og_title,
        og_description: payload.og_description,
        og_image: payload.og_image,
        user_id: payload.user_id,
        date: payload.date
      };

      if (editingPost) {
        await supabase.from('blog_posts').update(dbPayload).eq('id', editingPost.id);
      } else {
        await supabase.from('blog_posts').insert([dbPayload]);
      }
      setIsModalOpen(false);
      await loadPosts();
      setActiveSubTab('manage');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-fade-in">
      <div className="bg-[#0F172A] rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/5 rounded-[1.8rem] flex items-center justify-center border border-white/10 shadow-inner">
               <BookOpen className="w-10 h-10 text-[#F67C01]" />
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
                BLOG & SEO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA]">PRO</span>
              </h2>
              <p className="text-slate-400 text-xs font-black uppercase tracking-[0.25em] mt-2">
                {isAdmin ? 'ADMINISTRAÇÃO GLOBAL DE CONTEÚDO' : 'DOMINE AS BUSCAS E GERE AUTORIDADE.'}
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <button onClick={() => handleOpenModal()} className="bg-[#F67C01] text-white px-12 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
              <Plus className="w-5 h-5" /> NOVO ARTIGO
            </button>
            <button onClick={() => { setActiveSubTab('manage'); /* Focus SEO somehow? */ }} className="bg-white/5 text-white px-8 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] border border-white/10 hover:bg-white/10 transition-all flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-brand-primary" /> OTIMIZAÇÃO SEO
            </button>
          </div>
        </div>

        <div className="bg-white/5 rounded-[2.5rem] p-1.5 mt-10 flex gap-1 overflow-x-auto scrollbar-hide border border-white/5 w-fit">
          {[
            { id: 'home', label: 'INÍCIO', desc: 'Destaques', icon: HomeIcon },
            { id: 'manage', label: 'GESTÃO', desc: isAdmin ? 'Todos Artigos' : 'Seus artigos', icon: FileText },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
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
      </div>

      <div className="pt-4 px-2">
        {activeSubTab === 'home' ? (
          <SectionLanding 
            title="Domine as buscas e construa sua Autoridade."
            subtitle="Blog & SEO PRO"
            description="Transforme seu conhecimento em artigos estratégicos que atraem clientes qualificados. Use ferramentas avançadas de SEO e Social Media para garantir que sua mensagem chegue às pessoas certas no Google e nas Redes Sociais."
            summaryText="O Blog de Autoridade é o seu portal de conteúdo estratégico. Aqui você cria artigos otimizados para o Google, compartilha seu conhecimento especializado e atrai novos clientes através de informações que resolvem problemas reais do seu público."
            benefits={[
              "Editor PRO: Crie artigos com formatação rica e imagens de impacto.",
              "SEO Avançado: Personalize títulos, descrições e meta tags para o Google.",
              "Redes Sociais: Configure como seu link aparece no Instagram e WhatsApp.",
              "Tráfego Local: Seja encontrado por pessoas da sua região buscando serviços.",
              "Análise: Acompanhe visualizações e o engajamento de cada artigo."
            ]}
            ctaLabel="GESTÃO DE ARTIGOS"
            onStart={() => setActiveSubTab('manage')}
            icon={BookOpen}
            accentColor="brand"
          />
        ) : (
          <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-gray-100 shadow-xl space-y-8 min-h-[500px]">
            <div className="flex justify-between items-center mb-8">
               <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">{isAdmin ? 'Gerenciamento Global' : 'Sua Biblioteca'}</h3>
                  {isAdmin && <span className="bg-rose-100 text-rose-600 text-[8px] font-black px-2 py-1 rounded-full uppercase">Modo Admin</span>}
               </div>
            </div>
            
            {isLoading ? (
              <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest animate-pulse">Carregando artigos...</div>
            ) : posts.length === 0 ? (
               <div className="py-32 text-center border-4 border-dashed border-gray-50 rounded-[4rem]">
                  <FileText className="w-20 h-20 mx-auto text-slate-100 mb-8" />
                  <p className="text-slate-300 font-black uppercase text-xs tracking-[0.4em]">Nenhum artigo publicado</p>
               </div>
            ) : (
              <div className="grid gap-6">
                {posts.map(post => (
                  <div key={post.id} className="p-8 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 flex flex-col md:flex-row items-center justify-between group hover:bg-white transition-all hover:shadow-2xl">
                    <div className="flex items-center gap-8">
                       <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-lg border-4 border-white">
                          <img src={post.image_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover" />
                       </div>
                       <div>
                          <div className="flex items-center gap-2 mb-2">
                             <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-white px-3 py-1 rounded-lg border border-gray-100 shadow-sm">{post.category}</span>
                             {isAdmin && post.user_id !== user.id && <span className="text-[9px] font-black text-slate-400 uppercase">Autor: {post.author}</span>}
                          </div>
                          <h4 className="font-black text-gray-900 text-2xl uppercase italic tracking-tight leading-tight">{post.title}</h4>
                          <div className="flex items-center gap-4 mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                             <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                             <span className="flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> Publicado</span>
                          </div>
                          <div className="flex items-center gap-3 mt-4">
                            <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                              <Search className="w-3 h-3" /> SEO 92/100
                            </div>
                            <div className="flex items-center gap-1.5 bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                              <Share2 className="w-3 h-3" /> SOCIAL OK
                            </div>
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-3 mt-6 md:mt-0">
                       <button onClick={() => handleOpenModal(post)} className="p-4 bg-white rounded-2xl text-indigo-400 border border-gray-100 shadow-sm hover:scale-110 transition-transform"><Edit2 className="w-5 h-5" /></button>
                       <button onClick={() => handleDeletePost(post.id)} className="p-4 bg-white rounded-2xl text-rose-400 border border-gray-100 shadow-sm hover:scale-110 transition-transform"><Trash2 className="w-5 h-5" /></button>
                       <a href="/#/blog" target="_blank" className="p-4 bg-white rounded-2xl text-emerald-400 border border-gray-100 shadow-sm hover:scale-110 transition-transform"><Send className="w-5 h-5" /></a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
            <div className="bg-white rounded-[3.5rem] w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden border border-white/5 animate-scale-in flex flex-col">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center flex-shrink-0">
                    <div>
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter">{editingPost ? 'Editar Artigo' : 'Novo Artigo PRO'}</h3>
                      <div className="flex gap-4 mt-4">
                        {[
                          { id: 'content', label: 'Conteúdo', icon: AlignLeft },
                          { id: 'seo', label: 'SEO & Google', icon: Search },
                          { id: 'social', label: 'Impulso Social', icon: Share2 }
                        ].map(t => (
                          <button 
                            key={t.id}
                            type="button"
                            onClick={() => setModalTab(t.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${modalTab === t.id ? 'bg-brand-primary text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                          >
                            <t.icon className="w-3 h-3" /> {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide">
                    {modalTab === 'content' && (
                      <div className="grid lg:grid-cols-12 gap-10 animate-fade-in">
                         <div className="lg:col-span-7 space-y-8">
                            <div>
                               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><Type className="w-3 h-3" /> Título do Artigo</label>
                               <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl p-5 font-black text-xl italic tracking-tight" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                               <div>
                                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Categoria</label>
                                  <select className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold" value={blogForm.category} onChange={e => setBlogForm({...blogForm, category: e.target.value})}>
                                     <option>Marketing</option>
                                     <option>Estratégia</option>
                                     <option>Dicas</option>
                                     <option>Novidades</option>
                                     <option>Case de Sucesso</option>
                                  </select>
                               </div>
                               <div>
                                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Autor</label>
                                  <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold" value={blogForm.author} onChange={e => setBlogForm({...blogForm, author: e.target.value})} />
                               </div>
                            </div>

                            <div>
                               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><AlignLeft className="w-3 h-3" /> Resumo</label>
                               <textarea rows={2} required className="w-full bg-gray-50 border-none rounded-2xl p-5 text-sm font-medium leading-relaxed resize-none" value={blogForm.summary} onChange={e => setBlogForm({...blogForm, summary: e.target.value})} />
                            </div>
                         </div>

                         <div className="lg:col-span-5">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><ImageIcon className="w-3 h-3" /> Imagem de Capa</label>
                            <div className="aspect-[4/3] bg-gray-50 rounded-[2.5rem] border-4 border-dashed border-gray-100 relative overflow-hidden group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                               {blogForm.image_url ? <img src={blogForm.image_url} className="w-full h-full object-cover" /> : <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4"><Camera className="w-12 h-12" /><span className="text-[10px] font-black uppercase tracking-[0.2em]">Upload</span></div>}
                               <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                            </div>
                         </div>

                         <div className="lg:col-span-12">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Conteúdo Completo</label>
                            <textarea rows={12} required className="w-full bg-gray-50 border-none rounded-[2.5rem] p-10 text-lg font-medium leading-relaxed" value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} />
                         </div>
                      </div>
                    )}

                    {modalTab === 'seo' && (
                      <div className="space-y-10 animate-fade-in">
                        <div className="grid lg:grid-cols-2 gap-10">
                          <div className="space-y-8">
                            <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Eye className="w-4 h-4 text-brand-primary" /> Preview no Google</h4>
                              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-xl">
                                <p className="text-blue-600 text-xl font-medium hover:underline cursor-pointer truncate">
                                  {blogForm.seo_title || blogForm.title || 'Título do seu artigo aparecerá aqui'}
                                </p>
                                <p className="text-emerald-700 text-sm mt-1 truncate">
                                  https://menudenegocios.com/blog/{blogForm.slug || 'url-amigavel'}
                                </p>
                                <p className="text-slate-600 text-sm mt-2 line-clamp-2">
                                  {blogForm.seo_description || blogForm.summary || 'A descrição que atrai cliques no Google aparecerá aqui para convencer o usuário a entrar.'}
                                </p>
                              </div>
                            </div>

                            <div className="space-y-6">
                              <div>
                                <div className="flex justify-between items-center mb-3 px-1">
                                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Meta Title</label>
                                  <span className={`text-[10px] font-bold ${blogForm.seo_title.length > 60 ? 'text-rose-500' : 'text-slate-400'}`}>{blogForm.seo_title.length}/60</span>
                                </div>
                                <input type="text" className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold" placeholder="Título otimizado para busca" value={blogForm.seo_title} onChange={e => setBlogForm({...blogForm, seo_title: e.target.value})} />
                              </div>
                              <div>
                                <div className="flex justify-between items-center mb-3 px-1">
                                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Meta Description</label>
                                  <span className={`text-[10px] font-bold ${blogForm.seo_description.length > 160 ? 'text-rose-500' : 'text-slate-400'}`}>{blogForm.seo_description.length}/160</span>
                                </div>
                                <textarea rows={3} className="w-full bg-gray-50 border-none rounded-2xl p-5 text-sm font-medium leading-relaxed resize-none" placeholder="Resumo atrativo para os resultados de busca" value={blogForm.seo_description} onChange={e => setBlogForm({...blogForm, seo_description: e.target.value})} />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-8">
                            <div>
                               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">URL Amigável (Slug)</label>
                               <input type="text" className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold" placeholder="ex: como-vender-mais" value={blogForm.slug} onChange={e => setBlogForm({...blogForm, slug: e.target.value})} />
                            </div>
                            
                            <div>
                               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Palavras-Chave</label>
                               <div className="flex flex-wrap gap-2 mb-3">
                                  {blogForm.seo_keywords.split(',').filter(k => k.trim()).map((k, i) => (
                                    <span key={i} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                                      {k.trim()}
                                      <button type="button" onClick={() => setBlogForm({...blogForm, seo_keywords: blogForm.seo_keywords.split(',').filter((_, index) => index !== i).join(',')})}><X className="w-3 h-3" /></button>
                                    </span>
                                  ))}
                               </div>
                               <input type="text" className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold" placeholder="Digite e aperte Enter" onKeyDown={e => {
                                 if (e.key === 'Enter') {
                                   e.preventDefault();
                                   const val = e.currentTarget.value.trim();
                                   if (val) {
                                     setBlogForm({...blogForm, seo_keywords: blogForm.seo_keywords ? `${blogForm.seo_keywords},${val}` : val});
                                     e.currentTarget.value = '';
                                   }
                                 }
                               }} />
                            </div>

                            <div>
                               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Texto Alt da Imagem</label>
                               <input type="text" className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold" placeholder="Descrição da imagem para o Google" value={blogForm.alt_text} onChange={e => setBlogForm({...blogForm, alt_text: e.target.value})} />
                               <p className="text-[9px] text-slate-400 mt-2 italic">Dica: O texto alt ajuda o Google a entender o conteúdo da imagem, melhorando seu ranking.</p>
                            </div>

                            <div className="flex items-center justify-between p-6 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
                              <div>
                                <p className="font-black text-xs uppercase italic text-gray-900">Sincronizar automaticamente com o perfil comercial</p>
                              </div>
                              <button 
                                type="button"
                                onClick={() => setBlogForm({...blogForm, google_my_business_sync: !blogForm.google_my_business_sync})}
                                className={`w-14 h-7 rounded-full transition-all relative ${blogForm.google_my_business_sync ? 'bg-brand-primary' : 'bg-slate-300'}`}
                              >
                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${blogForm.google_my_business_sync ? 'left-8' : 'left-1'}`} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {modalTab === 'social' && (
                      <div className="space-y-10 animate-fade-in">
                        <div className="grid md:grid-cols-2 gap-10">
                          <div className="space-y-8">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Configuração de Preview Social</h4>
                            <div>
                               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Título p/ Redes Sociais</label>
                               <input type="text" className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold" placeholder="Título chamativo para WhatsApp/FB" value={blogForm.og_title} onChange={e => setBlogForm({...blogForm, og_title: e.target.value})} />
                            </div>
                            <div>
                               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Descrição p/ Redes Sociais</label>
                               <textarea rows={3} className="w-full bg-gray-50 border-none rounded-2xl p-5 text-sm font-medium leading-relaxed resize-none" placeholder="Texto que convida ao clique nas redes" value={blogForm.og_description} onChange={e => setBlogForm({...blogForm, og_description: e.target.value})} />
                            </div>
                          </div>

                          <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Preview de Compartilhamento</h4>
                            <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                              <div className="aspect-video bg-slate-100 relative">
                                {blogForm.og_image || blogForm.image_url ? (
                                  <img src={blogForm.og_image || blogForm.image_url} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="h-full flex items-center justify-center text-slate-300"><ImageIcon className="w-12 h-12" /></div>
                                )}
                              </div>
                              <div className="p-6 bg-[#F0F2F5]">
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">MENUDENEGOCIOS.COM</p>
                                <p className="font-bold text-gray-900 text-lg leading-tight truncate">{blogForm.og_title || blogForm.title || 'Título do Post'}</p>
                                <p className="text-slate-500 text-xs mt-1 line-clamp-1">{blogForm.og_description || blogForm.summary || 'Resumo do conteúdo...'}</p>
                              </div>
                            </div>
                            <button type="button" className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 transition-all">Trocar Imagem Social</button>
                          </div>
                        </div>

                        <div className="pt-10 border-t border-gray-100">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 text-center">Impulso Social & Distribuição</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                              { label: 'WhatsApp', color: 'bg-[#25D366]', icon: Smartphone, action: 'Enviar p/ Grupos' },
                              { label: 'Facebook', color: 'bg-[#1877F2]', icon: Share2, action: 'Postar no Feed' },
                              { label: 'LinkedIn', color: 'bg-[#0A66C2]', icon: Briefcase, action: 'Compartilhar' },
                              { label: 'Instagram', color: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600', icon: Camera, action: 'Criar Story' }
                            ].map(social => (
                              <button key={social.label} type="button" className="p-6 bg-white rounded-[2rem] border border-gray-100 flex flex-col items-center gap-4 hover:scale-105 transition-all shadow-sm group">
                                <div className={`w-14 h-14 ${social.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform`}>
                                  <social.icon className="w-7 h-7" />
                                </div>
                                <div className="text-center">
                                  <p className="font-black text-[10px] uppercase italic text-gray-900">{social.label}</p>
                                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{social.action}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                </form>

                <div className="p-10 bg-gray-50 border-t border-gray-100 flex-shrink-0">
                    <button onClick={handleSubmit} disabled={isSaving} className="w-full bg-[#F67C01] text-white font-black py-6 rounded-[2.5rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-orange-600 transition-all flex items-center justify-center gap-4">
                        {isSaving ? <RefreshCw className="animate-spin w-6 h-6" /> : <><Send className="w-5 h-5" /> PUBLICAR ARTIGO</>}
                    </button>
                </div>
            </div>
         </div>
      )}
    </div>
  );
};

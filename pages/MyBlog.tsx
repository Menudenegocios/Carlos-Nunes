
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { BlogPost } from '../types';
import { 
  BookOpen, Plus, FileText, Home as HomeIcon, Layout, 
  ChevronRight, Calendar, Edit2, Trash2, X, Send, RefreshCw,
  Image as ImageIcon, AlignLeft, Type, Sparkles, Camera, ShieldAlert,
  Lock, Crown
} from 'lucide-react';
import { SectionLanding } from '../components/SectionLanding';
import { Link } from 'react-router-dom';

export const MyBlog: React.FC = () => {
  const { user, realAdmin } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'home' | 'manage'>('home');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isAdmin = user?.role === 'admin' || realAdmin?.role === 'admin';
  const hasAccess = isAdmin || (user?.plan !== 'profissionais');

  const [blogForm, setBlogForm] = useState({
    title: '',
    category: 'Estratégia',
    summary: '',
    content: '',
    imageUrl: '',
    author: user?.name || ''
  });

  useEffect(() => { if (user && hasAccess) loadPosts(); }, [user, hasAccess]);

  const loadPosts = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await mockBackend.getBlogPosts();
      if (isAdmin) {
          setPosts(data);
      } else {
          setPosts(data.filter(p => p.userId === user.id));
      }
    } finally { setIsLoading(false); }
  };

  if (!hasAccess) {
      return (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
              <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-950/20 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl border border-indigo-100 dark:border-indigo-900/30">
                  <Lock className="w-10 h-10 text-indigo-600" />
              </div>
              <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-4">Blog & Autoridade PRO</h2>
              <p className="text-gray-500 dark:text-zinc-400 max-w-md text-lg font-medium leading-relaxed mb-10">
                  A ferramenta de criação de Artigos e Blog para o diretório está reservada para assinantes <span className="text-indigo-600 font-bold">PRO</span> e <span className="text-emerald-600 font-bold">Business</span>.
              </p>
              <Link to="/plans" className="bg-indigo-600 text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
                  <Crown className="w-5 h-5" /> CONHECER PLANOS PRO
              </Link>
          </div>
      );
  }

  const handleOpenModal = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setBlogForm({
        title: post.title,
        category: post.category,
        summary: post.summary,
        content: post.content,
        imageUrl: post.imageUrl,
        author: post.author
      });
    } else {
      setEditingPost(null);
      setBlogForm({
        title: '',
        category: 'Marketing',
        summary: '',
        content: '',
        imageUrl: '',
        author: user?.name || ''
      });
    }
    setIsModalOpen(true);
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Deseja excluir este artigo permanentemente?')) return;
    try {
      await mockBackend.deleteBlogPost(id);
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
        setBlogForm(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      if (editingPost) {
        await mockBackend.deleteBlogPost(editingPost.id);
      }
      await mockBackend.createBlogPost({
        ...blogForm,
        userId: editingPost?.userId || user.id,
        date: new Date().toLocaleDateString('pt-BR')
      });
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
                BLOG & ARTIGOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] dark:from-brand-primary dark:to-brand-accent">PRO</span>
              </h2>
              <p className="text-slate-400 text-xs font-black uppercase tracking-[0.25em] mt-2">
                {isAdmin ? 'ADMINISTRAÇÃO GLOBAL DE ARTIGOS' : 'GERE AUTORIDADE E EDUQUE SEU MERCADO.'}
              </p>
            </div>
          </div>
          <button onClick={() => handleOpenModal()} className="bg-[#F67C01] text-white px-12 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
            <Plus className="w-5 h-5" /> NOVO ARTIGO
          </button>
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
            title="Gere autoridade e eduque seu bairro."
            subtitle="Blog & Artigos"
            description="Escreva artigos sobre seu nicho de atuação para atrair clientes qualificados. Conteúdos educativos ajudam seu perfil a aparecer melhor no Google."
            benefits={["Publicação direta no blog principal", "SEO regional otimizado", "Aumento do índice de confiança", "Compartilhamento fácil"]}
            youtubeId="dQw4w9WgXcQ"
            ctaLabel="GERENCIAR MEUS ARTIGOS"
            onStart={() => setActiveSubTab('manage')}
            icon={BookOpen}
          />
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 md:p-16 border border-gray-100 dark:border-zinc-800 shadow-xl space-y-8 min-h-[500px]">
            <div className="flex justify-between items-center mb-8">
               <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">{isAdmin ? 'Gerenciamento Global' : 'Sua Biblioteca'}</h3>
                  {isAdmin && <span className="bg-rose-100 text-rose-600 text-[8px] font-black px-2 py-1 rounded-full uppercase">Modo Admin</span>}
               </div>
            </div>
            
            {isLoading ? (
              <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest animate-pulse">Carregando artigos...</div>
            ) : posts.length === 0 ? (
               <div className="py-32 text-center border-4 border-dashed border-gray-50 dark:border-zinc-800 rounded-[4rem]">
                  <FileText className="w-20 h-20 mx-auto text-slate-100 dark:text-zinc-800 mb-8" />
                  <p className="text-slate-300 dark:text-zinc-600 font-black uppercase text-xs tracking-[0.4em]">Nenhum artigo publicado</p>
               </div>
            ) : (
              <div className="grid gap-6">
                {posts.map(post => (
                  <div key={post.id} className="p-8 bg-gray-50/50 dark:bg-zinc-800/40 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between group hover:bg-white dark:hover:bg-zinc-800 transition-all hover:shadow-2xl">
                    <div className="flex items-center gap-8">
                       <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-lg border-4 border-white dark:border-zinc-700">
                          <img src={post.imageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover" />
                       </div>
                       <div>
                          <div className="flex items-center gap-2 mb-2">
                             <span className="text-[9px] font-black text-indigo-600 dark:text-brand-primary uppercase tracking-widest bg-white dark:bg-zinc-900 px-3 py-1 rounded-lg border border-gray-100 dark:border-zinc-700 shadow-sm">{post.category}</span>
                             {isAdmin && post.userId !== user.id && <span className="text-[9px] font-black text-slate-400 uppercase">Autor: {post.author}</span>}
                          </div>
                          <h4 className="font-black text-gray-900 dark:text-white text-2xl uppercase italic tracking-tight leading-tight">{post.title}</h4>
                          <div className="flex items-center gap-4 mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                             <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                             <span className="flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> Publicado</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-3 mt-6 md:mt-0">
                       <button onClick={() => handleOpenModal(post)} className="p-4 bg-white dark:bg-zinc-900 rounded-2xl text-indigo-400 border border-gray-100 dark:border-zinc-700 shadow-sm hover:scale-110 transition-transform"><Edit2 className="w-5 h-5" /></button>
                       <button onClick={() => handleDeletePost(post.id)} className="p-4 bg-white dark:bg-zinc-900 rounded-2xl text-rose-400 border border-gray-100 dark:border-zinc-700 shadow-sm hover:scale-110 transition-transform"><Trash2 className="w-5 h-5" /></button>
                       <a href="/#/blog" target="_blank" className="p-4 bg-white dark:bg-zinc-900 rounded-2xl text-emerald-400 border border-gray-100 dark:border-zinc-700 shadow-sm hover:scale-110 transition-transform"><Send className="w-5 h-5" /></a>
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
            <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden border border-white/5 animate-scale-in flex flex-col">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center flex-shrink-0">
                    <div>
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter">{editingPost ? 'Editar Artigo' : 'Novo Artigo PRO'}</h3>
                      <p className="text-[10px] font-black text-[#F67C01] tracking-widest uppercase">{isAdmin ? 'MODO ADMINISTRADOR - EDITANDO CONTEÚDO' : 'Gere autoridade e atraia novos clientes locais.'}</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide">
                    <div className="grid lg:grid-cols-12 gap-10">
                       <div className="lg:col-span-7 space-y-8">
                          <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><Type className="w-3 h-3" /> Título do Artigo</label>
                             <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-black text-xl italic tracking-tight dark:text-white" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} />
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                             <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Categoria</label>
                                <select className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={blogForm.category} onChange={e => setBlogForm({...blogForm, category: e.target.value})}>
                                   <option>Marketing</option>
                                   <option>Estratégia</option>
                                   <option>Dicas</option>
                                   <option>Novidades</option>
                                   <option>Case de Sucesso</option>
                                </select>
                             </div>
                             <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Autor</label>
                                <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={blogForm.author} onChange={e => setBlogForm({...blogForm, author: e.target.value})} />
                             </div>
                          </div>

                          <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><AlignLeft className="w-3 h-3" /> Resumo</label>
                             <textarea rows={2} required className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 text-sm font-medium leading-relaxed dark:text-white resize-none" value={blogForm.summary} onChange={e => setBlogForm({...blogForm, summary: e.target.value})} />
                          </div>
                       </div>

                       <div className="lg:col-span-5">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2"><ImageIcon className="w-3 h-3" /> Imagem de Capa</label>
                          <div className="aspect-[4/3] bg-gray-50 dark:bg-zinc-800/40 rounded-[2.5rem] border-4 border-dashed border-gray-100 dark:border-zinc-700 relative overflow-hidden group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                             {blogForm.imageUrl ? <img src={blogForm.imageUrl} className="w-full h-full object-cover" /> : <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4"><Camera className="w-12 h-12" /><span className="text-[10px] font-black uppercase tracking-[0.2em]">Upload</span></div>}
                             <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                          </div>
                       </div>

                       <div className="lg:col-span-12">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Conteúdo Completo</label>
                          <textarea rows={12} required className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-[2.5rem] p-10 text-lg font-medium leading-relaxed dark:text-white" value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} />
                       </div>
                    </div>
                </form>

                <div className="p-10 bg-gray-50 dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-800 flex-shrink-0">
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

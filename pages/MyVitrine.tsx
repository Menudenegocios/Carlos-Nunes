
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Store, Smartphone, Package, BookOpen, 
  Layout, Home as HomeIcon, Eye, ArrowUpRight,
  Sparkles, Zap, MessageSquare, Plus, Trash2, Edit2, Calendar,
  X, Send, RefreshCw, Image as ImageIcon, Camera, Type, AlignLeft
} from 'lucide-react';
import { BioBuilder } from './BioBuilder';
import { MyCatalog } from './MyCatalog';
import { mockBackend } from '../services/mockBackend';
import { BlogPost } from '../types';

type VitrineTab = 'bio' | 'catalog' | 'blog';

export const MyVitrine: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<VitrineTab>('bio');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoadingBlog, setIsLoadingBlog] = useState(false);
  
  // Create Article State
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [postForm, setPostForm] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'Marketing',
    imageUrl: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostForm(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      await mockBackend.createBlogPost({
        ...postForm,
        userId: user.id,
        author: user.name,
        date: new Date().toLocaleDateString('pt-BR')
      });
      
      // Limpa e fecha
      setIsBlogModalOpen(false);
      setPostForm({ title: '', summary: '', content: '', category: 'Marketing', imageUrl: '' });
      
      // Redireciona para o Blog Principal
      alert("Artigo publicado com sucesso! Redirecionando para o Blog...");
      navigate('/blog');
    } catch (err) {
      alert("Erro ao publicar artigo.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-[fade-in_0.4s_ease-out]">
      {/* Header do Hub "Minha Vitrine" */}
      <div className="bg-[#0F172A] dark:bg-black rounded-[3.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-indigo-500/10 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-xl">
                 <Store className="h-10 w-10 text-brand-primary" />
              </div>
              <div>
                 <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-2 italic uppercase">
                    Minha <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] dark:from-brand-primary dark:to-brand-accent">Vitrine</span>
                 </h1>
                 <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">GERENCIE SUA IMAGEM PÚBLICA E CONVERSÃO.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
                <a 
                  href={`/#/store/${user.id}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-md text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95 shadow-xl"
                >
                    <Eye className="w-4 h-4" /> VER MINHA VITRINE <ArrowUpRight className="w-4 h-4 opacity-50" />
                </a>
            </div>
          </div>

          {/* Navegação entre as ferramentas da Vitrine */}
          <div className="flex p-1.5 mt-12 bg-white/5 backdrop-blur-md rounded-[2.2rem] border border-white/10 w-fit overflow-x-auto scrollbar-hide gap-1">
              {[
                  { id: 'bio', label: 'BIO DIGITAL', desc: 'Links e Estilo', icon: Smartphone },
                  { id: 'catalog', label: 'CATÁLOGO & LOJA', desc: 'Produtos/Vendas', icon: Package },
                  { id: 'blog', label: 'BLOG & ARTIGOS', desc: 'Autoridade', icon: BookOpen },
              ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as VitrineTab)} 
                    className={`flex flex-col items-center justify-center min-w-[150px] px-10 py-4 rounded-[1.8rem] transition-all duration-300 whitespace-nowrap ${activeTab === tab.id ? 'bg-[#F67C01] text-white shadow-xl scale-105' : 'text-slate-400 hover:bg-white/10'}`}
                  >
                      <div className="flex items-center gap-2 mb-0.5">
                        <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-brand-primary'}`} />
                        <span className="font-black text-[11px] tracking-widest uppercase italic">{tab.label}</span>
                      </div>
                      <span className={`text-[9px] font-medium opacity-60 ${activeTab === tab.id ? 'text-white' : ''}`}>{tab.desc}</span>
                  </button>
              ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      </div>

      {/* Conteúdo Dinâmico com base na aba ativa */}
      <div className="min-h-[600px] animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeTab === 'bio' && (
          <div className="-mt-12">
             <BioBuilder />
          </div>
        )}
        
        {activeTab === 'catalog' && (
          <div className="-mt-12">
             <MyCatalog />
          </div>
        )}

        {activeTab === 'blog' && (
          <BlogManager 
            posts={blogPosts} 
            isLoading={isLoadingBlog} 
            onRefresh={loadBlogData} 
            onNewArticle={() => setIsBlogModalOpen(true)}
          />
        )}
      </div>

      {/* MODAL ESCREVER NOVO ARTIGO */}
      {isBlogModalOpen && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-4xl shadow-2xl overflow-hidden border border-white/5 animate-scale-in">
               <div className="bg-[#0F172A] p-8 md:p-10 text-white flex justify-between items-center">
                  <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-white/10 shadow-lg">
                        <BookOpen className="w-7 h-7 text-brand-primary" />
                      </div>
                      <div>
                          <h3 className="text-3xl font-black uppercase italic tracking-tighter">Escrever Novo Artigo</h3>
                          <p className="text-[10px] font-black text-[#F67C01] tracking-[0.2em] mt-1 uppercase">Gere autoridade e eduque seu público local</p>
                      </div>
                  </div>
                  <button onClick={() => setIsBlogModalOpen(false)} className="p-4 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
               </div>
               
               <form onSubmit={handleSavePost} className="p-10 md:p-14 overflow-y-auto max-h-[70vh] scrollbar-hide">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                     <div className="space-y-10">
                        <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Título do Artigo</label>
                           <input 
                              required 
                              type="text" 
                              className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white focus:ring-4 focus:ring-brand-primary/10" 
                              value={postForm.title} 
                              onChange={e => setPostForm({...postForm, title: e.target.value})} 
                              placeholder="Ex: Como escolher o melhor [Seu Serviço] no bairro" 
                           />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Resumo do Feed (Thumbnail)</label>
                           <input 
                              required 
                              type="text" 
                              className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" 
                              value={postForm.summary} 
                              onChange={e => setPostForm({...postForm, summary: e.target.value})} 
                              placeholder="Uma frase curta que desperta curiosidade..." 
                           />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Categoria do Conteúdo</label>
                           <select 
                              className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white focus:ring-4 focus:ring-indigo-50/10"
                              value={postForm.category}
                              onChange={e => setPostForm({...postForm, category: e.target.value})}
                           >
                              <option>Marketing</option>
                              <option>Dicas</option>
                              <option>Estratégia</option>
                              <option>Gestão</option>
                              <option>Case de Sucesso</option>
                           </select>
                        </div>
                     </div>

                     <div className="space-y-10">
                        <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Imagem de Capa (Opcional)</label>
                           <div className="aspect-video rounded-3xl bg-gray-50 dark:bg-zinc-800 border-4 border-dashed border-gray-200 dark:border-zinc-700 relative overflow-hidden group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                               {postForm.imageUrl ? (
                                   <img src={postForm.imageUrl} className="w-full h-full object-cover" alt="Cover" />
                               ) : (
                                   <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                       <ImageIcon className="w-10 h-10 mb-2" />
                                       <span className="text-[10px] font-black uppercase tracking-widest">Carregar Capa</span>
                                   </div>
                               )}
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Camera className="w-8 h-8 text-white" /></div>
                           </div>
                           <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                        </div>
                        
                        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-800">
                           <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                              <Sparkles className="w-3 h-3" /> Dica Premium
                           </p>
                           <p className="text-xs text-indigo-700 dark:text-indigo-200 font-medium">Artigos ajudam seu negócio a aparecer no Google quando alguém busca por serviços na sua região.</p>
                        </div>
                     </div>

                     <div className="lg:col-span-2 space-y-6 pt-4">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Conteúdo do Artigo (Corpo do Texto)</label>
                        <textarea 
                           required 
                           rows={12} 
                           className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-[2rem] p-8 font-medium text-lg dark:text-white resize-none shadow-inner" 
                           value={postForm.content} 
                           onChange={e => setPostForm({...postForm, content: e.target.value})} 
                           placeholder="Desenvolva seu texto aqui. Use parágrafos claros e dicas valiosas..." 
                        />
                     </div>
                  </div>

                  <div className="mt-16 flex gap-4">
                     <button 
                        type="submit" 
                        disabled={isSaving}
                        className="flex-1 bg-[#F67C01] text-white font-black py-7 rounded-[2.2rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center gap-4"
                     >
                        {isSaving ? <RefreshCw className="animate-spin w-6 h-6" /> : <Send className="w-6 h-6" />} PUBLICAR ARTIGO AGORA
                     </button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

// Sub-componente para gerenciar o Blog dentro do Hub
const BlogManager: React.FC<{ posts: BlogPost[], isLoading: boolean, onRefresh: () => void, onNewArticle: () => void }> = ({ posts, isLoading, onRefresh, onNewArticle }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 md:p-16 border border-gray-100 dark:border-zinc-800 shadow-xl space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
           <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Gestão de Artigos</h3>
           <p className="text-slate-500 font-medium">Crie conteúdos que educam seu público e vendem sua expertise.</p>
        </div>
        <button 
           onClick={onNewArticle}
           className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95"
        >
           <Plus className="w-5 h-5" /> ESCREVER NOVO ARTIGO
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 text-center animate-pulse text-slate-400">Carregando seus artigos...</div>
      ) : posts.length === 0 ? (
        <div className="py-32 text-center border-4 border-dashed border-gray-50 dark:border-zinc-800 rounded-[4rem] space-y-6">
           <BookOpen className="w-16 h-16 text-slate-100 mx-auto" />
           <p className="text-slate-300 font-black uppercase text-sm tracking-[0.4em]">Sua biblioteca está vazia</p>
           <p className="text-slate-400 text-xs max-w-xs mx-auto">Artigos de blog ajudam seu perfil a aparecer melhor nas buscas do Google e Menu ADS.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
           {posts.map(post => (
             <div key={post.id} className="p-8 bg-gray-50/50 dark:bg-zinc-800/40 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center group hover:bg-white dark:hover:bg-zinc-800 hover:shadow-xl transition-all gap-8">
                <div className="flex items-center gap-8">
                   <div className="w-24 h-24 rounded-[2rem] overflow-hidden shadow-lg flex-shrink-0">
                      <img src={post.imageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover" alt={post.title} />
                   </div>
                   <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">{post.category}</span>
                        <span className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase"><Calendar className="w-3 h-3" /> {post.date}</span>
                      </div>
                      <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight">{post.title}</h4>
                      <p className="text-sm text-slate-500 mt-2 line-clamp-1">{post.summary}</p>
                   </div>
                </div>
                <div className="flex gap-3">
                   <button className="p-4 bg-white dark:bg-zinc-900 rounded-2xl text-indigo-600 shadow-sm border border-gray-100 dark:border-zinc-700 hover:scale-110 transition-all"><Edit2 className="w-5 h-5" /></button>
                   <button className="p-4 bg-white dark:bg-zinc-900 rounded-2xl text-rose-500 shadow-sm border border-gray-100 dark:border-zinc-700 hover:scale-110 transition-all"><Trash2 className="w-5 h-5" /></button>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

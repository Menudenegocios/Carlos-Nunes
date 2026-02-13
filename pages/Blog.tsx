
import React, { useEffect, useState } from 'react';
import { mockBackend } from '../services/mockBackend';
import { BlogPost } from '../types';
import { Calendar, User, BookOpen, Search, ArrowRight, Store, X, ChevronLeft, Share2, Sparkles, Clock, TrendingUp } from 'lucide-react';

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      const data = await mockBackend.getBlogPosts();
      setPosts(data.sort((a, b) => (b.id as number) - (a.id as number)));
      setLoading(false);
    };
    loadPosts();
  }, []);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedPost) {
    return (
      <div className="max-w-4xl mx-auto pb-32 pt-8 px-6 animate-fade-in">
          <button 
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 text-indigo-600 dark:text-brand-primary font-black text-[10px] uppercase tracking-widest mb-12 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 w-fit px-6 py-3 rounded-2xl transition-all border border-indigo-100 dark:border-zinc-700 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" /> VOLTAR PARA O BLOG
          </button>

          <article className="bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-zinc-800">
              <div className="relative h-[450px] w-full">
                  <img src={selectedPost.imageUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1200'} className="w-full h-full object-cover" alt={selectedPost.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent"></div>
                  <div className="absolute bottom-16 left-16 right-16">
                      <span className="bg-indigo-600 text-white text-[9px] font-black uppercase px-4 py-2 rounded-full mb-6 inline-block tracking-widest border border-white/20 backdrop-blur-md">
                          {selectedPost.category}
                      </span>
                      <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                          {selectedPost.title}
                      </h1>
                  </div>
              </div>

              <div className="p-12 md:p-16">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 pb-10 border-b border-gray-100 dark:border-zinc-800">
                      <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-brand-primary shadow-sm">
                              {selectedPost.userId ? <Store className="w-8 h-8" /> : <User className="w-8 h-8" />}
                          </div>
                          <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Autor Responsável</p>
                              <p className="font-black text-gray-900 dark:text-white text-xl">{selectedPost.author}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-8 text-gray-900 dark:text-white">
                          <p className="font-bold flex items-center gap-2 text-lg"><Calendar className="w-5 h-5 text-indigo-600" /> {selectedPost.date}</p>
                          <button className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-gray-500 hover:text-indigo-600 transition-all">
                              <Share2 className="w-6 h-6" />
                          </button>
                      </div>
                  </div>

                  <div className="prose prose-xl dark:prose-invert max-w-none">
                      <p className="text-2xl text-gray-500 dark:text-zinc-400 font-medium mb-12 italic leading-relaxed border-l-8 border-indigo-100 dark:border-brand-primary pl-8">
                          {selectedPost.summary}
                      </p>
                      <div className="text-gray-700 dark:text-zinc-300 leading-relaxed space-y-8 text-lg font-medium">
                          {selectedPost.content}
                      </div>
                  </div>
              </div>
          </article>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-24 pb-32 pt-8 px-6">
      
      {/* 1. HERO SECTION (PARTNERS STYLE) */}
      <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest">
           <BookOpen className="w-3 h-3" /> Insights & Estratégias
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-none max-w-4xl mx-auto">
          Conhecimento que <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-brand-primary dark:to-brand-accent">faz seu negócio crescer.</span>
        </h1>
        <p className="text-xl text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed">
          Aprenda marketing, gestão e tecnologia com quem entende do mercado local brasileiro.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
               type="text" 
               placeholder="Pesquisar por tema, autor ou palavra-chave..." 
               className="w-full pl-16 pr-6 py-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[2rem] font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-50 outline-none shadow-xl transition-all"
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
      </section>

      {/* 2. BLOG GRID (BENTO STYLE) */}
      <section className="space-y-12">
        <div className="flex items-center gap-4 px-4">
           <div className="w-2 h-10 bg-indigo-600 rounded-full"></div>
           <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Artigos Mais Recentes</h2>
        </div>

        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[1,2,3].map(i => <div key={i} className="h-96 bg-gray-50 dark:bg-zinc-800 rounded-[3rem] animate-pulse"></div>)}
            </div>
        ) : filteredPosts.length === 0 ? (
            <div className="text-center py-32 bg-white dark:bg-zinc-900 rounded-[4rem] border-2 border-dashed border-gray-100 dark:border-zinc-800">
                <Search className="w-16 h-16 text-gray-200 dark:text-zinc-700 mx-auto mb-6" />
                <h4 className="text-2xl font-black text-gray-900 dark:text-white">Nada encontrado</h4>
                <p className="text-gray-500 dark:text-zinc-400 font-medium">Tente uma busca diferente.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPosts.map(post => (
                <article key={post.id} className="group bg-white dark:bg-zinc-900 rounded-[3rem] border border-gray-100 dark:border-zinc-800 shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full cursor-pointer" onClick={() => setSelectedPost(post)}>
                <div className="h-64 w-full overflow-hidden relative bg-gray-100">
                    <img src={post.imageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'} alt={post.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute top-6 left-6">
                        <span className="bg-white/90 dark:bg-black/60 backdrop-blur-md text-indigo-900 dark:text-brand-primary text-[10px] font-black uppercase px-4 py-2 rounded-full shadow-lg border border-white/40 dark:border-zinc-700 tracking-widest">
                        {post.category}
                        </span>
                    </div>
                </div>
                
                <div className="p-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-brand-primary text-[10px] font-black uppercase tracking-widest mb-4">
                    <Clock className="w-3.5 h-3.5" /> {post.date}
                    </div>
                    
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4 leading-tight group-hover:text-indigo-600 transition-colors">
                    {post.title}
                    </h2>
                    <p className="text-gray-500 dark:text-zinc-400 text-sm font-medium mb-10 flex-1 line-clamp-3 leading-relaxed">
                    {post.summary}
                    </p>
                    
                    <div className="mt-auto pt-8 border-t border-gray-50 dark:border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-brand-primary shadow-sm">
                                {post.userId ? <Store className="w-5 h-5" /> : <User className="w-5 h-5" />}
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Autor</p>
                                <p className="text-sm font-black text-gray-900 dark:text-white">{post.author}</p>
                            </div>
                        </div>
                        <div className="bg-indigo-50 dark:bg-brand-primary text-indigo-600 dark:text-white p-4 rounded-2xl group-hover:bg-indigo-600 transition-all shadow-sm">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </div>
                </div>
                </article>
            ))}
            </div>
        )}
      </section>

      {/* 3. NEWSLETTER (PARTNERS STYLE) */}
      <section className="bg-gray-900 rounded-[4rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Insights VIP no seu WhatsApp.</h2>
            <p className="text-gray-400 text-lg font-medium leading-relaxed">Receba estratégias de marketing digital validadas que não publicamos no blog aberto.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto pt-4">
               <input type="text" placeholder="Seu WhatsApp" className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 placeholder:text-gray-500 text-white font-bold focus:ring-2 focus:ring-white outline-none flex-1" />
               <button className="bg-white text-gray-900 px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-50 transition-all">RECEBER INSIGHTS</button>
            </div>
         </div>
         <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -mb-48 -mr-48"></div>
      </section>
    </div>
  );
};

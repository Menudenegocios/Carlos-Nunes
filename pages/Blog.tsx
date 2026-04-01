
import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';
import { BlogPost } from '../types';
import { Calendar, User, BookOpen, Search, ArrowRight, Store, ChevronLeft, Share2, Clock } from 'lucide-react';

export const Blog: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      const data = await supabaseService.getBlogPosts();
      setPosts(data.sort((a, b) => Number(b.id) - Number(a.id)));
      
      if (id) {
        const post = data.find(p => p.id === id);
        if (post) setSelectedPost(post);
      } else {
        setSelectedPost(null);
      }
      
      // Checa se há filtro de categoria na URL
      const params = new URLSearchParams(location.search);
      const categoryFilter = params.get('category');
      if (categoryFilter) {
        setSearchTerm(categoryFilter);
      }
      
      setLoading(false);
    };
    loadPosts();
  }, [location.search, id]);

  const filteredPosts = posts.filter(post => {
    const term = searchTerm.toLowerCase();
    return (
      post.title?.toLowerCase().includes(term) ||
      post.summary?.toLowerCase().includes(term) ||
      post.category?.toLowerCase().includes(term)
    );
  });

  if (selectedPost) {
    return (
      <div className="max-w-4xl mx-auto pb-32 pt-8 px-6 animate-fade-in">
          <button 
            onClick={() => {
              setSelectedPost(null);
              navigate('/blog');
            }}
            className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-12 hover:bg-indigo-50 w-fit px-6 py-3 rounded-2xl transition-all border border-indigo-100 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" /> VOLTAR PARA O BLOG
          </button>

          <article className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
              <div className="relative h-[450px] w-full">
                  <img src={selectedPost.image_url || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1200'} className="w-full h-full object-cover" alt={selectedPost.title} />
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
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 pb-10 border-b border-gray-100">
                      <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
                              {selectedPost.user_id ? <Store className="w-8 h-8" /> : <User className="w-8 h-8" />}
                          </div>
                          <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Autor Responsável</p>
                              <p className="font-black text-gray-900 text-xl">{selectedPost.author}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-8 text-gray-900">
                          <p className="font-bold flex items-center gap-2 text-lg"><Calendar className="w-5 h-5 text-indigo-600" /> {selectedPost.date}</p>
                          <button 
                            onClick={() => {
                              if (navigator.share) {
                                navigator.share({
                                  title: selectedPost.title,
                                  text: selectedPost.summary,
                                  url: window.location.href,
                                }).catch(console.error);
                              } else {
                                navigator.clipboard.writeText(window.location.href);
                                alert('Link copiado para a área de transferência!');
                              }
                            }}
                            className="p-4 bg-gray-50 rounded-2xl text-gray-500 hover:text-indigo-600 transition-all"
                            title="Compartilhar"
                          >
                              <Share2 className="w-6 h-6" />
                          </button>
                      </div>
                  </div>

                  <div className="prose prose-xl max-w-none">
                      <p className="text-2xl text-gray-500 font-medium mb-12 italic leading-relaxed border-l-8 border-indigo-100 pl-8">
                          {selectedPost.summary}
                      </p>
                      <div className="text-gray-700 leading-relaxed space-y-8 text-lg font-medium">
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
      
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest">
           <BookOpen className="w-3 h-3" /> Insights & Estratégias
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none max-w-4xl mx-auto">
          Conhecimento que <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA]">faz seu negócio crescer.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Aprenda marketing, gestão e tecnologia com quem entende do mercado local brasileiro.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
               type="text" 
               placeholder="Pesquisar por tema, autor ou palavra-chave..." 
               className="w-full pl-16 pr-6 py-5 bg-white border border-gray-100 rounded-[2rem] font-bold text-gray-900 focus:ring-4 focus:ring-indigo-50 outline-none shadow-xl transition-all"
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
      </section>

      {/* 2. BLOG GRID */}
      <section className="space-y-12">
        <div className="flex items-center gap-4 px-4">
           <div className="w-2 h-10 bg-indigo-600 rounded-full"></div>
           <h2 className="text-3xl font-black text-gray-900 tracking-tight">Artigos Mais Recentes</h2>
           {searchTerm && (
             <button onClick={() => setSearchTerm('')} className="ml-auto text-xs font-black text-indigo-600 underline uppercase tracking-widest">Limpar Filtro</button>
           )}
        </div>

        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[1,2,3].map(i => <div key={i} className="h-96 bg-gray-50 rounded-[3rem] animate-pulse"></div>)}
            </div>
        ) : filteredPosts.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-gray-100">
                <Search className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                <h4 className="text-2xl font-black text-gray-900">Nada encontrado</h4>
                <p className="text-gray-500 font-medium">Tente uma busca diferente.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPosts.map(post => (
                <article key={post.id} className="group bg-white rounded-[3rem] border border-gray-100 shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full cursor-pointer" onClick={() => setSelectedPost(post)}>
                <div className="h-64 w-full overflow-hidden relative bg-gray-100">
                    <img src={post.image_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'} alt={post.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute top-6 left-6">
                        <span className="bg-white/90 backdrop-blur-md text-indigo-900 text-[10px] font-black uppercase px-4 py-2 rounded-full shadow-lg border border-white/40 tracking-widest">
                        {post.category}
                        </span>
                    </div>
                </div>
                
                <div className="p-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
                    <Clock className="w-3.5 h-3.5" /> {post.date}
                    </div>
                    
                    <h2 className="text-2xl font-black text-gray-900 mb-4 leading-tight group-hover:text-indigo-600 transition-colors">
                    {post.title}
                    </h2>
                    <p className="text-gray-500 text-sm font-medium mb-10 flex-1 line-clamp-3 leading-relaxed">
                    {post.summary}
                    </p>
                    
                    <div className="mt-auto pt-8 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
                                {post.user_id ? <Store className="w-5 h-5" /> : <User className="w-5 h-5" />}
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Autor</p>
                                <p className="text-sm font-black text-gray-900">{post.author}</p>
                            </div>
                        </div>
                        <div className="bg-indigo-50 text-indigo-600 p-4 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </div>
                </div>
                </article>
            ))}
            </div>
        )}
      </section>

      {/* 3. NEWSLETTER */}
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

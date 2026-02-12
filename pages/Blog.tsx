
import React, { useEffect, useState } from 'react';
import { mockBackend } from '../services/mockBackend';
import { BlogPost } from '../types';
import { Calendar, User, BookOpen, Search, ArrowRight, Store, X, ChevronLeft, Share2 } from 'lucide-react';

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
      <div className="max-w-4xl mx-auto pb-20 animate-fade-in">
          <button 
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 text-indigo-600 font-bold mb-8 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all"
          >
            <ChevronLeft className="w-5 h-5" /> Voltar para o Blog
          </button>

          <article className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
              <div className="relative h-[400px] w-full">
                  {selectedPost.imageUrl ? (
                    <img src={selectedPost.imageUrl} className="w-full h-full object-cover" alt={selectedPost.title} />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center">
                        <BookOpen className="w-20 h-20 text-white/10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-10 left-10 right-10">
                      <span className="bg-indigo-600 text-white text-xs font-black uppercase px-3 py-1.5 rounded-lg mb-4 inline-block tracking-widest">
                          {selectedPost.category}
                      </span>
                      <h1 className="text-3xl md:text-5xl font-black text-white leading-tight shadow-sm">
                          {selectedPost.title}
                      </h1>
                  </div>
              </div>

              <div className="p-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-8 border-b border-gray-100">
                      <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                              {selectedPost.userId ? <Store className="w-7 h-7" /> : <User className="w-7 h-7" />}
                          </div>
                          <div>
                              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Autor</p>
                              <p className="font-bold text-gray-900 text-lg">{selectedPost.author}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-8">
                          <div>
                              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Publicado em</p>
                              <p className="font-bold text-gray-900 flex items-center gap-2"><Calendar className="w-4 h-4 text-indigo-600" /> {selectedPost.date}</p>
                          </div>
                          <button className="p-3 bg-gray-50 rounded-xl text-gray-500 hover:text-indigo-600 transition-all">
                              <Share2 className="w-5 h-5" />
                          </button>
                      </div>
                  </div>

                  <div className="prose prose-lg max-w-none prose-indigo">
                      <p className="text-xl text-gray-500 font-medium mb-10 italic leading-relaxed">
                          {selectedPost.summary}
                      </p>
                      <div className="text-gray-700 leading-relaxed space-y-6 text-lg whitespace-pre-wrap">
                          {selectedPost.content}
                      </div>
                  </div>
              </div>
          </article>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="bg-gradient-to-r from-gray-900 to-indigo-900 text-white py-12 px-6 rounded-3xl shadow-xl text-center relative overflow-hidden mt-6">
         <div className="relative z-10 max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 flex items-center justify-center gap-3">
               <BookOpen className="w-10 h-10 text-cyan-400" /> Blog & Dicas
            </h1>
            <p className="text-xl text-indigo-100">
               Estratégias de marketing, gestão e novidades dos nossos parceiros locais.
            </p>
         </div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-30"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500 rounded-full blur-[100px] opacity-30"></div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-20 z-40">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Buscar artigos por tema ou autor..." 
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-3.5 w-6 h-6 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[1,2,3].map(i => <div key={i} className="h-80 bg-gray-100 rounded-xl animate-pulse"></div>)}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Nenhum artigo encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <article key={post.id} className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full cursor-pointer" onClick={() => setSelectedPost(post)}>
              <div className="h-56 w-full overflow-hidden relative bg-gray-100">
                 {post.imageUrl ? (
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 ) : (
                    <div className="w-full h-full bg-indigo-900 flex items-center justify-center opacity-80">
                        <BookOpen className="w-12 h-12 text-white/20" />
                    </div>
                 )}
                 <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-indigo-900 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg shadow-sm border border-white/20 tracking-wider">
                      {post.category}
                    </span>
                 </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-3 font-medium uppercase tracking-wide">
                  <span className="flex items-center gap-1 font-bold"><Calendar className="w-3 h-3 text-indigo-600" /> {post.date}</span>
                </div>
                
                <h2 className="text-xl font-black text-gray-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed font-medium">
                  {post.summary}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                  <div className="flex items-center gap-2 text-sm text-gray-400 font-bold">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                      {post.userId ? <Store className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    {post.author}
                  </div>
                  <div className="text-indigo-600 font-black text-xs uppercase flex items-center gap-1 group-hover:gap-2 transition-all">
                    Ler artigo <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

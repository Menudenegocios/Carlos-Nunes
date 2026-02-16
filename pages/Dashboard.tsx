
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { mockBackend } from '../services/mockBackend';
import { Profile, CommunityPost, Product } from '../types';
import { 
  Trophy, Star, Eye, Plus, Zap,
  ArrowRight, MessageSquare, Heart, 
  Image as ImageIcon, Users, RefreshCw,
  Target, Sparkles, CheckCircle, Megaphone,
  AlertCircle, ChevronRight, BarChart3, ShieldAlert, Bot, LayoutDashboard,
  MessageCircle, Share2, Send
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [healthScore, setHealthScore] = useState(0);

  useEffect(() => {
    if (user) loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [profile, myProducts, communityPosts] = await Promise.all([
        mockBackend.getProfile(user!.id),
        mockBackend.getProducts(user!.id),
        mockBackend.getCommunityPosts()
      ]);
      setUserProfile(profile || null);
      setProducts(myProducts);
      setPosts(communityPosts.slice(0, 5));
      setHealthScore(calculateHealth(profile || null, myProducts));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !user) return;
    setIsPosting(true);
    try {
      const newPost = await mockBackend.createCommunityPost({
        userId: user.id,
        userName: user.name,
        businessName: userProfile?.businessName || 'Empreendedor',
        userAvatar: userProfile?.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`,
        content: newPostContent,
      });
      setPosts([newPost, ...posts]);
      setNewPostContent('');
    } finally {
      setIsPosting(false);
    }
  };

  const calculateHealth = (prof: Profile | null, prods: Product[]) => {
    let score = 0;
    if (prof?.logoUrl) score += 20;
    if (prof?.bio && prof.bio.length > 20) score += 20;
    if (prof?.businessName) score += 10;
    if (prof?.phone) score += 10;
    if (prods.length > 0) score += 40;
    return score;
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4 px-4 animate-[fade-in_0.4s_ease-out]">
      
      {/* Header Premium SaaS Estilo Unificado */}
      <div className="bg-[#0F172A] dark:bg-black rounded-[3.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-indigo-500/10 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-xl">
                 <LayoutDashboard className="h-10 w-10 text-brand-primary" />
              </div>
              <div>
                 <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-2 italic uppercase">
                    Olá, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] dark:from-brand-primary dark:to-brand-accent">{user.name.split(' ')[0]}!</span>
                 </h1>
                 <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">Sua visão geral de performance e crescimento.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
                <Link to="/catalog" className="flex items-center gap-2 px-8 py-4 bg-[#F67C01] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl active:scale-95">
                    <Plus className="w-4 h-4" /> NOVO ITEM
                </Link>
                <Link to={`/store/${user.id}`} className="flex items-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-md text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95">
                    <Eye className="w-4 h-4" /> VER VITRINE
                </Link>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
             {/* Stats Inline */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Saúde do Perfil</p>
                   <div className="flex items-end justify-between">
                      <h4 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{healthScore}%</h4>
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckCircle className="w-5 h-5" /></div>
                   </div>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Visualizações</p>
                   <div className="flex items-end justify-between">
                      <h4 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">3.4k</h4>
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Eye className="w-5 h-5" /></div>
                   </div>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Clube ADS</p>
                   <div className="flex items-end justify-between">
                      <h4 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{user.points}</h4>
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-primary flex items-center justify-center"><Zap className="w-5 h-5" /></div>
                   </div>
                </div>
             </div>

             {/* Feed de Comunidade com Postador */}
             <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-10">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-3 italic">
                        <MessageSquare className="text-indigo-600" /> Mural da Comunidade
                    </h3>
                    <Link to="/community" className="text-[10px] font-black text-indigo-600 dark:text-brand-primary uppercase tracking-widest hover:underline flex items-center gap-2">VER TUDO <ChevronRight className="w-4 h-4" /></Link>
                </div>

                {/* Post Composer Inline */}
                <div className="p-2 bg-gray-50 dark:bg-zinc-800/40 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800">
                   <form onSubmit={handleCreatePost} className="flex flex-col md:flex-row items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white dark:border-zinc-700 shadow-md ml-2 hidden md:block">
                         <img src={userProfile?.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} className="w-full h-full object-cover" alt="Me" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="O que está acontecendo no seu negócio?"
                        className="flex-1 bg-white dark:bg-zinc-900 border-none rounded-2xl py-5 px-6 font-bold text-sm focus:ring-4 focus:ring-indigo-50 dark:text-white transition-all outline-none shadow-inner"
                        value={newPostContent}
                        onChange={e => setNewPostContent(e.target.value)}
                      />
                      <button 
                        type="submit" 
                        disabled={!newPostContent.trim() || isPosting}
                        className="bg-indigo-600 text-white px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-xl active:scale-95"
                      >
                         {isPosting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} PUBLICAR
                      </button>
                   </form>
                </div>
                
                <div className="space-y-6">
                  {posts.length > 0 ? posts.map(post => (
                    <div key={post.id} className="p-8 bg-gray-50 dark:bg-zinc-800/40 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 flex gap-6 transition-all hover:bg-white dark:hover:bg-zinc-800 hover:shadow-xl group">
                        <img src={post.userAvatar} className="w-14 h-14 rounded-2xl object-cover shadow-lg border-2 border-white group-hover:scale-105 transition-transform" alt={post.userName} />
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="text-base font-black text-gray-900 dark:text-white leading-none">{post.userName}</h4>
                                    <p className="text-[10px] text-indigo-600 dark:text-brand-primary font-black uppercase mt-1 italic">{post.businessName}</p>
                                </div>
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium mb-4">{post.content}</p>
                            <div className="flex gap-6 text-slate-400 border-t border-gray-100 dark:border-zinc-800 pt-4">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase hover:text-rose-500 transition-colors cursor-pointer"><Heart className="w-4 h-4" /> {post.likes} <span className="hidden md:inline">Curtidas</span></div>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase hover:text-indigo-600 transition-colors cursor-pointer"><MessageCircle className="w-4 h-4" /> {post.comments.length} <span className="hidden md:inline">Comentários</span></div>
                            </div>
                        </div>
                    </div>
                  )) : (
                    <div className="py-12 text-center opacity-50">
                        <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Sua rede está em silêncio...</p>
                    </div>
                  )}
                </div>
             </div>
          </div>

          <div className="lg:col-span-4 space-y-10">
             {/* Plano Ativo */}
             <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl border border-white/5">
                <div className="relative z-10">
                   <h4 className="font-black text-brand-primary text-base uppercase italic mb-6">Status do Plano</h4>
                   <div className="space-y-4 mb-8">
                      <div className="flex justify-between items-end">
                         <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Plano Atual</p>
                         <p className="text-xl font-black text-white italic uppercase tracking-tighter">{user.plan}</p>
                      </div>
                      <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-brand-primary rounded-full shadow-[0_0_15px_rgba(246,124,1,0.5)]" style={{ width: '60%' }}></div>
                      </div>
                   </div>
                   <Link to="/plans" className="flex items-center justify-between p-6 bg-white/5 rounded-3xl hover:bg-white/10 transition-all border border-white/5 group/item">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ver detalhes</span>
                      <ArrowRight className="w-4 h-4 text-white/40 group-hover/item:translate-x-1 transition-all" />
                   </Link>
                </div>
             </div>

             {/* Dica IA lateral */}
             <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-8">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950 rounded-2xl flex items-center justify-center text-indigo-600"><Bot className="w-6 h-6" /></div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight leading-tight">Insight Menu Flow</h3>
                <p className="text-gray-500 dark:text-zinc-400 text-sm font-medium leading-relaxed">
                  "Sua Bio Digital recebeu 15 cliques na última hora. Que tal criar um cupom de desconto exclusivo no Menu Flow para converter esses visitantes?"
                </p>
                <Link to="/bio-builder" className="inline-flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:gap-3 transition-all">
                  TURBINAR BIO AGORA <ArrowRight className="w-4 h-4" />
                </Link>
             </div>
          </div>
      </div>
    </div>
  );
};

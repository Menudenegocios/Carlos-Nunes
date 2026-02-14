
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { mockBackend } from '../services/mockBackend';
import { Profile, CommunityPost, Product } from '../types';
import { 
  Trophy, Star, Eye, Plus, Zap,
  ArrowRight, MessageSquare, Send, Heart, MoreHorizontal, 
  Image as ImageIcon, Users, RefreshCw,
  Target, Sparkles, CheckCircle, Megaphone,
  AlertCircle, ChevronRight, BarChart3, ShieldAlert, Bot
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [healthScore, setHealthScore] = useState(0);

  useEffect(() => {
    if (user) loadDashboardData();
  }, [user]);

  const calculateHealth = (prof: Profile | null, prods: Product[]) => {
    let score = 0;
    if (prof?.logoUrl) score += 20;
    if (prof?.bio && prof.bio.length > 20) score += 20;
    if (prof?.businessName) score += 10;
    if (prof?.phone) score += 10;
    if (prof?.city) score += 10;
    if (prods.length > 0) score += 30;
    return score;
  };

  const loadDashboardData = async () => {
    try {
      const [profile, communityPosts, myProducts] = await Promise.all([
        mockBackend.getProfile(user!.id),
        mockBackend.getCommunityPosts(),
        mockBackend.getProducts(user!.id)
      ]);
      setUserProfile(profile || null);
      setPosts(communityPosts);
      setProducts(myProducts);
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

  const handleLike = async (postId: string) => {
    if (!user) return;
    try {
      const updatedPost = await mockBackend.likePost(postId, user.id);
      setPosts(posts.map(p => p.id === postId ? updatedPost : p));
    } catch (e) { console.error(e); }
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-[fade-in_0.6s_ease-out]">
      
      {/* 1. TOP SECTION: HEALTH & ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* WELCOME & HEALTH SCORE */}
        <div className="lg:col-span-2 relative bg-white dark:bg-zinc-900 rounded-[3.5rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-xl overflow-hidden group">
           <div className="relative z-10 flex flex-col md:flex-row justify-between gap-10">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tighter leading-none mb-1">
                      Olá, {user.name.split(' ')[0]}!
                    </h1>
                    <p className="text-gray-400 text-sm font-bold">Otimize sua presença hoje. 🚀</p>
                  </div>
                </div>

                <div className="flex gap-4">
                    <Link to="/catalog" className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95">
                        <Plus className="w-4 h-4" /> Novo Item
                    </Link>
                    <Link to={`/store/${user.id}`} className="flex items-center gap-2 px-6 py-3 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95">
                        <Eye className="w-4 h-4" /> Ver Vitrine
                    </Link>
                </div>
              </div>

              {/* HEALTH GAUGE */}
              <div className="flex flex-col items-center justify-center text-center space-y-3 bg-emerald-50 dark:bg-black/20 p-6 rounded-[2.5rem] border border-emerald-100 min-w-[200px]">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-200 dark:text-zinc-800" />
                        <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={301.59} strokeDashoffset={301.59 - (healthScore / 100) * 301.59} strokeLinecap="round" className="text-emerald-600 transition-all duration-1000" />
                      </svg>
                      <span className="absolute text-2xl font-black dark:text-white">{healthScore}%</span>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-500">Saúde do Perfil</h4>
                    <p className="text-[9px] font-bold text-emerald-600">
                      {healthScore < 50 ? 'Otimização Pendente' : healthScore < 90 ? 'Perfil Quase Pronto' : 'Perfil Elite'}
                    </p>
                  </div>
              </div>
           </div>
           <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-600/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-emerald-600/10 transition-all"></div>
        </div>

        {/* SMART ALERTS IA */}
        <div className="bg-gradient-to-br from-emerald-900 to-indigo-950 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden border border-white/5">
           <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                    <Bot className="w-6 h-6 text-emerald-400" />
                 </div>
                 <h4 className="font-black tracking-tight text-sm uppercase">Dicas da MenuIA</h4>
              </div>
              
              <div className="space-y-4">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Ação Sugerida</p>
                    <p className="text-xs font-medium leading-relaxed">
                       {healthScore < 80 
                         ? "Seu catálogo está quase pronto! Adicione mais um item para subir seu nível." 
                         : "Vimos um pico de acessos no seu bairro. Que tal criar um cupom B2B?"}
                    </p>
                 </div>
                 <Link to="/marketplace-b2b" className="flex items-center justify-between p-4 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all">
                    Ver Parceiros B2B <ChevronRight className="w-4 h-4" />
                 </Link>
              </div>
           </div>
           <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* 2. ANALYTICS VISUAL */}
      <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                    <BarChart3 className="text-emerald-600" /> Performance da Rede
                </h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Sua visibilidade local (7 dias)</p>
             </div>
             <div className="flex gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-[10px] font-black uppercase text-gray-400">Views</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                    <span className="text-[10px] font-black uppercase text-gray-400">Leads</span>
                </div>
             </div>
          </div>

          <div className="flex items-end justify-between h-48 gap-4 px-4 pt-10">
             {[
               { day: 'Seg', v: 40, l: 15 },
               { day: 'Ter', v: 60, l: 20 },
               { day: 'Qua', v: 45, l: 12 },
               { day: 'Qui', v: 80, l: 35 },
               { day: 'Sex', v: 100, l: 50 },
               { day: 'Sab', v: 90, l: 40 },
               { day: 'Dom', v: 70, l: 25 },
             ].map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group h-full justify-end">
                    <div className="flex gap-1 items-end w-full h-full justify-center">
                        <div className="w-2.5 bg-emerald-500 rounded-t-full transition-all duration-1000 group-hover:opacity-80" style={{ height: `${data.v}%` }}></div>
                        <div className="w-2.5 bg-indigo-600 rounded-t-full transition-all duration-1000 group-hover:opacity-80" style={{ height: `${data.l}%` }}></div>
                    </div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{data.day}</span>
                </div>
             ))}
          </div>
      </div>

      {/* 3. ACTIVITY FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
             <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm">
                <div className="flex gap-5">
                   <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-zinc-800 flex-shrink-0 overflow-hidden border-2 border-white dark:border-zinc-700 shadow-md">
                      <img src={userProfile?.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} alt="Me" className="w-full h-full object-cover" />
                   </div>
                   <form onSubmit={handleCreatePost} className="flex-1 space-y-4">
                      <textarea 
                        rows={2}
                        placeholder={`Mande um alô para o bairro ou poste uma oferta...`}
                        className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-2xl p-5 text-sm focus:ring-2 focus:ring-emerald-500/20 resize-none transition-all placeholder:text-gray-400 dark:text-white font-bold"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                      />
                      <div className="flex justify-between items-center">
                         <div className="flex gap-1">
                            <button type="button" className="p-3 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"><ImageIcon className="w-5 h-5" /></button>
                         </div>
                         <button type="submit" disabled={!newPostContent.trim() || isPosting} className="bg-emerald-600 text-white px-10 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-lg flex items-center gap-2 transition-all">
                            {isPosting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Publicar
                         </button>
                      </div>
                   </form>
                </div>
             </div>

             <div className="space-y-6">
                {posts.map(post => <PostCard key={post.id} post={post} onLike={() => handleLike(post.id)} currentUserId={user.id} />)}
             </div>
          </div>

          {/* RIGHT SIDE: CLUB & STATS */}
          <div className="lg:col-span-4 space-y-8">
             <div className="bg-gradient-to-br from-emerald-900 to-indigo-950 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl">
                <div className="relative z-10">
                   <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                         <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10"><Zap className="w-6 h-6 text-emerald-400 fill-current" /></div>
                         <h4 className="font-black tracking-tight text-base uppercase">Clube ADS</h4>
                      </div>
                      <span className="text-[9px] font-black text-emerald-400 bg-white/5 px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/5">{user.level}</span>
                   </div>
                   
                   <div className="space-y-4 mb-10">
                      <div className="flex justify-between items-end">
                         <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Sua Pontuação</p>
                         <p className="text-2xl font-black text-white">{user.points} <span className="text-[10px] text-gray-400 uppercase tracking-widest">pts</span></p>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min((user.points / 1000) * 100, 100)}%` }}></div>
                      </div>
                   </div>

                   <Link to="/rewards" className="flex items-center justify-between p-6 bg-white/5 rounded-3xl hover:bg-white/10 transition-all border border-white/5 group/item">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Resgatar Prêmios</span>
                      <ArrowRight className="w-4 h-4 text-white/40 group-hover/item:translate-x-1 transition-all" />
                   </Link>
                </div>
                <div className="absolute -right-6 -bottom-6 text-white/5 group-hover:scale-110 transition-all duration-1000 pointer-events-none"><Trophy className="w-48 h-48" /></div>
             </div>

             <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-10">
                <h4 className="font-black text-gray-900 dark:text-white flex items-center gap-3 tracking-widest text-[10px] opacity-50 uppercase"><Target className="w-4 h-4" /> Resumo Rápido</h4>
                <div className="space-y-8">
                   <div className="flex items-center gap-5 group cursor-pointer">
                      <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950 rounded-2xl flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-110 shadow-sm border border-emerald-100"><Eye className="w-6 h-6" /></div>
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Visualizações</p>
                         <h5 className="text-xl font-black text-gray-900 dark:text-white">3.4k</h5>
                      </div>
                   </div>
                   <div className="flex items-center gap-5 group cursor-pointer">
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950 rounded-2xl flex items-center justify-center text-indigo-600 transition-transform group-hover:scale-110 shadow-sm border border-indigo-100"><CheckCircle className="w-6 h-6" /></div>
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Leads Ativos</p>
                         <h5 className="text-xl font-black text-gray-900 dark:text-white">14</h5>
                      </div>
                   </div>
                </div>
             </div>
          </div>
      </div>
    </div>
  );
};

const PostCard: React.FC<{ post: CommunityPost, onLike: () => any, currentUserId?: string }> = ({ post, onLike, currentUserId }) => {
  const isLiked = currentUserId && post.likedBy.includes(currentUserId);
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
       <div className="p-6 flex justify-between items-start">
          <div className="flex gap-4">
             <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 overflow-hidden shadow-sm">
                <img src={post.userAvatar} className="w-full h-full object-cover" alt={post.userName} />
             </div>
             <div>
                <h4 className="font-black text-gray-900 dark:text-white leading-tight text-xs tracking-tight">{post.userName}</h4>
                <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest mt-1">{post.businessName}</p>
             </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-900"><MoreHorizontal className="w-5 h-5" /></button>
       </div>
       <div className="px-8 pb-6 text-sm text-gray-700 dark:text-zinc-300 leading-relaxed font-bold">{post.content}</div>
       <div className="px-6 py-4 bg-gray-50/50 dark:bg-zinc-950/30 flex items-center gap-6 border-t border-gray-100 dark:border-zinc-800/50">
          <button onClick={onLike} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${isLiked ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-100'}`}>
             <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
             <span className="text-[10px] font-black uppercase">{post.likes}</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-gray-400 hover:bg-gray-100 transition-colors">
             <MessageSquare className="w-4 h-4" />
             <span className="text-[10px] font-black uppercase">{post.comments.length}</span>
          </button>
       </div>
    </div>
  );
};

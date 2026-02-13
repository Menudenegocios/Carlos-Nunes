
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
  Target, Sparkles, CheckCircle, Megaphone
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

  useEffect(() => {
    if (user) loadDashboardData();
  }, [user]);

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
    <div className="max-w-6xl mx-auto space-y-12 animate-[fade-in_0.6s_ease-out]">
      
      {/* 1. WELCOME BANNER */}
      <div className="relative bg-white dark:bg-zinc-900 rounded-[3.5rem] p-10 border border-brand-secondary/30 dark:border-zinc-800 shadow-xl overflow-hidden transition-colors">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-[2rem] bg-brand-primary flex items-center justify-center text-white shadow-xl">
                    <Sparkles className="w-10 h-10" />
                </div>
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-brand-contrast dark:text-brand-surface tracking-tighter leading-none mb-1">Seja bem vindo, {user.name.split(' ')[0]}!</h1>
                    <p className="text-brand-secondary font-bold">Seu negócio está pronto para novas oportunidades hoje.</p>
                </div>
            </div>
            <div className="flex gap-3">
                <Link to="/catalog" className="flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg">
                    <Plus className="w-4 h-4" /> Novo Item
                </Link>
                <Link to={`/store/${user.id}`} className="flex items-center gap-2 px-8 py-4 bg-brand-surface dark:bg-zinc-800 text-brand-contrast dark:text-brand-surface border border-brand-secondary/50 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-secondary/20 transition-all">
                    <Eye className="w-4 h-4" /> Ver Vitrine
                </Link>
            </div>
        </div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-primary/5 rounded-full blur-[80px] pointer-events-none opacity-50"></div>
      </div>

      {/* 2. ACTIVITY & CLUB */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
             <div className="bg-brand-accent/10 dark:bg-zinc-900 border border-brand-accent/30 rounded-[2.5rem] p-8 flex gap-6 items-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-primary flex items-center justify-center flex-shrink-0 shadow-lg">
                   <Megaphone className="w-8 h-8 text-white" />
                </div>
                <div>
                   <h3 className="text-lg font-black text-brand-contrast dark:text-brand-surface uppercase tracking-tight mb-1">Impulsione seu Networking</h3>
                   <p className="text-sm text-brand-contrast/70 dark:text-brand-secondary font-bold leading-relaxed">
                     O <strong>Feed de Negócios</strong> é seu canal direto de oportunidades. Compartilhe ofertas, encontre parceiros estratégicos e fortaleça sua marca agora mesmo.
                   </p>
                </div>
             </div>

             <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-brand-secondary/30 dark:border-zinc-800 shadow-sm">
                <div className="flex gap-5">
                   <div className="w-14 h-14 rounded-2xl bg-brand-surface dark:bg-zinc-800 flex-shrink-0 overflow-hidden border-2 border-white dark:border-zinc-700 shadow-md">
                      <img src={userProfile?.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} alt="Me" className="w-full h-full object-cover" />
                   </div>
                   <form onSubmit={handleCreatePost} className="flex-1 space-y-4">
                      <textarea 
                        rows={2}
                        placeholder={`Diga algo para a comunidade do seu bairro...`}
                        className="w-full bg-brand-surface/50 dark:bg-zinc-800 border border-brand-secondary/20 rounded-2xl p-5 text-sm focus:ring-2 focus:ring-brand-primary/20 resize-none transition-all placeholder:text-brand-secondary dark:text-brand-surface font-bold"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                      />
                      <div className="flex justify-between items-center">
                         <div className="flex gap-1">
                            <button type="button" className="p-3 text-brand-secondary hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all"><ImageIcon className="w-5 h-5" /></button>
                         </div>
                         <button type="submit" disabled={!newPostContent.trim() || isPosting} className="bg-brand-primary text-white px-10 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-brand-primary/80 shadow-lg flex items-center gap-2 transition-all">
                            {isPosting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Publicar
                         </button>
                      </div>
                   </form>
                </div>
             </div>

             <div className="space-y-6">
                <div className="flex items-center justify-between px-4">
                   <h3 className="font-black text-brand-contrast dark:text-white flex items-center gap-2 tracking-widest text-[10px] uppercase"><Users className="w-4 h-4" /> Feed da Comunidade</h3>
                </div>
                {posts.map(post => <PostCard key={post.id} post={post} onLike={() => handleLike(post.id)} currentUserId={user.id} />)}
             </div>
          </div>

          <div className="lg:col-span-4 space-y-10">
             <div className="bg-brand-contrast dark:bg-zinc-900 rounded-[3rem] p-10 text-brand-surface relative overflow-hidden group shadow-2xl">
                <div className="relative z-10">
                   <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                         <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10"><Zap className="w-6 h-6 text-brand-accent fill-current" /></div>
                         <h4 className="font-black tracking-tight text-base uppercase">Clube ADS</h4>
                      </div>
                      <span className="text-[9px] font-black text-brand-accent bg-white/5 px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/5">{user.level}</span>
                   </div>
                   
                   <div className="space-y-4 mb-10">
                      <div className="flex justify-between items-end">
                         <p className="text-brand-secondary text-xs font-black uppercase tracking-widest">Sua Pontuação</p>
                         <p className="text-2xl font-black text-white">{user.points} <span className="text-[10px] text-brand-secondary uppercase tracking-widest">pts</span></p>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-brand-primary rounded-full" style={{ width: `${Math.min((user.points / 1000) * 100, 100)}%` }}></div>
                      </div>
                      <p className="text-[10px] text-brand-secondary font-bold uppercase tracking-widest leading-relaxed">Faltam {1000 - user.points > 0 ? 1000 - user.points : 0} pontos para o próximo nível.</p>
                   </div>

                   <Link to="/rewards" className="flex items-center justify-between p-6 bg-white/5 rounded-3xl hover:bg-white/10 transition-all border border-white/5 group/item">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ver Recompensas</span>
                      <ArrowRight className="w-4 h-4 text-brand-surface/40 group-hover/item:translate-x-1 transition-all" />
                   </Link>
                </div>
                <div className="absolute -right-6 -bottom-6 text-white/5 group-hover:scale-110 transition-all duration-1000 pointer-events-none"><Trophy className="w-48 h-48" /></div>
             </div>

             <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 border border-brand-secondary/30 dark:border-zinc-800 shadow-sm space-y-10">
                <h4 className="font-black text-brand-contrast dark:text-brand-surface flex items-center gap-3 tracking-widest text-[10px] opacity-50 uppercase"><Target className="w-4 h-4" /> Desempenho Local</h4>
                <div className="space-y-8">
                   <div className="flex items-center gap-5 group cursor-pointer">
                      <div className="w-12 h-12 bg-brand-surface dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-brand-primary transition-transform group-hover:scale-110 shadow-sm border border-brand-secondary/20"><Eye className="w-6 h-6" /></div>
                      <div>
                         <p className="text-[10px] font-black text-brand-secondary uppercase tracking-widest mb-1">Visualizações</p>
                         <h5 className="text-xl font-black text-brand-contrast dark:text-brand-surface">3.4k</h5>
                      </div>
                   </div>
                   <div className="flex items-center gap-5 group cursor-pointer">
                      <div className="w-12 h-12 bg-brand-accent/10 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-brand-primary transition-transform group-hover:scale-110 shadow-sm border border-brand-accent/20"><CheckCircle className="w-6 h-6" /></div>
                      <div>
                         <p className="text-[10px] font-black text-brand-secondary uppercase tracking-widest mb-1">Leads Ativos</p>
                         <h5 className="text-xl font-black text-brand-contrast dark:text-brand-surface">14</h5>
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
    <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-brand-secondary/30 dark:border-zinc-800 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
       <div className="p-6 flex justify-between items-start">
          <div className="flex gap-4">
             <div className="w-12 h-12 rounded-xl bg-brand-surface dark:bg-zinc-800 border border-brand-secondary/20 overflow-hidden shadow-sm">
                <img src={post.userAvatar} className="w-full h-full object-cover" alt={post.userName} />
             </div>
             <div>
                <h4 className="font-black text-brand-contrast dark:text-brand-surface leading-tight text-xs tracking-tight">{post.userName}</h4>
                <p className="text-[9px] text-brand-primary font-black uppercase tracking-widest mt-1">{post.businessName}</p>
             </div>
          </div>
          <button className="p-2 text-brand-secondary hover:text-brand-contrast"><MoreHorizontal className="w-5 h-5" /></button>
       </div>
       <div className="px-8 pb-6 text-sm text-brand-contrast/80 dark:text-brand-surface/80 leading-relaxed font-bold">{post.content}</div>
       <div className="px-6 py-4 bg-brand-surface/50 dark:bg-zinc-950/30 flex items-center gap-6 border-t border-brand-secondary/10">
          <button onClick={onLike} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${isLiked ? 'bg-brand-primary/10 text-brand-primary' : 'text-brand-secondary hover:bg-brand-surface'}`}>
             <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
             <span className="text-[10px] font-black uppercase">{post.likes}</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-brand-secondary hover:bg-brand-surface transition-colors">
             <MessageSquare className="w-4 h-4" />
             <span className="text-[10px] font-black uppercase">{post.comments.length}</span>
          </button>
       </div>
    </div>
  );
};

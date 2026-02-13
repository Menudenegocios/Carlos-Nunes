
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { Profile, CommunityPost, Product } from '../types';
import { 
  ShoppingBag, Trophy, Star, Eye, Plus, Zap,
  Smartphone, Briefcase, GraduationCap, Package,
  ArrowRight, MessageSquare, Send, Heart, MoreHorizontal, 
  Image as ImageIcon, Users, LayoutDashboard, RefreshCw,
  Target, Sparkles, CheckCircle
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
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

  const hubs = [
    { 
        label: 'Bio Digital', 
        icon: Smartphone, 
        to: '/bio-builder', 
        color: 'bg-purple-50 text-purple-600', 
        status: userProfile?.bio ? 'Configurada' : 'Pendente',
        desc: 'Seu cartão inteligente no Instagram'
    },
    { 
        label: 'Catálogo & Loja', 
        icon: Package, 
        to: '/catalog', 
        color: 'bg-emerald-50 text-emerald-600', 
        status: `${products.length} itens`,
        desc: 'Vitrine digital sem comissões'
    },
    { 
        label: 'Business Suite', 
        icon: Briefcase, 
        to: '/business-suite', 
        color: 'bg-blue-50 text-blue-600', 
        status: 'Painel CRM',
        desc: 'Gestão de orçamentos e caixa'
    },
    { 
        label: 'Menu Academy', 
        icon: GraduationCap, 
        to: '/academy', 
        color: 'bg-amber-50 text-amber-600', 
        status: 'Treinamentos',
        desc: 'Aprenda a vender mais no bairro'
    },
    { 
        label: 'Clube Vantagens', 
        icon: Trophy, 
        to: '/rewards', 
        color: 'bg-indigo-50 text-indigo-600', 
        status: `${user.points} pts`,
        desc: 'Suas atividades valem prêmios'
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-[fade-in_0.6s_ease-out]">
      
      {/* 1. WELCOME BANNER */}
      <div className="relative bg-white rounded-[3.5rem] p-10 border border-gray-100 shadow-2xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                    <Sparkles className="w-10 h-10" />
                </div>
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">Bom dia, {user.name.split(' ')[0]}!</h1>
                    <p className="text-gray-500 font-medium">Seu negócio está pronto para novas oportunidades hoje.</p>
                </div>
            </div>
            <div className="flex gap-3">
                <Link to="/catalog" className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-95">
                    <Plus className="w-4 h-4" /> Novo Item
                </Link>
                <Link to={`/store/${user.id}`} className="flex items-center gap-2 px-8 py-4 bg-gray-100 text-gray-900 border border-gray-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95">
                    <Eye className="w-4 h-4" /> Ver Vitrine
                </Link>
            </div>
        </div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-50 rounded-full blur-[80px] pointer-events-none opacity-50"></div>
      </div>

      {/* 2. PILLARS HUB GRID */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-4">
            <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
            <h2 className="font-black text-gray-900 text-sm tracking-[0.2em]">Os 5 pilares do seu negócio</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {hubs.map((hub, idx) => (
                <Link 
                    key={idx} 
                    to={hub.to} 
                    className="group bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all flex flex-col items-center text-center gap-5"
                >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${hub.color}`}>
                        <hub.icon className="w-8 h-8" />
                    </div>
                    <div className="space-y-1 flex-1">
                        <h3 className="font-black text-gray-900 text-sm tracking-tight">{hub.label}</h3>
                        <p className="text-[10px] font-bold text-gray-400 leading-snug">{hub.desc}</p>
                    </div>
                    <div className="px-4 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                        <span className="text-[9px] font-black uppercase text-indigo-600">{hub.status}</span>
                    </div>
                </Link>
            ))}
        </div>
      </div>

      {/* 3. ACTIVITY & CLUB */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-8">
             <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                <div className="flex gap-5">
                   <div className="w-14 h-14 rounded-2xl bg-gray-50 flex-shrink-0 overflow-hidden border-2 border-white shadow-md">
                      <img src={userProfile?.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} alt="Me" className="w-full h-full object-cover" />
                   </div>
                   <form onSubmit={handleCreatePost} className="flex-1 space-y-4">
                      <textarea 
                        rows={2}
                        placeholder={`Diga algo para a comunidade do seu bairro...`}
                        className="w-full bg-gray-50 border-none rounded-2xl p-5 text-sm focus:ring-2 focus:ring-indigo-100 resize-none transition-all placeholder:text-gray-400 font-medium"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                      />
                      <div className="flex justify-between items-center">
                         <div className="flex gap-1">
                            <button type="button" className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><ImageIcon className="w-5 h-5" /></button>
                         </div>
                         <button type="submit" disabled={!newPostContent.trim() || isPosting} className="bg-indigo-600 text-white px-10 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 disabled:bg-gray-200 shadow-lg flex items-center gap-2 transition-all">
                            {isPosting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Publicar
                         </button>
                      </div>
                   </form>
                </div>
             </div>

             <div className="space-y-6">
                <div className="flex items-center justify-between px-4">
                   <h3 className="font-black text-gray-900 flex items-center gap-2 tracking-widest text-[10px] opacity-50"><Users className="w-4 h-4" /> Feed da Comunidade</h3>
                </div>
                {posts.map(post => <PostCard key={post.id} post={post} onLike={() => handleLike(post.id)} currentUserId={user.id} />)}
             </div>
          </div>

          {/* Sidebar Widgets */}
          <div className="lg:col-span-4 space-y-10">
             
             {/* Gamified Points Widget */}
             <div className="bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl">
                <div className="relative z-10">
                   <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                         <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10"><Zap className="w-6 h-6 text-yellow-400 fill-current animate-pulse" /></div>
                         <h4 className="font-black tracking-tight text-base uppercase">Clube Ads</h4>
                      </div>
                      <span className="text-[9px] font-black text-indigo-300 bg-white/5 px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/5">{user.level}</span>
                   </div>
                   
                   <div className="space-y-4 mb-10">
                      <div className="flex justify-between items-end">
                         <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest opacity-60">Sua Pontuação</p>
                         <p className="text-2xl font-black text-white">{user.points} <span className="text-[10px] text-gray-500 uppercase tracking-widest">pts</span></p>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min((user.points / 1000) * 100, 100)}%` }}></div>
                      </div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">Faltam {1000 - user.points > 0 ? 1000 - user.points : 0} pontos para o próximo nível de autoridade.</p>
                   </div>

                   <Link to="/rewards" className="flex items-center justify-between p-6 bg-white/5 rounded-3xl hover:bg-white/10 transition-all border border-white/5 group/item">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ver Recompensas</span>
                      <ArrowRight className="w-4 h-4 text-white/40 group-hover/item:translate-x-1 transition-all" />
                   </Link>
                </div>
                <div className="absolute -right-6 -bottom-6 text-white/5 group-hover:scale-110 transition-all duration-1000 pointer-events-none"><Trophy className="w-48 h-48" /></div>
             </div>

             {/* Quick Stats Sidebar */}
             <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-10">
                <h4 className="font-black text-gray-900 flex items-center gap-3 tracking-widest text-[10px] opacity-50"><Target className="w-4 h-4" /> Desempenho Local</h4>
                <div className="space-y-8">
                   <div className="flex items-center gap-5 group cursor-pointer">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110"><Eye className="w-6 h-6" /></div>
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Visualizações</p>
                         <h5 className="text-xl font-black text-gray-900">3.4k</h5>
                      </div>
                   </div>
                   <div className="flex items-center gap-5 group cursor-pointer">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-110"><CheckCircle className="w-6 h-6" /></div>
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Leads Ativos</p>
                         <h5 className="text-xl font-black text-gray-900">14</h5>
                      </div>
                   </div>
                </div>
                <button className="w-full py-5 bg-gray-50 rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:bg-gray-100 hover:text-indigo-600 transition-all border border-gray-100 shadow-sm">Relatório Detalhado</button>
             </div>
          </div>
      </div>
    </div>
  );
};

const PostCard: React.FC<{ post: CommunityPost, onLike: () => any, currentUserId?: number }> = ({ post, onLike, currentUserId }) => {
  const [showComments, setShowComments] = useState(false);
  const isLiked = currentUserId && post.likedBy.includes(currentUserId);
  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
       <div className="p-6 flex justify-between items-start">
          <div className="flex gap-4">
             <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shadow-sm">
                <img src={post.userAvatar} className="w-full h-full object-cover" alt={post.userName} />
             </div>
             <div>
                <h4 className="font-black text-gray-900 leading-tight text-xs tracking-tight">{post.userName}</h4>
                <p className="text-[9px] text-indigo-600 font-black uppercase tracking-widest mt-1">{post.businessName}</p>
             </div>
          </div>
          <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
       </div>
       <div className="px-8 pb-6 text-sm text-gray-700 leading-relaxed font-medium">{post.content}</div>
       <div className="px-6 py-4 bg-gray-50/50 flex items-center gap-6 border-t border-gray-50">
          <button onClick={onLike} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${isLiked ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}>
             <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
             <span className="text-[10px] font-black uppercase">{post.likes}</span>
          </button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-gray-500 hover:bg-gray-100">
             <MessageSquare className="w-4 h-4" />
             <span className="text-[10px] font-black uppercase">{post.comments.length}</span>
          </button>
       </div>
    </div>
  );
};

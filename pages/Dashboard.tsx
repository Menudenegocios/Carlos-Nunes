
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { Profile, CommunityPost } from '../types';
import { 
  ShoppingBag, Trophy, Star, Eye, Plus, Zap,
  ChevronRight, Share2, Ticket, Bell, Sparkles, 
  MessageSquare, Send, Heart, MoreHorizontal, 
  Image as ImageIcon, Users, TrendingUp, LayoutDashboard, RefreshCw
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (user) loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [profile, communityPosts] = await Promise.all([
        mockBackend.getProfile(user!.id),
        mockBackend.getCommunityPosts()
      ]);
      setUserProfile(profile || null);
      setPosts(communityPosts);
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

  const stats = [
    { label: 'Visitas na Loja', value: '3.4k', trend: '+12%', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pedidos/Leads', value: '14', trend: 'Hoje', icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Avaliação', value: '4.9', trend: 'Excelente', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'Pontos Clube', value: user.points, trend: user.level.toUpperCase(), icon: Trophy, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4">
      
      {/* Academy Style Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
                 <LayoutDashboard className="h-10 w-10 text-cyan-400" />
              </div>
              <div>
                 <h1 className="text-3xl md:text-5xl font-black tracking-tight">Olá, {user.name.split(' ')[0]}! 👋</h1>
                 <p className="text-indigo-200 text-lg font-medium">Veja o que está acontecendo hoje no seu negócio.</p>
              </div>
            </div>

            <div className="flex gap-3">
               <Link to={`/store/${user.id}`} className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl font-bold text-white hover:bg-white/20 transition-all">
                 <Eye className="w-5 h-5" /> Ver Loja
               </Link>
               <Link to="/catalog" className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all">
                 <Plus className="w-5 h-5" /> NOVO PRODUTO
               </Link>
            </div>
          </div>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      <div className="animate-[fade-in_0.4s_ease-out] space-y-12">
        
        {/* Stats Grid - Premium rounded */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex flex-col items-center text-center gap-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${stat.bg} ${stat.color}`}>
                 <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <div className="flex items-center justify-center gap-2">
                  <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                  <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-lg">{stat.trend}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-8">
             <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                <div className="flex gap-5">
                   <div className="w-14 h-14 rounded-2xl bg-gray-100 flex-shrink-0 overflow-hidden border-2 border-white shadow-md">
                      <img src={userProfile?.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} alt="Me" className="w-full h-full object-cover" />
                   </div>
                   <form onSubmit={handleCreatePost} className="flex-1 space-y-4">
                      <textarea 
                        rows={2}
                        placeholder={`O que há de novo hoje?`}
                        className="w-full bg-gray-50 border-none rounded-[1.5rem] p-5 text-sm focus:ring-2 focus:ring-indigo-100 resize-none transition-all placeholder:text-gray-400 font-medium"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                      />
                      <div className="flex justify-between items-center">
                         <div className="flex gap-1">
                            <button type="button" className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><ImageIcon className="w-5 h-5" /></button>
                            <button type="button" className="p-3 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all"><Sparkles className="w-5 h-5" /></button>
                         </div>
                         <button type="submit" disabled={!newPostContent.trim() || isPosting} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 disabled:bg-gray-200 shadow-lg shadow-indigo-600/20 flex items-center gap-2">
                            {isPosting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Postar
                         </button>
                      </div>
                   </form>
                </div>
             </div>

             <div className="space-y-6">
                <div className="flex items-center justify-between px-4">
                   <h3 className="font-black text-gray-900 flex items-center gap-2 uppercase tracking-widest text-xs"><Users className="w-4 h-4 text-indigo-600" /> Atividade da Comunidade</h3>
                </div>
                {posts.map(post => <PostCard key={post.id} post={post} onLike={() => handleLike(post.id)} currentUserId={user.id} />)}
             </div>
          </div>

          {/* Academy Style Sidebar */}
          <div className="lg:col-span-4 space-y-8">
             <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl">
                <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><Trophy className="w-5 h-5 text-yellow-400" /></div>
                      <h4 className="font-black tracking-tight">Status do Clube</h4>
                   </div>
                   <div className="text-center mb-8">
                      <span className="text-6xl font-black leading-none">{user.points}</span>
                      <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mt-2">Pontos Acumulados</p>
                   </div>
                   <Link to="/rewards" className="flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all group/item">
                      <span className="text-sm font-bold">Resgatar Prêmios</span>
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover/item:translate-x-1 transition-all" />
                   </Link>
                </div>
                <div className="absolute -right-6 -bottom-6 text-white/5 group-hover:scale-110 transition-all"><Trophy className="w-32 h-32" /></div>
             </div>

             <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6">
                <h4 className="font-black text-gray-900 flex items-center gap-2 tracking-tight text-base"><Bell className="w-5 h-5 text-indigo-600" /> Notificações</h4>
                <div className="space-y-6">
                   <div className="flex gap-4 items-start group cursor-pointer">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2 flex-shrink-0"></div>
                      <div>
                         <p className="text-xs font-black text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Nova aula na Academy</p>
                         <p className="text-[11px] text-gray-500 leading-relaxed font-medium">Domine o novo editor de Bio Digital.</p>
                      </div>
                   </div>
                </div>
             </div>
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
                <h4 className="font-black text-gray-900 leading-tight">{post.userName}</h4>
                <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">{post.businessName}</p>
             </div>
          </div>
          <button className="p-2 text-gray-300 hover:text-gray-600 transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
       </div>
       <div className="px-8 pb-6 text-sm text-gray-700 leading-relaxed font-medium">{post.content}</div>
       <div className="px-6 py-3 bg-gray-50/50 flex items-center gap-6 border-t border-gray-50">
          <button onClick={onLike} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isLiked ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}>
             <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
             <span className="text-[10px] font-black uppercase">{post.likes}</span>
          </button>
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100">
             <MessageSquare className="w-4 h-4" />
             <span className="text-[10px] font-black uppercase">{post.comments.length}</span>
          </button>
       </div>
    </div>
  );
};

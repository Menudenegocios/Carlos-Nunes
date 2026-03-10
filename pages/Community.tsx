
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { firebaseService } from '../services/firebaseService';
import { CommunityPost, Profile } from '../types';
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Share2, 
  Image as ImageIcon, 
  Send,
  MoreHorizontal,
  Search,
  Sparkles,
  TrendingUp,
  MapPin
} from 'lucide-react';

export const Community: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const fetchedPosts = await firebaseService.getCommunityPosts();
      const profile = await firebaseService.getProfile(user!.id);
      setPosts(fetchedPosts);
      setUserProfile(profile || null);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !user) return;

    setIsPosting(true);
    try {
      const newPost = await firebaseService.createCommunityPost({
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
      await firebaseService.likePost(postId, user.id);
      setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1, likedBy: [...(p.likedBy || []), user.id] } : p));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Carregando comunidade...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 pt-6">
      
      {/* Community Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-blue-200" />
            <h1 className="text-3xl font-black">Menu Community</h1>
          </div>
          <p className="text-blue-100 max-w-xl">
             Conecte-se com outros empresários, compartilhe sucessos e encontre novas oportunidades de parceria.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar - Profile Summary */}
        <div className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-24">
             <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-gray-100 mx-auto mb-4 border-4 border-white shadow-lg overflow-hidden">
                   <img 
                    src={userProfile?.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} 
                    className="w-full h-full object-cover" 
                    alt="Me" 
                   />
                </div>
                <h3 className="font-bold text-gray-900 leading-tight">{user?.name}</h3>
                <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mt-1">{userProfile?.businessName || 'Meu Negócio'}</p>
             </div>
             
             <div className="mt-8 space-y-4 pt-6 border-t border-gray-50">
                <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-500 font-medium">Postagens</span>
                   <span className="font-black text-gray-900">{posts.filter(p => p.userId === user?.id).length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-500 font-medium">Pontos Clube</span>
                   <span className="font-black text-emerald-600">{user?.points}</span>
                </div>
             </div>
          </div>
        </div>

        {/* Center - Feed */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Post Composer */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
             <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                    <img src={userProfile?.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} alt="Me" className="w-full h-full object-cover" />
                </div>
                <form onSubmit={handleCreatePost} className="flex-1 space-y-4">
                   <textarea 
                     rows={3}
                     placeholder={`O que está acontecendo no seu negócio, ${user?.name.split(' ')[0]}?`}
                     className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-100 resize-none transition-all placeholder:text-gray-400"
                     value={newPostContent}
                     onChange={(e) => setNewPostContent(e.target.value)}
                   />
                   <div className="flex justify-between items-center pt-2">
                      <div className="flex gap-2">
                         <button type="button" className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                            <ImageIcon className="w-5 h-5" />
                         </button>
                         <button type="button" className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                            <Sparkles className="w-5 h-5" />
                         </button>
                      </div>
                      <button 
                        type="submit" 
                        disabled={!newPostContent.trim() || isPosting}
                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                      >
                         <Send className="w-4 h-4" /> {isPosting ? 'Postando...' : 'Compartilhar'}
                      </button>
                   </div>
                </form>
             </div>
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            {posts.map(post => (
               <PostCard 
                 key={post.id} 
                 post={post} 
                 onLike={() => handleLike(post.id)} 
                 currentUserId={user?.id}
               />
            ))}
            {posts.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                  <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma postagem ainda. Seja o primeiro!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Suggestions */}
        <div className="hidden lg:block lg:col-span-3 space-y-6">
           <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                 <TrendingUp className="w-4 h-4 text-emerald-500" /> Em Destaque
              </h3>
              <div className="space-y-4">
                 <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-xs font-bold text-indigo-600 uppercase mb-1">Dica de hoje</p>
                    <p className="text-xs text-gray-600 leading-relaxed">Parcerias locais podem aumentar seu faturamento em até 30%. Já falou com seu vizinho hoje?</p>
                 </div>
                 <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Próximos Eventos</p>
                    <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-all cursor-pointer group">
                       <div className="w-10 h-10 bg-indigo-50 rounded-lg flex flex-col items-center justify-center text-indigo-600 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                          <span className="text-[10px] font-black uppercase leading-none">OUT</span>
                          <span className="text-sm font-black">22</span>
                       </div>
                       <div>
                          <p className="text-xs font-bold text-gray-800">Workshop: Vendas com IA</p>
                          <p className="text-[10px] text-gray-500 flex items-center gap-1"><MapPin className="w-2.5 h-2.5" /> Online (Meet)</p>
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

const PostCard: React.FC<{ post: CommunityPost, onLike: () => any, currentUserId?: string }> = ({ post, onLike, currentUserId }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const isLiked = currentUserId && post.likedBy?.includes(currentUserId);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in">
       {/* Card Header */}
       <div className="p-6 pb-4 flex justify-between items-start">
          <div className="flex gap-4">
             <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                <img src={post.userAvatar} className="w-full h-full object-cover" alt={post.userName} />
             </div>
             <div>
                <h4 className="font-bold text-gray-900 leading-tight">{post.userName}</h4>
                <p className="text-xs text-indigo-600 font-bold">{post.businessName}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{new Date(post.createdAt).toLocaleDateString()} às {new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
             </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-5 h-5" /></button>
       </div>

       {/* Card Body */}
       <div className="px-6 pb-4">
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
          {post.imageUrl && (
            <div className="mt-4 rounded-2xl overflow-hidden border border-gray-100">
               <img src={post.imageUrl} className="w-full object-cover max-h-80" alt="Post content" />
            </div>
          )}
       </div>

       {/* Stats */}
       {(post.likes > 0 || post.comments.length > 0) && (
          <div className="px-6 py-2 flex justify-between items-center text-[11px] text-gray-400 font-medium">
             <div className="flex items-center gap-1">
                {post.likes > 0 && (
                  <div className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-full">
                     <Heart className="w-3 h-3 fill-current" />
                     <span>{post.likes}</span>
                  </div>
                )}
             </div>
             <div className="flex gap-3">
                {post.comments.length > 0 && <span>{post.comments.length} comentários</span>}
             </div>
          </div>
       )}

       {/* Actions */}
       <div className="px-6 py-2 border-t border-gray-50 flex gap-2">
          <button 
            onClick={onLike}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all ${isLiked ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
             <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
             <span className="text-sm font-bold">{isLiked ? 'Curtiu' : 'Curtir'}</span>
          </button>
          <button 
            onClick={() => setShowComments(!showComments)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-gray-500 hover:bg-gray-50 transition-all ${showComments ? 'bg-indigo-50 text-indigo-600' : ''}`}
          >
             <MessageSquare className="w-5 h-5" />
             <span className="text-sm font-bold">Comentar</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-gray-500 hover:bg-gray-50 transition-all">
             <Share2 className="w-5 h-5" />
             <span className="text-sm font-bold">Enviar</span>
          </button>
       </div>

       {/* Comments Section */}
       {showComments && (
          <div className="bg-gray-50/50 p-6 space-y-4 animate-fade-in border-t border-gray-50">
             <div className="space-y-4">
                {post.comments.map(comment => (
                   <div key={comment.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                         <img src={comment.userAvatar} alt={comment.userName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                         <h5 className="text-xs font-black text-gray-900 mb-0.5">{comment.userName}</h5>
                         <p className="text-xs text-gray-600 leading-relaxed">{comment.content}</p>
                      </div>
                   </div>
                ))}
             </div>

             <div className="flex gap-3 pt-2">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex-shrink-0 border border-gray-200">
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${currentUserId}`} alt="Me" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 relative">
                   <input 
                     type="text" 
                     placeholder="Escreva seu comentário..." 
                     className="w-full bg-white border-gray-100 rounded-xl py-2 pl-4 pr-10 text-xs focus:ring-2 focus:ring-indigo-100"
                     value={commentText}
                     onChange={(e) => setCommentText(e.target.value)}
                   />
                   <button className="absolute right-2 top-1.5 p-1 text-indigo-600 hover:scale-110 transition-transform">
                      <Send className="w-4 h-4" />
                   </button>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};

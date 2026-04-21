
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Search, User, MessageCircle, MoreVertical, 
  Phone, Video, Info, Image as ImageIcon, Smile,
  ChevronLeft, Plus, History
} from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, X } from 'lucide-react';
import { DirectMessage, Profile } from '../types';
import { SimpleModal } from '../components/SimpleModal';

export const DirectMessages: React.FC<{ setModalConfig?: (config: any) => void }> = ({ setModalConfig: parentSetModalConfig }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [selectedChat, setSelectedChat] = useState<{
    other_id: string;
    other_name: string;
    other_avatar?: string;
  } | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  
  const [localModalConfig, setLocalModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
    onConfirm?: () => void;
    confirmText?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  // Helper to use either parent or local modal
  const setModalConfig = parentSetModalConfig || setLocalModalConfig;
  const modalConfig = parentSetModalConfig ? { isOpen: false } : localModalConfig; // When using parent, local modalConfig is effectively unused by SimpleModal call
  const [archivedChats, setArchivedChats] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const commonEmojis = ['🤝', '🚀', '🔥', '👏', '🎯', '💰', '✨', '✅', '📈', '🙌', '💡', '🏆'];

  useEffect(() => {
    if (user) {
      if (user.plan === 'pre-cadastro' && user.role !== 'admin') {
        navigate('/dashboard');
        return;
      }
      
      const saved = localStorage.getItem(`archived_chats_${user.id}`);
      if (saved) setArchivedChats(JSON.parse(saved));
    }
  }, [user, navigate]);

  const toggleArchive = (otherId: string) => {
    if (!user) return;
    const isArchived = archivedChats.includes(otherId);
    const newArchived = isArchived
      ? archivedChats.filter(id => id !== otherId)
      : [...archivedChats, otherId];
    setArchivedChats(newArchived);
    localStorage.setItem(`archived_chats_${user.id}`, JSON.stringify(newArchived));
    setIsActionsOpen(false);
    if (!isArchived) setSelectedChat(null);
    loadConversations();
  };

  const deleteThread = async (otherId: string) => {
    if (!user) return;
    
    setModalConfig({
      isOpen: true,
      title: 'Excluir Conversa',
      message: 'Tem certeza que deseja excluir TODA a conversa? Esta ação é irreversível.',
      type: 'info',
      confirmText: 'EXCLUIR TUDO',
      onConfirm: async () => {
        try {
          await supabaseService.deleteConversation(user.id, otherId);
          setMessages([]);
          setSelectedChat(null);
          loadConversations();
        } catch (error) {
          setModalConfig({
            isOpen: true,
            title: 'Erro',
            message: 'Não foi possível excluir a conversa.',
            type: 'error'
          });
        }
      }
    });
    setIsActionsOpen(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !selectedChat) return;

    try {
      const url = await supabaseService.uploadChatImage(file);
      await supabaseService.sendDirectMessage({
        sender_id: user.id,
        receiver_id: selectedChat.other_id,
        content: `[IMAGE]${url}`
      });
      loadMessages(selectedChat.other_id);
    } catch (error) {
      console.error("Error uploading file:", error);
      setModalConfig({
        isOpen: true,
        title: 'Erro',
        message: 'Erro ao enviar imagem.',
        type: 'error'
      });
    }
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setIsEmojiOpen(false);
  };


  useEffect(() => {
    if (user) {
      loadConversations();
      
      const sub = supabaseService.subscribeToMessages(user.id, (payload: { new: DirectMessage }) => {
        const newMsg = payload.new;
        
        // Se a conversa for a selecionada, adiciona a mensagem
        if (selectedChat && (newMsg.sender_id === selectedChat.other_id || newMsg.receiver_id === selectedChat.other_id)) {
          setMessages(prev => {
            // Evitar duplicados se o loadMessages for disparado ao mesmo tempo
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
        
        // Independente de ser a selecionada, atualiza a lista de conversas
        loadConversations();
      });

      const params = new URLSearchParams(location.search);
      const userIdParam = params.get('userId');
      if (userIdParam) {
        startChatWithUser(userIdParam);
      }

      return () => {
        sub.unsubscribe();
      };
    }
  }, [user, location.search, selectedChat]);

  const startChatWithUser = async (otherId: string) => {
    try {
      const profile = await supabaseService.getProfile(otherId);
      if (profile) {
        setSelectedChat({
          other_id: profile.user_id,
          other_name: profile.name || profile.business_name,
          other_avatar: profile.logo_url
        });
        setIsSearchModalOpen(false);
      }
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  const handleSearchUsers = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    const results = await supabaseService.searchProfiles(query);
    setSearchResults(results.filter(p => p.user_id !== user?.id));
  };

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.other_id);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await supabaseService.getConversations(user.id);
      setConversations(data);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (otherId: string) => {
    if (!user) return;
    const data = await supabaseService.getDirectMessages(user.id, otherId);
    setMessages(data);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !user) return;

    const msgData = {
      sender_id: user.id,
      receiver_id: selectedChat.other_id,
      content: newMessage.trim()
    };

    try {
      await supabaseService.sendDirectMessage(msgData);
      setNewMessage('');
      loadMessages(selectedChat.other_id);
      loadConversations(); // Update sidebar
    } catch (error) {
      setModalConfig({
        isOpen: true,
        title: 'Erro no Chat',
        message: 'Não foi possível enviar sua mensagem. Tente novamente.',
        type: 'error'
      });
    }
  };

  const [showArchived, setShowArchived] = useState(false);

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden mt-4">
      {/* SIDEBAR */}
      <div className={`w-full md:w-80 border-r border-gray-50 flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-8 border-b border-gray-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900 italic tracking-tighter uppercase">Mensagens</h2>
            <div className="flex gap-2">
              {archivedChats.length > 0 && (
                <button 
                  onClick={() => setShowArchived(!showArchived)}
                  className={`p-3 rounded-xl transition-all shadow-sm ${showArchived ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-slate-400'}`}
                  title={showArchived ? "Ver Ativas" : "Ver Arquivadas"}
                >
                  <History className="w-5 h-5" />
                </button>
              )}
              <button 
                onClick={() => setIsSearchModalOpen(true)}
                className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-900 outline-none focus:ring-2 ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isLoading ? (
             <div className="p-10 text-center space-y-4">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Buscando chats...</p>
             </div>
          ) : conversations.length > 0 ? (
            conversations
              .filter(chat => 
                archivedChats.includes(chat.other_id) === showArchived && 
                chat.other_name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(chat => (
              <div 
                key={chat.other_id}
                onClick={() => setSelectedChat(chat)}
                className={`p-6 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-all border-b border-gray-50 ${selectedChat?.other_id === chat.other_id ? 'bg-indigo-50/50 border-l-4 border-l-indigo-600' : ''}`}
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                    <img src={chat.other_avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest truncate italic">{chat.other_name}</h4>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                       {chat.last_date ? format(new Date(chat.last_date), 'HH:mm') : ''}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate font-medium">{chat.last_message}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center space-y-6">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                  <MessageCircle className="w-10 h-10 text-slate-200" />
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Nenhuma conversa encontrada</p>
               <button 
                 onClick={() => setIsSearchModalOpen(true)}
                 className="bg-brand-dark text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl"
               >
                 INICIAR CHAT
               </button>
            </div>
          )}
        </div>
      </div>

      {/* SEARCH MODAL */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">Buscar Usuários</h3>
              <button onClick={() => setIsSearchModalOpen(false)} className="p-2 text-slate-400 hover:text-gray-900 transition-all"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Nome ou Empresa..."
                  value={searchQuery}
                  onChange={e => handleSearchUsers(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-900 outline-none focus:ring-2 ring-brand-primary/20"
                />
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar px-1">
                {searchQuery.length > 0 && searchQuery.length < 2 && (
                  <div className="py-8 text-center animate-pulse">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Digite pelo menos 2 caracteres...</p>
                  </div>
                )}

                {searchResults.map(p => (
                  <div 
                    key={p.user_id}
                    onClick={() => startChatWithUser(p.user_id)}
                    className="p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-gray-100 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                       <img src={p.logo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${p.name}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest truncate">{p.name || p.business_name}</h4>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter truncate">{p.business_name || 'Usuário Verificado'}</p>
                    </div>
                    <Plus className="w-4 h-4 text-slate-300 group-hover:text-brand-primary transition-colors" />
                  </div>
                ))}
                
                {searchQuery.length >= 2 && searchResults.length === 0 && (
                  <div className="py-12 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <Search className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Nenhum usuário encontrado</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHAT WINDOW */}
      <div className={`flex-1 flex flex-col bg-slate-50/30 ${!selectedChat ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="p-6 bg-white border-b border-gray-50 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedChat(null)}
                  className="md:hidden p-2 text-slate-400"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border border-gray-100">
                  <img src={selectedChat.other_avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest italic">{selectedChat.other_name}</h3>
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> ONLINE AGORA
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 relative">
                <button 
                  onClick={() => setIsActionsOpen(!isActionsOpen)}
                  className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all group"
                >
                   <MoreVertical className="w-5 h-5" />
                </button>
                
                {isActionsOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <button 
                      onClick={() => toggleArchive(selectedChat.other_id)}
                      className="w-full px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                    >
                      Arquivar Conversa
                    </button>
                    <button 
                      onClick={() => deleteThread(selectedChat.other_id)}
                      className="w-full px-4 py-2 text-left text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      Excluir Conversa
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {messages.map((msg, i) => {
                const isMine = msg.sender_id === user?.id;
                return (
                  <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] space-y-2`}>
                      <div className={`p-5 rounded-[2rem] text-sm font-medium shadow-sm border ${
                        isMine 
                          ? 'bg-indigo-600 text-white rounded-tr-none border-indigo-500' 
                          : 'bg-white text-gray-700 rounded-tl-none border-gray-100'
                      }`}>
                        {msg.content.startsWith('[IMAGE]') ? (
                          <img 
                            src={msg.content.replace('[IMAGE]', '')} 
                            alt="Anexo" 
                            className="max-w-full rounded-2xl cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => window.open(msg.content.replace('[IMAGE]', ''), '_blank')}
                          />
                        ) : (
                          msg.content
                        )}
                      </div>
                      <div className={`flex items-center gap-2 px-2 ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                          {format(new Date(msg.created_at), 'HH:mm')}
                        </span>
                        {isMine && <Check className={`w-3 h-3 ${msg.is_read ? 'text-indigo-500' : 'text-slate-300'}`} />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-8 bg-white border-t border-gray-50">
              <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-slate-50 p-2 rounded-[2rem] border border-gray-100">
                <div className="flex items-center gap-1 px-4 relative">
                  <button 
                    type="button" 
                    onClick={() => setIsEmojiOpen(!isEmojiOpen)}
                    className="p-3 text-slate-400 hover:text-indigo-600 transition-all"
                  >
                    <Smile className="w-6 h-6" />
                  </button>
                  
                  {isEmojiOpen && (
                    <div className="absolute bottom-full left-0 mb-4 p-4 bg-white rounded-3xl shadow-2xl border border-gray-100 grid grid-cols-4 gap-2 z-50">
                      {commonEmojis.map(emoji => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => addEmoji(emoji)}
                          className="w-10 h-10 flex items-center justify-center text-xl hover:bg-slate-50 rounded-xl transition-all"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}

                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 text-slate-400 hover:text-indigo-600 transition-all"
                  >
                    <ImageIcon className="w-6 h-6" />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </div>
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="DIGITE SUA MENSAGEM..."
                  className="flex-1 bg-transparent border-none py-4 text-[10px] font-black uppercase tracking-widest text-gray-900 outline-none placeholder:text-slate-400"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-indigo-600 text-white p-4 rounded-[1.5rem] shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="text-center space-y-6 max-w-sm px-8">
            <div className="w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center mx-auto border-8 border-slate-50">
              <MessageCircle className="w-16 h-16 text-indigo-100" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 italic tracking-tighter uppercase leading-tight">Escolha uma conversa e <span className="text-indigo-600">vamos prosperar!</span></h3>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest leading-relaxed italic">
              Conecte-se diretamente com outros membros para fechar negócios, parcerias ou trocar ideias.
            </p>
          </div>
        )}
      </div>

      {!parentSetModalConfig && (
        <SimpleModal 
          isOpen={localModalConfig.isOpen}
          onClose={() => setLocalModalConfig((prev: any) => ({...prev, isOpen: false, onConfirm: undefined}))}
          title={localModalConfig.title}
          message={localModalConfig.message}
          type={localModalConfig.type}
          onConfirm={localModalConfig.onConfirm}
          confirmText={localModalConfig.confirmText}
        />
      )}
    </div>
  );
};

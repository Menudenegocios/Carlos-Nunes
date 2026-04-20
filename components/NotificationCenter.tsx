
import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, ExternalLink, MessageCircle, UserPlus, Zap } from 'lucide-react';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../contexts/AuthContext';
import { PlatformNotification } from '../types';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const NotificationCenter: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<PlatformNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadNotifications();
      
      // Set up real-time listener if possible, but for now just simple load
      const interval = setInterval(loadNotifications, 30000); // Check every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    const data = await supabaseService.getNotifications(user.id);
    setNotifications(data);
    setUnreadCount(data.filter(n => !n.is_read).length);
  };

  const markAsRead = async (id: string) => {
    await supabaseService.markNotificationAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    if (!user) return;
    await supabaseService.markAllNotificationsAsRead(user.id);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'mention': return <UserPlus className="w-4 h-4 text-indigo-500" />;
      case 'message': return <MessageCircle className="w-4 h-4 text-emerald-500" />;
      case 'meeting': return <Zap className="w-4 h-4 text-amber-500" />;
      case 'post': return <Bell className="w-4 h-4 text-blue-500" />;
      default: return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:scale-105 transition-all border border-brand-secondary/10"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-4 w-96 bg-white rounded-[2rem] shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest italic">Notificações</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{unreadCount} não lidas</p>
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  title="Marcar todas como lidas"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={`p-5 flex gap-4 hover:bg-slate-50 transition-all border-b border-gray-50 group ${!notification.is_read ? 'bg-indigo-50/30' : ''}`}
                    onClick={() => !notification.is_read && markAsRead(notification.id)}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                        <img 
                          src={notification.from_user_avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-white shadow-md flex items-center justify-center border border-gray-50">
                        {getIcon(notification.type)}
                      </div>
                    </div>

                    <div className="flex-1 space-y-1">
                      <p className="text-xs text-gray-900 leading-snug">
                        <span className="font-black italic uppercase tracking-tighter mr-1">{notification.from_user_name}</span>
                        <span className="font-medium text-slate-600">{notification.content}</span>
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: ptBR })}
                        </span>
                        
                        {notification.link && (
                          <Link 
                            to={notification.link}
                            onClick={() => setIsOpen(false)}
                            className="text-[9px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            VER <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        )}
                      </div>
                    </div>

                    {!notification.is_read && (
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2" />
                    )}
                  </div>
                ))
              ) : (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                    <Bell className="w-8 h-8 text-slate-200" />
                  </div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Tudo limpo por aqui!</p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 text-center">
              <button 
                 onClick={() => setIsOpen(false)}
                 className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors"
              >
                FECHAR PAINEL
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

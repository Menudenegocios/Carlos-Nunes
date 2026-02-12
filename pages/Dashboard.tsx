
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { Profile } from '../types';
import { 
  ShoppingBag, Trophy, Star, Eye, Plus, Zap,
  Package, Smartphone, ChevronRight, Share2, Ticket, 
  Bell, Sparkles, MessageCircle, ArrowRight, Briefcase
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const profile = await mockBackend.getProfile(user!.id);
      setUserProfile(profile || null);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  const stats = [
    { label: 'Visitas na Loja', value: '3.4k', trend: '+12%', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pedidos/Leads', value: '14', trend: 'Hoje', icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Avaliação', value: '4.9', trend: 'Excelente', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'Pontos Clube', value: user.points, trend: user.level.toUpperCase(), icon: Trophy, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-[fade-in_0.4s_ease-out]">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 leading-tight">
            Olá, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 font-medium">Gerencie seu negócio e acompanhe seu crescimento.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
           <Link to={`/store/${user.id}`} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold hover:bg-gray-100 transition-all shadow-sm">
             <Eye className="w-5 h-5" /> <span className="hidden sm:inline">Ver Loja</span>
           </Link>
           <Link to="/catalog" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-100 transition-all">
             <Plus className="w-5 h-5" /> Novo Produto
           </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-3xl border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300 group">
            <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${stat.bg} ${stat.color}`}>
               <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                <span className="text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-lg">{stat.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-6">
           
           <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                 <Zap className="w-5 h-5 text-indigo-600" /> Acesso Rápido
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <Link to="/business-suite" className="p-6 bg-blue-50 rounded-3xl group hover:bg-blue-100 transition-all">
                    <Briefcase className="w-8 h-8 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
                    <h4 className="font-bold text-blue-900">CRM & Gestão</h4>
                    <p className="text-xs text-blue-700 mt-1">Vendas, finanças e agenda em um só lugar.</p>
                 </Link>
                 <Link to="/catalog" className="p-6 bg-indigo-50 rounded-3xl group hover:bg-indigo-100 transition-all">
                    <Package className="w-8 h-8 text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
                    <h4 className="font-bold text-indigo-900">Gerenciar Catálogo</h4>
                    <p className="text-xs text-indigo-700 mt-1">Adicione produtos, mude preços e estoque.</p>
                 </Link>
                 <Link to="/bio-builder" className="p-6 bg-purple-50 rounded-3xl group hover:bg-purple-100 transition-all">
                    <Smartphone className="w-8 h-8 text-purple-600 mb-4 group-hover:scale-110 transition-transform" />
                    <h4 className="font-bold text-purple-900">Bio Digital</h4>
                    <p className="text-xs text-purple-700 mt-1">Customize seus links e QR Code de contato.</p>
                 </Link>
                 <Link to="/marketing-ai" className="p-6 bg-amber-50 rounded-3xl group hover:bg-amber-100 transition-all">
                    <Sparkles className="w-8 h-8 text-amber-600 mb-4 group-hover:scale-110 transition-transform" />
                    <h4 className="font-bold text-amber-900">Criativo MenuIA</h4>
                    <p className="text-xs text-amber-700 mt-1">Gere textos e artes para suas redes sociais.</p>
                 </Link>
              </div>
           </div>

           <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="max-w-md text-center md:text-left">
                    <h3 className="text-2xl font-black mb-2">Aumente sua Visibilidade</h3>
                    <p className="text-indigo-200 text-sm">Seus anúncios aparecem no marketplace local para centenas de potenciais clientes todos os dias.</p>
                 </div>
                 <Link to="/plans" className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-colors shadow-xl">
                    Ver Planos de Divulgação
                 </Link>
              </div>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
           </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-6">
           
           {/* Club Points Wallet */}
           <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-xl shadow-gray-100/50">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <Trophy className="w-5 h-5" />
                 </div>
                 <h4 className="font-black text-gray-900 tracking-tight">Clube de Vantagens</h4>
              </div>
              
              <div className="text-center mb-8">
                 <span className="text-5xl font-black text-gray-900 leading-none">{user.points}</span>
                 <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">Pontos Acumulados</p>
              </div>

              <div className="space-y-3">
                 <Link to="/rewards" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group">
                    <div className="flex items-center gap-3">
                       <Ticket className="w-5 h-5 text-indigo-600" />
                       <span className="text-sm font-bold text-gray-700 tracking-tight">Resgatar Prêmios</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-600 transition-colors" />
                 </Link>
                 <Link to="/rewards" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group">
                    <div className="flex items-center gap-3">
                       <Share2 className="w-5 h-5 text-indigo-600" />
                       <span className="text-sm font-bold text-gray-700 tracking-tight">Ganhar Pontos</span>
                    </div>
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg">+50 PTS</span>
                 </Link>
              </div>
           </div>

           {/* Notifications */}
           <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
              <h4 className="font-black text-gray-900 mb-4 flex items-center gap-2 tracking-tight text-sm">
                 <Bell className="w-5 h-5 text-gray-400" /> Atualizações
              </h4>
              <div className="space-y-4">
                 <div className="flex gap-3 items-start p-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0"></div>
                    <p className="text-xs text-gray-600 leading-relaxed">Você ganhou um selo de <span className="font-bold">Destaque Local</span>.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

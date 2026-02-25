
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { Profile, PlatformEvent, User as UserType } from '../types';
import { 
  Users, Calendar, Settings2, Plus, Edit2, Trash2, 
  Save, X, ShieldCheck, Eye, EyeOff, CheckCircle, 
  Search, User, ArrowRight, RefreshCw, Layout, Smartphone, 
  Package, BookOpen, Briefcase, GraduationCap, Trophy, CreditCard,
  UserCheck, AlertCircle, Mail, Lock, UserPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminCentral: React.FC = () => {
  const { user, impersonate } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'membros' | 'eventos' | 'paginas'>('membros');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [events, setEvents] = useState<PlatformEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Member Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [memberForm, setMemberForm] = useState({
    businessName: '',
    email: '',
    password: '',
    plan: 'profissionais' as any,
    points: 0
  });

  const planNames: Record<string, string> = {
    profissionais: 'Básico',
    freelancers: 'Premium',
    negocios: 'Pro'
  };

  const plansConfig = [
    { name: 'Plano Básico', color: 'border-slate-300', modules: [{ name: 'Visão Geral', icon: Layout }, { name: 'Bio Digital', icon: Smartphone }, { name: 'Menu Academy', icon: GraduationCap }, { name: 'Clube de Vantagens', icon: Trophy }, { name: 'Planos de Adesão', icon: CreditCard }] },
    { name: 'Plano Premium', color: 'border-brand-primary', modules: [{ name: 'Visão Geral', icon: Layout }, { name: 'Bio Digital', icon: Smartphone }, { name: 'Catálogo & Lojas', icon: Package }, { name: 'Blog & Artigos', icon: BookOpen }, { name: 'CRM & Vendas', icon: Briefcase }, { name: 'Menu Academy', icon: GraduationCap }, { name: 'Clube de Vantagens', icon: Trophy }, { name: 'Planos de Adesão', icon: CreditCard }] },
    { name: 'Plano Pro', color: 'border-emerald-500', modules: [{ name: 'Visão Geral', icon: Layout }, { name: 'Bio Digital', icon: Smartphone }, { name: 'Catálogo & Lojas', icon: Package }, { name: 'Blog & Artigos', icon: BookOpen }, { name: 'CRM & Vendas', icon: Briefcase }, { name: 'Menu Academy', icon: GraduationCap }, { name: 'Clube de Vantagens', icon: Trophy }, { name: 'Planos de Adesão', icon: CreditCard }] }
  ];

  useEffect(() => {
    if (user?.role === 'admin') loadAdminData();
  }, [user]);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const allProfiles = await mockBackend.getAllProfiles();
      setProfiles(allProfiles);
      setEvents([
        { id: 'e1', title: 'Workshop de Vendas local', date: '2024-10-25', location: 'Google Meet', description: 'Como vender mais no bairro.', type: 'Online' },
        { id: 'e2', title: 'Networking Curitiba', date: '2024-11-05', location: 'Av. Batel, 100', description: 'Encontro presencial.', type: 'Presencial' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingProfile(null);
    setMemberForm({
        businessName: '',
        email: '',
        password: '',
        plan: 'profissionais',
        points: 0
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (profile: Profile) => {
    setEditingProfile(profile);
    setMemberForm({
      businessName: profile.businessName || '',
      email: (profile as any).email || '',
      password: '', // Senha em branco para segurança no modo edit
      plan: (profile as any).plan || 'profissionais',
      points: (profile as any).points || 0
    });
    setIsModalOpen(true);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProfile) {
        await mockBackend.updateProfile(editingProfile.userId, {
          businessName: memberForm.businessName,
          plan: memberForm.plan,
          points: memberForm.points
        } as any);
        // Em um sistema real, aqui chamaria uma função de updateAuth no supabase
      } else {
        await mockBackend.createMember(
            { email: memberForm.email, plan: memberForm.plan, points: memberForm.points, password: memberForm.password } as any,
            { businessName: memberForm.businessName }
        );
      }
      setIsModalOpen(false);
      loadAdminData();
      alert(editingProfile ? 'Membro atualizado!' : 'Membro criado com sucesso!');
    } catch (e) { alert('Erro ao processar operação.'); }
  };

  const handleImpersonate = (profile: Profile) => {
    const targetUser: UserType = {
        id: profile.userId,
        name: profile.businessName || 'Membro',
        email: (profile as any).email || '',
        plan: (profile as any).plan || 'profissionais',
        points: (profile as any).points || 0,
        level: (profile as any).level || 'bronze',
        menuCash: (profile as any).menuCash || 0,
        referralCode: (profile as any).referralCode || '',
        referralsCount: (profile as any).referralsCount || 0,
        role: 'user'
    };
    impersonate(targetUser);
    navigate('/dashboard');
  };

  const deleteMember = (id: string) => {
    if (window.confirm('Excluir este membro permanentemente?')) {
      setProfiles(profiles.filter(p => p.id !== id));
    }
  };

  if (user?.role !== 'admin') return <div className="p-20 text-center font-black text-rose-600">ACESSO NEGADO.</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-fade-in">
      {/* Header Admin */}
      <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-brand-primary rounded-[1.8rem] flex items-center justify-center shadow-xl">
                    <ShieldCheck className="w-10 h-10 text-white" />
                </div>
                <div>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none mb-2">Central do <span className="text-brand-primary">Administrador</span></h1>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Gestão avançada de acessos e membros.</p>
                </div>
            </div>
            <div className="flex gap-4">
                <button onClick={handleOpenCreateModal} className="bg-brand-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 hover:scale-105 transition-all">
                    <UserPlus className="w-5 h-5" /> NOVO MEMBRO
                </button>
            </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[3rem] shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
         <div className="flex bg-gray-50 dark:bg-zinc-800/50 p-2 gap-2">
            {[{ id: 'membros', label: 'Gestão de Membros', icon: Users }, { id: 'eventos', label: 'Gestão de Eventos', icon: Calendar }, { id: 'paginas', label: 'Páginas & Planos', icon: Settings2 }].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.8rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white'}`}>
                    <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
            ))}
         </div>

         <div className="p-10 min-h-[500px]">
            {isLoading ? <div className="text-center py-20 animate-pulse text-slate-300"><RefreshCw className="w-12 h-12 animate-spin mb-4 mx-auto" /></div> : (
                <div className="animate-fade-in">
                    {activeTab === 'membros' && (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center px-4">
                                <h3 className="text-2xl font-black italic uppercase">Membros Registrados</h3>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input type="text" placeholder="Buscar..." className="pl-12 pr-6 py-3 bg-gray-50 dark:bg-zinc-800 rounded-xl border-none font-bold text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                </div>
                            </div>
                            
                            <div className="grid gap-4">
                                {profiles.filter(p => p.businessName?.toLowerCase().includes(searchTerm.toLowerCase())).map(profile => (
                                    <div key={profile.id} className="p-6 bg-gray-50/50 dark:bg-zinc-800/40 rounded-3xl border border-gray-100 dark:border-zinc-800 flex items-center justify-between group hover:bg-white transition-all shadow-sm">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                                                <img src={profile.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.businessName}`} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900 dark:text-white text-lg">{profile.businessName}</h4>
                                                <div className="flex items-center gap-3">
                                                  <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg uppercase">{planNames[(profile as any).plan || 'profissionais']}</span>
                                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{profile.city || 'Sem cidade'}</span>
                                                  {(profile as any).email && <span className="text-[10px] font-medium text-slate-400 italic">{(profile as any).email}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleImpersonate(profile)} title="Entrar na conta" className="p-3 bg-white dark:bg-zinc-900 rounded-xl text-emerald-500 hover:bg-emerald-50 transition-all shadow-sm border border-gray-100 dark:border-zinc-800"><UserCheck className="w-5 h-5" /></button>
                                            <button onClick={() => handleOpenEditModal(profile)} title="Editar dados/Login" className="p-3 bg-white dark:bg-zinc-900 rounded-xl text-indigo-400 hover:bg-indigo-50 transition-all shadow-sm border border-gray-100 dark:border-zinc-800"><Edit2 className="w-5 h-5" /></button>
                                            <button onClick={() => deleteMember(profile.id)} className="p-3 bg-white dark:bg-zinc-900 rounded-xl text-rose-400 hover:bg-rose-50 transition-all shadow-sm border border-gray-100 dark:border-zinc-800"><Trash2 className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Outras tabs mantidas */}
                </div>
            )}
         </div>
      </div>

      {/* MODAL CRIAR/EDITAR MEMBRO */}
      {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
             <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-white/5 animate-scale-in">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-black uppercase italic">{editingProfile ? 'Configurações do Membro' : 'Novo Cadastro Manual'}</h3>
                        <p className="text-[10px] font-black text-brand-primary tracking-widest uppercase mt-1">Defina credenciais e nível de acesso</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                <form onSubmit={handleSaveMember} className="p-10 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Nome do Negócio / Usuário</label>
                            <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={memberForm.businessName} onChange={e => setMemberForm({...memberForm, businessName: e.target.value})} />
                        </div>
                        
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Mail className="w-3 h-3" /> E-mail (Login)</label>
                            <input required type="email" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={memberForm.email} onChange={e => setMemberForm({...memberForm, email: e.target.value})} placeholder="exemplo@login.com" />
                        </div>
                        
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Lock className="w-3 h-3" /> Senha</label>
                            <input required={!editingProfile} type="password" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={memberForm.password} onChange={e => setMemberForm({...memberForm, password: e.target.value})} placeholder={editingProfile ? "•••••••• (deixe em branco para manter)" : "Senha inicial"} />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Plano Ativo</label>
                            <select className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={memberForm.plan} onChange={e => setMemberForm({...memberForm, plan: e.target.value as any})}>
                                <option value="profissionais">Plano Básico (Gratuito)</option>
                                <option value="freelancers">Plano PRO</option>
                                <option value="negocios">Plano Business</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Saldo de Pontos</label>
                            <input type="number" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={memberForm.points} onChange={e => setMemberForm({...memberForm, points: Number(e.target.value)})} />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-brand-primary text-white font-black py-5 rounded-[2rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-orange-600 transition-all flex items-center justify-center gap-3">
                        {editingProfile ? <><Save className="w-5 h-5" /> SALVAR ALTERAÇÕES</> : <><UserPlus className="w-5 h-5" /> CRIAR MEMBRO AGORA</>}
                    </button>
                </form>
             </div>
          </div>
      )}
    </div>
  );
};

const MapPin = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

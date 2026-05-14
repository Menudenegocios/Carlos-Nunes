import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';
import { supabaseService } from '../services/supabaseService';
import { Profile, User as UserType } from '../types';
import { 
  Users, Calendar, Settings2, Plus, Edit2, Trash2, 
  Save, X, ShieldCheck, Eye, EyeOff, CheckCircle, 
  Search, User, ArrowRight, RefreshCw, Layout, Smartphone, 
  Package, BookOpen, Briefcase, GraduationCap, Trophy, CreditCard,
  UserCheck, AlertCircle, Mail, Lock, UserPlus, ShoppingBag, Phone, Sparkles,
  DollarSign, TrendingUp, Filter, Download
} from 'lucide-react';
import { PhoneInput } from '../components/PhoneInput';
import { useNavigate, useLocation } from 'react-router-dom';
import { ConfirmModal } from '../components/ConfirmModal';

export const AdminCentral: React.FC = () => {
  const { user, impersonateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'membros' | 'agenda' | 'parceiros' | 'financeiro'>('membros');

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any | null>(null);

  const [memberForm, setMemberForm] = useState({
    business_name: '', email: '', password: '', plan: 'pre-cadastro' as any,
    level: 'Nível Base' as any, points: 0, menu_cash: 0, role: 'user' as any,
    has_founder_badge: false, has_local_plus: false, display_id: undefined as number | undefined,
    cpf_cnpj: '', phone: ''
  });

  const [eventForm, setEventForm] = useState({
    title: '', date: '', location: '', description: '', type: 'Online' as 'Online' | 'Presencial',
    image: '', external_link: ''
  });

  const [partnerForm, setPartnerForm] = useState({
    title: '', subtitle: '', logo_url: '', whatsapp: '', link: ''
  });

  const [modalConfig, setModalConfig] = useState({
    isOpen: false, title: '', message: '', type: 'info' as 'info' | 'danger' | 'success' | 'warning',
    onConfirm: undefined as (() => void) | undefined
  });

  const showAlert = (title: string, message: string, type: any = 'info', onConfirm?: () => void) => {
    setModalConfig({ isOpen: true, title, message, type, onConfirm });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['membros', 'agenda', 'parceiros', 'financeiro'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [location.search]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'membros') {
        const data = await supabaseService.getAllProfiles();
        setProfiles(data || []);
      } else if (activeTab === 'agenda') {
        // Tabela corrigida de platform_events para events
        const { data } = await supabase.from('events').select('*').order('date', { ascending: true });
        setEvents(data || []);
      } else if (activeTab === 'parceiros') {
        const { data } = await supabase.from('partners').select('*').order('created_at', { ascending: false });
        setPartners(data || []);
      } else if (activeTab === 'financeiro') {
        // Financeiro com JOIN para trazer nome e plano
        const { data } = await supabase
          .from('payments')
          .select('*, profiles!user_id(business_name, membership_plan, plan)')
          .order('created_at', { ascending: false });
        setPayments(data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenMemberModal = (profile: Profile | null = null) => {
    if (profile) {
      setEditingProfile(profile);
      setMemberForm({
        business_name: profile.business_name || '', email: profile.email || '',
        password: '', plan: (profile.membership_plan || profile.plan || 'pre-cadastro') as any,
        level: (profile.level || 'Nível Base') as any, points: profile.points || 0,
        menu_cash: profile.menu_cash || 0, role: profile.role || 'user',
        has_founder_badge: !!profile.has_founder_badge, has_local_plus: !!profile.has_local_plus,
        display_id: profile.display_id, cpf_cnpj: profile.cpf_cnpj || '', phone: profile.phone || ''
      });
    } else {
      setEditingProfile(null);
      setMemberForm({
        business_name: '', email: '', password: '', plan: 'pre-cadastro',
        level: 'Nível Base', points: 0, menu_cash: 0, role: 'user',
        has_founder_badge: false, has_local_plus: false, display_id: undefined,
        cpf_cnpj: '', phone: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const profileData = {
        business_name: memberForm.business_name,
        plan: memberForm.plan,
        membership_plan: memberForm.plan,
        level: memberForm.level,
        points: memberForm.points,
        menu_cash: memberForm.menu_cash,
        role: memberForm.role,
        has_founder_badge: memberForm.has_founder_badge,
        has_local_plus: memberForm.has_local_plus,
        display_id: memberForm.display_id,
        cpf_cnpj: memberForm.cpf_cnpj,
        phone: memberForm.phone
      };
      if (editingProfile) await supabase.from('profiles').update(profileData).eq('user_id', editingProfile.user_id);
      else await supabase.from('profiles').insert([{ ...profileData, email: memberForm.email }]);
      setIsModalOpen(false);
      fetchData();
      showAlert("Sucesso", "Membro salvo!", "success");
    } catch (err: any) { showAlert("Erro", err.message, "danger"); }
    finally { setLoading(false); }
  };

  const handleOpenEventModal = (event: any | null = null) => {
    if (event) {
      setEditingEvent(event);
      setEventForm({
        title: event.title, date: event.date, location: event.location,
        description: event.description || '', type: event.type,
        image: event.image || '', external_link: event.external_link || ''
      });
    } else {
      setEditingEvent(null);
      setEventForm({ title: '', date: '', location: '', description: '', type: 'Online', image: '', external_link: '' });
    }
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEvent) await supabase.from('events').update(eventForm).eq('id', editingEvent.id);
      else await supabase.from('events').insert([eventForm]);
      setIsEventModalOpen(false);
      fetchData();
      showAlert("Sucesso", "Evento salvo!", "success");
    } catch (err: any) { showAlert("Erro", err.message, "danger"); }
  };

  const handleOpenPartnerModal = (partner: any | null = null) => {
    if (partner) {
      setEditingPartner(partner);
      setPartnerForm({
        title: partner.title, subtitle: partner.subtitle, logo_url: partner.logo_url,
        whatsapp: partner.whatsapp || '', link: partner.link || ''
      });
    } else {
      setEditingPartner(null);
      setPartnerForm({ title: '', subtitle: '', logo_url: '', whatsapp: '', link: '' });
    }
    setIsPartnerModalOpen(true);
  };

  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingPartner) await supabase.from('partners').update(partnerForm).eq('id', editingPartner.id);
      else await supabase.from('partners').insert([partnerForm]);
      setIsPartnerModalOpen(false);
      fetchData();
      showAlert("Sucesso", "Parceiro salvo!", "success");
    } catch (err: any) { showAlert("Erro", err.message, "danger"); }
    finally { setLoading(false); }
  };

  const handleDeleteMember = async (userId: string) => {
    showAlert(
      "Confirmar Exclusão", 
      "Tem certeza que deseja remover este membro? Esta ação é irreversível.", 
      "warning",
      async () => {
        try {
          await supabase.from('profiles').delete().eq('user_id', userId);
          fetchData();
          showAlert("Sucesso", "Membro removido!", "success");
        } catch (err: any) { showAlert("Erro", err.message, "danger"); }
      }
    );
  };

  const handleDeletePartner = async (partnerId: string) => {
    showAlert(
      "Confirmar Exclusão", 
      "Deseja remover este parceiro?", 
      "warning",
      async () => {
        try {
          await supabase.from('partners').delete().eq('id', partnerId);
          fetchData();
          showAlert("Sucesso", "Parceiro removido!", "success");
        } catch (err: any) { showAlert("Erro", err.message, "danger"); }
      }
    );
  };

  const planNames: Record<string, string> = {
    'pre-cadastro': 'Pré-Cadastro', 'start': 'START', 'pro': 'PRO', 'full': 'FULL'
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
         <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                  <ShieldCheck className="w-6 h-6 text-white" />
               </div>
               <div>
                  <h1 className="text-xl font-black uppercase italic tracking-tighter text-slate-900">Admin Central</h1>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vencer Hub Management</p>
               </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all text-slate-600 font-bold text-sm">
                 <Layout className="w-4 h-4" /> Dashboard
              </button>
            </div>
         </div>
         
         <div className="max-w-7xl mx-auto px-6 border-t border-slate-100">
            <nav className="flex gap-1 py-3 overflow-x-auto no-scrollbar">
               {[
                  { id: 'membros', label: 'Membros', icon: Users },
                  { id: 'agenda', label: 'Agenda', icon: Calendar },
                  { id: 'parceiros', label: 'Parceiros', icon: Briefcase },
                  { id: 'financeiro', label: 'Financeiro', icon: CreditCard },
               ].map(tab => (
                  <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id as any)}
                     className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
                        activeTab === tab.id 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105' 
                        : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                     }`}
                  >
                     <tab.icon className="w-4 h-4" /> {tab.label}
                  </button>
               ))}
            </nav>
         </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-1">
         {isLoading ? (
            <div className="h-96 flex items-center justify-center">
               <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin" />
            </div>
         ) : (
            <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder={`Buscar em ${activeTab}...`}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-sm"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {activeTab !== 'financeiro' && activeTab !== 'membros' && (
                      <button 
                        onClick={() => {
                          if (activeTab === 'agenda') handleOpenEventModal();
                          if (activeTab === 'parceiros') handleOpenPartnerModal();
                        }}
                        className="px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-3 uppercase tracking-widest text-[10px] whitespace-nowrap"
                      >
                          <Plus className="w-5 h-5" /> Adicionar {activeTab.slice(0, -1)}
                      </button>
                    )}
                </div>

                {activeTab === 'membros' && (
                  <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                      <table className="w-full text-left">
                          <thead>
                              <tr className="bg-slate-50 border-b border-slate-200">
                                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Membro</th>
                                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plano / Status</th>
                                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Pontos / M$</th>
                                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                              {profiles.filter(p => p.business_name?.toLowerCase().includes(searchTerm.toLowerCase())).map(profile => (
                                  <tr key={profile.user_id} className="hover:bg-slate-50/50 transition-colors group">
                                      <td className="px-6 py-4">
                                          <div className="flex items-center gap-4">
                                              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-xs overflow-hidden">
                                                  {profile.logo_url ? (
                                                    <img src={profile.logo_url} alt={profile.business_name} className="w-full h-full object-cover" />
                                                  ) : (
                                                    profile.business_name?.[0] || <User className="w-4 h-4" />
                                                  )}
                                              </div>
                                              <div>
                                                  <p className="font-black text-slate-900 leading-none">{profile.business_name || 'Sem Nome'}</p>
                                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{profile.email}</p>
                                              </div>
                                          </div>
                                      </td>
                                      <td className="px-6 py-4">
                                          <div className="flex items-center gap-2">
                                              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                                                  {planNames[profile.membership_plan || profile.plan || 'pre-cadastro']}
                                              </span>
                                              {profile.membership_status === 'active' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                                          </div>
                                      </td>
                                      <td className="px-6 py-4">
                                          <div className="flex flex-col">
                                            <span className="text-xs font-black text-slate-700">{profile.points || 0} pts</span>
                                            <span className="text-[9px] font-bold text-brand-primary uppercase">M$ {profile.menu_cash || 0}</span>
                                          </div>
                                      </td>
                                      <td className="px-6 py-4 text-right">
                                          <div className="flex items-center justify-end gap-2">
                                              <button onClick={() => impersonateUser(profile.user_id)} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-all shadow-sm" title="Acessar Perfil">
                                                  <Smartphone className="w-4 h-4" />
                                              </button>
                                              <button onClick={() => handleOpenMemberModal(profile)} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-emerald-600 transition-all shadow-sm">
                                                  <Edit2 className="w-4 h-4" />
                                              </button>
                                              <button onClick={() => handleDeleteMember(profile.user_id)} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-rose-600 transition-all shadow-sm">
                                                  <Trash2 className="w-4 h-4" />
                                              </button>
                                          </div>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
                )}

                {/* TAB AGENDA - Corrigida para tabela 'events' */}
                {activeTab === 'agenda' && (
                  <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                      <table className="w-full text-left">
                          <thead>
                              <tr className="bg-slate-50 border-b border-slate-200">
                                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Evento</th>
                                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data / Local</th>
                                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</th>
                                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                              {events.map(event => (
                                  <tr key={event.id} className="hover:bg-slate-50/50 transition-colors">
                                      <td className="px-6 py-4">
                                          <div className="flex items-center gap-4">
                                              <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center">
                                                  {event.image ? <img src={event.image} className="w-full h-full object-cover" /> : <Calendar className="w-5 h-5 text-slate-300" />}
                                              </div>
                                              <p className="font-black text-slate-900 uppercase italic text-xs">{event.title}</p>
                                          </div>
                                      </td>
                                      <td className="px-6 py-4">
                                          <div className="flex flex-col">
                                            <span className="text-xs font-black text-slate-700">{new Date(event.date).toLocaleDateString('pt-BR')}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">{event.location}</span>
                                          </div>
                                      </td>
                                      <td className="px-6 py-4">
                                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${event.type === 'Presencial' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                                              {event.type}
                                          </span>
                                      </td>
                                      <td className="px-6 py-4 text-right">
                                          <div className="flex items-center justify-end gap-2">
                                              <button onClick={() => handleOpenEventModal(event)} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-emerald-600 transition-all shadow-sm">
                                                  <Edit2 className="w-4 h-4" />
                                              </button>
                                              <button onClick={async () => {
                                                if(confirm('Deseja excluir este evento?')) {
                                                  await supabase.from('events').delete().eq('id', event.id);
                                                  fetchData();
                                                }
                                              }} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-rose-600 transition-all shadow-sm">
                                                  <Trash2 className="w-4 h-4" />
                                              </button>
                                          </div>
                                      </td>
                                  </tr>
                              ))}
                              {events.length === 0 && (
                                  <tr>
                                      <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold text-sm italic">Nenhum evento encontrado na agenda.</td>
                                  </tr>
                              )}
                          </tbody>
                      </table>
                  </div>
                )}

                {/* TAB FINANCEIRO - Atualizada com nome e plano */}
                {activeTab === 'financeiro' && (
                  <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-all"></div>
                              <div className="relative">
                                  <DollarSign className="w-5 h-5 text-emerald-500 mb-2" />
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vendas Totais</p>
                                  <h3 className="text-xl font-black text-slate-900 italic">R$ {payments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0).toLocaleString()}</h3>
                              </div>
                          </div>
                          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-all"></div>
                              <div className="relative">
                                  <TrendingUp className="w-5 h-5 text-indigo-500 mb-2" />
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nº Transações</p>
                                  <h3 className="text-xl font-black text-slate-900 italic">{payments.length}</h3>
                              </div>
                          </div>
                      </div>

                      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                          <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-indigo-600" /> Histórico de Recebimentos
                              </h3>
                              <button onClick={fetchData} className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm">
                                <RefreshCw className="w-4 h-4" />
                              </button>
                          </div>
                          <table className="w-full text-left">
                              <thead>
                                  <tr className="bg-slate-50 border-b border-slate-200">
                                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Usuário / Plano</th>
                                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Forma</th>
                                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor</th>
                                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Confirmado em</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                  {payments.map(payment => (
                                      <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                                          <td className="px-8 py-4">
                                              <p className="text-xs font-black text-slate-900 uppercase italic">{(payment as any).profiles?.business_name || 'Usuário Desconhecido'}</p>
                                              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[8px] font-black uppercase tracking-widest border border-indigo-100">
                                                  {planNames[(payment as any).profiles?.membership_plan || (payment as any).profiles?.plan || 'pre-cadastro']}
                                              </span>
                                          </td>
                                          <td className="px-8 py-4">
                                              <span className="text-[10px] font-bold text-slate-500 uppercase">{payment.billing_type}</span>
                                          </td>
                                          <td className="px-8 py-4">
                                              <p className="font-black text-slate-900">R$ {Number(payment.amount).toFixed(2)}</p>
                                          </td>
                                          <td className="px-8 py-4">
                                              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                                  ['CONFIRMED', 'RECEIVED', 'RECEIVED_IN_CASH'].includes(payment.status)
                                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                  : 'bg-orange-50 text-orange-600 border-orange-100'
                                              }`}>
                                                  {payment.status}
                                              </span>
                                          </td>
                                          <td className="px-8 py-4 text-right">
                                              <span className="text-[10px] font-bold text-slate-400">
                                                {payment.paid_at ? new Date(payment.paid_at).toLocaleString('pt-BR') : 'Pendente'}
                                              </span>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
                )}

                {/* TAB PARCEIROS */}
                {activeTab === 'parceiros' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {partners.map(partner => (
                          <div key={partner.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 relative group overflow-hidden shadow-sm">
                              <div className="flex items-center gap-4 mb-6">
                                  <div className="w-16 h-16 bg-slate-100 rounded-3xl overflow-hidden flex items-center justify-center border border-slate-200">
                                      {partner.logo_url ? <img src={partner.logo_url} className="w-full h-full object-cover" /> : <Briefcase className="w-6 h-6 text-slate-300" />}
                                  </div>
                                  <div>
                                      <h4 className="font-black text-slate-900 leading-tight uppercase italic">{partner.title}</h4>
                                      <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">{partner.subtitle}</p>
                                  </div>
                              </div>
                              <div className="flex gap-2">
                                  <button onClick={() => handleOpenPartnerModal(partner)} className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-500 transition-all">Editar</button>
                                  <button onClick={() => handleDeletePartner(partner.id)} className="p-3 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                              </div>
                          </div>
                      ))}
                  </div>
                )}
            </div>
         )}
      </main>

      {/* MODAL CRIAR/EDITAR MEMBRO */}
      {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
             <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] shadow-2xl overflow-hidden animate-scale-in flex flex-col">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-black uppercase italic">{editingProfile ? 'Editar Membro' : 'Novo Membro'}</h3>
                        <p className="text-[10px] font-black text-indigo-400 tracking-widest uppercase mt-1">Configurações de Perfil</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSaveMember} className="p-10 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome do Negócio</label>
                            <input required type="text" className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold text-sm" value={memberForm.business_name} onChange={e => setMemberForm({...memberForm, business_name: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E-mail</label>
                            <input required type="email" disabled={!!editingProfile} className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold text-sm opacity-60" value={memberForm.email} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plano</label>
                            <select className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold text-sm" value={memberForm.plan} onChange={e => setMemberForm({...memberForm, plan: e.target.value as any})}>
                                <option value="pre-cadastro">Pré-Cadastro</option>
                                <option value="start">START</option>
                                <option value="pro">PRO</option>
                                <option value="full">FULL</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nível</label>
                            <select className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold text-sm" value={memberForm.level} onChange={e => setMemberForm({...memberForm, level: e.target.value as any})}>
                                <option value="Nível Base">Nível Base</option>
                                <option value="bronze">Bronze</option>
                                <option value="prata">Prata</option>
                                <option value="ouro">Ouro</option>
                                <option value="diamante">Diamante</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl uppercase tracking-widest text-[11px] hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                        {loading ? 'SALVANDO...' : <><Save className="w-5 h-5" /> SALVAR DADOS</>}
                    </button>
                </form>
             </div>
          </div>
      )}

      {/* MODAL AGENDA */}
      {isEventModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
             <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-scale-in flex flex-col">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-black uppercase italic">{editingEvent ? 'Editar Evento' : 'Novo Evento'}</h3>
                        <p className="text-[10px] font-black text-indigo-400 tracking-widest uppercase mt-1">Gestão de Agenda</p>
                    </div>
                    <button onClick={() => setIsEventModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSaveEvent} className="p-10 space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Título do Evento</label>
                        <input required type="text" className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold text-sm" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data e Hora</label>
                        <input required type="datetime-local" className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold text-sm" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Local / Plataforma</label>
                        <input required type="text" className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold text-sm" value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} />
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl uppercase tracking-widest text-[11px] hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                        <Save className="w-5 h-5" /> SALVAR EVENTO
                    </button>
                </form>
             </div>
          </div>
      )}

      {/* MODAL PARCEIROS */}
      {isPartnerModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
             <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-scale-in flex flex-col">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-black uppercase italic">{editingPartner ? 'Editar Parceiro' : 'Novo Parceiro'}</h3>
                        <p className="text-[10px] font-black text-indigo-400 tracking-widest uppercase mt-1">Gestão de Parceiros</p>
                    </div>
                    <button onClick={() => setIsPartnerModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSavePartner} className="p-10 space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Título do Parceiro</label>
                        <input required type="text" className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold text-sm" value={partnerForm.title} onChange={e => setPartnerForm({...partnerForm, title: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subtítulo / Descrição</label>
                        <input required type="text" className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold text-sm" value={partnerForm.subtitle} onChange={e => setPartnerForm({...partnerForm, subtitle: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">URL do Logo</label>
                        <input type="text" className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold text-sm" value={partnerForm.logo_url} onChange={e => setPartnerForm({...partnerForm, logo_url: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp (Ex: 5511999999999)</label>
                        <input type="text" className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold text-sm" value={partnerForm.whatsapp} onChange={e => setPartnerForm({...partnerForm, whatsapp: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Link Externo</label>
                        <input type="text" className="w-full bg-slate-50 border-none rounded-xl p-4 font-bold text-sm" value={partnerForm.link} onChange={e => setPartnerForm({...partnerForm, link: e.target.value})} />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl uppercase tracking-widest text-[11px] hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                        {loading ? 'SALVANDO...' : <><Save className="w-5 h-5" /> SALVAR PARCEIRO</>}
                    </button>
                </form>
             </div>
          </div>
      )}

      <ConfirmModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        confirmText={modalConfig.onConfirm ? "Sim, Continuar" : "Entendi"}
      />
    </div>
  );
};

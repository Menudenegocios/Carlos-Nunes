import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';
import { supabaseService } from '../services/supabaseService';
import { Profile, PlatformEvent, User as UserType } from '../types';
import { 
  Users, Calendar, Settings2, Plus, Edit2, Trash2, 
  Save, X, ShieldCheck, Eye, EyeOff, CheckCircle, 
  Search, User, ArrowRight, RefreshCw, Layout, Smartphone, 
  Package, BookOpen, Briefcase, GraduationCap, Trophy, CreditCard,
  UserCheck, AlertCircle, Mail, Lock, UserPlus, ShoppingBag, Phone, Sparkles
} from 'lucide-react';
import { PhoneInput } from '../components/PhoneInput';
import { useNavigate, useLocation } from 'react-router-dom';
import { ConfirmModal } from '../components/ConfirmModal';

export const AdminCentral: React.FC = () => {
  const { user, impersonateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'membros' | 'agenda' | 'marketplace' | 'parceiros' | 'localplus' | 'financeiro'>('membros');

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [events, setEvents] = useState<PlatformEvent[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Member Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [memberForm, setMemberForm] = useState({
    business_name: '',
    email: '',
    password: '',
    plan: 'pre-cadastro' as any,
    level: 'Nível Base' as any,
    points: 0,
    menu_cash: 0,
    role: 'user' as any,
    has_founder_badge: false,
    has_local_plus: false,
    display_id: undefined as number | undefined,
    cpf_cnpj: '',
    phone: ''
  });

  // Modal Global State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'info' | 'danger' | 'success' | 'warning',
    onConfirm: undefined as (() => void) | undefined
  });

  const showAlert = (title: string, message: string, type: any = 'info', onConfirm?: () => void) => {
    setModalConfig({ isOpen: true, title, message, type, onConfirm });
  };

  // Event Modal State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<PlatformEvent | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    type: 'Online' as 'Online' | 'Presencial',
    image: '',
    external_link: ''
  });
  const [selectedEventFile, setSelectedEventFile] = useState<File | null>(null);

  // Marketplace Modal State
  const [isMarketplaceModalOpen, setIsMarketplaceModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    type: 'product' as 'product' | 'offer',
    image_url: '',
    store_name: '',
    discount_display: '',
    store_logo_url: ''
  });
  const [selectedItemFile, setSelectedItemFile] = useState<File | null>(null);

  // Partner Modal State
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any | null>(null);
  const [partnerForm, setPartnerForm] = useState({
    title: '',
    subtitle: '',
    logo_url: '',
    whatsapp: '',
    link: ''
  });
  const [selectedPartnerFile, setSelectedPartnerFile] = useState<File | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['membros', 'agenda', 'marketplace', 'parceiros', 'localplus', 'financeiro'].includes(tab)) {
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
        const { data } = await supabase.from('platform_events').select('*').order('date', { ascending: true });
        setEvents(data || []);
      } else if (activeTab === 'marketplace') {
        const { data: p } = await supabase.from('marketplace_items').select('*').eq('type', 'product');
        const { data: o } = await supabase.from('marketplace_items').select('*').eq('type', 'offer');
        setProducts(p || []);
        setOffers(o || []);
      } else if (activeTab === 'parceiros') {
        const { data } = await supabase.from('partners').select('*').order('created_at', { ascending: false });
        setPartners(data || []);
      } else if (activeTab === 'financeiro') {
        const data = await supabaseService.getAllPayments();
        setPayments(data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingProfile(null);
    setMemberForm({
      business_name: '',
      email: '',
      password: '',
      plan: 'pre-cadastro',
      level: 'Nível Base',
      points: 0,
      menu_cash: 0,
      role: 'user',
      has_founder_badge: false,
      has_local_plus: false,
      display_id: undefined,
      cpf_cnpj: '',
      phone: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (profile: Profile) => {
    setEditingProfile(profile);
    setMemberForm({
      business_name: profile.business_name || '',
      email: profile.email || '',
      password: '',
      plan: (profile.membership_plan || profile.plan || 'pre-cadastro') as any,
      level: (profile.level || 'Nível Base') as any,
      points: profile.points || 0,
      menu_cash: profile.menu_cash || 0,
      role: profile.role || 'user',
      has_founder_badge: !!profile.has_founder_badge,
      has_local_plus: !!profile.has_local_plus,
      display_id: profile.display_id,
      cpf_cnpj: profile.cpf_cnpj || '',
      phone: profile.phone || ''
    });
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

      if (editingProfile) {
        const { error } = await supabase.from('profiles').update(profileData).eq('user_id', editingProfile.user_id);
        if (error) throw error;
        showAlert("Sucesso", "Membro atualizado com sucesso!", "success");
      } else {
        const { error } = await supabase.from('profiles').insert([{ ...profileData, email: memberForm.email }]);
        if (error) throw error;
        showAlert("Sucesso", "Membro criado com sucesso!", "success");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      showAlert("Erro", err.message || "Erro ao salvar membro", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    showAlert(
      "Confirmar Exclusão", 
      "Tem certeza que deseja excluir este membro? Esta ação removerá todos os dados permanentemente.", 
      "danger", 
      async () => {
        try {
          const { error } = await supabase.from('profiles').delete().eq('user_id', id);
          if (error) throw error;
          fetchData();
          showAlert("Sucesso", "Membro removido com sucesso.", "success");
        } catch (err: any) {
          showAlert("Erro", "Não foi possível excluir o membro.", "danger");
        }
      }
    );
  };

  const handleOpenEventModal = (event: PlatformEvent | null = null) => {
    if (event) {
      setEditingEvent(event);
      setEventForm({
        title: event.title,
        date: event.date,
        location: event.location,
        description: event.description || '',
        type: event.type,
        image: event.image || '',
        external_link: event.external_link || ''
      });
    } else {
      setEditingEvent(null);
      setEventForm({
        title: '',
        date: '',
        location: '',
        description: '',
        type: 'Online',
        image: '',
        external_link: ''
      });
    }
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent, file?: File) => {
    e.preventDefault();
    try {
      let image_url = eventForm.image;
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('events').upload(fileName, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('events').getPublicUrl(fileName);
        image_url = publicUrl;
      }

      const eventData = { ...eventForm, image: image_url };
      if (editingEvent) {
        await supabase.from('platform_events').update(eventData).eq('id', editingEvent.id);
      } else {
        await supabase.from('platform_events').insert([eventData]);
      }
      setIsEventModalOpen(false);
      fetchData();
      showAlert("Sucesso", "Evento salvo com sucesso!", "success");
    } catch (err: any) { showAlert("Erro", err.message, "danger"); }
  };

  const handleDeleteEvent = async (id: string) => {
    showAlert("Excluir Evento", "Tem certeza que deseja excluir este evento?", "danger", async () => {
      await supabase.from('platform_events').delete().eq('id', id);
      fetchData();
    });
  };

  const handleOpenPartnerModal = (partner: any | null = null) => {
    if (partner) {
      setEditingPartner(partner);
      setPartnerForm({
        title: partner.title,
        subtitle: partner.subtitle,
        logo_url: partner.logo_url,
        whatsapp: partner.whatsapp || '',
        link: partner.link || ''
      });
    } else {
      setEditingPartner(null);
      setPartnerForm({ title: '', subtitle: '', logo_url: '', whatsapp: '', link: '' });
    }
    setIsPartnerModalOpen(true);
  };

  const handleSavePartner = async (e: React.FormEvent, file?: File) => {
    e.preventDefault();
    try {
      let logo_url = partnerForm.logo_url;
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        await supabase.storage.from('partners').upload(fileName, file);
        const { data: { publicUrl } } = supabase.storage.from('partners').getPublicUrl(fileName);
        logo_url = publicUrl;
      }
      const partnerData = { ...partnerForm, logo_url };
      if (editingPartner) {
        await supabase.from('partners').update(partnerData).eq('id', editingPartner.id);
      } else {
        await supabase.from('partners').insert([partnerData]);
      }
      setIsPartnerModalOpen(false);
      fetchData();
      showAlert("Sucesso", "Parceiro salvo com sucesso!", "success");
    } catch (err: any) { showAlert("Erro", err.message, "danger"); }
  };

  const handleDeletePartner = async (id: string) => {
    showAlert("Excluir Parceiro", "Deseja remover este parceiro da lista?", "danger", async () => {
      await supabase.from('partners').delete().eq('id', id);
      fetchData();
    });
  };

  const handleOpenMarketplaceModal = (item: any | null = null) => {
    if (item) {
      setEditingItem(item);
      setItemForm({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        type: item.type,
        image_url: item.image_url,
        store_name: item.store_name || '',
        discount_display: item.discount_display || '',
        store_logo_url: item.store_logo_url || ''
      });
    } else {
      setEditingItem(null);
      setItemForm({
        name: '', description: '', price: 0, category: '', 
        type: 'product', image_url: '', store_name: '', 
        discount_display: '', store_logo_url: ''
      });
    }
    setIsMarketplaceModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent, file?: File) => {
    e.preventDefault();
    try {
      let image_url = itemForm.image_url;
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        await supabase.storage.from('marketplace').upload(fileName, file);
        const { data: { publicUrl } } = supabase.storage.from('marketplace').getPublicUrl(fileName);
        image_url = publicUrl;
      }
      const itemData = { ...itemForm, image_url };
      if (editingItem) {
        await supabase.from('marketplace_items').update(itemData).eq('id', editingItem.id);
      } else {
        await supabase.from('marketplace_items').insert([itemData]);
      }
      setIsMarketplaceModalOpen(false);
      fetchData();
      showAlert("Sucesso", "Item salvo com sucesso!", "success");
    } catch (err: any) { showAlert("Erro", err.message, "danger"); }
  };

  const handleDeleteItem = async (id: string) => {
    showAlert("Excluir Item", "Deseja remover este item do marketplace?", "danger", async () => {
      await supabase.from('marketplace_items').delete().eq('id', id);
      fetchData();
    });
  };

  const planNames: Record<string, string> = {
    'pre-cadastro': 'Pré-Cadastro',
    'start': 'START',
    'pro': 'PRO',
    'full': 'FULL'
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
           <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                    <ShieldCheck className="w-6 h-6 text-white" />
                 </div>
                 <div>
                    <h1 className="text-xl font-black uppercase italic tracking-tighter text-slate-900">Admin Central</h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Painel de Controle e Gestão</p>
                 </div>
              </div>
              <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all text-slate-600 font-bold text-sm">
                 <Layout className="w-4 h-4" /> Ver Dashboard
              </button>
           </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-10 w-full flex-1">
           <div className="flex flex-col md:flex-row gap-8">
              <aside className="w-full md:w-64 space-y-2">
                 {[
                    { id: 'membros', label: 'Membros', icon: Users },
                    { id: 'agenda', label: 'Agenda', icon: Calendar },
                    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
                    { id: 'parceiros', label: 'Parceiros', icon: Briefcase },
                    { id: 'financeiro', label: 'Financeiro', icon: CreditCard },
                 ].map(tab => (
                    <button
                       key={tab.id}
                       onClick={() => setActiveTab(tab.id as any)}
                       className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                          activeTab === tab.id 
                          ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 -translate-x-2' 
                          : 'text-slate-400 hover:bg-white hover:text-slate-600'
                       }`}
                    >
                       <tab.icon className="w-5 h-5" /> {tab.label}
                    </button>
                 ))}
              </aside>

              <div className="flex-1 min-w-0">
                 {isLoading ? (
                    <div className="h-64 flex items-center justify-center">
                       <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin" />
                    </div>
                 ) : (
                    <div className="space-y-6">
                        {activeTab === 'membros' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center gap-4">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input 
                                            type="text" 
                                            placeholder="Buscar membros..."
                                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <button onClick={handleOpenCreateModal} className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-3 uppercase tracking-widest text-xs">
                                        <Plus className="w-5 h-5" /> Novo Membro
                                    </button>
                                </div>
                                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-200">
                                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Membro</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plano / Status</th>
                                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {profiles.filter(p => 
                                                p.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                                p.email?.toLowerCase().includes(searchTerm.toLowerCase())
                                            ).map(profile => (
                                                <tr key={profile.user_id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 uppercase italic">
                                                                {profile.business_name?.[0]}
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
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => impersonateUser(profile.user_id)} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-all shadow-sm" title="Impedonar">
                                                                <Smartphone className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => handleOpenEditModal(profile)} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-emerald-600 transition-all shadow-sm">
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
                            </div>
                        )}

                        {activeTab === 'financeiro' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                                        <div className="relative">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Receita Total</p>
                                            <h3 className="text-3xl font-black text-slate-900 italic">R$ {payments.reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                                        </div>
                                    </div>
                                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden relative group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                                        <div className="relative">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Transações</p>
                                            <h3 className="text-3xl font-black text-slate-900 italic">{payments.length}</h3>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                                    <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Histórico de Transações</h3>
                                        <RefreshCw className="w-4 h-4 text-slate-400 cursor-pointer hover:rotate-180 transition-all duration-500" onClick={fetchData} />
                                    </div>
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-200">
                                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Membro</th>
                                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Método</th>
                                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor</th>
                                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Data</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {payments.map((payment) => (
                                                <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-8 py-4">
                                                        <p className="font-black text-slate-900 leading-none uppercase text-xs italic">ID: {payment.user_id?.substring(0, 8)}...</p>
                                                    </td>
                                                    <td className="px-8 py-4">
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase">{payment.billing_type}</span>
                                                    </td>
                                                    <td className="px-8 py-4">
                                                        <p className="font-black text-slate-900">R$ {payment.amount?.toFixed(2)}</p>
                                                    </td>
                                                    <td className="px-8 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                                            payment.status === 'CONFIRMED' || payment.status === 'RECEIVED'
                                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                            : 'bg-orange-50 text-orange-600 border-orange-100'
                                                        }`}>
                                                            {payment.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-4 text-right">
                                                        <span className="text-[10px] font-bold text-slate-400">{new Date(payment.created_at).toLocaleDateString()}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {payments.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold text-sm italic">Nenhuma transação registrada.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        {activeTab === 'parceiros' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <button onClick={() => handleOpenPartnerModal()} className="h-64 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 transition-all bg-white group">
                                    <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center group-hover:bg-indigo-50 group-hover:scale-110 transition-all">
                                        <Plus className="w-8 h-8" />
                                    </div>
                                    <span className="font-black uppercase tracking-widest text-xs italic">Novo Parceiro</span>
                                </button>
                                {partners.map(partner => (
                                    <div key={partner.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 relative group overflow-hidden shadow-sm">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-16 h-16 bg-slate-100 rounded-3xl overflow-hidden flex items-center justify-center border border-slate-200">
                                                {partner.logo_url ? <img src={partner.logo_url} className="w-full h-full object-cover" /> : <Briefcase className="w-6 h-6 text-slate-300" />}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900 leading-tight uppercase italic">{partner.title}</h4>
                                                <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mt-1">{partner.subtitle}</p>
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
              </div>
           </div>
        </main>
      </div>

      {/* MODAL CRIAR/EDITAR PARCEIRO */}
      {isPartnerModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
             <div className="bg-white rounded-[3.5rem] w-full max-w-md shadow-2xl overflow-hidden border border-white/5 animate-scale-in">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-black uppercase italic">{editingPartner ? 'Editar Parceiro' : 'Novo Parceiro'}</h3>
                        <p className="text-[10px] font-black text-brand-primary tracking-widest uppercase mt-1">Gestão de marcas e networking</p>
                    </div>
                    <button onClick={() => setIsPartnerModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                <form onSubmit={(e) => handleSavePartner(e, selectedPartnerFile || undefined)} className="p-10 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nome / Título</label>
                            <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" value={partnerForm.title} onChange={e => setPartnerForm({...partnerForm, title: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Subtítulo / Ramo</label>
                            <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" value={partnerForm.subtitle} onChange={e => setPartnerForm({...partnerForm, subtitle: e.target.value})} />
                        </div>
                        <div>
                            <PhoneInput label="Telefone WhatsApp" value={partnerForm.whatsapp} onChange={val => setPartnerForm({...partnerForm, whatsapp: val})} className="w-full" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Link de Redirecionamento</label>
                            <input type="url" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" value={partnerForm.link} onChange={e => setPartnerForm({...partnerForm, link: e.target.value})} placeholder="https://..." />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Upload de Logo (Opcional)</label>
                            <input type="file" accept="image/*" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" onChange={(e) => setSelectedPartnerFile(e.target.files?.[0] || null)} />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-[2rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                        <Save className="w-5 h-5" /> {editingPartner ? 'SALVAR ALTERAÇÕES' : 'CRIAR PARCEIRO'}
                    </button>
                </form>
             </div>
          </div>
      )}

      {/* MODAL CRIAR/EDITAR MEMBRO */}
      {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
             <div className="bg-white rounded-[3.5rem] w-full max-w-2xl max-h-[90vh] shadow-2xl overflow-hidden border border-white/5 animate-scale-in flex flex-col">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-black uppercase italic">{editingProfile ? 'Editar Membro' : 'Novo Membro'}</h3>
                        <p className="text-[10px] font-black text-brand-primary tracking-widest uppercase mt-1">Configurações de Acesso e Perfil</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                <form onSubmit={handleSaveMember} className="p-10 overflow-y-auto space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nome do Negócio</label>
                            <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" value={memberForm.business_name} onChange={e => setMemberForm({...memberForm, business_name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">E-mail de Acesso</label>
                            <input required type="email" disabled={!!editingProfile} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold disabled:opacity-50" value={memberForm.email} onChange={e => setMemberForm({...memberForm, email: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">CPF ou CNPJ</label>
                            <input type="text" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" value={memberForm.cpf_cnpj} onChange={e => setMemberForm({...memberForm, cpf_cnpj: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">WhatsApp</label>
                            <PhoneInput label="" value={memberForm.phone} onChange={val => setMemberForm({...memberForm, phone: val})} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Plano de Assinatura</label>
                            <select className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" value={memberForm.plan} onChange={e => setMemberForm({...memberForm, plan: e.target.value as any})}>
                                <option value="pre-cadastro">Pré-Cadastro</option>
                                <option value="start">START</option>
                                <option value="pro">PRO</option>
                                <option value="full">FULL</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nível de Experiência</label>
                            <select className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" value={memberForm.level} onChange={e => setMemberForm({...memberForm, level: e.target.value as any})}>
                                <option value="Nível Base">Nível Base</option>
                                <option value="bronze">Bronze</option>
                                <option value="prata">Prata</option>
                                <option value="ouro">Ouro</option>
                                <option value="diamante">Diamante</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Saldo de Pontos</label>
                            <input type="number" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" value={memberForm.points} onChange={e => setMemberForm({...memberForm, points: Number(e.target.value)})} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-brand-primary">Saldo Menu Cash (M$)</label>
                            <input type="number" step="0.01" className="w-full bg-orange-50/50 border-none rounded-2xl p-4 font-bold text-brand-primary" value={memberForm.menu_cash} onChange={e => setMemberForm({...memberForm, menu_cash: Number(e.target.value)})} />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-brand-primary text-white font-black py-4 rounded-[2rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-orange-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                        {loading ? 'PROCESSANDO...' : (editingProfile ? <><Save className="w-4 h-4" /> SALVAR ALTERAÇÕES</> : <><UserPlus className="w-4 h-4" /> CRIAR MEMBRO AGORA</>)}
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
    </>
  );
};

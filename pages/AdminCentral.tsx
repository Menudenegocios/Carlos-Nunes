
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

export const AdminCentral: React.FC = () => {
  const { user, impersonateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'membros' | 'agenda' | 'marketplace' | 'parceiros' | 'localplus'>('membros');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['membros', 'agenda', 'marketplace', 'parceiros', 'localplus'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [location.search]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [events, setEvents] = useState<PlatformEvent[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
    cpf_cnpj: ''
  });

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
    image_url: ''
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
  
  // Delete Confirmation State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  const planNames: Record<string, string> = {
    basic: 'Plano Start',
    pro: 'Plano Pro',
    full: 'Plano Full'
  };

  const plansConfig = [
    { name: 'Plano Start', color: 'border-slate-300', modules: [{ name: 'Visão Geral', icon: Layout }, { name: 'Bio Digital', icon: Smartphone }, { name: 'Menu Academy', icon: GraduationCap }, { name: 'Clube de Vantagens', icon: Trophy }, { name: 'Planos de Adesão', icon: CreditCard }] },
    { name: 'Plano Pro', color: 'border-brand-primary', modules: [{ name: 'Visão Geral', icon: Layout }, { name: 'Bio Digital', icon: Smartphone }, { name: 'Catálogo & Lojas', icon: Package }, { name: 'Blog & Artigos', icon: BookOpen }, { name: 'CRM & Vendas', icon: Briefcase }, { name: 'Menu Academy', icon: GraduationCap }, { name: 'Clube de Vantagens', icon: Trophy }, { name: 'Planos de Adesão', icon: CreditCard }] }
  ];

  useEffect(() => {
    if (user?.role === 'admin') loadAdminData();
  }, [user]);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [allProfiles, allEvents, allProducts, allOffers, allPartners] = await Promise.all([
        supabaseService.getAllProfilesWithSubscriptions(),
        supabaseService.getEvents(),
        supabaseService.getAllProducts(),
        supabaseService.getOffers(),
        supabaseService.getPartners()
      ]);
      setProfiles(allProfiles);
      setEvents(allEvents);
      setProducts(allProducts);
      setOffers(allOffers);
      setPartners(allPartners);
    } catch (error) {
      console.error('Error loading admin data:', error);
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
        cpf_cnpj: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (profile: Profile) => {
    setEditingProfile(profile);
    setMemberForm({
      business_name: profile.business_name || '',
      email: (profile as any).email || '',
      password: '', // Senha em branco para segurança no modo edit
      plan: (profile as any).plan || 'pre-cadastro',
      level: (profile as any).level || 'Nível Base',
      points: (profile as any).points || 0,
      menu_cash: (profile as any).menu_cash || 0,
      role: (profile as any).role || 'user',
      has_founder_badge: (profile as any).has_founder_badge || false,
      has_local_plus: (profile as any).has_local_plus || false,
      display_id: profile.display_id,
      cpf_cnpj: profile.cpf_cnpj || ''
    });
    setIsModalOpen(true);
  };

  const [loading, setLoading] = useState(false);

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingProfile) {
        await supabaseService.adminUpdateUser({
          userId: editingProfile.user_id,
          business_name: memberForm.business_name,
          email: memberForm.email,
          password: memberForm.password || undefined,
          plan: memberForm.plan,
          level: memberForm.level,
          points: memberForm.points,
          menu_cash: memberForm.menu_cash,
          role: memberForm.role,
          has_founder_badge: memberForm.has_founder_badge,
          has_local_plus: memberForm.has_local_plus,
          display_id: memberForm.display_id,
          cpf_cnpj: memberForm.cpf_cnpj
        });
        setIsModalOpen(false);
        await loadAdminData();
        alert('Informações de membro, login e senha sincronizadas e salvas com sucesso!');
      } else {
        alert('Para criar um novo administrador, registre a conta normalmente pela tela principal do sistema e mude o nível de acesso "role" diretamente no painel de banco de dados do Supabase. Essa medida é necessária por questões de segurança na nuvem.');
        setIsModalOpen(false);
      }
    } catch (err: any) { 
      console.error("Erro ao salvar membro:", err);
      console.error("Erro completo:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
      if (err.code === 'auth/email-already-in-use') {
        alert('Este e-mail já está em uso por outro usuário. Tente editar o membro existente ou use outro e-mail.');
      } else {
        alert(`Erro ao processar operação: ${err.message || 'Erro desconhecido'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async (user_id: string) => {
    setMemberToDelete(user_id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteMember = async () => {
    if (!memberToDelete) return;
    
    setIsLoading(true);
    try {
       const { data: { session } } = await supabase.auth.getSession();
       if (!session) throw new Error("No active session");

        const { data: adminProfile } = await supabase.from('profiles').select('role').eq('user_id', session.user.id).single();
        if (adminProfile?.role !== 'admin') throw new Error("Acesso negado. Requer permissão de administrador.");

        // Chamar o serviço admin que deleta tanto Auth quanto Perfil
        await supabaseService.adminDeleteUser(memberToDelete);

        setIsDeleteModalOpen(false);
        setMemberToDelete(null);
        await loadAdminData();
        alert('Membro excluído permanentemente (Auth e Perfil) com sucesso.');
    } catch (err: any) {
       console.error("Erro ao excluir:", err);
       alert(`Erro ao excluir membro: ${err.message}`);
    } finally {
       setIsLoading(false);
    }
  };

  // Event Management Handlers
  const handleOpenEventModal = (event?: PlatformEvent) => {
    if (event) {
      setEditingEvent(event);
      setEventForm({
        title: event.title,
        date: event.date,
        location: event.location,
        description: event.description,
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

  const handleOpenPartnerModal = (partner?: any) => {
    if (partner) {
      setEditingPartner(partner);
      setPartnerForm({
        title: partner.title || '',
        subtitle: partner.subtitle || '',
        logo_url: partner.logo_url || '',
        whatsapp: partner.whatsapp || '',
        link: partner.link || ''
      });
    } else {
      setEditingPartner(null);
      setPartnerForm({
        title: '',
        subtitle: '',
        logo_url: '',
        whatsapp: '',
        link: ''
      });
    }
    setIsPartnerModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent, file?: File) => {
    e.preventDefault();
    try {
      let image_url = eventForm.image;
      if (file) {
        image_url = await supabaseService.uploadImage(file, `events/${Date.now()}_${file.name}`);
      }
      
      const eventData = { ...eventForm, image: image_url };

      if (editingEvent) {
        await supabaseService.updateEvent(editingEvent.id, eventData);
      } else {
        await supabaseService.createEvent(eventData);
      }
      setIsEventModalOpen(false);
      loadAdminData();
      alert(editingEvent ? 'Evento atualizado!' : 'Evento criado!');
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar evento.');
    }
  };

  const handleSavePartner = async (e: React.FormEvent, file?: File) => {
    e.preventDefault();
    try {
      let logo_url = partnerForm.logo_url;
      if (file) {
        logo_url = await supabaseService.uploadImage(file, `partners/${Date.now()}_${file.name}`);
      }
      
      const partnerData = { ...partnerForm, logo_url };

      if (editingPartner) {
        await supabaseService.updatePartner(editingPartner.id, partnerData);
      } else {
        await supabaseService.createPartner(partnerData);
      }
      setIsPartnerModalOpen(false);
      loadAdminData();
      alert(editingPartner ? 'Parceiro atualizado!' : 'Parceiro criado!');
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar parceiro.');
    }
  };

  const deleteEvent = async (id: string) => {
    if (window.confirm('Excluir este evento?')) {
      try {
        await supabaseService.deleteEvent(id);
        loadAdminData();
      } catch (e) {
        console.error(e);
        alert('Erro ao excluir evento.');
      }
    }
  };

  const deletePartner = async (id: string) => {
    if(window.confirm('Tem certeza que deseja excluir este parceiro?')) {
      try {
        await supabaseService.deletePartner(id);
        loadAdminData();
      } catch (e) {
        console.error(e);
        alert('Erro ao excluir parceiro.');
      }
    }
  };

  // Marketplace Management Handlers
  const handleOpenMarketplaceModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setItemForm({
        name: item.name || item.title || '',
        description: item.description || '',
        price: item.price || 0,
        category: item.category || '',
        type: item.type || (item.name ? 'product' : 'offer'),
        image_url: item.image_url || ''
      });
    } else {
      setEditingItem(null);
      setItemForm({
        name: '',
        description: '',
        price: 0,
        category: '',
        type: 'product',
        image_url: ''
      });
    }
    setIsMarketplaceModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent, file?: File) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      let final_image_url = itemForm.image_url;
      if (file) {
        final_image_url = await supabaseService.uploadImage(file, `marketplace/${Date.now()}_${file.name}`);
      }
      
      const { type, name, ...restOfForm } = itemForm;
      const itemData: any = { ...restOfForm, image_url: final_image_url };

      if (editingItem) {
        if (type === 'product') {
            await supabaseService.updateProduct(editingItem.id, { ...itemData, name });
        } else {
            await supabaseService.updateOffer(editingItem.id, { ...itemData, title: name });
        }
      } else {
        if (type === 'product') {
            await supabaseService.createProduct({ ...itemData, name, user_id: user.id });
        } else {
            await supabaseService.createOffer({ ...itemData, title: name, user_id: user.id });
        }
      }
      setIsMarketplaceModalOpen(false);
      loadAdminData();
      alert(editingItem ? 'Item atualizado!' : 'Item criado!');
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar item.');
    }
  };

  const deleteItem = async (id: string, type: 'product' | 'offer', user_id?: string) => {
    if (window.confirm('Excluir este item?')) {
      try {
        if (type === 'product') {
            await supabaseService.deleteProduct(id);
        } else {
            await supabaseService.deleteOffer(id);
        }
        loadAdminData();
      } catch (e) {
        console.error(e);
        alert('Erro ao excluir item.');
      }
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

      <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
         <div className="flex bg-gray-50 p-2 gap-2 overflow-x-auto scrollbar-hide">
            {[{ id: 'membros', label: 'Membros', icon: Users, desc: 'Gestão de Usuários' },
            { id: 'agenda', label: 'Agenda', icon: Calendar, desc: 'Eventos da Plataforma' },
            { id: 'marketplace', label: 'Menu Store', icon: ShoppingBag, desc: 'Produtos do Admin' },
            { id: 'localplus', label: 'Local+', icon: Sparkles, desc: 'Controle Local+' },
            { id: 'parceiros', label: 'Parceiros', icon: UserPlus, desc: 'Logos e Links de Parceiros' }].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-[150px] flex items-center justify-center gap-3 py-4 rounded-[1.8rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white'}`}>
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
                                    <input type="text" placeholder="Buscar..." className="pl-12 pr-6 py-3 bg-gray-50 rounded-xl border-none font-bold text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                </div>
                            </div>
                            
                            <div className="grid gap-4">
                                {profiles.filter(p => 
                                    (p.business_name?.toLowerCase().includes(searchTerm.toLowerCase())) || 
                                    (p.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                    (p.display_id?.toString().includes(searchTerm))
                                ).map(profile => {
                                     const subscription = Array.isArray((profile as any).subscriptions) 
                                       ? (profile as any).subscriptions[0] 
                                       : (profile as any).subscriptions;
                                     const plan = profile.plan || subscription?.plan || 'pre-cadastro';
                                     
                                     // Se tem plano e não é pré-cadastro, está Ativo, exceto se cancelado explicitamente
                                     let status = subscription?.status;
                                     if (!status || status === 'inactive' || status === 'incomplete') {
                                         const hasActivePlan = plan && !['pre-cadastro', 'free', 'none'].includes(plan.toLowerCase());
                                         if (hasActivePlan) {
                                             status = 'active';
                                         } else if (!status) {
                                             status = 'inactive';
                                         }
                                     }
                                     
                                     const statusColors: Record<string, string> = {
                                         active: 'bg-emerald-50 text-emerald-600',
                                         trialing: 'bg-blue-50 text-blue-600',
                                         past_due: 'bg-amber-50 text-amber-600',
                                         canceled: 'bg-rose-50 text-rose-600',
                                         incomplete: 'bg-slate-50 text-slate-600',
                                         inactive: 'bg-slate-50 text-slate-600'
                                     };

                                    const statusLabels: Record<string, string> = {
                                        active: 'Ativo',
                                        trialing: 'Trial',
                                        past_due: 'Atrasado',
                                        canceled: 'Cancelado',
                                        incomplete: 'Incompleto',
                                        inactive: 'Inativo'
                                    };

                                    return (
                                        <div key={profile.id} className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 flex items-center justify-between group hover:bg-white transition-all shadow-sm">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white flex items-center justify-center">
                                                    {profile.logo_url ? (
                                                        <img src={profile.logo_url} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="w-6 h-6 text-slate-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="font-black text-gray-900 text-lg">{profile.business_name || profile.name || 'Membro sem nome'} <span className="text-slate-300 font-medium ml-2 text-sm">#{profile.display_id || '---'}</span></h4>
                                                        <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase ${statusColors[status] || 'bg-slate-50 text-slate-600'}`}>
                                                            {statusLabels[status] || status}
                                                        </span>
                                                        {profile.has_founder_badge && (
                                                            <span className="bg-amber-100 text-amber-600 text-[8px] font-black px-2 py-1 rounded-lg uppercase border border-amber-200">
                                                                Membro Fundador
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-1">
                                                      <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg uppercase">{planNames[plan] || plan}</span>
                                                      <span className="text-[9px] font-black bg-amber-50 text-amber-600 px-2 py-1 rounded-lg uppercase">{profile.points || 0} pts</span>
                                                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{profile.city || 'Sem cidade'}</span>
                                                      {profile.email && <span className="text-[10px] font-medium text-slate-400 italic">{profile.email}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                  onClick={() => impersonateUser(profile.user_id)} 
                                                  title="Modo Personificação" 
                                                  className="p-3 bg-white rounded-xl text-emerald-500 hover:bg-emerald-50 transition-all shadow-sm border border-gray-100"
                                                >
                                                  <Eye className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => handleOpenEditModal(profile)} title="Editar dados/Login" className="p-3 bg-white rounded-xl text-indigo-400 hover:bg-indigo-50 transition-all shadow-sm border border-gray-100"><Edit2 className="w-5 h-5" /></button>
                                                <button onClick={() => deleteMember(profile.user_id)} className="p-3 bg-white rounded-xl text-rose-400 hover:bg-rose-50 transition-all shadow-sm border border-gray-100"><Trash2 className="w-5 h-5" /></button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {activeTab === 'marketplace' && (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center px-4">
                                <div>
                                    <h3 className="text-2xl font-black italic uppercase">Gestão Menu Store</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Produtos registrados exclusivamente pelo admin</p>
                                </div>
                                <button onClick={() => { setEditingItem(null); setItemForm({ name: '', description: '', price: 0, category: 'Produtos', type: 'product', image_url: '' }); setIsMarketplaceModalOpen(true); }} className="bg-[#F67C01] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg hover:scale-105 transition-all">
                                    <Plus className="w-4 h-4" /> NOVO ITEM
                                </button>
                            </div>
                            
                            <div className="grid gap-4">
                                {products.map(item => {
                                    const processedItem = { ...item, type: 'product', _key: `product-${item.id}` };
                                    return (
                                    <div key={processedItem._key} className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 flex items-center justify-between group hover:bg-white transition-all shadow-sm">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                                                <Package className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900 text-lg">{item.name}</h4>
                                                <div className="flex items-center gap-3">
                                                  <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg uppercase">{item.type}</span>
                                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">R$ {item.price}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleOpenMarketplaceModal(processedItem)} className="p-3 bg-white rounded-xl text-indigo-400 hover:bg-indigo-50 transition-all shadow-sm border border-gray-100"><Edit2 className="w-5 h-5" /></button>
                                            <button onClick={() => deleteItem(processedItem.id, processedItem.type, processedItem.user_id)} className="p-3 bg-white rounded-xl text-rose-400 hover:bg-rose-50 transition-all shadow-sm border border-gray-100"><Trash2 className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                )})}
                            </div>
                        </div>
                    )}
                    {activeTab === 'localplus' && (
                        <div className="space-y-8 animate-fade-in">
                            <div className="flex justify-between items-center px-4">
                                <div>
                                    <h3 className="text-2xl font-black italic uppercase text-brand-primary">Gestão Local+</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Controle Global de Ofertas das Empresas</p>
                                </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {offers.map(offer => (
                                    <div key={`localplus-offer-${offer.id}`} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex flex-col justify-between group hover:shadow-xl transition-all h-full relative overflow-hidden">
                                        {offer.is_flash_deal && (
                                            <div className="absolute top-0 right-0 bg-brand-primary text-white text-[8px] font-black px-3 py-1 rounded-bl-xl tracking-widest uppercase">
                                                MENU DO DIA
                                            </div>
                                        )}
                                        <div>
                                            <div className="flex items-center justify-between mb-6 mt-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center">
                                                        {offer.store_logo_url ? <img src={offer.store_logo_url} className="w-full h-full object-cover" /> : <Sparkles className="w-5 h-5 text-brand-primary" />}
                                                    </div>
                                                    <div>
                                                        <h5 className="font-bold text-sm text-slate-900">{offer.store_name || 'Usuário Local+'}</h5>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{offer.category || 'Oferta'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-1 mb-4">
                                                <h4 className="text-lg font-black text-slate-900 leading-tight">{offer.title}</h4>
                                                <span className="inline-block bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-emerald-100 mt-2">
                                                    Desconto/Benefício: {offer.discount_display}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-50">
                                            <button onClick={() => deleteItem(offer.id, 'offer', offer.user_id)} className="w-full py-3 bg-rose-50 text-rose-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95">
                                                <Trash2 className="w-4 h-4" /> EXCLUIR OFERTA
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {offers.length === 0 && (
                                    <div className="col-span-full py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 text-center">
                                        <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Nenhuma oferta Local+ cadastrada ativamente ainda.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {activeTab === 'agenda' && (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center px-4">
                                <h3 className="text-2xl font-black italic uppercase">Agenda</h3>
                                <button onClick={() => handleOpenEventModal()} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2 hover:scale-105 transition-all">
                                    <Plus className="w-4 h-4" /> NOVO ITEM
                                </button>
                            </div>
                            
                            <div className="grid gap-4">
                                {events.map(event => (
                                    <div key={event.id} className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 flex items-center justify-between group hover:bg-white transition-all shadow-sm">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                                                <Calendar className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900 text-lg">{event.title}</h4>
                                                <div className="flex items-center gap-3">
                                                  <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg uppercase">{event.type}</span>
                                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{event.date}</span>
                                                  <span className="text-[10px] font-medium text-slate-400 italic">{event.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleOpenEventModal(event)} className="p-3 bg-white rounded-xl text-indigo-400 hover:bg-indigo-50 transition-all shadow-sm border border-gray-100"><Edit2 className="w-5 h-5" /></button>
                                            <button onClick={() => deleteEvent(event.id)} className="p-3 bg-white rounded-xl text-rose-400 hover:bg-rose-50 transition-all shadow-sm border border-gray-100"><Trash2 className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'parceiros' && (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center px-4">
                                <h3 className="text-2xl font-black italic uppercase">Gestão de Parceiros</h3>
                                <button onClick={() => handleOpenPartnerModal()} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2 hover:scale-105 transition-all">
                                    <Plus className="w-4 h-4" /> NOVO PARCEIRO
                                </button>
                            </div>
                            
                            {partners.length === 0 ? (
                                <div className="text-center py-20 bg-gray-50/50 rounded-3xl border border-gray-100">
                                    <Briefcase className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                                    <h3 className="text-xl font-black uppercase italic text-slate-400">Nenhum Parceiro Cadastrado</h3>
                                    <p className="text-slate-400 text-sm mt-2">Clique em "Novo Parceiro" para adicionar conteúdo.</p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {partners.map(partner => (
                                        <div key={partner.id} className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 flex items-center justify-between group hover:bg-white transition-all shadow-sm">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-2xl bg-indigo-50 overflow-hidden shadow-sm flex items-center justify-center">
                                                    {partner.logo_url ? (
                                                        <img src={partner.logo_url} alt={partner.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Briefcase className="w-8 h-8 text-indigo-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-gray-900 text-lg">{partner.title}</h4>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{partner.subtitle}</p>
                                                    <div className="flex gap-2 mt-2">
                                                        <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg font-black">{partner.whatsapp}</span>
                                                        {partner.link && <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg font-black truncate max-w-[200px]">{partner.link}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleOpenPartnerModal(partner)} className="p-3 bg-white rounded-xl text-indigo-400 hover:bg-indigo-50 transition-all shadow-sm border border-gray-100"><Edit2 className="w-5 h-5" /></button>
                                                <button onClick={() => deletePartner(partner.id)} className="p-3 bg-white rounded-xl text-rose-400 hover:bg-rose-50 transition-all shadow-sm border border-gray-100"><Trash2 className="w-5 h-5" /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
          </div>
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
                            <PhoneInput
                            label="Telefone WhatsApp"
                            value={partnerForm.whatsapp}
                            onChange={val => setPartnerForm({...partnerForm, whatsapp: val})}
                            className="w-full"
                         />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Link de Redirecionamento</label>
                            <input type="url" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" value={partnerForm.link} onChange={e => setPartnerForm({...partnerForm, link: e.target.value})} placeholder="https://..." />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Upload de Logo (Opcional)</label>
                            <input type="file" accept="image/*" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setSelectedPartnerFile(file);
                                }
                            }} />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-[2rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                        <Save className="w-5 h-5" /> {editingPartner ? 'SALVAR ALTERAÇÕES' : 'CRIAR PARCEIRO'}
                    </button>
                </form>
             </div>
          </div>
      )}

      {/* MODAL CRIAR/EDITAR MARKETPLACE */}
      {isMarketplaceModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
             <div className="bg-white rounded-[3.5rem] w-full max-w-md shadow-2xl overflow-hidden border border-white/5 animate-scale-in">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-black uppercase italic">{editingItem ? 'Editar Item' : 'Novo Item'}</h3>
                        <p className="text-[10px] font-black text-brand-primary tracking-widest uppercase mt-1">Gerencie produtos e ofertas</p>
                    </div>
                    <button onClick={() => setIsMarketplaceModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                <form onSubmit={(e) => handleSaveItem(e, selectedItemFile || undefined)} className="p-10 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nome do Item</label>
                            <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" value={itemForm.name} onChange={e => setItemForm({...itemForm, name: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Preço (R$)</label>
                                <input required type="number" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" value={itemForm.price} onChange={e => setItemForm({...itemForm, price: Number(e.target.value)})} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tipo</label>
                                <select className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" value={itemForm.type} onChange={e => setItemForm({...itemForm, type: e.target.value as any})}>
                                    <option value="product">Produto</option>
                                    <option value="offer">Oferta</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Categoria</label>
                            <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" value={itemForm.category} onChange={e => setItemForm({...itemForm, category: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Upload de Imagem (Opcional)</label>
                            <input type="file" accept="image/*" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setSelectedItemFile(file);
                                }
                            }} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Descrição</label>
                            <textarea rows={3} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold resize-none" value={itemForm.description} onChange={e => setItemForm({...itemForm, description: e.target.value})} />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-[2rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                        <Save className="w-5 h-5" /> {editingItem ? 'SALVAR ALTERAÇÕES' : 'CRIAR ITEM'}
                    </button>
                </form>
             </div>
          </div>
      )}
      {/* MODAL CRIAR/EDITAR EVENTO */}
      {isEventModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
             <div className="bg-white rounded-[3.5rem] w-full max-w-md shadow-2xl overflow-hidden border border-white/5 animate-scale-in">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-black uppercase italic">{editingEvent ? 'Editar Item da Agenda' : 'Novo Item na Agenda'}</h3>
                        <p className="text-[10px] font-black text-brand-primary tracking-widest uppercase mt-1">Divulgue workshops e networking</p>
                    </div>
                    <button onClick={() => setIsEventModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                <form onSubmit={(e) => handleSaveEvent(e, selectedEventFile || undefined)} className="p-10 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Título do Evento</label>
                            <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Data</label>
                                <input required type="date" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tipo</label>
                                <select className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" value={eventForm.type} onChange={e => setEventForm({...eventForm, type: e.target.value as any})}>
                                    <option value="Online">Online</option>
                                    <option value="Presencial">Presencial</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Local / Link</label>
                            <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Descrição Curta</label>
                            <textarea rows={3} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold resize-none" value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Upload de Imagem (Opcional)</label>
                            <input type="file" accept="image/*" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setSelectedEventFile(file);
                                }
                            }} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Link Externo (Sympla, Meeting, etc)</label>
                            <input type="url" placeholder="https://..." className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-indigo-600" value={eventForm.external_link} onChange={e => setEventForm({...eventForm, external_link: e.target.value})} />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-[2rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                        <Save className="w-5 h-5" /> {editingEvent ? 'SALVAR ALTERAÇÕES' : 'ADICIONAR NA AGENDA'}
                    </button>
                </form>
             </div>
          </div>
      )}
      {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in overflow-y-auto">
             <div className="bg-white rounded-[2.5rem] w-full max-w-sm shadow-2xl overflow-hidden border border-white/5 animate-scale-in my-auto">
                <div className="bg-[#0F172A] p-6 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-black uppercase italic">{editingProfile ? 'Configurações' : 'Novo Cadastro'}</h3>
                        <p className="text-[10px] font-black text-brand-primary tracking-widest uppercase mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">Gestão de nível e acesso</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSaveMember} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nome do Negócio / Usuário</label>
                            <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold" value={memberForm.business_name} onChange={e => setMemberForm({...memberForm, business_name: e.target.value})} />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">CPF / CNPJ</label>
                            <input type="text" className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-sm" value={memberForm.cpf_cnpj} onChange={e => setMemberForm({...memberForm, cpf_cnpj: e.target.value})} placeholder="000.000.000-00" />
                        </div>
                        
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2"><Mail className="w-3 h-3" /> E-mail</label>
                            <input required type="email" className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-sm" value={memberForm.email} onChange={e => setMemberForm({...memberForm, email: e.target.value})} placeholder="exemplo@login.com" />
                        </div>
                        
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2"><Lock className="w-3 h-3" /> Senha</label>
                            <input required={!editingProfile} type="password" className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-sm" value={memberForm.password} onChange={e => setMemberForm({...memberForm, password: e.target.value})} placeholder={editingProfile ? "••••" : "Senha"} />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Plano Ativo</label>
                            <select className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none" value={memberForm.plan} onChange={e => setMemberForm({...memberForm, plan: e.target.value as any})}>
                                <option value="pre-cadastro">Pré-cadastro</option>
                                <option value="basic">Plano Start</option>
                                <option value="pro">Plano PRO</option>
                                <option value="full">Plano FULL</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100 mb-6 w-full">
                            <input 
                                type="checkbox" 
                                id="has_founder_badge"
                                checked={memberForm.has_founder_badge} 
                                onChange={e => setMemberForm({...memberForm, has_founder_badge: e.target.checked})}
                                className="w-5 h-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                            />
                            <label htmlFor="has_founder_badge" className="text-[10px] font-black text-amber-700 uppercase tracking-widest cursor-pointer select-none">Selo Membro Fundador</label>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-brand-primary/10 rounded-2xl border border-brand-primary/20 mb-6 w-full">
                            <input 
                                type="checkbox" 
                                id="has_local_plus"
                                checked={memberForm.has_local_plus} 
                                onChange={e => setMemberForm({...memberForm, has_local_plus: e.target.checked})}
                                className="w-5 h-5 rounded border-brand-primary/30 text-brand-primary focus:ring-brand-primary"
                            />
                            <label htmlFor="has_local_plus" className="text-[10px] font-black text-brand-primary uppercase tracking-widest cursor-pointer select-none">Liberação Local+</label>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nível de Gamificação</label>
                            <select className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none" value={memberForm.level} onChange={e => setMemberForm({...memberForm, level: e.target.value as any})}>
                                <option value="nível base">Nível Base</option>
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

                        <div className="col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Categoria / Permissão</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {['user', 'partner', 'client', 'admin'].map(role => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => setMemberForm({...memberForm, role: role as any})}
                                        className={`py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all border ${
                                            memberForm.role === role 
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' 
                                            : 'bg-gray-50 text-slate-400 border-transparent hover:border-slate-300'
                                        }`}
                                    >
                                        {role === 'user' ? 'Usuário' : 
                                         role === 'partner' ? 'Parceiro' : 
                                         role === 'client' ? 'Cliente' : 'Admin'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-brand-primary text-white font-black py-4 rounded-[2rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-orange-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                        {loading ? 'PROCESSANDO...' : (editingProfile ? <><Save className="w-4 h-4" /> SALVAR ALTERAÇÕES</> : <><UserPlus className="w-4 h-4" /> CRIAR MEMBRO AGORA</>)}
                    </button>
                </form>
             </div>
          </div>
      )}
      {/* Modal de Confirmação de Exclusão */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-rose-500"></div>
             <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center">
                   <AlertCircle className="w-10 h-10 text-rose-500" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-2xl font-black uppercase italic tracking-tighter">Confirmar Exclusão?</h3>
                   <p className="text-xs font-bold text-slate-500 mt-2 tracking-tight">Esta ação é irreversível. O membro perderá acesso total e todos os seus dados serão removidos.</p>
                </div>
                <div className="flex gap-4 w-full pt-4">
                   <button 
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="flex-1 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 bg-gray-50 hover:bg-gray-100 transition-all border border-gray-100"
                   >
                      Cancelar
                   </button>
                   <button 
                      onClick={confirmDeleteMember}
                      className="flex-1 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white bg-rose-500 hover:bg-rose-600 transition-all shadow-lg shadow-rose-200"
                   >
                      Excluir Agora
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

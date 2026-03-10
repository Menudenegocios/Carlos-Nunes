
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabaseService } from '../services/supabaseService';
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
  const [activeTab, setActiveTab] = useState<'membros' | 'eventos' | 'paginas' | 'marketplace' | 'midia'>('membros');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [events, setEvents] = useState<PlatformEvent[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [mediaItems, setMediaItems] = useState<any[]>([]);
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
    points: 0,
    role: 'user' as any
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
    image: ''
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
    image: ''
  });
  const [selectedItemFile, setSelectedItemFile] = useState<File | null>(null);

  // Media Modal State
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<any | null>(null);
  const [mediaForm, setMediaForm] = useState({
    title: '',
    description: '',
    category: 'MenuCast' as 'MenuCast' | 'Treinamentos' | 'Ferramentas' | 'Eventos',
    image: '',
    youtubeEmbed: '',
    link: '',
    duration: ''
  });
  const [selectedMediaFile, setSelectedMediaFile] = useState<File | null>(null);

  const planNames: Record<string, string> = {
    profissionais: 'Plano Básico',
    freelancers: 'Plano PRO',
    negocios: 'Plano FULL'
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
      const [allProfiles, allEvents, allProducts, allOffers, allMedia] = await Promise.all([
        supabaseService.getAllProfiles(),
        supabaseService.getEvents(),
        supabaseService.getAllProducts(),
        supabaseService.getOffers(),
        supabaseService.getMedia()
      ]);
      setProfiles(allProfiles);
      setEvents(allEvents);
      setProducts(allProducts);
      setOffers(allOffers);
      setMediaItems(allMedia);
    } catch (error) {
      console.error('Error loading admin data:', error);
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
        points: 0,
        role: 'user'
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
      points: (profile as any).points || 0,
      role: (profile as any).role || 'user'
    });
    setIsModalOpen(true);
  };

  const [loading, setLoading] = useState(false);

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingProfile) {
        await supabaseService.updateProfile(editingProfile.userId, {
          businessName: memberForm.businessName,
          plan: memberForm.plan,
          points: memberForm.points,
          role: memberForm.role
        } as any);
      } else {
        if (!user) {
          alert('Você precisa estar logado para realizar esta operação.');
          setLoading(false);
          return;
        }
        await supabaseService.createMemberAsAdmin({
          businessName: memberForm.businessName,
          email: memberForm.email,
          plan: memberForm.plan,
          points: memberForm.points,
          role: memberForm.role
        });
      }
      setIsModalOpen(false);
      loadAdminData();
      alert(editingProfile ? 'Membro atualizado!' : 'Membro criado com sucesso!');
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

  const deleteMember = async (userId: string) => {
    if (window.confirm('Excluir este membro permanentemente?')) {
      try {
        // Deleting users usually requires Admin API or Edge Function
        alert("Exclusão de membros via Admin requer configuração de backend/Edge Function.");
      } catch (e) {
        alert('Erro ao excluir membro.');
      }
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
        image: event.image || ''
      });
    } else {
      setEditingEvent(null);
      setEventForm({
        title: '',
        date: '',
        location: '',
        description: '',
        type: 'Online',
        image: ''
      });
    }
    setIsEventModalOpen(true);
  };

  const handleOpenMediaModal = (media?: any) => {
    if (media) {
      setEditingMedia(media);
      setMediaForm({
        title: media.title || '',
        description: media.description || '',
        category: media.category || 'MenuCast',
        image: media.image || '',
        youtubeEmbed: media.youtubeEmbed || '',
        link: media.link || '',
        duration: media.duration || ''
      });
    } else {
      setEditingMedia(null);
      setMediaForm({
        title: '',
        description: '',
        category: 'MenuCast',
        image: '',
        youtubeEmbed: '',
        link: '',
        duration: ''
      });
    }
    setIsMediaModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent, file?: File) => {
    e.preventDefault();
    try {
      let imageUrl = eventForm.image;
      if (file) {
        imageUrl = await supabaseService.uploadImage(file, `events/${Date.now()}_${file.name}`);
      }
      
      const eventData = { ...eventForm, image: imageUrl };

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

  const handleSaveMedia = async (e: React.FormEvent, file?: File) => {
    e.preventDefault();
    try {
      let imageUrl = mediaForm.image;
      if (file) {
        imageUrl = await supabaseService.uploadImage(file, `media/${Date.now()}_${file.name}`);
      }
      
      const mediaData = { ...mediaForm, image: imageUrl };

      if (editingMedia) {
        await supabaseService.updateMedia(editingMedia.id, mediaData);
      } else {
        await supabaseService.createMedia(mediaData);
      }
      setIsMediaModalOpen(false);
      loadAdminData();
      alert(editingMedia ? 'Agenda atualizada!' : 'Agenda criada!');
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar agenda.');
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

  const deleteMedia = async (id: string) => {
    if(window.confirm('Tem certeza que deseja excluir esta mídia?')) {
      try {
        await supabaseService.deleteMedia(id);
        loadAdminData();
      } catch (e) {
        console.error(e);
        alert('Erro ao excluir mídia.');
      }
    }
  };

  // Marketplace Management Handlers
  const handleOpenMarketplaceModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setItemForm({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        type: item.type,
        image: item.image || ''
      });
    } else {
      setEditingItem(null);
      setItemForm({
        name: '',
        description: '',
        price: 0,
        category: '',
        type: 'product',
        image: ''
      });
    }
    setIsMarketplaceModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent, file?: File) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      let imageUrl = itemForm.image;
      if (file) {
        imageUrl = await supabaseService.uploadImage(file, `marketplace/${Date.now()}_${file.name}`);
      }
      
      const itemData = { ...itemForm, image: imageUrl };

      if (editingItem) {
        if (itemData.type === 'product') {
            await supabaseService.updateProduct(editingItem.id, itemData);
        } else {
            await supabaseService.updateOffer(editingItem.id, itemData);
        }
      } else {
        if (itemData.type === 'product') {
            await supabaseService.createProduct({ ...itemData, userId: user.id } as any);
        } else {
            await supabaseService.createOffer({ ...itemData, userId: user.id });
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

  const deleteItem = async (id: string, type: 'product' | 'offer', userId?: string) => {
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

      <div className="bg-white dark:bg-zinc-900 rounded-[3rem] shadow-xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
         <div className="flex bg-gray-50 dark:bg-zinc-800/50 p-2 gap-2 overflow-x-auto scrollbar-hide">
            {[{ id: 'membros', label: 'Gestão de Membros', icon: Users }, { id: 'eventos', label: 'Gestão de Eventos', icon: Calendar }, { id: 'marketplace', label: 'Marketplace', icon: Package }, { id: 'midia', label: 'Agenda & Conteúdo', icon: BookOpen }, { id: 'paginas', label: 'Páginas & Planos', icon: Settings2 }].map(tab => (
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
                                            <button onClick={() => deleteMember(profile.userId)} className="p-3 bg-white dark:bg-zinc-900 rounded-xl text-rose-400 hover:bg-rose-50 transition-all shadow-sm border border-gray-100 dark:border-zinc-800"><Trash2 className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'marketplace' && (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center px-4">
                                <h3 className="text-2xl font-black italic uppercase">Gestão do Marketplace</h3>
                                <button onClick={() => handleOpenMarketplaceModal()} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2 hover:scale-105 transition-all">
                                    <Plus className="w-4 h-4" /> NOVO ITEM
                                </button>
                            </div>
                            
                            <div className="grid gap-4">
                                {[...products.map(p => ({...p, _key: `product-${p.id}`})), ...offers.map(o => ({...o, _key: `offer-${o.id}`}))].map(item => (
                                    <div key={item._key} className="p-6 bg-gray-50/50 dark:bg-zinc-800/40 rounded-3xl border border-gray-100 dark:border-zinc-800 flex items-center justify-between group hover:bg-white transition-all shadow-sm">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 flex items-center justify-center shadow-sm">
                                                <Package className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900 dark:text-white text-lg">{item.name}</h4>
                                                <div className="flex items-center gap-3">
                                                  <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg uppercase">{item.type}</span>
                                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">R$ {item.price}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleOpenMarketplaceModal(item)} className="p-3 bg-white dark:bg-zinc-900 rounded-xl text-indigo-400 hover:bg-indigo-50 transition-all shadow-sm border border-gray-100 dark:border-zinc-800"><Edit2 className="w-5 h-5" /></button>
                                            <button onClick={() => deleteItem(item.id, item.type, item.userId)} className="p-3 bg-white dark:bg-zinc-900 rounded-xl text-rose-400 hover:bg-rose-50 transition-all shadow-sm border border-gray-100 dark:border-zinc-800"><Trash2 className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'eventos' && (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center px-4">
                                <h3 className="text-2xl font-black italic uppercase">Gestão de Eventos</h3>
                                <button onClick={() => handleOpenEventModal()} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2 hover:scale-105 transition-all">
                                    <Plus className="w-4 h-4" /> NOVO EVENTO
                                </button>
                            </div>
                            
                            <div className="grid gap-4">
                                {events.map(event => (
                                    <div key={event.id} className="p-6 bg-gray-50/50 dark:bg-zinc-800/40 rounded-3xl border border-gray-100 dark:border-zinc-800 flex items-center justify-between group hover:bg-white transition-all shadow-sm">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 flex items-center justify-center shadow-sm">
                                                <Calendar className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gray-900 dark:text-white text-lg">{event.title}</h4>
                                                <div className="flex items-center gap-3">
                                                  <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg uppercase">{event.type}</span>
                                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{event.date}</span>
                                                  <span className="text-[10px] font-medium text-slate-400 italic">{event.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleOpenEventModal(event)} className="p-3 bg-white dark:bg-zinc-900 rounded-xl text-indigo-400 hover:bg-indigo-50 transition-all shadow-sm border border-gray-100 dark:border-zinc-800"><Edit2 className="w-5 h-5" /></button>
                                            <button onClick={() => deleteEvent(event.id)} className="p-3 bg-white dark:bg-zinc-900 rounded-xl text-rose-400 hover:bg-rose-50 transition-all shadow-sm border border-gray-100 dark:border-zinc-800"><Trash2 className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'paginas' && (
                        <div className="text-center py-20">
                            <Settings2 className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                            <h3 className="text-xl font-black uppercase italic text-slate-400">Configurações de Páginas & Planos</h3>
                            <p className="text-slate-400 text-sm mt-2">Módulo em desenvolvimento para gestão de conteúdo dinâmico.</p>
                        </div>
                    )}
                    {activeTab === 'midia' && (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center px-4">
                                <h3 className="text-2xl font-black italic uppercase">Gestão de Agenda</h3>
                                <button onClick={() => handleOpenMediaModal()} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2 hover:scale-105 transition-all">
                                    <Plus className="w-4 h-4" /> NOVA MÍDIA
                                </button>
                            </div>
                            
                            {mediaItems.length === 0 ? (
                                <div className="text-center py-20 bg-gray-50/50 dark:bg-zinc-800/40 rounded-3xl border border-gray-100 dark:border-zinc-800">
                                    <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                                    <h3 className="text-xl font-black uppercase italic text-slate-400">Nenhuma Agenda Cadastrada</h3>
                                    <p className="text-slate-400 text-sm mt-2">Clique em "Nova Agenda" para adicionar conteúdo.</p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {mediaItems.map(media => (
                                        <div key={media.id} className="p-6 bg-gray-50/50 dark:bg-zinc-800/40 rounded-3xl border border-gray-100 dark:border-zinc-800 flex items-center justify-between group hover:bg-white transition-all shadow-sm">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 overflow-hidden shadow-sm">
                                                    {media.image ? (
                                                        <img src={media.image} alt={media.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-indigo-600">
                                                            <BookOpen className="w-8 h-8" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-gray-900 dark:text-white text-lg">{media.title}</h4>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase ${media.category === 'MenuCast' ? 'bg-purple-100 text-purple-700' : media.category === 'Treinamentos' ? 'bg-indigo-100 text-indigo-700' : media.category === 'Eventos' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                            {media.category}
                                                        </span>
                                                        {media.duration && (
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{media.duration}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleOpenMediaModal(media)} className="p-3 bg-white dark:bg-zinc-900 rounded-xl text-indigo-400 hover:bg-indigo-50 transition-all shadow-sm border border-gray-100 dark:border-zinc-800"><Edit2 className="w-5 h-5" /></button>
                                                <button onClick={() => deleteMedia(media.id)} className="p-3 bg-white dark:bg-zinc-900 rounded-xl text-rose-400 hover:bg-rose-50 transition-all shadow-sm border border-gray-100 dark:border-zinc-800"><Trash2 className="w-5 h-5" /></button>
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

      {/* MODAL CRIAR/EDITAR MÍDIA */}
      {isMediaModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
             <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-md shadow-2xl overflow-hidden border border-white/5 animate-scale-in">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-black uppercase italic">{editingMedia ? 'Editar Agenda' : 'Nova Agenda'}</h3>
                        <p className="text-[10px] font-black text-brand-primary tracking-widest uppercase mt-1">Gerencie vídeos, podcasts e ferramentas</p>
                    </div>
                    <button onClick={() => setIsMediaModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                <form onSubmit={(e) => handleSaveMedia(e, selectedMediaFile || undefined)} className="p-10 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Título</label>
                            <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={mediaForm.title} onChange={e => setMediaForm({...mediaForm, title: e.target.value})} />
                        </div>
                        
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Categoria</label>
                            <select className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={mediaForm.category} onChange={e => setMediaForm({...mediaForm, category: e.target.value as any})}>
                                <option value="MenuCast">MenuCast</option>
                                <option value="Treinamentos">Treinamentos</option>
                                <option value="Ferramentas">Ferramentas</option>
                                <option value="Eventos">Eventos</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Duração (Opcional)</label>
                            <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={mediaForm.duration} onChange={e => setMediaForm({...mediaForm, duration: e.target.value})} placeholder="Ex: 45m" />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">URL da Imagem de Capa</label>
                            <input required type="url" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={mediaForm.image} onChange={e => setMediaForm({...mediaForm, image: e.target.value})} placeholder="https://..." />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Upload de Imagem (Opcional)</label>
                            <input type="file" accept="image/*" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setSelectedMediaFile(file);
                                }
                            }} />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Link do YouTube (Embed) ou Link Externo</label>
                            <input type="url" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={mediaForm.category === 'Ferramentas' || mediaForm.category === 'Eventos' ? mediaForm.link : mediaForm.youtubeEmbed} onChange={e => mediaForm.category === 'Ferramentas' || mediaForm.category === 'Eventos' ? setMediaForm({...mediaForm, link: e.target.value}) : setMediaForm({...mediaForm, youtubeEmbed: e.target.value})} placeholder="https://..." />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Descrição</label>
                            <textarea rows={3} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white resize-none" value={mediaForm.description} onChange={e => setMediaForm({...mediaForm, description: e.target.value})} />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-[2rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                        <Save className="w-5 h-5" /> {editingMedia ? 'SALVAR ALTERAÇÕES' : 'CRIAR AGENDA'}
                    </button>
                </form>
             </div>
          </div>
      )}

      {/* MODAL CRIAR/EDITAR MARKETPLACE */}
      {isMarketplaceModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
             <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-md shadow-2xl overflow-hidden border border-white/5 animate-scale-in">
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
                            <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={itemForm.name} onChange={e => setItemForm({...itemForm, name: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Preço (R$)</label>
                                <input required type="number" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={itemForm.price} onChange={e => setItemForm({...itemForm, price: Number(e.target.value)})} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tipo</label>
                                <select className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={itemForm.type} onChange={e => setItemForm({...itemForm, type: e.target.value as any})}>
                                    <option value="product">Produto</option>
                                    <option value="offer">Oferta</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Categoria</label>
                            <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={itemForm.category} onChange={e => setItemForm({...itemForm, category: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">URL da Imagem</label>
                            <input required type="url" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={itemForm.image} onChange={e => setItemForm({...itemForm, image: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Upload de Imagem (Opcional)</label>
                            <input type="file" accept="image/*" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setSelectedItemFile(file);
                                }
                            }} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Descrição</label>
                            <textarea rows={3} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white resize-none" value={itemForm.description} onChange={e => setItemForm({...itemForm, description: e.target.value})} />
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
             <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-md shadow-2xl overflow-hidden border border-white/5 animate-scale-in">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-black uppercase italic">{editingEvent ? 'Editar Evento' : 'Novo Evento'}</h3>
                        <p className="text-[10px] font-black text-brand-primary tracking-widest uppercase mt-1">Divulgue workshops e networking</p>
                    </div>
                    <button onClick={() => setIsEventModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                <form onSubmit={(e) => handleSaveEvent(e, selectedEventFile || undefined)} className="p-10 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Título do Evento</label>
                            <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Data</label>
                                <input required type="date" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tipo</label>
                                <select className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={eventForm.type} onChange={e => setEventForm({...eventForm, type: e.target.value as any})}>
                                    <option value="Online">Online</option>
                                    <option value="Presencial">Presencial</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Local / Link</label>
                            <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Descrição Curta</label>
                            <textarea rows={3} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white resize-none" value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Upload de Imagem (Opcional)</label>
                            <input type="file" accept="image/*" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setSelectedEventFile(file);
                                }
                            }} />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-[2rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                        <Save className="w-5 h-5" /> {editingEvent ? 'SALVAR ALTERAÇÕES' : 'CRIAR EVENTO'}
                    </button>
                </form>
             </div>
          </div>
      )}
      {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
             <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-md shadow-2xl overflow-hidden border border-white/5 animate-scale-in">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-black uppercase italic">{editingProfile ? 'Configurações do Membro' : 'Novo Cadastro Manual'}</h3>
                        <p className="text-[10px] font-black text-brand-primary tracking-widest uppercase mt-1">Defina credenciais e nível de acesso</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                <form onSubmit={handleSaveMember} className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nome do Negócio / Usuário</label>
                            <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={memberForm.businessName} onChange={e => setMemberForm({...memberForm, businessName: e.target.value})} />
                        </div>
                        
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Mail className="w-3 h-3" /> E-mail (Login)</label>
                            <input required type="email" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={memberForm.email} onChange={e => setMemberForm({...memberForm, email: e.target.value})} placeholder="exemplo@login.com" />
                        </div>
                        
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Lock className="w-3 h-3" /> Senha</label>
                            <input required={!editingProfile} type="password" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={memberForm.password} onChange={e => setMemberForm({...memberForm, password: e.target.value})} placeholder={editingProfile ? "•••••••• (deixe em branco para manter)" : "Senha inicial"} />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Plano Ativo</label>
                            <select className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={memberForm.plan} onChange={e => setMemberForm({...memberForm, plan: e.target.value as any})}>
                                <option value="profissionais">Plano Básico</option>
                                <option value="freelancers">Plano PRO</option>
                                <option value="negocios">Plano FULL</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Saldo de Pontos</label>
                            <input type="number" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white" value={memberForm.points} onChange={e => setMemberForm({...memberForm, points: Number(e.target.value)})} />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Categoria / Permissão</label>
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                                {['user', 'partner', 'member', 'client', 'admin'].map(role => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => setMemberForm({...memberForm, role: role as any})}
                                        className={`py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all border ${
                                            memberForm.role === role 
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' 
                                            : 'bg-gray-50 dark:bg-zinc-800 text-slate-400 border-transparent hover:border-slate-300'
                                        }`}
                                    >
                                        {role === 'user' ? 'Usuário' : 
                                         role === 'partner' ? 'Parceiro' : 
                                         role === 'member' ? 'Membro' : 
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
    </div>
  );
};

const MapPin = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);


import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { 
  Smartphone, Plus, Trash2, Layout, 
  Palette, Save, MessageCircle, Globe, Mail, 
  Copy, Check, GripVertical, Eye, Monitor,
  Image as ImageIcon, Star, QrCode, Download,
  CheckCircle, ArrowRight, Camera, RefreshCw,
  User as UserIcon, AlignLeft, Info, BookOpen, 
  FileText, ChevronLeft, Calendar, User, Upload, Edit2, 
  Zap, MoreHorizontal, X, Send, Palette as PaletteIcon, Share2, Home as HomeIcon,
  Store, Briefcase, Award, Ticket, Video, Clock, ExternalLink, Sparkles, LayoutGrid,
  Package, Hash
} from 'lucide-react';
import { BioLink, BioConfig, Profile, SocialProof, OfferCategory, SchedulingConfig, Product } from '../types';
import { SectionLanding } from '../components/SectionLanding';

const FONTS = [
  { id: 'font-sans', label: 'Inter (Padrão)', family: 'font-sans' },
  { id: 'font-serif', label: 'Playfair (Elegante)', family: 'serif' },
  { id: 'font-mono', label: 'Roboto Mono (Tech)', family: 'monospace' },
  { id: 'font-display', label: 'Poppins (Moderno)', family: 'sans-serif' },
];

const PRESET_THEMES = [
  { id: 'emerald', label: 'Emerald Premium', bg: '#064e3b', btn: '#059669', text: '#ffffff' },
  { id: 'dark', label: 'Deep Night', bg: '#0f172a', btn: '#1e293b', text: '#ffffff' },
  { id: 'indigo', label: 'Royal Blue', bg: '#312e81', btn: '#4338ca', text: '#ffffff' },
  { id: 'minimal', label: 'Minimalist', bg: '#fcfcfd', btn: '#ffffff', text: '#0f172a' },
];

const MARKETPLACE_CATEGORIES = [
    { id: 'negocios', label: 'Negócios Locais', icon: Store, enum: OfferCategory.NEGOCIOS_LOCAIS },
    { id: 'profissionais', label: 'Profissionais', icon: Briefcase, enum: OfferCategory.SERVICOS_PROFISSIONAIS },
    { id: 'mentorias', label: 'Mentorias', icon: Award, enum: OfferCategory.OPORTUNIDADES },
];

export const BioBuilder: React.FC = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const productImgInputRef = useRef<HTMLInputElement>(null);
  const [activeEditorTab, setActiveEditorTab] = useState<'home' | 'content' | 'social_proof' | 'design' | 'share'>('home');
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [links, setLinks] = useState<BioLink[]>([]);
  const [socialProof, setSocialProof] = useState<SocialProof[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [bgColor, setBgColor] = useState('#064e3b');
  const [btnColor, setBtnColor] = useState('#059669');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontFamily, setFontFamily] = useState('font-sans');
  const [selectedCategory, setSelectedCategory] = useState('profissionais');
  const [useMeshGradient, setUseMeshGradient] = useState(false);
  
  const [schedEnabled, setSchedEnabled] = useState(false);
  const [schedDuration, setSchedDuration] = useState(60);
  const [schedType, setSchedType] = useState<'google_meet' | 'in_person'>('google_meet');
  const [calendarConnected, setCalendarConnected] = useState(false);

  const [ctaEnabled, setCtaEnabled] = useState(false);
  const [ctaLabel, setCtaLabel] = useState('Falar no WhatsApp');

  const [showcaseEnabled, setShowcaseEnabled] = useState(false);
  const [showcaseTitle, setShowcaseTitle] = useState('Nossos Serviços');
  const [showcaseType, setShowcaseType] = useState<'products' | 'services'>('services');
  const [shareCardEnabled, setShareCardEnabled] = useState(false);

  // Estados para Modal de Produto
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({ 
    name: '', description: '', price: 0, category: 'Geral', available: true, imageUrl: ''
  });

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    if (!user) return;
    try {
        const [data, prods] = await Promise.all([
            mockBackend.getProfile(user.id),
            mockBackend.getProducts(user.id)
        ]);
        
        if (data) {
          setProfile(data);
          setLinks(data.bioConfig?.links || [
            { id: '1', type: 'whatsapp', label: 'WhatsApp Comercial', url: '', active: true },
            { id: '2', type: 'instagram', label: 'Siga no Instagram', url: '', active: true }
          ]);
          setSocialProof(data.bioConfig?.socialProof || []);

          if (data.bioConfig?.customColors) {
            setBgColor(data.bioConfig.customColors.background || '#064e3b');
            setBtnColor(data.bioConfig.customColors.button || '#059669');
            setTextColor(data.bioConfig.customColors.text || '#ffffff');
          }
          if (data.bioConfig?.fontFamily) setFontFamily(data.bioConfig.fontFamily);
          if (data.bioConfig?.themeId) setSelectedCategory(data.bioConfig.themeId);
          if (data.bioConfig?.meshGradient) setUseMeshGradient(data.bioConfig.meshGradient);
          
          if (data.storeConfig?.schedulingEnabled) setSchedEnabled(true);
          if (data.bioConfig?.floatingCTA) {
              setCtaEnabled(data.bioConfig.floatingCTA.enabled);
              setCtaLabel(data.bioConfig.floatingCTA.label);
          }

          if (data.bioConfig?.showcase) {
              setShowcaseEnabled(data.bioConfig.showcase.enabled);
              setShowcaseTitle(data.bioConfig.showcase.title || 'Nossos Serviços');
              setShowcaseType(data.bioConfig.showcase.type || 'services');
          }
          if (data.bioConfig?.shareCard) {
              setShareCardEnabled(data.bioConfig.shareCard.enabled);
          }
        }
        setProducts(prods || []);
    } catch (e) {
        console.error("Erro ao carregar dados da Bio:", e);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const updatedProfile = { 
        ...profile,
        storeConfig: {
          ...profile.storeConfig,
          schedulingEnabled: schedEnabled
        },
        bioConfig: { 
          themeId: selectedCategory, 
          fontFamily: fontFamily as any, 
          links,
          socialProof,
          meshGradient: useMeshGradient,
          floatingCTA: {
              enabled: ctaEnabled,
              label: ctaLabel,
              type: 'whatsapp'
          },
          showcase: {
              enabled: showcaseEnabled,
              title: showcaseTitle,
              type: showcaseType
          },
          shareCard: {
              enabled: shareCardEnabled
          },
          customColors: {
            background: bgColor,
            button: btnColor,
            text: textColor
          }
        } 
      };
      await mockBackend.updateProfile(user.id, updatedProfile);

      const catObj = MARKETPLACE_CATEGORIES.find(c => c.id === selectedCategory);
      const categoryEnum = catObj?.enum || OfferCategory.SERVICOS_PROFISSIONAIS;
      
      const myOffers = await mockBackend.getMyOffers(user.id);
      const existingBioOffer = myOffers.find(o => o.description.includes("[BIO_MARKER]"));

      let tags = "[BIO_MARKER]";
      if (selectedCategory === 'mentorias') tags += " [MENTORIA]";

      const offerData = {
        title: profile.businessName || user.name,
        description: `${tags} ${profile.bio || 'Confira meu perfil profissional completo.'}`,
        category: categoryEnum,
        city: profile.city || 'Sua Cidade',
        imageUrl: profile.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`,
        logoUrl: profile.logoUrl,
        socialLinks: profile.socialLinks || {
            whatsapp: profile.phone || '',
            instagram: profile.socialLinks?.instagram || ''
        },
        price: 'Consultar',
        userId: user.id,
        scheduling: schedEnabled ? {
            enabled: true,
            durationMinutes: schedDuration,
            meetingType: schedType,
            googleCalendarConnected: calendarConnected
        } : undefined
      };

      if (existingBioOffer) {
        await mockBackend.updateOffer(user.id, existingBioOffer.id, offerData);
      } else {
        await mockBackend.createOffer(user.id, offerData);
      }

      setShowSuccess(true);
    } catch (err) {
      alert("Houve um erro ao publicar. Verifique sua conexão e tente novamente.");
    } finally { 
      setIsSaving(false); 
    }
  };

  const copyBioLink = () => {
    const url = `${window.location.origin}/#/store/${user?.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addLink = () => {
    setLinks([...links, { id: Date.now().toString(), type: 'custom', label: 'Novo Link', url: '', active: true }]);
  };

  const updateLink = (id: string, fields: Partial<BioLink>) => {
    setLinks(links.map(l => l.id === id ? { ...l, ...fields } : l));
  };

  const removeLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const applyTheme = (theme: typeof PRESET_THEMES[0]) => {
    setBgColor(theme.bg);
    setBtnColor(theme.btn);
    setTextColor(theme.text);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      if (editingProduct) {
        await mockBackend.createProduct({ ...editingProduct, ...productForm } as Product);
      } else {
        await mockBackend.createProduct({ ...productForm, userId: user.id } as Product);
      }
      setIsProductModalOpen(false);
      loadData(); // Recarrega produtos e perfil
    } finally { setIsSaving(false); }
  };

  const BioMockup = () => (
    <div className="relative mx-auto w-[310px] h-[630px] bg-black rounded-[3rem] border-[8px] border-zinc-800 shadow-2xl overflow-hidden group">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-2xl z-50"></div>
      <div 
        className={`w-full h-full overflow-y-auto scrollbar-hide flex flex-col items-center pt-12 pb-10 px-6 transition-all duration-500 ${fontFamily}`}
        style={{ 
          backgroundColor: bgColor, 
          color: textColor,
          backgroundImage: useMeshGradient ? `radial-gradient(at 0% 0%, ${btnColor}66 0px, transparent 50%), radial-gradient(at 100% 0%, ${btnColor}33 0px, transparent 50%), radial-gradient(at 50% 100%, ${btnColor}44 0px, transparent 50%)` : 'none'
        }}
      >
        <div className="w-20 h-20 rounded-full border-4 border-white/20 shadow-xl overflow-hidden mb-4 mt-4 flex-shrink-0 bg-white/10 flex items-center justify-center">
          {profile.logoUrl ? (
            <img src={profile.logoUrl} className="w-full h-full object-cover" alt="Me" />
          ) : (
            <UserIcon className="w-10 h-10 opacity-20" />
          )}
        </div>
        <h2 className="font-black text-lg text-center leading-tight mb-1">{profile.businessName || 'Seu Negócio'}</h2>
        <p className="text-[10px] opacity-80 text-center font-medium max-w-[200px] mb-8">{profile.bio || 'Bem-vindo ao meu perfil profissional.'}</p>
        
        {schedEnabled && (
           <div 
             className="w-full py-4 px-4 rounded-2xl text-center font-black text-[10px] shadow-xl mb-4 border border-white/10 animate-pulse flex items-center justify-center gap-2"
             style={{ backgroundColor: textColor, color: bgColor }}
           >
              <Calendar className="w-3.5 h-3.5" /> AGENDAR CONSULTA ({schedDuration}min)
           </div>
        )}

        <div className="w-full space-y-3 mb-8">
          {links.filter(l => l.active).map(link => (
            <div 
              key={link.id} 
              className="w-full py-3.5 px-4 rounded-2xl text-center font-black text-xs shadow-lg transform transition-all active:scale-95"
              style={{ backgroundColor: btnColor, color: textColor }}
            >
              {link.label}
            </div>
          ))}
        </div>

        {showcaseEnabled && (
            <div className="w-full mb-8">
                <p className="text-[11px] font-black text-white mb-4 text-center border-b border-brand-accent/30 pb-1 w-fit mx-auto">{showcaseTitle}</p>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x px-1">
                    {products.length > 0 ? products.map(prod => (
                        <div key={prod.id} 
                            className="min-w-[240px] rounded-[1.8rem] border-2 flex-shrink-0 snap-center overflow-hidden flex p-3 gap-3"
                            style={{ backgroundColor: btnColor + '33', borderColor: btnColor + '66' }}
                        >
                             <div className="w-20 h-20 rounded-2xl bg-zinc-900/20 flex-shrink-0 overflow-hidden border border-white/10">
                                {prod.imageUrl ? (
                                    <img src={prod.imageUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-white/10"><ImageIcon className="w-6 h-6" /></div>
                                )}
                             </div>
                             <div className="flex-1 flex flex-col justify-center text-left">
                                 <h5 className="text-[10px] font-black text-white uppercase italic leading-tight mb-1">{prod.name}</h5>
                                 <p className="text-[9px] font-bold uppercase tracking-tighter" style={{ color: textColor }}>Compre Aqui!</p>
                             </div>
                        </div>
                    )) : [1,2].map(i => (
                        <div key={i} 
                            className="min-w-[240px] rounded-[1.8rem] border-2 flex-shrink-0 snap-center overflow-hidden flex p-3 gap-3"
                            style={{ backgroundColor: btnColor + '33', borderColor: btnColor + '66' }}
                        >
                             <div className="w-20 h-20 rounded-2xl bg-zinc-900/20 flex-shrink-0 flex items-center justify-center text-white/10">
                                <ImageIcon className="w-6 h-6" />
                             </div>
                             <div className="flex-1 flex flex-col justify-center text-left">
                                 <div className="h-2 w-full bg-white/20 rounded-full mb-2"></div>
                                 <p className="text-[9px] font-bold uppercase tracking-tighter" style={{ color: textColor }}>Compre Aqui!</p>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {socialProof.length > 0 && (
          <div className="w-full space-y-3 mb-8">
            <p className="text-[8px] font-black uppercase tracking-widest opacity-50 text-center">O que dizem sobre nós</p>
            {socialProof.slice(0, 2).map(proof => (
              <div key={proof.id} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/5">
                <div className="flex text-yellow-400 gap-0.5 mb-1 scale-75 origin-left">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                </div>
                <p className="text-[9px] font-medium leading-relaxed opacity-90">"{proof.text.slice(0, 60)}..."</p>
                <p className="text-[8px] font-black mt-2 uppercase">{proof.author}</p>
              </div>
            ))}
          </div>
        )}

        {shareCardEnabled && (
            <div className="w-full mt-4 p-4 rounded-3xl border border-white/10 text-center space-y-4 shadow-xl"
                style={{ backgroundColor: btnColor + '44' }}
            >
                 <p className="text-[8px] font-black text-white uppercase italic tracking-tighter border-b border-white/10 pb-2">Código QR</p>
                 <div className="w-10 h-10 rounded-full border-2 border-white mx-auto overflow-hidden">
                    {profile.logoUrl && <img src={profile.logoUrl} className="w-full h-full object-cover" />}
                 </div>
                 <div className="p-2 bg-white rounded-xl w-24 h-24 mx-auto">
                    <QrCode className="w-full h-full text-black" />
                 </div>
            </div>
        )}

        <div className="mt-auto pt-8 flex items-center gap-1 opacity-40">
           <Zap className="w-3 h-3 fill-current" />
           <span className="text-[8px] font-black uppercase tracking-widest">Menu de Negócios</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-fade-in">
      <div className="bg-[#0F172A] rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/5 rounded-[1.8rem] flex items-center justify-center border border-white/10 shadow-inner">
               <Smartphone className="w-10 h-10 text-[#F67C01]" />
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
                BIO DIGITAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] dark:from-brand-primary dark:to-brand-accent">PRO</span>
              </h2>
              <p className="text-slate-400 text-xs font-black uppercase tracking-[0.25em] mt-2">Sua vitrine inteligente no bairro.</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-[2.5rem] p-1.5 mt-10 flex gap-1 overflow-x-auto scrollbar-hide border border-white/5">
          {[
            { id: 'home', label: 'INÍCIO', desc: 'Painel geral', icon: HomeIcon },
            { id: 'content', label: 'CONTEÚDO', desc: 'Links e bio', icon: AlignLeft },
            { id: 'social_proof', label: 'PROVA SOCIAL', desc: 'Depoimentos', icon: Star },
            { id: 'design', label: 'DESIGN', desc: 'Temas e cores', icon: PaletteIcon },
            { id: 'share', label: 'ATIVAR', desc: 'Sincronizar', icon: Share2 },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveEditorTab(tab.id as any)}
              className={`flex items-center gap-4 px-8 py-4 rounded-[1.8rem] transition-all min-w-[160px] ${activeEditorTab === tab.id ? 'bg-[#F67C01] text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}
            >
              <tab.icon className={`w-4 h-4 ${activeEditorTab === tab.id ? 'text-white' : 'text-[#F67C01]'}`} />
              <div className="text-left">
                <p className="font-black text-[10px] uppercase tracking-widest leading-none mb-1 italic">{tab.label}</p>
                <p className={`text-[8px] font-medium opacity-50 ${activeEditorTab === tab.id ? 'text-white' : ''}`}>{tab.desc}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <div className="pt-4 px-2">
        {activeEditorTab === 'home' ? (
          <SectionLanding 
            title="Sua presença profissional em um único link."
            subtitle="Cartão Digital Inteligente"
            description="Crie uma vitrine premium que reúne contatos, depoimentos e seu catálogo em uma interface elegante feita para converter."
            benefits={["Design mobile-first", "Integração direta com catálogo", "Bloco de depoimentos", "SEO Otimizado"]}
            youtubeId="dQw4w9WgXcQ"
            ctaLabel="TURBINAR MINHA BIO"
            onStart={() => setActiveEditorTab('content')}
            icon={Smartphone}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
               {activeEditorTab === 'content' && (
                  <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-10 animate-fade-in">
                     <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight flex items-center gap-2"><User className="text-indigo-600" /> Perfil Principal</h3>
                     <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6">
                           <div>
                              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Título da Bio</label>
                              <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={profile.businessName || ''} onChange={e => setProfile({...profile, businessName: e.target.value})} placeholder="Ex: Ana Doces Gourmet" />
                           </div>
                           <div>
                              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Texto de Destaque</label>
                              <textarea rows={3} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-medium text-sm dark:text-white resize-none" value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} placeholder="Breve descrição..." />
                           </div>
                        </div>
                        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-zinc-800/40 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-zinc-700">
                           <div className="w-24 h-24 rounded-full bg-white shadow-xl overflow-hidden border-4 border-white mb-4 relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                              {profile.logoUrl ? <img src={profile.logoUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300"><Camera className="w-8 h-8" /></div>}
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera className="w-6 h-6 text-white" /></div>
                           </div>
                           <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                        </div>
                     </div>

                     {/* Bloco de Vitrine de Itens */}
                     <div className="space-y-6 pt-10 border-t border-gray-100 dark:border-zinc-800">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight flex items-center gap-2"><LayoutGrid className="text-indigo-600" /> Vitrine de Itens</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Exiba seus itens do catálogo diretamente na Bio.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={showcaseEnabled} onChange={e => setShowcaseEnabled(e.target.checked)} className="sr-only peer" />
                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                        
                        {showcaseEnabled && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Título da Seção</label>
                                        <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={showcaseTitle} onChange={e => setShowcaseTitle(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Tipo de Exibição</label>
                                        <select className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={showcaseType} onChange={e => setShowcaseType(e.target.value as any)}>
                                            <option value="services">Nossos Serviços</option>
                                            <option value="products">Meus Produtos</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Seção de Gerenciamento de Itens */}
                                <div className="space-y-6 bg-gray-50 dark:bg-zinc-800/40 p-6 rounded-[2.5rem] border border-gray-100 dark:border-zinc-700">
                                   <div className="flex justify-between items-center">
                                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Itens da sua vitrine</h4>
                                      <button 
                                        onClick={() => { setEditingProduct(null); setProductForm({ name: '', description: '', price: 0, category: showcaseType === 'services' ? 'Serviços' : 'Produtos', available: true, imageUrl: '' }); setIsProductModalOpen(true); }}
                                        className="bg-[#F67C01] text-white px-6 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg flex items-center gap-2"
                                      >
                                        <Plus className="w-3.5 h-3.5" /> ADICIONAR ITEM
                                      </button>
                                   </div>

                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {products.length > 0 ? products.map(prod => (
                                         <div key={prod.id} className="p-4 bg-white dark:bg-zinc-900 rounded-[1.5rem] border flex items-center gap-4 group hover:shadow-md transition-all">
                                            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                                                {prod.imageUrl ? <img src={prod.imageUrl} className="w-full h-full object-cover" /> : <Package className="w-6 h-6 text-gray-300 m-3" />}
                                            </div>
                                            <div className="flex-1">
                                               <h5 className="font-black text-gray-900 dark:text-white text-xs line-clamp-1">{prod.name}</h5>
                                               <p className="text-[9px] font-black text-emerald-600">R$ {prod.price.toFixed(2)}</p>
                                            </div>
                                            <div className="flex gap-1">
                                               <button onClick={() => { setEditingProduct(prod); setProductForm(prod); setIsProductModalOpen(true); }} className="p-2 text-indigo-400 hover:bg-indigo-50 rounded-lg"><Edit2 className="w-3.5 h-3.5" /></button>
                                            </div>
                                         </div>
                                      )) : (
                                         <div className="col-span-full py-10 text-center opacity-40">
                                            <Package className="w-8 h-8 mx-auto mb-2" />
                                            <p className="text-[10px] font-black uppercase">Nenhum item cadastrado ainda.</p>
                                         </div>
                                      )}
                                   </div>
                                </div>
                            </div>
                        )}
                     </div>

                     <div className="space-y-6 pt-10 border-t border-gray-100 dark:border-zinc-800">
                        <div className="flex justify-between items-center">
                           <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight flex items-center gap-2"><Layout className="text-indigo-600" /> Botões e Links</h3>
                           <button onClick={addLink} className="bg-indigo-50 text-indigo-600 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest">ADICIONAR LINK</button>
                        </div>
                        <div className="space-y-4">
                           {links.map(link => (
                              <div key={link.id} className="p-6 bg-gray-50 dark:bg-zinc-800/40 rounded-[2rem] border border-gray-100 dark:border-zinc-800 flex gap-4 items-center group">
                                 <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl text-slate-300"><GripVertical className="w-5 h-5" /></div>
                                 <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" className="bg-white dark:bg-zinc-900 border-none rounded-xl p-4 text-xs font-bold" value={link.label} placeholder="Rótulo" onChange={e => updateLink(link.id, { label: e.target.value })} />
                                    <input type="text" className="bg-white dark:bg-zinc-900 border-none rounded-xl p-4 text-xs font-bold" value={link.url} placeholder="URL / Link" onChange={e => updateLink(link.id, { url: e.target.value })} />
                                 </div>
                                 <button onClick={() => removeLink(link.id)} className="p-3 text-rose-300 hover:text-rose-500"><Trash2 className="w-5 h-5" /></button>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               )}

               {activeEditorTab === 'social_proof' && (
                  <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-10 animate-fade-in">
                     <div className="flex justify-between items-center">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight flex items-center gap-2"><Star className="text-yellow-500 fill-current" /> Depoimentos de Clientes</h3>
                        <button onClick={() => setSocialProof([...socialProof, { id: Date.now().toString(), author: 'Nome do Cliente', text: 'Depoimento incrível...', stars: 5 }])} className="bg-indigo-50 text-indigo-600 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest">ADICIONAR PROVA</button>
                     </div>
                     <div className="space-y-6">
                        {socialProof.map(proof => (
                           <div key={proof.id} className="p-8 bg-gray-50 dark:bg-zinc-800/40 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 space-y-4">
                              <div className="flex justify-between">
                                 <input type="text" className="bg-transparent border-none font-black text-gray-900 dark:text-white p-0 text-sm w-full" value={proof.author} onChange={e => setSocialProof(socialProof.map(s => s.id === proof.id ? {...s, author: e.target.value} : s))} />
                                 <button onClick={() => setSocialProof(socialProof.filter(s => s.id !== proof.id))}><X className="w-4 h-4 text-rose-400" /></button>
                              </div>
                              <textarea className="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-4 text-xs font-medium resize-none" rows={2} value={proof.text} onChange={e => setSocialProof(socialProof.map(s => s.id === proof.id ? {...s, text: e.target.value} : s))} />
                           </div>
                        ))}
                        {socialProof.length === 0 && <div className="text-center py-20 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Nenhum depoimento adicionado.</div>}
                     </div>
                  </div>
               )}

               {activeEditorTab === 'design' && (
                  <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-12 animate-fade-in overflow-y-auto max-h-[800px] scrollbar-hide">
                     
                     {/* Share Card QR Code Toggle */}
                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight flex items-center gap-2"><QrCode className="text-brand-primary" /> Cartão QR Exclusivo</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Exiba um bloco de QR Code no rodapé da sua Bio para facilitar o compartilhamento.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={shareCardEnabled} onChange={e => setShareCardEnabled(e.target.checked)} className="sr-only peer" />
                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
                            </label>
                        </div>
                     </div>

                     <div className="h-px bg-gray-100 dark:bg-zinc-800 w-full"></div>

                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight flex items-center gap-2"><PaletteIcon className="text-brand-primary" /> Fundo Premium</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ative o efeito Mesh Gradient ultra-fluido.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={useMeshGradient} onChange={e => setUseMeshGradient(e.target.checked)} className="sr-only peer" />
                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
                            </label>
                        </div>
                     </div>

                     <div className="h-px bg-gray-100 dark:bg-zinc-800 w-full"></div>

                     <div className="space-y-6 bg-indigo-50/50 dark:bg-indigo-950/20 p-8 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-900/30">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-black text-indigo-900 dark:text-white uppercase italic tracking-tight flex items-center gap-2"><Calendar className="text-indigo-600" /> Agendamento</h3>
                                <p className="text-[10px] font-bold text-indigo-600/60 dark:text-indigo-400 uppercase tracking-widest mt-1">Permita que clientes reservem seu horário.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={schedEnabled} onChange={e => setSchedEnabled(e.target.checked)} className="sr-only peer" />
                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>

                        {schedEnabled && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-indigo-900/40 uppercase tracking-widest">Duração da Sessão</label>
                                        <select className="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-4 font-bold text-sm" value={schedDuration} onChange={e => setSchedDuration(Number(e.target.value))}>
                                            <option value={30}>30 Minutos</option>
                                            <option value={60}>1 Hora</option>
                                            <option value={90}>1h 30m</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-indigo-900/40 uppercase tracking-widest">Tipo de Reunião</label>
                                        <select className="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-4 font-bold text-sm" value={schedType} onChange={e => setSchedType(e.target.value as any)}>
                                            <option value="google_meet">Online (Meet)</option>
                                            <option value="in_person">Presencial</option>
                                        </select>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setCalendarConnected(!calendarConnected)} 
                                    className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${calendarConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-600 text-white shadow-xl'}`}
                                >
                                    {calendarConnected ? <><CheckCircle className="w-4 h-4" /> AGENDA CONECTADA</> : <><RefreshCw className="w-4 h-4" /> CONECTAR GOOGLE CALENDAR</>}
                                </button>
                            </div>
                        )}
                     </div>

                     <div className="h-px bg-gray-100 dark:bg-zinc-800 w-full"></div>

                     <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight flex items-center gap-2"><PaletteIcon className="text-brand-primary" /> Estilo Visual</h3>
                     <div className="space-y-8">
                        <div>
                           <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Temas Predefinidos</label>
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {PRESET_THEMES.map(t => (
                                 <button key={t.id} onClick={() => applyTheme(t)} className="p-4 rounded-2xl border-2 border-gray-100 dark:border-zinc-800 flex flex-col items-center gap-3 hover:border-brand-primary transition-all">
                                    <div className="w-full h-8 rounded-lg shadow-sm" style={{backgroundColor: t.bg}}></div>
                                    <span className="text-[8px] font-black uppercase">{t.label}</span>
                                 </button>
                              ))}
                           </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-4">
                              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Cores Personalizadas</label>
                              <div className="space-y-4">
                                 <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl gap-4">
                                    <div className="flex items-center gap-2 flex-1">
                                       <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Fundo</span>
                                       <div className="relative flex-1">
                                          <Hash className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                                          <input type="text" className="w-full bg-white dark:bg-zinc-900 pl-6 pr-2 py-1.5 rounded-lg text-[10px] font-mono border-none" value={bgColor.replace('#', '')} onChange={e => setBgColor('#' + e.target.value.replace(/[^A-Fa-f0-9]/g, '').slice(0, 6))} />
                                       </div>
                                    </div>
                                    <input type="color" className="w-8 h-8 rounded cursor-pointer border-none bg-transparent" value={bgColor} onChange={e => setBgColor(e.target.value)} />
                                 </div>
                                 <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl gap-4">
                                    <div className="flex items-center gap-2 flex-1">
                                       <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Botões</span>
                                       <div className="relative flex-1">
                                          <Hash className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                                          <input type="text" className="w-full bg-white dark:bg-zinc-900 pl-6 pr-2 py-1.5 rounded-lg text-[10px] font-mono border-none" value={btnColor.replace('#', '')} onChange={e => setBtnColor('#' + e.target.value.replace(/[^A-Fa-f0-9]/g, '').slice(0, 6))} />
                                       </div>
                                    </div>
                                    <input type="color" className="w-8 h-8 rounded cursor-pointer border-none bg-transparent" value={btnColor} onChange={e => setBtnColor(e.target.value)} />
                                 </div>
                                 <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl gap-4">
                                    <div className="flex items-center gap-2 flex-1">
                                       <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Texto</span>
                                       <div className="relative flex-1">
                                          <Hash className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                                          <input type="text" className="w-full bg-white dark:bg-zinc-900 pl-6 pr-2 py-1.5 rounded-lg text-[10px] font-mono border-none" value={textColor.replace('#', '')} onChange={e => setTextColor('#' + e.target.value.replace(/[^A-Fa-f0-9]/g, '').slice(0, 6))} />
                                       </div>
                                    </div>
                                    <input type="color" className="w-8 h-8 rounded cursor-pointer border-none bg-transparent" value={textColor} onChange={e => setTextColor(e.target.value)} />
                                 </div>
                              </div>
                           </div>
                           <div className="space-y-4">
                              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Tipografia</label>
                              <div className="grid gap-2">
                                 {FONTS.map(f => (
                                    <button key={f.id} onClick={() => setFontFamily(f.id)} className={`p-4 rounded-xl text-left text-sm border-2 transition-all ${fontFamily === f.id ? 'border-brand-primary bg-orange-50 dark:bg-orange-950/20 text-brand-primary' : 'border-gray-100 dark:border-zinc-800 text-gray-500'}`} style={{fontFamily: f.family}}>
                                       {f.label}
                                    </button>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {activeEditorTab === 'share' && (
                  <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-10 animate-fade-in">
                     <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight flex items-center gap-2"><Share2 className="text-indigo-600" /> Ativar e Sincronizar</h3>
                     <div className="space-y-8">
                        <div className="p-8 bg-gray-50 dark:bg-zinc-800 rounded-[2.5rem] border border-gray-100 dark:border-zinc-700 text-center space-y-8">
                           <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto shadow-sm text-indigo-600">
                              <Globe className="w-8 h-8" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Seu Link Público</p>
                              <p className="text-lg font-black text-gray-900 dark:text-white truncate">{window.location.origin}/#/store/{user?.id}</p>
                           </div>
                           <div className="flex flex-col sm:flex-row gap-4 justify-center">
                              <button onClick={copyBioLink} className={`px-8 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-md ${copied ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-zinc-800 text-indigo-600 border border-indigo-100 hover:bg-gray-50'}`}>
                                 {copied ? 'COPIADO!' : 'COPIAR LINK'}
                              </button>
                              <button 
                                 onClick={handleSave} 
                                 disabled={isSaving} 
                                 className="bg-[#F67C01] text-white px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                              >
                                 {isSaving ? <RefreshCw className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />} SALVAR E PUBLICAR
                              </button>
                           </div>
                           <p className="text-[9px] font-bold text-slate-400 uppercase max-w-xs mx-auto">Ao clicar em SALVAR E PUBLICAR, sua Bio será atualizada e aparecerá automaticamente na vitrine do Marketplace global.</p>
                        </div>
                     </div>
                  </div>
               )}
            </div>

            <div className="lg:col-span-5 hidden lg:block">
              <div className="sticky top-32">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Monitor className="w-4 h-4 text-slate-400" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Visualização em tempo real</span>
                </div>
                <BioMockup />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE SUCESSO PREMIUM */}
      {showSuccess && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-fade-in">
              <div className="relative bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden border border-white/5 animate-scale-in flex flex-col">
                  {/* Background Efeito */}
                  <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-emerald-500 to-indigo-600 opacity-20 blur-3xl pointer-events-none"></div>

                  <div className="p-10 md:p-16 text-center space-y-10 relative z-10">
                      <div className="w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto border border-emerald-500/20 animate-bounce">
                          <Sparkles className="w-12 h-12 text-emerald-500" />
                      </div>

                      <div className="space-y-4">
                          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none">
                              SUA VITRINE <br/><span className="text-emerald-500">ESTÁ NO AR!</span>
                          </h2>
                          <p className="text-slate-500 dark:text-zinc-400 font-medium text-lg">
                              Pronto! Seu link profissional já pode ser adicionado na bio do seu Instagram.
                          </p>
                      </div>

                      <div className="bg-gray-50 dark:bg-zinc-800/50 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 space-y-6">
                          <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Link da sua Bio</p>
                              <div className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-700 shadow-sm overflow-hidden">
                                  <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 truncate flex-1 text-left">
                                      {window.location.origin}/#/store/{user?.id}
                                  </span>
                                  <button onClick={copyBioLink} className={`p-3 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-zinc-800 text-slate-400 hover:bg-indigo-600 hover:text-white'}`}>
                                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                  </button>
                              </div>
                          </div>

                          <div className="flex flex-col md:flex-row gap-6 items-center">
                              <div className="p-4 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-xl border border-gray-100 dark:border-zinc-700">
                                  <QrCode className="w-24 h-24 text-gray-900 dark:text-white" />
                              </div>
                              <div className="text-left space-y-3">
                                  <h4 className="font-black text-sm uppercase italic text-gray-900 dark:text-white">QR Code Exclusivo</h4>
                                  <p className="text-xs text-slate-400 font-medium leading-relaxed">Imprima e coloque em seu balcão ou cartão de visitas para facilitar o acesso.</p>
                                  <button className="flex items-center gap-2 text-indigo-600 dark:text-brand-primary font-black text-[10px] uppercase tracking-widest hover:underline">
                                      <Download className="w-3.5 h-3.5" /> BAIXAR PARA IMPRIMIR
                                  </button>
                              </div>
                          </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                          <button 
                              onClick={() => setShowSuccess(false)}
                              className="flex-1 py-5 bg-gray-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest hover:bg-gray-200 transition-all"
                          >
                              VOLTAR AO EDITOR
                          </button>
                          <a 
                              href={`${window.location.origin}/#/store/${user?.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-5 bg-indigo-600 text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                          >
                              VER AO VIVO <ExternalLink className="w-4 h-4" />
                          </a>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Modal de Produto (Igual ao MyCatalog) */}
      {isProductModalOpen && (
         <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden border border-white/5 animate-scale-in">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                    <div><h3 className="text-2xl font-black uppercase italic tracking-tighter">{editingProduct ? 'Editar Item' : 'Novo Item na Bio'}</h3></div>
                    <button onClick={() => setIsProductModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                <form onSubmit={handleProductSubmit} className="p-10 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Título</label>
                            <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 font-bold dark:text-white" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Preço (R$)</label>
                            <input required type="number" step="0.01" className="w-full bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 font-bold dark:text-white" value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Categoria</label>
                            <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 font-bold dark:text-white" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} placeholder="Ex: Doce, Consultoria..." />
                          </div>
                       </div>
                       <div className="space-y-4">
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Foto do Item</label>
                          <div className="aspect-square bg-gray-50 dark:bg-zinc-800 rounded-[1.5rem] border-2 border-dashed border-gray-200 dark:border-zinc-700 relative overflow-hidden group cursor-pointer" onClick={() => productImgInputRef.current?.click()}>
                            {productForm.imageUrl ? (
                                <img src={productForm.imageUrl} className="w-full h-full object-cover" />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-300">
                                    <Camera className="w-8 h-8 mb-2" />
                                    <span className="text-[8px] font-black uppercase">Upload</span>
                                </div>
                            )}
                            <input type="file" ref={productImgInputRef} hidden accept="image/*" onChange={handleProductImageUpload} />
                          </div>
                       </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Descrição Curta</label>
                        <textarea rows={2} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-xl p-4 font-medium text-sm dark:text-white resize-none" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} placeholder="Breve resumo do item..." />
                    </div>
                    <button type="submit" disabled={isSaving} className="w-full bg-indigo-600 text-white font-black py-5 rounded-[2rem] shadow-xl uppercase text-sm hover:opacity-90 active:scale-95 transition-all">
                        {isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : 'SALVAR NO CATÁLOGO'}
                    </button>
                </form>
            </div>
         </div>
      )}
    </div>
  );
};

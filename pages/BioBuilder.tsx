
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
  Package, Hash, Link as LinkIcon, Globe2
} from 'lucide-react';
import { BioLink, BioConfig, Profile, SocialProof, OfferCategory, SchedulingConfig, Product, BioShowcaseItem } from '../types';
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
  { id: 'brand', label: 'Menu Oficial', bg: '#F8FAFC', btn: '#F67C01', text: '#0F172A' },
];

// Helper para redimensionar imagem para economizar localStorage
const resizeImage = (base64Str: string, maxWidth = 800, maxHeight = 800): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7)); // Comprime para JPEG 70%
    };
  });
};

export const BioBuilder: React.FC = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bioShowcaseImgInputRef = useRef<HTMLInputElement>(null);
  const [activeEditorTab, setActiveEditorTab] = useState<'home' | 'content' | 'social_proof' | 'design' | 'share'>('home');
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [links, setLinks] = useState<BioLink[]>([]);
  const [socialProof, setSocialProof] = useState<SocialProof[]>([]);
  const [bioShowcaseItems, setBioShowcaseItems] = useState<BioShowcaseItem[]>([]);
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

  const [ctaEnabled, setCtaEnabled] = useState(false);
  const [ctaLabel, setCtaLabel] = useState('Falar no WhatsApp');

  const [showcaseEnabled, setShowcaseEnabled] = useState(false);
  const [showcaseTitle, setShowcaseTitle] = useState('Destaques');
  const [shareCardEnabled, setShareCardEnabled] = useState(false);

  // Estados para Modal de Item da Vitrine da Bio
  const [isBioItemModalOpen, setIsBioItemModalOpen] = useState(false);
  const [editingBioItem, setEditingBioItem] = useState<BioShowcaseItem | null>(null);
  const [bioItemForm, setBioItemForm] = useState<Partial<BioShowcaseItem>>({ 
    name: '', price: 0, link: '', imageUrl: ''
  });

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    if (!user) return;
    try {
        const data = await mockBackend.getProfile(user.id);
        
        if (data) {
          setProfile(data);
          setLinks(data.bioConfig?.links || [
            { id: '1', type: 'whatsapp', label: 'WhatsApp Comercial', url: '', active: true },
            { id: '2', type: 'instagram', label: 'Siga no Instagram', url: '', active: true }
          ]);
          setSocialProof(data.bioConfig?.socialProof || []);
          setBioShowcaseItems(data.bioConfig?.showcase?.items || []);

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
              setShowcaseTitle(data.bioConfig.showcase.title || 'Destaques');
          }
          if (data.bioConfig?.shareCard) {
              setShareCardEnabled(data.bioConfig.shareCard.enabled);
          }
        }
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
        bioConfig: { 
          themeId: selectedCategory, 
          fontFamily: fontFamily as any, 
          links,
          socialProof,
          meshGradient: useMeshGradient,
          showcase: {
              enabled: showcaseEnabled,
              title: showcaseTitle,
              type: 'services' as "products" | "services",
              items: bioShowcaseItems
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
      setShowSuccess(true);
    } catch (err) {
      alert("Houve um erro ao publicar. Verifique sua conexão e tente novamente.");
    } finally { 
      setIsSaving(false); 
    }
  };

  const copyBioLink = () => {
    const identifier = profile.slug || user?.id;
    const url = `${window.location.origin}/#/bio/${identifier}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await resizeImage(reader.result as string, 400, 400);
        setProfile(prev => ({ ...prev, logoUrl: compressed }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBioItemImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const compressed = await resizeImage(reader.result as string, 600, 600);
        setBioItemForm(prev => ({ ...prev, imageUrl: compressed }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSlugChange = (val: string) => {
    const slugified = val.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/\s+/g, '-');
    setProfile(prev => ({ ...prev, slug: slugified }));
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

  const addSocialProof = () => {
    setSocialProof([...socialProof, { id: Date.now().toString(), author: 'Nome do Cliente', text: 'Depoimento incrível sobre o serviço.', stars: 5 }]);
  };

  const updateSocialProof = (id: string, fields: Partial<SocialProof>) => {
    setSocialProof(socialProof.map(s => s.id === id ? { ...s, ...fields } : s));
  };

  const removeSocialProof = (id: string) => {
    setSocialProof(socialProof.filter(s => s.id !== id));
  };

  const applyTheme = (theme: typeof PRESET_THEMES[0]) => {
    setBgColor(theme.bg);
    setBtnColor(theme.btn);
    setTextColor(theme.text);
  };

  const handleBioItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBioItem) {
        setBioShowcaseItems(prev => prev.map(item => item.id === editingBioItem.id ? { ...item, ...bioItemForm } as BioShowcaseItem : item));
    } else {
        setBioShowcaseItems(prev => [...prev, { ...bioItemForm, id: Date.now().toString() } as BioShowcaseItem]);
    }
    setIsBioItemModalOpen(false);
  };

  const removeBioItem = (id: string) => {
    setBioShowcaseItems(prev => prev.filter(i => i.id !== id));
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
             className="w-full max-w-sm py-4 px-4 rounded-2xl text-center font-black text-[10px] shadow-xl mb-4 border border-white/10 animate-pulse flex items-center justify-center gap-2"
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
                <p className="text-[11px] font-black text-white mb-4 text-center border-b border-brand-accent/30 pb-1 w-fit mx-auto uppercase tracking-widest">{showcaseTitle}</p>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x px-1">
                    {bioShowcaseItems.length > 0 ? bioShowcaseItems.map(item => (
                        <div key={item.id} 
                            className="min-w-[240px] rounded-[1.8rem] border-2 flex-shrink-0 snap-center overflow-hidden flex p-3 gap-3 shadow-xl"
                            style={{ backgroundColor: btnColor + '33', borderColor: btnColor + '66' }}
                        >
                             <div className="w-24 h-24 rounded-2xl bg-white/10 flex-shrink-0 overflow-hidden border border-white/10">
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-white/10"><ImageIcon className="w-6 h-6" /></div>
                                )}
                             </div>
                             <div className="flex-1 flex flex-col justify-center text-left">
                                 <h5 className="text-[10px] font-black text-white uppercase italic leading-tight mb-1 line-clamp-1">{item.name}</h5>
                                 <p className="text-[9px] font-bold uppercase tracking-tighter" style={{ color: textColor }}>Compre Aqui!</p>
                             </div>
                        </div>
                    )) : [1,2].map(i => (
                        <div key={i} 
                            className="min-w-[240px] rounded-[1.8rem] border-2 flex-shrink-0 snap-center overflow-hidden flex p-3 gap-3"
                            style={{ backgroundColor: btnColor + '33', borderColor: btnColor + '66' }}
                        >
                             <div className="w-24 h-24 rounded-2xl bg-white/10 flex-shrink-0 flex items-center justify-center text-white/10">
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
            <p className="text-[8px] font-black uppercase tracking-widest opacity-50 text-center">Depoimentos</p>
            {socialProof.slice(0, 2).map(proof => (
              <div key={proof.id} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-xl">
                <div className="flex text-yellow-400 gap-0.5 mb-1 scale-75 origin-left">
                  {[...Array(proof.stars)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
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
                BIO DIGITAL
              </h2>
              <p className="text-slate-400 text-xs font-black uppercase tracking-[0.25em] mt-2">Sua vitrine inteligente.</p>
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
                     
                     {/* URL ALIAS (SLUG) */}
                     <div className="bg-indigo-50 dark:bg-indigo-950/20 p-8 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-900/30 space-y-4">
                        <div className="flex items-center gap-3">
                           <Globe2 className="w-5 h-5 text-indigo-600" />
                           <h4 className="font-black text-sm text-indigo-900 dark:text-indigo-300 uppercase tracking-tight">URL Personalizada</h4>
                        </div>
                        <div className="flex flex-col md:flex-row gap-0 overflow-hidden rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 shadow-sm">
                           <div className="bg-white dark:bg-zinc-800 px-5 py-4 text-xs font-black text-slate-400 border-r border-indigo-100 dark:border-indigo-900 select-none flex items-center">
                              menudenegocios.com/
                           </div>
                           <input 
                              type="text" 
                              className="flex-1 bg-white dark:bg-zinc-900 px-5 py-4 font-black text-indigo-600 dark:text-indigo-400 placeholder:text-slate-300 outline-none"
                              placeholder="seu-nome"
                              value={profile.slug || ''}
                              onChange={e => handleSlugChange(e.target.value)}
                           />
                        </div>
                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest px-2">Este será o link curto para seu Cartão de Visitas Digital.</p>
                     </div>

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

                     {/* Vitrine de Itens */}
                     <div className="space-y-6 pt-10 border-t border-gray-100 dark:border-zinc-800">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight flex items-center gap-2"><LayoutGrid className="text-indigo-600" /> Vitrine da Bio</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Configure o carrossel exclusivo da sua Bio Link.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={showcaseEnabled} onChange={e => setShowcaseEnabled(e.target.checked)} className="sr-only peer" />
                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                        
                        {showcaseEnabled && (
                            <div className="space-y-8 animate-fade-in">
                                <div className="bg-gray-50 dark:bg-zinc-800/40 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-700">
                                    <div className="flex justify-between items-center mb-8">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Título da Seção</label>
                                            <input type="text" className="bg-white dark:bg-zinc-900 border-none rounded-2xl p-4 font-bold dark:text-white" value={showcaseTitle} onChange={e => setShowcaseTitle(e.target.value)} />
                                        </div>
                                        <button 
                                            onClick={() => { setEditingBioItem(null); setBioItemForm({ name: '', price: 0, link: '', imageUrl: '' }); setIsBioItemModalOpen(true); }}
                                            className="bg-[#F67C01] text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
                                        >
                                            <Plus className="w-5 h-5" /> CRIAR ITEM
                                        </button>
                                    </div>

                                    <div className="grid gap-4">
                                        {bioShowcaseItems.length > 0 ? bioShowcaseItems.map(item => (
                                            <div key={item.id} className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-700 flex items-center justify-between group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
                                                        {item.imageUrl && <img src={item.imageUrl} className="w-full h-full object-cover" />}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-xs text-gray-900 dark:text-white uppercase">{item.name}</h4>
                                                        <p className="text-[10px] font-black text-emerald-600">R$ {item.price.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => { setEditingBioItem(item); setBioItemForm(item); setIsBioItemModalOpen(true); }} className="p-2 text-indigo-400 hover:bg-indigo-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                                                    <button onClick={() => removeBioItem(item.id)} className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        )) : (
                                            <p className="text-center py-10 text-[10px] font-black uppercase text-slate-400 tracking-widest italic">Nenhum item na vitrine da Bio.</p>
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
                        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight flex items-center gap-2"><Star className="text-brand-primary" /> Prova Social</h3>
                        <button onClick={addSocialProof} className="bg-indigo-50 text-indigo-600 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest">ADICIONAR DEPOIMENTO</button>
                     </div>
                     
                     <div className="space-y-6">
                        {socialProof.length > 0 ? socialProof.map(proof => (
                           <div key={proof.id} className="p-8 bg-gray-50 dark:bg-zinc-800/40 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 space-y-6 group relative">
                              <button onClick={() => removeSocialProof(proof.id)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><X className="w-5 h-5" /></button>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Nome do Cliente</label>
                                    <input type="text" className="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-4 text-sm font-bold dark:text-white shadow-sm" value={proof.author} onChange={e => updateSocialProof(proof.id, { author: e.target.value })} />
                                 </div>
                                 <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Avaliação (1 a 5 estrelas)</label>
                                    <div className="flex gap-2 p-2 bg-white dark:bg-zinc-900 rounded-xl shadow-sm w-fit">
                                       {[1, 2, 3, 4, 5].map(star => (
                                          <button 
                                             key={star} 
                                             type="button" 
                                             onClick={() => updateSocialProof(proof.id, { stars: star })}
                                             className={`p-1 transition-all ${star <= proof.stars ? 'text-yellow-400' : 'text-slate-200'}`}
                                          >
                                             <Star className={`w-6 h-6 ${star <= proof.stars ? 'fill-current' : ''}`} />
                                          </button>
                                       ))}
                                    </div>
                                 </div>
                              </div>
                              <div>
                                 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">O que o cliente disse?</label>
                                 <textarea rows={3} className="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-4 text-sm font-medium dark:text-white shadow-sm resize-none" value={proof.text} onChange={e => updateSocialProof(proof.id, { text: e.target.value })} />
                              </div>
                           </div>
                        )) : (
                           <div className="py-20 text-center border-4 border-dashed border-gray-50 dark:border-zinc-800 rounded-[3rem]">
                              <Star className="w-12 h-12 text-slate-100 dark:text-zinc-800 mx-auto mb-4" />
                              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Nenhum depoimento cadastrado.</p>
                           </div>
                        )}
                     </div>
                  </div>
               )}

               {activeEditorTab === 'design' && (
                  <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-12 animate-fade-in overflow-y-auto max-h-[800px] scrollbar-hide">
                     <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight flex items-center gap-2"><PaletteIcon className="text-[#F67C01]" /> Identidade Visual</h3>
                     
                     <div className="space-y-8">
                        {/* Temas Rápidos */}
                        <div>
                           <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Sugestões de Temas</label>
                           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                              {PRESET_THEMES.map(theme => (
                                 <button 
                                    key={theme.id} 
                                    onClick={() => applyTheme(theme)}
                                    className="group flex flex-col items-center gap-3 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:border-brand-primary transition-all"
                                 >
                                    <div className="w-full aspect-square rounded-xl shadow-lg flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: theme.bg }}>
                                       <div className="w-3/4 h-3 rounded-full" style={{ backgroundColor: theme.btn }}></div>
                                       <div className="absolute top-0 right-0 w-8 h-8 bg-white/10 rounded-bl-full"></div>
                                    </div>
                                    <span className="text-[9px] font-black text-slate-500 uppercase text-center leading-tight">{theme.label}</span>
                                 </button>
                              ))}
                           </div>
                        </div>

                        {/* Cores Personalizadas */}
                        <div className="grid md:grid-cols-3 gap-8 pt-8 border-t border-gray-50 dark:border-zinc-800">
                           <div className="space-y-4">
                              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Fundo</label>
                              <div className="flex items-center gap-4 bg-gray-50 dark:bg-zinc-800 p-3 rounded-2xl">
                                 <input type="color" className="w-10 h-10 border-none bg-transparent cursor-pointer" value={bgColor} onChange={e => setBgColor(e.target.value)} />
                                 <span className="text-[10px] font-mono font-bold uppercase">{bgColor}</span>
                              </div>
                           </div>
                           <div className="space-y-4">
                              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Botões</label>
                              <div className="flex items-center gap-4 bg-gray-50 dark:bg-zinc-800 p-3 rounded-2xl">
                                 <input type="color" className="w-10 h-10 border-none bg-transparent cursor-pointer" value={btnColor} onChange={e => setBtnColor(e.target.value)} />
                                 <span className="text-[10px] font-mono font-bold uppercase">{btnColor}</span>
                              </div>
                           </div>
                           <div className="space-y-4">
                              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Textos</label>
                              <div className="flex items-center gap-4 bg-gray-50 dark:bg-zinc-800 p-3 rounded-2xl">
                                 <input type="color" className="w-10 h-10 border-none bg-transparent cursor-pointer" value={textColor} onChange={e => setTextColor(e.target.value)} />
                                 <span className="text-[10px] font-mono font-bold uppercase">{textColor}</span>
                              </div>
                           </div>
                        </div>

                        {/* Tipografia */}
                        <div className="pt-8 border-t border-gray-50 dark:border-zinc-800">
                           <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Estilo de Fonte</label>
                           <div className="grid md:grid-cols-2 gap-4">
                              {FONTS.map(font => (
                                 <button 
                                    key={font.id} 
                                    onClick={() => setFontFamily(font.family)}
                                    className={`p-6 rounded-2xl border text-left transition-all ${fontFamily === font.family ? 'border-brand-primary bg-orange-50 dark:bg-orange-950/20' : 'border-gray-100 dark:border-zinc-800'}`}
                                 >
                                    <h4 className={`text-xl font-bold ${font.family}`}>{font.label}</h4>
                                    <p className="text-[9px] text-slate-400 uppercase font-black mt-1">Abc 123 • Exemplo de Texto</p>
                                 </button>
                              ))}
                           </div>
                        </div>

                        {/* Componentes Extras & Efeitos Premium */}
                        <div className="pt-8 border-t border-gray-50 dark:border-zinc-800">
                           <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">Personalização Avançada</label>
                           <div className="grid gap-6">
                              {/* Fundo Premium */}
                              <div className="bg-gray-50 dark:bg-zinc-800/40 p-8 rounded-[2.5rem] flex items-center justify-between border border-gray-100 dark:border-zinc-700">
                                 <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-center text-indigo-600"><Sparkles className="w-6 h-6" /></div>
                                    <div>
                                       <h4 className="font-black text-sm uppercase italic tracking-tighter">Fundo Premium (Mesh Gradient)</h4>
                                       <p className="text-[10px] text-slate-400 font-bold uppercase max-w-xs">Ative o efeito de gradiente fluido para um visual de elite.</p>
                                    </div>
                                 </div>
                                 <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={useMeshGradient} onChange={e => setUseMeshGradient(e.target.checked)} className="sr-only peer" />
                                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-primary"></div>
                                 </label>
                              </div>

                              {/* Bloco QR Code */}
                              <div className="bg-gray-50 dark:bg-zinc-800/40 p-8 rounded-[2.5rem] flex items-center justify-between border border-gray-100 dark:border-zinc-700">
                                 <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-center text-[#F67C01]"><QrCode className="w-6 h-6" /></div>
                                    <div>
                                       <h4 className="font-black text-sm uppercase italic tracking-tighter">Bloco QR Code</h4>
                                       <p className="text-[10px] text-slate-400 font-bold uppercase max-w-xs">Exiba um código de acesso rápido no rodapé da sua Bio.</p>
                                    </div>
                                 </div>
                                 <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked={shareCardEnabled} onChange={e => setShareCardEnabled(e.target.checked)} className="sr-only peer" />
                                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-primary"></div>
                                 </label>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {activeEditorTab === 'share' && (
                  <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-10 animate-fade-in">
                     <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight flex items-center gap-2"><Share2 className="text-indigo-600" /> Ativar Bio Digital</h3>
                     <div className="space-y-8">
                        <div className="p-8 bg-gray-50 dark:bg-zinc-800 rounded-[2.5rem] border border-gray-100 dark:border-zinc-700 text-center space-y-8">
                           <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto shadow-sm text-indigo-600">
                              <Globe className="w-8 h-8" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Seu Link da Bio</p>
                              <p className="text-lg font-black text-gray-900 dark:text-white truncate">
                                 menudenegocios.com/{profile.slug || user?.id}
                              </p>
                           </div>
                           <div className="flex flex-col sm:flex-row gap-4 justify-center">
                              <button onClick={copyBioLink} className={`px-8 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-md ${copied ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-zinc-900 text-indigo-600 border border-indigo-100 hover:bg-gray-50'}`}>
                                 {copied ? 'COPIADO!' : 'COPIAR LINK DA BIO'}
                              </button>
                              <button 
                                 onClick={handleSave} 
                                 disabled={isSaving} 
                                 className="bg-[#F67C01] text-white px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                              >
                                 {isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : <Save className="w-5 h-5" />} SALVAR E PUBLICAR
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </div>

            <div className="lg:col-span-5 hidden lg:block">
              <div className="sticky top-32">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Monitor className="w-4 h-4 text-slate-400" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Prévia da Bio</span>
                </div>
                <BioMockup />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Item da Vitrine da Bio */}
      {isBioItemModalOpen && (
         <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden border border-white/5 animate-scale-in">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                    <div><h3 className="text-2xl font-black uppercase italic tracking-tighter">{editingBioItem ? 'Editar Item' : 'Novo Item na Bio'}</h3></div>
                    <button onClick={() => setIsBioItemModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                <form onSubmit={handleBioItemSubmit} className="p-10 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Título</label>
                            <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 font-bold dark:text-white" value={bioItemForm.name} onChange={e => setBioItemForm({...bioItemForm, name: e.target.value})} />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Preço (R$)</label>
                            <input required type="number" step="0.01" className="w-full bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 font-bold dark:text-white" value={bioItemForm.price} onChange={e => setBioItemForm({...bioItemForm, price: Number(e.target.value)})} />
                          </div>
                       </div>
                       <div className="space-y-4">
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Foto do Item</label>
                          <div className="aspect-square bg-gray-50 dark:bg-zinc-800 rounded-[1.5rem] border-2 border-dashed border-gray-200 dark:border-zinc-700 relative overflow-hidden group cursor-pointer" onClick={() => bioShowcaseImgInputRef.current?.click()}>
                            {bioItemForm.imageUrl ? (
                                <img src={bioItemForm.imageUrl} className="w-full h-full object-cover" />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-300">
                                    <Camera className="w-8 h-8 mb-2" />
                                    <span className="text-[8px] font-black uppercase">Upload</span>
                                </div>
                            )}
                            <input type="file" ref={bioShowcaseImgInputRef} hidden accept="image/*" onChange={handleBioItemImageUpload} />
                          </div>
                       </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1 flex items-center gap-2"><LinkIcon className="w-3 h-3" /> Link de Redirecionamento</label>
                        <input required type="url" className="w-full bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 font-bold dark:text-white" value={bioItemForm.link} onChange={e => setBioItemForm({...bioItemForm, link: e.target.value})} placeholder="https://wa.me/... ou https://loja.com/..." />
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-[2rem] shadow-xl uppercase text-sm hover:opacity-90 active:scale-95 transition-all">
                        SALVAR ITEM NA BIO
                    </button>
                </form>
            </div>
         </div>
      )}

      {/* MODAL DE SUCESSO */}
      {showSuccess && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-fade-in">
              <div className="relative bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-[3.5rem] shadow-2xl overflow-hidden border border-white/5 animate-scale-in flex flex-col">
                  <div className="p-10 md:p-16 text-center space-y-10 relative z-10">
                      <div className="w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto border border-emerald-500/20">
                          <Sparkles className="w-12 h-12 text-emerald-500" />
                      </div>
                      <div className="space-y-4">
                          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none">BIO DIGITAL <br/><span className="text-emerald-500">PRO ATIVADA!</span></h2>
                          <p className="text-slate-500 dark:text-zinc-400 font-medium text-lg">Use o link abaixo em seu Instagram para converter visitors.</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-3xl border border-gray-100 dark:border-zinc-800">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Link da sua Bio</p>
                          <div className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-700 shadow-sm overflow-hidden">
                              <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 truncate flex-1 text-left">menudenegocios.com/{profile.slug || user?.id}</span>
                              <button onClick={copyBioLink} className={`p-3 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-zinc-800 text-slate-400 hover:bg-indigo-600 hover:text-white'}`}>
                                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </button>
                          </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                          <button onClick={() => setShowSuccess(false)} className="flex-1 py-5 bg-gray-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest hover:bg-gray-200 transition-all">VOLTAR AO EDITOR</button>
                          <a href={`${window.location.origin}/#/bio/${profile.slug || user?.id}`} target="_blank" rel="noopener noreferrer" className="flex-1 py-5 bg-indigo-600 text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">VER AO VIVO <ExternalLink className="w-4 h-4" /></a>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

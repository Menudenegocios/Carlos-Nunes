
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
  Zap, MoreHorizontal, X, Send, Palette as PaletteIcon, Share2, Home as HomeIcon
} from 'lucide-react';
import { BioLink, BioConfig, Profile, SocialProof } from '../types';
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

export const BioBuilder: React.FC = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeEditorTab, setActiveEditorTab] = useState<'home' | 'content' | 'social_proof' | 'design' | 'share'>('home');
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [links, setLinks] = useState<BioLink[]>([]);
  const [socialProof, setSocialProof] = useState<SocialProof[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [bgColor, setBgColor] = useState('#064e3b');
  const [btnColor, setBtnColor] = useState('#059669');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontFamily, setFontFamily] = useState('font-sans');
  const [useMeshGradient, setUseMeshGradient] = useState(false);
  const [ctaEnabled, setCtaEnabled] = useState(false);
  const [qrCodeEnabled, setQrCodeEnabled] = useState(false);
  const [ctaLabel, setCtaLabel] = useState('Falar no WhatsApp');

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

          if (data.bioConfig?.customColors) {
            setBgColor(data.bioConfig.customColors.background || '#064e3b');
            setBtnColor(data.bioConfig.customColors.button || '#059669');
            setTextColor(data.bioConfig.customColors.text || '#ffffff');
          }
          if (data.bioConfig?.fontFamily) setFontFamily(data.bioConfig.fontFamily);
          if (data.bioConfig?.meshGradient) setUseMeshGradient(data.bioConfig.meshGradient);
          if (data.bioConfig?.floatingCTA) {
              setCtaEnabled(data.bioConfig.floatingCTA.enabled);
              setCtaLabel(data.bioConfig.floatingCTA.label);
          }
          setQrCodeEnabled(true); 
        }
    } catch (e) {
        console.error("Erro ao carregar dados da Bio:", e);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await mockBackend.updateProfile(user.id, { 
        ...profile,
        bioConfig: { 
          themeId: 'custom', 
          fontFamily: fontFamily as any, 
          links,
          socialProof,
          meshGradient: useMeshGradient,
          floatingCTA: {
              enabled: ctaEnabled,
              label: ctaLabel,
              type: 'whatsapp'
          },
          customColors: {
            background: bgColor,
            button: btnColor,
            text: textColor
          }
        } 
      });
      alert('Sua Bio Digital foi publicada com sucesso!');
    } finally { setIsSaving(false); }
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

  const addLink = () => {
    setLinks([...links, { id: Date.now().toString(), type: 'custom', label: 'Novo Link', url: '', active: true }]);
  };

  const removeLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const updateLink = (id: string, fields: Partial<BioLink>) => {
    setLinks(links.map(l => l.id === id ? { ...l, ...fields } : l));
  };

  const addSocialProof = () => {
    setSocialProof([...socialProof, { id: Date.now().toString(), author: 'Nome do Cliente', text: 'Depoimento incrível...', stars: 5 }]);
  };

  const applyTheme = (theme: typeof PRESET_THEMES[0]) => {
    setBgColor(theme.bg);
    setBtnColor(theme.btn);
    setTextColor(theme.text);
  };

  const copyBioLink = () => {
    const url = `${window.location.origin}/#/store/${user?.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const BioMockup = () => (
    <div className="relative mx-auto w-[310px] h-[630px] bg-black rounded-[3rem] border-[8px] border-zinc-800 shadow-2xl overflow-hidden group">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-2xl z-50"></div>
      <div 
        className={`w-full h-full overflow-y-auto scrollbar-hide flex flex-col items-center pt-12 pb-10 px-6 transition-all duration-500 ${fontFamily}`}
        style={{ 
          backgroundColor: bgColor, 
          color: textColor,
          backgroundImage: useMeshGradient ? `radial-gradient(at 0% 0%, ${btnColor}44 0px, transparent 50%), radial-gradient(at 100% 100%, ${btnColor}22 0px, transparent 50%)` : 'none'
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
        <div className="mt-auto pt-8 flex items-center gap-1 opacity-40">
           <Zap className="w-3 h-3 fill-current" />
           <span className="text-[8px] font-black uppercase tracking-widest">Menu de Negócios</span>
        </div>
        {ctaEnabled && (
          <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-emerald-500 shadow-2xl flex items-center justify-center text-white animate-bounce">
            <MessageCircle className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-fade-in">
      <div className="bg-[#0F172A] rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/5 rounded-[1.8rem] flex items-center justify-center border border-white/10 shadow-inner">
               <Smartphone className="w-10 h-10 text-[#F67C01]" />
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
                BIO DIGITAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#9333EA] to-pink-500">PRO</span>
              </h2>
              <p className="text-slate-400 text-xs font-black uppercase tracking-[0.25em] mt-2">TRANSFORME SUA PRESENÇA EM RESULTADO REAL.</p>
            </div>
          </div>
          <button onClick={handleSave} disabled={isSaving} className="bg-[#F67C01] text-white px-12 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_20px_50px_-10px_rgba(246,124,1,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
            {isSaving ? <RefreshCw className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />} PUBLICAR AGORA
          </button>
        </div>

        <div className="bg-white/5 rounded-[2.5rem] p-1.5 mt-10 flex gap-1 overflow-x-auto scrollbar-hide border border-white/5">
          {[
            { id: 'home', label: 'INÍCIO', desc: 'Painel geral', icon: HomeIcon },
            { id: 'content', label: 'CONTEÚDO', desc: 'Links e bio', icon: AlignLeft },
            { id: 'social_proof', label: 'PROVA SOCIAL', desc: 'Depoimentos', icon: Star },
            { id: 'design', label: 'DESIGN', desc: 'Temas e cores', icon: PaletteIcon },
            { id: 'share', label: 'ATIVAR', desc: 'Compartilhar', icon: Share2 },
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
                        <button onClick={addSocialProof} className="bg-indigo-50 text-indigo-600 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest">ADICIONAR PROVA</button>
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
                  <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-10 animate-fade-in">
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
                              <div className="space-y-3">
                                 <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl">
                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Fundo</span>
                                    <input type="color" className="w-8 h-8 rounded cursor-pointer" value={bgColor} onChange={e => setBgColor(e.target.value)} />
                                 </div>
                                 <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl">
                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Botões</span>
                                    <input type="color" className="w-8 h-8 rounded cursor-pointer" value={btnColor} onChange={e => setBtnColor(e.target.value)} />
                                 </div>
                                 <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800 rounded-xl">
                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Texto</span>
                                    <input type="color" className="w-8 h-8 rounded cursor-pointer" value={textColor} onChange={e => setTextColor(e.target.value)} />
                                 </div>
                              </div>
                           </div>
                           <div className="space-y-4">
                              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Tipografia</label>
                              <div className="grid gap-2">
                                 {FONTS.map(f => (
                                    <button key={f.id} onClick={() => setFontFamily(f.id)} className={`p-4 rounded-xl text-left text-sm border-2 transition-all ${fontFamily === f.id ? 'border-brand-primary bg-orange-50 dark:bg-orange-950/20 text-brand-primary' : 'border-gray-50 dark:border-zinc-800 text-gray-500'}`} style={{fontFamily: f.family}}>
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
                     <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight flex items-center gap-2"><Share2 className="text-indigo-600" /> Ativar e Compartilhar</h3>
                     <div className="space-y-8">
                        <div className="p-8 bg-gray-50 dark:bg-zinc-800 rounded-[2.5rem] border border-gray-100 dark:border-zinc-700 text-center space-y-4">
                           <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto shadow-sm text-indigo-600">
                              <Globe className="w-8 h-8" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Seu Link Público</p>
                              <p className="text-lg font-black text-gray-900 dark:text-white truncate">{window.location.origin}/#/store/{user?.id}</p>
                           </div>
                           <button onClick={copyBioLink} className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${copied ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'}`}>
                              {copied ? 'COPIADO!' : 'COPIAR LINK'}
                           </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                           <div className="p-8 bg-white dark:bg-zinc-800 rounded-[2.5rem] border border-gray-100 dark:border-zinc-700 flex flex-col items-center text-center space-y-4 shadow-sm">
                              <QrCode className="w-12 h-12 text-gray-900 dark:text-white" />
                              <h4 className="font-black text-sm uppercase italic">QR Code Personalizado</h4>
                              <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Download QR Code</button>
                           </div>
                           <div className="p-8 bg-white dark:bg-zinc-800 rounded-[2.5rem] border border-gray-100 dark:border-zinc-700 flex flex-col items-center text-center space-y-4 shadow-sm">
                              <ImageIcon className="w-12 h-12 text-gray-900 dark:text-white" />
                              <h4 className="font-black text-sm uppercase italic">Card para Instagram</h4>
                              <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Gerar Criativo IA</button>
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
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Visualização em tempo real</span>
                </div>
                <BioMockup />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

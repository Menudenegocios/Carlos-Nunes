
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { 
  Smartphone, Share2, Plus, Trash2, Layout, 
  Palette, Save, ExternalLink, Instagram, 
  MessageCircle, Globe, MapPin, Mail, Copy, Check,
  GripVertical, Type, Eye, Monitor,
  Image as ImageIcon, Star, QrCode, Download,
  CheckCircle, ArrowRight, Camera, RefreshCw,
  User as UserIcon, AlignLeft, Type as FontIcon,
  Palette as ColorIcon, Sliders, Sparkles
} from 'lucide-react';
import { BioLink, BioConfig, Profile } from '../types';

const FONTS = [
  { id: 'font-sans', label: 'Inter (Padrão)', family: 'font-sans' },
  { id: 'font-serif', label: 'Playfair (Elegante)', family: 'serif' },
  { id: 'font-mono', label: 'Roboto Mono (Tech)', family: 'monospace' },
  { id: 'font-display', label: 'Poppins (Moderno)', family: 'sans-serif' },
];

const PRESET_THEMES = [
  { id: 'dark', label: 'Deep Night', bg: '#0f172a', btn: '#1e293b', text: '#ffffff' },
  { id: 'indigo', label: 'Royal Blue', bg: '#312e81', btn: '#4338ca', text: '#ffffff' },
  { id: 'sunset', label: 'Sunset', bg: '#7c2d12', btn: '#9a3412', text: '#ffffff' },
  { id: 'minimal', label: 'Minimalist', bg: '#fcfcfd', btn: '#ffffff', text: '#0f172a' },
];

export const BioBuilder: React.FC = () => {
  const { user } = useAuth();
  const [activeEditorTab, setActiveEditorTab] = useState<'content' | 'design' | 'share'>('content');
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [links, setLinks] = useState<BioLink[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Custom Design State (WYSIWYG)
  const [bgColor, setBgColor] = useState('#0f172a');
  const [btnColor, setBtnColor] = useState('#1e293b');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontFamily, setFontFamily] = useState('font-sans');
  const [showQRCode, setShowQRCode] = useState(true);

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    if (!user) return;
    const data = await mockBackend.getProfile(user.id);
    if (data) {
      setProfile(data);
      setLinks(data.bioConfig?.links || [
        { id: '1', type: 'whatsapp', label: 'WhatsApp Comercial', url: '', active: true },
        { id: '2', type: 'instagram', label: 'Siga no Instagram', url: '', active: true }
      ]);
      if (data.bioConfig?.customColors) {
        setBgColor(data.bioConfig.customColors.background || '#0f172a');
        setBtnColor(data.bioConfig.customColors.button || '#1e293b');
        setTextColor(data.bioConfig.customColors.text || '#ffffff');
      }
      if (data.bioConfig?.fontFamily) {
        setFontFamily(data.bioConfig.fontFamily);
      }
    }
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
          customColors: {
            background: bgColor,
            button: btnColor,
            text: textColor
          }
        } 
      });
      alert('Seu Cartão de Visitas Digital foi atualizado com sucesso!');
    } finally { setIsSaving(false); }
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

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 pt-4 px-4">
      {/* Academy Style Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
                 <Smartphone className="h-10 w-10 text-purple-400" />
              </div>
              <div>
                 <h1 className="text-3xl md:text-5xl font-black tracking-tight">Estúdio Bio Digital</h1>
                 <p className="text-indigo-200 text-lg font-medium">Design imersivo e customização em tempo real.</p>
              </div>
            </div>
            
            <button onClick={handleSave} className="bg-white text-indigo-900 px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Publicar Alterações
            </button>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
         
         {/* EDITOR SIDEBAR (LEFT) */}
         <div className="lg:col-span-6 space-y-8 animate-in slide-in-from-left duration-700">
            
            {/* Editor Navigation */}
            <div className="flex p-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                <button onClick={() => setActiveEditorTab('content')} className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.4rem] font-black text-xs tracking-widest transition-all ${activeEditorTab === 'content' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-400 hover:bg-gray-50'}`}>
                    <AlignLeft className="w-4 h-4" /> CONTEÚDO
                </button>
                <button onClick={() => setActiveEditorTab('design')} className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.4rem] font-black text-xs tracking-widest transition-all ${activeEditorTab === 'design' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-400 hover:bg-gray-50'}`}>
                    <Palette className="w-4 h-4" /> DESIGN
                </button>
                <button onClick={() => setActiveEditorTab('share')} className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.4rem] font-black text-xs tracking-widest transition-all ${activeEditorTab === 'share' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-400 hover:bg-gray-50'}`}>
                    <Share2 className="w-4 h-4" /> COMPARTILHAR
                </button>
            </div>

            {/* Content Tab */}
            {activeEditorTab === 'content' && (
                <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl space-y-10 animate-fade-in">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-[2.5rem] bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center relative shadow-sm group-hover:border-indigo-400 transition-colors">
                                {profile.logoUrl ? <img src={profile.logoUrl} className="w-full h-full object-cover" /> : <UserIcon className="w-12 h-12 text-gray-300" />}
                                <label className="absolute inset-0 bg-indigo-900/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                    <Camera className="w-6 h-6 mb-1" />
                                    <span className="text-[10px] font-black uppercase">Alterar</span>
                                    <input type="file" hidden onChange={handleImageUpload} />
                                </label>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4 w-full">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Nome de Exibição</label>
                                <input type="text" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold focus:ring-2 focus:ring-indigo-100 transition-all" value={profile.businessName || ''} onChange={e => setProfile({...profile, businessName: e.target.value})} placeholder="Seu nome profissional" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Biografia Curta</label>
                                <textarea rows={2} className="w-full bg-gray-50 border-none rounded-2xl p-4 font-medium text-sm focus:ring-2 focus:ring-indigo-100 resize-none transition-all" value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} placeholder="O que você faz?" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 pt-8 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Meus Links</h4>
                            <button onClick={() => setLinks([...links, {id: Date.now().toString(), type: 'custom', label: 'Novo Link', url: '', active: true}])} className="text-indigo-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all">
                                <Plus className="w-4 h-4" /> Adicionar
                            </button>
                        </div>
                        <div className="space-y-4">
                            {links.map((link, idx) => (
                                <div key={link.id} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center gap-4 group">
                                    <GripVertical className="text-gray-300 w-5 h-5 cursor-grab" />
                                    <div className="flex-1 space-y-2">
                                        <input type="text" className="bg-transparent border-none p-0 font-bold text-gray-900 text-sm focus:ring-0 w-full" value={link.label} onChange={e => {
                                            const newLinks = [...links];
                                            newLinks[idx].label = e.target.value;
                                            setLinks(newLinks);
                                        }} />
                                        <input type="text" className="bg-transparent border-none p-0 text-gray-400 text-xs focus:ring-0 w-full" value={link.url} placeholder="https://..." onChange={e => {
                                            const newLinks = [...links];
                                            newLinks[idx].url = e.target.value;
                                            setLinks(newLinks);
                                        }} />
                                    </div>
                                    <button onClick={() => setLinks(links.filter(l => l.id !== link.id))} className="p-3 text-gray-300 hover:text-rose-500 transition-colors bg-white rounded-xl shadow-sm"><Trash2 className="w-5 h-5" /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Design Tab */}
            {activeEditorTab === 'design' && (
                <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl space-y-10 animate-fade-in">
                    <div>
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <ColorIcon className="w-4 h-4 text-indigo-600" /> Cores do Template
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                            {PRESET_THEMES.map(theme => (
                                <button key={theme.id} onClick={() => applyTheme(theme)} className="group p-2 bg-gray-50 rounded-2xl border border-gray-200 hover:border-indigo-400 transition-all text-center">
                                    <div className="w-full aspect-square rounded-xl mb-2 flex flex-col" style={{ background: theme.bg }}>
                                        <div className="m-auto w-1/2 h-2 rounded-full" style={{ background: theme.btn }}></div>
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-gray-400 group-hover:text-indigo-600">{theme.label}</span>
                                </button>
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Fundo</label>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                    <input type="color" className="w-10 h-10 rounded-lg overflow-hidden border-none p-0 bg-transparent cursor-pointer" value={bgColor} onChange={e => setBgColor(e.target.value)} />
                                    <span className="text-xs font-mono font-bold uppercase">{bgColor}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Botões</label>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                    <input type="color" className="w-10 h-10 rounded-lg overflow-hidden border-none p-0 bg-transparent cursor-pointer" value={btnColor} onChange={e => setBtnColor(e.target.value)} />
                                    <span className="text-xs font-mono font-bold uppercase">{btnColor}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Textos</label>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                    <input type="color" className="w-10 h-10 rounded-lg overflow-hidden border-none p-0 bg-transparent cursor-pointer" value={textColor} onChange={e => setTextColor(e.target.value)} />
                                    <span className="text-xs font-mono font-bold uppercase">{textColor}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-100">
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <FontIcon className="w-4 h-4 text-indigo-600" /> Fontes e Tipografia
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {FONTS.map(font => (
                                <button key={font.id} onClick={() => setFontFamily(font.id)} className={`p-5 rounded-2xl border transition-all text-left group ${fontFamily === font.id ? 'bg-indigo-600 border-indigo-600 shadow-lg' : 'bg-gray-50 border-gray-200 hover:border-indigo-400'}`}>
                                    <span className={`text-sm font-bold block ${fontFamily === font.id ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: font.family }}>{font.label}</span>
                                    <span className={`text-[10px] font-medium block mt-1 ${fontFamily === font.id ? 'text-indigo-100' : 'text-gray-400'}`}>Visualização rápida da fonte</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-100">
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Sliders className="w-4 h-4 text-indigo-600" /> Extras e QR Code
                        </h4>
                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                            <div>
                                <span className="text-sm font-black text-gray-900 block">Exibir QR Code</span>
                                <span className="text-xs text-gray-400 font-medium">Ativa um código escaneável automático na sua Bio</span>
                            </div>
                            <button onClick={() => setShowQRCode(!showQRCode)} className={`w-14 h-8 rounded-full transition-all relative ${showQRCode ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${showQRCode ? 'right-1' : 'left-1'}`}></div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Share Tab */}
            {activeEditorTab === 'share' && (
                <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl space-y-10 animate-fade-in">
                    <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="relative z-10 space-y-6 max-w-md">
                            <div>
                                <h4 className="text-xl font-black mb-2">Sua Bio está Online!</h4>
                                <p className="text-indigo-200 text-sm font-medium leading-relaxed">Use este link na sua biografia do Instagram ou gere seu QR Code para impressão.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button onClick={copyBioLink} className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${copied ? 'bg-emerald-500' : 'bg-white/10 hover:bg-white/20'}`}>
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? 'Copiado' : 'Copiar Link'}
                                </button>
                                <button className="flex-1 py-4 bg-white text-indigo-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-gray-100">
                                    <Download className="w-4 h-4" /> QR Code
                                </button>
                            </div>
                        </div>
                        <div className="relative z-10 p-4 bg-white rounded-3xl shadow-2xl">
                            <div className="w-32 h-32 flex items-center justify-center text-gray-900">
                                <QrCode className="w-24 h-24" />
                            </div>
                        </div>
                        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4"><Instagram className="text-pink-600" /></div>
                            <h5 className="font-black text-gray-900 mb-2">No Instagram</h5>
                            <p className="text-xs text-gray-400 font-medium leading-relaxed">Adicione o link copiado no campo "Site" das configurações do seu perfil para atrair leads qualificados.</p>
                        </div>
                        <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4"><CheckCircle className="text-emerald-500" /></div>
                            <h5 className="font-black text-gray-900 mb-2">Fidelização</h5>
                            <p className="text-xs text-gray-400 font-medium leading-relaxed">Imprima seu QR Code em cartões, banners ou mesas para facilitar o acesso à sua vitrine digital.</p>
                        </div>
                    </div>
                </div>
            )}
         </div>

         {/* PREMIUM LIVE PREVIEW (RIGHT) */}
         <div className="lg:col-span-6 flex justify-center lg:sticky lg:top-24 h-fit animate-in zoom-in duration-700 delay-200">
            <div className="flex flex-col items-center gap-8 w-full max-w-md">
                
                {/* Visual Feedback Label */}
                <div className="flex items-center gap-2 px-6 py-2.5 bg-gray-900/5 backdrop-blur-xl border border-gray-200 text-gray-900 dark:text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                    <Sparkles className="w-3 h-3 text-indigo-600 animate-pulse" />
                    Preview Hi-Fi em tempo real
                </div>

                {/* Device Container with Studio Lighting */}
                <div className="relative group">
                    {/* Shadow & Glow Background */}
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-[4.5rem] blur-[60px] opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    
                    {/* Phone Body (Titanium/Slate Premium Frame) - DIMENSIONS REDUCED */}
                    <div className="relative w-[320px] h-[660px] bg-slate-950 rounded-[4.5rem] p-3 border-[12px] border-slate-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] ring-1 ring-white/10 overflow-hidden">
                        
                        {/* Realistic Glass Reflect */}
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-50"></div>
                        
                        {/* Dynamic Island / Camera Notch */}
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-50 flex items-center justify-end px-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40"></div>
                        </div>

                        {/* Phone Inner Screen Content - PADDING ADJUSTED */}
                        <div 
                            className={`w-full h-full rounded-[3.5rem] flex flex-col items-center pt-16 px-6 text-center overflow-y-auto scrollbar-hide transition-all duration-700 ease-in-out`}
                            style={{ 
                                background: bgColor, 
                                color: textColor, 
                                fontFamily: fontFamily === 'font-sans' ? 'Inter' : fontFamily === 'font-serif' ? 'serif' : fontFamily === 'font-mono' ? 'monospace' : 'Poppins' 
                            }}
                        >
                            {/* Profile Header Image - SIZE ADJUSTED */}
                            <div className="relative mb-6">
                                <div className="w-24 h-24 rounded-[2.5rem] border-[6px] border-white/5 shadow-2xl overflow-hidden flex items-center justify-center bg-white/5 backdrop-blur-md transition-transform hover:scale-105 duration-500">
                                    {profile.logoUrl ? (
                                        <img src={profile.logoUrl} className="w-full h-full object-cover" />
                                    ) : (
                                        <UserIcon className="w-12 h-12 opacity-10" />
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1.5 rounded-xl shadow-lg border-2 border-slate-900">
                                   <Check className="w-3 h-3" />
                                </div>
                            </div>

                            {/* Info */}
                            <h4 className="font-black text-xl mb-2 leading-tight tracking-tight">{profile.businessName || user?.name}</h4>
                            <p className="text-[11px] opacity-60 font-medium leading-relaxed mb-8 px-4 max-w-[240px] mx-auto">
                                {profile.bio || 'Adicione uma biografia impactante para converter seus seguidores do Instagram.'}
                            </p>
                            
                            {/* Premium Links Preview */}
                            <div className="w-full space-y-3 pb-6">
                                {links.map(l => (
                                    <div 
                                        key={l.id} 
                                        className="w-full py-3.5 px-6 rounded-[1.4rem] border border-white/10 font-bold text-sm tracking-tight transition-all shadow-[0_10px_20px_-10px_rgba(0,0,0,0.3)] flex items-center justify-between group/link cursor-pointer hover:-translate-y-1 active:scale-95"
                                        style={{ background: btnColor }}
                                    >
                                        <span className="flex-1 text-center">{l.label}</span>
                                        <ExternalLink className="w-3 h-3 opacity-20 group-hover/link:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                                {links.length === 0 && (
                                    <div className="py-12 text-gray-500/20 flex flex-col items-center gap-3">
                                        <Plus className="w-8 h-8" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Nenhum Link Ativo</span>
                                    </div>
                                )}
                            </div>

                            {/* Premium QR Code Section */}
                            {showQRCode && (
                                <div className="mt-2 mb-8 p-4 bg-white rounded-[2.5rem] shadow-2xl animate-in zoom-in duration-500 ring-4 ring-black/5">
                                    <QrCode className="w-24 h-24 text-gray-950" />
                                    <p className="text-[8px] font-black text-gray-400 mt-2 uppercase tracking-[0.2em]">Escaneie via Câmera</p>
                                </div>
                            )}

                            {/* Brand Footer */}
                            <div className="mt-auto pb-10 flex flex-col items-center gap-3">
                                <div className="w-10 h-1 rounded-full bg-white/10 mb-2"></div>
                                <div className="flex items-center gap-2 grayscale opacity-40">
                                   <div className="p-1.5 rounded-lg bg-white/10">
                                      <Monitor className="w-3.5 h-3.5" />
                                   </div>
                                   <span className="text-[9px] font-black tracking-[0.3em] uppercase">Menu ADS</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Device Interaction Tips */}
                <div className="flex justify-center gap-6">
                   <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                      <Layout className="w-3.5 h-3.5" /> Desktop
                   </div>
                   <div className="flex items-center gap-2 text-indigo-600 text-[10px] font-black uppercase tracking-widest bg-indigo-50 p-3 rounded-2xl shadow-sm border border-indigo-100">
                      <Smartphone className="w-3.5 h-3.5" /> Mobile Ready
                   </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

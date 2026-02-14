
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
  Palette as ColorIcon, Sliders, Sparkles, HelpCircle, Home as HomeIcon,
  MousePointer2, UserPlus, Quote
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
  { id: 'dark', label: 'Deep Night', bg: '#0f172a', btn: '#1e293b', text: '#ffffff' },
  { id: 'indigo', label: 'Royal Blue', bg: '#312e81', btn: '#4338ca', text: '#ffffff' },
  { id: 'sunset', label: 'Sunset', bg: '#7c2d12', btn: '#9a3412', text: '#ffffff' },
  { id: 'minimal', label: 'Minimalist', bg: '#fcfcfd', btn: '#ffffff', text: '#0f172a' },
];

export const BioBuilder: React.FC = () => {
  const { user } = useAuth();
  const [activeEditorTab, setActiveEditorTab] = useState<'home' | 'content' | 'social_proof' | 'design' | 'share'>('home');
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [links, setLinks] = useState<BioLink[]>([]);
  const [socialProof, setSocialProof] = useState<SocialProof[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [bgColor, setBgColor] = useState('#0f172a');
  const [btnColor, setBtnColor] = useState('#1e293b');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontFamily, setFontFamily] = useState('font-sans');
  const [useMeshGradient, setUseMeshGradient] = useState(false);
  const [ctaEnabled, setCtaEnabled] = useState(false);
  const [ctaLabel, setCtaLabel] = useState('Falar no WhatsApp');

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
      setSocialProof(data.bioConfig?.socialProof || []);
      if (data.bioConfig?.customColors) {
        setBgColor(data.bioConfig.customColors.background || '#0f172a');
        setBtnColor(data.bioConfig.customColors.button || '#1e293b');
        setTextColor(data.bioConfig.customColors.text || '#ffffff');
      }
      if (data.bioConfig?.fontFamily) setFontFamily(data.bioConfig.fontFamily);
      if (data.bioConfig?.meshGradient) setUseMeshGradient(data.bioConfig.meshGradient);
      if (data.bioConfig?.floatingCTA) {
          setCtaEnabled(data.bioConfig.floatingCTA.enabled);
          setCtaLabel(data.bioConfig.floatingCTA.label);
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
      alert('Seu Cartão de Visitas Digital foi atualizado com sucesso!');
    } finally { setIsSaving(false); }
  };

  const addSocialProof = () => {
      setSocialProof([...socialProof, { id: Date.now().toString(), author: 'Nome do Cliente', text: 'Melhor serviço da região!', stars: 5 }]);
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
                 <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none mb-1">Bio Digital Pro</h1>
                 <p className="text-indigo-200 text-lg font-medium opacity-80 uppercase tracking-widest text-xs">A vitrine do seu negócio no digital.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button onClick={handleSave} className="bg-brand-primary text-white px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-brand-primary/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Publicar Agora
              </button>
            </div>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      <div className="flex justify-center">
        <div className="flex p-2 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-2xl max-w-fit mx-auto overflow-x-auto scrollbar-hide gap-1 md:gap-3">
            {[
                { id: 'home', label: 'INÍCIO', icon: HomeIcon },
                { id: 'content', label: 'CONTEÚDO', icon: AlignLeft },
                { id: 'social_proof', label: 'PROVA SOCIAL', icon: Quote },
                { id: 'design', label: 'DESIGN', icon: Palette },
                { id: 'share', label: 'ATIVAR', icon: Share2 }
            ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveEditorTab(tab.id as any)} 
                  className={`flex items-center justify-center gap-3 px-6 py-4 rounded-[1.8rem] font-black text-[10px] tracking-widest transition-all whitespace-nowrap ${activeEditorTab === tab.id ? 'bg-indigo-600 text-white shadow-xl scale-105' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
                >
                    <tab.icon className="w-4 h-4" /> <span className="hidden sm:inline">{tab.label}</span>
                </button>
            ))}
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
         {activeEditorTab === 'home' && (
            <SectionLanding 
                title="Sua Presença Profissional em um Único Link."
                subtitle="Cartão Digital de Elite"
                description="Esqueça links sem graça. Crie uma vitrine premium que reúne contatos, depoimentos de clientes e um design impactante. Tudo o que seu negócio precisa para converter visitantes em clientes reais."
                benefits={[
                "Design Mobile-First focado em alta performance.",
                "Efeitos visuais Premium (Gradients Dinâmicos).",
                "Bloco de Prova Social para gerar autoridade.",
                "Botão flutuante de agendamento ou contato direto.",
                "Instalação automática de QR Code em segundos."
                ]}
                youtubeId="dQw4w9WgXcQ"
                ctaLabel="TURBINAR MINHA BIO"
                onStart={() => setActiveEditorTab('content')}
                icon={Smartphone}
                accentColor="indigo"
            />
         )}

         {activeEditorTab !== 'home' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start px-4">
                
                {/* EDITOR COLUMN */}
                <div className="lg:col-span-7 space-y-8">
                    
                    {activeEditorTab === 'content' && (
                        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-xl space-y-10 animate-fade-in">
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-[2.5rem] bg-gray-50 dark:bg-zinc-800 border-2 border-dashed border-gray-200 dark:border-zinc-700 overflow-hidden flex items-center justify-center relative shadow-sm group-hover:border-brand-primary transition-colors">
                                        {profile.logoUrl ? <img src={profile.logoUrl} className="w-full h-full object-cover" /> : <UserIcon className="w-12 h-12 text-gray-300" />}
                                        <label className="absolute inset-0 bg-brand-primary/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                            <Camera className="w-6 h-6 mb-1" />
                                            <span className="text-[10px] font-black uppercase">Alterar</span>
                                            <input type="file" hidden onChange={handleImageUpload} />
                                        </label>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4 w-full">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Seu Nome / Marca</label>
                                        <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold focus:ring-2 focus:ring-brand-primary/10 transition-all dark:text-white" value={profile.businessName || ''} onChange={e => setProfile({...profile, businessName: e.target.value})} placeholder="Ex: João da Silva" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Sua Bio (Frase curta)</label>
                                        <textarea rows={2} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-medium text-sm focus:ring-2 focus:ring-brand-primary/10 resize-none transition-all dark:text-white" value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} placeholder="Especialista em..." />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 pt-8 border-t border-gray-100 dark:border-zinc-800">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Botões & Links</h4>
                                    <button onClick={() => setLinks([...links, {id: Date.now().toString(), type: 'custom', label: 'Novo Link', url: '', active: true}])} className="text-brand-primary font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-brand-primary/5 dark:hover:bg-brand-primary/10 px-4 py-2 rounded-xl transition-all">
                                        <Plus className="w-4 h-4" /> ADICIONAR
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {links.map((link, idx) => (
                                        <div key={link.id} className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-[2rem] border border-gray-100 dark:border-zinc-700 flex items-center gap-4 group hover:border-brand-primary/20 transition-all">
                                            <GripVertical className="text-gray-300 w-5 h-5 cursor-grab" />
                                            <div className="flex-1 space-y-2">
                                                <input type="text" className="bg-transparent border-none p-0 font-bold text-gray-900 dark:text-white text-sm focus:ring-0 w-full" value={link.label} onChange={e => {
                                                    const newLinks = [...links];
                                                    newLinks[idx].label = e.target.value;
                                                    setLinks(newLinks);
                                                }} />
                                                <input type="text" className="bg-transparent border-none p-0 text-gray-400 text-[10px] font-black focus:ring-0 w-full uppercase tracking-wider" value={link.url} placeholder="HTTPS://..." onChange={e => {
                                                    const newLinks = [...links];
                                                    newLinks[idx].url = e.target.value;
                                                    setLinks(newLinks);
                                                }} />
                                            </div>
                                            <button onClick={() => setLinks(links.filter(l => l.id !== link.id))} className="p-3 text-gray-300 hover:text-rose-500 transition-colors bg-white dark:bg-zinc-700 rounded-xl shadow-sm"><Trash2 className="w-5 h-5" /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeEditorTab === 'social_proof' && (
                        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-xl space-y-10 animate-fade-in">
                            <div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-3"><Quote className="text-brand-primary" /> Prova Social</h3>
                                <p className="text-xs text-gray-400 font-bold mt-2 leading-relaxed">Adicione depoimentos reais para aumentar a confiança de quem visita seu perfil.</p>
                            </div>

                            <div className="space-y-4">
                                {socialProof.map((sp, idx) => (
                                    <div key={sp.id} className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-[2rem] border border-gray-100 dark:border-zinc-700 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex text-yellow-500">
                                                {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-current" />)}
                                            </div>
                                            <button onClick={() => setSocialProof(socialProof.filter(i => i.id !== sp.id))} className="text-gray-300 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                        <input 
                                            className="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-3 text-sm font-bold dark:text-white"
                                            value={sp.author}
                                            placeholder="Nome do Cliente"
                                            onChange={e => {
                                                const newSp = [...socialProof];
                                                newSp[idx].author = e.target.value;
                                                setSocialProof(newSp);
                                            }}
                                        />
                                        <textarea 
                                            className="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-3 text-xs font-medium dark:text-gray-400 resize-none"
                                            rows={2}
                                            value={sp.text}
                                            placeholder="Depoimento do cliente..."
                                            onChange={e => {
                                                const newSp = [...socialProof];
                                                newSp[idx].text = e.target.value;
                                                setSocialProof(newSp);
                                            }}
                                        />
                                    </div>
                                ))}
                                <button onClick={addSocialProof} className="w-full py-6 border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-[2rem] text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-brand-primary hover:text-brand-primary transition-all flex items-center justify-center gap-2">
                                    <Plus className="w-5 h-5" /> Adicionar Avaliação
                                </button>
                            </div>
                        </div>
                    )}

                    {activeEditorTab === 'design' && (
                        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-xl space-y-12 animate-fade-in">
                            <section>
                                <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <ColorIcon className="w-4 h-4 text-brand-primary" /> Estilo de Fundo
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    {PRESET_THEMES.map(theme => (
                                        <button key={theme.id} onClick={() => applyTheme(theme)} className="group p-2 bg-gray-50 dark:bg-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-700 hover:border-brand-primary transition-all text-center">
                                            <div className="w-full aspect-square rounded-xl mb-2 flex flex-col" style={{ background: theme.bg }}>
                                                <div className="m-auto w-1/2 h-2 rounded-full" style={{ background: theme.btn }}></div>
                                            </div>
                                            <span className="text-[9px] font-black uppercase text-gray-400 group-hover:text-brand-primary tracking-tighter">{theme.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center gap-6 p-6 bg-brand-surface/30 dark:bg-black/20 rounded-[2rem] border border-brand-secondary/10">
                                   <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center text-brand-primary shadow-sm"><Sparkles className="w-6 h-6" /></div>
                                   <div className="flex-1">
                                      <h5 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Mesh Gradients Dinâmicos</h5>
                                      <p className="text-[10px] text-gray-400 font-bold uppercase">Design de alto impacto exclusivo</p>
                                   </div>
                                   <button 
                                      onClick={() => setUseMeshGradient(!useMeshGradient)}
                                      className={`w-14 h-8 rounded-full transition-all relative ${useMeshGradient ? 'bg-brand-primary' : 'bg-gray-300 dark:bg-zinc-700'}`}
                                   >
                                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${useMeshGradient ? 'left-7' : 'left-1'}`}></div>
                                   </button>
                                </div>
                            </section>

                            <section>
                                <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <MousePointer2 className="w-4 h-4 text-brand-primary" /> Botão Flutuante (CTA)
                                </h4>
                                <div className="p-8 bg-gray-50 dark:bg-zinc-800 rounded-[2.5rem] border border-gray-100 dark:border-zinc-700 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Ativar botão fixo</span>
                                        <button 
                                            onClick={() => setCtaEnabled(!ctaEnabled)}
                                            className={`w-12 h-6 rounded-full transition-all relative ${ctaEnabled ? 'bg-indigo-600' : 'bg-gray-300'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${ctaEnabled ? 'left-7' : 'left-1'}`}></div>
                                        </button>
                                    </div>
                                    {ctaEnabled && (
                                        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Texto do Botão</label>
                                            <input type="text" className="w-full bg-white dark:bg-zinc-900 border-none rounded-xl p-4 font-bold dark:text-white" value={ctaLabel} onChange={e => setCtaLabel(e.target.value)} placeholder="Ex: Falar no WhatsApp" />
                                        </div>
                                    )}
                                </div>
                            </section>

                            <section>
                                <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <FontIcon className="w-4 h-4 text-brand-primary" /> Tipografia
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {FONTS.map(font => (
                                        <button key={font.id} onClick={() => setFontFamily(font.id)} className={`p-5 rounded-2xl border transition-all text-left group ${fontFamily === font.id ? 'bg-indigo-600 border-indigo-600 shadow-lg' : 'bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 hover:border-brand-primary'}`}>
                                            <span className={`text-sm font-bold block ${fontFamily === font.id ? 'text-white' : 'text-gray-900 dark:text-white'}`} style={{ fontFamily: font.family }}>{font.label}</span>
                                            <span className={`text-[10px] font-medium block mt-1 ${fontFamily === font.id ? 'text-indigo-100' : 'text-gray-400'}`}>Estilo profissional</span>
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {activeEditorTab === 'share' && (
                        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-xl space-y-10 animate-fade-in">
                            <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="relative z-10 space-y-6 max-w-md">
                                    <div>
                                        <h4 className="text-xl font-black mb-2">Sua Bio está Pronta!</h4>
                                        <p className="text-indigo-200 text-sm font-medium leading-relaxed">Ative agora para começar a capturar leads do seu bairro no Instagram.</p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button onClick={copyBioLink} className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${copied ? 'bg-emerald-500' : 'bg-white/10 hover:bg-white/20'}`}>
                                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? 'Copiado' : 'Link da Bio'}
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
                            </div>
                        </div>
                    )}
                </div>

                {/* PREMIUM LIVE PREVIEW (RIGHT) */}
                <div className="lg:col-span-5 flex justify-center lg:sticky lg:top-24 h-fit">
                    <div className="relative w-[320px] h-[660px] bg-slate-950 rounded-[4.5rem] p-3 border-[12px] border-slate-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
                        <div 
                            className={`w-full h-full rounded-[3.5rem] flex flex-col items-center pt-16 px-6 text-center overflow-y-auto scrollbar-hide relative`}
                            style={{ 
                                background: bgColor, 
                                color: textColor, 
                                fontFamily: fontFamily === 'font-sans' ? 'Inter' : fontFamily === 'font-serif' ? 'serif' : fontFamily === 'font-mono' ? 'monospace' : 'Poppins' 
                            }}
                        >
                            {/* MESH GRADIENT OVERLAY */}
                            {useMeshGradient && (
                                <div className="absolute inset-0 z-0 opacity-40 pointer-events-none overflow-hidden">
                                    <div className="absolute top-0 -left-10 w-64 h-64 bg-indigo-500 rounded-full blur-[80px] animate-pulse"></div>
                                    <div className="absolute bottom-10 -right-10 w-64 h-64 bg-purple-500 rounded-full blur-[80px] animate-pulse delay-1000"></div>
                                    <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-cyan-400 rounded-full blur-[100px] opacity-30"></div>
                                </div>
                            )}

                            <div className="relative z-10 w-full flex flex-col items-center">
                                <div className="w-24 h-24 rounded-[2.5rem] border-[6px] border-white/5 shadow-2xl overflow-hidden flex items-center justify-center bg-white/5 backdrop-blur-md mb-6">
                                    {profile.logoUrl ? <img src={profile.logoUrl} className="w-full h-full object-cover" /> : <UserIcon className="w-12 h-12 opacity-10" />}
                                </div>
                                <h4 className="font-black text-xl mb-2 leading-tight tracking-tight">{profile.businessName || user?.name}</h4>
                                <p className="text-[11px] opacity-60 font-medium leading-relaxed mb-8">{profile.bio || 'Bem-vindo ao meu perfil!'}</p>
                                
                                <div className="w-full space-y-3 pb-6">
                                    {links.map(l => (
                                        <div key={l.id} className="w-full py-3.5 px-6 rounded-[1.4rem] border border-white/10 font-bold text-sm tracking-tight shadow-lg active:scale-95 transition-all" style={{ background: btnColor }}>
                                            {l.label}
                                        </div>
                                    ))}
                                </div>

                                {/* SOCIAL PROOF CAROUSEL PREVIEW */}
                                {socialProof.length > 0 && (
                                    <div className="w-full mt-6 mb-10">
                                        <div className="p-5 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 text-left space-y-2">
                                            <div className="flex text-yellow-400">
                                                {[1,2,3,4,5].map(s => <Star key={s} className="w-2.5 h-2.5 fill-current" />)}
                                            </div>
                                            <p className="text-[10px] leading-relaxed italic opacity-80">"{socialProof[0].text}"</p>
                                            <p className="text-[9px] font-black uppercase tracking-widest opacity-60">— {socialProof[0].author}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* FLOATING CTA PREVIEW */}
                            {ctaEnabled && (
                                <div className="absolute bottom-6 left-6 right-6 z-20">
                                    <div className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2">
                                        <MessageCircle className="w-4 h-4" /> {ctaLabel}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
         )}
      </div>
    </div>
  );
};

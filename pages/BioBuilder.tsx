
import React, { useState, useEffect, useRef } from 'react';
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
  MousePointer2, UserPlus, Quote, Info, BookOpen, FileText, ChevronLeft,
  Calendar, User, Upload, Edit2, Zap, MoreHorizontal, X, Send
} from 'lucide-react';
import { BioLink, BioConfig, Profile, SocialProof, BlogPost } from '../types';
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
  const [activeEditorTab, setActiveEditorTab] = useState<'home' | 'content' | 'social_proof' | 'blog' | 'design' | 'share'>('home');
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [links, setLinks] = useState<BioLink[]>([]);
  const [socialProof, setSocialProof] = useState<SocialProof[]>([]);
  const [blogEnabled, setBlogEnabled] = useState(false);
  const [blogButtonLabel, setBlogButtonLabel] = useState('Nossos Artigos');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
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
  
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', summary: '', content: '', category: 'Dicas' });

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    if (!user) return;
    try {
        const [data, posts] = await Promise.all([
          mockBackend.getProfile(user.id),
          mockBackend.getBlogPosts() // Simplificado para demo, filtrar por userId em real
        ]);
        
        if (data) {
          setProfile(data);
          setLinks(data.bioConfig?.links || [
            { id: '1', type: 'whatsapp', label: 'WhatsApp Comercial', url: '', active: true },
            { id: '2', type: 'instagram', label: 'Siga no Instagram', url: '', active: true }
          ]);
          setSocialProof(data.bioConfig?.socialProof || []);
          setBlogEnabled(data.bioConfig?.blogEnabled || false);
          setBlogButtonLabel(data.bioConfig?.blogButtonLabel || 'Nossos Artigos');
          setBlogPosts(posts.filter(p => p.userId === user.id));

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
          // Simulação de QR Code state vindo do perfil
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
          blogEnabled,
          blogButtonLabel,
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

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const post = await mockBackend.createBlogPost({
        ...newPost,
        userId: user.id,
        author: user.name,
        imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'
      });
      setBlogPosts([post, ...blogPosts]);
      setIsBlogModalOpen(false);
      setNewPost({ title: '', summary: '', content: '', category: 'Dicas' });
    } catch (e) {}
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Deseja excluir este artigo?')) return;
    await mockBackend.deleteBlogPost(id);
    setBlogPosts(blogPosts.filter(p => p.id !== id));
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

  // Componente de Mockup Interno para o Preview
  const BioMockup = () => (
    <div className="relative mx-auto w-[310px] h-[630px] bg-black rounded-[3rem] border-[8px] border-zinc-800 shadow-2xl overflow-hidden group">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-2xl z-50"></div>
      
      {/* Bio Content Container */}
      <div 
        className={`w-full h-full overflow-y-auto scrollbar-hide flex flex-col items-center pt-12 pb-10 px-6 transition-all duration-500 ${fontFamily}`}
        style={{ 
          backgroundColor: bgColor, 
          color: textColor,
          backgroundImage: useMeshGradient ? `radial-gradient(at 0% 0%, ${btnColor}44 0px, transparent 50%), radial-gradient(at 100% 100%, ${btnColor}22 0px, transparent 50%)` : 'none'
        }}
      >
        {/* Profile Image */}
        <div className="w-20 h-20 rounded-full border-4 border-white/20 shadow-xl overflow-hidden mb-4 mt-4 flex-shrink-0 bg-white/10 flex items-center justify-center">
          {profile.logoUrl ? (
            <img src={profile.logoUrl} className="w-full h-full object-cover" alt="Me" />
          ) : (
            <UserIcon className="w-10 h-10 opacity-20" />
          )}
        </div>
        
        {/* Profile Info */}
        <h2 className="font-black text-lg text-center leading-tight mb-1">{profile.businessName || 'Seu Negócio'}</h2>
        <p className="text-[10px] opacity-80 text-center font-medium max-w-[200px] mb-8">{profile.bio || 'Bem-vindo ao meu perfil profissional.'}</p>
        
        {/* Links */}
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
          {blogEnabled && (
            <div 
              className="w-full py-3.5 px-4 rounded-2xl text-center font-black text-xs shadow-lg border-2 border-dashed border-white/20"
              style={{ backgroundColor: 'transparent', color: textColor }}
            >
              {blogButtonLabel}
            </div>
          )}
        </div>

        {/* Social Proof Section */}
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

        {/* Footer */}
        <div className="mt-auto pt-8 flex items-center gap-1 opacity-40">
           <Zap className="w-3 h-3 fill-current" />
           <span className="text-[8px] font-black uppercase tracking-widest">Menu de Negócios</span>
        </div>

        {/* Floating QR */}
        {qrCodeEnabled && (
           <div className="absolute top-20 right-4 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10 shadow-lg">
              <QrCode className="w-5 h-5" />
           </div>
        )}

        {/* Floating CTA */}
        {ctaEnabled && (
          <div className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-emerald-500 shadow-2xl flex items-center justify-center text-white animate-bounce">
            <MessageCircle className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 pt-4 px-4">
      {/* Header Premium */}
      <div className="bg-[#0F172A] dark:bg-black rounded-[3.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="p-5 bg-indigo-500/10 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-xl">
                   <Smartphone className="h-10 w-10 text-brand-primary" />
                </div>
                <div>
                   <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-2 italic uppercase">
                      Bio Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] dark:from-brand-primary dark:to-brand-accent">Pro</span>
                   </h1>
                   <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">TRANSFORME SEU LINK DO INSTAGRAM EM VENDAS.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button onClick={handleSave} disabled={isSaving} className="bg-[#F67C01] text-white px-10 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50">
                    {isSaving ? <RefreshCw className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />} PUBLICAR AGORA
                </button>
              </div>
          </div>

          {/* Abas Padronizadas */}
          <div className="flex p-1.5 mt-12 bg-white/5 backdrop-blur-md rounded-[2.2rem] border border-white/10 w-fit overflow-x-auto scrollbar-hide gap-1">
              {[
                  { id: 'home', label: 'INÍCIO', desc: 'Painel geral', icon: HomeIcon },
                  { id: 'content', label: 'CONTEÚDO', desc: 'Links e bio', icon: AlignLeft },
                  { id: 'social_proof', label: 'PROVA SOCIAL', desc: 'Depoimentos', icon: Quote },
                  { id: 'blog', label: 'BLOG', desc: 'Artigos', icon: BookOpen },
                  { id: 'design', label: 'DESIGN', desc: 'Temas e cores', icon: Palette },
                  { id: 'share', label: 'ATIVAR', desc: 'Compartilhar', icon: Share2 }
              ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveEditorTab(tab.id as any)} 
                    className={`flex flex-col items-center justify-center min-w-[110px] px-8 py-3 rounded-[1.6rem] transition-all duration-300 whitespace-nowrap ${activeEditorTab === tab.id ? 'bg-[#F67C01] text-white shadow-xl scale-105' : 'text-slate-400 hover:bg-white/10'}`}
                  >
                      <div className="flex items-center gap-2 mb-0.5">
                        <tab.icon className={`w-3.5 h-3.5 ${activeEditorTab === tab.id ? 'text-white' : 'text-brand-primary'}`} />
                        <span className="font-black text-[10px] tracking-widest uppercase italic">{tab.label}</span>
                      </div>
                      <span className={`text-[8px] font-medium opacity-60 ${activeEditorTab === tab.id ? 'text-white' : ''}`}>{tab.desc}</span>
                  </button>
              ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
         {activeEditorTab === 'home' ? (
            <SectionLanding 
                title="Sua presença profissional em um único link."
                subtitle="Cartão Digital Inteligente"
                description="Esqueça links sem graça. Crie uma vitrine premium que reúne contatos, depoimentos e seu catálogo em uma interface elegante feita para converter visitantes em clientes reais."
                benefits={[
                "Design mobile-first focado em alta performance.",
                "Integração direta com seu catálogo de produtos.",
                "Bloco de prova social para depoimentos.",
                "Aba de blog com artigos para gerar autoridade.",
                "Personalização total de cores e fontes premium."
                ]}
                youtubeId="dQw4w9WgXcQ"
                ctaLabel="TURBINAR MINHA BIO"
                onStart={() => setActiveEditorTab('content')}
                icon={Smartphone}
                accentColor="indigo"
            />
         ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Lado Esquerdo: Editor */}
                <div className="lg:col-span-7 space-y-10">
                    {activeEditorTab === 'content' && (
                        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-10 animate-fade-in">
                            <div className="space-y-6">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight flex items-center gap-2"><User className="text-indigo-600" /> Perfil Principal</h3>
                                <div className="grid md:grid-cols-2 gap-8 items-center">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Título da Bio</label>
                                            <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold focus:ring-4 focus:ring-indigo-50 dark:text-white transition-all" value={profile.businessName || ''} onChange={e => setProfile({...profile, businessName: e.target.value})} placeholder="Ex: Ana Doces Gourmet" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Texto de Destaque</label>
                                            <textarea rows={3} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-medium text-sm focus:ring-4 focus:ring-indigo-50 dark:text-white resize-none transition-all" value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} placeholder="Breve descrição sobre seu trabalho..." />
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-zinc-800/40 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-zinc-700">
                                        <div className="w-24 h-24 rounded-full bg-white shadow-xl overflow-hidden border-4 border-white mb-4 relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                            {profile.logoUrl ? (
                                              <img src={profile.logoUrl} className="w-full h-full object-cover" alt="Logo" />
                                            ) : (
                                              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                                                <Camera className="w-8 h-8" />
                                              </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        <input 
                                          type="file" 
                                          ref={fileInputRef}
                                          onChange={handleImageUpload}
                                          className="hidden" 
                                          accept="image/*"
                                        />
                                        <button 
                                          onClick={() => fileInputRef.current?.click()}
                                          className="text-[9px] font-black text-indigo-600 uppercase tracking-widest px-6 py-2 rounded-xl bg-white shadow-sm hover:shadow-md transition-all"
                                        >
                                          Trocar Foto
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8 pt-10 border-t border-gray-100 dark:border-zinc-800">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight flex items-center gap-2"><Layout className="text-indigo-600" /> Botões e Links</h3>
                                    <button onClick={addLink} className="bg-indigo-50 text-indigo-600 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">ADICIONAR LINK</button>
                                </div>
                                <div className="space-y-4">
                                    {links.map((link) => (
                                        <div key={link.id} className="p-6 bg-gray-50 dark:bg-zinc-800/40 rounded-[2rem] border border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row gap-4 items-center group transition-all hover:bg-white dark:hover:bg-zinc-800">
                                            <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl text-slate-300"><GripVertical className="w-5 h-5" /></div>
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                                                <input type="text" placeholder="Nome do Botão" className="bg-white dark:bg-zinc-900 border-none rounded-xl p-4 text-xs font-bold dark:text-white focus:ring-2 focus:ring-indigo-100" value={link.label} onChange={e => updateLink(link.id, { label: e.target.value })} />
                                                <input type="text" placeholder="Link ou WhatsApp" className="col-span-2 bg-white dark:bg-zinc-900 border-none rounded-xl p-4 text-xs font-bold dark:text-white focus:ring-2 focus:ring-indigo-100" value={link.url} onChange={e => updateLink(link.id, { url: e.target.value })} />
                                            </div>
                                            <button onClick={() => removeLink(link.id)} className="p-3 text-rose-300 hover:text-rose-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeEditorTab === 'blog' && (
                        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-10 animate-fade-in">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight flex items-center gap-2"><BookOpen className="text-indigo-600" /> Blog e Autoridade</h3>
                                <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-800 p-2 rounded-2xl">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Ativo</span>
                                    <button onClick={() => setBlogEnabled(!blogEnabled)} className={`w-12 h-6 rounded-full transition-all relative ${blogEnabled ? 'bg-emerald-600' : 'bg-slate-300'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${blogEnabled ? 'left-7' : 'left-1'}`}></div>
                                    </button>
                                </div>
                            </div>

                            {blogEnabled ? (
                                <div className="space-y-10">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Texto do Botão no Perfil</label>
                                            <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={blogButtonLabel} onChange={e => setBlogButtonLabel(e.target.value)} placeholder="Ex: Nossos Artigos" />
                                        </div>
                                        <div className="flex items-end">
                                            <button onClick={() => setIsBlogModalOpen(true)} className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-95">
                                                <Plus className="w-4 h-4" /> NOVO ARTIGO
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Artigos Publicados</h4>
                                        {blogPosts.length === 0 ? (
                                            <div className="py-12 text-center border-4 border-dashed border-gray-50 dark:border-zinc-800 rounded-[2.5rem]">
                                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Nenhum artigo ainda</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-4">
                                                {blogPosts.map(post => (
                                                    <div key={post.id} className="p-6 bg-gray-50 dark:bg-zinc-800/40 rounded-[2rem] border border-gray-100 dark:border-zinc-800 flex justify-between items-center group">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center text-indigo-600 shadow-sm"><FileText className="w-6 h-6" /></div>
                                                            <div>
                                                                <h5 className="font-black text-gray-900 dark:text-white text-sm uppercase italic">{post.title}</h5>
                                                                <p className="text-[10px] text-slate-400 font-bold uppercase">{post.date} • {post.category}</p>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => handleDeletePost(post.id)} className="p-3 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="py-20 text-center space-y-6">
                                    <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-800 rounded-[2.5rem] flex items-center justify-center mx-auto text-gray-200"><BookOpen className="w-10 h-10" /></div>
                                    <h4 className="text-xl font-black text-gray-300 dark:text-zinc-600 uppercase tracking-widest">Blog Desabilitado</h4>
                                    <p className="text-slate-400 max-w-xs mx-auto text-sm font-medium">Ative o blog para publicar artigos e ganhar autoridade no seu bairro.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeEditorTab === 'social_proof' && (
                        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-10 animate-fade-in">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight flex items-center gap-2"><Quote className="text-indigo-600" /> Depoimentos</h3>
                                <button onClick={addSocialProof} className="bg-indigo-50 text-indigo-600 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">NOVO DEPOIMENTO</button>
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                {socialProof.map((proof) => (
                                    <div key={proof.id} className="p-8 bg-gray-50 dark:bg-zinc-800/40 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 space-y-4 group">
                                        <div className="flex justify-between items-start">
                                            <div className="flex text-yellow-400 gap-1">
                                                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                            </div>
                                            <button onClick={() => setSocialProof(socialProof.filter(p => p.id !== proof.id))} className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                        <input type="text" className="w-full bg-transparent font-black text-sm dark:text-white border-b border-gray-100 dark:border-zinc-700 pb-2 outline-none" value={proof.author} onChange={e => setSocialProof(socialProof.map(p => p.id === proof.id ? { ...p, author: e.target.value } : p))} />
                                        <textarea className="w-full bg-transparent text-xs text-slate-500 font-medium leading-relaxed resize-none outline-none" rows={3} value={proof.text} onChange={e => setSocialProof(socialProof.map(p => p.id === proof.id ? { ...p, text: e.target.value } : p))} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeEditorTab === 'design' && (
                        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-12 animate-fade-in">
                            <div className="grid md:grid-cols-2 gap-16">
                                <div className="space-y-10">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight">Estilo Visual</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {PRESET_THEMES.map(theme => (
                                            <button key={theme.id} onClick={() => applyTheme(theme)} className="group p-5 bg-gray-50 dark:bg-zinc-800 rounded-3xl border-2 border-transparent hover:border-indigo-200 transition-all text-left">
                                                <div className="flex gap-1.5 mb-3">
                                                    <div className="w-5 h-5 rounded-full shadow-inner" style={{ background: theme.bg }}></div>
                                                    <div className="w-5 h-5 rounded-full shadow-inner" style={{ background: theme.btn }}></div>
                                                </div>
                                                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{theme.label}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight">Fonte e Tipografia</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {FONTS.map(font => (
                                            <button key={font.id} onClick={() => setFontFamily(font.id)} className={`p-5 rounded-3xl border-2 transition-all text-center ${fontFamily === font.id ? 'border-indigo-600 bg-indigo-50/30' : 'border-gray-50 dark:border-zinc-800 hover:bg-gray-50'}`}>
                                                <span className={`text-xl font-black dark:text-white ${font.family}`}>Aa</span>
                                                <p className="text-[9px] font-black text-slate-400 uppercase mt-2">{font.label}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-gray-100 dark:border-zinc-800">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight mb-8">Efeitos de Fundo e Recursos</h3>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="flex flex-col justify-between p-6 bg-gray-50 dark:bg-zinc-800/40 rounded-3xl gap-4">
                                        <div>
                                            <p className="text-xs font-black text-gray-900 dark:text-white uppercase">Gradiente Mesh</p>
                                            <p className="text-[9px] font-medium text-slate-500">Fundo moderno premium</p>
                                        </div>
                                        <button onClick={() => setUseMeshGradient(!useMeshGradient)} className={`w-14 h-8 rounded-full transition-all relative ${useMeshGradient ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-zinc-700'}`}>
                                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all ${useMeshGradient ? 'left-7' : 'left-1'}`}></div>
                                        </button>
                                    </div>
                                    <div className="flex flex-col justify-between p-6 bg-gray-50 dark:bg-zinc-800/40 rounded-3xl gap-4">
                                        <div>
                                            <p className="text-xs font-black text-gray-900 dark:text-white uppercase">Botão WhatsApp</p>
                                            <p className="text-[9px] font-medium text-slate-500">CTA flutuante sempre visível</p>
                                        </div>
                                        <button onClick={() => setCtaEnabled(!ctaEnabled)} className={`w-14 h-8 rounded-full transition-all relative ${ctaEnabled ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-zinc-700'}`}>
                                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all ${ctaEnabled ? 'left-7' : 'left-1'}`}></div>
                                        </button>
                                    </div>
                                    <div className="flex flex-col justify-between p-6 bg-gray-50 dark:bg-zinc-800/40 rounded-3xl gap-4">
                                        <div>
                                            <p className="text-xs font-black text-gray-900 dark:text-white uppercase">Habilitar QR Code</p>
                                            <p className="text-[9px] font-medium text-slate-500">Atalho rápido no cabeçalho</p>
                                        </div>
                                        <button onClick={() => setQrCodeEnabled(!qrCodeEnabled)} className={`w-14 h-8 rounded-full transition-all relative ${qrCodeEnabled ? 'bg-[#F67C01]' : 'bg-slate-200 dark:bg-zinc-700'}`}>
                                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all ${qrCodeEnabled ? 'left-7' : 'left-1'}`}></div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeEditorTab === 'share' && (
                        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 md:p-20 border border-gray-100 dark:border-zinc-800 shadow-sm text-center space-y-10 animate-fade-in relative overflow-hidden">
                            <div className="relative z-10 space-y-6">
                                <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-950/40 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8"><Zap className="w-12 h-12 text-emerald-600 fill-current" /></div>
                                <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Sua Bio está Online!</h2>
                                <p className="text-slate-500 dark:text-zinc-400 font-medium max-w-lg mx-auto">Agora é só copiar seu link exclusivo e colocar na bio do seu Instagram para começar a capturar leads.</p>
                                
                                <div className="max-w-xl mx-auto flex gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-[2rem] border border-gray-100 dark:border-zinc-700 shadow-inner">
                                    <div className="flex-1 px-5 py-4 text-sm font-bold text-slate-500 dark:text-slate-400 truncate">menudenegocios.com.br/bio/{user?.id}</div>
                                    <button onClick={copyBioLink} className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${copied ? 'bg-emerald-600 text-white' : 'bg-gray-900 text-white hover:bg-black'}`}>
                                        {copied ? 'Copiado!' : 'Copiar Link'}
                                    </button>
                                </div>

                                <div className="flex justify-center gap-12 pt-10">
                                    <div className="text-center space-y-3 group cursor-pointer">
                                        <div className="w-36 h-36 p-6 bg-white rounded-[2.5rem] shadow-xl border border-gray-100 inline-block transform group-hover:scale-110 transition-transform">
                                            <QrCode className="w-full h-full text-gray-900" />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors flex items-center justify-center gap-2">
                                           <Download className="w-3 h-3" /> Baixar QR Code
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Lado Direito: Live Mockup */}
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

      {/* Modal Criar Artigo (Blog) */}
      {isBlogModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in">
             <div className="bg-white dark:bg-zinc-900 rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-white/5 animate-scale-in">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center"><BookOpen className="w-6 h-6 text-brand-primary" /></div>
                        <div>
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter">Novo Artigo de Blog</h3>
                            <p className="text-[10px] font-black text-[#F67C01] tracking-widest mt-1 uppercase">Gere autoridade no seu bairro</p>
                        </div>
                    </div>
                    <button onClick={() => setIsBlogModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                <form onSubmit={handleCreatePost} className="p-10 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Título Chamativo</label>
                        <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} placeholder="Ex: 5 dicas para escolher o doce perfeito" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Resumo Curto (Thumbnail)</label>
                        <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={newPost.summary} onChange={e => setNewPost({...newPost, summary: e.target.value})} placeholder="Uma frase impactante para o feed..." />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Conteúdo Completo</label>
                        <textarea required rows={8} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-medium text-sm dark:text-white resize-none" value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} placeholder="Escreva aqui seu artigo detalhado..." />
                    </div>
                    <button type="submit" className="w-full bg-[#F67C01] text-white font-black py-5 rounded-[2rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" /> PUBLICAR ARTIGO
                    </button>
                </form>
             </div>
          </div>
      )}
    </div>
  );
};

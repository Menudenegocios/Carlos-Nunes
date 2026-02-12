
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { 
  Smartphone, Share2, Plus, Trash2, Layout, 
  Palette, Save, ExternalLink, Instagram, 
  MessageCircle, Globe, MapPin, Mail, Copy, Check,
  GripVertical, Type, Eye, Monitor,
  Image as ImageIcon, Star, QrCode, Download,
  CheckCircle, ArrowRight, Camera, RefreshCw
} from 'lucide-react';
import { BioLink, BioConfig, Profile } from '../types';

interface BioTheme {
  id: string;
  name: string;
  background: string;
  textColor: string;
  buttonColor: string;
  buttonText: string;
}

const THEMES: BioTheme[] = [
  { id: 'premium-dark', name: 'Premium Dark', background: 'bg-neutral-950', textColor: 'text-white', buttonColor: 'bg-neutral-900 border border-neutral-800 shadow-lg hover:border-neutral-700', buttonText: 'text-gray-100 font-medium' },
  { id: 'brand-gradient', name: 'Insta Brand', background: 'bg-gradient-to-br from-purple-700 via-pink-600 to-orange-500', textColor: 'text-white', buttonColor: 'bg-white/20 backdrop-blur-md border border-white/30 shadow-lg hover:bg-white/30', buttonText: 'text-white font-semibold' },
  { id: 'midnight-blur', name: 'Midnight', background: 'bg-gradient-to-b from-slate-900 to-slate-950', textColor: 'text-blue-50', buttonColor: 'bg-slate-800/50 backdrop-blur-md border border-slate-700 hover:bg-slate-800/80', buttonText: 'text-blue-50 font-medium' },
  { id: 'clean-light', name: 'Minimal Light', background: 'bg-white', textColor: 'text-gray-900', buttonColor: 'bg-gray-50 border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md', buttonText: 'text-gray-900 font-semibold' },
];

const FONTS = [
  { id: 'font-sans', name: 'Moderna (Sans)' },
  { id: 'font-serif', name: 'Elegante (Serif)' },
  { id: 'font-mono', name: 'Tech (Mono)' },
  { id: 'font-display', name: 'Impactante (Display)' },
];

export const BioBuilder: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<BioTheme>(THEMES[0]);
  const [selectedFont, setSelectedFont] = useState<string>(FONTS[0].id);
  const [links, setLinks] = useState<BioLink[]>([]);
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showQrInBio, setShowQrInBio] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    const data = await mockBackend.getProfile(user.id);
    if (data) {
      setName(data.businessName || user.name);
      setBio(data.bio || '');
      setAvatar(data.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`);
      if (data.bioConfig) {
        setLinks(data.bioConfig.links || []);
        setSelectedFont(data.bioConfig.fontFamily || FONTS[0].id);
        const theme = THEMES.find(t => t.id === data.bioConfig?.themeId) || THEMES[0];
        setSelectedTheme(theme);
      }
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await mockBackend.updateProfile(user.id, {
        businessName: name,
        bio: bio,
        logoUrl: avatar,
        bioConfig: { themeId: selectedTheme.id, fontFamily: selectedFont as any, links }
      });
      setMessage('Bio salva com sucesso!');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addLink = () => {
    setLinks([...links, { id: Date.now().toString(), type: 'custom', label: 'Novo Link', url: '', active: true }]);
  };

  const updateLink = (id: string, field: keyof BioLink, value: any) => {
    setLinks(links.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const userPublicUrl = `${window.location.origin}/#/b/${user?.referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(userPublicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'instagram': return <Instagram className="w-5 h-5" />;
      case 'whatsapp': return <MessageCircle className="w-5 h-5" />;
      case 'location': return <MapPin className="w-5 h-5" />;
      case 'email': return <Mail className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      
      {/* Sub Top Bar for Bio Actions */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
             <Smartphone className="w-5 h-5 text-indigo-600" />
             <h1 className="text-lg font-black text-gray-900">Customizar Bio Digital</h1>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleCopyLink}
              className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-100"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4 text-indigo-600" />}
              Compartilhar
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-black hover:bg-indigo-700 shadow-lg shadow-indigo-100"
            >
              <Save className="w-4 h-4" /> {isSaving ? 'Salvando...' : 'PUBLICAR'}
            </button>
          </div>

          {/* Mobile Tab switcher in the header area */}
          <div className="md:hidden flex w-full bg-gray-100 p-1 rounded-xl">
            <button onClick={() => setActiveTab('edit')} className={`flex-1 flex justify-center gap-2 py-2 rounded-lg text-xs font-bold ${activeTab === 'edit' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}><Layout className="w-4 h-4" /> Editor</button>
            <button onClick={() => setActiveTab('preview')} className={`flex-1 flex justify-center gap-2 py-2 rounded-lg text-xs font-bold ${activeTab === 'preview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}><Eye className="w-4 h-4" /> Prévia</button>
          </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
        
        {/* Editor Area */}
        <div className={`flex-1 overflow-y-auto p-4 md:p-8 space-y-6 pb-24 ${activeTab === 'preview' ? 'hidden md:block' : 'block'}`}>
          {message && <div className="p-4 bg-emerald-500 text-white rounded-2xl font-bold text-sm text-center shadow-lg animate-fade-in">{message}</div>}

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-black mb-6 flex items-center gap-2"><Camera className="w-5 h-5 text-indigo-600" /> Perfil</h2>
            <div className="flex flex-col md:flex-row gap-8 items-center">
               <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-24 h-24 rounded-[2rem] bg-gray-100 overflow-hidden flex items-center justify-center border-4 border-white shadow-xl">
                    {avatar ? <img src={avatar} className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 text-gray-300" />}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-indigo-600 p-2 rounded-xl text-white shadow-lg"><Plus className="w-4 h-4" /></div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
               </div>
               <div className="flex-1 w-full space-y-4">
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold" placeholder="Nome do Negócio" />
                  <textarea rows={2} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm" placeholder="Breve biografia..." />
               </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-black mb-6 flex items-center gap-2"><Palette className="w-5 h-5 text-purple-600" /> Estilo</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {THEMES.map(theme => (
                <button key={theme.id} onClick={() => setSelectedTheme(theme)} className={`h-20 rounded-2xl overflow-hidden border-2 transition-all ${selectedTheme.id === theme.id ? 'border-indigo-600 scale-105' : 'border-gray-100'}`}>
                  <div className={`w-full h-full ${theme.background}`}></div>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
               {FONTS.map(font => (
                 <button key={font.id} onClick={() => setSelectedFont(font.id)} className={`p-3 rounded-xl border-2 text-xs font-bold transition-all ${selectedFont === font.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-50 text-gray-400'}`}>{font.name}</button>
               ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-lg font-black">Links</h2>
               <button onClick={addLink} className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold">+ ADICIONAR</button>
            </div>
            <div className="space-y-3">
              {links.map(link => (
                <div key={link.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3">
                  <div className="pt-2 text-gray-300"><GripVertical className="w-4 h-4" /></div>
                  <div className="flex-1 space-y-2">
                    <input type="text" value={link.label} onChange={(e) => updateLink(link.id, 'label', e.target.value)} className="w-full bg-white border-none rounded-lg p-2 text-sm font-bold shadow-sm" placeholder="Texto do botão" />
                    <input type="text" value={link.url} onChange={(e) => updateLink(link.id, 'url', e.target.value)} className="w-full bg-white border-none rounded-lg p-2 text-xs shadow-sm" placeholder="URL ou link" />
                  </div>
                  <button onClick={() => setLinks(links.filter(l => l.id !== link.id))} className="p-2 text-gray-300 hover:text-rose-500 mt-2"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Area */}
        <div className={`flex-1 bg-white border-l border-gray-100 flex flex-col items-center justify-start p-6 md:p-10 ${activeTab === 'edit' ? 'hidden md:flex' : 'flex'}`}>
           <div className="bg-gray-50 px-4 py-2 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 border border-gray-100 shadow-sm flex items-center gap-2">
              <Monitor className="w-3 h-3" /> Visualização em Tempo Real
           </div>

           <div className="relative w-[310px] h-[630px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl border-4 border-gray-800 mt-2">
              <div className={`w-full h-full rounded-[2.5rem] overflow-y-auto ${selectedTheme.background} relative scrollbar-hide ${selectedFont} transition-all duration-500`}>
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10"></div>
                 <div className="flex flex-col items-center pt-16 pb-10 px-6">
                    <div className="w-24 h-24 rounded-[2rem] border-4 border-white shadow-xl overflow-hidden mb-4"><img src={avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} className="w-full h-full object-cover" /></div>
                    <h2 className={`text-xl font-black text-center mb-1 ${selectedTheme.textColor}`}>{name || 'Sua Loja'}</h2>
                    <p className={`text-[11px] text-center mb-8 opacity-75 ${selectedTheme.textColor}`}>{bio || 'Descrição da sua bio digital.'}</p>
                    <div className="w-full space-y-3">
                       {links.map(l => (
                         <div key={l.id} className={`w-full p-4 rounded-2xl text-center text-xs font-black uppercase tracking-wider shadow-md ${selectedTheme.buttonColor} ${selectedTheme.buttonText}`}>{l.label}</div>
                       ))}
                    </div>
                    {showQrInBio && (
                      <div className="mt-10 p-4 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 w-full flex flex-col items-center">
                         <div className="bg-white p-2 rounded-xl mb-2"><QRCanvas url={userPublicUrl} size={60} /></div>
                         <p className={`text-[8px] font-black opacity-40 uppercase ${selectedTheme.textColor}`}>Escanear Contato</p>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

const QRCanvas = ({ url, size = 120 }: { url: string, size?: number }) => {
  return (
    <div className="flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16V21H16"/><path d="M21 16H16"/><path d="M9 3H16"/><path d="M3 9V16"/><path d="M21 9V16"/><path d="M9 21H16"/><path d="M8 8H10V10H8V8Z" fill="currentColor"/></svg>
    </div>
  );
};

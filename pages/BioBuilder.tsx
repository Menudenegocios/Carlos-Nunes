
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
  User as UserIcon, AlignLeft
} from 'lucide-react';
import { BioLink, BioConfig, Profile } from '../types';

export const BioBuilder: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [links, setLinks] = useState<BioLink[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    if (!user) return;
    const data = await mockBackend.getProfile(user.id);
    if (data) {
      setProfile(data);
      setLinks(data.bioConfig?.links || [
        { id: '1', type: 'whatsapp', label: 'WhatsApp', url: '', active: true },
        { id: '2', type: 'instagram', label: 'Instagram', url: '', active: true }
      ]);
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
        bioConfig: { themeId: 'premium-dark', fontFamily: 'font-sans', links } 
      });
      alert('Seu Cartão de Visitas Digital foi atualizado!');
    } finally { setIsSaving(false); }
  };

  const copyBioLink = () => {
    const url = `${window.location.origin}/#/store/${user?.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4 px-4">
      {/* Academy Style Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
                 <Smartphone className="h-10 w-10 text-purple-400" />
              </div>
              <div>
                 <h1 className="text-3xl md:text-5xl font-black tracking-tight">Bio Digital</h1>
                 <p className="text-indigo-200 text-lg font-medium">Crie seu cartão de visitas inteligente para o Instagram.</p>
              </div>
            </div>

            <div className="flex p-1.5 bg-black/20 backdrop-blur-md rounded-[1.8rem] border border-white/10">
               <button onClick={() => setActiveTab('edit')} className={`flex items-center gap-3 px-8 py-3 rounded-[1.4rem] font-black text-sm transition-all ${activeTab === 'edit' ? 'bg-white text-indigo-900 shadow-xl' : 'text-indigo-100 hover:bg-white/10'}`}>
                 <Layout className="w-4 h-4" /> EDITOR
               </button>
               <button onClick={() => setActiveTab('preview')} className={`flex items-center gap-3 px-8 py-3 rounded-[1.4rem] font-black text-sm transition-all ${activeTab === 'preview' ? 'bg-white text-indigo-900 shadow-xl' : 'text-indigo-100 hover:bg-white/10'}`}>
                 <Eye className="w-4 h-4" /> PREVIEW
               </button>
            </div>
          </div>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      <div className="animate-[fade-in_0.4s_ease-out] grid grid-cols-1 lg:grid-cols-12 gap-10">
         
         {/* Editor Column */}
         <div className="lg:col-span-7 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl space-y-10">
            <div className="flex justify-between items-center">
               <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3"><Monitor className="text-indigo-600" /> Identidade Visual</h3>
               <button onClick={handleSave} className="bg-indigo-600 text-white px-8 py-3 rounded-[1.2rem] font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all hover:scale-105">
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Publicar Agora
               </button>
            </div>
            
            <div className="space-y-8">
               {/* Profile Image & Basic Info */}
               <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="relative group">
                     <div className="w-32 h-32 rounded-[2.5rem] bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center relative shadow-sm group-hover:border-indigo-400 transition-colors">
                        {profile.logoUrl ? (
                           <img src={profile.logoUrl} className="w-full h-full object-cover" />
                        ) : (
                           <UserIcon className="w-12 h-12 text-gray-300" />
                        )}
                        <label className="absolute inset-0 bg-indigo-900/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                           <Camera className="w-6 h-6 mb-1" />
                           <span className="text-[10px] font-black uppercase">Alterar</span>
                           <input type="file" hidden onChange={handleImageUpload} />
                        </label>
                     </div>
                  </div>
                  
                  <div className="flex-1 space-y-4 w-full">
                     <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Nome de Exibição / Empresa</label>
                        <div className="relative">
                           <input type="text" className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 font-bold focus:ring-2 focus:ring-indigo-100" value={profile.businessName || ''} onChange={e => setProfile({...profile, businessName: e.target.value})} placeholder="Seu nome profissional" />
                           <UserIcon className="absolute left-4 top-4 text-gray-300 w-5 h-5" />
                        </div>
                     </div>
                     <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Bio Curta (Instagram Style)</label>
                        <div className="relative">
                           <textarea rows={2} className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 font-medium text-sm focus:ring-2 focus:ring-indigo-100 resize-none" value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} placeholder="Conte o que você faz..." />
                           <AlignLeft className="absolute left-4 top-4 text-gray-300 w-5 h-5" />
                        </div>
                     </div>
                  </div>
               </div>

               {/* Links Section */}
               <div className="space-y-6 pt-8 border-t border-gray-100">
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Meus Links e Botões</h4>
                  <div className="space-y-4">
                     {links.map((link, idx) => (
                        <div key={link.id} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex flex-col md:flex-row items-center gap-4 group">
                           <div className="flex items-center gap-4 flex-1 w-full">
                              <GripVertical className="text-gray-300 w-5 h-5 cursor-grab hidden md:block" />
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
                           </div>
                           <button onClick={() => setLinks(links.filter(l => l.id !== link.id))} className="p-3 text-gray-300 hover:text-rose-500 transition-colors bg-white rounded-xl md:opacity-0 md:group-hover:opacity-100"><Trash2 className="w-5 h-5" /></button>
                        </div>
                     ))}
                     <button onClick={() => setLinks([...links, {id: Date.now().toString(), type: 'custom', label: 'Novo Link', url: '', active: true}])} className="w-full py-6 rounded-[2.5rem] border-2 border-dashed border-gray-200 text-gray-400 font-black uppercase text-xs tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                        <Plus className="w-5 h-5" /> Adicionar Novo Botão
                     </button>
                  </div>
               </div>

               {/* Share Link & QR Code */}
               <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 mt-12">
                  <div className="relative z-10 space-y-6 max-w-md">
                     <div>
                        <h4 className="text-xl font-black mb-2">Compartilhe sua Bio</h4>
                        <p className="text-indigo-200 text-sm font-medium">Use o link ou gere seu QR Code personalizado.</p>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={copyBioLink} className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${copied ? 'bg-emerald-500' : 'bg-white/10 hover:bg-white/20'}`}>
                           {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Copiar Link
                        </button>
                        <button className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
                           <Download className="w-4 h-4" /> Salvar QR Code
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
            </div>
         </div>

         {/* Preview Column */}
         <div className="lg:col-span-5 flex justify-center sticky top-24 h-fit">
            <div className="relative w-[320px] h-[640px] bg-slate-900 rounded-[3.5rem] border-[10px] border-slate-800 shadow-2xl overflow-hidden p-4">
               <div className="w-full h-full bg-slate-950 rounded-[2.5rem] flex flex-col items-center pt-16 px-8 text-center text-white overflow-y-auto scrollbar-hide">
                  <div className="w-24 h-24 rounded-[2rem] bg-indigo-500/20 border-4 border-slate-900 shadow-xl mb-6 overflow-hidden flex items-center justify-center">
                     {profile.logoUrl ? (
                        <img src={profile.logoUrl} className="w-full h-full object-cover" />
                     ) : (
                        <UserIcon className="w-10 h-10 text-white/20" />
                     )}
                  </div>
                  <h4 className="font-black text-xl mb-2 leading-tight">{profile.businessName || user?.name}</h4>
                  <p className="text-[10px] text-gray-400 font-medium leading-relaxed mb-8 px-4">{profile.bio || 'Adicione uma bio para aparecer aqui...'}</p>
                  
                  <div className="w-full space-y-3 pb-8">
                     {links.map(l => (
                        <div key={l.id} className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 font-bold text-sm tracking-tight transition-all cursor-pointer">
                           {l.label}
                        </div>
                     ))}
                     {links.length === 0 && (
                        <div className="py-12 text-gray-600 text-xs font-medium uppercase tracking-widest opacity-30">Sem botões configurados</div>
                     )}
                  </div>

                  <div className="mt-auto pb-6">
                     <p className="text-[8px] font-black tracking-widest text-indigo-500/50 uppercase">Powered by Menu ADS</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

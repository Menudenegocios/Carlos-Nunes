
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

export const BioBuilder: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [name, setName] = useState('');
  const [links, setLinks] = useState<BioLink[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    if (!user) return;
    const data = await mockBackend.getProfile(user.id);
    if (data) {
      setName(data.businessName || user.name);
      setLinks(data.bioConfig?.links || []);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await mockBackend.updateProfile(user.id, { businessName: name, bioConfig: { themeId: 'premium-dark', fontFamily: 'font-sans', links } });
      alert('Bio Publicada!');
    } finally { setIsSaving(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4">
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
                 <p className="text-indigo-200 text-lg font-medium">Seu cartão de visitas inteligente para o Instagram.</p>
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
         <div className="lg:col-span-7 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl space-y-10">
            <div className="flex justify-between items-center">
               <h3 className="text-2xl font-black text-gray-900">Personalizar Links</h3>
               <button onClick={handleSave} className="bg-indigo-600 text-white px-8 py-3 rounded-[1.2rem] font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all hover:scale-105">
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Publicar
               </button>
            </div>
            
            <div className="space-y-6">
               <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Título da Bio</label>
                  <input type="text" className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold focus:ring-2 focus:ring-indigo-100" value={name} onChange={e => setName(e.target.value)} />
               </div>
               
               <div className="space-y-4">
                  {links.map(link => (
                     <div key={link.id} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center gap-4">
                        <GripVertical className="text-gray-300 w-5 h-5" />
                        <div className="flex-1">
                           <input type="text" className="bg-transparent border-none p-0 font-bold text-gray-900 text-sm focus:ring-0 w-full" value={link.label} />
                           <input type="text" className="bg-transparent border-none p-0 text-gray-400 text-xs focus:ring-0 w-full" value={link.url} />
                        </div>
                        <button className="p-3 text-gray-300 hover:text-rose-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                     </div>
                  ))}
                  <button onClick={() => setLinks([...links, {id: Date.now().toString(), type: 'custom', label: 'Novo Link', url: '', active: true}])} className="w-full py-6 rounded-[2.5rem] border-2 border-dashed border-gray-200 text-gray-400 font-black uppercase text-xs tracking-widest hover:bg-gray-50 transition-all">+ Adicionar Botão</button>
               </div>
            </div>
         </div>

         <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-[320px] h-[640px] bg-slate-900 rounded-[3.5rem] border-[10px] border-slate-800 shadow-2xl overflow-hidden p-4">
               <div className="w-full h-full bg-slate-950 rounded-[2.5rem] flex flex-col items-center pt-16 px-8 text-center text-white">
                  <div className="w-24 h-24 rounded-full bg-indigo-500/20 border-4 border-slate-900 shadow-xl mb-6 overflow-hidden">
                     <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-black text-xl mb-8 leading-tight">{name}</h4>
                  <div className="w-full space-y-3">
                     {links.map(l => <div key={l.id} className="w-full py-4 px-6 bg-white/10 rounded-2xl border border-white/10 font-bold text-sm tracking-tight">{l.label}</div>)}
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

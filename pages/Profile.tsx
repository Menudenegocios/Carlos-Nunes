
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabaseService } from '../services/supabaseService';
import { Profile as ProfileType } from '../types';
import { 
  Shield, Award, Crown, Camera, Save, RefreshCw, User as UserIcon, Download
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Partial<ProfileType>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (user) loadProfile(); }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    try {
      const data = await supabaseService.getProfile(user.id);
      setProfile(data || { logoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}` });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally { setLoading(false); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await supabaseService.updateProfile(user.id, { ...profile, isPublished: true });
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Erro ao salvar perfil.');
    } finally { setSaving(false); }
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

  if (loading) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4 px-4">
      {/* Academy Style Header */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-indigo-950 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 p-1 shadow-2xl overflow-hidden relative group">
                 <img src={profile.logoUrl} className="w-full h-full object-cover rounded-[1.8rem]" alt="Me" />
                 <label className="absolute inset-0 bg-emerald-600/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Camera className="w-6 h-6" />
                    <input type="file" hidden onChange={handleImageUpload} />
                 </label>
              </div>
              <div>
                 <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none mb-2">{user?.name}</h1>
                 <p className="text-emerald-200 text-lg font-medium flex items-center gap-2">
                    <Crown className="w-5 h-5 text-emerald-400 fill-current" /> Status {user?.level.toUpperCase()}
                 </p>
              </div>
            </div>
            <div className="flex gap-4">
               <div className="text-center bg-black/20 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/5">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Cód. Indicação</p>
                  <p className="text-xl font-black font-mono tracking-wider">{user?.referralCode}</p>
               </div>
            </div>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      <div className="animate-[fade-in_0.4s_ease-out] grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-4 bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-xl space-y-8">
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Carteira de Autoridade</h3>
            <div className="aspect-[1.58/1] w-full rounded-[2.5rem] bg-gradient-to-br from-emerald-900 to-indigo-950 p-6 text-white relative overflow-hidden shadow-2xl transition-transform hover:scale-[1.02]">
               <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                     <Shield className="w-8 h-8 text-emerald-400" />
                     <span className="text-[9px] font-black tracking-[0.2em] opacity-60 uppercase">Menu ADS Premium</span>
                  </div>
                  <div>
                     <p className="text-[8px] font-black opacity-40 uppercase tracking-widest mb-0.5">Membro Verificado</p>
                     <p className="font-mono text-base uppercase font-bold tracking-wider truncate">{user?.name}</p>
                  </div>
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[8px] font-black opacity-40 uppercase tracking-widest">ID Global</p>
                        <p className="font-mono text-xs opacity-80">{user?.id.toString().slice(-6).toUpperCase()}</p>
                     </div>
                     <div className="bg-emerald-400 text-emerald-950 text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">NÍVEL {user?.level}</div>
                  </div>
               </div>
               <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
            </div>

            <div className="space-y-4">
               <div className="p-8 bg-gray-50 dark:bg-zinc-800/50 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3 mb-3">
                     <Award className="w-5 h-5 text-emerald-600" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Progresso de Pontos</span>
                  </div>
                  <div className="flex items-end gap-2 mb-4">
                     <span className="text-4xl font-black text-gray-900 dark:text-white leading-none">{user?.points}</span>
                     <span className="text-xs font-bold text-gray-400 pb-1 uppercase tracking-widest">Ativos</span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-600 rounded-full shadow-lg" style={{ width: `${Math.min((user?.points || 0) / 1000 * 100, 100)}%` }}></div>
                  </div>
               </div>
            </div>
         </div>

         <div className="lg:col-span-8 bg-white dark:bg-zinc-900 rounded-[3rem] p-10 md:p-16 border border-gray-100 dark:border-zinc-800 shadow-xl">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-10 leading-none tracking-tight">Configurações de Identidade</h3>
            <form onSubmit={handleSave} className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">URL Personalizada (Slug)</label>
                    <div className="flex items-center bg-gray-50 dark:bg-zinc-800 rounded-2xl p-2">
                       <span className="text-gray-400 font-bold px-3">/</span>
                       <input type="text" className="w-full bg-transparent border-none p-3 font-bold focus:ring-0 transition-all dark:text-white" value={profile.slug || ''} onChange={e => setProfile({...profile, slug: e.target.value})} placeholder="seu-nome" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Nome de Exibição / Empresa</label>
                    <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold focus:ring-4 focus:ring-emerald-500/10 transition-all dark:text-white" value={profile.businessName || ''} onChange={e => setProfile({...profile, businessName: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Telefone WhatsApp</label>
                    <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold focus:ring-4 focus:ring-emerald-500/10 transition-all dark:text-white" value={profile.phone || ''} onChange={e => setProfile({...profile, phone: e.target.value})} />
                  </div>
               </div>
               <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Biografia do Negócio</label>
                  <textarea rows={4} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-medium text-sm focus:ring-4 focus:ring-emerald-500/10 resize-none transition-all dark:text-white" value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} placeholder="Conte um pouco sobre sua trajetória..." />
               </div>
               <div className="flex justify-end pt-8 border-t border-gray-50 dark:border-zinc-800">
                  <button type="submit" disabled={saving} className="bg-emerald-600 text-white font-black px-12 py-5 rounded-2xl hover:bg-emerald-700 shadow-2xl shadow-emerald-900/20 transition-all uppercase tracking-widest text-sm flex items-center gap-2">
                     {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} SALVAR ALTERAÇÕES
                  </button>
               </div>
            </form>
             <div className="mt-12 p-8 bg-gray-50 dark:bg-zinc-800/50 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800">
               <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-6">Seu Link Exclusivo</h3>
               <div className="flex flex-col md:flex-row items-center gap-8">
                 <div className="bg-white p-4 rounded-2xl shadow-inner">
                   <QRCodeSVG value={`${window.location.origin}/${profile.slug || user?.id}`} size={150} />
                 </div>
                 <div className="flex-1 space-y-4">
                   <p className="text-sm text-gray-600 dark:text-zinc-300">
                     Compartilhe seu link exclusivo: <strong>{window.location.origin}/{profile.slug || user?.id}</strong>
                   </p>
                   <button 
                     onClick={() => {
                       const canvas = document.querySelector('svg');
                       if (canvas) {
                         const data = new XMLSerializer().serializeToString(canvas);
                         const blob = new Blob([data], {type: 'image/svg+xml'});
                         const url = URL.createObjectURL(blob);
                         const link = document.createElement('a');
                         link.href = url;
                         link.download = 'qrcode.svg';
                         link.click();
                       }
                     }}
                     className="bg-indigo-600 text-white font-black px-8 py-3 rounded-2xl hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs flex items-center gap-2"
                   >
                     <Download className="w-4 h-4" /> Baixar QR Code
                   </button>
                 </div>
               </div>
             </div>
         </div>
      </div>
    </div>
  );
};

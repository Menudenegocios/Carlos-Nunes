
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { Profile as ProfileType } from '../types';
import { 
  Download, Upload, Image as ImageIcon, X, Wallet, 
  Shield, Award, TrendingUp, Copy, Check, UserIcon, Crown
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Partial<ProfileType>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => { if (user) loadProfile(); }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    try {
      const data = await mockBackend.getProfile(user.id);
      setProfile(data || { logoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}` });
    } finally { setLoading(false); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await mockBackend.updateProfile(user.id, profile);
      alert('Perfil salvo com sucesso!');
    } finally { setSaving(false); }
  };

  if (loading) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4">
      {/* Academy Style Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 p-1 shadow-2xl overflow-hidden">
                 <img src={profile.logoUrl} className="w-full h-full object-cover rounded-[1.8rem]" alt="Me" />
              </div>
              <div>
                 <h1 className="text-3xl md:text-5xl font-black tracking-tight">{user?.name}</h1>
                 <p className="text-indigo-200 text-lg font-medium flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-400 fill-current" /> Status {user?.level.toUpperCase()}
                 </p>
              </div>
            </div>
            <div className="flex gap-4">
               <div className="text-center bg-black/20 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/5">
                  <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Cód. Indicação</p>
                  <p className="text-xl font-black font-mono">{user?.referralCode}</p>
               </div>
            </div>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      <div className="animate-[fade-in_0.4s_ease-out] grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-4 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl space-y-8">
            <h3 className="text-2xl font-black text-gray-900">Carteira Digital</h3>
            <div className="aspect-[1.58/1] w-full rounded-[2rem] bg-gradient-to-br from-slate-900 to-indigo-950 p-6 text-white relative overflow-hidden shadow-2xl group transition-transform hover:scale-[1.02]">
               <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                     <Shield className="w-8 h-8 text-indigo-400" />
                     <span className="text-[9px] font-black tracking-[0.2em] opacity-60 uppercase">Menu ADS Card</span>
                  </div>
                  <div>
                     <p className="text-[8px] font-black opacity-40 uppercase tracking-widest">Titular</p>
                     <p className="font-mono text-base uppercase font-bold tracking-wider truncate">{user?.name}</p>
                  </div>
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[8px] font-black opacity-40 uppercase tracking-widest">Membro ID</p>
                        <p className="font-mono text-xs">{user?.id.toString().slice(-4).padStart(4, '0')}</p>
                     </div>
                     <div className="bg-yellow-400 text-black text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{user?.level}</div>
                  </div>
               </div>
               <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
            </div>

            <div className="space-y-4">
               <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                     <Award className="w-5 h-5 text-indigo-600" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Progresso de Nível</span>
                  </div>
                  <div className="flex items-end gap-2 mb-3">
                     <span className="text-3xl font-black text-gray-900">{user?.points}</span>
                     <span className="text-xs font-bold text-gray-400 pb-1">/ 1000 PTS</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-indigo-600 rounded-full" style={{ width: '45%' }}></div></div>
               </div>
            </div>
         </div>

         <div className="lg:col-span-8 bg-white rounded-[3rem] p-10 md:p-16 border border-gray-100 shadow-xl">
            <h3 className="text-2xl font-black text-gray-900 mb-10">Dados Cadastrais</h3>
            <form onSubmit={handleSave} className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Nome Fantasia</label>
                    <input type="text" className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold focus:ring-2 focus:ring-indigo-100" value={profile.businessName || ''} onChange={e => setProfile({...profile, businessName: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Telefone WhatsApp</label>
                    <input type="text" className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold focus:ring-2 focus:ring-indigo-100" value={profile.phone || ''} onChange={e => setProfile({...profile, phone: e.target.value})} />
                  </div>
               </div>
               <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Sobre o Negócio</label>
                  <textarea rows={4} className="w-full bg-gray-50 border-none rounded-2xl p-5 font-medium text-sm focus:ring-2 focus:ring-indigo-100" value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} />
               </div>
               <div className="flex justify-end pt-6 border-t border-gray-50">
                  <button type="submit" disabled={saving} className="bg-indigo-600 text-white font-black px-10 py-5 rounded-[1.5rem] hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all uppercase tracking-widest text-sm">
                     {saving ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
                  </button>
               </div>
            </form>
         </div>
      </div>
    </div>
  );
};

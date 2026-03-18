
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabaseService } from '../services/supabaseService';
import { Profile as ProfileType } from '../types';
import { 
  Shield, Award, Crown, Camera, Save, RefreshCw, User as UserIcon, CreditCard, Clock, Phone
} from 'lucide-react';
import { PhoneInput } from '../components/PhoneInput';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Partial<ProfileType>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => { if (user) loadProfile(); }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    try {
      const data = await supabaseService.getProfileByUserId(user.id);
      const initialUrl = data?.logo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`;
      setProfile(data || { logo_url: initialUrl });
      setPreviewUrl(initialUrl);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally { setLoading(false); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      let finalLogoUrl = profile.logo_url;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${user.id}_${Date.now()}.${fileExt}`;
        const filePath = `imgprofile/${fileName}`;
        finalLogoUrl = await supabaseService.uploadImage(selectedFile, filePath);
      }

      // Whitelist: apenas campos editáveis pelo usuário
      await supabaseService.updateProfile(user.id, { 
        name: profile.name || null,
        logo_url: finalLogoUrl,
        slug: profile.slug || null,
        business_name: profile.business_name || null,
        phone: profile.phone || null,
        bio: profile.bio || null,
        category: profile.category || null,
        city: profile.city || null,
      });
      
      setProfile(prev => ({ ...prev, logo_url: finalLogoUrl }));
      setSelectedFile(null);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Erro ao salvar perfil. Verifique os dados e tente novamente.');
    } finally { setSaving(false); }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
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
                 <img src={previewUrl} className="w-full h-full object-cover rounded-[1.8rem]" alt="Me" />
                 <label className="absolute inset-0 bg-emerald-600/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Camera className="w-6 h-6" />
                    <input type="file" hidden onChange={handleImageUpload} />
                 </label>
              </div>
              <div>
                 <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none mb-2 flex items-center gap-4">
                    {user?.name}
                    {profile.has_founder_badge && (
                      <div className="bg-brand-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg animate-pulse">
                        FUNDADOR
                      </div>
                    )}
                 </h1>
                 <p className="text-emerald-200 text-lg font-medium flex items-center gap-2">
                    <Crown className="w-5 h-5 text-emerald-400 fill-current" /> Status {user?.level.toUpperCase()}
                 </p>
              </div>
            </div>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      <div className="animate-[fade-in_0.4s_ease-out] grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-4 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl space-y-8">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Carteira de Autoridade</h3>
            <div className="aspect-[1.58/1] w-full rounded-[2.5rem] bg-gradient-to-br from-emerald-900 to-indigo-950 p-6 text-white relative overflow-hidden shadow-2xl transition-transform hover:scale-[1.02]">
               <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                     <Shield className="w-8 h-8 text-emerald-400" />
                     <span className="text-[9px] font-black tracking-[0.2em] opacity-60 uppercase">Menu ADS Premium</span>
                  </div>
                  <div>
                     <p className="text-[8px] font-black opacity-40 uppercase tracking-widest mb-0.5">
                        {profile.has_founder_badge ? 'Membro Fundador' : 'Membro Verificado'}
                     </p>
                     <p className="font-mono text-base uppercase font-bold tracking-wider truncate">{user?.name}</p>
                  </div>
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[8px] font-black opacity-40 uppercase tracking-widest">ID de Identificação</p>
                        <p className="font-mono text-base font-black text-emerald-400"># {profile.display_id || '...'}</p>
                     </div>
                     <div className="bg-emerald-400 text-emerald-950 text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">NÍVEL {user?.level}</div>
                  </div>
               </div>
               <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
            </div>

            <div className="space-y-4">
               <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                     <Award className="w-5 h-5 text-emerald-600" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Progresso de Pontos</span>
                  </div>
                  <div className="flex items-end gap-2 mb-4">
                     <span className="text-4xl font-black text-gray-900 leading-none">{user?.points}</span>
                     <span className="text-xs font-bold text-gray-400 pb-1 uppercase tracking-widest">Ativos</span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-600 rounded-full shadow-lg" style={{ width: `${Math.min((user?.points || 0) / 1000 * 100, 100)}%` }}></div>
                  </div>
               </div>
            </div>
         </div>

         <div className="lg:col-span-8 bg-white rounded-[3rem] p-10 md:p-16 border border-gray-100 shadow-xl">
            <h3 className="text-2xl font-black text-gray-900 mb-10 leading-none tracking-tight">Configurações de Identidade</h3>
            <form onSubmit={handleSave} className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Nome Completo / Pessoal</label>
                    <input type="text" className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold focus:ring-4 focus:ring-emerald-500/10 transition-all" value={profile.name || ''} onChange={e => setProfile({...profile, name: e.target.value})} placeholder="Seu nome" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Nome de Exibição / Empresa</label>
                    <input type="text" className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold focus:ring-4 focus:ring-emerald-500/10 transition-all" value={profile.business_name || ''} onChange={e => setProfile({...profile, business_name: e.target.value})} />
                  </div>
                  <PhoneInput
                    label="Telefone WhatsApp"
                    value={profile.phone || ''}
                    onChange={val => setProfile({...profile, phone: val})}
                    className="md:col-span-1"
                  />
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Categoria</label>
                    <input type="text" className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold focus:ring-4 focus:ring-emerald-500/10 transition-all" value={profile.category || ''} onChange={e => setProfile({...profile, category: e.target.value})} placeholder="Ex: Tecnologia, Vendas..." />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Cidade</label>
                    <input type="text" className="w-full bg-gray-50 border-none rounded-2xl p-5 font-bold focus:ring-4 focus:ring-emerald-500/10 transition-all" value={profile.city || ''} onChange={e => setProfile({...profile, city: e.target.value})} placeholder="Sua cidade" />
                  </div>
               </div>
               <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Biografia do Negócio</label>
                  <textarea rows={4} className="w-full bg-gray-50 border-none rounded-2xl p-5 font-medium text-sm focus:ring-4 focus:ring-emerald-500/10 resize-none transition-all" value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} placeholder="Conte um pouco sobre sua trajetória..." />
               </div>
               <div className="flex justify-end pt-8 border-t border-gray-50">
                  <button type="submit" disabled={saving} className="bg-emerald-600 text-white font-black px-12 py-5 rounded-2xl hover:bg-emerald-700 shadow-2xl shadow-emerald-900/20 transition-all uppercase tracking-widest text-sm flex items-center gap-2">
                     {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} SALVAR ALTERAÇÕES
                  </button>
                </div>
            </form>

            <div className="mt-12 p-10 bg-gray-50 rounded-[3rem] border border-gray-100 shadow-inner relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
                
                <div className="relative z-10">
                   <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                         <CreditCard className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                         <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">Pagamentos e Assinaturas</h3>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Gestão financeira da sua conta</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Plano Atual</p>
                         <div className="flex items-center justify-between">
                            <span className="text-lg font-black text-gray-900 uppercase italic tracking-tight">
                               {((profile as any).subscriptions?.[0]?.plan || profile.plan || 'PRÉ-CADASTRO').toUpperCase()}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                               (profile as any).subscriptions?.[0]?.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                            }`}>
                               {(profile as any).subscriptions?.[0]?.status === 'active' ? 'Ativo' : 'Pendente/Inativo'}
                            </span>
                         </div>
                      </div>

                      <div className="p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Próximo Vencimento</p>
                         <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-300" />
                            <span className="text-lg font-black text-gray-900">
                               {(profile as any).subscriptions?.[0]?.current_period_end 
                                  ? new Date((profile as any).subscriptions[0].current_period_end).toLocaleDateString('pt-BR') 
                                  : '---'}
                            </span>
                         </div>
                      </div>
                   </div>

                   <div className="mt-8 flex flex-col md:flex-row gap-4">
                      <button 
                        onClick={() => window.location.href = '/plans'}
                        className="flex-1 bg-indigo-600 text-white font-black px-8 py-4 rounded-2xl hover:bg-indigo-700 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
                      >
                         RENOVAR OU ALTERAR PLANO
                      </button>
                      <button 
                        className="px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 bg-white border border-gray-100 hover:bg-gray-50 transition-all"
                      >
                         HISTÓRICO DE COBRANÇAS
                      </button>
                    </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

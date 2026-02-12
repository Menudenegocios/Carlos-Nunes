
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { Profile as ProfileType } from '../types';
import { Download, Upload, Image as ImageIcon, X, Wallet, Shield, Star, Award, TrendingUp, Copy, Check } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Partial<ProfileType>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    try {
      const data = await mockBackend.getProfile(user.id);
      if (data) {
        setProfile(data);
      } else {
        // Initialize with default avatar if no profile exists yet
        setProfile({
            logoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await mockBackend.updateProfile(user.id, profile);
      setMessage('Perfil atualizado com sucesso! Seu cartão de parceiro foi atualizado.');
      setTimeout(() => setMessage(''), 3000);
    } catch (e) {
      setMessage('Erro ao salvar perfil.');
    } finally {
      setSaving(false);
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

  const handleDownloadImage = () => {
    if (!profile.logoUrl) return;
    
    const link = document.createElement('a');
    link.href = profile.logoUrl;
    link.download = `logo-${user?.name || 'perfil'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyReferral = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Helper for Card Styling based on Level
  const getCardTheme = (level: string = 'iniciante') => {
    switch (level) {
      case 'ouro':
        return {
          bg: 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700',
          text: 'text-yellow-50',
          border: 'border-yellow-400',
          shine: 'from-yellow-200/40 to-transparent',
          label: 'OURO MEMBER'
        };
      case 'prata':
        return {
          bg: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600',
          text: 'text-gray-50',
          border: 'border-gray-300',
          shine: 'from-white/40 to-transparent',
          label: 'PRATA MEMBER'
        };
      case 'bronze':
        return {
          bg: 'bg-gradient-to-br from-orange-300 via-orange-500 to-orange-800',
          text: 'text-orange-50',
          border: 'border-orange-400',
          shine: 'from-orange-200/40 to-transparent',
          label: 'BRONZE MEMBER'
        };
      case 'diamante':
      default: // Default is now Diamante as requested
        return {
          bg: 'bg-gradient-to-br from-slate-800 via-cyan-900 to-slate-950',
          text: 'text-cyan-50',
          border: 'border-cyan-500/30',
          shine: 'from-cyan-400/20 to-transparent',
          label: 'MEMBRO DIAMANTE'
        };
    }
  };

  const getPlanLabel = (plan: string) => {
      switch(plan) {
          case 'profissionais': return 'Profissional';
          case 'freelancers': return 'Freelancer';
          case 'negocios': return 'Negócio Local';
          default: return plan;
      }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Carregando informações...</div>;

  const cardTheme = getCardTheme(user?.level);

  // Format ID to 4 digits
  const displayId = user?.id ? user.id.toString().slice(-4).padStart(4, '0') : '0000';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* 1. Carteira Digital (Premium Wallet) */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
           <Wallet className="w-6 h-6 text-indigo-600" />
           <h2 className="text-xl font-bold text-gray-900">Carteira do Membro</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
            
            {/* The Digital Card */}
            <div className="relative w-full max-w-sm aspect-[1.586/1] rounded-2xl shadow-2xl overflow-hidden transform transition-transform hover:scale-[1.02] duration-300 group perspective-1000">
                {/* Background Gradient */}
                <div className={`absolute inset-0 ${cardTheme.bg}`}></div>
                
                {/* Texture/Pattern Overlay */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                
                {/* Shine Effect */}
                <div className={`absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r ${cardTheme.shine} opacity-0 group-hover:animate-shine`} />

                {/* Card Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                           <Shield className="w-6 h-6" />
                           <span className="font-bold tracking-widest text-sm">MENU ADS</span>
                        </div>
                        <span className="font-mono text-[10px] sm:text-xs opacity-90 tracking-widest border border-white/20 bg-black/20 px-2 py-0.5 rounded backdrop-blur-sm">
                           {cardTheme.label}
                        </span>
                    </div>

                    {/* Photo on Card (New) */}
                    {profile.logoUrl && (
                       <div className="absolute top-16 right-6 w-14 h-14 rounded-full border-2 border-white/20 overflow-hidden shadow-lg z-10 bg-black/20">
                         <img src={profile.logoUrl} alt="Card Member" className="w-full h-full object-cover" />
                       </div>
                    )}

                    {/* Chip & Contactless */}
                    <div className="flex items-center gap-4 my-2">
                        <div className="w-10 h-8 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-md border border-yellow-600 shadow-inner flex items-center justify-center relative overflow-hidden">
                           <div className="absolute inset-0 border-[0.5px] border-black/20 rounded-md opacity-50 grid grid-cols-2 grid-rows-2"></div>
                        </div>
                        <svg className="w-6 h-6 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-auto relative z-10">
                        <div className="flex justify-between items-end">
                           <div>
                              <p className="text-[10px] opacity-60 uppercase tracking-wider mb-0.5">Nome do Titular</p>
                              <p className="font-mono text-base sm:text-lg font-bold tracking-wide uppercase text-shadow-sm truncate max-w-[180px]">
                                {user?.name || 'MEMBRO'}
                              </p>
                           </div>
                           <div className="text-right mr-2">
                              <p className="text-[10px] opacity-60 uppercase tracking-wider mb-0.5">Pontos</p>
                              <p className="font-mono text-lg sm:text-xl font-bold tracking-wider">{user?.points || 0}</p>
                           </div>
                        </div>
                        <div className="mt-4 flex justify-between items-center text-[10px] sm:text-xs font-mono opacity-80">
                           <span className="tracking-widest">ID: {displayId}</span>
                           <span>VALIDADE: 12/30</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wallet Stats / Actions */}
            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between h-full">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <Award className="w-5 h-5 text-indigo-600" />
                        <span className="text-xs font-bold uppercase">Nível Atual</span>
                    </div>
                    <div>
                        <span className="text-2xl font-black text-gray-900 uppercase">{user?.level || 'Diamante'}</span>
                        <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
                           <div className="bg-indigo-600 h-full rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Status VIP Ativo</p>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between h-full">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span className="text-xs font-bold uppercase">Código de Indicação</span>
                    </div>
                    <div>
                        <div className="flex items-center justify-between bg-white border border-gray-200 rounded p-2 mb-1">
                           <code className="text-sm font-bold text-gray-800">{user?.referralCode}</code>
                           <button onClick={copyReferral} className="text-gray-400 hover:text-indigo-600">
                             {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                           </button>
                        </div>
                        <p className="text-xs text-gray-400">Ganhe 50 pts por amigo.</p>
                    </div>
                </div>

                <div className="sm:col-span-2 bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-100 flex items-center justify-between">
                    <div>
                       <h4 className="font-bold text-indigo-900 text-sm">Plano {getPlanLabel(user?.plan || 'profissionais')}</h4>
                       <p className="text-xs text-indigo-700">
                         {user?.plan === 'freelancers' ? 'Visibilidade para seus serviços' : user?.plan === 'negocios' ? 'Vitrine completa para seu negócio' : 'Seu perfil profissional digital'}
                       </p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-400 fill-current drop-shadow-sm" />
                </div>
            </div>
        </div>
      </div>

      {/* 2. Edit Profile Form */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Editar Informações</h2>
        </div>
        
        <form onSubmit={handleSave} className="p-6 space-y-8">
          
          {/* Image Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
             <div className="relative group">
                <div className="w-24 h-24 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-50">
                   {profile.logoUrl ? (
                     <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-400">
                       <ImageIcon className="w-8 h-8" />
                     </div>
                   )}
                </div>
                {profile.logoUrl && (
                  <button 
                    type="button"
                    onClick={() => setProfile({...profile, logoUrl: ''})}
                    className="absolute -top-1 -right-1 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
             </div>

             <div className="flex-1 space-y-3 text-center sm:text-left">
                <div>
                   <h3 className="text-sm font-bold text-gray-900">Logo ou Foto do Negócio</h3>
                   <p className="text-xs text-gray-500">Recomendado: 500x500px (JPG, PNG)</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                   <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors">
                      <Upload className="w-3 h-3" /> Alterar Foto
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                   </label>
                   
                   {profile.logoUrl && (
                     <button 
                       type="button"
                       onClick={handleDownloadImage}
                       className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors"
                     >
                        <Download className="w-3 h-3" /> Baixar
                     </button>
                   )}
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Negócio</label>
              <input
                type="text"
                className="block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={profile.businessName || ''}
                onChange={e => setProfile({ ...profile, businessName: e.target.value })}
                placeholder="Ex: Consultoria Silva"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria / Setor</label>
              <select
                className="block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={profile.category || ''}
                onChange={e => setProfile({ ...profile, category: e.target.value })}
              >
                 <option value="">Selecione...</option>
                 <option value="Serviços Profissionais">Serviços Profissionais</option>
                 <option value="Negócios Locais">Negócios Locais</option>
                 <option value="Saúde e Bem-estar">Saúde e Bem-estar</option>
                 <option value="Imóveis e Residencial">Imóveis e Residencial</option>
                 <option value="Oportunidades">Oportunidades</option>
              </select>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
              <input
                type="text"
                className="block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={profile.phone || ''}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
              <input
                type="text"
                className="block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={profile.address || ''}
                onChange={e => setProfile({ ...profile, address: e.target.value })}
                placeholder="Rua Exemplo, 123 - Bairro - Cidade/UF"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio / Sobre o Negócio</label>
            <textarea
              rows={4}
              className="block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={profile.bio || ''}
              onChange={e => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Descreva seus produtos, serviços e o que torna seu negócio especial..."
            />
            <p className="mt-2 text-xs text-gray-500 text-right">0/300 caracteres</p>
          </div>

          {message && (
             <div className={`text-sm p-3 rounded-lg flex items-center justify-center font-medium ${message.includes('Erro') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
               {message}
             </div>
          )}

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex justify-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 transition-colors"
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

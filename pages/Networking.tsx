
import React, { useEffect, useState } from 'react';
import { supabaseService } from '../services/supabaseService';
import { NetworkingProfile } from '../types';
import { MessageCircle, Briefcase, Search, Plus, Trash2, X, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Networking: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<NetworkingProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    business_name: '',
    sector: '',
    lookingFor: '',
    avatar: ''
  });

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const data = await supabaseService.getNetworkingProfiles();
      setProfiles(data);
    } catch (error) {
      console.error('Error loading networking profiles:', error);
    }
  };

  const handleOpenModal = () => {
    if (!user) {
      if (window.confirm('Você precisa estar logado para adicionar um negócio. Deseja fazer login agora?')) {
        navigate('/login');
      }
      return;
    }
    setIsModalOpen(true);
  };

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const newProfile = await supabaseService.createNetworkingProfile({
        name: formData.name,
        business_name: formData.business_name,
        sector: formData.sector,
        lookingFor: formData.lookingFor,
        avatar: formData.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name}`,
        user_id: user.id
      });
      setProfiles([...profiles, newProfile]);
      setIsModalOpen(false);
      setFormData({ name: '', business_name: '', sector: '', lookingFor: '', avatar: '' });
    } catch (error) {
      console.error('Error adding partner:', error);
      alert('Erro ao adicionar negócio.');
    }
  };

  // Fixed parameter type to string to match NetworkingProfile.id
  const handleDeletePartner = async (id: string) => {
    // Optional: Check if user owns the profile or is admin
    if (!user) return;
    
    if (window.confirm('Tem certeza que deseja remover este negócio da lista?')) {
      try {
        await supabaseService.deleteNetworkingProfile(id);
        setProfiles(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting partner:', error);
        alert('Erro ao remover negócio.');
      }
    }
  };

  const filteredProfiles = profiles.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
           <h1 className="text-3xl font-bold text-gray-900">Negócios</h1>
           <p className="text-gray-500">Conecte-se com empresários e empresas da sua região.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <input 
              type="text" 
              placeholder="Buscar por nome ou setor..." 
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 w-full" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          </div>
          <button 
            onClick={handleOpenModal}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md whitespace-nowrap"
          >
            <Plus className="w-5 h-5" /> <span className="hidden sm:inline">Novo Negócio</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      {filteredProfiles.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
             <UserIcon className="w-8 h-8" />
          </div>
          <p className="text-gray-500 text-lg">Nenhum negócio encontrado.</p>
          <button 
             onClick={handleOpenModal}
             className="mt-4 text-indigo-600 font-bold hover:underline"
          >
            Adicionar o primeiro
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map(profile => (
            <div key={profile.id} className="group relative bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center hover:border-indigo-300 transition-colors hover:shadow-md">
              
              {/* Only show delete if user is logged in (simplified logic for demo) */}
              {user && (
                <button 
                  onClick={() => handleDeletePartner(profile.id)}
                  className="absolute top-3 right-3 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  title="Remover Negócio"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <img src={profile.avatar} alt={profile.name} className="w-20 h-20 rounded-full mb-4 bg-gray-50 border-2 border-white shadow-sm" />
              <h3 className="text-lg font-bold text-gray-900">{profile.name}</h3>
              <p className="text-indigo-600 font-medium text-sm mb-1">{profile.business_name}</p>
              <div className="flex items-center gap-1 text-gray-500 text-xs mb-4">
                 <Briefcase className="w-3 h-3" /> {profile.sector}
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 w-full mb-6">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-1">Procurando por:</span>
                <p className="text-sm text-gray-700 leading-snug">{profile.lookingFor}</p>
              </div>

              <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                <MessageCircle className="w-4 h-4" /> Conectar
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Partner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-[scale-in_0.2s_ease-out]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
               <h3 className="text-lg font-bold text-gray-900">Adicionar Negócio</h3>
               <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                 <X className="w-6 h-6" />
               </button>
            </div>
            
            <form onSubmit={handleAddPartner} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Responsável</label>
                <input 
                  required
                  type="text" 
                  className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ex: Ana Souza"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Negócio</label>
                <input 
                  required
                  type="text" 
                  className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ex: Doces da Ana"
                  value={formData.business_name}
                  onChange={e => setFormData({...formData, business_name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Setor / Área</label>
                <input 
                  required
                  type="text" 
                  className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ex: Gastronomia"
                  value={formData.sector}
                  onChange={e => setFormData({...formData, sector: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interesse / Procurando por:</label>
                <textarea 
                  rows={3}
                  className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ex: Fornecedores de embalagens e parcerias com buffets."
                  value={formData.lookingFor}
                  onChange={e => setFormData({...formData, lookingFor: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL do Avatar (Opcional)</label>
                <input 
                  type="text" 
                  className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://..."
                  value={formData.avatar}
                  onChange={e => setFormData({...formData, avatar: e.target.value})}
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg"
                >
                  Salvar Negócio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

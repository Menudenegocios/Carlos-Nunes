
import React, { useEffect, useState } from 'react';
import { mockBackend } from '../services/mockBackend';
import { Profile } from '../types';
import { Link } from 'react-router-dom';
import { Store, MapPin, Search, ArrowRight, Image as ImageIcon } from 'lucide-react';

export const Stores: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const data = await mockBackend.getAllProfiles();
      // Only show profiles that have a business name set
      setProfiles(data.filter(p => p.businessName));
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(p => 
    (p.businessName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (p.category?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (p.city?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white py-16 px-6 rounded-3xl shadow-xl text-center relative overflow-hidden mt-6">
         <div className="relative z-10 max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 flex items-center justify-center gap-3">
               <Store className="w-10 h-10 text-emerald-400" /> Diretório de Lojas
            </h1>
            <p className="text-xl text-indigo-100">
               Explore as melhores lojas e serviços da sua região em um só lugar.
            </p>
         </div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20"></div>
      </div>

      {/* Search Container */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-20 z-40">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Buscar lojas por nome, categoria ou cidade..." 
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-3.5 w-6 h-6 text-gray-400" />
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
               <div key={i} className="bg-white rounded-xl h-64 animate-pulse border border-gray-200"></div>
            ))}
         </div>
      ) : filteredProfiles.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
             <Store className="w-8 h-8" />
          </div>
          <p className="text-gray-500 text-lg">Nenhuma loja encontrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProfiles.map(profile => (
            <Link to={`/store/${profile.userId}`} key={profile.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
              
              {/* Cover Area */}
              <div className="h-32 bg-gray-200 relative overflow-hidden">
                 {profile.storeConfig?.coverUrl ? (
                    <img src={profile.storeConfig.coverUrl} alt="Cover" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                 ) : (
                    <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-900"></div>
                 )}
              </div>

              {/* Profile Content */}
              <div className="px-6 pb-6 pt-0 relative flex-1 flex flex-col">
                 <div className="flex justify-between items-end -mt-10 mb-4">
                    <div className="w-20 h-20 rounded-xl border-4 border-white bg-white shadow-md overflow-hidden relative z-10">
                       {profile.logoUrl ? (
                          <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                       ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                             <ImageIcon className="w-8 h-8" />
                          </div>
                       )}
                    </div>
                    {profile.category && (
                       <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                          {profile.category}
                       </span>
                    )}
                 </div>

                 <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">{profile.businessName}</h3>
                 <div className="flex items-center text-gray-500 text-xs mb-3 font-medium">
                    <MapPin className="w-3.5 h-3.5 mr-1" />
                    {profile.city || 'Localização não informada'}
                 </div>
                 
                 <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-1">{profile.bio || 'Visite nossa loja para ver produtos e ofertas incríveis.'}</p>

                 <div className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 group-hover:bg-indigo-600 transition-colors mt-auto">
                    Visitar Loja <ArrowRight className="w-4 h-4" />
                 </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

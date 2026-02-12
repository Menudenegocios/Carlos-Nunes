
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, Store, Heart, Home, Handshake,
  LayoutGrid, ArrowRight, Search, Image as ImageIcon
} from 'lucide-react';
import { OfferCategory } from '../types';

const CATEGORIES = [
  { 
    id: 'servicos', 
    title: 'Serviços Profissionais', 
    desc: 'Marketing, Design, Consultoria, Jurídico e mais.', 
    icon: Briefcase, 
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
    count: 324,
    enumValue: OfferCategory.SERVICOS_PROFISSIONAIS
  },
  { 
    id: 'negocios_locais', 
    title: 'Negócios Locais', 
    desc: 'Restaurantes, Cafés, Lojas, Salões e Automotivo.', 
    icon: Store, 
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=800',
    count: 450,
    enumValue: OfferCategory.NEGOCIOS_LOCAIS
  },
  { 
    id: 'saude', 
    title: 'Saúde e Bem-estar', 
    desc: 'Psicologia, Nutrição, Yoga, Pilates e Terapias.', 
    icon: Heart, 
    image: 'https://images.unsplash.com/photo-1544367563-12123d8966bf?auto=format&fit=crop&q=80&w=800',
    count: 120,
    enumValue: OfferCategory.SAUDE_BEM_ESTAR
  },
  { 
    id: 'imoveis', 
    title: 'Imóveis e Residencial', 
    desc: 'Corretores, Arquitetura, Síndicos e Reformas.', 
    icon: Home, 
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=800',
    count: 85,
    enumValue: OfferCategory.IMOVEIS_SERVICOS
  },
  { 
    id: 'oportunidades', 
    title: 'Oportunidades', 
    desc: 'Parcerias, Fornecedores e Indicações.', 
    icon: Handshake, 
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800',
    count: 65,
    enumValue: OfferCategory.OPORTUNIDADES
  }
];

export const Categories: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = CATEGORIES.filter(cat => 
    cat.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    cat.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Hero Banner (Marketplace Style) */}
      <div className="bg-gradient-to-r from-gray-900 to-indigo-900 text-white py-12 px-6 rounded-3xl shadow-xl text-center relative overflow-hidden mt-6">
         <div className="relative z-10 max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 flex items-center justify-center gap-3">
               <LayoutGrid className="w-10 h-10 text-cyan-400" /> Categorias
            </h1>
            <p className="text-xl text-indigo-100">
               Explore os melhores serviços e produtos organizados por setor.
            </p>
         </div>
         {/* Decoration */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-30"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500 rounded-full blur-[100px] opacity-30"></div>
      </div>

      {/* Controls (Marketplace Style) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-20 z-40">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Buscar categoria..." 
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-3.5 w-6 h-6 text-gray-400" />
        </div>
      </div>

      {/* Grid (Marketplace Style) */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
             <Search className="w-8 h-8" />
          </div>
          <p className="text-gray-500 text-lg">Nenhuma categoria encontrada.</p>
          <button 
             onClick={() => setSearchTerm('')}
             className="mt-4 text-indigo-600 font-bold hover:underline"
          >
            Limpar busca
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCategories.map((cat) => (
            <Link 
               to={`/?category=${encodeURIComponent(cat.enumValue)}`}
               key={cat.id}
               className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                 {cat.image ? (
                    <img src={cat.image} alt={cat.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                       <ImageIcon className="w-10 h-10" />
                    </div>
                 )}
                 {/* Icon Badge */}
                 <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md p-2 rounded-lg text-indigo-600 shadow-sm border border-white/20">
                    <cat.icon className="w-5 h-5" />
                 </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col">
                 <h3 className="font-bold text-gray-900 mb-1 leading-tight">{cat.title}</h3>
                 <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">{cat.desc}</p>

                 <div className="flex justify-between items-end mt-auto pt-3 border-t border-gray-100">
                    <div>
                       <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                          {cat.count} ANÚNCIOS
                       </span>
                    </div>
                    <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                       <ArrowRight className="w-5 h-5" />
                    </div>
                 </div>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
};

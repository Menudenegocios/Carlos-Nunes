
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Utensils, Heart, Dumbbell, ShoppingBag, 
  Wrench, GraduationCap, Star, PartyPopper, 
  Dog, ShoppingCart, Activity, Laptop,
  ArrowRight, Search, LayoutGrid, Image as ImageIcon
} from 'lucide-react';
import { OfferCategory } from '../types';

const CATEGORIES = [
  { 
    id: 'alimentacao', 
    title: 'Alimentação', 
    desc: 'Restaurantes, Cafés, Bares e Gastronomia.', 
    icon: Utensils, 
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
    count: 145,
    enumValue: OfferCategory.ALIMENTACAO
  },
  { 
    id: 'beleza', 
    title: 'Beleza e Estética', 
    desc: 'Salões, Clínicas de Estética e Bem-estar.', 
    icon: Heart, 
    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=800',
    count: 82,
    enumValue: OfferCategory.BELEZA_ESTETICA
  },
  { 
    id: 'fitness', 
    title: 'Fitness', 
    desc: 'Academias, Studios, Crossfit e Esportes.', 
    icon: Dumbbell, 
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    count: 54,
    enumValue: OfferCategory.FITNESS
  },
  { 
    id: 'varejo', 
    title: 'Varejo', 
    desc: 'Lojas físicas, Vestuário e Acessórios.', 
    icon: ShoppingBag, 
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
    count: 210,
    enumValue: OfferCategory.VAREJO
  },
  { 
    id: 'servicos', 
    title: 'Serviços', 
    desc: 'Manutenção, Reformas e Serviços Gerais.', 
    icon: Wrench, 
    image: 'https://images.unsplash.com/photo-1581578731548-c64695ce6958?auto=format&fit=crop&q=80&w=800',
    count: 124,
    enumValue: OfferCategory.SERVICOS
  },
  { 
    id: 'educacao', 
    title: 'Educação', 
    desc: 'Cursos, Idiomas, Mentorias e Treinamentos.', 
    icon: GraduationCap, 
    image: 'https://images.unsplash.com/photo-1523050338392-06ba54431b72?auto=format&fit=crop&q=80&w=800',
    count: 45,
    enumValue: OfferCategory.EDUCACAO
  },
  { 
    id: 'experiencias', 
    title: 'Experiências', 
    desc: 'Viagens, Eventos e Momentos Únicos.', 
    icon: Star, 
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800',
    count: 38,
    enumValue: OfferCategory.EXPERIENCIAS
  },
  { 
    id: 'lazer', 
    title: 'Lazer', 
    desc: 'Parques, Cinemas, Teatros e Diversão.', 
    icon: PartyPopper, 
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800',
    count: 27,
    enumValue: OfferCategory.LAZER
  },
  { 
    id: 'pets', 
    title: 'Pets', 
    desc: 'Petshops, Clínicas e Produtos para Animais.', 
    icon: Dog, 
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800',
    count: 42,
    enumValue: OfferCategory.PETS
  },
  { 
    id: 'compras', 
    title: 'Compras Online', 
    desc: 'E-commerce e Produtos Variados.', 
    icon: ShoppingCart, 
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=800',
    count: 95,
    enumValue: OfferCategory.COMPRAS
  },
  { 
    id: 'saude', 
    title: 'Saúde', 
    desc: 'Clínicas, Médicos e Bem-estar Físico.', 
    icon: Activity, 
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800',
    count: 112,
    enumValue: OfferCategory.SAUDE
  },
  { 
    id: 'tech', 
    title: 'Tecnologia', 
    desc: 'Informática, Celulares e Inovação.', 
    icon: Laptop, 
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
    count: 63,
    enumValue: OfferCategory.TECH
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

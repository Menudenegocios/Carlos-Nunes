import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Edit2, Trash2, X, ImageIcon, Link as LinkIcon, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabaseService } from '../services/supabaseService';
import { Offer, OfferCategory } from '../types';
import { Link } from 'react-router-dom';
import { OfferCard } from '../components/OfferCard';

export const MyOffers = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    store_name: '',
    title: '',
    discount_display: '',
    description: '',
    category: OfferCategory.NEGOCIOS_LOCAIS,
    image_url: '',
    logo_url: '',
    whatsapp: '',
    website: ''
  });

  useEffect(() => {
    if (user) {
      loadOffers();
    }
  }, [user]);

  const loadOffers = async () => {
    try {
      const data = await supabaseService.getOffers();
      setOffers(data.filter((o: any) => o.user_id === user!.id));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (offer: any) => {
    setFormData({
      store_name: offer.social_links?.store_name || offer.store_name || '',
      title: offer.title || '',
      discount_display: offer.social_links?.discount_display || offer.discount_display || '',
      description: offer.description || '',
      category: (offer.category as OfferCategory) || OfferCategory.NEGOCIOS_LOCAIS,
      image_url: offer.image_url || '',
      logo_url: offer.social_links?.store_logo_url || offer.logo_url || offer.store_logo_url || '',
      whatsapp: offer.social_links?.whatsapp || '',
      website: offer.social_links?.website || ''
    });
    setEditingId(offer.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!user || !window.confirm('Tem certeza que deseja excluir esta oferta?')) return;
    try {
      await supabaseService.deleteOffer(id);
      setOffers(prev => prev.filter(o => o.id !== id));
    } catch (error) {
      alert('Erro ao excluir oferta.');
    }
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      const commonData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        image_url: formData.image_url,
        logo_url: formData.logo_url,
        social_links: {
          whatsapp: formData.whatsapp,
          website: formData.website,
          store_name: formData.store_name,
          discount_display: formData.discount_display,
          store_logo_url: formData.logo_url
        }
      };

      if (isEditing && editingId) {
        await supabaseService.updateOffer(editingId, commonData);
        setOffers(prev => prev.map(o => o.id === editingId ? { ...o, ...commonData } as Offer : o));
      } else {
        const newOffer = await supabaseService.createOffer({ ...commonData, user_id: user.id } as any);
        setOffers(prev => [newOffer, ...prev]);
      }
      
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      alert(isEditing ? 'Erro ao atualizar oferta' : 'Erro ao criar oferta');
    }
  };

  const resetForm = () => {
    setFormData({
      store_name: '',
      title: '',
      discount_display: '',
      description: '',
      category: OfferCategory.NEGOCIOS_LOCAIS,
      image_url: '',
      logo_url: '',
      whatsapp: '',
      website: ''
    });
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'image_url' | 'logo_url') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const canCreateAds = true;

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-extrabold mb-4 flex items-center gap-3">
             <ShoppingBag className="w-10 h-10 -rotate-12 text-yellow-300" />
             Minhas Ofertas
          </h1>
          <p className="text-xl text-blue-100">
            Gerencie suas ofertas e benefícios no Clube de Vantagens Menu Club.
          </p>
         </div>
         
         <button 
           onClick={openCreateModal}
           className="relative z-10 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition-colors flex items-center gap-2 whitespace-nowrap"
         >
           <Plus className="w-5 h-5" /> Criar Nova Oferta
         </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Carregando...</div>
      ) : offers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900">Nenhuma oferta ativa</h3>
          <p className="text-gray-500 mb-6">Comece a divulgar o benefício da sua rede ou negócio.</p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center px-6 py-3 rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Criar Primeira Oferta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map(offer => (
            <div key={offer.id} className="relative group">
              <OfferCard offer={offer} />
              
              <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(offer)}
                  className="p-2 bg-white text-gray-700 rounded-full shadow-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  title="Editar"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(offer.id)}
                  className="p-2 bg-white text-red-500 rounded-full shadow-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Creating/Editing Offer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl leading-6 font-bold text-gray-900" id="modal-title">
                      {isEditing ? 'Editar Benefício Menu Club' : 'Cadastrar Benefício Menu Club'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">Configure os detalhes da sua empresa e o desconto oferecido.</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                     <X className="h-6 w-6" />
                  </button>
                </div>
                
                <form id="offerForm" onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* SECTION 1: INFO BASICA */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b pb-2">Informações da Rede/Empresa</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
                        <input
                          required
                          type="text"
                          placeholder="Ex: Farmácias São João"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={formData.store_name}
                          onChange={e => setFormData({ ...formData, store_name: e.target.value })}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Benefício / Desconto</label>
                        <input
                          required
                          type="text"
                          placeholder="Ex: 20% OFF"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={formData.discount_display}
                          onChange={e => setFormData({ ...formData, discount_display: e.target.value })}
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Título da Campanha/Oferta</label>
                        <input
                          required
                          type="text"
                          placeholder="Ex: Desconto exclusivo em medicamentos"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={formData.title}
                          onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Categoria</label>
                        <select
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={formData.category}
                          onChange={e => setFormData({ ...formData, category: e.target.value as OfferCategory })}
                        >
                          {Object.values(OfferCategory).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: MIDIA E DETALHES */}
                  <div className="space-y-4">
                     <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b pb-2">Mídias e Detalhes</h4>
                     
                     {/* Visuals */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Cover Image Upload */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">Imagem de Capa / Banners</label>
                          <div className="space-y-3">
                            {formData.image_url && (
                              <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-300 group">
                                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setFormData({...formData, image_url: ''})}
                                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                            
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'image_url')}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 cursor-pointer"
                              />
                            </div>
                            <div className="relative flex py-1 items-center">
                              <div className="flex-grow border-t border-gray-200"></div>
                              <span className="flex-shrink-0 mx-2 text-gray-400 text-xs">OU URL</span>
                              <div className="flex-grow border-t border-gray-200"></div>
                            </div>
                            <input
                              type="url"
                              placeholder="https://exemplo.com/imagem.jpg"
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-xs focus:ring-indigo-500 focus:border-indigo-500"
                              value={formData.image_url}
                              onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                            />
                          </div>
                        </div>

                        {/* Logo Upload */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">Logotipo da Empresa</label>
                          <div className="space-y-3">
                            {formData.logo_url && (
                              <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-300 group mx-auto">
                                <img src={formData.logo_url} alt="Logo Preview" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setFormData({...formData, logo_url: ''})}
                                  className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            )}
                            
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'logo_url')}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 cursor-pointer"
                              />
                            </div>
                            <div className="relative flex py-1 items-center">
                              <div className="flex-grow border-t border-gray-200"></div>
                              <span className="flex-shrink-0 mx-2 text-gray-400 text-xs">OU URL</span>
                              <div className="flex-grow border-t border-gray-200"></div>
                            </div>
                            <input
                              type="url"
                              placeholder="https://..."
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-xs focus:ring-indigo-500 focus:border-indigo-500"
                              value={formData.logo_url}
                              onChange={e => setFormData({ ...formData, logo_url: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Social Media */}
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                      <h4 className="text-sm font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" /> Resgate e Contato
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">WhatsApp (Para dúvidas ou reservas)</label>
                          <input
                            type="text"
                            placeholder="5511999999999"
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={formData.whatsapp}
                            onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Link de Resgate/Website</label>
                          <input
                            type="url"
                            placeholder="https://..."
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={formData.website}
                            onChange={e => setFormData({ ...formData, website: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Regras de Uso & Descrição</label>
                        <textarea
                          required
                          rows={4}
                          placeholder="Ex: Desconto válido de segunda a sexta. Apresente este cupom no caixa..."
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={formData.description}
                          onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                </form>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                <button
                  type="submit"
                  form="offerForm"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {isEditing ? 'Salvar Alterações' : 'Publicar Benefício'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

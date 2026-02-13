
import React, { useEffect, useState } from 'react';
import { mockBackend } from '../services/mockBackend';
import { Offer, OfferCategory } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Trash2, X, Image as ImageIcon, Link as LinkIcon, Edit2, Youtube, Calendar, Video, CheckCircle, MapPin, Clock, AlertCircle, ShoppingBag, Lock, Crown } from 'lucide-react';
import { OfferCard } from '../components/OfferCard';
import { Link } from 'react-router-dom';

export const MyOffers: React.FC = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Edit Mode State - Updated to string to match Offer.id
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: OfferCategory.SERVICOS_PROFISSIONAIS,
    city: '',
    price: '',
    imageUrl: '',
    videoUrl: '', 
    logoUrl: '',
    instagram: '',
    whatsapp: '',
    website: '',
    // Scheduling Config
    schedulingEnabled: false,
    schedulingDuration: 60,
    schedulingType: 'google_meet', // google_meet | in_person
    googleCalendarConnected: false
  });

  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);

  useEffect(() => {
    if (user) loadMyOffers();
  }, [user]);

  const loadMyOffers = async () => {
    if (!user) return;
    try {
      const data = await mockBackend.getMyOffers(user.id);
      setOffers(data);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (offer: Offer) => {
    setFormData({
      title: offer.title,
      description: offer.description,
      category: offer.category as OfferCategory,
      city: offer.city,
      price: offer.price || '',
      imageUrl: offer.imageUrl || '',
      videoUrl: offer.videoUrl || '',
      logoUrl: offer.logoUrl || '',
      instagram: offer.socialLinks?.instagram || '',
      whatsapp: offer.socialLinks?.whatsapp || '',
      website: offer.socialLinks?.website || '',
      schedulingEnabled: offer.scheduling?.enabled || false,
      schedulingDuration: offer.scheduling?.durationMinutes || 60,
      schedulingType: offer.scheduling?.meetingType || 'google_meet',
      googleCalendarConnected: offer.scheduling?.googleCalendarConnected || false,
    });
    setEditingId(offer.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Fixed parameter type to string to match Offer.id
  const handleDelete = async (id: string) => {
    if (!user || !window.confirm('Tem certeza que deseja excluir esta oferta?')) return;
    try {
      await mockBackend.deleteOffer(id, user.id);
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

  const connectGoogleCalendar = () => {
    setIsConnectingGoogle(true);
    // Simulate API delay
    setTimeout(() => {
      setFormData(prev => ({ ...prev, googleCalendarConnected: true }));
      setIsConnectingGoogle(false);
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      const commonData = {
        title: formData.title,
        description: formData.description,
        category: formData.category as OfferCategory,
        city: formData.city,
        price: formData.price,
        imageUrl: formData.imageUrl,
        videoUrl: formData.videoUrl,
        logoUrl: formData.logoUrl,
        socialLinks: {
          instagram: formData.instagram,
          whatsapp: formData.whatsapp,
          website: formData.website
        },
        scheduling: formData.schedulingEnabled ? {
          enabled: true,
          durationMinutes: Number(formData.schedulingDuration),
          meetingType: formData.schedulingType as 'google_meet' | 'in_person',
          googleCalendarConnected: formData.googleCalendarConnected,
          availability: 'Seg-Sex, 09:00 - 18:00' // Default simplified availability
        } : undefined
      };

      if (isEditing && editingId) {
        // Update
        const updatedOffer = await mockBackend.updateOffer(user.id, editingId, commonData);
        setOffers(prev => prev.map(o => o.id === editingId ? updatedOffer : o));
      } else {
        // Create
        const newOffer = await mockBackend.createOffer(user.id, commonData);
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
      title: '',
      description: '',
      category: OfferCategory.SERVICOS_PROFISSIONAIS,
      city: '',
      price: '',
      imageUrl: '',
      videoUrl: '',
      logoUrl: '',
      instagram: '',
      whatsapp: '',
      website: '',
      schedulingEnabled: false,
      schedulingDuration: 60,
      schedulingType: 'google_meet',
      googleCalendarConnected: false
    });
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'imageUrl' | 'logoUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Only Freelancers and Local Businesses can create ads in the feed
  const canCreateAds = user && (user.plan === 'freelancers' || user.plan === 'negocios');

  return (
    <div className="space-y-8">
      {/* Hero Header (Matching Coupons Style) */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-extrabold mb-4 flex items-center gap-3">
             <ShoppingBag className="w-10 h-10 -rotate-12 text-yellow-300" />
             Meus Anúncios
          </h1>
          <p className="text-xl text-blue-100">
            Gerencie seus anúncios de destaque no feed principal.
          </p>
         </div>
         
         {canCreateAds ? (
           <button 
             onClick={openCreateModal}
             className="relative z-10 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition-colors flex items-center gap-2 whitespace-nowrap"
           >
             <Plus className="w-5 h-5" /> Criar Novo Anúncio
           </button>
         ) : (
           <Link 
             to="/plans"
             className="relative z-10 bg-white/20 backdrop-blur border border-white/40 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-white/30 transition-colors flex items-center gap-2 whitespace-nowrap"
           >
             <Crown className="w-5 h-5 text-yellow-300" /> Ativar Anúncios
           </Link>
         )}
      </div>

      {!canCreateAds && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
                 <Lock className="w-6 h-6" />
              </div>
              <div>
                 <h3 className="text-lg font-bold text-yellow-800">Recurso de Freelancers e Negócios</h3>
                 <p className="text-yellow-700 text-sm">O plano "Profissionais" foca no seu Perfil Digital. Para criar anúncios ativos no feed e receber orçamentos diretos, faça o upgrade.</p>
              </div>
           </div>
           <Link to="/plans" className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-yellow-700 whitespace-nowrap">
              Ver Planos
           </Link>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">Carregando...</div>
      ) : offers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900">Nenhuma oferta ativa</h3>
          
          {canCreateAds ? (
            <>
              <p className="text-gray-500 mb-6">Comece a divulgar seu negócio agora mesmo.</p>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center px-6 py-3 rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Criar Primeira Oferta
              </button>
            </>
          ) : (
            <p className="text-gray-500 mb-6">Faça o upgrade para anunciar seus serviços.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map(offer => (
            <div key={offer.id} className="relative group">
              <OfferCard offer={offer} />
              
              {canCreateAds && (
                <div className="absolute top-4 right-4 z-20 flex gap-2">
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
              )}
              
              {offer.scheduling?.enabled && (
                 <div className="absolute top-4 left-4 z-20">
                   <span className="bg-blue-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                     <Calendar className="w-3 h-3" /> Agendável
                   </span>
                 </div>
              )}
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
                      {isEditing ? 'Editar Oferta' : 'Criar Nova Oferta'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">Preencha os detalhes do seu anúncio.</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <form id="offerForm" onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* SECTION 1: INFO BASICA */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b pb-2">Informações Básicas</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Título do Anúncio</label>
                        <input
                          required
                          type="text"
                          placeholder="Ex: Consultoria de Marketing Digital"
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

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Cidade</label>
                        <input
                          required
                          type="text"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={formData.city}
                          onChange={e => setFormData({ ...formData, city: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: AGENDAMENTO (NEW) */}
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100 space-y-6">
                    <div className="flex items-center justify-between">
                       <h4 className="text-base font-bold text-indigo-900 flex items-center gap-2">
                         <Calendar className="w-5 h-5 text-indigo-600" /> Agendamento & Integrações
                       </h4>
                       
                       <label className="flex items-center cursor-pointer select-none">
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              className="sr-only" 
                              checked={formData.schedulingEnabled}
                              onChange={e => setFormData({ ...formData, schedulingEnabled: e.target.checked })}
                            />
                            <div className={`block w-12 h-7 rounded-full transition-colors shadow-inner ${formData.schedulingEnabled ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                            <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full shadow-sm transition-transform duration-200 ${formData.schedulingEnabled ? 'transform translate-x-5' : ''}`}></div>
                          </div>
                          <div className="ml-3 text-sm font-medium text-gray-700">
                            Ativar Agendamento
                          </div>
                        </label>
                    </div>
                    
                    {formData.schedulingEnabled && (
                      <div className="space-y-6 animate-[fade-in-down_0.3s_ease-out]">
                        
                        {/* Integration Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* Google Calendar Card */}
                          <div className={`border rounded-xl p-4 transition-all relative overflow-hidden ${formData.googleCalendarConnected ? 'bg-white border-green-200 shadow-sm' : 'bg-white border-gray-200'}`}>
                             {formData.googleCalendarConnected && (
                               <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">CONECTADO</div>
                             )}
                             <div className="flex flex-col h-full justify-between">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="p-2 bg-blue-50 rounded-full">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" className="w-8 h-8" alt="Google Calendar" />
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-gray-900 text-sm">Google Calendar</h5>
                                    <p className="text-xs text-gray-500 leading-tight">Sincronize sua agenda para evitar conflitos.</p>
                                  </div>
                                </div>
                                <button 
                                   type="button"
                                   onClick={connectGoogleCalendar}
                                   disabled={formData.googleCalendarConnected || isConnectingGoogle}
                                   className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                     formData.googleCalendarConnected 
                                       ? 'bg-green-50 text-green-700 cursor-default' 
                                       : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                                   }`}
                                 >
                                   {isConnectingGoogle ? 'Conectando...' : formData.googleCalendarConnected ? (
                                     <> <CheckCircle className="w-3 h-3" /> Conta Vinculada </>
                                   ) : 'Conectar Agora'}
                                 </button>
                             </div>
                          </div>

                          {/* Google Meet Card */}
                          <div className={`border rounded-xl p-4 transition-all relative ${formData.googleCalendarConnected ? 'bg-white border-indigo-200 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-70'}`}>
                             <div className="flex flex-col h-full justify-between">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="p-2 bg-gray-50 rounded-full border border-gray-100">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/9/9b/Google_Meet_icon_%282020%29.svg" className="w-8 h-8" alt="Google Meet" />
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-gray-900 text-sm">Google Meet</h5>
                                    <p className="text-xs text-gray-500 leading-tight">Gera links de reunião automaticamente.</p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-center h-full">
                                   {formData.googleCalendarConnected ? (
                                      <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                                        <CheckCircle className="w-3 h-3" /> Ativo via Calendar
                                      </div>
                                   ) : (
                                      <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
                                        <AlertCircle className="w-3 h-3" /> Requer Calendar
                                      </div>
                                   )}
                                </div>
                             </div>
                          </div>

                        </div>

                        {/* Meeting Settings */}
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                          <h5 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Configurações da Sessão</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Local da Reunião</label>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setFormData({...formData, schedulingType: 'google_meet'})}
                                  className={`flex-1 py-2.5 px-3 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                                    formData.schedulingType === 'google_meet' 
                                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                  }`}
                                >
                                  <Video className="w-4 h-4" /> Online (Meet)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setFormData({...formData, schedulingType: 'in_person'})}
                                  className={`flex-1 py-2.5 px-3 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                                    formData.schedulingType === 'in_person' 
                                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                  }`}
                                >
                                  <MapPin className="w-4 h-4" /> Presencial
                                </button>
                              </div>
                            </div>

                            <div>
                               <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Duração</label>
                               <div className="relative">
                                 <Clock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                 <select 
                                    className="w-full pl-9 border-gray-300 rounded-lg text-sm h-[42px] focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.schedulingDuration}
                                    onChange={e => setFormData({...formData, schedulingDuration: Number(e.target.value)})}
                                 >
                                    <option value={30}>30 minutos</option>
                                    <option value={60}>60 minutos (1 hora)</option>
                                    <option value={90}>90 minutos (1h 30m)</option>
                                    <option value={120}>120 minutos (2 horas)</option>
                                 </select>
                               </div>
                            </div>

                          </div>
                          
                          {formData.schedulingType === 'google_meet' && !formData.googleCalendarConnected && (
                             <div className="mt-4 text-xs text-amber-700 bg-amber-50 border border-amber-100 p-3 rounded-lg flex items-start gap-2">
                               <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                               <p>Você selecionou "Online (Meet)", mas ainda não conectou o Google Calendar. Para gerar links automáticos, por favor conecte sua conta acima.</p>
                             </div>
                          )}
                        </div>

                      </div>
                    )}
                  </div>

                  {/* SECTION 3: MIDIA E DETALHES */}
                  <div className="space-y-4">
                     <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b pb-2">Mídia & Detalhes</h4>
                     
                     {/* Visuals */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" /> Mídia
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Cover Image Upload */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">Imagem de Capa</label>
                          <div className="space-y-3">
                            {formData.imageUrl && (
                              <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-300 group">
                                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setFormData({...formData, imageUrl: ''})}
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
                                onChange={(e) => handleImageUpload(e, 'imageUrl')}
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
                              value={formData.imageUrl}
                              onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                            />
                          </div>

                          {/* YouTube Input */}
                          <div className="mt-4">
                            <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                              <Youtube className="w-3 h-3 text-red-600" /> Vídeo do YouTube (Opcional)
                            </label>
                            <input
                              type="url"
                              placeholder="https://youtube.com/watch?v=..."
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-xs focus:ring-indigo-500 focus:border-indigo-500"
                              value={formData.videoUrl}
                              onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                            />
                          </div>
                        </div>

                        {/* Logo Upload */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-2">Logotipo</label>
                          <div className="space-y-3">
                            {formData.logoUrl && (
                              <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-300 group mx-auto">
                                <img src={formData.logoUrl} alt="Logo Preview" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setFormData({...formData, logoUrl: ''})}
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
                                onChange={(e) => handleImageUpload(e, 'logoUrl')}
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
                              value={formData.logoUrl}
                              onChange={e => setFormData({ ...formData, logoUrl: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Social Media */}
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                      <h4 className="text-sm font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" /> Redes Sociais & Contato
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Instagram (Usuário)</label>
                          <div className="flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-xs">@</span>
                            <input
                              type="text"
                              placeholder="usuario"
                              className="flex-1 min-w-0 block w-full px-3 py-1.5 rounded-none rounded-r-md border border-gray-300 sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
                              value={formData.instagram}
                              onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">WhatsApp (Apenas números)</label>
                          <input
                            type="text"
                            placeholder="5511999999999"
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={formData.whatsapp}
                            onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Website</label>
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

                    {/* Description & Price */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Descrição</label>
                        <textarea
                          required
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={formData.description}
                          onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Preço (Opcional)</label>
                        <input
                          type="text"
                          placeholder="Ex: R$ 50,00"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={formData.price}
                          onChange={e => setFormData({ ...formData, price: e.target.value })}
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
                  {isEditing ? 'Salvar Alterações' : 'Publicar Anúncio'}
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


import React, { useEffect, useState } from 'react';
import { mockBackend } from '../services/mockBackend';
import { Offer, Coupon, Product } from '../types';
import { Ticket, Clock, CheckCircle, Zap, Plus, X, AlertCircle, Edit2, Trash2, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CouponWithOffer extends Coupon {
  offer: Offer;
}

export const Coupons: React.FC = () => {
  /* Fix: Use refreshProfile instead of login to update user state after redemption */
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState<CouponWithOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponWithOffer | null>(null);
  const [redeeming, setRedeeming] = useState(false);

  // Creation/Edit State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  
  const [myOffers, setMyOffers] = useState<Offer[]>([]);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  
  const [newCouponData, setNewCouponData] = useState({
    offerId: '',
    code: '',
    title: '',
    discount: '',
    pointsReward: 50,
    description: ''
  });

  useEffect(() => {
    loadCoupons();
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadCoupons = async () => {
    try {
      const offers = await mockBackend.getOffers();
      const allCoupons: CouponWithOffer[] = [];
      
      offers.forEach((offer: Offer) => {
        if (offer.coupons && offer.coupons.length > 0) {
          offer.coupons.forEach((coupon: Coupon) => {
            allCoupons.push({ ...coupon, offer });
          });
        }
      });
      
      setCoupons(allCoupons);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    if (!user) return;
    const [offers, prods] = await Promise.all([
      mockBackend.getMyOffers(user.id),
      mockBackend.getProducts(user.id)
    ]);
    setMyOffers(offers);
    setMyProducts(prods);
  };

  const handleRedeem = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!selectedCoupon) return;

    setRedeeming(true);
    try {
      /* Fix: mockBackend.redeemCoupon now correctly defined */
      await mockBackend.redeemCoupon(
        user.id, 
        selectedCoupon.id, 
        selectedCoupon.pointsReward || 0
      );
      /* Fix: Incorrect login call replaced with refreshProfile */
      await refreshProfile();
      alert(`Cupom ${selectedCoupon.code} ativado! Você ganhou ${selectedCoupon.pointsReward} pontos.`);
      setSelectedCoupon(null);
    } catch (error) {
      alert('Erro ao ativar cupom.');
    } finally {
      setRedeeming(false);
    }
  };

  const openCreateModal = () => {
    setNewCouponData({
      offerId: '',
      code: '',
      title: '',
      discount: '',
      pointsReward: 50,
      description: ''
    });
    setIsEditing(false);
    setEditingCouponId(null);
    setIsCreateModalOpen(true);
  };

  const handleEditCoupon = (coupon: CouponWithOffer) => {
    setNewCouponData({
      offerId: coupon.offer.id,
      code: coupon.code,
      title: coupon.title,
      discount: coupon.discount,
      pointsReward: coupon.pointsReward || 0,
      description: coupon.description || ''
    });
    setIsEditing(true);
    setEditingCouponId(coupon.id);
    setIsCreateModalOpen(true);
  };

  const handleDeleteCoupon = async (coupon: CouponWithOffer) => {
     if (!user || !window.confirm('Tem certeza que deseja excluir este cupom?')) return;
     try {
       /* Fix: mockBackend.deleteCoupon now defined */
       await mockBackend.deleteCoupon(coupon.id, user.id);
       setCoupons(prev => prev.filter(c => c.id !== coupon.id));
     } catch (error) {
       alert('Erro ao excluir cupom.');
     }
  };

  const handleCreateOrUpdateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!newCouponData.offerId) {
      alert("Selecione um Produto ou Serviço para vincular o cupom.");
      return;
    }

    try {
      const commonData = {
        code: newCouponData.code.toUpperCase(),
        title: newCouponData.title,
        discount: newCouponData.discount,
        pointsReward: Number(newCouponData.pointsReward),
        description: newCouponData.description
      };

      if (isEditing && editingCouponId) {
        /* Fix: updateCoupon now defined */
        await mockBackend.updateCoupon(editingCouponId, user.id, { ...commonData, userId: user.id, type: 'percentage', active: true });
      } else {
        /* Fix: addCoupon now defined */
        await mockBackend.createCoupon({ ...commonData, userId: user.id, type: 'percentage', active: true });
      }
      
      setIsCreateModalOpen(false);
      loadCoupons();
    } catch (err) {
      alert("Erro ao salvar cupom.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-extrabold mb-4 flex items-center gap-3">
             <Ticket className="w-10 h-10 rotate-12 text-yellow-300" />
             Galeria de Cupons
          </h1>
          <p className="text-xl text-pink-100">
            Economize nos seus negócios favoritos e ganhe pontos para trocar por prêmios incríveis!
          </p>
         </div>
         
         {user && (
           <button 
             onClick={openCreateModal}
             className="relative z-10 bg-white text-pink-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-pink-50 transition-colors flex items-center gap-2 whitespace-nowrap"
           >
             <Plus className="w-5 h-5" /> Criar Novo Cupom
           </button>
         )}
      </div>

      {/* Coupon Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           [1,2,3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse"></div>)
        ) : coupons.length === 0 ? (
           <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <Ticket className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-6">Nenhum cupom disponível no momento.</p>
              {user && (
                <button 
                  onClick={openCreateModal}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" /> Criar Novo Cupom
                </button>
              )}
           </div>
        ) : (
          coupons.map(coupon => (
            <div key={coupon.id} className="relative group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              {user && user.id === coupon.offer.userId && (
                <div className="absolute top-2 right-2 z-20 flex gap-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleEditCoupon(coupon); }}
                    className="p-1.5 bg-white text-gray-700 rounded-full shadow hover:bg-gray-100"
                    title="Editar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteCoupon(coupon); }}
                    className="p-1.5 bg-red-600 text-white rounded-full shadow hover:bg-red-700"
                    title="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="bg-gray-900 p-4 text-white flex justify-between items-center relative">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white p-0.5">
                       <img src={coupon.offer.logoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${coupon.offer.title}`} className="w-full h-full rounded-full" alt="Logo" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-200">{coupon.offer.title}</h3>
                      <p className="text-xs text-gray-400">{coupon.offer.city}</p>
                    </div>
                 </div>
                 <div className="absolute bottom-0 left-0 w-full h-1 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSI1IiB2aWV3Qm94PSIwIDAgMTAgNSI+PHBhdGggZD0iTTAgMGM1IDAgNSA1IDEwIDVWMHoiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=')] bg-repeat-x"></div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-center text-center">
                 <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold text-xs mb-3 mx-auto">
                    {coupon.discount}
                 </span>
                 <h2 className="text-xl font-bold text-gray-900 mb-2">{coupon.title}</h2>
                 <p className="text-gray-500 text-sm mb-4 line-clamp-2">{coupon.description}</p>
                 
                 <div className="mt-auto pt-4 border-t border-dashed border-gray-200 flex justify-between items-center text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-500" />
                      Ganhe +{coupon.pointsReward} pts
                    </span>
                    <span className="flex items-center gap-1">
                       <Clock className="w-3 h-3" />
                       Expira em breve
                    </span>
                 </div>
              </div>

              <button 
                onClick={() => setSelectedCoupon(coupon)}
                className="w-full py-3 bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 transition-colors border-t border-indigo-100"
              >
                PEGAR CUPOM
              </button>
            </div>
          ))
        )}
      </div>

      {/* Redeem Modal */}
      {selectedCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedCoupon(null)}></div>
          <div className="relative bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden animate-[scale-in_0.2s_ease-out]">
             <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 text-center text-white">
                <h3 className="text-2xl font-bold mb-1">{selectedCoupon.discount}</h3>
                <p className="text-indigo-200 text-sm">{selectedCoupon.title}</p>
             </div>
             <div className="p-6 text-center space-y-6">
                <p className="text-gray-600 text-sm">
                   Apresente este código no estabelecimento <strong>{selectedCoupon.offer.title}</strong> para garantir seu desconto.
                </p>
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 font-mono text-2xl font-bold tracking-widest text-gray-800 select-all">
                   {selectedCoupon.code}
                </div>
                <div className="text-xs text-gray-500">
                   Ao utilizar este cupom, você ganhará automaticamente <strong className="text-yellow-600">{selectedCoupon.pointsReward} pontos</strong> no Clube de Vantagens.
                </div>
                <button 
                  onClick={handleRedeem}
                  disabled={redeeming}
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 active:transform active:scale-95 transition-all flex justify-center items-center gap-2"
                >
                  {redeeming ? 'Validando...' : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      CONFIRMAR USO DO CUPOM
                    </>
                  )}
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Create/Edit Coupon Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">{isEditing ? 'Editar Cupom' : 'Cadastro de Novo Cupom'}</h3>
                <button onClick={() => setIsCreateModalOpen(false)}><X className="text-gray-400 hover:text-gray-600" /></button>
             </div>
             
             <form onSubmit={handleCreateOrUpdateCoupon} className="p-6 space-y-4">
                {myOffers.length === 0 && myProducts.length === 0 ? (
                  <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg flex gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">Você precisa cadastrar um Produto ou Serviço no catálogo primeiro para vincular um cupom.</p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Nome do Cupom</label>
                      <input 
                        required
                        type="text"
                        placeholder="Ex: Desconto de Inauguração"
                        className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-pink-500 focus:border-pink-500"
                        value={newCouponData.title}
                        onChange={e => setNewCouponData({...newCouponData, title: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Código (Ex: BEMVINDO10)</label>
                          <input 
                            required
                            type="text"
                            className="w-full border-gray-300 rounded-lg p-2.5 uppercase focus:ring-pink-500 focus:border-pink-500"
                            value={newCouponData.code}
                            onChange={e => setNewCouponData({...newCouponData, code: e.target.value})}
                          />
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Desconto (Ex: 20% OFF)</label>
                          <input 
                            required
                            type="text"
                            placeholder="Ex: R$ 10 ou 10%"
                            className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-pink-500 focus:border-pink-500"
                            value={newCouponData.discount}
                            onChange={e => setNewCouponData({...newCouponData, discount: e.target.value})}
                          />
                       </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Descrição / Regras de Uso</label>
                      <textarea 
                        required
                        rows={2}
                        placeholder="Ex: Válido apenas para compras acima de R$ 50."
                        className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-pink-500 focus:border-pink-500"
                        value={newCouponData.description}
                        onChange={e => setNewCouponData({...newCouponData, description: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Produto ou Serviço Vinculado</label>
                      <select 
                        required
                        disabled={isEditing}
                        className="w-full border-gray-300 rounded-lg p-2.5 disabled:bg-gray-100 focus:ring-pink-500 focus:border-pink-500"
                        value={newCouponData.offerId}
                        onChange={e => setNewCouponData({...newCouponData, offerId: e.target.value})}
                      >
                        <option value="">Selecione o item...</option>
                        {myOffers.map(o => (
                          <option key={o.id} value={o.id}>Serviço: {o.title}</option>
                        ))}
                        {myProducts.map(p => (
                          <option key={p.id} value={p.id}>Produto: {p.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="bg-pink-50 p-4 rounded-xl border border-pink-100">
                       <label className="block text-[10px] font-black text-pink-600 uppercase tracking-widest mb-2">Recompensa para o Cliente</label>
                       <div className="flex items-center gap-4">
                          <div className="p-2 bg-white rounded-lg shadow-sm">
                             <Zap className="w-5 h-5 text-yellow-500" />
                          </div>
                          <div className="flex-1">
                             <input 
                                type="number"
                                className="w-20 border-gray-200 rounded-lg p-1.5 font-bold"
                                value={newCouponData.pointsReward}
                                onChange={e => setNewCouponData({...newCouponData, pointsReward: Number(e.target.value)})}
                             />
                             <span className="ml-2 text-sm font-bold text-pink-700">Pontos no Clube</span>
                          </div>
                       </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-pink-600 text-white font-black py-4 rounded-2xl hover:bg-pink-700 transition-all shadow-xl shadow-pink-200"
                    >
                      {isEditing ? 'SALVAR ALTERAÇÕES' : 'CRIAR NOVO CUPOM'}
                    </button>
                  </>
                )}
             </form>
          </div>
        </div>
      )}
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { B2BOffer } from '../types';
import { 
  Handshake, Plus, ShieldCheck, Zap, 
  MessageCircle, Info, Lock, Crown, 
  X, Save, RefreshCw, Home as HomeIcon, Search, ArrowRight
} from 'lucide-react';
import { SectionLanding } from '../components/SectionLanding';

export const MarketplaceB2B: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'browse' | 'my-deals'>('home');
  const [offers, setOffers] = useState<B2BOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { loadOffers(); }, []);

  const loadOffers = async () => {
    setIsLoading(true);
    try {
      const data = await mockBackend.getB2BOffers();
      setOffers(data);
    } finally { setIsLoading(false); }
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4 px-4 animate-[fade-in_0.4s_ease-out]">
      {/* Header Estilo Unificado Catálogo */}
      <div className="bg-[#0F172A] dark:bg-black rounded-[3.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-indigo-500/10 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-xl">
                 <Handshake className="h-10 w-10 text-brand-primary" />
              </div>
              <div>
                 <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-2 italic uppercase">
                    Marketplace <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] dark:from-brand-primary dark:to-brand-accent">B2B</span>
                 </h1>
                 <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">PARCERIAS E ACORDOS ENTRE EMPRESÁRIOS LOCAIS.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
               {user.plan === 'negocios' ? (
                  <button onClick={() => setIsModalOpen(true)} className="bg-[#F67C01] text-white px-10 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
                      <Plus className="w-4 h-4" /> CRIAR BENEFÍCIO
                  </button>
               ) : (
                  <div className="bg-white/5 backdrop-blur-md px-6 py-3 rounded-3xl border border-white/10 flex items-center gap-3">
                     <Crown className="w-5 h-5 text-yellow-400" />
                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Recurso Exclusivo Pro</span>
                  </div>
               )}
            </div>
          </div>

          {/* Abas Padronizadas - Alinhadas à Esquerda na Linha Inferior */}
          <div className="flex p-1.5 mt-12 bg-white/5 backdrop-blur-md rounded-[2.2rem] border border-white/10 w-fit overflow-x-auto scrollbar-hide gap-1">
              {[
                  { id: 'home', label: 'INÍCIO', desc: 'Como funciona', icon: HomeIcon },
                  { id: 'browse', label: 'EXPLORAR', desc: 'Ver acordos', icon: Handshake },
                  { id: 'my-deals', label: 'MEUS ACORDOS', desc: 'Seus resgates', icon: ShieldCheck }
              ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)} 
                    className={`flex flex-col items-center justify-center min-w-[130px] px-8 py-3 rounded-[1.6rem] transition-all duration-300 whitespace-nowrap ${activeTab === tab.id ? 'bg-[#F67C01] text-white shadow-xl scale-105' : 'text-slate-400 hover:bg-white/10'}`}
                  >
                      <div className="flex items-center gap-2 mb-0.5">
                        <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-white' : 'text-brand-primary'}`} />
                        <span className="font-black text-[10px] tracking-widest uppercase italic">{tab.label}</span>
                      </div>
                      <span className={`text-[8px] font-medium opacity-60 ${activeTab === tab.id ? 'text-white' : ''}`}>{tab.desc}</span>
                  </button>
              ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'home' && (
            <SectionLanding 
                title="Aumente seu lucro com parcerias inteligentes."
                subtitle="Business to Business Connect"
                description="O Marketplace B2B é o espaço exclusivo onde membros do ecossistema Menu ADS se conectam. Economize em custos operacionais e encontre novos clientes corporativos."
                benefits={[
                "Acesse descontos agressivos em serviços essenciais.",
                "Crie redes de networking real com outros empresários.",
                "Capture clientes PJ (Pessoa Jurídica) sem custos de anúncio.",
                "Fortaleça a circulação de valor dentro do seu bairro.",
                "Exclusividade garantida: acordos visíveis apenas para membros."
                ]}
                youtubeId="dQw4w9WgXcQ"
                ctaLabel="VER OPORTUNIDADES"
                onStart={() => setActiveTab('browse')}
                icon={Handshake}
                accentColor="indigo"
            />
        )}
      </div>
    </div>
  );
};

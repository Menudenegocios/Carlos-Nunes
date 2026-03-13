
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';
import { Lead, ExtractorResult, PipelineStage } from '../types';
import { 
  MapPin, Instagram, Building2, Search, Download, 
  Layout, MessageSquare, Bot, Send, Users, 
  ChevronRight, ArrowRight, GripVertical, Plus,
  // Fix: Added missing MessageCircle import
  MessageCircle
} from 'lucide-react';

export const Menuflow: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'extractors' | 'crm' | 'whatsapp'>('crm');

  if (!user) return null;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-gray-100">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Menuflow
          </h1>
          <p className="text-xs text-gray-400">Business Suite v1.0</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <MenuButton 
            active={activeTab === 'crm'} 
            onClick={() => setActiveTab('crm')} 
            icon={Layout} 
            label="CRM & Funil" 
          />
          <MenuButton 
            active={activeTab === 'extractors'} 
            onClick={() => setActiveTab('extractors')} 
            icon={Search} 
            label="Extratores de Leads" 
          />
          <MenuButton 
            active={activeTab === 'whatsapp'} 
            onClick={() => setActiveTab('whatsapp')} 
            icon={MessageSquare} 
            label="WhatsApp & IA" 
          />
        </nav>
        
        {user.plan === 'basic' && ( // Fixed plan check to match User types
          <div className="p-4 bg-gray-800 m-4 rounded-lg">
            <p className="text-xs text-gray-300 mb-2">Upgrade para Pro para automações ilimitadas.</p>
            <button className="w-full text-xs py-1 px-2 bg-indigo-600 rounded text-white font-bold">
              Upgrade
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-6 relative">
        {activeTab === 'crm' && <CRMView />}
        {activeTab === 'extractors' && <ExtractorsView />}
        {activeTab === 'whatsapp' && <WhatsAppView />}
      </div>
    </div>
  );
};

// --- Sub-Components ---

const MenuButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      active ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium text-sm">{label}</span>
  </button>
);

// 1. CRM / KANBAN VIEW
const CRMView = () => {
  const { user } = useAuth(); // Added useAuth hook to get user_id
  const [leads, setLeads] = useState<Lead[]>([]);
  
  useEffect(() => {
    if (user) loadLeads();
  }, [user]);

  const loadLeads = async () => {
    if (!user) return;
    const { data } = await supabase.from('leads').select('*').eq('user_id', user.id);
    // map DB snake_case back to frontend camelCase if necessary, or just cast
    setLeads((data as any) || []);
  };

  const moveLead = async (leadId: string, currentStage: PipelineStage, direction: 'next' | 'prev') => {
    const stages: PipelineStage[] = ['new', 'contacted', 'negotiation', 'closed', 'lost'];
    const idx = stages.indexOf(currentStage);
    const newIdx = direction === 'next' ? idx + 1 : idx - 1;
    
    if (newIdx >= 0 && newIdx < stages.length) {
      const newStage = stages[newIdx];
      await supabase.from('leads').update({ stage: newStage, updated_at: new Date().toISOString() }).eq('id', leadId);
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: newStage } : l));
    }
  };

  const columns: { id: PipelineStage; label: string; color: string }[] = [
    { id: 'new', label: 'Novos Leads', color: 'border-blue-500' },
    { id: 'contacted', label: 'Contatados', color: 'border-yellow-500' },
    { id: 'negotiation', label: 'Em Negociação', color: 'border-purple-500' },
    { id: 'closed', label: 'Fechados', color: 'border-green-500' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pipeline de Vendas</h2>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          <Plus className="w-4 h-4" /> Novo Lead Manual
        </button>
      </div>

      <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
        {columns.map(col => (
          <div key={col.id} className="min-w-[300px] w-full bg-gray-50 rounded-xl border border-gray-200 flex flex-col">
            <div className={`p-4 border-t-4 ${col.color} bg-white rounded-t-xl shadow-sm mb-2`}>
              <h3 className="font-bold text-gray-700 flex justify-between">
                {col.label}
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-500">
                  {leads.filter(l => l.stage === col.id).length}
                </span>
              </h3>
            </div>
            
            <div className="flex-1 p-2 space-y-2 overflow-y-auto">
              {leads.filter(l => l.stage === col.id).map(lead => (
                <div key={lead.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      lead.source === 'maps' ? 'bg-green-100 text-green-700' :
                      lead.source === 'instagram' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {lead.source}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900">{lead.name}</h4>
                  <p className="text-sm text-gray-500 mb-3">{lead.phone}</p>
                  
                  <div className="flex justify-between mt-2 pt-2 border-t border-gray-100">
                    <button 
                      onClick={() => moveLead(lead.id, lead.stage, 'prev')}
                      disabled={col.id === 'new'}
                      className="text-gray-400 hover:text-indigo-600 disabled:opacity-20"
                    >
                      &larr;
                    </button>
                    <button 
                      onClick={() => moveLead(lead.id, lead.stage, 'next')}
                      disabled={col.id === 'closed'}
                      className="text-gray-400 hover:text-indigo-600 disabled:opacity-20"
                    >
                      &rarr;
                    </button>
                  </div>
                </div>
              ))}
              {leads.filter(l => l.stage === col.id).length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm italic">
                  Vazio
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. EXTRACTORS VIEW
const ExtractorsView = () => {
  // Added useAuth to get user info for importing leads
  const { user } = useAuth();
  const [activeExtractor, setActiveExtractor] = useState<'maps' | 'instagram' | 'cnpj' | null>(null);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ExtractorResult[]>([]);
  const [imported, setImported] = useState<string[]>([]);

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeExtractor || !keyword) return;
    
    setLoading(true);
    setResults([]);
    try {
      // Placeholder for future Extractor Edge Function integration
      const data: ExtractorResult[] = [
        { id: 'ext-1', name: 'Leads Exemplo ' + keyword, phone: '551199999999', address: 'Endereço Teste', source: activeExtractor }
      ];
      setResults(data);
    } finally {
      setLoading(false);
    }
  };

  const importToCRM = async () => {
    // FIX: Verify user presence before proceeding with lead mapping
    if (!user) return;
    
    const leadsToAdd: Lead[] = results
      .filter(r => !imported.includes(r.id))
      .map(r => ({
        id: r.id,
        // FIX: Provide missing required user_id property from user context
        user_id: user.id,
        name: r.name,
        phone: r.phone,
        source: r.source,
        stage: 'new',
        notes: `Extraído de ${r.source} - Busca: ${keyword}`
      }));
    
    const dbLeads = leadsToAdd.map(l => ({
      id: l.id,
      user_id: l.user_id, // Map back to snake_case
      name: l.name,
      phone: l.phone,
      source: l.source,
      stage: l.stage,
      notes: l.notes
    }));
    await supabase.from('leads').insert(dbLeads);
    setImported(prev => [...prev, ...leadsToAdd.map(l => l.id)]);
    alert(`${leadsToAdd.length} leads importados para o CRM!`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Máquina de Vendas - Extratores</h2>
      
      {/* Extractor Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ExtractorCard 
          icon={MapPin} 
          title="Google Maps" 
          desc="Extraia telefones e endereços de empresas locais."
          color="text-green-600 bg-green-50"
          active={activeExtractor === 'maps'}
          onClick={() => setActiveExtractor('maps')}
        />
        <ExtractorCard 
          icon={Instagram} 
          title="Instagram" 
          desc="Encontre contatos de perfis comerciais por hashtag."
          color="text-pink-600 bg-pink-50"
          active={activeExtractor === 'instagram'}
          onClick={() => setActiveExtractor('instagram')}
        />
        <ExtractorCard 
          icon={Building2} 
          title="Radar CNPJ" 
          desc="Monitore novas empresas abertas na sua região."
          color="text-blue-600 bg-blue-50"
          active={activeExtractor === 'cnpj'}
          onClick={() => setActiveExtractor('cnpj')}
        />
      </div>

      {/* Extraction Interface */}
      {activeExtractor && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-fade-in">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Search className="w-5 h-5" />
            Configurar Busca ({activeExtractor.toUpperCase()})
          </h3>
          
          <form onSubmit={handleExtract} className="flex gap-4 mb-8">
            <input
              type="text"
              placeholder={
                activeExtractor === 'maps' ? "Ex: Pizzaria em Centro, SP" :
                activeExtractor === 'instagram' ? "Ex: #moda #atacado" : "Ex: CNAE 12345, Cidade X"
              }
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Extraindo...' : 'Iniciar Busca'}
            </button>
          </form>

          {/* Results Table */}
          {results.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">{results.length} contatos encontrados</span>
                <button 
                  onClick={importToCRM}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700"
                >
                  <Download className="w-4 h-4" /> Importar para CRM
                </button>
              </div>
              
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-600 font-medium">
                    <tr>
                      <th className="p-3">Nome</th>
                      <th className="p-3">Telefone</th>
                      <th className="p-3">Endereço/Origem</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r) => (
                      <tr key={r.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="p-3 font-medium">{r.name}</td>
                        <td className="p-3">{r.phone}</td>
                        <td className="p-3 text-gray-500">{r.address}</td>
                        <td className="p-3">
                          {imported.includes(r.id) ? (
                            <span className="text-green-600 font-bold text-xs">Importado</span>
                          ) : (
                            <span className="text-gray-400 text-xs">Pendente</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ExtractorCard = ({ icon: Icon, title, desc, color, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full p-6 rounded-xl border text-left transition-all ${
      active 
        ? 'border-indigo-600 ring-2 ring-indigo-100 shadow-md bg-white' 
        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
    }`}
  >
    <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4`}>
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-500">{desc}</p>
  </button>
);

// 3. WHATSAPP & IA VIEW
const WhatsAppView = () => {
  const [connected, setConnected] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('Você é um assistente de vendas da [Nome da Empresa]. Seu objetivo é agendar uma visita.');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Connection Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          {/* Fix: MessageCircle is now imported */}
          <MessageCircle className="w-6 h-6 text-green-600" />
          Conexão WhatsApp
        </h3>

        {!connected ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-48 h-48 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-gray-500 text-xs">[QR Code Simulado]</span>
            </div>
            <p className="text-sm text-gray-500 mb-4 text-center max-w-xs">
              Abra o WhatsApp no seu celular, vÃ¡ em Aparelhos Conectados e escaneie o código.
            </p>
            <button 
              onClick={() => setConnected(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700"
            >
              Simular Conexão
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-gray-900">Dispositivo Conectado</h4>
            <p className="text-green-600 font-medium mb-6">Online e Pronto para Envios</p>
            <button 
              onClick={() => setConnected(false)}
              className="text-red-500 text-sm hover:underline"
            >
              Desconectar
            </button>
          </div>
        )}
      </div>

      {/* AI Config */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-600" />
            Agente de Atendimento (SDR)
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Configure como a IA deve responder aos leads que entrarem em contato.
          </p>
          
          <label className="block text-sm font-medium text-gray-700 mb-1">Prompt do Sistema (Instruções)</label>
          <textarea 
            rows={5}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 mb-4"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
          />
          
          <div className="flex items-center justify-between">
             <span className="text-xs text-gray-400">Modelo: gemini-3-flash-preview</span>
             <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
               Salvar Configuração
             </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <Send className="w-4 h-4" /> Disparo em Massa
          </h3>
          <p className="text-sm text-purple-100 mb-4">
            Envie campanhas para todos os leads da etapa "Novos" do seu CRM.
          </p>
          <button className="w-full bg-white text-indigo-600 font-bold py-2 rounded-lg hover:bg-gray-50">
            Criar Nova Campanha
          </button>
        </div>
      </div>
    </div>
  );
};

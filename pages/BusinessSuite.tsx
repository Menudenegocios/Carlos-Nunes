
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { Lead, PipelineStage, FinancialEntry, ScheduleItem } from '../types';
import { 
  Layout, 
  DollarSign, 
  Calendar, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  ArrowLeft,
  X,
  Trash2,
  CheckCircle,
  Clock,
  Briefcase,
  Edit3,
  GripVertical,
  Search,
  Filter,
  MoreVertical,
  Phone,
  User as UserIcon,
  Zap,
  // Added missing MessageCircle icon import
  MessageCircle
} from 'lucide-react';

export const BusinessSuite: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'crm' | 'finance' | 'schedule'>('crm');

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 pt-6 px-4">
      {/* Header Centralizado */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 rounded-[2.5rem] shadow-2xl p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="p-3 bg-indigo-500/20 rounded-2xl backdrop-blur-sm border border-indigo-400/20">
                <Layout className="h-8 w-8 text-indigo-300" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">Business Suite</h1>
            </div>
            <p className="text-indigo-200/80 max-w-xl text-lg font-medium leading-relaxed">
               Potencialize sua gestão comercial com ferramentas integradas de vendas, finanças e agenda.
            </p>
          </div>

          {/* Nav Tabs - Modern Look */}
          <div className="flex p-1.5 bg-white/5 backdrop-blur-md rounded-[1.5rem] border border-white/10 shadow-inner">
             {[
               { id: 'crm', label: 'CRM', icon: Briefcase },
               { id: 'finance', label: 'Financeiro', icon: DollarSign },
               { id: 'schedule', label: 'Agenda', icon: Calendar }
             ].map((tab) => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`flex items-center gap-2 px-6 py-3 rounded-[1.2rem] font-bold text-sm transition-all duration-300 ${
                   activeTab === tab.id 
                     ? 'bg-white text-indigo-900 shadow-xl scale-105' 
                     : 'text-indigo-100 hover:bg-white/10'
                 }`}
               >
                 <tab.icon className="w-4 h-4" /> {tab.label}
               </button>
             ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="mt-8">
        {activeTab === 'crm' && <CRMView userId={user.id} />}
        {activeTab === 'finance' && <FinanceView userId={user.id} />}
        {activeTab === 'schedule' && <ScheduleView userId={user.id} />}
      </div>
    </div>
  );
};

// --- CRM View Melhorada ---
const CRMView = ({ userId }: { userId: number }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', value: '', stage: 'new' as PipelineStage });
  
  const stages: { id: PipelineStage; label: string; color: string; bg: string }[] = [
    { id: 'new', label: 'Aberto', color: 'text-blue-600', bg: 'bg-blue-600' },
    { id: 'contacted', label: 'Em Contato', color: 'text-amber-600', bg: 'bg-amber-500' },
    { id: 'negotiation', label: 'Negociação', color: 'text-purple-600', bg: 'bg-purple-600' },
    { id: 'closed', label: 'Ganhos', color: 'text-emerald-600', bg: 'bg-emerald-500' },
  ];

  useEffect(() => { loadLeads(); }, []);

  const loadLeads = async () => {
    const data = await mockBackend.getLeads(userId);
    setLeads(data);
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.phone.includes(searchTerm)
  );

  const getStageTotal = (stageId: PipelineStage) => {
    return filteredLeads
      .filter(l => l.stage === stageId)
      .reduce((sum, l) => sum + (l.value || 0), 0);
  };

  const handleOpenModal = (lead?: Lead, initialStage?: PipelineStage) => {
    if (lead) {
      setEditingLead(lead);
      setLeadForm({ name: lead.name, phone: lead.phone, value: lead.value?.toString() || '', stage: lead.stage });
    } else {
      setEditingLead(null);
      setLeadForm({ name: '', phone: '', value: '', stage: initialStage || 'new' });
    }
    setIsModalOpen(true);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: leadForm.name,
      phone: leadForm.phone,
      value: leadForm.value ? Number(leadForm.value) : undefined,
      stage: leadForm.stage,
      source: 'manual' as const
    };

    if (editingLead) {
      await mockBackend.updateLead(editingLead.id, payload);
    } else {
      await mockBackend.addLeads([{ ...payload, id: Math.random().toString(36).substr(2, 9) }]);
    }
    
    setIsModalOpen(false);
    loadLeads();
  };

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm('Excluir este lead permanentemente?')) return;
    await mockBackend.deleteLead(id);
    loadLeads();
  };

  // Drag and Drop
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const handleDragStart = (id: string) => setDraggedLeadId(id);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = async (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault();
    if (!draggedLeadId) return;
    await mockBackend.updateLeadStage(draggedLeadId, targetStage);
    setLeads(prev => prev.map(l => l.id === draggedLeadId ? { ...l, stage: targetStage } : l));
    setDraggedLeadId(null);
  };

  return (
    <div className="space-y-6">
      {/* CRM Tools Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou telefone..." 
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-100 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
           <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl text-indigo-700 text-xs font-bold">
              <Zap className="w-3.5 h-3.5" /> Pipeline Ativo
           </div>
           <button 
             onClick={() => handleOpenModal()}
             className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
           >
             <Plus className="w-5 h-5" /> NOVO LEAD
           </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4">
        {stages.map(stage => (
          <div 
            key={stage.id} 
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
            className={`min-w-[320px] w-full flex-1 flex flex-col h-[700px] transition-all duration-300 rounded-[2rem] p-3 ${draggedLeadId ? 'bg-indigo-50/40 ring-2 ring-indigo-200 ring-dashed' : 'bg-gray-100/50'}`}
          >
            {/* Header de Coluna */}
            <div className="px-4 py-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${stage.bg} shadow-sm animate-pulse`}></span>
                  {stage.label}
                </h3>
                <span className="bg-white px-2.5 py-1 rounded-xl text-[10px] font-black text-gray-400 shadow-sm border border-gray-100">
                  {filteredLeads.filter(l => l.stage === stage.id).length}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                 <DollarSign className="w-3.5 h-3.5" /> 
                 R$ {getStageTotal(stage.id).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            {/* Lista de Leads */}
            <div className="flex-1 space-y-4 overflow-y-auto pr-1 custom-scrollbar">
              {filteredLeads.filter(l => l.stage === stage.id).map(lead => (
                <div 
                  key={lead.id} 
                  draggable
                  onDragStart={() => handleDragStart(lead.id)}
                  className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-xl hover:-translate-y-1 transition-all cursor-grab active:cursor-grabbing relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500/10 group-hover:bg-indigo-500 transition-colors"></div>
                  
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-black text-gray-900 text-base leading-tight mb-1 group-hover:text-indigo-600 transition-colors">
                        {lead.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
                         <span className={`px-2 py-0.5 rounded-lg border text-[10px] uppercase ${
                           lead.source === 'maps' ? 'bg-green-50 text-green-600 border-green-100' :
                           lead.source === 'instagram' ? 'bg-pink-50 text-pink-600 border-pink-100' : 
                           'bg-gray-50 text-gray-500 border-gray-200'
                         }`}>
                           {lead.source}
                         </span>
                         <span>•</span>
                         <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> Hoje</div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                        <button onClick={() => handleOpenModal(lead)} className="p-2 bg-gray-50 text-gray-400 hover:text-indigo-600 rounded-xl transition-all"><Edit3 className="w-4 h-4" /></button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                       <a href={`tel:${lead.phone}`} className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                          <Phone className="w-4 h-4" />
                       </a>
                       <button onClick={() => window.open(`https://wa.me/${lead.phone.replace(/\D/g, '')}`, '_blank')} className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all">
                          <MessageCircle className="w-4 h-4" />
                       </button>
                    </div>
                    {lead.value && (
                       <div className="text-right">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">Expectativa</p>
                          <span className="text-sm font-black text-indigo-600">R$ {lead.value.toFixed(2)}</span>
                       </div>
                    )}
                  </div>
                </div>
              ))}
              
              {filteredLeads.filter(l => l.stage === stage.id).length === 0 && (
                <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-200 rounded-[2rem] text-gray-300">
                    <UserIcon className="w-10 h-10 mb-2 opacity-20" />
                    <p className="text-xs font-black uppercase tracking-widest opacity-50">Nenhum Lead</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={() => handleOpenModal(undefined, stage.id)}
              className="mt-4 w-full py-4 rounded-2xl border border-dashed border-gray-300 text-gray-400 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-indigo-600 hover:border-indigo-200 transition-all group"
            >
              <span className="group-hover:scale-110 inline-block transition-transform">+ Adicionar Lead</span>
            </button>
          </div>
        ))}
      </div>

      {/* LEAD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 bg-indigo-50/50 rounded-bl-[4rem] -z-10"></div>
                
                <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">{editingLead ? 'Editar Cadastro' : 'Novo Lead'}</h3>
                      <p className="text-sm text-gray-500 font-medium">Preencha as informações do cliente.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full transition-colors"><X className="w-6 h-6" /></button>
                </div>
                
                <form onSubmit={handleLeadSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Nome do Cliente</label>
                        <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-100 font-bold text-gray-900" placeholder="Ex: Roberto Carlos" value={leadForm.name} onChange={e => setLeadForm({...leadForm, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">WhatsApp / Telefone</label>
                        <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-100 font-bold text-gray-900" placeholder="(11) 99999-9999" value={leadForm.phone} onChange={e => setLeadForm({...leadForm, phone: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Valor Previsto (R$)</label>
                            <input type="number" step="0.01" className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-100 font-bold text-gray-900" placeholder="0.00" value={leadForm.value} onChange={e => setLeadForm({...leadForm, value: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Estágio</label>
                            <select className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-100 font-bold text-gray-900 text-sm" value={leadForm.stage} onChange={e => setLeadForm({...leadForm, stage: e.target.value as PipelineStage})}>
                                {stages.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="pt-4 flex gap-3">
                        {editingLead && (
                          <button type="button" onClick={() => handleDeleteLead(editingLead.id)} className="p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-colors">
                            <Trash2 className="w-6 h-6" />
                          </button>
                        )}
                        <button type="submit" className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm">
                           <Zap className="w-4 h-4 fill-current" /> Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

// --- Finance View ---
const FinanceView = ({ userId }: { userId: number }) => {
  const [entries, setEntries] = useState<FinancialEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({ description: '', value: '', type: 'income' as 'income' | 'expense' });

  useEffect(() => { loadEntries(); }, []);
  const loadEntries = async () => {
    const data = await mockBackend.getFinanceEntries(userId);
    setEntries(data);
  };

  const totalIncome = entries.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.value, 0);
  const totalExpense = entries.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.value, 0);
  const balance = totalIncome - totalExpense;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await mockBackend.addFinanceEntry({
      userId,
      description: newEntry.description,
      value: Number(newEntry.value),
      type: newEntry.type,
      date: new Date().toLocaleDateString('pt-BR'),
      category: 'Geral'
    });
    setNewEntry({ description: '', value: '', type: 'income' });
    setIsModalOpen(false);
    loadEntries();
  };

  const handleDelete = async (id: string) => {
      if (!window.confirm('Excluir este lançamento?')) return;
      await mockBackend.deleteFinanceEntry(id);
      loadEntries();
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600"><TrendingUp className="w-6 h-6" /></div>
             <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Entradas do Mês</span>
           </div>
           <h3 className="text-3xl font-black text-emerald-600">R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-3 bg-rose-50 rounded-2xl text-rose-600"><TrendingDown className="w-6 h-6" /></div>
             <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Saídas do Mês</span>
           </div>
           <h3 className="text-3xl font-black text-rose-600">R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
        </div>
        <div className={`p-8 rounded-[2.5rem] border shadow-2xl ${balance >= 0 ? 'bg-indigo-600 border-indigo-500 text-white shadow-indigo-100' : 'bg-rose-600 border-rose-500 text-white shadow-rose-100'}`}>
           <div className="flex items-center gap-3 mb-4">
             <div className="p-3 bg-white/20 rounded-2xl text-white backdrop-blur-sm"><DollarSign className="w-6 h-6" /></div>
             <span className="text-xs font-black text-indigo-100/70 uppercase tracking-widest">Saldo Disponível</span>
           </div>
           <h3 className="text-4xl font-black">R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
        </div>
      </div>

      {/* Entry List */}
      <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="font-black text-gray-900 text-xl">Extrato de Movimentações</h3>
              <p className="text-sm text-gray-400 font-medium">Controle seu fluxo de caixa detalhadamente.</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-4 rounded-2xl text-sm font-black hover:bg-gray-800 transition-all uppercase tracking-widest shadow-xl">
                <Plus className="w-5 h-5" /> Novo Lançamento
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    <tr>
                        <th className="px-8 py-5">Descrição do Item</th>
                        <th className="px-8 py-5">Data</th>
                        <th className="px-8 py-5 text-right">Valor Final</th>
                        <th className="px-8 py-5 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {entries.map(entry => (
                        <tr key={entry.id} className="hover:bg-gray-50/50 group transition-colors">
                            <td className="px-8 py-5 flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full shadow-sm ${entry.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                <span className="text-sm font-black text-gray-800">{entry.description}</span>
                            </td>
                            <td className="px-8 py-5 text-xs text-gray-500 font-bold uppercase tracking-wider">{entry.date}</td>
                            <td className={`px-8 py-5 text-right font-black text-base ${entry.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {entry.type === 'income' ? '+' : '-'} R$ {entry.value.toFixed(2)}
                            </td>
                            <td className="px-8 py-5 text-center">
                                <button onClick={() => handleDelete(entry.id)} className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                            </td>
                        </tr>
                    ))}
                    {entries.length === 0 && (
                        <tr><td colSpan={4} className="text-center py-20">
                           <div className="flex flex-col items-center text-gray-300">
                              <DollarSign className="w-12 h-12 mb-4 opacity-20" />
                              <p className="text-sm font-black uppercase tracking-widest opacity-50">Sem registros financeiros</p>
                           </div>
                        </td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Modal Financeiro */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">Registrar Valor</h3>
                      <p className="text-sm text-gray-500 font-medium">Defina se é uma entrada ou saída.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 text-gray-400 hover:text-gray-600 rounded-full"><X className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleAdd} className="space-y-6">
                    <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl shadow-inner">
                        <button type="button" onClick={() => setNewEntry({...newEntry, type: 'income'})} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${newEntry.type === 'income' ? 'bg-white text-emerald-600 shadow-md scale-105' : 'text-gray-500'}`}>ENTRADA</button>
                        <button type="button" onClick={() => setNewEntry({...newEntry, type: 'expense'})} className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${newEntry.type === 'expense' ? 'bg-white text-rose-600 shadow-md scale-105' : 'text-gray-500'}`}>SAÍDA</button>
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Descrição</label>
                        <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-100 font-bold text-gray-900" placeholder="Ex: Venda de Hambúrguer" value={newEntry.description} onChange={e => setNewEntry({...newEntry, description: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Valor Total (R$)</label>
                        <input required type="number" step="0.01" className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-100 font-bold text-gray-900" placeholder="0.00" value={newEntry.value} onChange={e => setNewEntry({...newEntry, value: e.target.value})} />
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all uppercase tracking-widest text-sm">LANÇAR NO CAIXA</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

// --- Schedule View ---
const ScheduleView = ({ userId }: { userId: number }) => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [form, setForm] = useState({ title: '', client: '', date: '', time: '', type: 'reuniao' as any });

  useEffect(() => { loadSchedule(); }, []);
  const loadSchedule = async () => {
    const data = await mockBackend.getSchedule(userId);
    setSchedule(data);
  };

  const handleOpenModal = (item?: ScheduleItem) => {
      if (item) {
          setEditingItem(item);
          const parts = item.date.split('/');
          const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
          setForm({ title: item.title, client: item.client, date: isoDate, time: item.time, type: item.type });
      } else {
          setEditingItem(null);
          setForm({ title: '', client: '', date: '', time: '', type: 'reuniao' });
      }
      setIsModalOpen(true);
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parts = form.date.split('-');
    const ptDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    
    const payload = {
        title: form.title,
        client: form.client,
        date: ptDate,
        time: form.time,
        type: form.type,
        userId,
        status: 'pending' as const
    };

    if (editingItem) {
        await mockBackend.updateScheduleItem(editingItem.id, payload);
    } else {
        await mockBackend.addScheduleItem(payload);
    }

    setIsModalOpen(false);
    loadSchedule();
  };

  const handleDelete = async (id: string) => {
      if (!window.confirm('Remover este compromisso?')) return;
      await mockBackend.deleteScheduleItem(id);
      loadSchedule();
  };

  const toggleStatus = async (item: ScheduleItem) => {
      const nextStatus = item.status === 'completed' ? 'pending' : 'completed';
      await mockBackend.updateScheduleItem(item.id, { status: nextStatus });
      loadSchedule();
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="font-black text-gray-900 text-xl">Agenda de Compromissos</h3>
              <p className="text-sm text-gray-400 font-medium">Organize suas visitas e reuniões com clareza.</p>
            </div>
            <button 
                onClick={() => handleOpenModal()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-4 rounded-2xl text-sm font-black hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all uppercase tracking-widest"
            >
                <Plus className="w-5 h-5" /> Reservar Horário
            </button>
        </div>
        <div className="divide-y divide-gray-50">
            {schedule.map(item => (
                <div key={item.id} className={`p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${item.status === 'completed' ? 'bg-emerald-50/20 grayscale-[0.5]' : 'hover:bg-gray-50/30'}`}>
                    <div className="flex items-center gap-6">
                        <div className={`w-20 h-20 rounded-3xl flex flex-col items-center justify-center border-2 transition-all shadow-sm ${item.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white text-indigo-600 border-gray-100 group-hover:border-indigo-100'}`}>
                            <span className="text-[11px] font-black uppercase tracking-widest leading-none mb-1 opacity-60">{item.date.split('/')[1]}</span>
                            <span className="text-3xl font-black">{item.date.split('/')[0]}</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                               <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${item.type === 'reuniao' ? 'bg-blue-50 text-blue-600 border-blue-100' : item.type === 'visita' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                  {item.type}
                               </span>
                               {item.status === 'completed' && <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200">Concluído</span>}
                            </div>
                            <h4 className={`font-black text-gray-900 text-xl leading-tight ${item.status === 'completed' ? 'line-through text-gray-400' : ''}`}>{item.title}</h4>
                            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">Cliente: {item.client}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-gray-700 font-black bg-gray-100 px-5 py-2.5 rounded-2xl text-base shadow-inner">
                            <Clock className="w-5 h-5 text-indigo-600" /> {item.time}
                        </div>
                        <div className="flex items-center gap-2">
                             <button onClick={() => toggleStatus(item)} className={`p-3 rounded-2xl transition-all shadow-sm ${item.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-emerald-500 hover:text-white'}`} title="Concluir"><CheckCircle className="w-5 h-5" /></button>
                             <button onClick={() => handleOpenModal(item)} className="p-3 bg-gray-100 text-gray-400 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all shadow-sm"><Edit3 className="w-5 h-5" /></button>
                             <button onClick={() => handleDelete(item.id)} className="p-3 bg-gray-100 text-gray-400 hover:bg-rose-500 hover:text-white rounded-2xl transition-all shadow-sm"><Trash2 className="w-5 h-5" /></button>
                        </div>
                    </div>
                </div>
            ))}
            {schedule.length === 0 && (
                <div className="p-20 text-center flex flex-col items-center">
                   <Calendar className="w-16 h-16 text-gray-200 mb-4" />
                   <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-sm">Calendário de hoje vazio</p>
                </div>
            )}
        </div>

        {/* MODAL AGENDA */}
        {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
                <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                          <h3 className="text-2xl font-black text-gray-900">{editingItem ? 'Editar Agendamento' : 'Nova Reserva'}</h3>
                          <p className="text-sm text-gray-500 font-medium">Bloqueie horários na sua agenda comercial.</p>
                        </div>
                        <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                    </div>
                    <form onSubmit={handleScheduleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Título / Assunto</label>
                            <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-100 font-bold text-gray-900" placeholder="Ex: Reunião de Briefing" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Nome do Cliente</label>
                            <input required type="text" className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-100 font-bold text-gray-900" placeholder="Ex: João da Silva" value={form.client} onChange={e => setForm({...form, client: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Data</label>
                                <input required type="date" className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-100 font-bold text-gray-900 text-sm" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Horário</label>
                                <input required type="time" className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-100 font-bold text-gray-900 text-sm" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Tipo de Evento</label>
                            <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl shadow-inner">
                                {['reuniao', 'visita', 'servico'].map(t => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => setForm({...form, type: t as any})}
                                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${form.type === t ? 'bg-white text-indigo-600 shadow-md scale-105' : 'text-gray-500'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all uppercase tracking-widest text-sm">CONFIRMAR HORÁRIO</button>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

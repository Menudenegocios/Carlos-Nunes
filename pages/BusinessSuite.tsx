
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { Lead, PipelineStage, FinancialEntry, ScheduleItem } from '../types';
import { 
  DollarSign, Calendar, Plus, TrendingUp, TrendingDown, 
  X, Trash2, CheckCircle, Clock, Briefcase, 
  Home as HomeIcon, RefreshCw, Zap, ArrowRight, User
} from 'lucide-react';
import { SectionLanding } from '../components/SectionLanding';

export const BusinessSuite: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'crm' | 'finance' | 'schedule'>('home');

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4 px-4">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-emerald-950 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
                 <Briefcase className="h-10 w-10 text-indigo-300" />
              </div>
              <div>
                 <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none mb-1">Vendas & Gestão</h1>
                 <p className="text-indigo-200 text-lg font-medium opacity-80 uppercase tracking-widest text-xs">Controle total da sua operação comercial.</p>
              </div>
            </div>

            <div className="flex p-1.5 bg-black/20 backdrop-blur-md rounded-[1.8rem] border border-white/10 overflow-x-auto scrollbar-hide">
              {[
                { id: 'home', label: 'INÍCIO', icon: HomeIcon },
                { id: 'crm', label: 'CRM', icon: Briefcase },
                { id: 'finance', label: 'CAIXA', icon: DollarSign },
                { id: 'schedule', label: 'AGENDA', icon: Calendar }
              ].map((tab) => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id as any)} 
                  className={`flex items-center gap-3 px-6 py-3 rounded-[1.4rem] font-black text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl' : 'text-indigo-100 hover:bg-white/10'}`}
                >
                  <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      <div className="animate-[fade-in_0.4s_ease-out]">
        {activeTab === 'home' && (
            <SectionLanding 
                title="Sua Central de Operações do Dia a Dia."
                subtitle="Business Suite Connect"
                description="Organize leads, controle as finanças e gerencie sua agenda em um só lugar. A produtividade que seu negócio precisa para crescer sem perder o controle."
                benefits={[
                "Funil de Vendas Kanban: visualize sua receita futura.",
                "Fluxo de Caixa: saiba exatamente o lucro do seu mês.",
                "Agenda Inteligente: organize seus horários de serviço.",
                "Sincronização com Supabase para acesso em qualquer lugar.",
                "Relatórios simplificados de performance comercial."
                ]}
                youtubeId="dQw4w9WgXcQ"
                ctaLabel="ABRIR CRM"
                onStart={() => setActiveTab('crm')}
                icon={Briefcase}
                accentColor="indigo"
            />
        )}
        {activeTab === 'crm' && <CRMView userId={user.id} />}
        {activeTab === 'finance' && <FinanceView userId={user.id} />}
        {activeTab === 'schedule' && <ScheduleView userId={user.id} />}
      </div>
    </div>
  );
};

// --- CRM VIEW ---
const CRMView = ({ userId }: { userId: string }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState<Partial<Lead>>({ name: '', phone: '', source: 'manual', stage: 'new', value: 0, notes: '' });

  useEffect(() => { loadLeads(); }, []);
  const loadLeads = async () => { const data = await mockBackend.getLeads(userId); setLeads(data); };

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
        if (editingLead) {
          await mockBackend.updateLead(editingLead.id, formData);
        } else {
          await mockBackend.addLeads([{ ...formData, userId } as Lead]);
        }
        setIsModalOpen(false);
        loadLeads();
    } finally { setIsSaving(false); }
  };

  const moveLead = async (id: string, stage: PipelineStage) => {
    await mockBackend.updateLeadStage(id, stage);
    loadLeads();
  };

  const deleteLead = async (id: string) => {
    if (window.confirm('Excluir este lead permanentemente?')) {
      await mockBackend.deleteLead(id);
      loadLeads();
      setIsModalOpen(false);
    }
  };

  const stages: { id: PipelineStage; label: string; bg: string }[] = [
    { id: 'new', label: 'Novo', bg: 'bg-indigo-500' },
    { id: 'contacted', label: 'Contato', bg: 'bg-amber-500' },
    { id: 'negotiation', label: 'Proposta', bg: 'bg-purple-500' },
    { id: 'closed', label: 'Fechado', bg: 'bg-emerald-600' },
  ];

  const totalValue = leads.reduce((acc, l) => acc + (Number(l.value) || 0), 0);
  const closedValue = leads.filter(l => l.stage === 'closed').reduce((acc, l) => acc + (Number(l.value) || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Pipeline Total</p>
               <h4 className="text-3xl font-black text-gray-900 dark:text-white">R$ {totalValue.toFixed(2)}</h4>
            </div>
            <TrendingUp className="w-10 h-10 text-indigo-500 opacity-20" />
         </div>
         <div className="bg-emerald-600 p-8 rounded-[2.5rem] shadow-xl flex items-center justify-between text-white">
            <div>
               <p className="text-[10px] font-black uppercase opacity-60 tracking-widest mb-1">Faturamento Fechado</p>
               <h4 className="text-3xl font-black">R$ {closedValue.toFixed(2)}</h4>
            </div>
            <Zap className="w-10 h-10 text-white opacity-20 fill-current" />
         </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
        {stages.map(stage => (
          <div key={stage.id} className="min-w-[300px] flex-shrink-0 flex flex-col gap-4">
             <div className="flex items-center justify-between px-4">
                <h3 className="font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                   <span className={`w-2 h-2 rounded-full ${stage.bg}`}></span> {stage.label}
                </h3>
                <span className="bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-lg text-[10px] font-black text-gray-400">
                   {leads.filter(l => l.stage === stage.id).length}
                </span>
             </div>
             
             <div className="bg-gray-50/50 dark:bg-zinc-900/30 rounded-[2.5rem] p-3 space-y-3 min-h-[400px] border border-gray-100 dark:border-zinc-800">
                {leads.filter(l => l.stage === stage.id).map(lead => (
                   <div 
                      key={lead.id} 
                      className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 group hover:border-indigo-200 transition-all cursor-pointer"
                      onClick={() => { setEditingLead(lead); setFormData(lead); setIsModalOpen(true); }}
                   >
                      <div className="flex justify-between items-start mb-3">
                         <span className="text-[8px] font-black bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 px-2 py-0.5 rounded-full uppercase tracking-widest">{lead.source}</span>
                         <ArrowRight className="w-4 h-4 text-gray-200 group-hover:text-indigo-400 transition-colors" />
                      </div>
                      <h4 className="font-black text-gray-900 dark:text-white text-sm mb-1">{lead.name}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{lead.phone}</p>
                      {lead.value > 0 && <p className="mt-3 text-xs font-black text-emerald-600">R$ {Number(lead.value).toFixed(2)}</p>}
                   </div>
                ))}
                <button 
                  onClick={() => { setEditingLead(null); setFormData({ name: '', phone: '', source: 'manual', stage: stage.id, value: 0 }); setIsModalOpen(true); }}
                  className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-indigo-400 hover:text-indigo-500 transition-all"
                >
                   + Novo Lead
                </button>
             </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-white dark:bg-zinc-900 rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in">
                <div className="bg-indigo-900 p-8 text-white flex justify-between items-center">
                    <h3 className="text-2xl font-black">{editingLead ? 'Editar Oportunidade' : 'Novo Lead'}</h3>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSaveLead} className="p-10 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="col-span-2">
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 px-1">Nome Completo</label>
                          <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white focus:ring-2 focus:ring-indigo-100" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 px-1">WhatsApp</label>
                          <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white focus:ring-2 focus:ring-indigo-100" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 px-1">Valor do Negócio</label>
                          <input type="number" step="0.01" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white focus:ring-2 focus:ring-indigo-100" value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} />
                       </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 px-1">Etapa do Funil</label>
                        <select className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white focus:ring-2 focus:ring-indigo-100" value={formData.stage} onChange={e => setFormData({...formData, stage: e.target.value as any})}>
                           {stages.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 px-1">Observações</label>
                        <textarea rows={2} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-medium text-sm dark:text-white focus:ring-2 focus:ring-indigo-100 resize-none" value={formData.notes || ''} onChange={e => setFormData({...formData, notes: e.target.value})} />
                    </div>
                    <div className="flex gap-4">
                        <button type="submit" disabled={isSaving} className="flex-1 bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all">
                            {isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : 'SALVAR'}
                        </button>
                        {editingLead && <button type="button" onClick={() => deleteLead(editingLead.id)} className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 className="w-6 h-6" /></button>}
                    </div>
                </form>
            </div>
         </div>
      )}
    </div>
  );
};

// --- FINANCE VIEW ---
const FinanceView = ({ userId }: { userId: string }) => {
  const [entries, setEntries] = useState<FinancialEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FinancialEntry | null>(null);
  const [formData, setFormData] = useState<Partial<FinancialEntry>>({ description: '', value: 0, type: 'income', category: 'Vendas' });

  useEffect(() => { loadEntries(); }, []);
  const loadEntries = async () => { const data = await mockBackend.getFinanceEntries(userId); setEntries(data); };

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
        if (editingEntry) {
            await mockBackend.updateFinanceEntry(editingEntry.id, formData);
        } else {
            await mockBackend.addFinanceEntry({ ...formData, userId, date: new Date().toISOString() } as FinancialEntry);
        }
        setIsModalOpen(false);
        loadEntries();
    } finally { setIsSaving(false); }
  };

  const deleteEntry = async (id: string) => {
    if (window.confirm('Excluir este lançamento?')) {
      await mockBackend.deleteFinanceEntry(id);
      loadEntries();
    }
  };

  const totals = entries.reduce((acc, curr) => {
    if (curr.type === 'income') acc.income += Number(curr.value);
    else acc.expense += Number(curr.value);
    return acc;
  }, { income: 0, expense: 0 });

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
         <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Entradas</h4>
            <h3 className="text-3xl font-black text-emerald-600">R$ {totals.income.toFixed(2)}</h3>
         </div>
         <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Saídas</h4>
            <h3 className="text-3xl font-black text-rose-600">R$ {totals.expense.toFixed(2)}</h3>
         </div>
         <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-xl">
            <h4 className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">Saldo Atual</h4>
            <h3 className="text-3xl font-black">R$ {(totals.income - totals.expense).toFixed(2)}</h3>
         </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[4rem] p-10 md:p-16 border border-gray-100 dark:border-zinc-800 shadow-xl">
         <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Fluxo de Caixa</h3>
            <button onClick={() => { setEditingEntry(null); setFormData({ description: '', value: 0, type: 'income', category: 'Vendas' }); setIsModalOpen(true); }} className="bg-indigo-600 text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 hover:bg-indigo-700 transition-all">
               <Plus className="w-5 h-5" /> Novo Registro
            </button>
         </div>

         <div className="space-y-4">
            {entries.length === 0 ? (
               <div className="py-20 text-center border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-[2.5rem]">
                  <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Nenhum lançamento no histórico.</p>
               </div>
            ) : entries.map(entry => (
               <div key={entry.id} className="flex items-center justify-between p-6 bg-gray-50/50 dark:bg-zinc-800/30 rounded-3xl border border-gray-100 dark:border-zinc-700 group hover:shadow-md transition-all">
                  <div className="flex items-center gap-6" onClick={() => { setEditingEntry(entry); setFormData(entry); setIsModalOpen(true); }}>
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${entry.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {entry.type === 'income' ? <TrendingUp className="w-7 h-7" /> : <TrendingDown className="w-7 h-7" />}
                     </div>
                     <div>
                        <h4 className="font-black text-gray-900 dark:text-white text-lg leading-tight">{entry.description}</h4>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{entry.category} • {new Date(entry.date).toLocaleDateString('pt-BR')}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className={`text-xl font-black ${entry.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                       {entry.type === 'income' ? '+' : '-'} R$ {Number(entry.value).toFixed(2)}
                    </span>
                    <button onClick={() => deleteEntry(entry.id)} className="p-3 text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all bg-white dark:bg-zinc-900 rounded-xl shadow-sm"><Trash2 className="w-5 h-5" /></button>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {isModalOpen && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-white dark:bg-zinc-900 rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in">
                <div className="bg-indigo-900 p-8 text-white flex justify-between items-center">
                    <h3 className="text-2xl font-black">{editingEntry ? 'Editar Lançamento' : 'Novo Lançamento'}</h3>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSaveEntry} className="p-10 space-y-6">
                    <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-2xl">
                        <button type="button" onClick={() => setFormData({...formData, type: 'income'})} className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${formData.type === 'income' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400'}`}>Entrada</button>
                        <button type="button" onClick={() => setFormData({...formData, type: 'expense'})} className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${formData.type === 'expense' ? 'bg-rose-600 text-white shadow-lg' : 'text-gray-400'}`}>Saída</button>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 px-1">Descrição do Item</label>
                        <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white focus:ring-2 focus:ring-indigo-100" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Ex: Pagamento Fornecedor" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 px-1">Valor (R$)</label>
                          <input required type="number" step="0.01" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white focus:ring-2 focus:ring-indigo-100" value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} />
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 px-1">Categoria</label>
                          <select className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white focus:ring-2 focus:ring-indigo-100" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                              <option>Vendas</option>
                              <option>Marketing</option>
                              <option>Infra</option>
                              <option>Equipe</option>
                              <option>Outros</option>
                          </select>
                       </div>
                    </div>
                    <button type="submit" disabled={isSaving} className="w-full bg-indigo-600 text-white font-black py-5 rounded-[2rem] shadow-xl uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all">
                        {isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : 'REGISTRAR LANÇAMENTO'}
                    </button>
                </form>
            </div>
         </div>
      )}
    </div>
  );
};

// --- SCHEDULE VIEW ---
const ScheduleView = ({ userId }: { userId: string }) => {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [formData, setFormData] = useState<Partial<ScheduleItem>>({ title: '', client: '', date: '', time: '', type: 'servico', status: 'pending' });

  useEffect(() => { loadItems(); }, []);
  const loadItems = async () => { const data = await mockBackend.getSchedule(userId); setItems(data); };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
        if (editingItem) {
            await mockBackend.updateScheduleItem(editingItem.id, formData);
        } else {
            await mockBackend.addScheduleItem({ ...formData, userId } as ScheduleItem);
        }
        setIsModalOpen(false);
        loadItems();
    } finally { setIsSaving(false); }
  };

  const deleteItem = async (id: string) => {
    if (window.confirm('Remover este compromisso?')) {
      await mockBackend.deleteScheduleItem(id);
      loadItems();
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4">
         <div>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Agenda Mensal</h3>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Organize seus serviços e reuniões.</p>
         </div>
         <button onClick={() => { setEditingItem(null); setFormData({ title: '', client: '', date: '', time: '', type: 'servico', status: 'pending' }); setIsModalOpen(true); }} className="bg-indigo-600 text-white px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 transition-all">
            <Calendar className="w-5 h-5" /> Agendar Horário
         </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[4rem] p-10 md:p-16 border border-gray-100 dark:border-zinc-800 shadow-xl min-h-[500px]">
         <div className="space-y-6">
            {items.length === 0 ? (
               <div className="py-32 text-center border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-[3rem]">
                  <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Nenhum compromisso agendado.</p>
               </div>
            ) : items.map(item => (
               <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-gray-50/50 dark:bg-zinc-800/30 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 group transition-all hover:bg-white dark:hover:bg-zinc-800 cursor-pointer" onClick={() => { setEditingItem(item); setFormData(item); setIsModalOpen(true); }}>
                  <div className="flex items-center gap-8">
                     <div className="text-center bg-white dark:bg-zinc-950 p-5 rounded-3xl shadow-md min-w-[90px] border border-gray-50 dark:border-zinc-800">
                        <p className="text-xs font-black text-indigo-600 uppercase mb-1 tracking-widest">{new Date(item.date).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</p>
                        <p className="text-4xl font-black text-gray-900 dark:text-white leading-none">{new Date(item.date).getDate() + 1}</p>
                     </div>
                     <div className="space-y-2">
                        <h4 className="font-black text-gray-900 dark:text-white text-xl leading-tight">{item.title}</h4>
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                           <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {item.client}</span>
                           <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {item.time}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-6 mt-6 md:mt-0">
                    <span className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${item.type === 'visita' ? 'bg-purple-100 text-purple-700' : item.type === 'reuniao' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                       {item.type}
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }} className="p-4 text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all bg-white dark:bg-zinc-900 rounded-2xl shadow-sm"><Trash2 className="w-6 h-6" /></button>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {isModalOpen && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-white dark:bg-zinc-900 rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in">
                <div className="bg-indigo-900 p-8 text-white flex justify-between items-center">
                    <h3 className="text-2xl font-black">{editingItem ? 'Editar Compromisso' : 'Agendar Novo Horário'}</h3>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSaveItem} className="p-10 space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 px-1">Título do Compromisso</label>
                        <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white focus:ring-2 focus:ring-indigo-100" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ex: Consultoria com a Ana" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 px-1">Nome do Cliente</label>
                        <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white focus:ring-2 focus:ring-indigo-100" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 px-1">Data</label>
                            <input required type="date" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white focus:ring-2 focus:ring-indigo-100" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 px-1">Horário</label>
                            <input required type="time" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white focus:ring-2 focus:ring-indigo-100" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 px-1">Tipo de Compromisso</label>
                        <select className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white focus:ring-2 focus:ring-indigo-100" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                            <option value="servico">Execução de Serviço</option>
                            <option value="visita">Visita Técnica</option>
                            <option value="reuniao">Reunião Estratégica</option>
                        </select>
                    </div>
                    <div className="flex gap-4">
                        <button type="submit" disabled={isSaving} className="flex-1 bg-indigo-600 text-white font-black py-5 rounded-[2rem] shadow-xl uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all">
                            {isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : 'CONFIRMAR AGENDAMENTO'}
                        </button>
                        {editingItem && <button type="button" onClick={() => deleteItem(editingItem.id)} className="p-5 bg-rose-50 text-rose-500 rounded-[1.5rem] hover:bg-rose-500 hover:text-white transition-all"><Trash2 className="w-6 h-6" /></button>}
                    </div>
                </form>
            </div>
         </div>
      )}
    </div>
  );
};

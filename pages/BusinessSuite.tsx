
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { Lead, PipelineStage, FinancialEntry, ScheduleItem } from '../types';
import { 
  DollarSign, Calendar, Plus, TrendingUp, TrendingDown, 
  X, Trash2, CheckCircle, Clock, Briefcase, 
  Home as HomeIcon, RefreshCw, Zap, ArrowRight, User, Layout, GripVertical,
  Filter, CalendarDays, Wallet, ArrowUpCircle, ArrowDownCircle
} from 'lucide-react';
import { SectionLanding } from '../components/SectionLanding';

export const BusinessSuite: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'crm' | 'finance' | 'schedule'>('home');

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4 px-4">
      {/* Header Premium SaaS */}
      <div className="bg-[#0F172A] dark:bg-black rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-indigo-500/10 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-xl">
                 <Briefcase className="h-10 w-10 text-brand-primary" />
              </div>
              <div>
                 <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-2">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] dark:from-brand-primary dark:to-brand-accent italic uppercase">CRM & Vendas</span>
                 </h1>
                 <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">O PAINEL DE CONTROLE DO SEU SUCESSO COMERCIAL.</p>
              </div>
            </div>
            
            <div className="flex gap-3">
               <button onClick={() => setActiveTab('crm')} className="bg-[#F67C01] text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl active:scale-95 flex items-center gap-2">
                  <Layout className="w-4 h-4" /> MEU PIPELINE
               </button>
            </div>
          </div>

          <div className="flex p-1.5 mt-12 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 w-fit overflow-x-auto scrollbar-hide gap-1">
              {[
                { id: 'home', label: 'INÍCIO', desc: 'Boas-vindas', icon: HomeIcon },
                { id: 'crm', label: 'CRM', desc: 'Funil de leads', icon: Briefcase },
                { id: 'finance', label: 'CAIXA', desc: 'Financeiro', icon: DollarSign },
                { id: 'schedule', label: 'AGENDA', desc: 'Compromissos', icon: Calendar }
              ].map((tab) => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id as any)} 
                  className={`flex flex-col items-center justify-center min-w-[110px] px-6 py-3 rounded-[1.4rem] transition-all duration-300 whitespace-nowrap ${activeTab === tab.id ? 'bg-[#F67C01] text-white shadow-xl scale-105' : 'text-slate-400 hover:bg-white/10'}`}
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

      <div className="animate-[fade-in_0.4s_ease-out]">
        {activeTab === 'home' && (
            <SectionLanding 
                title="Sua central de operações do dia a dia."
                subtitle="CRM & Vendas"
                description="Organize leads, controle as finanças e gerencie sua agenda em um só lugar. A produtividade que seu negócio precisa para crescer sem perder o controle."
                benefits={[
                "Funil de vendas Kanban: visualize sua receita futura.",
                "Fluxo de caixa: saiba exatamente o lucro do seu mês.",
                "Agenda inteligente: organize seus horários de serviço.",
                "Sincronização com nuvem para acesso em qualquer lugar.",
                "Relatórios simplificados de performance comercial."
                ]}
                youtubeId="dQw4w9WgXcQ"
                ctaLabel="ABRIR MEU CRM"
                onStart={() => setActiveTab('crm')}
                icon={Briefcase}
                accentColor="brand"
            />
        )}
        {activeTab === 'crm' && <CRMView userId={user.id} />}
        {activeTab === 'finance' && <FinanceView userId={user.id} />}
        {activeTab === 'schedule' && <ScheduleView userId={user.id} />}
      </div>
    </div>
  );
};

const CRMView = ({ userId }: { userId: string }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Lead>>({ name: '', phone: '', source: 'manual', stage: 'new', value: 0, notes: '' });

  useEffect(() => { loadLeads(); }, []);
  const loadLeads = async () => { 
      try {
        const data = await mockBackend.getLeads(userId); 
        setLeads(data); 
      } catch (e) { console.error(e); }
  };

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setIsSaving(true);
    try {
        if (editingLead) await mockBackend.updateLead(editingLead.id, { ...formData, userId });
        else await mockBackend.addLeads([{ ...formData, userId } as Lead]);
        setIsModalOpen(false);
        await loadLeads();
    } finally { setIsSaving(false); }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedLeadId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault();
    if (!draggedLeadId) return;
    const leadId = draggedLeadId;
    const currentLead = leads.find(l => l.id === leadId);
    if (currentLead && currentLead.stage !== targetStage) {
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: targetStage } : l));
      await mockBackend.updateLeadStage(leadId, targetStage);
    }
    setDraggedLeadId(null);
  };

  const stages: { id: PipelineStage; label: string; bg: string }[] = [
    { id: 'new', label: 'Novo', bg: 'bg-blue-500' },
    { id: 'contacted', label: 'Contato', bg: 'bg-amber-500' },
    { id: 'negotiation', label: 'Proposta', bg: 'bg-purple-500' },
    { id: 'closed', label: 'Fechado', bg: 'bg-emerald-600' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide px-4">
        {stages.map(stage => (
          <div key={stage.id} className={`min-w-[300px] flex-shrink-0 flex flex-col gap-4 rounded-[3.5rem]`} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, stage.id)}>
             <div className="flex items-center justify-between px-6">
                <h3 className="font-black text-[10px] uppercase tracking-widest flex items-center gap-3 italic">
                   <span className={`w-3 h-3 rounded-full ${stage.bg} shadow-sm`}></span> {stage.label}
                </h3>
                <span className="bg-white dark:bg-zinc-900 px-4 py-1.5 rounded-full text-[10px] font-black text-slate-400 border border-gray-100 dark:border-zinc-800">
                   {leads.filter(l => l.stage === stage.id).length}
                </span>
             </div>
             <div className={`bg-gray-50/50 dark:bg-zinc-900/30 rounded-[3.5rem] p-4 space-y-4 min-h-[550px] border border-gray-100 dark:border-zinc-800 shadow-inner`}>
                {leads.filter(l => l.stage === stage.id).map(lead => (
                   <div key={lead.id} draggable onDragStart={(e) => handleDragStart(e, lead.id)} className={`bg-white dark:bg-zinc-900 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-zinc-800 group hover:border-brand-primary/30 transition-all cursor-grab active:cursor-grabbing ${draggedLeadId === lead.id ? 'opacity-40' : ''}`} onClick={() => { setEditingLead(lead); setFormData(lead); setIsModalOpen(true); }}>
                      <div className="flex justify-between items-start mb-4">
                         <GripVertical className="w-3.5 h-3.5 text-slate-300" />
                         <span className="text-[9px] font-black bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-lg uppercase">{lead.source}</span>
                      </div>
                      <h4 className="font-black text-gray-900 dark:text-white text-base mb-1 tracking-tight leading-tight">{lead.name}</h4>
                      <p className="text-[11px] font-bold text-slate-400 uppercase">{lead.phone}</p>
                      {Number(lead.value) > 0 && <p className="mt-4 text-sm font-black text-[#F67C01]">R$ {Number(lead.value).toFixed(2)}</p>}
                   </div>
                ))}
                <button onClick={() => { setEditingLead(null); setFormData({ name: '', phone: '', source: 'manual', stage: stage.id, value: 0 }); setIsModalOpen(true); }} className="w-full py-5 border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-[2.5rem] text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:border-brand-primary hover:text-brand-primary transition-all flex items-center justify-center gap-2">
                   <Plus className="w-4 h-4" /> Novo lead
                </button>
             </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-white/5 animate-scale-in">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                    <div><h3 className="text-2xl font-black uppercase italic tracking-tighter">{editingLead ? 'Detalhes do Lead' : 'Capturar Lead'}</h3></div>
                    <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                <form onSubmit={handleSaveLead} className="p-10 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                       <div className="col-span-2">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Nome completo</label>
                          <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">WhatsApp</label>
                          <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Valor do Negócio</label>
                          <input type="number" step="0.01" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} />
                       </div>
                    </div>
                    <button type="submit" disabled={isSaving} className="w-full bg-[#F67C01] text-white font-black py-5 rounded-[2rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-orange-600 transition-all">
                        {isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : 'Salvar Lead'}
                    </button>
                </form>
            </div>
         </div>
      )}
    </div>
  );
};

const FinanceView = ({ userId }: { userId: string }) => {
  const [entries, setEntries] = useState<FinancialEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FinancialEntry | null>(null);
  const [formData, setFormData] = useState<Partial<FinancialEntry>>({ description: '', value: 0, type: 'income', category: 'Vendas' });

  useEffect(() => { loadEntries(); }, []);
  const loadEntries = async () => { 
      try {
        const data = await mockBackend.getFinanceEntries(userId); 
        setEntries(data); 
      } catch (e) { console.error(e); }
  };

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setIsSaving(true);
    try {
        if (editingEntry) await mockBackend.updateFinanceEntry(editingEntry.id, { ...formData, userId });
        else await mockBackend.addFinanceEntry({ ...formData, userId, date: new Date().toISOString() } as FinancialEntry);
        setIsModalOpen(false);
        await loadEntries();
    } finally { setIsSaving(false); }
  };

  const totals = entries.reduce((acc, curr) => {
    if (curr.type === 'income') acc.income += Number(curr.value);
    else acc.expense += Number(curr.value);
    return acc;
  }, { income: 0, expense: 0 });

  return (
    <div className="space-y-12 animate-fade-in px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Ganhos Brutos</h4>
            <h3 className="text-4xl font-black text-emerald-600 tracking-tighter">R$ {totals.income.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
         </div>
         <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Custos & Despesas</h4>
            <h3 className="text-4xl font-black text-rose-600 tracking-tighter">R$ {totals.expense.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
         </div>
         <div className="bg-[#0F172A] p-10 rounded-[3rem] text-white shadow-2xl border border-white/5 relative overflow-hidden group">
            <h4 className="text-[10px] font-black text-[#F67C01] uppercase tracking-[0.2em] mb-3 relative z-10 italic">Lucro Líquido</h4>
            <h3 className="text-4xl font-black tracking-tighter relative z-10">R$ {(totals.income - totals.expense).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
            <Zap className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 fill-current group-hover:scale-125 transition-transform" />
         </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[4rem] p-10 md:p-16 border border-gray-100 dark:border-zinc-800 shadow-xl">
         <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight italic">Relatório de Fluxo</h3>
            <button onClick={() => { setEditingEntry(null); setFormData({ description: '', value: 0, type: 'income', category: 'Vendas' }); setIsModalOpen(true); }} className="bg-[#F67C01] text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 hover:bg-orange-600 transition-all active:scale-95">
               <Plus className="w-5 h-5" /> Novo Lançamento
            </button>
         </div>

         <div className="space-y-4">
            {entries.length === 0 ? (
               <div className="py-24 text-center border-4 border-dashed border-gray-50 dark:border-zinc-800 rounded-[3rem]">
                  <DollarSign className="w-16 h-16 mx-auto text-slate-200 mb-6" />
                  <p className="text-slate-400 font-black uppercase text-[11px] tracking-[0.3em]">Histórico Financeiro Vazio</p>
               </div>
            ) : entries.map(entry => (
               <div key={entry.id} className="flex items-center justify-between p-8 bg-gray-50/50 dark:bg-zinc-800/40 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 group hover:shadow-2xl transition-all">
                  <div className="flex items-center gap-8 cursor-pointer" onClick={() => { setEditingEntry(entry); setFormData(entry); setIsModalOpen(true); }}>
                     <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-inner ${entry.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {entry.type === 'income' ? <TrendingUp className="w-8 h-8" /> : <TrendingDown className="w-8 h-8" />}
                     </div>
                     <div>
                        <h4 className="font-black text-gray-900 dark:text-white text-xl tracking-tight leading-tight">{entry.description}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">{entry.category.toUpperCase()} • {new Date(entry.date).toLocaleDateString('pt-BR')}</p>
                     </div>
                  </div>
                  <span className={`text-2xl font-black ${entry.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                     {entry.type === 'income' ? '+' : '-'} R$ {Number(entry.value).toFixed(2)}
                  </span>
               </div>
            ))}
         </div>
      </div>

      {isModalOpen && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-white/5 animate-scale-in">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                    <div><h3 className="text-2xl font-black uppercase italic tracking-tighter">Novo Lançamento</h3></div>
                    <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                <form onSubmit={handleSaveEntry} className="p-10 space-y-8">
                    <div className="space-y-6">
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Descrição</label>
                          <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Ex: Pagamento Fornecedor" />
                       </div>
                       <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Valor (R$)</label>
                            <input required type="number" step="0.01" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Tipo</label>
                            <select className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                                <option value="income">Entrada (+)</option>
                                <option value="expense">Saída (-)</option>
                            </select>
                          </div>
                       </div>
                    </div>
                    <button type="submit" disabled={isSaving} className="w-full bg-indigo-600 text-white font-black py-5 rounded-[2rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all">
                        {isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : 'Confirmar Lançamento'}
                    </button>
                </form>
            </div>
         </div>
      )}
    </div>
  );
};

const ScheduleView = ({ userId }: { userId: string }) => {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [formData, setFormData] = useState<Partial<ScheduleItem>>({ title: '', client: '', date: '', time: '', type: 'servico', status: 'pending' });

  useEffect(() => { loadItems(); }, []);
  const loadItems = async () => { 
      try {
        const data = await mockBackend.getSchedule(userId); 
        setItems(data); 
      } catch (e) { console.error(e); }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setIsSaving(true);
    try {
        if (editingItem) await mockBackend.updateScheduleItem(editingItem.id, { ...formData, userId });
        else await mockBackend.addScheduleItem({ ...formData, userId, status: 'pending' } as ScheduleItem);
        setIsModalOpen(false);
        await loadItems();
    } finally { setIsSaving(false); }
  };

  return (
    <div className="space-y-8 animate-fade-in px-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
         <div>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic">Linha do Tempo</h3>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Suas reservas e compromissos locais</p>
         </div>
         <button onClick={() => { setEditingItem(null); setFormData({ title: '', client: '', date: '', time: '', type: 'servico', status: 'pending' }); setIsModalOpen(true); }} className="bg-[#F67C01] text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 hover:bg-orange-600 transition-all active:scale-95">
            <Calendar className="w-5 h-5" /> Agendar Horário
         </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[4rem] p-10 md:p-16 border border-gray-100 dark:border-zinc-800 shadow-xl min-h-[600px] relative overflow-hidden">
         <div className="space-y-8 relative z-10">
            {items.length === 0 ? (
               <div className="py-32 text-center border-4 border-dashed border-gray-50 dark:border-zinc-800 rounded-[3rem]">
                  <Calendar className="w-20 h-20 mx-auto text-slate-100 mb-8" />
                  <p className="text-slate-300 font-black uppercase text-xs tracking-[0.4em]">Sua agenda está livre hoje</p>
               </div>
            ) : items.map(item => (
               <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between p-10 bg-gray-50/50 dark:bg-zinc-800/40 rounded-[3rem] border border-gray-100 dark:border-zinc-800 group transition-all hover:bg-white dark:hover:bg-zinc-800 cursor-pointer hover:shadow-2xl" onClick={() => { setEditingItem(item); setFormData(item); setIsModalOpen(true); }}>
                  <div className="flex items-center gap-10">
                     <div className="text-center bg-[#0F172A] p-6 rounded-[2rem] shadow-2xl min-w-[100px] border border-white/5">
                        <p className="text-xs font-black text-[#F67C01] uppercase mb-2 tracking-[0.2em] italic">{new Date(item.date).toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}</p>
                        <p className="text-5xl font-black text-white leading-none tracking-tighter">{new Date(item.date).getDate() + 1}</p>
                     </div>
                     <div className="space-y-3">
                        <h4 className="font-black text-gray-900 dark:text-white text-2xl leading-tight tracking-tight uppercase italic">{item.title}</h4>
                        <div className="flex items-center gap-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                           <span className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-3 py-1 rounded-lg border border-gray-100 dark:border-zinc-700 shadow-sm"><User className="w-4 h-4 text-brand-primary" /> {item.client}</span>
                           <span className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-3 py-1 rounded-lg border border-gray-100 dark:border-zinc-700 shadow-sm"><Clock className="w-4 h-4 text-brand-primary" /> {item.time}</span>
                        </div>
                     </div>
                  </div>
                  <span className={`px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] shadow-lg ${item.type === 'visita' ? 'bg-purple-100 text-purple-700' : item.type === 'reuniao' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                     {item.type}
                  </span>
               </div>
            ))}
         </div>
      </div>

      {isModalOpen && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-white/5 animate-scale-in">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                    <div><h3 className="text-2xl font-black uppercase italic tracking-tighter">Novo Agendamento</h3></div>
                    <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                <form onSubmit={handleSaveItem} className="p-10 space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Título do Compromisso</label>
                        <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ex: Entrega de Encomenda" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Nome do Cliente</label>
                        <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Data</label>
                            <input required type="date" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Horário</label>
                            <input required type="time" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Tipo</label>
                        <select className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                            <option value="servico">Serviço</option>
                            <option value="visita">Visita</option>
                            <option value="reuniao">Reunião</option>
                        </select>
                    </div>
                    <button type="submit" disabled={isSaving} className="w-full bg-[#F67C01] text-white font-black py-5 rounded-[2rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-orange-600 transition-all">
                        {isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : 'Confirmar Agenda'}
                    </button>
                </form>
            </div>
         </div>
      )}
    </div>
  );
};

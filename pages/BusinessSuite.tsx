
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { Lead, PipelineStage, FinancialEntry, ScheduleItem } from '../types';
import { 
  DollarSign, Calendar, Plus, TrendingUp, TrendingDown, 
  X, Trash2, CheckCircle, Clock, Briefcase, 
  Home as HomeIcon, RefreshCw, Zap, ArrowRight, User, Layout, GripVertical,
  Filter, CalendarDays, Wallet, ArrowUpCircle, ArrowDownCircle,
  Lock, Crown, Smartphone
} from 'lucide-react';
import { SectionLanding } from '../components/SectionLanding';
import { Link } from 'react-router-dom';

export const BusinessSuite: React.FC = () => {
  const { user, realAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'crm' | 'finance' | 'menuzap_pro'>('home');

  if (!user) return null;

  const isAdmin = user.role === 'admin' || realAdmin?.role === 'admin';
  const isPro = isAdmin || user.plan === 'negocios';
  const hasAccess = isAdmin || (user.plan !== 'profissionais');

  if (!hasAccess) {
      return (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
              <div className="w-24 h-24 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl border border-brand-primary/20">
                  <Lock className="w-10 h-10 text-brand-primary" />
              </div>
              <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-4">Módulo de Gestão Business</h2>
              <p className="text-gray-500 dark:text-zinc-400 max-w-md text-lg font-medium leading-relaxed mb-10">
                  A Central de Negócios (CRM, Financeiro e Agenda) é exclusiva para planos <span className="text-indigo-600 font-bold">PRO</span> e <span className="text-emerald-600 font-bold">Business</span>.
              </p>
              <Link to="/plans" className="bg-[#F67C01] text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
                  <Crown className="w-5 h-5" /> DESBLOQUEAR FERRAMENTAS
              </Link>
          </div>
      );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4 px-4">
      <div className="bg-[#0F172A] dark:bg-black rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-indigo-500/10 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-xl">
                 <Briefcase className="h-10 w-10 text-brand-primary" />
              </div>
              <div>
                 <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-2">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] dark:from-brand-primary dark:to-brand-accent italic uppercase">Menu CRM</span>
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
                { id: 'menuzap_pro', label: 'BIBLIOTECA', desc: 'Agentes de IA', icon: Zap }
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
                subtitle="Menu CRM & Vendas"
                description="Organize leads, controle as finanças e gerencie sua agenda em um só lugar. A produtividade que seu negócio precisa para crescer sem perder o controle."
                benefits={[
                "Funil de vendas Kanban: visualize sua receita futura.",
                "Fluxo de caixa: saiba exatamente o lucro do seu mês.",
                "Biblioteca de Agentes de IA para automatizar tarefas.",
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
        {/* Fix: Added missing FinanceView component mapping */}
        {activeTab === 'finance' && <FinanceView userId={user.id} />}
        {activeTab === 'menuzap_pro' && <MenuzapProView user={user} />}
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

// Fix: Added missing FinanceView component
const FinanceView = ({ userId }: { userId: string }) => {
  const [entries, setEntries] = useState<FinancialEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<FinancialEntry>>({ 
    description: '', 
    value: 0, 
    type: 'income', 
    date: new Date().toISOString().split('T')[0], 
    category: 'Geral' 
  });

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
      await mockBackend.addFinanceEntry({ ...formData, userId } as FinancialEntry);
      setIsModalOpen(false);
      await loadEntries();
      setFormData({ description: '', value: 0, type: 'income', date: new Date().toISOString().split('T')[0], category: 'Geral' });
    } finally { setIsSaving(false); }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!window.confirm('Excluir este lançamento?')) return;
    await mockBackend.deleteFinanceEntry(id);
    await loadEntries();
  };

  const totalIncome = entries.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.value, 0);
  const totalExpense = entries.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.value, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
           <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Entradas</p>
           <div className="flex items-center justify-between">
              <h4 className="text-3xl font-black text-emerald-600 tracking-tighter">R$ {totalIncome.toFixed(2)}</h4>
              <ArrowUpCircle className="w-8 h-8 text-emerald-500" />
           </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
           <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Saídas</p>
           <div className="flex items-center justify-between">
              <h4 className="text-3xl font-black text-rose-600 tracking-tighter">R$ {totalExpense.toFixed(2)}</h4>
              <ArrowDownCircle className="w-8 h-8 text-rose-500" />
           </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
           <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Saldo Atual</p>
           <div className="flex items-center justify-between">
              <h4 className={`text-3xl font-black tracking-tighter ${balance >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>R$ {balance.toFixed(2)}</h4>
              <Wallet className="w-8 h-8 text-indigo-500" />
           </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-8">
        <div className="flex justify-between items-center">
           <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight">Fluxo de Caixa</h3>
           <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2">
             <Plus className="w-4 h-4" /> NOVO LANÇAMENTO
           </button>
        </div>

        <div className="space-y-4">
           {entries.length > 0 ? entries.map(entry => (
              <div key={entry.id} className="p-6 bg-gray-50 dark:bg-zinc-800/40 rounded-[2rem] border border-gray-100 dark:border-zinc-800 flex items-center justify-between group hover:bg-white transition-all">
                 <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${entry.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                       {entry.type === 'income' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                    </div>
                    <div>
                       <h4 className="font-black text-gray-900 dark:text-white text-base tracking-tight">{entry.description}</h4>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{entry.category} • {new Date(entry.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-8">
                    <span className={`text-lg font-black ${entry.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                       {entry.type === 'income' ? '+' : '-'} R$ {entry.value.toFixed(2)}
                    </span>
                    <button onClick={() => handleDeleteEntry(entry.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                       <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
              </div>
           )) : (
              <div className="text-center py-20 opacity-40">
                 <DollarSign className="w-12 h-12 mx-auto mb-4" />
                 <p className="text-[10px] font-black uppercase tracking-[0.2em]">Sem lançamentos este mês.</p>
              </div>
           )}
        </div>
      </div>

      {isModalOpen && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-white/5 animate-scale-in">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                    <div><h3 className="text-2xl font-black uppercase italic tracking-tighter">Financeiro</h3></div>
                    <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                <form onSubmit={handleSaveEntry} className="p-10 space-y-8">
                    <div className="space-y-6">
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Descrição</label>
                          <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Ex: Pagamento Consultoria" />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Valor (R$)</label>
                             <input required type="number" step="0.01" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} />
                          </div>
                          <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Tipo</label>
                             <select className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                                <option value="income">Receita (+)</option>
                                <option value="expense">Despesa (-)</option>
                             </select>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Data</label>
                             <input required type="date" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                          </div>
                          <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Categoria</label>
                             <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Ex: Serviços" />
                          </div>
                       </div>
                    </div>
                    <button type="submit" disabled={isSaving} className="w-full bg-[#F67C01] text-white font-black py-5 rounded-[2rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-orange-600 transition-all">
                        {isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : 'Lançar no Caixa'}
                    </button>
                </form>
            </div>
         </div>
      )}
    </div>
  );
};

// Fix: Added missing ScheduleView component
const ScheduleView = ({ userId }: { userId: string }) => {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<ScheduleItem>>({ 
    title: '', 
    client: '', 
    date: new Date().toISOString().split('T')[0], 
    time: '09:00', 
    type: 'servico', 
    status: 'pending' 
  });

  useEffect(() => { loadSchedule(); }, []);
  const loadSchedule = async () => {
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
      await mockBackend.addScheduleItem({ ...formData, userId } as ScheduleItem);
      setIsModalOpen(false);
      await loadSchedule();
      setFormData({ title: '', client: '', date: new Date().toISOString().split('T')[0], time: '09:00', type: 'servico', status: 'pending' });
    } finally { setIsSaving(false); }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Excluir este compromisso?')) return;
    await mockBackend.deleteScheduleItem(id);
    await loadSchedule();
  };

  return (
    <div className="space-y-8 animate-fade-in">
       <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-8">
          <div className="flex justify-between items-center">
             <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight flex items-center gap-3">
                <CalendarDays className="text-indigo-600" /> Agenda de Serviços
             </h3>
             <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" /> NOVO AGENDAMENTO
             </button>
          </div>

          <div className="grid gap-4">
             {items.length > 0 ? items.map(item => (
                <div key={item.id} className="p-8 bg-gray-50 dark:bg-zinc-800/40 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:bg-white transition-all">
                   <div className="flex items-center gap-8">
                      <div className="flex flex-col items-center justify-center w-20 h-20 bg-white dark:bg-zinc-900 rounded-[1.8rem] shadow-sm border border-indigo-50 dark:border-indigo-900">
                         <span className="text-[10px] font-black text-indigo-400 uppercase">{new Date(item.date).toLocaleDateString('pt-BR', { month: 'short' })}</span>
                         <span className="text-2xl font-black text-gray-900 dark:text-white">{new Date(item.date).getDate()}</span>
                      </div>
                      <div>
                         <h4 className="font-black text-gray-900 dark:text-white text-xl tracking-tight leading-none mb-2">{item.title}</h4>
                         <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> {item.client}</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {item.time}</span>
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] ${
                         item.type === 'visita' ? 'bg-purple-50 text-purple-600' :
                         item.type === 'reuniao' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                         {item.type}
                      </span>
                      <button onClick={() => handleDeleteItem(item.id)} className="p-3 text-slate-200 hover:text-rose-500 transition-colors">
                         <Trash2 className="w-5 h-5" />
                      </button>
                   </div>
                </div>
             )) : (
                <div className="text-center py-24 opacity-30">
                   <Calendar className="w-16 h-16 mx-auto mb-6" />
                   <p className="text-[10px] font-black uppercase tracking-[0.3em]">Agenda livre por enquanto.</p>
                </div>
             )}
          </div>
       </div>

       {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
             <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-white/5 animate-scale-in">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                    <div><h3 className="text-2xl font-black uppercase italic tracking-tighter">Agendamento</h3></div>
                    <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                <form onSubmit={handleSaveItem} className="p-10 space-y-6">
                    <div className="space-y-6">
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Título do Compromisso</label>
                          <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ex: Entrega de Pedido" />
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Nome do Cliente</label>
                          <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
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
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Tipo de Serviço</label>
                          <select className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                             <option value="servico">Execução de Serviço</option>
                             <option value="visita">Visita Técnica</option>
                             <option value="reuniao">Reunião / Café</option>
                          </select>
                       </div>
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

const MenuzapProView = ({ user }: { user: any }) => {
    return (
        <div className="space-y-10 animate-fade-in">
            <div className="bg-gradient-to-br from-[#0F172A] via-brand-dark to-indigo-900 rounded-[3.5rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl border border-white/5">
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="space-y-8 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F67C01]/20 rounded-full text-[10px] font-black uppercase tracking-widest text-[#F67C01] border border-[#F67C01]/20">
                            <Zap className="w-4 h-4" /> Integração Nativa
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-[0.9]">
                            Menuzap <br/>
                            <span className="text-[#F67C01]">Pro Extension</span>
                        </h2>
                        <p className="text-slate-300 text-lg font-medium leading-relaxed">
                            Conecte seu WhatsApp Web diretamente ao seu Kanban e Agenda. Gerencie leads, mova cards e agende horários sem sair da conversa.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a 
                                href="/menuzap-pro-placeholder.txt" 
                                download="menuzap-pro.txt"
                                className="inline-flex items-center gap-3 bg-[#F67C01] text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl active:scale-95"
                            >
                                BAIXAR EXTENSÃO <RefreshCw className="w-5 h-5" />
                            </a>
                            <div className="flex items-center gap-3 px-6 py-4 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10">
                                <div className="text-left">
                                    <p className="text-[8px] font-black text-[#F67C01] uppercase tracking-widest">SEU TOKEN DE ACESSO</p>
                                    <p className="text-xs font-mono font-bold tracking-wider">MN-PRO-{user.id.substring(0, 8).toUpperCase()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative hidden lg:block">
                        <div className="w-80 h-80 bg-[#F67C01]/20 rounded-full blur-[100px] absolute inset-0 animate-pulse"></div>
                        <div className="relative bg-white/5 backdrop-blur-2xl p-10 rounded-[4rem] border border-white/10 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                            <Smartphone className="w-48 h-48 text-[#F67C01] opacity-80" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { 
                        step: '01', 
                        title: 'Instale a Extensão', 
                        desc: 'Baixe o arquivo e adicione ao seu navegador Chrome em segundos.', 
                        icon: RefreshCw,
                        instruction: 'Vá em chrome://extensions, ative o "Modo do desenvolvedor" e clique em "Carregar sem compactação". Selecione a pasta baixada.'
                    },
                    { 
                        step: '02', 
                        title: 'Conecte seu Token', 
                        desc: 'Copie seu token de acesso acima e cole na barra lateral do WhatsApp.', 
                        icon: Lock,
                        instruction: 'Abra o WhatsApp Web, clique no ícone de raio (⚡) e cole seu token MN-PRO.'
                    },
                    { 
                        step: '03', 
                        title: 'Sincronize Leads', 
                        desc: 'Seus contatos do WhatsApp agora aparecem direto no seu Kanban.', 
                        icon: Layout,
                        instruction: 'Mova cards, crie agendamentos e gerencie seu caixa sem sair da conversa.'
                    }
                ].map((item, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-gray-100 dark:border-zinc-800 shadow-sm space-y-6 group hover:border-orange-500/30 transition-all">
                        <div className="w-14 h-14 bg-orange-50 dark:bg-orange-950/30 rounded-2xl flex items-center justify-center text-[#F67C01] font-black text-xl italic">
                            {item.step}
                        </div>
                        <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight">
                            <item.icon className="w-5 h-5 inline-block mr-2 mb-1 text-[#F67C01]" />
                            {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium leading-relaxed">{item.desc}</p>
                        <div className="pt-4 border-t border-gray-50 dark:border-zinc-800">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                {item.instruction}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

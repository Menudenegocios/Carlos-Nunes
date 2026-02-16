
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { Lead, PipelineStage, FinancialEntry, ScheduleItem, LeadTimelineEvent } from '../types';
import { 
  DollarSign, Calendar, Plus, TrendingUp, TrendingDown, 
  X, Trash2, CheckCircle, Clock, Briefcase, Edit3, 
  Phone, User as UserIcon, MessageCircle, MoreVertical,
  Filter, Download, ArrowRight, Wallet, Receipt,
  CheckCircle2, AlertCircle, CalendarDays, GripVertical, HelpCircle, Home as HomeIcon,
  Search, History, Send, Zap, ChevronRight
} from 'lucide-react';
import { SectionLanding } from '../components/SectionLanding';

export const BusinessSuite: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'crm' | 'finance' | 'schedule'>('home');

  useEffect(() => {
    const checkLeads = async () => {
      if (!user) return;
      await mockBackend.getLeads(user.id);
    };
    checkLeads();
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4 px-4">
      {/* Academy Style Header */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-indigo-950 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
                 <Briefcase className="h-10 w-10 text-emerald-400" />
              </div>
              <div>
                 <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none mb-1">Vendas & Gestão</h1>
                 <p className="text-emerald-200 text-lg font-medium opacity-80 uppercase tracking-widest text-xs">Controle total da sua operação comercial.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
               <div className="flex p-1.5 bg-black/20 backdrop-blur-md rounded-[1.8rem] border border-white/10 overflow-x-auto scrollbar-hide">
                  {[
                    { id: 'home', label: 'INÍCIO', icon: HomeIcon },
                    { id: 'crm', label: 'CRM', icon: Briefcase },
                    { id: 'finance', label: 'CAIXA', icon: DollarSign },
                    { id: 'schedule', label: 'AGENDA', icon: Calendar }
                  ].map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-3 px-6 py-3 rounded-[1.4rem] font-black text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-xl' : 'text-emerald-100 hover:bg-white/10'}`}>
                      <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                  ))}
               </div>
            </div>
        </div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      <div className="animate-[fade-in_0.4s_ease-out]">
        {activeTab === 'home' && (
            <SectionLanding 
                title="Transforme Interessados em Clientes Fiéis."
                subtitle="Business Suite"
                description="Assuma o controle total do seu processo comercial. Organize seus contatos em um funil visual, gerencie sua agenda e acompanhe o faturamento em tempo real."
                benefits={[
                "CRM Kanban: Arraste e solte seus leads no funil de vendas.",
                "Agenda Integrada: Nunca mais perca o horário de um serviço.",
                "Gestão de Caixa: Controle entradas e saídas de forma simplificada.",
                "Histórico Completo: Timeline detalhada de cada negociação.",
                "Respostas Rápidas: Modelos prontos para acelerar conversas."
                ]}
                youtubeId="dQw4w9WgXcQ"
                ctaLabel="ABRIR MEU PIPELINE"
                onStart={() => setActiveTab('crm')}
                icon={Briefcase}
                accentColor="emerald"
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
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Lead>>({ name: '', phone: '', source: 'manual', stage: 'new', value: 0 });

  useEffect(() => { loadLeads(); }, []);
  const loadLeads = async () => { 
      const data = await mockBackend.getLeads(userId); 
      const enriched = data.map(l => ({
          ...l,
          createdAt: l.createdAt || Date.now() - 86400000 * 2,
          timeline: l.timeline || [
              { id: '1', type: 'creation', content: `Lead capturado via ${l.source}`, createdAt: Date.now() - 86400000 * 2 }
          ]
      }));
      setLeads(enriched); 
  };

  const stages: { id: PipelineStage; label: string; bg: string; color: string }[] = [
    { id: 'new', label: 'Aberto', bg: 'bg-indigo-500', color: 'text-indigo-600' },
    { id: 'contacted', label: 'Em Contato', bg: 'bg-amber-500', color: 'text-amber-600' },
    { id: 'negotiation', label: 'Negociação', bg: 'bg-emerald-500', color: 'text-emerald-600' },
    { id: 'closed', label: 'Ganhos', bg: 'bg-emerald-600', color: 'text-emerald-700' },
  ];

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLead) {
      await mockBackend.updateLead(editingLead.id, formData);
    } else {
      await mockBackend.addLeads([{ ...formData, id: Math.random().toString(36).substr(2, 9), userId, createdAt: Date.now() } as Lead]);
    }
    setIsModalOpen(false);
    loadLeads();
  };

  const moveLead = async (id: string, stage: PipelineStage) => {
    await mockBackend.updateLeadStage(id, stage);
    loadLeads();
  };

  const handleDragStart = (id: string) => { setDraggedLeadId(id); };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };
  const handleDrop = async (stage: PipelineStage) => {
    if (draggedLeadId) {
      await moveLead(draggedLeadId, stage);
      setDraggedLeadId(null);
    }
  };

  const deleteLead = async (id: string) => {
    if (window.confirm('Excluir este lead?')) {
      await mockBackend.deleteLead(id);
      loadLeads();
    }
  };

  const sendQuickReply = (phone: string, msg: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const totalLeadValue = leads.filter(l => l.stage === 'closed').reduce((acc, curr) => acc + (curr.value || 0), 0);
  const activeLeadsCount = leads.length;
  const costPerLead = 29.90 / (activeLeadsCount || 1);

  return (
    <div className="space-y-8">
      {/* ROI Widget */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4">
          <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-emerald-900/10 flex flex-col justify-between h-44 group">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Faturamento Real</p>
                <h4 className="text-4xl font-black mt-1 leading-none tracking-tighter">R$ {totalLeadValue.toFixed(2)}</h4>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-100">
                  <TrendingUp className="w-4 h-4" /> ROI: {((totalLeadValue / 29.90) * 100).toFixed(0)}%
              </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between h-44">
              <div>
                <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Custo por Lead</p>
                <h4 className="text-4xl font-black text-gray-900 dark:text-white mt-1 leading-none tracking-tighter">R$ {costPerLead.toFixed(2)}</h4>
              </div>
              <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase">Meta de Aquisição</p>
          </div>
          <div className="md:col-span-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-[2.5rem] p-8 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between gap-6">
             <div className="space-y-2">
                <h5 className="font-black text-emerald-900 dark:text-emerald-400 text-sm uppercase tracking-tight">Análise da MenuIA</h5>
                <p className="text-xs text-gray-600 dark:text-zinc-400 font-medium leading-relaxed">Sua conversão em leads B2B está 20% acima da média. Continue usando as Respostas Rápidas!</p>
             </div>
             <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm"><Zap className="w-8 h-8" /></div>
          </div>
      </div>

      <div className="flex justify-between items-center px-4 pt-4">
         <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Pipeline de Vendas</h3>
         <button onClick={() => { setEditingLead(null); setFormData({ name: '', phone: '', source: 'manual', stage: 'new', value: 0 }); setIsModalOpen(true); }} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-700 flex items-center gap-2 transition-all">
            <Plus className="w-5 h-5" /> Novo Lead
         </button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 px-4 scrollbar-hide">
        {stages.map(stage => (
          <div key={stage.id} onDragOver={handleDragOver} onDrop={() => handleDrop(stage.id)} className="min-w-[320px] bg-gray-50/50 dark:bg-zinc-900/30 rounded-[3rem] p-4 flex flex-col h-[650px] border border-gray-200/50 dark:border-zinc-800/50">
             <div className="p-5 mb-4 flex justify-between items-center bg-white dark:bg-zinc-900 rounded-[1.8rem] shadow-sm border border-gray-100 dark:border-zinc-800">
                <h3 className="font-black text-gray-900 dark:text-white text-[10px] uppercase tracking-widest flex items-center gap-2">
                   <span className={`w-2.5 h-2.5 rounded-full ${stage.bg}`}></span> {stage.label}
                </h3>
                <span className="text-[10px] font-black text-gray-400 bg-gray-50 dark:bg-zinc-800 px-2.5 py-1 rounded-lg">
                   {leads.filter(l => l.stage === stage.id).length}
                </span>
             </div>
             <div className="flex-1 space-y-4 overflow-y-auto px-2 scrollbar-hide">
                {leads.filter(l => l.stage === stage.id).map(lead => (
                   <div key={lead.id} draggable onDragStart={() => handleDragStart(lead.id)} className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-zinc-800 hover:shadow-xl hover:border-emerald-500/20 transition-all group cursor-grab active:cursor-grabbing" onClick={() => { setEditingLead(lead); setFormData(lead); setIsModalOpen(true); }}>
                      <div className="flex items-center gap-2 mb-4">
                         <GripVertical className="w-4 h-4 text-gray-300" />
                         <span className="text-[9px] font-black uppercase px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-100 dark:border-emerald-900/40">{lead.source}</span>
                      </div>
                      <h4 className="font-black text-gray-900 dark:text-white text-base mb-1 tracking-tight">{lead.name}</h4>
                      <p className="text-xs text-gray-400 dark:text-zinc-500 font-bold mb-4 uppercase">{lead.phone}</p>
                      
                      {lead.value > 0 && (
                         <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-xl p-3 mb-4 border border-emerald-100 dark:border-emerald-900/30">
                            <p className="text-[9px] font-black text-emerald-600 uppercase mb-0.5">Valor do Negócio</p>
                            <p className="text-sm font-black text-emerald-800 dark:text-emerald-400">R$ {lead.value.toFixed(2)}</p>
                         </div>
                      )}

                      <div className="flex justify-between items-center pt-4 border-t border-gray-50 dark:border-zinc-800/50">
                         <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <a href={`tel:${lead.phone}`} className="p-2.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"><Phone className="w-4 h-4" /></a>
                            <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" className="p-2.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"><MessageCircle className="w-4 h-4" /></a>
                         </div>
                         <span className="text-[8px] font-black text-gray-300 uppercase">{new Date(lead.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-5xl h-fit max-h-[90vh] p-0 shadow-2xl overflow-hidden flex flex-col md:flex-row animate-[scale-in_0.3s_ease-out]">
               <div className="flex-1 p-10 md:p-12 border-r border-gray-100 dark:border-zinc-800 overflow-y-auto">
                   <div className="flex justify-between items-center mb-8">
                      <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">{editingLead ? 'Detalhes do Lead' : 'Novo Lead'}</h3>
                      <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-gray-400 hover:text-rose-500 transition-colors"><X className="w-6 h-6" /></button>
                   </div>
                   
                   <form onSubmit={handleSaveLead} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Nome Completo</label>
                            <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white focus:ring-4 focus:ring-emerald-500/10 transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">WhatsApp</label>
                            <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white focus:ring-4 focus:ring-emerald-500/10 transition-all" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Valor Estimado (R$)</label>
                            <input type="number" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white focus:ring-4 focus:ring-emerald-500/10 transition-all" value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Origem</label>
                            <select className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white focus:ring-4 focus:ring-emerald-500/10 transition-all" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value as any})}>
                                <option value="manual">Manual</option>
                                <option value="maps">Google Maps</option>
                                <option value="instagram">Instagram</option>
                                <option value="cnpj">Radar CNPJ</option>
                            </select>
                        </div>
                      </div>

                      <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Notas Internas</label>
                          <textarea rows={3} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-[2rem] p-6 font-medium text-sm dark:text-white focus:ring-4 focus:ring-emerald-500/10 resize-none transition-all" value={formData.notes || ''} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Anote interesses ou pontos importantes..." />
                      </div>

                      <div className="flex gap-4 pt-6 border-t border-gray-100 dark:border-zinc-800">
                        <button type="submit" className="flex-1 bg-emerald-600 text-white font-black py-5 rounded-2xl shadow-xl uppercase tracking-widest text-sm hover:bg-emerald-700 active:scale-95 transition-all">SALVAR REGISTRO</button>
                        {editingLead && <button type="button" onClick={() => deleteLead(editingLead.id)} className="p-5 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 className="w-6 h-6" /></button>}
                      </div>
                   </form>
               </div>

               <div className="w-full md:w-80 bg-gray-50 dark:bg-zinc-950 p-10 md:p-12 overflow-y-auto">
                    <h5 className="font-black text-gray-900 dark:text-white text-sm uppercase tracking-widest mb-10 flex items-center gap-3"><History className="text-emerald-600" /> Histórico</h5>
                    <div className="space-y-10 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-zinc-800">
                        {editingLead?.timeline?.map(event => (
                            <div key={event.id} className="relative pl-10">
                                <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-gray-50 dark:border-zinc-950 flex items-center justify-center ${event.type === 'creation' ? 'bg-emerald-600' : 'bg-indigo-600'}`}>
                                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                </div>
                                <p className="text-[10px] font-black text-gray-400 dark:text-zinc-600 uppercase tracking-widest mb-1">{new Date(event.createdAt).toLocaleDateString()}</p>
                                <p className="text-xs font-bold text-gray-700 dark:text-gray-300 leading-relaxed">{event.content}</p>
                            </div>
                        )) || (
                            <div className="text-center py-10">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sem eventos registrados</p>
                            </div>
                        )}
                    </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

const FinanceView = ({ userId }: { userId: string }) => {
  const [entries, setEntries] = useState<FinancialEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<FinancialEntry>>({ description: '', value: 0, type: 'income', category: 'Vendas' });

  useEffect(() => { loadEntries(); }, []);
  const loadEntries = async () => { const data = await mockBackend.getFinanceEntries(userId); setEntries(data); };

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    await mockBackend.addFinanceEntry({ ...formData, userId, date: new Date().toISOString() } as FinancialEntry);
    setIsModalOpen(false);
    loadEntries();
  };

  const deleteEntry = async (id: string) => {
    if (window.confirm('Excluir lançamento?')) {
      await mockBackend.deleteFinanceEntry(id);
      loadEntries();
    }
  };

  const totals = entries.reduce((acc, curr) => {
    if (curr.type === 'income') acc.income += curr.value;
    else acc.expense += curr.value;
    return acc;
  }, { income: 0, expense: 0 });

  return (
    <div className="space-y-12 animate-fade-in px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white dark:bg-zinc-900 p-10 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400"><TrendingUp className="w-5 h-5" /></div>
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Entradas</span>
            </div>
            <h3 className="text-4xl font-black text-emerald-600 leading-none tracking-tighter">R$ {totals.income.toFixed(2)}</h3>
         </div>
         <div className="bg-white dark:bg-zinc-900 p-10 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950 flex items-center justify-center text-rose-600 dark:text-rose-400"><TrendingDown className="w-5 h-5" /></div>
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Saídas</span>
            </div>
            <h3 className="text-4xl font-black text-rose-600 leading-none tracking-tighter">R$ {totals.expense.toFixed(2)}</h3>
         </div>
         <div className="bg-emerald-600 p-10 rounded-[2.5rem] text-white shadow-xl shadow-emerald-900/10 relative overflow-hidden group">
            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-100"><Wallet className="w-5 h-5" /></div>
                  <span className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.2em]">Saldo Livre</span>
               </div>
               <h3 className="text-4xl font-black leading-none tracking-tighter">R$ {(totals.income - totals.expense).toFixed(2)}</h3>
            </div>
         </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-8 md:p-12 border border-gray-100 dark:border-zinc-800 shadow-xl">
         <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Fluxo de Caixa</h3>
            <button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-700 flex items-center gap-2 transition-all">
               <Plus className="w-5 h-5" /> Novo Lançamento
            </button>
         </div>

         <div className="space-y-4">
            {entries.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(entry => (
               <div key={entry.id} className="flex items-center justify-between p-6 bg-gray-50/50 dark:bg-zinc-800/30 rounded-2xl border border-gray-100 dark:border-zinc-800 group transition-all">
                  <div className="flex items-center gap-6">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${entry.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {entry.type === 'income' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                     </div>
                     <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{entry.description}</h4>
                        <p className="text-xs text-gray-400 font-black uppercase tracking-widest">{entry.category} • {new Date(entry.date).toLocaleDateString()}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-8">
                     <span className={`text-lg font-black ${entry.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {entry.type === 'income' ? '+' : '-'} R$ {entry.value.toFixed(2)}
                     </span>
                     <button onClick={() => deleteEntry(entry.id)} className="p-2 text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

const ScheduleView = ({ userId }: { userId: string }) => {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ScheduleItem>>({ title: '', client: '', date: '', time: '', type: 'servico', status: 'pending' });

  useEffect(() => { loadItems(); }, []);
  const loadItems = async () => { const data = await mockBackend.getSchedule(userId); setItems(data); };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    await mockBackend.addScheduleItem({ ...formData, userId } as ScheduleItem);
    setIsModalOpen(false);
    loadItems();
  };

  return (
    <div className="space-y-8 animate-fade-in px-4">
      <div className="flex justify-between items-center px-4">
         <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Agenda de Compromissos</h3>
         <button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 transition-all">
            <Plus className="w-5 h-5" /> Agendar
         </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-8 md:p-12 border border-gray-100 dark:border-zinc-800 shadow-xl min-h-[500px]">
         <div className="space-y-6">
            {items.length === 0 ? (
               <div className="text-center py-20">
                  <Calendar className="w-16 h-16 text-gray-200 dark:text-zinc-800 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Sua agenda está vazia para este mês.</p>
               </div>
            ) : items.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(item => (
               <div key={item.id} className={`flex flex-col md:flex-row items-center justify-between p-6 rounded-[2rem] border transition-all ${item.status === 'completed' ? 'bg-gray-50 opacity-60' : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 hover:shadow-md'}`}>
                  <div className="flex items-center gap-6">
                     <div className="text-center min-w-[60px]">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{new Date(item.date).toLocaleDateString('pt-BR', { month: 'short' })}</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white leading-none tracking-tighter">{new Date(item.date).getDate()}</p>
                     </div>
                     <div>
                        <h4 className="font-black text-gray-900 dark:text-white">{item.title}</h4>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{item.client}</p>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-zinc-800 rounded-xl text-xs font-black text-gray-500">
                        <Clock className="w-3.5 h-3.5" /> {item.time}
                     </div>
                     <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        item.type === 'visita' ? 'bg-indigo-50 text-indigo-600' :
                        item.type === 'reuniao' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600'
                     }`}>{item.type}</span>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

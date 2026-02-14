
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { Lead, PipelineStage, FinancialEntry, ScheduleItem } from '../types';
import { 
  DollarSign, Calendar, Plus, TrendingUp, TrendingDown, 
  X, Trash2, CheckCircle, Clock, Briefcase, Edit3, 
  Phone, User as UserIcon, MessageCircle, MoreVertical,
  Filter, Download, ArrowRight, Wallet, Receipt,
  CheckCircle2, AlertCircle, CalendarDays, GripVertical, HelpCircle, Home as HomeIcon
} from 'lucide-react';
import { SectionLanding } from '../components/SectionLanding';

export const BusinessSuite: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'crm' | 'finance' | 'schedule'>('home');

  useEffect(() => {
    const checkLeads = async () => {
      if (!user) return;
      const leads = await mockBackend.getLeads(user.id);
      if (leads && leads.length > 0) {
        // Se já tem leads, podemos começar no CRM, mas a Home continua no menu
      }
    };
    checkLeads();
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4 px-4">
      {/* Academy Style Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
                 <Briefcase className="h-10 w-10 text-indigo-300" />
              </div>
              <div>
                 <h1 className="text-3xl md:text-5xl font-black tracking-tight">Vendas & Gestão</h1>
                 <p className="text-indigo-200 text-lg font-medium">Gestão profissional para o seu negócio local.</p>
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
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-3 px-6 py-3 rounded-[1.4rem] font-black text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-indigo-900 shadow-xl' : 'text-indigo-100 hover:bg-white/10'}`}>
                      <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                  ))}
               </div>
            </div>
        </div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      <div className="animate-[fade-in_0.4s_ease-out]">
        {activeTab === 'home' && (
            <SectionLanding 
                title="Transforme Interessados em Clientes Fiéis."
                subtitle="Business Suite Menuflow"
                description="Assuma o controle total do seu processo comercial. Organize seus contatos em um funil de vendas visual, gerencie sua agenda de serviços e acompanhe o fluxo de caixa do seu negócio em um só painel."
                benefits={[
                "CRM Kanban: Arraste e solte seus leads entre as etapas de negociação.",
                "Agenda Integrada: Nunca mais perca o horário de um serviço ou reunião.",
                "Controle de Caixa: Registre entradas e saídas de forma simplificada.",
                "Histórico de Contatos: Saiba exatamente o que foi conversado com cada lead.",
                "Dashboards de Performance: Veja quanto seu negócio está gerando em tempo real."
                ]}
                youtubeId="dQw4w9WgXcQ"
                ctaLabel="ABRIR MEU PIPELINE"
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

// ... Resto das views permanecem iguais (CRMView, FinanceView, ScheduleView)
const CRMView = ({ userId }: { userId: string }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Lead>>({ name: '', phone: '', source: 'manual', stage: 'new', value: 0 });

  useEffect(() => { loadLeads(); }, []);
  const loadLeads = async () => { const data = await mockBackend.getLeads(userId); setLeads(data); };

  const stages: { id: PipelineStage; label: string; bg: string; color: string }[] = [
    { id: 'new', label: 'Aberto', bg: 'bg-blue-500', color: 'text-blue-600' },
    { id: 'contacted', label: 'Em Contato', bg: 'bg-amber-500', color: 'text-amber-600' },
    { id: 'negotiation', label: 'Negociação', bg: 'bg-purple-500', color: 'text-purple-600' },
    { id: 'closed', label: 'Ganhos', bg: 'bg-emerald-500', color: 'text-emerald-600' },
  ];

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLead) {
      await mockBackend.updateLead(editingLead.id, formData);
    } else {
      await mockBackend.addLeads([{ ...formData, id: Math.random().toString(36).substr(2, 9), userId } as Lead]);
    }
    setIsModalOpen(false);
    loadLeads();
  };

  const moveLead = async (id: string, stage: PipelineStage) => {
    await mockBackend.updateLeadStage(id, stage);
    loadLeads();
  };

  const handleDragStart = (id: string) => {
    setDraggedLeadId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center px-4">
         <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Pipeline de Vendas</h3>
         <button onClick={() => { setEditingLead(null); setFormData({ name: '', phone: '', source: 'manual', stage: 'new', value: 0 }); setIsModalOpen(true); }} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-700 flex items-center gap-2">
            <Plus className="w-5 h-5" /> Novo Lead
         </button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 px-4 scrollbar-hide">
        {stages.map(stage => (
          <div 
            key={stage.id} 
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(stage.id)}
            className="min-w-[320px] bg-gray-100/50 rounded-[2.5rem] p-4 flex flex-col h-[650px] border border-gray-200/50 dark:bg-zinc-800/30 dark:border-zinc-800"
          >
             <div className="p-4 mb-4 flex justify-between items-center bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
                <h3 className="font-black text-gray-900 dark:text-white text-xs uppercase tracking-widest flex items-center gap-2">
                   <span className={`w-2.5 h-2.5 rounded-full ${stage.bg}`}></span> {stage.label}
                </h3>
                <span className="text-[10px] font-black text-gray-400 bg-gray-50 dark:bg-zinc-800 px-2 py-1 rounded-lg">
                   {leads.filter(l => l.stage === stage.id).length}
                </span>
             </div>
             <div className="flex-1 space-y-4 overflow-y-auto px-2 scrollbar-hide">
                {leads.filter(l => l.stage === stage.id).map(lead => (
                   <div 
                    key={lead.id} 
                    draggable
                    onDragStart={() => handleDragStart(lead.id)}
                    className="bg-white dark:bg-zinc-900 p-5 rounded-[1.8rem] shadow-sm border border-gray-100 dark:border-zinc-800 hover:shadow-lg transition-all group cursor-grab active:cursor-grabbing"
                   >
                      <div className="flex justify-between items-start mb-3">
                         <div className="flex items-center gap-2">
                            <GripVertical className="w-3.5 h-3.5 text-gray-300" />
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg bg-gray-50 dark:bg-zinc-800 text-gray-400 border border-gray-100 dark:border-zinc-700`}>{lead.source}</span>
                         </div>
                         <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingLead(lead); setFormData(lead); setIsModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-indigo-600"><Edit3 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => deleteLead(lead.id)} className="p-1.5 text-gray-400 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
                         </div>
                      </div>
                      <h4 className="font-black text-gray-900 dark:text-white text-sm mb-1">{lead.name}</h4>
                      <p className="text-xs text-gray-500 font-medium mb-4">{lead.phone}</p>
                      
                      {lead.value ? (
                         <div className="bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl p-3 mb-4 border border-indigo-100/50 dark:border-indigo-800/30">
                            <p className="text-[9px] font-black text-indigo-400 uppercase mb-1">Valor Estimado</p>
                            <p className="text-sm font-black text-indigo-700 dark:text-indigo-300">R$ {lead.value.toFixed(2)}</p>
                         </div>
                      ) : null}

                      <div className="flex justify-between items-center pt-3 border-t border-gray-50 dark:border-zinc-800">
                         <div className="flex gap-1">
                            <a href={`tel:${lead.phone}`} className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"><Phone className="w-3.5 h-3.5" /></a>
                            <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"><MessageCircle className="w-3.5 h-3.5" /></a>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">{editingLead ? 'Editar Lead' : 'Novo Lead'}</h3>
                  <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6 text-gray-300" /></button>
               </div>
               <form onSubmit={handleSaveLead} className="space-y-6">
                  <div>
                     <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Nome do Cliente</label>
                     <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white focus:ring-2 focus:ring-indigo-100" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">WhatsApp</label>
                        <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white focus:ring-2 focus:ring-indigo-100" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                     </div>
                     <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Valor (R$)</label>
                        <input type="number" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-4 font-bold dark:text-white focus:ring-2 focus:ring-indigo-100" value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} />
                     </div>
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl uppercase tracking-widest text-sm">SALVAR</button>
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
            <h3 className="text-4xl font-black text-emerald-600">R$ {totals.income.toFixed(2)}</h3>
         </div>
         <div className="bg-white dark:bg-zinc-900 p-10 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950 flex items-center justify-center text-rose-600 dark:text-rose-400"><TrendingDown className="w-5 h-5" /></div>
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Saídas</span>
            </div>
            <h3 className="text-4xl font-black text-rose-600">R$ {totals.expense.toFixed(2)}</h3>
         </div>
         <div className="bg-indigo-600 p-10 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-100"><Wallet className="w-5 h-5" /></div>
                  <span className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">Saldo Livre</span>
               </div>
               <h3 className="text-4xl font-black">R$ {(totals.income - totals.expense).toFixed(2)}</h3>
            </div>
         </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-8 md:p-12 border border-gray-100 dark:border-zinc-800 shadow-xl">
         <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Extrato</h3>
            <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-700 flex items-center gap-2">
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
         <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2">
            <Plus className="w-5 h-5" /> Agendar
         </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-8 md:p-12 border border-gray-100 dark:border-zinc-800 shadow-xl min-h-[500px]">
         <div className="space-y-6">
            {items.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(item => (
               <div key={item.id} className={`flex flex-col md:flex-row items-center justify-between p-6 rounded-[2rem] border transition-all ${item.status === 'completed' ? 'bg-gray-50 opacity-60' : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 hover:shadow-md'}`}>
                  <div className="flex items-center gap-6">
                     <div className="text-center min-w-[60px]">
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{new Date(item.date).toLocaleDateString('pt-BR', { month: 'short' })}</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">{new Date(item.date).getDate()}</p>
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
                        item.type === 'visita' ? 'bg-purple-50 text-purple-600' :
                        item.type === 'reuniao' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'
                     }`}>{item.type}</span>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { Lead, PipelineStage, FinancialEntry, ScheduleItem, Client, CRMTask, QuickMessageTemplate } from '../types';
import { 
  DollarSign, Calendar, Plus, TrendingUp, TrendingDown, 
  X, Trash2, CheckCircle, Clock, Briefcase, 
  Home as HomeIcon, RefreshCw, Zap, ArrowRight, User, Layout, GripVertical,
  Filter, CalendarDays, Wallet, ArrowUpCircle, ArrowDownCircle,
  Lock, Crown, Smartphone, MessageSquare, CreditCard, Link as LinkIcon, FileText, ExternalLink
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
                { id: 'menuzap_pro', label: 'MENUZAP', desc: 'Agentes de IA', icon: Zap }
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
  const [activeSubTab, setActiveSubTab] = useState<'pipeline' | 'clients' | 'followup' | 'reports' | 'quick_messages'>('pipeline');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isQuickMessageModalOpen, setIsQuickMessageModalOpen] = useState(false);
  const [tasks, setTasks] = useState<CRMTask[]>([]);
  const [quickMessages, setQuickMessages] = useState<QuickMessageTemplate[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingTask, setEditingTask] = useState<CRMTask | null>(null);
  const [editingQuickMessage, setEditingQuickMessage] = useState<QuickMessageTemplate | null>(null);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Lead>>({ name: '', phone: '', source: 'manual', stage: 'new', value: 0, notes: '' });
  const [clientFormData, setClientFormData] = useState<Partial<Client>>({ name: '', phone: '', email: '', company: '', notes: '', tags: [], birthDate: '' });
  const [taskFormData, setTaskFormData] = useState<Partial<CRMTask>>({ title: '', description: '', dueDate: Date.now() + 86400000, status: 'pending', type: 'call' });
  const [quickMessageFormData, setQuickMessageFormData] = useState<Partial<QuickMessageTemplate>>({ title: '', content: '', category: 'primeiro_contato' });

  useEffect(() => { 
    loadLeads(); 
    loadClients();
    loadTasks();
    loadQuickMessages();
  }, []);

  const loadQuickMessages = async () => {
      try {
        const data = await mockBackend.getQuickMessages(userId);
        setQuickMessages(data);
      } catch (e) { console.error(e); }
  };

  const loadTasks = async () => {
      try {
        const data = await mockBackend.getCRMTasks(userId);
        setTasks(data);
      } catch (e) { console.error(e); }
  };

  const loadLeads = async () => { 
      try {
        const data = await mockBackend.getLeads(userId); 
        setLeads(data); 
      } catch (e) { console.error(e); }
  };

  const loadClients = async () => {
      try {
        const data = await mockBackend.getClients(userId);
        setClients(data);
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

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setIsSaving(true);
    try {
        if (editingClient) await mockBackend.updateClient(editingClient.id, { ...clientFormData, userId });
        else await mockBackend.addClient({ ...clientFormData, userId } as Client);
        setIsClientModalOpen(false);
        await loadClients();
        setClientFormData({ name: '', phone: '', email: '', company: '', notes: '', tags: [] });
    } finally { setIsSaving(false); }
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setIsSaving(true);
    try {
        if (editingTask) await mockBackend.updateCRMTask(editingTask.id, { ...taskFormData, userId });
        else await mockBackend.addCRMTask({ ...taskFormData, userId } as CRMTask);
        setIsTaskModalOpen(false);
        await loadTasks();
        setTaskFormData({ title: '', description: '', dueDate: Date.now() + 86400000, status: 'pending', type: 'call' });
    } finally { setIsSaving(false); }
  };

  const handleSaveQuickMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setIsSaving(true);
    try {
        if (editingQuickMessage) await mockBackend.updateQuickMessage(editingQuickMessage.id, { ...quickMessageFormData, userId });
        else await mockBackend.addQuickMessage({ ...quickMessageFormData, userId } as QuickMessageTemplate);
        setIsQuickMessageModalOpen(false);
        await loadQuickMessages();
        setQuickMessageFormData({ title: '', content: '', category: 'primeiro_contato' });
    } finally { setIsSaving(false); }
  };

  const handleToggleTaskStatus = async (task: CRMTask) => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    await mockBackend.updateCRMTask(task.id, { status: newStatus, userId });
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    await mockBackend.deleteCRMTask(id, userId);
    await loadTasks();
  };

  const handleDeleteQuickMessage = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta mensagem?')) return;
    await mockBackend.deleteQuickMessage(id, userId);
    await loadQuickMessages();
  };

  const handleDeleteClient = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;
    await mockBackend.deleteClient(id, userId);
    await loadClients();
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
      {/* Sub-abas do CRM */}
      <div className="flex p-1.5 bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-zinc-800 w-fit gap-1 overflow-x-auto scrollbar-hide max-w-full">
          <button onClick={() => setActiveSubTab('pipeline')} className={`px-8 py-3 rounded-[1.4rem] font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === 'pipeline' ? 'bg-[#F67C01] text-white shadow-lg' : 'text-slate-400 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}>Funil de Vendas</button>
          <button onClick={() => setActiveSubTab('clients')} className={`px-8 py-3 rounded-[1.4rem] font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === 'clients' ? 'bg-[#F67C01] text-white shadow-lg' : 'text-slate-400 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}>Carteira (Clientes)</button>
          <button onClick={() => setActiveSubTab('followup')} className={`px-8 py-3 rounded-[1.4rem] font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === 'followup' ? 'bg-[#F67C01] text-white shadow-lg' : 'text-slate-400 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}>Follow-up</button>
          <button onClick={() => setActiveSubTab('quick_messages')} className={`px-8 py-3 rounded-[1.4rem] font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === 'quick_messages' ? 'bg-[#F67C01] text-white shadow-lg' : 'text-slate-400 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}>Mensagens Rápidas</button>
          <button onClick={() => setActiveSubTab('reports')} className={`px-8 py-3 rounded-[1.4rem] font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === 'reports' ? 'bg-[#F67C01] text-white shadow-lg' : 'text-slate-400 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}>Relatórios</button>
      </div>

      {activeSubTab === 'pipeline' && (
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
      )}

      {activeSubTab === 'clients' && (
        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-8">
           <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight">Carteira de Clientes</h3>
              <button onClick={() => { setEditingClient(null); setClientFormData({ name: '', phone: '', email: '', company: '', notes: '', tags: [], birthDate: '' }); setIsClientModalOpen(true); }} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" /> NOVO CLIENTE
              </button>
           </div>

           <div className="space-y-4">
              {clients.length > 0 ? clients.map(client => (
                 <div key={client.id} className="p-6 bg-gray-50 dark:bg-zinc-800/40 rounded-[2rem] border border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:bg-white transition-all">
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center shadow-sm">
                          <User className="w-6 h-6" />
                       </div>
                       <div>
                          <h4 className="font-black text-gray-900 dark:text-white text-base tracking-tight">{client.name}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{client.company || 'Particular'} • {client.phone}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       {client.email && <span className="hidden md:inline-block text-[10px] font-bold text-slate-400 bg-white dark:bg-zinc-900 px-3 py-1 rounded-lg border border-gray-100 dark:border-zinc-800">{client.email}</span>}
                       <button onClick={() => { setEditingClient(client); setClientFormData(client); setIsClientModalOpen(true); }} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors">
                          Editar
                       </button>
                       <button onClick={() => handleDeleteClient(client.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
              )) : (
                 <div className="text-center py-20 opacity-40">
                    <User className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Sua carteira de clientes está vazia.</p>
                 </div>
              )}
           </div>
        </div>
      )}

      {activeSubTab === 'followup' && (
        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-8">
           <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight">Follow-up</h3>
              <button onClick={() => { setEditingTask(null); setTaskFormData({ title: '', description: '', dueDate: Date.now() + 86400000, status: 'pending', type: 'call' }); setIsTaskModalOpen(true); }} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" /> NOVO CONTATO
              </button>
           </div>
           <div className="space-y-4">
              {tasks.filter(t => ['call', 'meeting', 'email', 'whatsapp'].includes(t.type)).length > 0 ? tasks.filter(t => ['call', 'meeting', 'email', 'whatsapp'].includes(t.type)).map(task => (
                 <div key={task.id} className={`p-6 bg-gray-50 dark:bg-zinc-800/40 rounded-[2rem] border ${task.status === 'completed' ? 'border-emerald-500/30 opacity-60' : 'border-gray-100 dark:border-zinc-800'} flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:bg-white transition-all`}>
                    <div className="flex items-center gap-6">
                       <button onClick={() => handleToggleTaskStatus(task)} className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${task.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-indigo-500'}`}>
                          {task.status === 'completed' && <CheckCircle className="w-5 h-5" />}
                       </button>
                       <div>
                          <h4 className={`font-black text-base tracking-tight ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-gray-900 dark:text-white'}`}>{task.title}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                             {new Date(task.dueDate).toLocaleDateString('pt-BR')} • {task.type.toUpperCase()}
                             {task.relatedTo && ` • ${task.relatedTo.name}`}
                          </p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <button onClick={() => { setEditingTask(task); setTaskFormData(task); setIsTaskModalOpen(true); }} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors">
                          Editar
                       </button>
                       <button onClick={() => handleDeleteTask(task.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
              )) : (
                 <div className="text-center py-20 opacity-40">
                    <Clock className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Nenhum follow-up agendado.</p>
                 </div>
              )}
           </div>
        </div>
      )}

      {activeSubTab === 'reports' && (
        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-8">
           <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight">Relatórios Comerciais</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-50 dark:bg-zinc-800/40 p-8 rounded-[2rem] border border-gray-100 dark:border-zinc-800">
                 <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-4">
                    <Briefcase className="w-6 h-6 text-blue-500" />
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total de Leads</p>
                 <h4 className="text-3xl font-black text-gray-900 dark:text-white">{leads.length}</h4>
              </div>
              
              <div className="bg-gray-50 dark:bg-zinc-800/40 p-8 rounded-[2rem] border border-gray-100 dark:border-zinc-800">
                 <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mb-4">
                    <User className="w-6 h-6 text-emerald-500" />
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Clientes Convertidos</p>
                 <h4 className="text-3xl font-black text-gray-900 dark:text-white">{clients.length}</h4>
              </div>
              
              <div className="bg-gray-50 dark:bg-zinc-800/40 p-8 rounded-[2rem] border border-gray-100 dark:border-zinc-800">
                 <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center mb-4">
                    <DollarSign className="w-6 h-6 text-[#F67C01]" />
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Valor no Funil</p>
                 <h4 className="text-3xl font-black text-gray-900 dark:text-white">
                    R$ {leads.filter(l => l.stage !== 'lost' && l.stage !== 'closed').reduce((acc, l) => acc + (Number(l.value) || 0), 0).toFixed(2)}
                 </h4>
              </div>
              
              <div className="bg-gray-50 dark:bg-zinc-800/40 p-8 rounded-[2rem] border border-gray-100 dark:border-zinc-800">
                 <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6 text-purple-500" />
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tarefas Pendentes</p>
                 <h4 className="text-3xl font-black text-gray-900 dark:text-white">{tasks.filter(t => t.status === 'pending').length}</h4>
              </div>
           </div>
        </div>
      )}

      {activeSubTab === 'quick_messages' && (
        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-8">
           <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight">Mensagens Rápidas</h3>
              <div className="flex gap-3">
                 <a href="https://www.notion.so/16c055f18fde8002b658ea22e1bbf29a?v=16c055f18fde81eca778000ce9f09c73" target="_blank" rel="noopener noreferrer" className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2">
                   <ExternalLink className="w-4 h-4" /> SCRIPTS DE ALTA CONVERSÃO
                 </a>
                 <button onClick={() => { setEditingQuickMessage(null); setQuickMessageFormData({ title: '', content: '', category: 'primeiro_contato' }); setIsQuickMessageModalOpen(true); }} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2">
                   <Plus className="w-4 h-4" /> NOVA MENSAGEM
                 </button>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickMessages.length > 0 ? quickMessages.map(msg => (
                 <div key={msg.id} className="p-6 bg-gray-50 dark:bg-zinc-800/40 rounded-[2rem] border border-gray-100 dark:border-zinc-800 flex flex-col justify-between gap-4 group hover:bg-white transition-all">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-black text-gray-900 dark:text-white text-base tracking-tight">{msg.title}</h4>
                            <span className="text-[9px] font-black bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-lg uppercase">{msg.category.replace('_', ' ')}</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">{msg.content}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
                       <button onClick={() => {
                           const text = encodeURIComponent(msg.content);
                           window.open(`https://wa.me/?text=${text}`, '_blank');
                       }} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors flex items-center gap-2">
                          <MessageSquare className="w-3 h-3" /> Enviar
                       </button>
                       <div className="flex gap-2">
                           <button onClick={() => { setEditingQuickMessage(msg); setQuickMessageFormData(msg); setIsQuickMessageModalOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                              Editar
                           </button>
                           <button onClick={() => handleDeleteQuickMessage(msg.id)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                           </button>
                       </div>
                    </div>
                 </div>
              )) : (
                 <div className="col-span-1 md:col-span-2 text-center py-20 opacity-40">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Nenhuma mensagem rápida salva.</p>
                 </div>
              )}
           </div>
        </div>
      )}

      {isModalOpen && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-white/5 animate-scale-in flex flex-col max-h-[95vh]">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                    <div><h3 className="text-2xl font-black uppercase italic tracking-tighter">{editingLead ? 'Detalhes do Lead' : 'Capturar Lead'}</h3></div>
                    <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                <form onSubmit={handleSaveLead} className="p-10 space-y-8 overflow-y-auto scrollbar-hide flex-1">
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

      {isClientModalOpen && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-white/5 animate-scale-in flex flex-col max-h-[95vh]">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                    <div><h3 className="text-2xl font-black uppercase italic tracking-tighter">{editingClient ? 'Editar Cliente' : 'Novo Cliente'}</h3></div>
                    <button onClick={() => setIsClientModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                <form onSubmit={handleSaveClient} className="p-10 space-y-6 overflow-y-auto scrollbar-hide flex-1">
                    <div className="space-y-6">
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Nome completo</label>
                          <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={clientFormData.name} onChange={e => setClientFormData({...clientFormData, name: e.target.value})} />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">WhatsApp</label>
                             <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={clientFormData.phone} onChange={e => setClientFormData({...clientFormData, phone: e.target.value})} />
                          </div>
                          <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Empresa (Opcional)</label>
                             <input type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={clientFormData.company} onChange={e => setClientFormData({...clientFormData, company: e.target.value})} />
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Email (Opcional)</label>
                             <input type="email" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={clientFormData.email} onChange={e => setClientFormData({...clientFormData, email: e.target.value})} />
                          </div>
                          <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Data de Aniversário (Opcional)</label>
                             <input type="date" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={clientFormData.birthDate || ''} onChange={e => setClientFormData({...clientFormData, birthDate: e.target.value})} />
                          </div>
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Anotações</label>
                          <textarea className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white h-24 resize-none" value={clientFormData.notes} onChange={e => setClientFormData({...clientFormData, notes: e.target.value})}></textarea>
                       </div>
                    </div>
                    <button type="submit" disabled={isSaving} className="w-full bg-[#F67C01] text-white font-black py-5 rounded-[2rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-orange-600 transition-all">
                        {isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : 'Salvar Cliente'}
                    </button>
                </form>
            </div>
         </div>
      )}

      {isTaskModalOpen && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-white/5 animate-scale-in flex flex-col max-h-[95vh]">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                    <div><h3 className="text-2xl font-black uppercase italic tracking-tighter">{editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}</h3></div>
                    <button onClick={() => setIsTaskModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                <form onSubmit={handleSaveTask} className="p-10 space-y-6 overflow-y-auto scrollbar-hide flex-1">
                    <div className="space-y-6">
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Título da Tarefa</label>
                          <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={taskFormData.title} onChange={e => setTaskFormData({...taskFormData, title: e.target.value})} />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Data de Vencimento</label>
                             <input required type="date" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={new Date(taskFormData.dueDate || Date.now()).toISOString().split('T')[0]} onChange={e => setTaskFormData({...taskFormData, dueDate: new Date(e.target.value).getTime()})} />
                          </div>
                          <div>
                             <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Tipo</label>
                             <select className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={taskFormData.type} onChange={e => setTaskFormData({...taskFormData, type: e.target.value as any})}>
                                <option value="call">Ligação</option>
                                <option value="whatsapp">WhatsApp</option>
                                <option value="email">E-mail</option>
                                <option value="meeting">Reunião</option>
                                <option value="other">Outro</option>
                             </select>
                          </div>
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Relacionado a (Opcional)</label>
                          <select 
                            className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" 
                            value={taskFormData.relatedTo ? `${taskFormData.relatedTo.type}:${taskFormData.relatedTo.id}` : ''} 
                            onChange={e => {
                               const val = e.target.value;
                               if (!val) { setTaskFormData({...taskFormData, relatedTo: undefined}); return; }
                               const [type, id] = val.split(':');
                               const name = type === 'lead' ? leads.find(l => l.id === id)?.name : clients.find(c => c.id === id)?.name;
                               if (name) setTaskFormData({...taskFormData, relatedTo: { type: type as any, id, name }});
                            }}
                          >
                             <option value="">Nenhum</option>
                             <optgroup label="Leads">
                                {leads.map(l => <option key={`lead-${l.id}`} value={`lead:${l.id}`}>{l.name}</option>)}
                             </optgroup>
                             <optgroup label="Clientes">
                                {clients.map(c => <option key={`client-${c.id}`} value={`client:${c.id}`}>{c.name}</option>)}
                             </optgroup>
                          </select>
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Descrição</label>
                          <textarea className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white h-24 resize-none" value={taskFormData.description} onChange={e => setTaskFormData({...taskFormData, description: e.target.value})}></textarea>
                       </div>
                    </div>
                    <button type="submit" disabled={isSaving} className="w-full bg-emerald-600 text-white font-black py-5 rounded-[2rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-emerald-700 transition-all">
                        {isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : 'Salvar Tarefa'}
                    </button>
                </form>
            </div>
         </div>
      )}

      {isQuickMessageModalOpen && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-white/5 animate-scale-in flex flex-col max-h-[95vh]">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                    <div><h3 className="text-2xl font-black uppercase italic tracking-tighter">{editingQuickMessage ? 'Editar Mensagem' : 'Nova Mensagem'}</h3></div>
                    <button onClick={() => setIsQuickMessageModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                <form onSubmit={handleSaveQuickMessage} className="p-10 space-y-6 overflow-y-auto scrollbar-hide flex-1">
                    <div className="space-y-6">
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Título (Para você identificar)</label>
                          <input required type="text" className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={quickMessageFormData.title} onChange={e => setQuickMessageFormData({...quickMessageFormData, title: e.target.value})} placeholder="Ex: Follow-up de Apresentação" />
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Categoria</label>
                          <select className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={quickMessageFormData.category} onChange={e => setQuickMessageFormData({...quickMessageFormData, category: e.target.value as any})}>
                             <option value="primeiro_contato">Primeiro Contato</option>
                             <option value="apos_proposta">Após Proposta</option>
                             <option value="lembrete_decisao">Lembrete de Decisão</option>
                             <option value="pos_venda">Pós-venda</option>
                             <option value="reativacao">Reativação</option>
                             <option value="outros">Outros</option>
                          </select>
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Mensagem</label>
                          <textarea required className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white h-40 resize-none" value={quickMessageFormData.content} onChange={e => setQuickMessageFormData({...quickMessageFormData, content: e.target.value})} placeholder="Digite a mensagem aqui..."></textarea>
                          <p className="text-[9px] text-slate-400 mt-2 italic px-2">Dica: Você pode usar [Nome do Cliente] ou [Meu Negócio] para se organizar.</p>
                       </div>
                    </div>
                    <button type="submit" disabled={isSaving} className="w-full bg-indigo-600 text-white font-black py-5 rounded-[2rem] shadow-2xl uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all">
                        {isSaving ? <RefreshCw className="animate-spin w-5 h-5 mx-auto" /> : 'Salvar Mensagem'}
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
  const [entityFilter, setEntityFilter] = useState<'personal' | 'business'>('personal');
  const [formData, setFormData] = useState<Partial<FinancialEntry>>({ 
    description: '', 
    value: 0, 
    type: 'income', 
    date: new Date().toISOString().split('T')[0], 
    category: 'Geral',
    entityType: 'personal'
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
      setFormData({ description: '', value: 0, type: 'income', date: new Date().toISOString().split('T')[0], category: 'Geral', entityType: 'personal' });
    } finally { setIsSaving(false); }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!window.confirm('Excluir este lançamento?')) return;
    await mockBackend.deleteFinanceEntry(id);
    await loadEntries();
  };

  const filteredEntries = entries.filter(e => e.entityType === entityFilter);
  const totalIncome = filteredEntries.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.value, 0);
  const totalExpense = filteredEntries.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.value, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Filtro de Entidade */}
      <div className="flex p-1.5 bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-zinc-800 w-fit gap-1">
          <button onClick={() => setEntityFilter('personal')} className={`px-8 py-3 rounded-[1.4rem] font-black text-[10px] uppercase tracking-widest transition-all ${entityFilter === 'personal' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}>Pessoa Física</button>
          <button onClick={() => setEntityFilter('business')} className={`px-8 py-3 rounded-[1.4rem] font-black text-[10px] uppercase tracking-widest transition-all ${entityFilter === 'business' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}>Empresa</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
           <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Entradas ({entityFilter === 'personal' ? 'PF' : 'PJ'})</p>
           <div className="flex items-center justify-between">
              <h4 className="text-3xl font-black text-emerald-600 tracking-tighter">R$ {totalIncome.toFixed(2)}</h4>
              <ArrowUpCircle className="w-8 h-8 text-emerald-500" />
           </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
           <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Saídas ({entityFilter === 'personal' ? 'PF' : 'PJ'})</p>
           <div className="flex items-center justify-between">
              <h4 className="text-3xl font-black text-rose-600 tracking-tighter">R$ {totalExpense.toFixed(2)}</h4>
              <ArrowDownCircle className="w-8 h-8 text-rose-500" />
           </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm">
           <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Saldo Atual ({entityFilter === 'personal' ? 'PF' : 'PJ'})</p>
           <div className="flex items-center justify-between">
              <h4 className={`text-3xl font-black tracking-tighter ${balance >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>R$ {balance.toFixed(2)}</h4>
              <Wallet className="w-8 h-8 text-indigo-500" />
           </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-8">
        <div className="flex justify-between items-center">
           <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight">Fluxo de Caixa ({entityFilter === 'personal' ? 'Pessoa Física' : 'Empresa'})</h3>
           <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2">
             <Plus className="w-4 h-4" /> NOVO LANÇAMENTO
           </button>
        </div>

        <div className="space-y-4">
           {filteredEntries.length > 0 ? filteredEntries.map(entry => (
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
                 <p className="text-[10px] font-black uppercase tracking-[0.2em]">Sem lançamentos este mês para {entityFilter === 'personal' ? 'Pessoa Física' : 'Empresa'}.</p>
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
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Entidade</label>
                          <select className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl p-5 font-bold dark:text-white" value={formData.entityType} onChange={e => setFormData({...formData, entityType: e.target.value as any})}>
                             <option value="personal">Pessoa Física</option>
                             <option value="business">Empresa</option>
                          </select>
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
             <div className="bg-white dark:bg-zinc-900 rounded-[3.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-white/5 animate-scale-in flex flex-col max-h-[95vh]">
                <div className="bg-[#0F172A] p-8 text-white flex justify-between items-center">
                    <div><h3 className="text-2xl font-black uppercase italic tracking-tighter">Agendamento</h3></div>
                    <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8" /></button>
                </div>
                <form onSubmit={handleSaveItem} className="p-10 space-y-6 overflow-y-auto scrollbar-hide flex-1">
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

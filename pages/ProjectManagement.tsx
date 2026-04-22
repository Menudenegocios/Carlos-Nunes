
import React, { useState } from 'react';
import { 
  LayoutGrid, Target, ListTodo, Calendar as CalendarIcon, Home as HomeIcon,
  BarChart3, Plus, ChevronRight, 
  CheckCircle2, Clock, AlertCircle,
  TrendingUp, Users, Zap, Search,
  ArrowRight, Save, Trash2, Edit3,
  Lightbulb, Shield, HelpCircle,
  Briefcase, PieChart, Layers, RefreshCw,
  Handshake, Globe, Coins, Columns, UserPlus, Smartphone, X, Sparkles, TrendingDown,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../contexts/AuthContext';

type TabType = 'inicio' | 'projects' | 'tasks' | 'canva' | 'swot' | 'smart';

export const ProjectManagement: React.FC = () => {
  const { user } = useAuth();
  const user_id = user?.id; 
  const [activeTab, setActiveTab] = useState<TabType>('inicio');
  const [profile, setProfile] = useState<any>(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectStatus, setNewProjectStatus] = useState('A Fazer');
  const [newProjectPriority, setNewProjectPriority] = useState('Média');
  const [newProjectCategory, setNewProjectCategory] = useState('Outros');
  const [newProjectTool, setNewProjectTool] = useState('Outros');
  const [editingProject, setEditingProject] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    if (!user_id) return;
    loadInitialData();
  }, [user_id]);

  const loadInitialData = async () => {
    if (!user_id) return;
    setIsLoading(true);
    try {
      const [projs, tsks, prof] = await Promise.all([
        supabaseService.getProjects(user_id),
        supabaseService.getTasks(user_id),
        supabaseService.getProfileByUserId(user_id)
      ]);
      setProjects(projs);
      setTasks(tsks);
      setProfile(prof);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };


  React.useEffect(() => {
    if (!user_id) return;
    supabaseService.getProjects(user_id).then(setProjects).catch(console.error);
  }, [user_id]);

  const handleSaveProject = async () => {
    if (!newProjectName) return;
    try {
      const pData = {
        name: newProjectName,
        description: newProjectDesc,
        status: newProjectStatus,
        priority: newProjectPriority,
        category: newProjectCategory,
        support_tool: newProjectTool
      };

      if (editingProject) {
        await supabaseService.updateProject(editingProject.id, pData);
        setProjects(projects.map(p => p.id === editingProject.id ? { ...p, ...pData } : p));
      } else {
        const newProject = await supabaseService.addProject({ 
          user_id: user_id, 
          ...pData
        });
        setProjects([newProject, ...projects]);
      }
      
      resetForm();
      setIsNewProjectModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setNewProjectName('');
    setNewProjectDesc('');
    setNewProjectStatus('A Fazer');
    setNewProjectPriority('Média');
    setNewProjectCategory('Outros');
    setNewProjectTool('Outros');
    setEditingProject(null);
  };

  const openNewProjectModal = () => {
    resetForm();
    setIsNewProjectModalOpen(true);
  };

  const openEditProjectModal = (project: any) => {
    setEditingProject(project);
    setNewProjectName(project.name);
    setNewProjectDesc(project.description || '');
    setNewProjectStatus(project.status || 'A Fazer');
    setNewProjectPriority(project.priority || 'Média');
    setNewProjectCategory(project.category || 'Outros');
    setNewProjectTool(project.support_tool || 'Outros');
    setIsNewProjectModalOpen(true);
  };

  const deleteProject = async (id: string) => {
    try {
      await supabaseService.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const tabs = [
    { id: 'inicio', label: 'Início', icon: HomeIcon },
    { id: 'projects', label: 'Projetos', icon: Briefcase },
    { id: 'tasks', label: 'Tarefas', icon: LayoutGrid },
    { id: 'canva', label: 'Business Canva', icon: PieChart },
  ];


  if (!user_id) return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw className="w-8 h-8 text-brand-primary animate-spin" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 italic uppercase tracking-tight">
            Gestão de <span className="text-brand-primary">Projetos</span>
          </h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">
            Estratégia e Execução em um só lugar
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={openNewProjectModal}
            className="px-6 py-3 bg-brand-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Novo Projeto
          </button>
        </div>
      </div>

      {/* New Project Modal */}
      <AnimatePresence>
        {isNewProjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl border border-gray-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-900 uppercase italic">{editingProject ? 'Editar Projeto' : 'Novo Projeto'}</h3>
                <button onClick={() => setIsNewProjectModalOpen(false)} className="text-slate-400 hover:text-gray-900">
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome do Projeto</label>
                  <input type="text" value={newProjectName} onChange={e => setNewProjectName(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-brand-primary transition-all" placeholder="Ex: Lançamento Produto X" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria</label>
                    <select value={newProjectCategory} onChange={e => setNewProjectCategory(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm font-medium">
                        <option value="Marketing">Marketing</option>
                        <option value="Vendas">Vendas</option>
                        <option value="Networking">Networking</option>
                        <option value="Planejamento">Planejamento</option>
                        <option value="IA">IA</option>
                        <option value="Finanças">Finanças</option>
                        <option value="Desenvolvimento">Desenvolvimento</option>
                        <option value="Outros">Outros</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ferramenta de Apoio</label>
                    <select value={newProjectTool} onChange={e => setNewProjectTool(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm font-medium">
                        <option value="Meta SMART">Meta SMART</option>
                        <option value="SWOT">SWOT</option>
                        <option value="Canva">Canva</option>
                        <option value="Outros">Outros</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição</label>
                  <textarea value={newProjectDesc} onChange={e => setNewProjectDesc(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-brand-primary transition-all" placeholder="Breve resumo..." rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <select value={newProjectStatus} onChange={e => setNewProjectStatus(e.target.value)} className="bg-gray-50 border-none rounded-xl p-4 text-sm font-medium">
                        <option>A Fazer</option>
                        <option>Em Progresso</option>
                        <option>Concluído</option>
                    </select>
                    <select value={newProjectPriority} onChange={e => setNewProjectPriority(e.target.value)} className="bg-gray-50 border-none rounded-xl p-4 text-sm font-medium">
                        <option>Baixa</option>
                        <option>Média</option>
                        <option>Alta</option>
                    </select>
                </div>
                <button 
                  onClick={handleSaveProject}
                  className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-primary/20"
                >
                  {editingProject ? 'Salvar Alterações' : 'Criar Projeto'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20'
                : 'bg-white text-slate-400 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 text-brand-primary animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'inicio' && <DashboardView user_id={user_id} projects={projects} tasks={tasks} />}
              {activeTab === 'projects' && <ProjectsView projects={projects} tasks={tasks} deleteProject={deleteProject} onEdit={openEditProjectModal} />}
              {activeTab === 'tasks' && <KanbanView user_id={user_id} projects={projects} initialTasks={tasks} profile={profile} onTasksUpdate={loadInitialData} />}
              {activeTab === 'canva' && <BusinessCanvaView user_id={user_id} />}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

// --- DASHBOARD VIEW ---

const DashboardView = ({ user_id, projects, tasks }: { user_id: string, projects: any[], tasks: any[] }) => {
  const today = new Date();
  const tasksToday = tasks.filter(t => {
    if (!t.due_date) return false;
    const d = new Date(t.due_date);
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  });

  const nextTasks = tasks.filter(t => {
    if (!t.due_date) return false;
    const d = new Date(t.due_date);
    return d > today && t.status !== 'Concluído';
  }).sort((a,b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()).slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
      {/* Left Column: Calendar & Stats */}
      <div className="lg:col-span-4 space-y-8">
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
           <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 italic">Mini Calendário</h3>
              <CalendarIcon className="w-4 h-4 text-brand-primary" />
           </div>
           <MiniCalendar tasks={tasks} />
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-200">
           <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Visão Geral</p>
           <h4 className="text-3xl font-black italic uppercase tracking-tighter leading-tight mb-6">Foco na <br/>Execução</h4>
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-2xl">
                 <p className="text-[9px] font-black uppercase opacity-60">Projetos</p>
                 <p className="text-2xl font-black">{projects.length}</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl">
                 <p className="text-[9px] font-black uppercase opacity-60">Em Aberto</p>
                 <p className="text-2xl font-black">{tasks.filter(t => t.status !== 'Concluído').length}</p>
              </div>
           </div>
        </div>
      </div>

      {/* Right Column: Tasks Today & Next */}
      <div className="lg:col-span-8 space-y-8">
         <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
               <div>
                  <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">Tarefas do Dia</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">O que você precisa entregar hoje</p>
               </div>
               <span className="bg-orange-50 text-brand-primary font-black px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest">
                  {tasksToday.length} TAREFAS
               </span>
            </div>

            <div className="space-y-4">
               {tasksToday.length > 0 ? tasksToday.map(task => (
                 <div key={task.id} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-transparent hover:border-brand-primary/10 transition-all">
                    <div className="flex gap-4 items-center">
                       <CheckCircle2 className={`w-5 h-5 ${task.status === 'Concluído' ? 'text-emerald-500' : 'text-slate-200'}`} />
                       <div>
                          <p className="font-bold text-gray-900 leading-none">{task.title}</p>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2">
                             {projects.find(p => p.id === task.project_id)?.name || 'Sem Projeto'}
                          </p>
                       </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                       task.priority === 'Alta' ? 'bg-rose-50 text-rose-500' :
                       task.priority === 'Baixa' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-brand-primary'
                    }`}>
                       {task.priority || 'Média'}
                    </span>
                 </div>
               )) : (
                 <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <CheckCircle2 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Tudo pronto por aqui!</p>
                 </div>
               )}
            </div>
         </div>

         <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
               <h4 className="text-xs font-black text-gray-900 uppercase italic tracking-tight mb-6 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-primary" /> Próximos Prazos
               </h4>
               <div className="space-y-4">
                  {nextTasks.map(task => (
                    <div key={task.id} className="flex items-center justify-between group">
                       <div>
                          <p className="text-[11px] font-black text-gray-700 leading-tight group-hover:text-brand-primary transition-colors">{task.title}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">
                             {new Date(task.due_date).toLocaleDateString('pt-BR')}
                          </p>
                       </div>
                       <ArrowRight className="w-3 h-3 text-slate-200 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
               <div className="relative z-10">
                  <h4 className="text-xs font-black uppercase italic tracking-tight mb-4">Google Calendar</h4>
                  <p className="text-xs text-slate-400 font-medium mb-6">Sincronize suas tarefas com o Google para receber alertas em tempo real.</p>
                  <button className="w-full py-3.5 bg-white text-gray-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                     <Smartphone className="w-4 h-4" /> CONECTAR GOOGLE
                  </button>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            </div>
         </div>
      </div>
    </div>
  );
};

const MiniCalendar = ({ tasks = [] }: { tasks?: any[] }) => {
  const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const hasTaskOnDay = (day: number) => {
    if (!day) return false;
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.some(t => t.due_date?.startsWith(dateStr));
  };

  return (
    <div className="w-full">
       <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-6 text-center italic">
          {new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(today)}
       </p>
       <div className="grid grid-cols-7 gap-1 text-center">
          {days.map((d, idx) => (
            <div key={`${d}-${idx}`} className="text-[9px] font-black text-slate-300 py-2">{d}</div>
          ))}
          {calendarDays.map((d, i) => {
            const hasTask = d ? hasTaskOnDay(d) : false;
            return (
              <div 
                key={i} 
                className={`p-2 rounded-lg text-[10px] font-black transition-all relative ${
                  d === today.getDate() ? 'bg-brand-primary text-white shadow-lg scale-110' : 
                  d ? 'text-gray-600 hover:bg-gray-50 cursor-pointer' : ''
                }`}
              >
                {d}
                {hasTask && d !== today.getDate() && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-primary rounded-full"></div>
                )}
              </div>
            );
          })}
       </div>
    </div>
  );
};



// --- SUB-VIEWS ---



const ProjectsView = ({ projects, tasks, deleteProject, onEdit }: { projects: any[], tasks: any[], deleteProject: (id: string) => void, onEdit: (project: any) => void }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.length > 0 ? projects.map(p => (
          <div key={p.id} className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-brand-primary transition-all">
            <div className="space-y-4">
               <div className="flex justify-between items-start">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    p.category === 'Marketing' ? 'bg-orange-50 text-orange-600' :
                    p.category === 'Vendas' ? 'bg-emerald-50 text-emerald-600' :
                    p.category === 'Financeiro' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-500'
                  }`}>
                    {p.category || 'Geral'}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => onEdit(p)} className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => deleteProject(p.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
               </div>
               
               <div>
                  <h4 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">{p.name}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-2 font-medium leading-relaxed">{p.description}</p>
               </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    p.status === 'Concluído' ? 'bg-emerald-500' :
                    p.status === 'Em Progresso' ? 'bg-blue-500' : 'bg-slate-300'
                  }`} />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.status}</span>
               </div>
               <div className="flex items-center gap-4">
                 <div className="flex items-center gap-1.5">
                   <ListTodo className="w-3 h-3 text-slate-300" />
                   <span className="text-[9px] font-black text-slate-400">
                     {tasks.filter(t => t.project_id === p.id).length}
                   </span>
                 </div>
                 <span className="text-[10px] font-black text-slate-300 uppercase italic tracking-tighter">
                    {p.support_tool !== 'Outros' ? p.support_tool : ''}
                 </span>
               </div>
            </div>

            {/* Quick Task List for this project */}
            {tasks.filter(t => t.project_id === p.id).length > 0 && (
              <div className="mt-6 space-y-2">
                {tasks.filter(t => t.project_id === p.id).slice(0, 3).map(task => (
                  <div key={task.id} className="flex items-center gap-2 px-3 py-2 bg-gray-50/50 rounded-xl border border-gray-100/50">
                    <div className={`w-1 h-3 rounded-full ${task.status === 'Concluído' ? 'bg-emerald-400' : 'bg-brand-primary/40'}`} />
                    <span className="text-[9px] font-bold text-slate-600 truncate">{task.title}</span>
                  </div>
                ))}
                {tasks.filter(t => t.project_id === p.id).length > 3 && (
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest pl-1">
                    + {tasks.filter(t => t.project_id === p.id).length - 3} outras tarefas
                  </p>
                )}
              </div>
            )}
          </div>
        )) : (
          <div className="col-span-full text-center py-24 opacity-30">
            <Briefcase className="w-16 h-16 mx-auto mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Nenhum projeto iniciado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const KanbanView = ({ user_id, projects, initialTasks, profile, onTasksUpdate }: { user_id: string, projects: any[], initialTasks: any[], profile: any, onTasksUpdate: () => Promise<void> }) => {
  const [tasks, setTasks] = useState<any[]>(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [filters, setFilters] = useState({ search: '', responsible: '', priority: '', project_id: '', today: false });
  const [formData, setFormData] = useState<any>({ 
    title: '', description: '', status: 'A Fazer', project_id: '', 
    assignee_name: '', priority: 'Média', due_date: '', checklist: [], external_link: '' 
  });

  // Load custom stages from profile if they exist
  const defaultStages = ['A Fazer', 'Em Progresso', 'Concluído'];
  const [columns, setColumns] = useState<string[]>(profile?.store_config?.project_stages || defaultStages);

  React.useEffect(() => {
    if (profile?.store_config?.project_stages) {
       setColumns(profile.store_config.project_stages);
    }
  }, [profile]);

  React.useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const handleSave = async () => {
    if (!formData.title) return;
    try {
      const dataToSave = { 
        ...formData, 
        project_id: formData.project_id === '' ? null : formData.project_id 
      };

      if (editingTask) {
        await supabaseService.updateTask(editingTask.id, dataToSave);
      } else {
        await supabaseService.addTask({ user_id, ...dataToSave, type: 'other' });
      }
      await onTasksUpdate();
      setIsModalOpen(false);
      setEditingTask(null);
    } catch(e) { console.error(e) }
  };

  const openNew = (status?: string) => {
    setEditingTask(null);
    setFormData({ 
      title: '', description: '', status: status || columns[0], project_id: '', 
      assignee_name: '', priority: 'Média', due_date: '', checklist: [], external_link: '' 
    });
    setIsModalOpen(true);
  };

  const openEdit = (task: any) => {
     setEditingTask(task);
     setFormData({ 
        title: task.title, 
        description: task.description || '', 
        status: task.status, 
        project_id: task.project_id || '',
        assignee_name: task.assignee_name || '',
        priority: task.priority || 'Média',
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        checklist: task.checklist || [],
        external_link: task.external_link || ''
     });
     setIsModalOpen(true);
  };

  const updateStatus = async (id: string, status: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));
    await supabaseService.updateTask(id, { status });
  };

  const addStage = async () => {
    const stageName = prompt('Nome da nova etapa:');
    if (stageName && !columns.includes(stageName)) {
      const newCols = [...columns, stageName];
      setColumns(newCols);
      await supabaseService.updateProfile(user_id, { store_config: { ...profile.store_config, project_stages: newCols } });
    }
  };

  const removeStage = async (col: string) => {
     if (confirm(`Excluir etapa "${col}"?`)) {
        const newCols = columns.filter(c => c !== col);
        setColumns(newCols);
        await supabaseService.updateProfile(user_id, { store_config: { ...profile.store_config, project_stages: newCols } });
     }
  };

  const getFilteredTasks = () => {
    let filtered = tasks;
    if (filters.search) filtered = filtered.filter(t => t.title.toLowerCase().includes(filters.search.toLowerCase()));
    if (filters.responsible) filtered = filtered.filter(t => t.assignee_name?.toLowerCase().includes(filters.responsible.toLowerCase()));
    if (filters.priority) filtered = filtered.filter(t => t.priority === filters.priority);
    if (filters.project_id) filtered = filtered.filter(t => t.project_id === filters.project_id);
    if (filters.today) {
       const todayStr = new Date().toISOString().split('T')[0];
       filtered = filtered.filter(t => t.due_date?.split('T')[0] === todayStr);
    }
    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  const getDeadlineColor = (dateStr: string, status: string) => {
    if (!dateStr || status === 'Concluído') return 'bg-slate-50 border-transparent';
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const deadlineStr = dateStr.split('T')[0];
    
    if (deadlineStr < todayStr) return 'bg-rose-50 border-rose-200 shadow-rose-100'; // Atrasado
    if (deadlineStr === todayStr) return 'bg-orange-50 border-orange-200 shadow-orange-100'; // Hoje
    
    const diff = new Date(deadlineStr).getTime() - new Date(todayStr).getTime();
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    
    if (diffDays <= 2) return 'bg-amber-50 border-amber-200 shadow-amber-100'; // Próximo
    return 'bg-gray-50 border-transparent';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
       {/* Filters */}
       <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
             <div className="flex-1 relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="text" 
                  placeholder="Buscar tarefa..." 
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 text-xs font-bold"
                  value={filters.search}
                  onChange={e => setFilters({...filters, search: e.target.value})}
                />
             </div>
             <div className="grid grid-cols-2 md:flex gap-3">
                <select 
                  className="bg-gray-50 border-none rounded-2xl py-4 px-6 text-[10px] font-black uppercase tracking-widest outline-none"
                  value={filters.priority}
                  onChange={e => setFilters({...filters, priority: e.target.value})}
                >
                   <option value="">Prioridade</option>
                   <option>Baixa</option>
                   <option>Média</option>
                   <option>Alta</option>
                   <option>Crítica</option>
                </select>
                <select 
                   className="bg-gray-50 border-none rounded-2xl py-4 px-6 text-[10px] font-black uppercase tracking-widest outline-none"
                   value={filters.project_id}
                   onChange={e => setFilters({...filters, project_id: e.target.value})}
                >
                   <option value="">Todos Projetos</option>
                   {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <button 
                   onClick={() => setFilters({...filters, today: !filters.today})}
                   className={`px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filters.today ? 'bg-orange-500 text-white' : 'bg-gray-50 text-slate-400'}`}
                >
                   Hoje
                </button>
                <button onClick={() => setFilters({ search: '', responsible: '', priority: '', project_id: '', today: false })} className="p-4 bg-gray-50 text-slate-300 hover:text-rose-500 rounded-2xl transition-colors">
                   <Trash2 className="w-4 h-4" />
                </button>
             </div>
          </div>
       </div>

       <div className="flex justify-between items-center px-4">
         <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tight underline decoration-brand-primary decoration-4 underline-offset-8">Quadro Kanban</h3>
         <div className="flex gap-3">
            <button onClick={addStage} className="px-5 py-3 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex gap-2 items-center hover:bg-indigo-100 transition-all">
               <Plus className="w-4 h-4" /> Nova Etapa
            </button>
            <button onClick={() => openNew()} className="px-6 py-3 bg-brand-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all flex gap-2 items-center">
               <Plus className="w-4 h-4" /> Nova Tarefa
            </button>
         </div>
       </div>

       <div className="flex gap-6 overflow-x-auto pb-10 snap-x px-4 no-scrollbar" style={{ minHeight: '600px' }}>
         {columns.map(col => (
           <div 
             key={col} 
             onDragOver={e => e.preventDefault()} 
             onDrop={async e => {
                const taskId = e.dataTransfer.getData('taskId');
                if (taskId) updateStatus(taskId, col);
             }} 
             className="flex-1 min-w-[320px] max-w-[400px] bg-white/40 backdrop-blur-sm rounded-[2.5rem] p-6 border border-gray-100 flex flex-col gap-5 snap-center shrink-0"
           >
             <div className="flex items-center justify-between group">
               <div className="flex items-center gap-3">
                  <div className={`w-2 h-6 rounded-full ${col === 'Concluído' ? 'bg-emerald-500' : col === 'Em Progresso' ? 'bg-indigo-500' : 'bg-slate-300'}`} />
                  <h4 className="font-black text-xs uppercase tracking-[0.2em] text-gray-900">{col}</h4>
               </div>
               <div className="flex items-center gap-2">
                  <span className="bg-white text-slate-400 font-black px-3 py-1 rounded-xl text-[10px] shadow-sm border border-gray-50">
                    {filteredTasks.filter(t => t.status === col).length}
                  </span>
                  {!defaultStages.includes(col) && (
                     <button onClick={() => removeStage(col)} className="p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><X className="w-3 h-3" /></button>
                  )}
               </div>
             </div>
             
             <div className="flex-1 space-y-5">
               {filteredTasks.filter(t => t.status === col).map(task => (
                  <div 
                    key={task.id} 
                    draggable 
                    onDragStart={e => e.dataTransfer.setData('taskId', task.id)}
                    onClick={() => openEdit(task)}
                    className={`p-6 rounded-3xl border transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer relative overflow-hidden group/card ${getDeadlineColor(task.due_date, task.status)}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                       <h5 className="font-extrabold text-gray-900 leading-snug group-hover/card:text-brand-primary transition-colors pr-2">{task.title}</h5>
                       <span className={`px-2.5 py-1 rounded-lg text-[7px] font-black uppercase tracking-widest shrink-0 ${
                          task.priority === 'Crítica' ? 'bg-red-500 text-white' :
                          task.priority === 'Alta' ? 'bg-rose-50 text-rose-500' :
                          task.priority === 'Média' ? 'bg-orange-50 text-brand-primary' : 'bg-gray-100 text-slate-400'
                       }`}>
                          {task.priority || 'Média'}
                       </span>
                    </div>

                    <div className="space-y-3">
                       {task.description && <p className="text-[10px] text-slate-500 line-clamp-2 font-medium leading-relaxed italic opacity-80">"{task.description}"</p>}
                       
                       <div className="flex flex-wrap gap-2">
                          {task.project_id && (
                             <span className="inline-block bg-brand-primary/10 text-brand-primary text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">
                                {projects.find(p => p.id === task.project_id)?.name || 'Projeto'}
                             </span>
                          )}
                          {task.due_date && (
                             <span className="inline-flex items-center gap-1.5 bg-gray-900/5 text-[8px] font-black px-2.5 py-1 rounded-lg text-slate-500">
                                <Clock className="w-2.5 h-2.5" /> {new Date(task.due_date).toLocaleDateString('pt-BR')}
                             </span>
                          )}
                       </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[8px] font-black text-white italic shadow-md">
                             {task.assignee_name ? task.assignee_name.split(' ').map((n:any) => n[0]).join('').slice(0, 2).toUpperCase() : '??'}
                          </div>
                          {task.assignee_name && <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{task.assignee_name}</span>}
                       </div>
                       
                       {task.checklist?.length > 0 && (
                          <div className="flex items-center gap-1.5">
                             <ListTodo className="w-3 h-3 text-brand-primary" />
                             <span className="text-[8px] font-black text-brand-primary">
                                {task.checklist.filter((i:any) => i.done).length}/{task.checklist.length}
                             </span>
                          </div>
                       )}
                    </div>
                  </div>
               ))}
             </div>

             <button onClick={() => openNew(col)} className="w-full py-4 text-slate-400 hover:text-brand-primary font-black text-[10px] uppercase tracking-widest border-2 border-dashed border-gray-100 rounded-2xl hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all mt-4">
                + Novo Cartão
             </button>
           </div>
         ))}
       </div>

        {/* Task Detail/Edit Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden border border-white/5 flex flex-col md:flex-row"
               >
                  {/* Left Column: Form */}
                  <div className="flex-1 p-10 overflow-y-auto custom-scrollbar border-r border-gray-50">
                     <div className="flex justify-between items-center mb-8">
                        <span className="px-5 py-1.5 bg-brand-primary/5 text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-full">Detalhes da Tarefa</span>
                        <div className="flex gap-2">
                           <button onClick={handleSave} className="bg-brand-primary text-white p-3 rounded-2xl shadow-xl hover:scale-110 active:scale-90 transition-all"><Save className="w-5 h-5" /></button>
                           <button onClick={() => setIsModalOpen(false)} className="bg-gray-50 text-slate-400 p-3 rounded-2xl hover:bg-gray-100 transition-all"><X className="w-5 h-5" /></button>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block px-1">Título da Tarefa</label>
                           <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full text-2xl font-black text-gray-900 border-none bg-gray-50 p-6 rounded-3xl focus:ring-4 focus:ring-brand-primary/5 transition-all" placeholder="Nome da tarefa..." />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                           <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block px-1">Responsável</label>
                              <div className="relative">
                                 <Users className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                 <input type="text" value={formData.assignee_name} onChange={e => setFormData({...formData, assignee_name: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 font-bold text-xs" placeholder="Nome do executor" />
                              </div>
                           </div>
                           <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block px-1">Prioridade</label>
                              <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-black text-[10px] uppercase tracking-widest">
                                 <option>Baixa</option>
                                 <option>Média</option>
                                 <option>Alta</option>
                                 <option>Crítica</option>
                              </select>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                           <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block px-1">Prazo Limite</label>
                              <div className="relative">
                                 <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                 <input type="date" value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 font-bold text-xs" />
                              </div>
                           </div>
                           <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block px-1">Projeto Relacionado</label>
                              <select value={formData.project_id} onChange={e => setFormData({...formData, project_id: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-[10px] uppercase tracking-widest">
                                 <option value="">Nenhum Projeto</option>
                                 {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                              </select>
                           </div>
                        </div>

                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block px-1">Detalhes e Notas</label>
                           <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 border-none rounded-3xl p-6 text-sm font-medium resize-none min-h-[120px]" placeholder="Instruções e observações..." />
                        </div>

                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block px-1">Link Externo (Drive / Documentos)</label>
                           <div className="relative">
                              <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                              <input type="url" value={formData.external_link} onChange={e => setFormData({...formData, external_link: e.target.value})} className="w-full bg-indigo-50/30 border-none rounded-2xl py-4 pl-12 font-bold text-xs text-indigo-600 placeholder:text-indigo-200" placeholder="https://drive.google.com/..." />
                           </div>
                           {formData.external_link && (
                              <a href={formData.external_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] hover:underline px-1">
                                 Acessar Documento <ArrowUpRight className="w-3 h-3" />
                              </a>
                           )}
                        </div>

                        {/* Integrated Checklist */}
                        <div className="pt-6 border-t border-gray-100">
                           <div className="flex justify-between items-center mb-6">
                              <h4 className="text-[10px] font-black uppercase italic tracking-widest text-gray-900 flex gap-2 items-center"><ListTodo className="w-4 h-4 text-brand-primary" /> Checklist da Tarefa</h4>
                              <button onClick={() => {
                                 const item = prompt('Nome do item:');
                                 if (item) setFormData({...formData, checklist: [...(formData.checklist || []), { text: item, done: false }]});
                              }} className="text-[10px] font-black text-brand-primary uppercase tracking-widest underline decoration-2 underline-offset-4">Adicionar Item</button>
                           </div>
                           <div className="space-y-3">
                              {formData.checklist?.map((item:any, idx:number) => (
                                 <div key={idx} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-transparent hover:border-brand-primary/10 transition-all">
                                    <input 
                                       type="checkbox" 
                                       checked={item.done} 
                                       onChange={() => {
                                          const newList = [...formData.checklist];
                                          newList[idx].done = !newList[idx].done;
                                          setFormData({...formData, checklist: newList});
                                       }}
                                       className="w-5 h-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                    />
                                    <span className={`text-xs font-bold flex-1 ${item.done ? 'text-slate-300 line-through' : 'text-gray-700'}`}>{item.text}</span>
                                    <button onClick={() => {
                                       const newList = formData.checklist.filter((_:any, i:number) => i !== idx);
                                       setFormData({...formData, checklist: newList});
                                    }} className="text-rose-300 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                                 </div>
                              ))}
                           </div>
                        </div>

                        {editingTask && (
                           <div className="pt-10 flex justify-between">
                              <button onClick={async () => { if(confirm('Excluir esta tarefa definitivamente?')) { await supabaseService.deleteTask(editingTask.id); onTasksUpdate(); setIsModalOpen(false); } }} className="flex items-center gap-2 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 px-6 py-3 rounded-xl transition-all"><Trash2 className="w-4 h-4" /> Deletar Tarefa</button>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Right Column: FUP History */}
                  <div className="w-full md:w-80 bg-gray-50/50 p-10 overflow-y-auto custom-scrollbar">
                     <div className="flex items-center gap-2 mb-8">
                        <RefreshCw className="w-4 h-4 text-brand-primary" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fluxo de Follow-up</h4>
                     </div>

                     {editingTask ? (
                        <TaskFollowUps taskId={editingTask.id} userId={user_id} />
                     ) : (
                        <div className="text-center py-20 opacity-30">
                           <Clock className="w-12 h-12 mx-auto mb-4" />
                           <p className="text-[9px] font-black uppercase tracking-widest">Salve a tarefa primeiro para registrar follow-ups.</p>
                        </div>
                     )}
                  </div>
               </motion.div>
            </div>
          )}
        </AnimatePresence>
    </div>
  );
};


const TaskFollowUps = ({ taskId, userId }: { taskId: string, userId: string }) => {
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [newContent, setNewContent] = useState('');
  const [checklistItems, setChecklistItems] = useState<{ text: string; done: boolean }[]>([]);
  const [newCheckItem, setNewCheckItem] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    loadFollowUps();
  }, [taskId]);

  const loadFollowUps = async () => {
    try {
      const data = await supabaseService.getFollowUps(taskId, 'task');
      setFollowUps(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = async () => {
    if (!newContent.trim() && checklistItems.length === 0) return;
    setIsLoading(true);
    try {
      await supabaseService.addFollowUp({
        user_id: userId,
        entity_id: taskId,
        entity_type: 'task',
        content: newContent || (checklistItems.length > 0 ? "Checklist de follow-up" : ""),
        checklist: checklistItems,
        due_date: dueDate || null
      });
      setNewContent('');
      setChecklistItems([]);
      setDueDate('');
      loadFollowUps();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCheckItem = async (fu: any, itemIdx: number) => {
    const updatedChecklist = [...(fu.checklist || [])];
    updatedChecklist[itemIdx].done = !updatedChecklist[itemIdx].done;
    
    // Optimistic update
    setFollowUps(followUps.map(f => f.id === fu.id ? { ...f, checklist: updatedChecklist } : f));
    
    try {
      await supabaseService.updateFollowUp(fu.id, { checklist: updatedChecklist });
    } catch(e) {
      console.error(e);
      loadFollowUps(); // Reset if error
    }
  };

  const removeCheckItemFromFu = async (fu: any, itemIdx: number) => {
    const updatedChecklist = [...(fu.checklist || [])];
    updatedChecklist.splice(itemIdx, 1);
    
    setFollowUps(followUps.map(f => f.id === fu.id ? { ...f, checklist: updatedChecklist } : f));
    
    try {
      await supabaseService.updateFollowUp(fu.id, { checklist: updatedChecklist });
    } catch(e) {
      console.error(e);
      loadFollowUps();
    }
  };

  const addCheckItemToFu = async (fu: any, text: string) => {
    if (!text.trim()) return;
    const updatedChecklist = [...(fu.checklist || []), { text, done: false }];
    
    setFollowUps(followUps.map(f => f.id === fu.id ? { ...f, checklist: updatedChecklist } : f));
    
    try {
      await supabaseService.updateFollowUp(fu.id, { checklist: updatedChecklist });
    } catch(e) {
      console.error(e);
      loadFollowUps();
    }
  };

  const addChecklistItem = () => {
    if (!newCheckItem.trim()) return;
    setChecklistItems([...checklistItems, { text: newCheckItem, done: false }]);
    setNewCheckItem('');
  };

  const removePendingCheckItem = (idx: number) => {
    setChecklistItems(checklistItems.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-primary" />
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Histórico de Follow-up</h4>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4">
        <input 
          type="text" 
          value={newContent}
          onChange={e => setNewContent(e.target.value)}
          placeholder="O que foi feito ou precisa ser feito? (Ex: Ligar para cliente)"
          className="w-full bg-white border-none rounded-xl p-4 text-xs font-bold focus:ring-2 focus:ring-brand-primary shadow-sm"
        />
        
        {/* New Checklist items builder */}
        <div className="space-y-3 pt-2">
           <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Criar Checklist Inicial (Opcional)</h5>
           {checklistItems.map((item, idx) => (
             <div key={idx} className="flex items-center justify-between bg-white/50 p-2.5 rounded-lg border border-gray-100">
               <span className="text-[10px] font-bold text-slate-600">{item.text}</span>
               <button onClick={() => removePendingCheckItem(idx)} className="text-rose-400 p-1 hover:text-rose-600"><X className="w-3.5 h-3.5" /></button>
             </div>
           ))}
           <div className="flex gap-2">
             <input 
               type="text" 
               value={newCheckItem}
               onChange={e => setNewCheckItem(e.target.value)}
               placeholder="Adicionar item ao checklist..."
               className="flex-1 bg-white border-none rounded-lg p-3 text-[10px] font-medium focus:ring-2 focus:ring-brand-primary shadow-sm"
               onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
             />
             <button onClick={addChecklistItem} className="px-4 bg-brand-primary text-white font-black text-[10px] uppercase tracking-widest rounded-lg shadow-sm hover:bg-orange-600 transition-colors">
               Adicionar
             </button>
           </div>
        </div>

        <button 
          onClick={handleAdd}
          disabled={isLoading}
          className="w-full py-4 mt-2 bg-slate-900 border border-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2"
        >
          {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Registrar Follow-up
        </button>


        <div className="pt-2">
           <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Prazo/Data Limite (Opcional)</label>
           <input 
             type="date" 
             value={dueDate}
             onChange={e => setDueDate(e.target.value)}
             className="w-full bg-white border-none rounded-xl p-4 text-xs font-medium focus:ring-2 focus:ring-brand-primary shadow-sm"
           />
        </div>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {followUps.length > 0 ? followUps.map((fu) => {
          const totalItems = fu.checklist?.length || 0;
          const doneItems = fu.checklist?.filter((i: any) => i.done).length || 0;
          const progress = totalItems > 0 ? (doneItems / totalItems) * 100 : 0;

          return (
            <div key={fu.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex flex-col gap-4 relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-primary opacity-20 group-hover:opacity-100 transition-opacity"></div>
              
               <div className="flex justify-between items-start">
                 <div className="space-y-1">
                    <p className="text-[11px] text-gray-900 font-extrabold leading-relaxed bg-brand-primary/5 inline-block px-3 py-1.5 rounded-lg border border-brand-primary/10">{fu.content || 'Acompanhamento'}</p>
                    {fu.due_date && (
                       <div className="mt-2 text-[9px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 px-2 py-1 rounded-md inline-block">
                          Prazo: {new Date(fu.due_date).toLocaleDateString('pt-BR')}
                       </div>
                    )}
                 </div>
                 <div className="flex flex-col items-end gap-2">
                    <span className="text-[9px] font-bold text-slate-400 border border-gray-100 bg-gray-50 px-2 py-1 rounded-md uppercase whitespace-nowrap">
                        {new Date(fu.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    <button onClick={async () => {
                        if(confirm('Excluir este painel inteiro?')) {
                            // Quick deletion action for the whole follow-up
                            await supabaseService.deleteFollowUp(fu.id);
                            loadFollowUps();
                        }
                    }} className="text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:text-rose-600">
                        <Trash2 className="w-3 h-3" />
                    </button>
                 </div>
              </div>

              {totalItems > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase">Progresso do Checklist</span>
                    <span className="text-[9px] font-black text-brand-primary italic">{doneItems}/{totalItems} ({progress.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                    <motion.div 
                      className="h-full bg-brand-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  
                  <div className="space-y-1.5 mt-3">
                    {fu.checklist.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-transparent hover:border-brand-primary/10 group/item">
                        <input 
                          type="checkbox" 
                          checked={item.done} 
                          onChange={() => toggleCheckItem(fu, idx)}
                          className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                        />
                        <span className={`text-[11px] font-bold flex-1 ${item.done ? 'text-slate-400 line-through' : 'text-gray-700'}`}>
                          {item.text}
                        </span>
                        <button onClick={() => removeCheckItemFromFu(fu, idx)} className="text-rose-400 p-1.5 opacity-0 group-hover/item:opacity-100 hover:text-rose-600 transition-all hover:bg-rose-50 rounded-lg">
                           <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Inline Add Item to Existing Checklist */}
                  <div className="pt-2 px-1">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="+ Adicionar item rápido..."
                        className="flex-1 bg-transparent border-b border-gray-200 focus:border-brand-primary py-2 px-1 text-[10px] font-medium outline-none transition-colors"
                        onKeyPress={e => {
                           if (e.key === 'Enter') {
                              e.preventDefault();
                              addCheckItemToFu(fu, e.currentTarget.value);
                              e.currentTarget.value = '';
                           }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
              {totalItems === 0 && (
                <div className="pt-2">
                   {/* Allows creating a checklist in a Follow Up that didn't have one initially */}
                   <input 
                        type="text" 
                        placeholder="+ Transformar em checklist..."
                        className="w-full bg-gray-50 border border-gray-100 rounded-lg p-3 text-[10px] font-medium outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                        onKeyPress={e => {
                           if (e.key === 'Enter') {
                              e.preventDefault();
                              addCheckItemToFu(fu, e.currentTarget.value);
                              e.currentTarget.value = '';
                           }
                        }}
                    />
                </div>
              )}
            </div>
          );
        }) : (
          <p className="text-center text-[10px] text-slate-300 font-black uppercase py-4">Nenhum follow-up registrado.</p>
        )}
      </div>
    </div>
  );
};

const BusinessCanvaView = ({ user_id }: { user_id: string }) => {
  const [canvaData, setCanvaData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (!user_id || user_id === 'user-123') return;
    
    supabaseService.getBusinessCanva(user_id)
      .then((data) => {
        if (data) setCanvaData(data);
      })
      .catch(err => console.error("Error loading Business Canva:", err));

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [user_id]);

  const handleChange = (field: string, value: string) => {
    if (user_id === 'user-123') return;

    const newData = { ...canvaData, [field]: value };
    setCanvaData(newData);
    
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    saveTimeoutRef.current = setTimeout(() => {
      setIsSaving(true);
      supabaseService.saveBusinessCanva(user_id, newData)
        .catch(err => console.error("Error autosaving Business Canva:", err))
        .finally(() => setIsSaving(false));
    }, 1000);
  };


  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
         <div>
            <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Business Model <span className="text-brand-primary">Canva</span></h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Estratégia visual para o seu negócio</p>
         </div>
         {isSaving ? (
            <span className="flex items-center gap-2 text-indigo-500 font-bold text-[10px] uppercase bg-indigo-50 px-5 py-2.5 rounded-2xl border border-indigo-100/50 shadow-sm self-start md:self-center"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Salvando Alterações...</span>
         ) : (
            <span className="flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase bg-emerald-50 px-5 py-2.5 rounded-2xl border border-emerald-100/50 shadow-sm self-start md:self-center"><CheckCircle2 className="w-3.5 h-3.5" /> Sincronizado na Nuvem</span>
         )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
        {/* Parcerias */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col hover:border-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/5 transition-all group min-h-[280px]">
          <div className="flex items-center gap-3 mb-6 bg-slate-50 p-3.5 rounded-2xl w-fit text-slate-500 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors"><Handshake className="w-5 h-5" /> <h4 className="font-black text-[10px] tracking-widest uppercase">Parcerias Chave</h4></div>
          <textarea value={canvaData.key_partners || ''} onChange={e => handleChange('key_partners', e.target.value)} className="w-full flex-1 resize-none bg-transparent border-none outline-none text-sm text-slate-600 font-semibold leading-relaxed placeholder:text-slate-300" placeholder="Quem são seus principais parceiros e fornecedores estratégicos?" />
        </div>

        {/* Atividades */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col hover:border-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/5 transition-all group min-h-[280px]">
          <div className="flex items-center gap-3 mb-6 bg-slate-50 p-3.5 rounded-2xl w-fit text-slate-500 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors"><Target className="w-5 h-5" /> <h4 className="font-black text-[10px] tracking-widest uppercase">Atividades Chave</h4></div>
          <textarea value={canvaData.key_activities || ''} onChange={e => handleChange('key_activities', e.target.value)} className="w-full flex-1 resize-none bg-transparent border-none outline-none text-sm text-slate-600 font-semibold leading-relaxed placeholder:text-slate-300" placeholder="Quais são as ações mais importantes que seu negócio deve realizar?" />
        </div>

        {/* Recursos */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col hover:border-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/5 transition-all group min-h-[280px]">
          <div className="flex items-center gap-3 mb-6 bg-slate-50 p-3.5 rounded-2xl w-fit text-slate-500 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors"><Layers className="w-5 h-5" /> <h4 className="font-black text-[10px] tracking-widest uppercase">Recursos Chave</h4></div>
          <textarea value={canvaData.key_resources || ''} onChange={e => handleChange('key_resources', e.target.value)} className="w-full flex-1 resize-none bg-transparent border-none outline-none text-sm text-slate-600 font-semibold leading-relaxed placeholder:text-slate-300" placeholder="Físicos, humanos, intelectuais ou financeiros essenciais..." />
        </div>

        {/* Proposta Valor */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col hover:border-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/5 transition-all group min-h-[280px]">
          <div className="flex items-center gap-3 mb-6 bg-slate-50 p-3.5 rounded-2xl w-fit text-slate-500 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors"><Sparkles className="w-5 h-5" /> <h4 className="font-black text-[10px] tracking-widest uppercase">Proposta de Valor</h4></div>
          <textarea value={canvaData.value_propositions || ''} onChange={e => handleChange('value_propositions', e.target.value)} className="w-full flex-1 resize-none bg-transparent border-none outline-none text-sm text-slate-600 font-semibold leading-relaxed placeholder:text-slate-300" placeholder="Qual o valor único você entrega para seus clientes? O que te diferencia?" />
        </div>

        {/* Relacionamento */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col hover:border-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/5 transition-all group min-h-[280px]">
          <div className="flex items-center gap-3 mb-6 bg-slate-50 p-3.5 rounded-2xl w-fit text-slate-500 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors"><Users className="w-5 h-5" /> <h4 className="font-black text-[10px] tracking-widest uppercase">Relacionamento</h4></div>
          <textarea value={canvaData.customer_relationships || ''} onChange={e => handleChange('customer_relationships', e.target.value)} className="w-full flex-1 resize-none bg-transparent border-none outline-none text-sm text-slate-600 font-semibold leading-relaxed placeholder:text-slate-300" placeholder="Como você conquista e mantém seus clientes?" />
        </div>

        {/* Canais */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col hover:border-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/5 transition-all group min-h-[280px]">
          <div className="flex items-center gap-3 mb-6 bg-slate-50 p-3.5 rounded-2xl w-fit text-slate-500 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors"><Smartphone className="w-5 h-5" /> <h4 className="font-black text-[10px] tracking-widest uppercase">Canais</h4></div>
          <textarea value={canvaData.channels || ''} onChange={e => handleChange('channels', e.target.value)} className="w-full flex-1 resize-none bg-transparent border-none outline-none text-sm text-slate-600 font-semibold leading-relaxed placeholder:text-slate-300" placeholder="Através de quais canais você entrega sua proposta de valor?" />
        </div>

        {/* Segmentos */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col hover:border-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/5 transition-all group min-h-[280px]">
          <div className="flex items-center gap-3 mb-6 bg-slate-50 p-3.5 rounded-2xl w-fit text-slate-500 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors"><UserPlus className="w-5 h-5" /> <h4 className="font-black text-[10px] tracking-widest uppercase">Segmentos de Clientes</h4></div>
          <textarea value={canvaData.customer_segments || ''} onChange={e => handleChange('customer_segments', e.target.value)} className="w-full flex-1 resize-none bg-transparent border-none outline-none text-sm text-slate-600 font-semibold leading-relaxed placeholder:text-slate-300" placeholder="Para quem você está criando valor? Quem são seus clientes mais importantes?" />
        </div>

        {/* Custos */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col hover:border-rose-100/50 hover:shadow-xl hover:shadow-rose-500/5 transition-all group min-h-[280px]">
          <div className="flex items-center gap-3 mb-6 bg-rose-50 p-3.5 rounded-2xl w-fit text-rose-500 transition-colors"><TrendingDown className="w-5 h-5" /> <h4 className="font-black text-[10px] tracking-widest uppercase">Estrutura de Custos</h4></div>
          <textarea value={canvaData.cost_structure || ''} onChange={e => handleChange('cost_structure', e.target.value)} className="w-full flex-1 resize-none bg-transparent border-none outline-none text-sm text-slate-600 font-semibold leading-relaxed placeholder:text-slate-300" placeholder="Quais são os custos fixos e variáveis mais relevantes da operação?" />
        </div>

        {/* Receita */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col hover:border-emerald-100/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group min-h-[280px]">
          <div className="flex items-center gap-3 mb-6 bg-emerald-50 p-3.5 rounded-2xl w-fit text-emerald-600 transition-colors"><TrendingUp className="w-5 h-5" /> <h4 className="font-black text-[10px] tracking-widest uppercase">Fontes de Receita</h4></div>
          <textarea value={canvaData.revenue_streams || ''} onChange={e => handleChange('revenue_streams', e.target.value)} className="w-full flex-1 resize-none bg-transparent border-none outline-none text-sm text-slate-600 font-semibold leading-relaxed placeholder:text-slate-300" placeholder="Como o seu negócio gera receita? Quais são os fluxos de entrada?" />
        </div>
      </div>
    </div>
  );
};




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
  ArrowUpRight, Tag, Check, CheckSquare
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
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    if (!user_id) return;
    loadInitialData();
  }, [user_id]);

  const loadInitialData = async () => {
    if (!user_id) return;
    setIsLoading(true);
    try {
      const [projs, tsks, prof, allProfs] = await Promise.all([
        supabaseService.getProjects(user_id),
        supabaseService.getTasks(user_id),
        supabaseService.getProfileByUserId(user_id),
        supabaseService.getAllProfiles()
      ]);
      setProjects(projs);
      setTasks(tsks);
      setProfile(prof);
      setProfiles(allProfs);
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
              {activeTab === 'tasks' && <KanbanView user_id={user_id} projects={projects} initialTasks={tasks} profile={profile} profiles={profiles} onTasksUpdate={loadInitialData} />}
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

const LABEL_COLORS = [
  'bg-emerald-300 text-emerald-900', 'bg-yellow-300 text-yellow-900', 'bg-orange-300 text-orange-900', 'bg-rose-300 text-rose-900', 'bg-purple-300 text-purple-900',
  'bg-emerald-500 text-white', 'bg-yellow-500 text-white', 'bg-orange-500 text-white', 'bg-rose-500 text-white', 'bg-purple-500 text-white',
  'bg-emerald-700 text-white', 'bg-yellow-700 text-white', 'bg-orange-700 text-white', 'bg-rose-700 text-white', 'bg-purple-700 text-white',
  'bg-blue-300 text-blue-900', 'bg-sky-300 text-sky-900', 'bg-lime-300 text-lime-900', 'bg-pink-300 text-pink-900', 'bg-slate-300 text-slate-900',
  'bg-blue-500 text-white', 'bg-sky-500 text-white', 'bg-lime-500 text-white', 'bg-pink-500 text-white', 'bg-slate-500 text-white',
  'bg-blue-700 text-white', 'bg-sky-700 text-white', 'bg-lime-700 text-white', 'bg-pink-700 text-white', 'bg-slate-700 text-white',
];

const TaskLabelsPopover = ({ 
  isOpen, onClose, 
  taskLabels, 
  onTaskLabelsChange,
  globalLabels,
  onGlobalLabelsChange
}: { 
  isOpen: boolean; onClose: () => void; 
  taskLabels: string[]; 
  onTaskLabelsChange: (labels: string[]) => void;
  globalLabels: any[];
  onGlobalLabelsChange: (labels: any[]) => void;
}) => {
  const [search, setSearch] = useState('');
  const [editingLabel, setEditingLabel] = useState<any>(null); // Se null = modo lista, se object = modo edição/criação

  if (!isOpen) return null;

  const handleSaveLabel = () => {
    if (!editingLabel.title.trim()) return;
    
    let updatedGlobalLabels = [...globalLabels];
    
    if (editingLabel.isNew) {
      const newLabel = {
        id: 'lbl_' + Date.now().toString(),
        title: editingLabel.title,
        color: editingLabel.color || LABEL_COLORS[0]
      };
      updatedGlobalLabels.push(newLabel);
      onTaskLabelsChange([...taskLabels, newLabel.id]);
    } else {
      updatedGlobalLabels = updatedGlobalLabels.map(l => 
        l.id === editingLabel.id ? { ...l, title: editingLabel.title, color: editingLabel.color } : l
      );
    }
    
    onGlobalLabelsChange(updatedGlobalLabels);
    setEditingLabel(null);
  };

  const handleDeleteLabel = () => {
    if (editingLabel.isNew) return;
    const updatedGlobalLabels = globalLabels.filter(l => l.id !== editingLabel.id);
    onGlobalLabelsChange(updatedGlobalLabels);
    onTaskLabelsChange(taskLabels.filter(id => id !== editingLabel.id));
    setEditingLabel(null);
  };

  const toggleTaskLabel = (id: string) => {
    if (taskLabels.includes(id)) {
      onTaskLabelsChange(taskLabels.filter(lId => lId !== id));
    } else {
      onTaskLabelsChange([...taskLabels, id]);
    }
  };

  const filteredLabels = globalLabels.filter(l => l.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="absolute top-10 left-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-[300] overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        {editingLabel ? (
          <button onClick={() => setEditingLabel(null)} className="p-1 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-4 h-4 rotate-180 text-gray-500"/></button>
        ) : <div className="w-6" />}
        <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest text-center">
          {editingLabel ? (editingLabel.isNew ? 'Criar etiqueta' : 'Editar etiqueta') : 'Etiquetas'}
        </h4>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-500"/></button>
      </div>

      {!editingLabel ? (
        <div className="p-4 space-y-4">
          <input 
            type="text" 
            placeholder="Buscar etiquetas..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-brand-primary"
          />
          <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
             <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Sparkles className="w-3 h-3"/> Etiquetas</h5>
             {filteredLabels.map(label => (
               <div key={label.id} className="flex items-center gap-2 group">
                 <button onClick={() => toggleTaskLabel(label.id)} className="w-6 h-6 shrink-0 flex items-center justify-center rounded border border-gray-300 hover:border-brand-primary transition-colors">
                    {taskLabels.includes(label.id) && <Check className="w-4 h-4 text-brand-primary" />}
                 </button>
                 <button 
                   onClick={() => toggleTaskLabel(label.id)}
                   className={`flex-1 text-left px-3 py-1.5 rounded-lg text-[11px] font-bold truncate transition-transform hover:opacity-90 ${label.color}`}
                 >
                   {label.title}
                 </button>
                 <button onClick={() => setEditingLabel(label)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                   <Edit3 className="w-3.5 h-3.5" />
                 </button>
               </div>
             ))}
          </div>
          <button 
            onClick={() => setEditingLabel({ isNew: true, title: search, color: LABEL_COLORS[0] })}
            className="w-full py-2.5 bg-gray-50 text-slate-600 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors"
          >
            Criar uma nova etiqueta
          </button>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          <div className="bg-gray-50 p-6 rounded-xl flex items-center justify-center border border-gray-100">
            <span className={`px-4 py-1.5 rounded-lg text-xs font-bold ${editingLabel.color}`}>{editingLabel.title || 'Título da etiqueta'}</span>
          </div>

          <div className="space-y-1.5">
             <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Título</label>
             <input 
               type="text" 
               value={editingLabel.title}
               onChange={e => setEditingLabel({...editingLabel, title: e.target.value})}
               className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-brand-primary"
             />
          </div>

          <div className="space-y-2">
             <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Selecionar uma cor</label>
             <div className="grid grid-cols-5 gap-2">
               {LABEL_COLORS.map((color, idx) => {
                 const isSelected = editingLabel.color === color;
                 // Pega a classe de background (bg-...)
                 const bgClass = color.split(' ')[0];
                 return (
                   <button 
                     key={idx}
                     onClick={() => setEditingLabel({...editingLabel, color})}
                     className={`w-full aspect-video rounded-md flex items-center justify-center transition-all ${bgClass} ${isSelected ? 'ring-2 ring-brand-primary ring-offset-2' : 'hover:opacity-80'}`}
                   >
                     {isSelected && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                   </button>
                 )
               })}
             </div>
             <button onClick={() => setEditingLabel({...editingLabel, color: 'bg-slate-100 text-slate-700 border border-slate-200'})} className="w-full py-2 bg-white text-slate-600 border border-gray-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 mt-2 flex items-center justify-center gap-2">
               <X className="w-3.5 h-3.5"/> Remover cor
             </button>
          </div>

          <div className="pt-2 flex gap-2">
             <button onClick={handleSaveLabel} className="flex-1 py-2 bg-brand-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity">
               Salvar
             </button>
             {!editingLabel.isNew && (
                <button onClick={handleDeleteLabel} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity">
                  Excluir
                </button>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

const KanbanView = ({ user_id, projects, initialTasks, profile, profiles, onTasksUpdate }: { user_id: string, projects: any[], initialTasks: any[], profile: any, profiles: any[], onTasksUpdate: () => Promise<void> }) => {
  const [tasks, setTasks] = useState<any[]>(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [filters, setFilters] = useState({ search: '', responsible: '', priority: '', project_id: '', today: false });
  const [visibleModules, setVisibleModules] = useState<string[]>([]);
  const [formData, setFormData] = useState<any>({ 
    title: '', description: '', status: 'A Fazer', project_id: '', 
    assignee_name: '', assignee_id: '', priority: 'Média', due_date: '', checklist: [], checklist_title: 'Checklist', external_link: '', labels: [] 
  });
  const [isLabelsOpen, setIsLabelsOpen] = useState(false);
  const [isAddChecklistOpen, setIsAddChecklistOpen] = useState(false);
  const [checklistToDelete, setChecklistToDelete] = useState<number | null>(null);
  const [newChecklistTitle, setNewChecklistTitle] = useState('Checklist');
  const [copiedChecklistId, setCopiedChecklistId] = useState('');

  // Get all unique user checklists
  const allUserChecklists = React.useMemo(() => {
     const list: {id: string, title: string, items: any[], taskTitle: string}[] = [];
     tasks.forEach(t => {
        if (t.checklist && t.checklist.length > 0) {
           if (t.checklist[0].items !== undefined) {
              t.checklist.forEach((c: any) => list.push({ ...c, taskTitle: t.title }));
           } else {
              list.push({ id: t.id + '_old', title: t.checklist_title || 'Checklist', items: t.checklist, taskTitle: t.title });
           }
        }
     });
     return list;
  }, [tasks]);

  // Load custom stages and labels from profile if they exist
  const defaultStages = ['A Fazer', 'Em Progresso', 'Concluído'];
  const [columns, setColumns] = useState<string[]>(profile?.store_config?.project_stages || defaultStages);
  const [globalLabels, setGlobalLabels] = useState<any[]>(profile?.store_config?.task_labels || []);

  React.useEffect(() => {
    if (profile?.store_config?.project_stages) {
       setColumns(profile.store_config.project_stages);
    }
    if (profile?.store_config?.task_labels) {
       setGlobalLabels(profile.store_config.task_labels);
    }
  }, [profile]);

  React.useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const updateGlobalLabels = async (newLabels: any[]) => {
     setGlobalLabels(newLabels);
     await supabaseService.updateProfile(user_id, { store_config: { ...profile.store_config, task_labels: newLabels } });
  };

  const handleSave = async () => {
    if (!formData.title) return;
    try {
      const dataToSave = { 
        ...formData, 
        project_id: formData.project_id === '' ? null : formData.project_id,
        assignee_id: formData.assignee_id === '' ? null : formData.assignee_id
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
      assignee_name: profile ? (profile.name || profile.business_name || '') : '', 
      assignee_id: user_id || null, 
      priority: 'Média', due_date: '', checklist: [], external_link: '', labels: []
    });
    setVisibleModules([]);
    setIsModalOpen(true);
  };

  const openEdit = (task: any) => {
     setEditingTask(task);
     let migratedChecklist: any[] = [];
     if (task.checklist && task.checklist.length > 0) {
         if (task.checklist[0].items !== undefined) {
             migratedChecklist = task.checklist;
         } else {
             migratedChecklist = [{ id: crypto.randomUUID(), title: task.checklist_title || 'Checklist', items: task.checklist }];
         }
     }

     setFormData({ 
        title: task.title, 
        description: task.description || '', 
        status: task.status, 
        project_id: task.project_id || '',
        assignee_name: task.assignee_name || '',
        assignee_id: task.assignee_id || '',
        priority: task.priority || 'Média',
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        checklist: migratedChecklist,
        external_link: task.external_link || '',
        labels: task.labels || []
     });

     const modules = [];
     if (task.checklist && task.checklist.length > 0) modules.push('checklist');
     if (task.due_date) modules.push('dates');
     if (task.assignee_name || task.assignee_id) modules.push('members');
     if (task.priority && task.priority !== 'Média') modules.push('priority');
     if (task.project_id) modules.push('project');
     if (task.external_link) modules.push('documents');
     if (task.labels && task.labels.length > 0) modules.push('labels');
     setVisibleModules(modules);

     setIsModalOpen(true);
  };

  const toggleModule = (mod: string) => {
     if (!visibleModules.includes(mod)) setVisibleModules([...visibleModules, mod]);
  };

  const removeModule = (mod: string) => {
     setVisibleModules(visibleModules.filter(m => m !== mod));
     if (mod === 'checklist') setFormData({...formData, checklist: []});
     if (mod === 'dates') setFormData({...formData, due_date: ''});
     if (mod === 'members') setFormData({...formData, assignee_name: '', assignee_id: null});
     if (mod === 'project') setFormData({...formData, project_id: ''});
     if (mod === 'documents') setFormData({...formData, external_link: ''});
     if (mod === 'priority') setFormData({...formData, priority: 'Média'});
     if (mod === 'labels') setFormData({...formData, labels: []});
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
                        {task.labels && task.labels.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {task.labels.map((lId: string) => {
                               const lbl = globalLabels.find(g => g.id === lId);
                               if (!lbl) return null;
                               return (
                                 <span key={lbl.id} className={`px-2 py-0.5 rounded text-[8px] font-bold ${lbl.color} max-w-[120px] truncate`}>
                                   {lbl.title}
                                 </span>
                               )
                            })}
                          </div>
                        )}
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
                       
                       {task.checklist && task.checklist.length > 0 && (
                           <div className="flex items-center gap-1.5">
                              <ListTodo className="w-3 h-3 text-brand-primary" />
                              <span className="text-[8px] font-black text-brand-primary">
                                 {(() => {
                                    const totalItems = task.checklist.reduce((acc: number, c: any) => acc + (c.items ? c.items.length : 1), 0);
                                    const doneItems = task.checklist.reduce((acc: number, c: any) => acc + (c.items ? c.items.filter((i:any) => i.done).length : (c.done ? 1 : 0)), 0);
                                    return `${doneItems}/${totalItems}`;
                                 })()}
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

        {/* Task Detail/Edit Modal (Trello Style) */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
               <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="bg-[#f4f5f7] rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] shadow-2xl overflow-hidden border border-white/5 flex flex-col"
               >
                  {/* Sticky Top Header */}
                  <div className="bg-white px-8 py-6 flex justify-between items-center border-b border-gray-100 shadow-sm z-30">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                           <LayoutGrid className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-black text-gray-900 uppercase italic">Cartão de Tarefa</h3>
                     </div>
                     <div className="flex items-center gap-2">
                        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95">
                           <Save className="w-3.5 h-3.5" /> Salvar
                        </button>
                        <button onClick={() => setIsModalOpen(false)} className="p-2.5 bg-gray-100 text-slate-400 rounded-xl hover:bg-gray-200 transition-colors">
                           <X className="w-5 h-5" />
                        </button>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-12">
                     {/* Title & Context */}
                     <div className="space-y-6">
                        <div className="flex items-start gap-4">
                           <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-1">
                              <Smartphone className="w-5 h-5 text-slate-400" />
                           </div>
                           <div className="flex-1">
                              <input 
                                 type="text" 
                                 value={formData.title} 
                                 onChange={e => setFormData({...formData, title: e.target.value})} 
                                 className="w-full text-4xl font-black text-gray-900 border-none outline-none focus:ring-0 p-0 bg-transparent placeholder:text-gray-300" 
                                 placeholder="Título da Tarefa..." 
                              />
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 px-1">
                                 No quadro <span className="text-brand-primary underline underline-offset-4">{formData.status}</span>
                              </p>
                              {formData.labels && formData.labels.length > 0 && (
                                 <div className="flex flex-wrap gap-2 mt-3 px-1">
                                   {formData.labels.map((labelId: string) => {
                                      const label = globalLabels.find(l => l.id === labelId);
                                      if (!label) return null;
                                      return (
                                        <span key={label.id} className={`px-3 py-1 rounded-lg text-[10px] font-bold ${label.color}`}>
                                          {label.title}
                                        </span>
                                      );
                                   })}
                                   <div className="relative">
                                     <button onClick={() => setIsLabelsOpen(!isLabelsOpen)} className="w-6 h-6 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors">
                                       <Plus className="w-3.5 h-3.5" />
                                     </button>
                                     <TaskLabelsPopover 
                                       isOpen={isLabelsOpen} 
                                       onClose={() => setIsLabelsOpen(false)} 
                                       taskLabels={formData.labels || []}
                                       onTaskLabelsChange={(labels) => setFormData({...formData, labels})}
                                       globalLabels={globalLabels}
                                       onGlobalLabelsChange={updateGlobalLabels}
                                     />
                                   </div>
                                 </div>
                               )}
                           </div>
                        </div>

                        {/* Module Add Buttons (Trello Style) */}
                        <div className="flex flex-wrap gap-2 px-1">
                           <div className="relative">
                               <button onClick={() => setIsLabelsOpen(!isLabelsOpen)} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-gray-50 flex items-center gap-1.5 shadow-sm transition-all"><Tag className="w-3 h-3 text-slate-400" /> Etiquetas</button>
                               {(!formData.labels || formData.labels.length === 0) && (
                                 <TaskLabelsPopover 
                                   isOpen={isLabelsOpen} 
                                   onClose={() => setIsLabelsOpen(false)} 
                                   taskLabels={formData.labels || []}
                                   onTaskLabelsChange={(labels) => setFormData({...formData, labels})}
                                   globalLabels={globalLabels}
                                   onGlobalLabelsChange={updateGlobalLabels}
                                 />
                               )}
                            </div>
                           {!visibleModules.includes('members') && <button onClick={() => toggleModule('members')} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-gray-50 flex items-center gap-1.5 shadow-sm transition-all"><Users className="w-3 h-3 text-slate-400" /> Membros</button>}
                           {!visibleModules.includes('dates') && <button onClick={() => toggleModule('dates')} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-gray-50 flex items-center gap-1.5 shadow-sm transition-all"><CalendarIcon className="w-3 h-3 text-slate-400" /> Datas</button>}
                               <div className="relative">
                                 <button onClick={() => setIsAddChecklistOpen(!isAddChecklistOpen)} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-gray-50 flex items-center gap-1.5 shadow-sm transition-all"><CheckSquare className="w-3 h-3 text-slate-400" /> Checklist</button>
                                 
                                 {isAddChecklistOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                                       <div className="p-3 border-b border-gray-100 flex justify-between items-center relative">
                                          <h4 className="text-[11px] font-bold text-gray-700 w-full text-center">Adicionar Checklist</h4>
                                          <button onClick={() => setIsAddChecklistOpen(false)} className="absolute right-3 p-1 text-gray-400 hover:bg-gray-100 rounded-md">
                                             <X className="w-3.5 h-3.5" />
                                          </button>
                                       </div>
                                       <div className="p-4 space-y-4">
                                          <div>
                                             <label className="block text-[10px] font-black text-gray-600 mb-1.5">Título</label>
                                             <input 
                                                type="text" 
                                                value={newChecklistTitle}
                                                onChange={(e) => setNewChecklistTitle(e.target.value)}
                                                autoFocus
                                                className="w-full border-2 border-brand-primary/60 focus:border-brand-primary rounded-lg py-1.5 px-3 text-sm font-semibold text-gray-800 outline-none transition-colors"
                                             />
                                          </div>
                                          <div>
                                             <label className="block text-[10px] font-black text-gray-600 mb-1.5">Copiar Itens de...</label>
                                             <select 
                                                value={copiedChecklistId}
                                                onChange={(e) => setCopiedChecklistId(e.target.value)}
                                                disabled={allUserChecklists.length === 0}
                                                className={`w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-[11px] font-medium text-gray-700 outline-none focus:border-brand-primary ${allUserChecklists.length === 0 ? 'bg-gray-50 cursor-not-allowed text-gray-400' : ''}`}
                                             >
                                                <option value="">(nenhum)</option>
                                                {allUserChecklists.map(c => (
                                                   <option key={c.id} value={c.id}>{c.title} (de {c.taskTitle})</option>
                                                ))}
                                             </select>
                                          </div>
                                          <button 
                                             onClick={() => {
                                                const sourceChecklist = allUserChecklists.find(c => c.id === copiedChecklistId);
                                                const itemsToCopy = sourceChecklist ? sourceChecklist.items.map((i: any) => ({...i, done: false})) : [];
                                                
                                                const newChecklist = {
                                                   id: crypto.randomUUID(),
                                                   title: newChecklistTitle,
                                                   items: itemsToCopy
                                                };
                                                
                                                setFormData({ ...formData, checklist: [...(formData.checklist || []), newChecklist] });
                                                if (!visibleModules.includes('checklist')) toggleModule('checklist');
                                                setIsAddChecklistOpen(false);
                                                setNewChecklistTitle('Checklist');
                                                setCopiedChecklistId('');
                                             }}
                                             className="px-5 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg text-[11px] font-bold shadow-sm active:scale-95 transition-all w-full"
                                          >
                                             Adicionar
                                          </button>
                                       </div>
                                    </div>
                                 )}
                               </div>
                            {/* !visibleModules.includes('checklist') -> It's fine to show the button always to add multiple checklists */}
                           {!visibleModules.includes('project') && <button onClick={() => toggleModule('project')} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-gray-50 flex items-center gap-1.5 shadow-sm transition-all"><Briefcase className="w-3 h-3 text-slate-400" /> Projeto</button>}
                           {!visibleModules.includes('priority') && <button onClick={() => toggleModule('priority')} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-gray-50 flex items-center gap-1.5 shadow-sm transition-all"><AlertCircle className="w-3 h-3 text-slate-400" /> Prioridade</button>}
                           {!visibleModules.includes('documents') && <button onClick={() => toggleModule('documents')} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-gray-50 flex items-center gap-1.5 shadow-sm transition-all"><Globe className="w-3 h-3 text-slate-400" /> Anexo</button>}
                        </div>

                        {/* Visible Action Modules */}
                        {visibleModules.some(m => ['members', 'dates', 'priority', 'project'].includes(m)) && (
                           <div className="flex flex-wrap gap-4 px-1 pt-4">
                              {visibleModules.includes('members') && (
                                 <div className="flex flex-col gap-1.5">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2 group">
                                       Membros <button onClick={() => removeModule('members')} className="opacity-0 group-hover:opacity-100 text-rose-400"><X className="w-2.5 h-2.5"/></button>
                                    </label>
                                    <div className="relative">
                                       <input 
                                         list="platform-users"
                                         type="text" 
                                         value={formData.assignee_name} 
                                         onChange={e => {
                                            const val = e.target.value;
                                            const matchedProfile = profiles.find(p => (p.name || p.business_name) === val);
                                            setFormData({ ...formData, assignee_name: val, assignee_id: matchedProfile ? matchedProfile.user_id : null });
                                         }} 
                                         className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl py-2 px-4 font-bold text-[10px] uppercase tracking-widest focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
                                         placeholder="+ Atribuir"
                                       />
                                       <datalist id="platform-users">
                                          {profiles.map(p => <option key={p.user_id} value={p.name || p.business_name} />)}
                                       </datalist>
                                    </div>
                                 </div>
                              )}

                              {visibleModules.includes('dates') && (
                                 <div className="flex flex-col gap-1.5">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2 group">
                                       Datas <button onClick={() => removeModule('dates')} className="opacity-0 group-hover:opacity-100 text-rose-400"><X className="w-2.5 h-2.5"/></button>
                                    </label>
                                    <input type="date" value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})} className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl py-2 px-4 font-bold text-[10px] uppercase tracking-widest focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none" />
                                 </div>
                              )}

                              {visibleModules.includes('priority') && (
                                 <div className="flex flex-col gap-1.5">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2 group">
                                       Prioridade <button onClick={() => removeModule('priority')} className="opacity-0 group-hover:opacity-100 text-rose-400"><X className="w-2.5 h-2.5"/></button>
                                    </label>
                                    <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl py-2 px-4 font-black text-[10px] uppercase tracking-widest outline-none focus:ring-2 focus:ring-brand-primary/20">
                                       <option>Baixa</option>
                                       <option>Média</option>
                                       <option>Alta</option>
                                       <option>Crítica</option>
                                    </select>
                                 </div>
                              )}

                              {visibleModules.includes('project') && (
                                 <div className="flex flex-col gap-1.5">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2 group">
                                       Projeto <button onClick={() => removeModule('project')} className="opacity-0 group-hover:opacity-100 text-rose-400"><X className="w-2.5 h-2.5"/></button>
                                    </label>
                                    <select value={formData.project_id} onChange={e => setFormData({...formData, project_id: e.target.value})} className="bg-white hover:bg-gray-50 border border-gray-200 rounded-xl py-2 px-4 font-bold text-[10px] uppercase tracking-widest outline-none focus:ring-2 focus:ring-brand-primary/20">
                                       <option value="">Nenhum</option>
                                       {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                 </div>
                              )}
                           </div>
                        )}
                     </div>

                     {/* Description */}
                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <Edit3 className="w-5 h-5 text-slate-400" />
                           <h4 className="text-sm font-black text-gray-900 uppercase italic">Descrição</h4>
                        </div>
                        <div className="pl-8">
                           <textarea 
                              value={formData.description} 
                              onChange={e => setFormData({...formData, description: e.target.value})} 
                              className="w-full bg-white border border-gray-100 rounded-2xl p-6 text-sm font-medium focus:ring-2 focus:ring-brand-primary/10 transition-all min-h-[120px] leading-relaxed shadow-sm" 
                              placeholder="Adicione uma descrição mais detalhada..." 
                           />
                        </div>
                     </div>

                     {/* External Links */}
                     {visibleModules.includes('documents') && (
                        <div className="space-y-4">
                           <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                 <Globe className="w-5 h-5 text-slate-400" />
                                 <h4 className="text-sm font-black text-gray-900 uppercase italic">Documentos</h4>
                              </div>
                              <button onClick={() => removeModule('documents')} className="px-3 py-1.5 bg-white text-rose-400 border border-gray-200 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all shadow-sm">
                                 Remover
                              </button>
                           </div>
                           <div className="pl-8 flex gap-2">
                              <input type="url" value={formData.external_link} onChange={e => setFormData({...formData, external_link: e.target.value})} className="flex-1 bg-white border border-gray-100 rounded-xl py-3 px-4 font-bold text-xs text-indigo-600 shadow-sm" placeholder="Link de documento (Drive, etc)..." />
                              {formData.external_link && (
                                 <a href={formData.external_link} target="_blank" rel="noopener noreferrer" className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors">
                                    <ArrowUpRight className="w-5 h-5" />
                                 </a>
                              )}
                           </div>
                        </div>
                     )}

                     {/* Checklists */}
                     {visibleModules.includes('checklist') && formData.checklist?.map((checklist: any, cIdx: number) => (
                        <div key={checklist.id} className="space-y-4 mb-8">
                           <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                 <CheckCircle2 className="w-5 h-5 text-slate-400" />
                                 <h4 className="text-sm font-black text-gray-900 uppercase italic">{checklist.title}</h4>
                              </div>
                              <div className="relative">
                                 <button onClick={() => setChecklistToDelete(cIdx)} className="px-4 py-2 bg-white text-slate-600 border border-gray-200 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
                                    Excluir
                                 </button>
                                 
                                 {checklistToDelete === cIdx && (
                                    <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                                       <div className="p-3 border-b border-gray-100 flex justify-between items-center relative">
                                          <h4 className="text-[11px] font-bold text-gray-700 w-full text-center">Excluir {checklist.title}?</h4>
                                          <button onClick={() => setChecklistToDelete(null)} className="absolute right-3 p-1 text-gray-400 hover:bg-gray-100 rounded-md">
                                             <X className="w-3.5 h-3.5" />
                                          </button>
                                       </div>
                                       <div className="p-4 space-y-4">
                                          <p className="text-[11px] font-medium text-gray-500 leading-relaxed">
                                            A exclusão de um checklist é permanente e não há como desfazer. Todos os itens concluídos e pendentes serão perdidos.
                                          </p>
                                          <button 
                                             onClick={() => {
                                                const newChecklists = formData.checklist.filter((_:any, i:number) => i !== cIdx);
                                                setFormData({...formData, checklist: newChecklists});
                                                if (newChecklists.length === 0) removeModule('checklist');
                                                setChecklistToDelete(null);
                                             }}
                                             className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-[11px] font-bold shadow-sm active:scale-95 transition-all"
                                          >
                                             Excluir Checklist
                                          </button>
                                       </div>
                                    </div>
                                 )}
                              </div>
                           </div>

                        {checklist.items && checklist.items.length > 0 && (
                           <div className="pl-8 flex items-center gap-3">
                              <span className="text-[10px] font-black text-slate-500 w-8">
                                 {checklist.items.length === 0 ? 0 : Math.round((checklist.items.filter((i:any) => i.done).length / checklist.items.length) * 100)}%
                              </span>
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                 <div 
                                    className="h-full bg-brand-primary transition-all duration-300" 
                                    style={{ width: `${checklist.items.length === 0 ? 0 : (checklist.items.filter((i:any) => i.done).length / checklist.items.length) * 100}%` }}
                                 />
                              </div>
                           </div>
                        )}
                        
                        <div className="pl-8 space-y-2 pt-2">
                           {checklist.items?.map((item:any, idx:number) => (
                              <div key={idx} className="flex items-start gap-3 group/item">
                                 <input 
                                    type="checkbox" 
                                    checked={item.done} 
                                    onChange={() => {
                                       const newChecklists = [...formData.checklist];
                                       newChecklists[cIdx].items[idx].done = !newChecklists[cIdx].items[idx].done;
                                       setFormData({...formData, checklist: newChecklists});
                                    }}
                                    className="w-4 h-4 mt-1.5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary transition-all cursor-pointer"
                                 />
                                 <div className="flex-1">
                                    <input 
                                       type="text"
                                       value={item.text}
                                       onChange={(e) => {
                                          const newChecklists = [...formData.checklist];
                                          newChecklists[cIdx].items[idx].text = e.target.value;
                                          setFormData({...formData, checklist: newChecklists});
                                       }}
                                       className={`w-full bg-transparent border-none p-1 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-brand-primary/20 rounded-lg transition-all ${item.done ? 'text-slate-400 line-through' : 'text-gray-700'}`}
                                    />
                                 </div>
                                 <button onClick={() => {
                                    const newChecklists = [...formData.checklist];
                                    newChecklists[cIdx].items = newChecklists[cIdx].items.filter((_:any, i:number) => i !== idx);
                                    setFormData({...formData, checklist: newChecklists});
                                 }} className="text-rose-300 hover:text-rose-500 opacity-0 group-hover/item:opacity-100 transition-all p-1.5">
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                              </div>
                           ))}

                           {/* Add Item Form */}
                           <div className="pt-4">
                              <form onSubmit={(e) => {
                                 e.preventDefault();
                                 const form = e.target as HTMLFormElement;
                                 const input = form.elements.namedItem('newItem') as HTMLInputElement;
                                 if (input.value.trim()) {
                                    const newChecklists = [...formData.checklist];
                                    newChecklists[cIdx].items.push({ text: input.value.trim(), done: false });
                                    setFormData({...formData, checklist: newChecklists});
                                    input.value = '';
                                 }
                              }} className="flex flex-col gap-2">
                                 <input 
                                    name="newItem"
                                    type="text" 
                                    placeholder="Adicionar um item..." 
                                    className="w-full bg-white border border-brand-primary/40 rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-brand-primary transition-all outline-none placeholder:text-slate-400 shadow-sm"
                                 />
                                 <div className="flex gap-2">
                                    <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-sm">
                                       Adicionar
                                    </button>
                                 </div>
                              </form>
                           </div>
                        </div>
                     </div>
                     ))}

                     {/* Follow-up & Activity (Now below checklist) */}
                     <div className="space-y-6 pt-12 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                           <Clock className="w-5 h-5 text-slate-400" />
                           <h4 className="text-sm font-black text-gray-900 uppercase italic">Follow-up & Histórico</h4>
                        </div>
                        <div className="pl-8">
                           {editingTask ? (
                              <TaskFollowUps taskId={editingTask.id} userId={user_id} />
                           ) : (
                              <div className="py-10 bg-white border border-dashed border-gray-200 rounded-3xl text-center">
                                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Salve para iniciar o histórico.</p>
                              </div>
                           )}
                        </div>
                     </div>

                     {/* Danger Zone */}
                     {editingTask && (
                        <div className="pt-20 flex justify-center">
                           <button 
                              onClick={async () => { if(confirm('Excluir este cartão permanentemente?')) { await supabaseService.deleteTask(editingTask.id); onTasksUpdate(); setIsModalOpen(false); } }} 
                              className="text-[9px] font-black text-rose-300 hover:text-rose-500 uppercase tracking-[0.2em] transition-all"
                           >
                              Excluir este cartão
                           </button>
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
    if (!newContent.trim()) return;
    setIsLoading(true);
    try {
      await supabaseService.addFollowUp({
        user_id: userId,
        entity_id: taskId,
        entity_type: 'task',
        content: newContent,
        checklist: null,
        due_date: dueDate || null
      });
      setNewContent('');
      setDueDate('');
      loadFollowUps();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
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
        <textarea 
          value={newContent}
          onChange={e => setNewContent(e.target.value)}
          placeholder="O que foi feito ou precisa ser feito? (Ex: Ligar para cliente)"
          className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-4 font-medium text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none resize-none min-h-[80px]"
        />
        <div className="flex gap-2 items-center">
           <input 
             type="date" 
             value={dueDate}
             onChange={e => setDueDate(e.target.value)}
             className="bg-white border border-gray-200 rounded-xl py-2 px-4 text-xs font-bold text-slate-500 focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none" 
           />
           <button 
             onClick={handleAdd}
             disabled={isLoading || !newContent.trim()}
             className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-md disabled:opacity-50"
           >
             {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Registrar'}
           </button>
        </div>
      </div>

      <div className="space-y-4 relative before:content-[''] before:absolute before:left-6 before:top-4 before:bottom-4 before:w-px before:bg-gradient-to-b before:from-gray-200 before:to-transparent">
        {followUps.length > 0 ? followUps.map((fu) => (
          <div key={fu.id} className="relative pl-14">
            <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-white border-4 border-brand-primary/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
            </div>
            
            <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {new Date(fu.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className="flex items-center gap-2">
                  {fu.due_date && (
                    <span className="text-[9px] font-bold bg-orange-50 text-brand-primary px-3 py-1 rounded-lg uppercase tracking-widest flex items-center gap-1.5">
                      <CalendarIcon className="w-3 h-3" />
                      Prazo: {new Date(fu.due_date).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                  <button onClick={async () => {
                      if(confirm('Excluir este follow-up?')) {
                          await supabaseService.deleteFollowUp(fu.id);
                          loadFollowUps();
                      }
                  }} className="text-rose-400 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                      <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">{fu.content}</p>
            </div>
          </div>
        )) : (
          <p className="pl-14 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] pt-4">Nenhum registro encontrado.</p>
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



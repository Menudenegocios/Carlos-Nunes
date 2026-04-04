
import React, { useState } from 'react';
import { 
  LayoutGrid, Target, ListTodo, Calendar, 
  BarChart3, Plus, ChevronRight, 
  CheckCircle2, Clock, AlertCircle,
  TrendingUp, Users, Zap, Search,
  ArrowRight, Save, Trash2, Edit3,
  Lightbulb, Shield, HelpCircle,
  Briefcase, PieChart, Layers, RefreshCw,
  Handshake, Globe, Coins, Columns, UserPlus, Smartphone, X, Sparkles, TrendingDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabaseService } from '../services/supabaseService';
import { useAuth } from '../contexts/AuthContext';

type TabType = 'inicio' | 'swot' | 'smart' | 'canva' | 'projects';

export const ProjectManagement: React.FC = () => {
  const { user } = useAuth();
  const user_id = user?.id || 'user-123'; // Fallback to placeholder if user not loaded
  const [newProjectCategory, setNewProjectCategory] = useState('Outros');
  const [newProjectTool, setNewProjectTool] = useState('Outros');
  const [activeTab, setActiveTab] = useState<'projects' | 'tasks' | 'canva'>('canva');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectStatus, setNewProjectStatus] = useState('A Fazer');
  const [newProjectPriority, setNewProjectPriority] = useState('Média');
  const [editingProject, setEditingProject] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);

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
    { id: 'canva', label: 'Business Canva', icon: PieChart },
    { id: 'projects', label: 'Projetos', icon: Briefcase },
    { id: 'tasks', label: 'Tarefas (Kanban)', icon: LayoutGrid },
  ];

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

      {/* Content Area */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'projects' && <ProjectsView projects={projects} deleteProject={deleteProject} onEdit={openEditProjectModal} />}
            {activeTab === 'tasks' && <KanbanView user_id={user_id} projects={projects} />}
            {activeTab === 'canva' && <BusinessCanvaView user_id={user_id} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- SUB-VIEWS ---



const ProjectsView = ({ projects, deleteProject, onEdit }: { projects: any[], deleteProject: (id: string) => void, onEdit: (project: any) => void }) => {
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
               <span className="text-[10px] font-black text-slate-300 uppercase italic tracking-tighter">
                  {p.support_tool !== 'Outros' ? p.support_tool : ''}
               </span>
            </div>
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

const KanbanView = ({ user_id, projects }: { user_id: string, projects: any[] }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFupModalOpen, setIsFupModalOpen] = useState(false);
  const [fupTaskId, setFupTaskId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'A Fazer', project_id: '' });

  React.useEffect(() => {
    loadTasks();
  }, [user_id]);

  const loadTasks = async () => {
    try {
       const data = await supabaseService.getTasks(user_id);
       setTasks(data.map(t => ({ ...t, status: ['A Fazer', 'Em Progresso', 'Concluído'].includes(t.status) ? t.status : 'A Fazer' })));
    } catch(e) { console.error(e) }
  };

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
        await supabaseService.addTask({ user_id, ...dataToSave, due_date: new Date().toISOString(), type: 'other' });
      }
      loadTasks();
      setIsModalOpen(false);
      setEditingTask(null);
      setFormData({ title: '', description: '', status: 'A Fazer', project_id: '' });
    } catch(e) { console.error(e) }
  };

  const openEdit = (task: any) => {
     setEditingTask(task);
     setFormData({ title: task.title, description: task.description || '', status: task.status, project_id: task.project_id || '' });
     setIsModalOpen(true);
  };

  const updateStatus = async (id: string, status: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));
    await supabaseService.updateTask(id, { status });
  };

  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('taskId', id);
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  }

  const onDrop = (e: React.DragEvent, status: string) => {
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateStatus(taskId, status);
    }
  }

  const columns = ['A Fazer', 'Em Progresso', 'Concluído'];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
       <div className="flex justify-between items-center px-4">
         <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">Quadro Kanban</h3>
         <button onClick={() => { setFormData({ title: '', description: '', status: 'A Fazer', project_id: '' }); setEditingTask(null); setIsModalOpen(true); }} className="px-6 py-3 bg-brand-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all flex gap-2 items-center">
            <Plus className="w-4 h-4" /> Nova Tarefa
         </button>
       </div>

       <div className="flex gap-6 overflow-x-auto pb-4 snap-x px-4" style={{ minHeight: '600px' }}>
         {columns.map(col => (
           <div 
             key={col} 
             onDragOver={onDragOver} 
             onDrop={e => onDrop(e, col)} 
             className="flex-1 min-w-[320px] max-w-[400px] bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col gap-4 snap-center shrink-0"
           >
             <div className="flex items-center justify-between mb-2">
               <h4 className={`font-black text-xs uppercase tracking-widest ${col === 'Concluído' ? 'text-emerald-500' : col === 'Em Progresso' ? 'text-indigo-500' : 'text-slate-400'}`}>{col}</h4>
               <span className="bg-gray-50 text-slate-400 font-black px-3 py-1 rounded-xl text-[10px] shadow-inner">
                 {tasks.filter(t => t.status === col).length}
               </span>
             </div>
             
             {tasks.filter(t => t.status === col).map(task => (
                <div 
                  key={task.id} 
                  draggable 
                  onDragStart={e => onDragStart(e, task.id)}
                  onClick={() => openEdit(task)}
                  className="bg-gray-50 p-5 rounded-2xl border border-transparent cursor-grab hover:shadow-md hover:border-brand-primary/30 transition-all hover:-translate-y-1 active:scale-95"
                >
                  <h5 className="font-bold text-gray-900 leading-snug mb-2">{task.title}</h5>
                  {task.project_id && (
                     <span className="inline-block bg-brand-primary/10 text-brand-primary text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg mb-2">
                        {projects.find(p => p.id === task.project_id)?.name || 'Projeto Oculto'}
                     </span>
                  )}
                  {task.description && <p className="text-xs text-slate-500 line-clamp-3 font-medium leading-relaxed mb-4">{task.description}</p>}
                  
                  <div className="flex items-center justify-between">
                     <button 
                        onClick={(e) => { e.stopPropagation(); setFupTaskId(task.id); setIsFupModalOpen(true); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary/5 text-brand-primary rounded-lg font-black text-[8px] uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                     >
                        <RefreshCw className="w-2.5 h-2.5" /> FUP
                     </button>
                     <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-black italic">CN</div>
                     </div>
                  </div>
                </div>
             ))}

             <button onClick={() => { setFormData({...formData, title: '', description: '', status: col, project_id: ''}); setEditingTask(null); setIsModalOpen(true); }} className="w-full py-4 text-slate-400 hover:text-brand-primary font-black text-[10px] uppercase tracking-widest border-2 border-dashed border-gray-100 rounded-2xl hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all mt-auto">
                + Adicionar Cartão
             </button>
           </div>
         ))}
       </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex flex-col items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
             <div className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl border border-gray-100 animate-scale-in my-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-gray-900 uppercase italic">Tarefa Kanban</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-gray-900 p-2"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-4">
                  <input type="text" placeholder="O que precisa ser feito?" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-gray-50 rounded-xl p-5 text-sm font-bold border-none focus:ring-2 focus:ring-brand-primary" />
                  <textarea placeholder="Detalhes da tarefa..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 rounded-xl p-5 text-sm font-medium border-none resize-none focus:ring-2 focus:ring-brand-primary h-32" />
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Progresso</label>
                       <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-gray-50 rounded-xl p-4 text-sm font-medium border-none focus:ring-2 focus:ring-brand-primary">
                          <option value="A Fazer">A Fazer</option>
                          <option value="Em Progresso">Em Progresso</option>
                          <option value="Concluído">Concluído</option>
                       </select>
                     </div>
                     <div>
                       <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Projeto Relacionado</label>
                       <select value={formData.project_id} onChange={e => setFormData({...formData, project_id: e.target.value})} className="w-full bg-gray-50 rounded-xl p-4 text-sm font-medium border-none focus:ring-2 focus:ring-brand-primary">
                          <option value="">Sem Projeto</option>
                          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                       </select>
                     </div>
                  </div>
                  <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                     {editingTask ? (
                        <button onClick={async () => { await supabaseService.deleteTask(editingTask.id); loadTasks(); setIsModalOpen(false); }} className="text-rose-500 font-black p-4 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"><Trash2 className="w-5 h-5" /></button>
                     ) : <div></div>}
                     <button onClick={handleSave} className="px-8 bg-brand-primary text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs shadow-lg shadow-brand-primary/30 hover:-translate-y-1 transition-all">
                        {editingTask ? 'Salvar Edição' : 'Criar Tarefa'}
                     </button>
                  </div>
                </div>
             </div>
          </div>
       )}
       {isFupModalOpen && fupTaskId && (
          <div className="fixed inset-0 z-[160] flex flex-col items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
             <div className="bg-white rounded-[3rem] p-0 max-w-xl w-full shadow-2xl border border-gray-100 animate-scale-in my-8 max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                   <div>
                     <h3 className="text-xl font-black text-gray-900 uppercase italic">Follow-up da Tarefa</h3>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Histórico e Checklist de Acompanhamento</p>
                   </div>
                   <button onClick={() => setIsFupModalOpen(false)} className="text-slate-400 hover:text-gray-900 p-2 bg-white rounded-xl shadow-sm border border-gray-100"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                   <TaskFollowUps taskId={fupTaskId} userId={user_id} />
                </div>
             </div>
          </div>
       )}
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
          placeholder="Resumo do follow-up..."
          className="w-full bg-white border-none rounded-xl p-4 text-xs font-bold focus:ring-2 focus:ring-brand-primary shadow-sm"
        />
        
        {/* New Checklist items builder */}
        <div className="space-y-2">
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
               placeholder="Adicionar item de checklist..."
               className="flex-1 bg-white border-none rounded-lg p-3 text-[10px] font-medium focus:ring-2 focus:ring-brand-primary shadow-sm"
               onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addChecklistItem())}
             />
             <button onClick={addChecklistItem} className="p-3 bg-white text-brand-primary rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
               <Plus className="w-3.5 h-3.5" />
             </button>
           </div>
        </div>

        <button 
          onClick={handleAdd}
          disabled={isLoading}
          className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
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
                    <p className="text-[11px] text-gray-900 font-black leading-relaxed">{fu.content}</p>
                    {fu.due_date && (
                       <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-rose-50 text-rose-500 rounded text-[8px] font-black uppercase tracking-tighter">
                          <Clock className="w-2.5 h-2.5" /> Prazo: {new Date(fu.due_date).toLocaleDateString('pt-BR')}
                       </span>
                    )}
                 </div>
                 <span className="text-[9px] font-bold text-slate-300 uppercase whitespace-nowrap">
                    {new Date(fu.created_at).toLocaleDateString('pt-BR')}
                 </span>
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
                  
                  <div className="space-y-1.5 mt-2">
                    {fu.checklist.map((item: any, idx: number) => (
                      <label key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-all border border-transparent hover:border-brand-primary/10">
                        <input 
                          type="checkbox" 
                          checked={item.done} 
                          onChange={() => toggleCheckItem(fu, idx)}
                          className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                        />
                        <span className={`text-[10px] font-bold flex-1 ${item.done ? 'text-slate-400 line-through' : 'text-gray-700'}`}>
                          {item.text}
                        </span>
                      </label>
                    ))}
                  </div>
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




import React, { useState } from 'react';
import { 
  LayoutGrid, Target, ListTodo, Calendar, 
  BarChart3, Plus, ChevronRight, 
  CheckCircle2, Clock, AlertCircle,
  TrendingUp, Users, Zap, Search,
  ArrowRight, Save, Trash2, Edit3,
  Lightbulb, Shield, HelpCircle,
  Briefcase, PieChart, Layers,
  Handshake, Globe, Coins
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabaseService } from '../services/supabaseService';
import { SectionLanding } from '../components/SectionLanding';
import { useAuth } from '../contexts/AuthContext';

type TabType = 'inicio' | 'swot' | 'smart' | 'canva' | 'projects';

export const ProjectManagement: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || 'user-123'; // Fallback to placeholder if user not loaded
  const [activeTab, setActiveTab] = useState<TabType>('inicio');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectStatus, setNewProjectStatus] = useState('A Fazer');
  const [newProjectPriority, setNewProjectPriority] = useState('Média');
  const [newProjectGoalId, setNewProjectGoalId] = useState('');
  const [smartGoals, setSmartGoals] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  React.useEffect(() => {
    if (!userId) return;
    supabaseService.getData('smart_goals', userId).then(d => setSmartGoals(d ? [d] : [])).catch(console.error);
    supabaseService.getProjects(userId).then(setProjects).catch(console.error);
  }, [userId]);

  const addProject = async () => {
    if (!newProjectName) return;
    try {
      await supabaseService.addProject({ 
        user_id: userId, 
        name: newProjectName, 
        description: newProjectDesc,
        status: newProjectStatus,
        priority: newProjectPriority,
        smart_goal_id: newProjectGoalId || null
      });
      setNewProjectName('');
      setNewProjectDesc('');
      setNewProjectStatus('A Fazer');
      setNewProjectPriority('Média');
      setNewProjectGoalId('');
      setIsNewProjectModalOpen(false);
      const updatedProjects = await supabaseService.getProjects(userId);
      setProjects(updatedProjects);
    } catch (error) {
      console.error(error);
    }
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
    { id: 'inicio', label: 'Início', icon: LayoutGrid },
    { id: 'projects', label: 'Projetos', icon: Briefcase },
    { id: 'swot', label: 'Matriz SWOT', icon: BarChart3 },
    { id: 'smart', label: 'Metas SMART', icon: Target },
    { id: 'canva', label: 'Business Canva', icon: Layers },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white italic uppercase tracking-tight">
            Gestão de <span className="text-brand-primary">Projetos</span>
          </h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">
            Estratégia e Execução em um só lugar
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsNewProjectModalOpen(true)}
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
              className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-gray-100 dark:border-zinc-800"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic">Novo Projeto</h3>
                <button onClick={() => setIsNewProjectModalOpen(false)} className="text-slate-400 hover:text-gray-900 dark:hover:text-white">
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome do Projeto</label>
                  <input type="text" value={newProjectName} onChange={e => setNewProjectName(e.target.value)} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-brand-primary transition-all" placeholder="Ex: Lançamento Produto X" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Descrição</label>
                  <textarea value={newProjectDesc} onChange={e => setNewProjectDesc(e.target.value)} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-brand-primary transition-all" placeholder="Breve resumo..." rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <select value={newProjectStatus} onChange={e => setNewProjectStatus(e.target.value)} className="bg-gray-50 dark:bg-zinc-800 border-none rounded-xl p-4 text-sm font-medium">
                        <option>A Fazer</option>
                        <option>Em Progresso</option>
                        <option>Concluído</option>
                    </select>
                    <select value={newProjectPriority} onChange={e => setNewProjectPriority(e.target.value)} className="bg-gray-50 dark:bg-zinc-800 border-none rounded-xl p-4 text-sm font-medium">
                        <option>Baixa</option>
                        <option>Média</option>
                        <option>Alta</option>
                    </select>
                </div>
                <select value={newProjectGoalId} onChange={e => setNewProjectGoalId(e.target.value)} className="w-full bg-gray-50 dark:bg-zinc-800 border-none rounded-xl p-4 text-sm font-medium">
                    <option value="">Vincular a uma Meta SMART (Opcional)</option>
                    {smartGoals.map((goal, i) => (
                        <option key={i} value={goal.id}>Meta {i + 1}</option>
                    ))}
                </select>
                <button 
                  onClick={addProject}
                  className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-primary/20"
                >
                  Criar Projeto
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
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20'
                : 'bg-white dark:bg-zinc-900 text-slate-400 dark:text-zinc-500 hover:bg-gray-50 dark:hover:bg-zinc-800 border border-gray-100 dark:border-zinc-800'
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
            {activeTab === 'inicio' && <HomeView setActiveTab={setActiveTab} />}
            {activeTab === 'swot' && <SWOTView />}
            {activeTab === 'smart' && <SMARTGoalsView />}
            {activeTab === 'canva' && <BusinessCanvaView />}
            {activeTab === 'projects' && <ProjectsView projects={projects} deleteProject={deleteProject} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- SUB-VIEWS ---

const HomeView = ({ setActiveTab }: { setActiveTab: (tab: TabType) => void }) => (
  <SectionLanding 
      title="Gestão de Projetos"
      subtitle="Gestão de Projetos"
      description="Esta página centraliza todas as ferramentas de gestão estratégica do seu negócio. Utilize as abas acima para navegar entre a Matriz SWOT, Metas SMART, Business Model Canva e a gestão de seus Projetos. Cada ferramenta foi desenhada para ajudar você a planejar, executar e acompanhar o sucesso das suas iniciativas."
      benefits={[
        "Planejamento estratégico integrado.",
        "Definição clara de metas alcançáveis.",
        "Modelagem de negócios visual.",
        "Execução e acompanhamento de projetos."
      ]}
      youtubeId="dQw4w9WgXcQ"
      ctaLabel="COMEÇAR AGORA"
      onStart={() => setActiveTab('projects')}
      icon={Briefcase}
      accentColor="brand"
  />
);

// --- SUB-VIEWS ---

const ProjectsView = ({ projects, deleteProject }: { projects: any[], deleteProject: (id: string) => void }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 rounded-[3rem] p-12 border border-gray-100 dark:border-zinc-800 shadow-sm">
      <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight mb-8">Meus Projetos</h3>
      
      <div className="space-y-4">
        {projects.map(p => (
          <div key={p.id} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-zinc-800 rounded-2xl">
            <div>
              <h4 className="font-black text-gray-900 dark:text-white">{p.name}</h4>
              <p className="text-sm text-slate-400">{p.description}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-[10px] font-bold uppercase bg-white dark:bg-zinc-900 px-2 py-1 rounded-lg">{p.status}</span>
                <span className="text-[10px] font-bold uppercase bg-white dark:bg-zinc-900 px-2 py-1 rounded-lg">{p.priority}</span>
              </div>
            </div>
            <button onClick={() => deleteProject(p.id)} className="text-rose-500 hover:text-rose-600"><Trash2 className="w-5 h-5" /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const BusinessCanvaView = () => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const userId = user?.id || 'user-123';

  React.useEffect(() => {
    if (!userId) return;
    supabaseService.getData('business_canva', userId).then(d => setData(d || {})).catch(console.error);
  }, [userId]);

  const saveData = async () => {
    setLoading(true);
    try {
      await supabaseService.saveData('business_canva', userId, data);
      alert('Salvo com sucesso!');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (key: string, value: string) => {
    setData({ ...data, [key]: value });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 rounded-[3rem] p-12 border border-gray-100 dark:border-zinc-800 shadow-sm">
      <div className="text-center space-y-4 mb-12">
        <div className="w-20 h-20 bg-pink-50 dark:bg-pink-950/30 text-pink-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <Layers className="w-10 h-10" />
        </div>
        <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight">Business Model Canva</h3>
        <p className="text-slate-400 text-sm font-medium">Modelagem Visual: Defina os pilares do seu modelo de negócio.</p>
      </div>

      <div className="space-y-8">
        {[
          { key: 'partners', icon: Handshake, title: 'Parceiros Chave', desc: 'Quem ajuda você a entregar valor?', placeholder: 'Ex: Fornecedores, parceiros de tecnologia...' },
          { key: 'activities', icon: Zap, title: 'Atividades Chave', desc: 'O que seu negócio faz de mais importante?', placeholder: 'Ex: Desenvolvimento de software, marketing...' },
          { key: 'value', icon: Lightbulb, title: 'Proposta de Valor', desc: 'Que problema você resolve para o cliente?', placeholder: 'Ex: Entrega rápida, preço justo, exclusividade...' },
          { key: 'relationships', icon: Users, title: 'Relacionamento', desc: 'Como você interage com seus clientes?', placeholder: 'Ex: Atendimento VIP, redes sociais, suporte 24h...' },
          { key: 'segments', icon: Search, title: 'Segmentos de Clientes', desc: 'Para quem você está criando valor?', placeholder: 'Ex: Pequenos empreendedores, jovens de 18-25 anos...' },
          { key: 'resources', icon: Shield, title: 'Recursos Chave', desc: 'O que você precisa para operar?', placeholder: 'Ex: Servidores, equipe qualificada, capital...' },
          { key: 'channels', icon: Globe, title: 'Canais', desc: 'Como seus clientes conhecem seu produto?', placeholder: 'Ex: Instagram, WhatsApp, site oficial...' },
          { key: 'costs', icon: PieChart, title: 'Estrutura de Custos', desc: 'Quais são os maiores gastos?', placeholder: 'Ex: Salários, marketing, infraestrutura...' },
          { key: 'revenue', icon: Coins, title: 'Fontes de Receita', desc: 'Como seu negócio ganha dinheiro?', placeholder: 'Ex: Assinaturas, venda direta, publicidade...' }
        ].map((item, i) => (
          <div key={i} className="space-y-4 group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">{item.title}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.desc}</p>
              </div>
            </div>
            <textarea 
              className="w-full bg-gray-50 dark:bg-zinc-800/50 border-none rounded-2xl p-6 text-sm font-medium focus:ring-2 focus:ring-pink-500 transition-all resize-none"
              placeholder={item.placeholder}
              rows={2}
              value={data[item.key] || ''}
              onChange={e => updateField(item.key, e.target.value)}
            />
          </div>
        ))}

        <button onClick={saveData} disabled={loading} className="w-full py-6 bg-brand-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-primary/20 disabled:opacity-50">
          {loading ? 'Salvando...' : 'Salvar Business Canva'}
        </button>
      </div>
    </div>
  );
};

const SWOTView = () => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const userId = user?.id || 'user-123';

  React.useEffect(() => {
    if (!userId) return;
    supabaseService.getData('swot', userId).then(d => setData(d || {})).catch(console.error);
  }, [userId]);

  const saveData = async () => {
    setLoading(true);
    try {
      await supabaseService.saveData('swot', userId, data);
      alert('Salvo com sucesso!');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (key: string, value: string) => {
    setData({ ...data, [key]: value });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 rounded-[3rem] p-12 border border-gray-100 dark:border-zinc-800 shadow-sm">
      <div className="text-center space-y-4 mb-12">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-950/30 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <BarChart3 className="w-10 h-10" />
        </div>
        <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight">Matriz SWOT</h3>
        <p className="text-slate-400 text-sm font-medium">Análise Estratégica: Forças, Fraquezas, Oportunidades e Ameaças.</p>
      </div>

      <div className="space-y-8">
        {[
          { key: 'strengths', letter: 'S', title: 'Forças (Strengths)', desc: 'Vantagens internas do seu negócio.', placeholder: 'Ex: Equipe altamente qualificada, marca consolidada, tecnologia proprietária...' },
          { key: 'weaknesses', letter: 'W', title: 'Fraquezas (Weaknesses)', desc: 'Pontos de melhoria interna.', placeholder: 'Ex: Baixo orçamento de marketing, dependência de poucos fornecedores...' },
          { key: 'opportunities', letter: 'O', title: 'Oportunidades (Opportunities)', desc: 'Fatores externos positivos.', placeholder: 'Ex: Expansão para o mercado internacional, novas parcerias estratégicas...' },
          { key: 'threats', letter: 'T', title: 'Ameaças (Threats)', desc: 'Fatores externos negativos.', placeholder: 'Ex: Novos concorrentes agressivos, mudanças na legislação...' }
        ].map((step, i) => (
          <div key={i} className="space-y-4 group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl flex items-center justify-center font-black text-xl italic group-hover:scale-110 transition-transform">{step.letter}</div>
              <div>
                <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">{step.title}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{step.desc}</p>
              </div>
            </div>
            <textarea 
              className="w-full bg-gray-50 dark:bg-zinc-800/50 border-none rounded-2xl p-6 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              placeholder={step.placeholder}
              rows={3}
              value={data[step.key] || ''}
              onChange={e => updateField(step.key, e.target.value)}
            />
          </div>
        ))}

        <button onClick={saveData} disabled={loading} className="w-full py-6 bg-brand-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-primary/20 disabled:opacity-50">
          {loading ? 'Salvando...' : 'Salvar Análise SWOT'}
        </button>
      </div>
    </div>
  );
};

const SMARTGoalsView = () => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const userId = user?.id || 'user-123';

  React.useEffect(() => {
    if (!userId) return;
    supabaseService.getData('smart_goals', userId).then(d => setData(d || {})).catch(console.error);
  }, [userId]);

  const saveData = async () => {
    setLoading(true);
    try {
      await supabaseService.saveData('smart_goals', userId, data);
      alert('Salvo com sucesso!');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (key: string, value: string) => {
    setData({ ...data, [key]: value });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 rounded-[3rem] p-12 border border-gray-100 dark:border-zinc-800 shadow-sm">
      <div className="text-center space-y-4 mb-12">
        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <Target className="w-10 h-10" />
        </div>
        <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tight">Criar Meta SMART</h3>
        <p className="text-slate-400 text-sm font-medium">Transforme seus desejos em objetivos alcançáveis.</p>
      </div>

      <div className="space-y-8">
        {[
          { key: 'specific', letter: 'S', title: 'Específica (Specific)', desc: 'O que exatamente você quer alcançar?', placeholder: 'Ex: Aumentar o faturamento em 20%...' },
          { key: 'measurable', letter: 'M', title: 'Mensurável (Measurable)', desc: 'Como você vai medir o progresso?', placeholder: 'Ex: Através do relatório mensal do CRM...' },
          { key: 'attainable', letter: 'A', title: 'Atingível (Attainable)', desc: 'Você tem os recursos necessários?', placeholder: 'Ex: Sim, com a nova equipe de vendas...' },
          { key: 'relevant', letter: 'R', title: 'Relevante (Relevant)', desc: 'Por que esta meta é importante agora?', placeholder: 'Ex: Para garantir o fluxo de caixa do Q4...' },
          { key: 'timebound', letter: 'T', title: 'Temporal (Time-bound)', desc: 'Qual é o prazo final?', placeholder: 'Ex: Até 31 de Dezembro de 2024.' }
        ].map((step, i) => (
          <div key={i} className="space-y-4 group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl flex items-center justify-center font-black text-xl italic group-hover:scale-110 transition-transform">{step.letter}</div>
              <div>
                <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">{step.title}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{step.desc}</p>
              </div>
            </div>
            <textarea 
              className="w-full bg-gray-50 dark:bg-zinc-800/50 border-none rounded-2xl p-6 text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
              placeholder={step.placeholder}
              rows={2}
              value={data[step.key] || ''}
              onChange={e => updateField(step.key, e.target.value)}
            />
          </div>
        ))}

        <button onClick={saveData} disabled={loading} className="w-full py-6 bg-brand-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-primary/20 disabled:opacity-50">
          {loading ? 'Salvando...' : 'Validar e Salvar Meta SMART'}
        </button>
      </div>
    </div>
  );
};

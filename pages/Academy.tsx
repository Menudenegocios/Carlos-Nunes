
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockBackend } from '../services/mockBackend';
import { 
  Play, Star, X, Award, CheckCircle, GraduationCap, 
  Video, Map, Sparkles, TrendingUp, BookOpen, 
  Smartphone, MessageSquare, Target, ChevronRight,
  Monitor, Layers, Zap, Clock, Lock, ArrowRight,
  HelpCircle, PlayCircle, Check, AlertCircle, RefreshCw,
  LayoutDashboard, Package, Trophy, Briefcase, Bot, Wand2, Brain, Rocket, MessageCircle,
  Flame, MousePointer2
} from 'lucide-react';

interface Course {
  id: number;
  title: string;
  instructor: string;
  category: 'Marketing' | 'Vendas' | 'Gestão' | 'Finanças';
  duration: string;
  rating: number;
  students: number;
  image: string;
  description: string;
  quiz?: Quiz;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

interface Quiz {
  questions: QuizQuestion[];
}

const GENERIC_QUIZ: Quiz = {
  questions: [
    {
      question: "Qual o foco principal do treinamento assistido?",
      options: ["Escalar vendas sem lucro", "Posicionamento estratégico e conversão", "Apenas ganhar seguidores", "Não usar automação"],
      correct: 1
    },
    {
      question: "No ecossistema Menu ADS, o que gera pontos no Clube?",
      options: ["Apenas assistir aulas", "Atividades de engajamento e missões concluídas", "Não há sistema de pontos", "Apenas indicações"],
      correct: 1
    },
    {
      question: "Qual o papel da IA nos negócios locais?",
      options: ["Substituir o dono", "Acelerar processos criativos e scripts", "Aumentar custos fixos", "Nenhuma das anteriores"],
      correct: 1
    }
  ]
};

const MOCK_COURSES: Course[] = [
  { id: 1, title: 'Tráfego Pago para Negócios Locais', instructor: 'Lucas Mendes', category: 'Marketing', duration: '3h 15m', rating: 4.9, students: 2500, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', description: 'Aprenda a investir em anúncios no Instagram e Google focados no seu bairro.', quiz: GENERIC_QUIZ },
  { id: 2, title: 'Dominação de Instagram Local', instructor: 'Ana Silva', category: 'Marketing', duration: '2h 30m', rating: 4.8, students: 1240, image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800', description: 'Transforme seu perfil em uma máquina de atração de clientes do seu bairro.', quiz: GENERIC_QUIZ },
  { id: 3, title: 'Fechamento de Vendas High Ticket', instructor: 'Juliana Paes', category: 'Vendas', duration: '1h 45m', rating: 4.7, students: 2100, image: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&q=80&w=800', description: 'Scripts e gatilhos mentais para vender serviços e produtos de maior valor.', quiz: GENERIC_QUIZ },
  { id: 4, title: 'Finanças Lucrativas', instructor: 'Carlos Eduardo', category: 'Finanças', duration: '4h 15m', rating: 4.9, students: 850, image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800', description: 'Organize seu caixa, controle gastos e entenda a margem real do seu negócio.', quiz: GENERIC_QUIZ },
];

const TRILHA_STEPS = [
  { id: 1, title: 'Primeiros Passos e Configuração', status: 'completed', icon: Rocket, desc: 'Complete seu perfil e entenda as bases do Menu ADS.' },
  { id: 2, title: 'Construção da Vitrine de Ouro', status: 'current', icon: Monitor, desc: 'Crie seu catálogo e bio digital focados em alta conversão.' },
  { id: 3, title: 'Estratégia de Atração Local', status: 'locked', icon: Target, desc: 'Como atrair os primeiros leads qualificados do seu bairro.' },
  { id: 4, title: 'Automatização de Atendimento', status: 'locked', icon: Layers, desc: 'Escalando seu negócio com ferramentas de CRM e IA.' },
  { id: 5, title: 'Fidelização e Expansão', status: 'locked', icon: Award, desc: 'Crie um clube de membros e ganhe indicações constantes.' },
];

const TUTORIAIS = [
  { title: 'Personalizando sua Bio Digital', duration: '3:45', icon: Smartphone, desc: 'Como usar o Estúdio de Design para criar um link profissional.' },
  { title: 'Gestão de Catálogo Pro', duration: '5:10', icon: Package, desc: 'Cadastre produtos, preços e organize categorias rapidamente.' },
  { title: 'Usando o CRM & Vendas', duration: '6:30', icon: LayoutDashboard, desc: 'Mova seus leads no funil e nunca perca um agendamento.' },
  { title: 'Cupons e Fidelidade', duration: '4:20', icon: Trophy, desc: 'Como criar campanhas de desconto para atrair novos clientes.' },
];

const AI_AGENTS = [
  {
    id: 'script-vendas',
    name: 'Script de Vendas',
    role: 'Mestre da Conversão',
    desc: 'Cria roteiros persuasivos para WhatsApp e abordagens diretas que fecham negócio.',
    icon: MessageSquare,
    color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400',
    link: 'https://chatgpt.com/g/g-68459990b2088191b098ebd25fd61558-agente-script-de-ventas/c/6941761e-c880-8332-b27c-3914bfc4e20f'
  },
  {
    id: 'follow-up',
    name: 'Agente Follow-up',
    role: 'Recuperador de Vendas',
    desc: 'Não perca mais leads. Scripts e lembretes para manter o cliente aquecido após o contato.',
    icon: RefreshCw,
    color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
    link: 'https://chatgpt.com/g/g-67674b9476688191b428941096db4464-agente-follow-up'
  },
  {
    id: 'pitch-master',
    name: 'Pitch Master',
    role: 'Especialista em Pitch',
    desc: 'Transforme sua ideia em um discurso de vendas matador para investidores ou clientes.',
    icon: Trophy,
    color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
    link: 'https://chatgpt.com/g/g-676761e39bc08191868b0d801dae75e9-pitchmaster'
  },
  {
    id: 'vendas-pro',
    name: 'Vendas Mais Pro',
    role: 'Acelerador de Lucro',
    desc: 'Técnicas avançadas de cross-sell e up-sell para aumentar o ticket médio do seu negócio.',
    icon: Flame,
    color: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400',
    link: 'https://chatgpt.com/g/g-67676238cdc88191a20b8bc0a15240f1-venda-mais-pro'
  }
];

export const Academy: React.FC = () => {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState<'treinamentos' | 'trilha' | 'tutoriais' | 'agentes'>('treinamentos');
  const [trainingCategory, setTrainingCategory] = useState<string>('Todos');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Quiz State
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<'success' | 'failed' | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);

  const categories = ['Todos', 'Marketing', 'Vendas', 'Gestão', 'Finanças'];
  const filteredCourses = trainingCategory === 'Todos' 
    ? MOCK_COURSES 
    : MOCK_COURSES.filter(c => c.category === trainingCategory);

  const startQuiz = () => {
    setQuizMode(true);
    setCurrentQuestionIndex(0);
    setQuizAnswers([]);
    setQuizResult(null);
  };

  const handleAnswerSelect = (optionIdx: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[currentQuestionIndex] = optionIdx;
    setQuizAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (selectedCourse?.quiz && currentQuestionIndex < selectedCourse.quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    if (!selectedCourse?.quiz || !user) return;
    
    const correctCount = quizAnswers.filter((ans, idx) => ans === selectedCourse.quiz!.questions[idx].correct).length;
    const isPerfect = correctCount === selectedCourse.quiz.questions.length;

    if (isPerfect) {
      setIsFinishing(true);
      setQuizResult('success');
      try {
        const updatedUser = await mockBackend.completeAcademyQuiz(user.id, selectedCourse.title);
        login(updatedUser, localStorage.getItem('menu_token') || '');
      } finally {
        setIsFinishing(false);
      }
    } else {
      setQuizResult('failed');
    }
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setQuizMode(false);
    setQuizResult(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 pt-4 px-4">
      
      {/* Academy Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
               <GraduationCap className="h-10 w-10 text-yellow-400" />
            </div>
            <div>
               <h1 className="text-3xl md:text-5xl font-black tracking-tight">Menu Academy</h1>
               <p className="text-indigo-200 text-lg font-medium">Capacitação de elite para empreendedores locais.</p>
            </div>
          </div>

          <div className="flex p-1.5 bg-black/20 backdrop-blur-md rounded-[1.8rem] w-fit border border-white/10 mt-8 overflow-x-auto scrollbar-hide max-w-full">
            <button onClick={() => setActiveTab('treinamentos')} className={`flex items-center gap-3 px-8 py-3 rounded-[1.4rem] font-black text-xs transition-all duration-300 whitespace-nowrap ${activeTab === 'treinamentos' ? 'bg-white text-indigo-900 shadow-xl scale-105' : 'text-indigo-100 hover:bg-white/10'}`}>
              <Video className="w-4 h-4" /> TREINAMENTOS
            </button>
            <button onClick={() => setActiveTab('trilha')} className={`flex items-center gap-3 px-8 py-3 rounded-[1.4rem] font-black text-xs transition-all duration-300 whitespace-nowrap ${activeTab === 'trilha' ? 'bg-white text-indigo-900 shadow-xl scale-105' : 'text-indigo-100 hover:bg-white/10'}`}>
              <Map className="w-4 h-4" /> TRILHA
            </button>
            <button onClick={() => setActiveTab('agentes')} className={`flex items-center gap-3 px-8 py-3 rounded-[1.4rem] font-black text-xs transition-all duration-300 whitespace-nowrap ${activeTab === 'agentes' ? 'bg-white text-indigo-900 shadow-xl scale-105' : 'text-indigo-100 hover:bg-white/10'}`}>
              <Bot className="w-4 h-4" /> AGENTES IA
            </button>
            <button onClick={() => setActiveTab('tutoriais')} className={`flex items-center gap-3 px-8 py-3 rounded-[1.4rem] font-black text-xs transition-all duration-300 whitespace-nowrap ${activeTab === 'tutoriais' ? 'bg-white text-indigo-900 shadow-xl scale-105' : 'text-indigo-100 hover:bg-white/10'}`}>
              <HelpCircle className="w-4 h-4" /> TUTORIAIS
            </button>
          </div>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      <div className="animate-[fade-in_0.4s_ease-out]">
        {activeTab === 'treinamentos' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div className="flex items-center gap-3 px-2">
                 <div className="w-1.5 h-8 bg-indigo-600 rounded-full"></div>
                 <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Habilidades para o Sucesso</h2>
               </div>
               <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 px-2">
                 {categories.map(cat => (
                   <button key={cat} onClick={() => setTrainingCategory(cat)} className={`px-6 py-2.5 rounded-full text-xs font-black transition-all border whitespace-nowrap ${trainingCategory === cat ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg scale-105' : 'bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-800 hover:border-indigo-200 hover:text-indigo-600'}`}>
                     {cat}
                   </button>
                 ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map(course => (
                <div key={course.id} onClick={() => setSelectedCourse(course)} className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer flex flex-col h-full">
                  <div className="relative h-56 overflow-hidden">
                    <img src={course.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={course.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center text-white">
                       <span className="bg-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-400/50">{course.category}</span>
                       <div className="flex items-center gap-1.5 text-xs font-bold bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg">
                         <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" /> {course.rating.toFixed(1)}
                       </div>
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight mb-3 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                    <p className="text-gray-500 dark:text-slate-400 text-sm mb-8 line-clamp-2 font-medium leading-relaxed">{course.description}</p>
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50 dark:border-slate-800">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                             <Play className="w-4 h-4 fill-current" />
                          </div>
                          <span className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.1em]">{course.duration}</span>
                       </div>
                       <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                         Assistir <ArrowRight className="w-4 h-4" />
                       </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'trilha' && (
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-16 border border-gray-100 dark:border-slate-800 shadow-xl relative overflow-hidden">
             <div className="max-w-2xl mb-16">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4">
                  <TrendingUp className="w-4 h-4" /> Jornada Guiada
               </div>
               <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Seu Caminho para o Sucesso</h2>
               <p className="text-gray-500 dark:text-slate-400 text-lg font-medium leading-relaxed">Não estude de forma aleatória. Siga o caminho validado que leva do primeiro acesso ao faturamento diamante no Menu ADS.</p>
             </div>
             <div className="space-y-0 relative">
                <div className="absolute left-[31px] top-8 bottom-8 w-1 bg-gray-100 dark:bg-slate-800 -z-10"></div>
                {TRILHA_STEPS.map((step) => (
                  <div key={step.id} className={`flex gap-10 items-start pb-16 last:pb-0 group ${step.status === 'locked' ? 'opacity-40' : ''}`}>
                     <div className={`w-16 h-16 rounded-[1.6rem] flex items-center justify-center flex-shrink-0 transition-all duration-700 border-4 border-white dark:border-slate-800 shadow-2xl relative z-10 ${step.status === 'completed' ? 'bg-emerald-500 text-white' : step.status === 'current' ? 'bg-indigo-600 text-white ring-8 ring-indigo-50 dark:ring-indigo-900/20 scale-110' : 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-600'}`}>
                        {step.status === 'completed' ? <CheckCircle className="w-8 h-8" /> : <step.icon className={`w-7 h-7 ${step.status === 'current' ? 'animate-pulse' : ''}`} />}
                        <div className="absolute -left-12 text-gray-300 dark:text-slate-800 font-black text-3xl opacity-20 group-hover:opacity-40 transition-opacity">0{step.id}</div>
                     </div>
                     <div className="pt-2">
                        <div className="flex items-center gap-3 mb-2">
                           <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${step.status === 'current' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}>ETAPA {step.id}</span>
                           {step.status === 'current' && <span className="bg-indigo-600 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg animate-bounce">Ação Pendente</span>}
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2">{step.title}</h3>
                        <p className="text-gray-500 dark:text-slate-400 text-base font-medium max-w-xl leading-relaxed">{step.desc}</p>
                        {step.status === 'current' && (
                           <button className="mt-8 flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-[1.4rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 hover:-translate-y-1 transition-all">Começar Agora <ChevronRight className="w-4 h-4" /></button>
                        )}
                        {step.status === 'locked' && (
                           <div className="mt-4 flex items-center gap-2 text-gray-400 dark:text-slate-600 text-xs font-bold uppercase tracking-widest"><Lock className="w-4 h-4" /> Bloqueado até concluir etapa anterior</div>
                        )}
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'agentes' && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <div className="max-w-2xl px-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4">
                <Brain className="w-4 h-4" /> Consultoria Inteligente
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">Equipe Comercial IA</h2>
              <p className="text-gray-500 dark:text-slate-400 text-lg font-medium leading-relaxed">Acesse especialistas treinados para acelerar cada fase do seu processo de vendas.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
              {AI_AGENTS.map((agent) => (
                <div key={agent.id} className="group bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-indigo-500/40 transition-all flex flex-col sm:flex-row gap-8">
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] ${agent.color} flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-110 shadow-inner`}>
                    <agent.icon className="w-10 h-10 sm:w-12 sm:h-12" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="mb-4">
                      <h4 className="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-1">{agent.name}</h4>
                      <p className={`text-[10px] font-black uppercase tracking-widest opacity-60`}>{agent.role}</p>
                    </div>
                    <p className="text-gray-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-8 flex-1">
                      {agent.desc}
                    </p>
                    <a 
                      href={agent.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-fit flex items-center gap-3 bg-gray-950 dark:bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl group-hover:bg-indigo-600 transition-all active:scale-95"
                    >
                      <MousePointer2 className="w-4 h-4" /> ABRIR CONSULTORIA
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-900 dark:bg-indigo-950 rounded-[3.5rem] p-12 text-center text-white relative overflow-hidden shadow-2xl mx-4">
              <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <Bot className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-3xl md:text-4xl font-black">Quer uma IA Exclusiva?</h3>
                <p className="text-indigo-200 max-w-xl mx-auto font-medium text-lg">No plano Diamante, desenvolvemos um agente treinado especificamente com a voz da sua marca e seu catálogo de produtos.</p>
                <button className="bg-white text-gray-900 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center gap-2 mx-auto">
                  UPGRADE PARA DIAMANTE <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute top-0 right-0 p-32 bg-indigo-500 opacity-10 rounded-full blur-[60px] pointer-events-none"></div>
            </div>
          </div>
        )}

        {activeTab === 'tutoriais' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="max-w-2xl px-2">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4"><PlayCircle className="w-4 h-4" /> Central Técnica</div>
               <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Domine a Plataforma</h2>
               <p className="text-gray-500 dark:text-slate-400 text-lg font-medium leading-relaxed">Vídeos diretos ao ponto para você configurar suas ferramentas em poucos minutos.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
              {TUTORIAIS.map((tut, idx) => (
                <div key={idx} className="group bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all flex items-center gap-6">
                   <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all text-gray-400"><tut.icon className="w-10 h-10" /></div>
                   <div className="flex-1 min-w-0">
                      <h4 className="font-black text-gray-900 dark:text-white text-xl leading-tight mb-2 truncate">{tut.title}</h4>
                      <p className="text-sm text-gray-400 dark:text-slate-500 font-medium line-clamp-2 mb-4 leading-relaxed">{tut.desc}</p>
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {tut.duration}</span>
                         <button className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm"><Play className="w-5 h-5 fill-current" /></button>
                   </div>
                </div>
              </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Course & Quiz Modal (TREINAMENTOS) */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={closeModal}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden animate-[scale-in_0.3s_ease-out] flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Modal Left: Video Area */}
            <div className={`w-full md:w-3/5 aspect-video md:aspect-auto relative group overflow-hidden transition-all duration-700 ${quizResult === 'success' ? 'bg-emerald-600' : 'bg-gray-900'}`}>
               {!quizMode ? (
                 <>
                   <img src={selectedCourse.image} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="Course Thumbnail" />
                   <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center cursor-pointer hover:scale-110 hover:bg-white/30 transition-all border border-white/40 shadow-2xl group">
                       <Play className="w-10 h-10 fill-white ml-2 transition-transform group-hover:scale-110" />
                     </div>
                   </div>
                   <div className="absolute bottom-8 left-8 right-8">
                      <span className="text-[10px] font-black text-white bg-indigo-600/80 backdrop-blur-md px-3 py-1 rounded-lg uppercase tracking-widest mb-3 inline-block">{selectedCourse.category}</span>
                      <h3 className="text-3xl font-black text-white leading-tight shadow-sm">{selectedCourse.title}</h3>
                   </div>
                 </>
               ) : quizResult === 'success' ? (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-10 text-center space-y-6">
                    <div className="w-32 h-32 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center animate-bounce shadow-2xl border border-white/30">
                       <Award className="w-16 h-16 text-yellow-300" />
                    </div>
                    <div className="space-y-2">
                       <h2 className="text-4xl font-black uppercase tracking-tight">Conquista Desbloqueada!</h2>
                       <p className="text-emerald-100 font-medium text-lg">Você provou ser um mestre em {selectedCourse.category}.</p>
                    </div>
                    <div className="bg-black/20 backdrop-blur-md px-8 py-4 rounded-[2rem] border border-white/10 flex items-center gap-4">
                       <div className="p-3 bg-yellow-400 rounded-2xl"><Zap className="w-6 h-6 text-black fill-current" /></div>
                       <div className="text-left">
                          <p className="text-[10px] font-black text-yellow-300 uppercase tracking-widest">Recompensa ADS</p>
                          <p className="text-2xl font-black">+20 PONTOS</p>
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-10 bg-indigo-900">
                    <div className="text-center space-y-4">
                        <Sparkles className="w-12 h-12 text-yellow-300 mx-auto animate-pulse" />
                        <h3 className="text-3xl font-black uppercase">Quiz de Conquista</h3>
                        <p className="text-indigo-200 font-medium">Responda corretamente para ganhar 20 pontos no Clube ADS.</p>
                    </div>
                    <div className="mt-12 w-full max-w-sm">
                       <div className="flex justify-between items-end mb-4">
                          <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Progresso do Quiz</span>
                          <span className="text-xs font-bold">{currentQuestionIndex + 1} de {selectedCourse.quiz?.questions.length}</span>
                       </div>
                       <div className="h-1.5 w-full bg-indigo-950 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-400 transition-all duration-500" 
                            style={{ width: `${((currentQuestionIndex + 1) / (selectedCourse.quiz?.questions.length || 1)) * 100}%` }}
                          ></div>
                       </div>
                    </div>
                 </div>
               )}
            </div>

            {/* Modal Right: Content */}
            <div className="flex-1 p-8 md:p-12 flex flex-col bg-gray-50 dark:bg-slate-800 overflow-y-auto">
              {!quizMode ? (
                <>
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400"><Video className="w-6 h-6" /></div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest">Treinamento</p>
                        <p className="text-gray-900 dark:text-white font-bold">Módulo Único</p>
                      </div>
                    </div>
                    <button onClick={closeModal} className="p-3 bg-white dark:bg-slate-700 border border-gray-100 dark:border-slate-600 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors shadow-sm"><X className="w-6 h-6 text-gray-400" /></button>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-gray-900 dark:text-white text-xl mb-4">Sobre este treinamento</h4>
                    <p className="text-gray-600 dark:text-slate-400 text-base leading-relaxed font-medium mb-10">{selectedCourse.description}</p>
                    <div className="space-y-4">
                       <div className="flex items-center gap-3 p-5 bg-white dark:bg-slate-700 rounded-2xl border border-indigo-200 dark:border-indigo-900/30 shadow-md">
                          <div className="w-3 h-3 rounded-full bg-indigo-600 animate-pulse"></div>
                          <span className="text-sm font-black text-indigo-700 dark:text-indigo-300">Aula Completa: {selectedCourse.title}</span>
                          <Play className="w-4 h-4 ml-2 fill-indigo-600 text-indigo-600" />
                          <span className="ml-auto text-[10px] font-black text-gray-400 dark:text-slate-500">{selectedCourse.duration}</span>
                       </div>
                    </div>
                  </div>
                  <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-700">
                    <button onClick={startQuiz} className="w-full bg-indigo-600 text-white py-5 rounded-[1.4rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                      {/* Fixed: replaced CircleCheck with already imported CheckCircle */}
                      <CheckCircle className="w-5 h-5" /> Fazer Quiz de Conquista
                    </button>
                    <p className="text-center text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mt-4">Ganhe +20 Pontos ao concluir</p>
                  </div>
                </>
              ) : quizResult === 'success' ? (
                <div className="flex flex-col h-full justify-center items-center text-center space-y-8">
                   <div className="space-y-2">
                      <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase">Excelente Trabalho!</h4>
                      <p className="text-gray-500 dark:text-slate-400 font-medium">Você concluiu este módulo com maestria.</p>
                   </div>
                   <button onClick={closeModal} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all">FINALIZAR MÓDULO</button>
                </div>
              ) : quizResult === 'failed' ? (
                <div className="flex flex-col h-full justify-center items-center text-center space-y-8">
                   <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950/30 rounded-full flex items-center justify-center text-rose-500 mb-2">
                      <AlertCircle className="w-10 h-10" />
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-2xl font-black text-gray-900 dark:text-white uppercase">Quase lá</h4>
                      <p className="text-gray-500 dark:text-slate-400 font-medium">Revise a aula e tente o quiz novamente para ganhar seus pontos.</p>
                   </div>
                   <button onClick={startQuiz} className="w-full bg-gray-900 dark:bg-slate-700 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-black transition-all">RECOMERÇAR QUIZ</button>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                   <div className="flex justify-between items-center mb-10">
                      <h4 className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">Pergunta {currentQuestionIndex + 1} de {selectedCourse.quiz?.questions.length}</h4>
                      <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                   </div>
                   
                   <div className="flex-1 space-y-8">
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                        {selectedCourse.quiz?.questions[currentQuestionIndex].question}
                      </h3>
                      
                      <div className="space-y-3">
                         {selectedCourse.quiz?.questions[currentQuestionIndex].options.map((opt, idx) => (
                            <button 
                              key={idx}
                              onClick={() => handleAnswerSelect(idx)}
                              className={`w-full text-left p-5 rounded-2xl border-2 transition-all font-bold text-sm flex items-center gap-4 ${
                                quizAnswers[currentQuestionIndex] === idx 
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl translate-x-2' 
                                : 'bg-white dark:bg-slate-700 border-gray-100 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:border-indigo-200'
                              }`}
                            >
                               <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${quizAnswers[currentQuestionIndex] === idx ? 'bg-white text-indigo-600' : 'bg-gray-100 dark:bg-slate-600 text-gray-400'}`}>
                                  {String.fromCharCode(65 + idx)}
                               </div>
                               {opt}
                            </button>
                         ))}
                      </div>
                   </div>

                   <div className="mt-12">
                      <button 
                        disabled={quizAnswers[currentQuestionIndex] === undefined || isFinishing}
                        onClick={nextQuestion}
                        className="w-full bg-indigo-600 text-white py-5 rounded-[1.4rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 disabled:bg-gray-200 dark:disabled:bg-slate-700 disabled:text-gray-400 transition-all flex items-center justify-center gap-3"
                      >
                         {currentQuestionIndex < (selectedCourse.quiz?.questions.length || 0) - 1 ? (
                           <>PRÓXIMA PERGUNTA <ChevronRight className="w-5 h-5" /></>
                         ) : (
                           isFinishing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <>FINALIZAR E RESGATAR PONTOS <Check className="w-5 h-5" /></>
                         )}
                      </button>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

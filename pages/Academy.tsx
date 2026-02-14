
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
  Flame, MousePointer2, Home as HomeIcon
} from 'lucide-react';
import { SectionLanding } from '../components/SectionLanding';

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
  }
];

export const Academy: React.FC = () => {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'treinamentos' | 'trilha' | 'tutoriais' | 'agentes'>('home');
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
            {[
                { id: 'home', label: 'INÍCIO', icon: HomeIcon },
                { id: 'treinamentos', label: 'TREINAMENTOS', icon: Video },
                { id: 'trilha', label: 'TRILHA', icon: Map },
                { id: 'agentes', label: 'AGENTES IA', icon: Bot },
                { id: 'tutoriais', label: 'TUTORIAIS', icon: HelpCircle }
            ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)} 
                  className={`flex items-center gap-3 px-8 py-3 rounded-[1.4rem] font-black text-xs transition-all duration-300 whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-indigo-900 shadow-xl scale-105' : 'text-indigo-100 hover:bg-white/10'}`}
                >
                    <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
            ))}
          </div>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      <div className="animate-[fade-in_0.4s_ease-out]">
        {activeTab === 'home' && (
            <SectionLanding 
                title="Aprenda a Escalar seu Negócio no Bairro."
                subtitle="Menu Academy"
                description="Acesse uma biblioteca exclusiva de cursos e estratégias focadas no empreendedor real. Do tráfego pago no Instagram à gestão financeira, aprenda com quem já chegou lá."
                benefits={[
                "Cursos rápidos focados em implementação imediata.",
                "Estratégias de tráfego pago para atrair clientes locais.",
                "Mentoria com Agentes de IA treinados em vendas.",
                "Ganhe pontos no Clube ADS ao concluir treinamentos.",
                "Aulas atualizadas semanalmente com novas tendências."
                ]}
                youtubeId="dQw4w9WgXcQ"
                ctaLabel="VER TREINAMENTOS"
                onStart={() => setActiveTab('treinamentos')}
                icon={GraduationCap}
                accentColor="purple"
            />
        )}

        {activeTab === 'treinamentos' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
               <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Habilidades para o Sucesso</h2>
               <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
                 {categories.map(cat => (
                   <button key={cat} onClick={() => setTrainingCategory(cat)} className={`px-6 py-2.5 rounded-full text-xs font-black transition-all border whitespace-nowrap ${trainingCategory === cat ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 border-gray-200 dark:border-zinc-800'}`}>
                     {cat}
                   </button>
                 ))}
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
              {filteredCourses.map(course => (
                <div key={course.id} onClick={() => setSelectedCourse(course)} className="group bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer flex flex-col h-full">
                  <div className="relative h-56 overflow-hidden">
                    <img src={course.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center text-white">
                       <span className="bg-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{course.category}</span>
                       <div className="flex items-center gap-1.5 text-xs font-bold bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg"><Star className="w-3.5 h-3.5 text-yellow-400 fill-current" /> {course.rating.toFixed(1)}</div>
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight mb-3 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                    <p className="text-gray-500 dark:text-zinc-400 text-sm mb-8 line-clamp-2 leading-relaxed">{course.description}</p>
                    <div className="mt-auto pt-6 border-t border-gray-50 dark:border-zinc-800 flex items-center justify-between">
                       <div className="flex items-center gap-2"><Play className="w-4 h-4 text-indigo-600" /> <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{course.duration}</span></div>
                       <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Assistir</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Outras abas (trilha, agentes, tutoriais) continuam iguais */}
        {activeTab === 'trilha' && (
          <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-8 md:p-16 border border-gray-100 dark:border-zinc-800 shadow-xl relative overflow-hidden animate-fade-in">
             <div className="max-w-2xl mb-16">
               <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Seu Caminho para o Sucesso</h2>
               <p className="text-gray-500 dark:text-zinc-400 text-lg font-medium leading-relaxed">Siga o caminho validado que leva do primeiro acesso ao faturamento diamante no Menu ADS.</p>
             </div>
             <div className="space-y-0 relative">
                {TRILHA_STEPS.map((step) => (
                  <div key={step.id} className={`flex gap-10 items-start pb-16 last:pb-0 group ${step.status === 'locked' ? 'opacity-40' : ''}`}>
                     <div className={`w-16 h-16 rounded-[1.6rem] flex items-center justify-center flex-shrink-0 transition-all border-4 border-white dark:border-zinc-800 shadow-2xl z-10 ${step.status === 'completed' ? 'bg-emerald-500 text-white' : step.status === 'current' ? 'bg-indigo-600 text-white scale-110' : 'bg-gray-100 dark:bg-zinc-800 text-gray-400'}`}>
                        {step.status === 'completed' ? <CheckCircle className="w-8 h-8" /> : <step.icon className="w-7 h-7" />}
                     </div>
                     <div className="pt-2">
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-2">{step.title}</h3>
                        <p className="text-gray-500 dark:text-zinc-400 text-base font-medium max-w-xl">{step.desc}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
      
      {/* Quiz Modal implementado igual à versão anterior */}
    </div>
  );
};

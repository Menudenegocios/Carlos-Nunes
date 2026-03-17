
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

import { 
  Play, Star, X, Award, CheckCircle, GraduationCap, 
  Video, Map, Sparkles, Target, Image,
  Monitor, Layers, Zap, Bot, Home as HomeIcon,
  PlayCircle, RefreshCw, ExternalLink, ListChecks, Repeat, Rocket, CloudSun, TrendingUp,
  ChevronRight, Clock, Users, BookOpen, MessageSquare, Smartphone
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
  youtubeEmbed?: string;
}

interface AIAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: any;
  url: string;
  color: string;
}

const MOCK_COURSES: Course[] = [
  { id: 1, title: 'Tráfego Pago para Negócios Locais', instructor: 'Lucas Mendes', category: 'Marketing', duration: '3h 15m', rating: 4.9, students: 2500, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', description: 'Aprenda a investir em anúncios no Instagram e Google focados no seu bairro para atrair clientes reais.' },
  { id: 2, title: 'Dominação de Instagram Local', instructor: 'Ana Silva', category: 'Marketing', duration: '2h 30m', rating: 4.8, students: 1240, image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800', description: 'Transforme seu perfil social em uma vitrine magnética que atrai moradores da sua região todos os dias.' },
  { id: 3, title: 'Fechamento de Vendas High Ticket', instructor: 'Juliana Paes', category: 'Vendas', duration: '1h 45m', rating: 4.7, students: 2100, image: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&q=80&w=800', description: 'Domine scripts e gatilhos mentais avançados para vender serviços de alto valor com facilidade.' },
  { id: 4, title: 'Finanças Lucrativas', instructor: 'Carlos Eduardo', category: 'Finanças', duration: '4h 15m', rating: 4.9, students: 850, image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800', description: 'Organize seu fluxo de caixa e entenda a margem real de lucro do seu negócio regional.' },
  { id: 5, title: "Treinamento: 8 P'S do Marketing - 1 Produto", instructor: 'Menu Academy', category: 'Vendas', duration: '1h 20m', rating: 5.0, students: 150, image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800', description: 'Aprenda a aplicar os 8 P\'s do marketing focados em um único produto para maximizar suas vendas.', youtubeEmbed: 'https://www.youtube.com/embed/g5j95hnnWOc?list=PLZ9PlCqw0n_1cu9qXfjj5-bWBzY42rfrX' },
  { id: 6, title: '10 formas de Fechamentos em Vendas', instructor: 'Menu Academy', category: 'Vendas', duration: '45m', rating: 4.9, students: 320, image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800', description: 'Conheça 10 técnicas infalíveis para contornar objeções e fechar mais vendas todos os dias.', youtubeEmbed: 'https://www.youtube.com/embed/fP3SujZ2olQ?list=PLZ9PlCqw0n_2oqrwT3nwbNz3yFxVHrZUr' },
];

const AI_AGENTS: AIAgent[] = [
  { 
    id: 'sales-script', 
    name: 'Script de Vendas', 
    role: 'Copywriting Comercial', 
    description: 'IA especializada em criar roteiros persuasivos e quebrar objeções de clientes difíceis no WhatsApp e reuniões.', 
    icon: ListChecks, 
    color: 'text-emerald-600 bg-emerald-50', 
    url: 'https://chatgpt.com/g/g-68459990b2088191b098ebd25fd61558-agente-script-de-ventas/c/6941761e-c880-8332-b27c-3914bfc4e20f' 
  },
  { 
    id: 'follow-up', 
    name: 'Follow-up Expert', 
    role: 'Recuperação de Leads', 
    description: 'Estratégias automatizadas para não deixar nenhuma venda esfriar no seu funil de atendimento regional.', 
    icon: Repeat, 
    color: 'text-indigo-600 bg-indigo-50', 
    url: 'https://chatgpt.com/g/g-67674b9476688191b428941096db4464-agente-follow-up' 
  },
  { 
    id: 'pitch-master', 
    name: 'Pitch Master', 
    role: 'Apresentação de Impacto', 
    description: 'Refine sua fala comercial e sua autoridade para convencer parceiros e clientes em poucos segundos.', 
    icon: Rocket, 
    color: 'text-purple-600 bg-purple-50', 
    url: 'https://chatgpt.com/g/g-676761e39bc08191868b0d801dae75e9-pitchmaster' 
  },
  { 
    id: 'vendas-pro', 
    name: 'Vendas Mais Pro', 
    role: 'Alta Performance', 
    description: 'Consultoria estratégica para escala de vendas e fechamento agressivo focado em resultados rápidos.', 
    icon: Zap, 
    color: 'text-orange-600 bg-orange-50', 
    url: 'https://chatgpt.com/g/g-67676238cdc88191a20b8bc0a15240f1-venda-mais-pro' 
  }
];

export const Academy: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'treinamentos' | 'trilha' | 'biblioteca'>('home');
  const [trainingCategory, setTrainingCategory] = useState<string>('Todos');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  const categories = ['Todos', 'Marketing', 'Vendas', 'Gestão', 'Finanças'];
  const filteredCourses = trainingCategory === 'Todos' ? MOCK_COURSES : MOCK_COURSES.filter(c => c.category === trainingCategory);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-4 px-4 animate-[fade-in_0.4s_ease-out]">
      {/* Header Estilo Unificado Catálogo */}
      <div className="bg-white rounded-[3.5rem] p-8 md:p-12 text-gray-900 relative overflow-hidden shadow-2xl border border-gray-100 transition-colors duration-500">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="p-5 bg-indigo-50 backdrop-blur-xl rounded-[2rem] border border-indigo-100 shadow-xl">
                 <GraduationCap className="h-10 w-10 text-brand-primary" />
              </div>
              <div>
                 <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-2 italic uppercase overflow-visible">
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] title-fix">Menu Academy</span>
                 </h1>
                 <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em]">CONHECIMENTO ESTRATÉGICO PARA SEU NEGÓCIO LOCAL.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setActiveTab('treinamentos')} className="bg-[#F67C01] text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl active:scale-95 flex items-center gap-2">
                  <PlayCircle className="w-4 h-4" /> CONTINUAR AULA
              </button>
            </div>
          </div>

          <div className="flex p-1.5 mt-12 bg-gray-50 backdrop-blur-md rounded-[2.2rem] border border-gray-100 w-fit overflow-x-auto scrollbar-hide gap-1">
              {[
                  { id: 'home', label: 'INÍCIO', desc: 'Boas-vindas', icon: HomeIcon },
                  { id: 'treinamentos', label: 'CURSOS', desc: 'Vídeo aulas', icon: Video },
                  { id: 'trilha', label: 'TRILHA', desc: 'Passo a passo', icon: Map },
                  { id: 'biblioteca', label: 'BIBLIOTECA DE PROMPTS', desc: 'Agentes e Scripts', icon: BookOpen },
              ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)} 
                    className={`flex flex-col items-center justify-center min-w-[120px] px-8 py-3 rounded-[1.6rem] transition-all duration-300 whitespace-nowrap ${activeTab === tab.id ? 'bg-[#F67C01] text-white shadow-xl scale-105' : 'text-gray-400 hover:bg-black/5'}`}
                  >
                      <div className="flex items-center gap-2 mb-0.5">
                        <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-white' : 'text-brand-primary'}`} />
                        <span className="font-black text-[10px] tracking-widest uppercase italic">{tab.label}</span>
                      </div>
                      <span className={`text-[8px] font-medium opacity-60 ${activeTab === tab.id ? 'text-white' : 'text-gray-900'}`}>{tab.desc}</span>
                  </button>
              ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'home' && (
            <SectionLanding 
                title="Conhecimento que faz seu negócio crescer."
                subtitle="Menu Academy"
                description="Explore nossa biblioteca exclusiva de treinamentos focados no empreendedor local. Aprenda estratégias práticas para dominar o mercado regional."
                benefits={[
                "Treinamentos rápidos focados em implementação imediata.",
                "Estratégias de tráfego pago para atrair clientes do bairro.",
                "Consultoria com agentes de IA treinados em vendas.",
                "Caminho validado do zero ao sucesso comercial.",
                "Conteúdo atualizado semanalmente com tendências de mercado."
                ]}
                youtubeId="dQw4w9WgXcQ"
                ctaLabel="VER CURSOS DISPONÍVEIS"
                onStart={() => setActiveTab('treinamentos')}
                icon={GraduationCap}
                accentColor="indigo"
            />
        )}

        {activeTab === 'treinamentos' && !selectedCourse && (
           <div className="space-y-10">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-4">
                 {categories.map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setTrainingCategory(cat)}
                      className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${trainingCategory === cat ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-gray-100'}`}
                    >
                       {cat}
                    </button>
                 ))}
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                 {filteredCourses.map(course => (
                    <div key={course.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer" onClick={() => setSelectedCourse(course)}>
                       <div className="h-48 overflow-hidden relative bg-black">
                          <img src={course.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" alt={course.title} />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                             <div className="w-16 h-16 bg-indigo-600/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-[0_0_30px_rgba(79,70,229,0.5)]">
                                <Play className="w-8 h-8 text-white fill-current ml-1" />
                             </div>
                          </div>
                          <div className="absolute top-4 left-4 pointer-events-none">
                             <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[9px] font-black uppercase text-indigo-600 tracking-widest">{course.category}</span>
                          </div>
                       </div>
                       <div className="p-8 space-y-4">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                             <Clock className="w-3.5 h-3.5" /> {course.duration} • <Users className="w-3.5 h-3.5" /> {course.students} alunos
                          </div>
                          <h3 className="text-xl font-black text-gray-900 leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                          <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2">{course.description}</p>
                          <div className="pt-4 flex items-center justify-between">
                             <div className="flex items-center gap-1 text-yellow-400">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-xs font-black text-gray-900">{course.rating}</span>
                             </div>
                             <button className="px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                Acessar Aula
                             </button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {activeTab === 'treinamentos' && selectedCourse && (
           <div className="space-y-8 animate-[fade-in_0.4s_ease-out]">
              <button 
                onClick={() => setSelectedCourse(null)}
                className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-black text-[10px] uppercase tracking-widest px-4"
              >
                 <ChevronRight className="w-4 h-4 rotate-180" /> VOLTAR PARA CURSOS
              </button>

              <div className="bg-white rounded-[3rem] p-6 md:p-10 border border-gray-100 shadow-xl">
                 <div className="aspect-video w-full rounded-[2rem] overflow-hidden bg-black shadow-2xl mb-10 border border-gray-200">
                    {selectedCourse.youtubeEmbed ? (
                      <iframe 
                        className="w-full h-full" 
                        src={selectedCourse.youtubeEmbed} 
                        title={selectedCourse.title} 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                         <Video className="w-16 h-16 opacity-50" />
                         <p className="font-medium">Vídeo indisponível no momento.</p>
                      </div>
                    )}
                 </div>

                 <div className="max-w-4xl mx-auto space-y-6">
                    <div className="flex flex-wrap items-center gap-4 mb-2">
                       <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                          {selectedCourse.category}
                       </span>
                       <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                          <Clock className="w-4 h-4" /> {selectedCourse.duration}
                       </div>
                       <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                          <Users className="w-4 h-4" /> {selectedCourse.students} alunos
                       </div>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">{selectedCourse.title}</h2>
                    
                    <div className="flex items-center gap-4 py-4 border-y border-gray-100">
                       <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-brand-primary flex items-center justify-center text-white font-black text-lg shadow-lg">
                          {selectedCourse.instructor.charAt(0)}
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instrutor</p>
                          <p className="font-bold text-gray-900">{selectedCourse.instructor}</p>
                       </div>
                    </div>

                    <div className="prose max-w-none">
                       <h3 className="text-lg font-black uppercase italic tracking-tight text-gray-900 mb-4">Sobre este treinamento</h3>
                       <p className="text-slate-600 leading-relaxed font-medium">
                          {selectedCourse.description}
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'trilha' && (
           <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-gray-100 shadow-xl space-y-12 px-4 mx-4">
              <div className="max-w-2xl">
                 <h2 className="text-3xl font-black text-gray-900 italic uppercase tracking-tighter mb-4">Seu Caminho para o Topo</h2>
                 <p className="text-slate-500 font-medium">Siga este passo a passo validado para transformar seu pequeno negócio em uma referência regional.</p>
              </div>

              <div className="space-y-8 relative before:absolute before:left-[27px] before:top-4 before:bottom-4 before:w-1 before:bg-indigo-50">
                 {[
                    { step: '01', title: 'Fundação Digital', desc: 'Configure sua Bio Digital Pro e seu Catálogo para começar a ser visto.', icon: Smartphone },
                    { step: '02', title: 'Atração de Leads', desc: 'Aprenda a rodar seus primeiros anúncios focados no seu bairro.', icon: Target },
                    { step: '03', title: 'Maestria em Vendas', desc: 'Use nossos scripts de IA para fechar negócios pelo WhatsApp.', icon: MessageSquare },
                    { step: '04', title: 'Escala & Fidelidade', desc: 'Ative o Clube de Vantagens e multiplique suas recomendações.', icon: Zap }
                 ].map((item, idx) => (
                    <div key={idx} className="relative flex gap-8 pl-14 items-start group">
                       <div className="absolute left-0 w-14 h-14 rounded-2xl bg-white border-2 border-indigo-600 flex items-center justify-center text-indigo-600 z-10 shadow-lg group-hover:scale-110 transition-transform">
                          <item.icon className="w-6 h-6" />
                       </div>
                       <div className="pt-2">
                          <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">Passo {item.step}</h4>
                          <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tight mb-2">{item.title}</h3>
                          <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-lg">{item.desc}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

         {activeTab === 'biblioteca' && (
           <div className="space-y-12 px-4">
              <div className="bg-indigo-600 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
                 <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="space-y-6 max-w-xl">
                       <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                          <Bot className="w-10 h-10 text-brand-primary" />
                       </div>
                       <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">Consultoria 24h com Especialistas</h2>
                       <p className="text-indigo-100 text-lg font-medium leading-relaxed">Nossos agentes de IA foram treinados com as melhores estratégias de vendas, marketing e gestão local do mundo. Além disso, acesse nossa biblioteca de prompts de alta conversão.</p>
                    </div>
                    <div className="hidden lg:block relative">
                       <div className="w-64 h-64 bg-white/5 rounded-full blur-[80px] absolute inset-0"></div>
                       <Bot className="w-48 h-48 text-white/10 -rotate-12" />
                    </div>
                 </div>
                 <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
              </div>

              <div className="space-y-4">
                 <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tight">Agentes de IA</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {AI_AGENTS.map(agent => (
                       <div key={agent.id} className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-6 group hover:shadow-2xl transition-all hover:-translate-y-2">
                          <div className={`w-20 h-20 rounded-[2rem] ${agent.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                             <agent.icon className="w-10 h-10" />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2">{agent.role}</p>
                             <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">{agent.name}</h3>
                          </div>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed flex-1">
                             {agent.description}
                          </p>
                          <a 
                           href={agent.url} 
                           target="_blank"
                           rel="noopener noreferrer"
                           className="w-full py-4 bg-[#0F172A] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all active:scale-95"
                          >
                             ABRIR AGENTE <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

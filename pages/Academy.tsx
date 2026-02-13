
import React, { useState } from 'react';
import { 
  Play, Star, X, Award, CheckCircle, GraduationCap, 
  Video, Map, Sparkles, TrendingUp, BookOpen, 
  Smartphone, MessageSquare, Target, ChevronRight,
  Monitor, Layout, Layers, Zap, Clock, Lock, ArrowRight,
  HelpCircle, PlayCircle, CreditCard
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
}

const MOCK_COURSES: Course[] = [
  { id: 2, title: 'Dominação de Instagram Local', instructor: 'Ana Silva', category: 'Marketing', duration: '2h 30m', rating: 4.8, students: 1240, image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800', description: 'Transforme seu perfil em uma máquina de atração de clientes do seu bairro.' },
  { id: 3, title: 'Fechamento de Vendas High Ticket', instructor: 'Juliana Paes', category: 'Vendas', duration: '1h 45m', rating: 4.7, students: 2100, image: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&q=80&w=800', description: 'Scripts e gatilhos mentais para vender serviços e produtos de maior valor.' },
  { id: 4, title: 'Finanças Lucrativas', instructor: 'Carlos Eduardo', category: 'Finanças', duration: '4h 15m', rating: 4.9, students: 850, image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800', description: 'Organize seu caixa, controle gastos e entenda a margem real do seu negócio.' },
  { id: 5, title: 'Gestão Ágil para Pequenos', instructor: 'Ricardo Mendes', category: 'Gestão', duration: '3h 00m', rating: 4.6, students: 500, image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800', description: 'Como otimizar processos e gerenciar sua equipe sem burocracia.' },
];

const TRILHA_STEPS = [
  { id: 1, title: 'Mindset e Primeiros Passos', status: 'completed', icon: Zap, desc: 'Prepare sua mentalidade para o crescimento exponencial.' },
  { id: 2, title: 'A Vitrine de Ouro', status: 'current', icon: Monitor, desc: 'Configuração estratégica do seu catálogo e bio para conversão.' },
  { id: 3, title: 'Tráfego Orgânico e Pago', status: 'locked', icon: Target, desc: 'Como atrair as pessoas certas para o seu WhatsApp.' },
  { id: 4, title: 'Escala e Automatização', status: 'locked', icon: Layers, desc: 'Implementando processos eficientes para atender e vender mais.' },
  { id: 5, title: 'Fidelização e Indicação', status: 'locked', icon: Award, desc: 'Crie uma legião de fãs que vendem por você.' },
];

const TUTORIAIS = [
  { title: 'Configurando Categorias', duration: '2:15', icon: Layers, desc: 'Aprenda a organizar seus produtos.' },
  { title: 'Personalizando sua Bio', duration: '3:40', icon: Smartphone, desc: 'Edite cores, links e seu QR Code.' },
  { title: 'Gestão de Leads no CRM', duration: '5:10', icon: Layout, desc: 'Como mover contatos no funil.' },
  { title: 'Criando Cupons Digitais', duration: '2:50', icon: Award, desc: 'Gere descontos para seus clientes.' },
  { title: 'Configurando Pix na Loja', duration: '3:05', icon: CreditCard, desc: 'Receba pagamentos direto na conta.' },
];

export const Academy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'treinamentos' | 'trilha' | 'tutoriais'>('treinamentos');
  const [trainingCategory, setTrainingCategory] = useState<string>('Todos');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const categories = ['Todos', 'Marketing', 'Vendas', 'Gestão', 'Finanças'];
  const filteredCourses = trainingCategory === 'Todos' 
    ? MOCK_COURSES 
    : MOCK_COURSES.filter(c => c.category === trainingCategory);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 pt-4">
      
      {/* Academy Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
               <GraduationCap className="h-10 w-10 text-yellow-400" />
            </div>
            <div>
               <h1 className="text-3xl md:text-5xl font-black tracking-tight">Menu Academy</h1>
               <p className="text-indigo-200 text-lg font-medium">Sua jornada rumo ao próximo nível começa aqui.</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex p-1.5 bg-black/20 backdrop-blur-md rounded-[1.8rem] w-fit border border-white/10 mt-8">
            <button
              onClick={() => setActiveTab('treinamentos')}
              className={`flex items-center gap-3 px-8 py-3 rounded-[1.4rem] font-black text-sm transition-all duration-300 ${activeTab === 'treinamentos' ? 'bg-white text-indigo-900 shadow-xl scale-105' : 'text-indigo-100 hover:bg-white/10'}`}
            >
              <Video className="w-4 h-4" /> TREINAMENTOS
            </button>
            <button
              onClick={() => setActiveTab('trilha')}
              className={`flex items-center gap-3 px-8 py-3 rounded-[1.4rem] font-black text-sm transition-all duration-300 ${activeTab === 'trilha' ? 'bg-white text-indigo-900 shadow-xl scale-105' : 'text-indigo-100 hover:bg-white/10'}`}
            >
              <Map className="w-4 h-4" /> TRILHA
            </button>
            <button
              onClick={() => setActiveTab('tutoriais')}
              className={`flex items-center gap-3 px-8 py-3 rounded-[1.4rem] font-black text-sm transition-all duration-300 ${activeTab === 'tutoriais' ? 'bg-white text-indigo-900 shadow-xl scale-105' : 'text-indigo-100 hover:bg-white/10'}`}
            >
              <HelpCircle className="w-4 h-4" /> TUTORIAIS
            </button>
          </div>
        </div>

        {/* Abstract Deco */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      <div className="animate-[fade-in_0.4s_ease-out]">
        
        {/* TAB: TREINAMENTOS */}
        {activeTab === 'treinamentos' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div className="flex items-center gap-3">
                 <div className="w-1.5 h-8 bg-indigo-600 rounded-full"></div>
                 <h2 className="text-2xl font-black text-gray-900 tracking-tight">Habilidades para o Sucesso</h2>
               </div>
               
               <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 px-1">
                 {categories.map(cat => (
                   <button
                     key={cat}
                     onClick={() => setTrainingCategory(cat)}
                     className={`px-6 py-2.5 rounded-full text-xs font-black transition-all border whitespace-nowrap ${trainingCategory === cat ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg scale-105' : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-200 hover:text-indigo-600'}`}
                   >
                     {cat}
                   </button>
                 ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map(course => (
                <div 
                  key={course.id} 
                  onClick={() => setSelectedCourse(course)}
                  className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer flex flex-col h-full"
                >
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
                    <h3 className="text-xl font-black text-gray-900 leading-tight mb-3 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                    <p className="text-gray-500 text-sm mb-8 line-clamp-2 font-medium leading-relaxed">{course.description}</p>
                    
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                             <Play className="w-4 h-4 fill-current" />
                          </div>
                          <span className="text-xs font-black text-gray-400 uppercase tracking-[0.1em]">{course.duration}</span>
                       </div>
                       <span className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                         Iniciar <ArrowRight className="w-4 h-4" />
                       </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: TRILHA (JOURNEY MAP) */}
        {activeTab === 'trilha' && (
          <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-gray-100 shadow-xl relative overflow-hidden">
             <div className="max-w-2xl mb-16">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4">
                  <TrendingUp className="w-4 h-4" /> Mentoria Guiada
               </div>
               <h2 className="text-4xl font-black text-gray-900 mb-4">Sua Jornada de Sucesso</h2>
               <p className="text-gray-500 text-lg font-medium leading-relaxed">Não estude de forma aleatória. Siga o caminho validado que leva do primeiro acesso ao faturamento diamante.</p>
             </div>

             <div className="space-y-0 relative">
                {/* Vertical Connector Line */}
                <div className="absolute left-[31px] top-8 bottom-8 w-1 bg-gray-100 -z-10"></div>
                
                {TRILHA_STEPS.map((step, idx) => (
                  <div key={step.id} className={`flex gap-10 items-start pb-16 last:pb-0 group ${step.status === 'locked' ? 'opacity-40' : ''}`}>
                     <div className={`w-16 h-16 rounded-[1.6rem] flex items-center justify-center flex-shrink-0 transition-all duration-700 border-4 border-white shadow-2xl relative z-10 ${
                       step.status === 'completed' ? 'bg-emerald-500 text-white' : 
                       step.status === 'current' ? 'bg-indigo-600 text-white ring-8 ring-indigo-50 scale-110' : 
                       'bg-gray-100 text-gray-400'
                     }`}>
                        {step.status === 'completed' ? <CheckCircle className="w-8 h-8" /> : <step.icon className={`w-7 h-7 ${step.status === 'current' ? 'animate-pulse' : ''}`} />}
                        
                        {/* Milestone Number Label */}
                        <div className="absolute -left-12 text-gray-300 font-black text-3xl opacity-20 group-hover:opacity-40 transition-opacity">
                           0{step.id}
                        </div>
                     </div>
                     <div className="pt-2">
                        <div className="flex items-center gap-3 mb-2">
                           <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${step.status === 'current' ? 'text-indigo-600' : 'text-gray-400'}`}>ETAPA {step.id}</span>
                           {step.status === 'current' && <span className="bg-indigo-600 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg shadow-indigo-100 animate-bounce">Foco Aqui</span>}
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">{step.title}</h3>
                        <p className="text-gray-500 text-base font-medium max-w-xl leading-relaxed">{step.desc}</p>
                        
                        {step.status === 'current' && (
                           <button className="mt-8 flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-[1.4rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all">
                              Retomar Mentorias <ChevronRight className="w-4 h-4" />
                           </button>
                        )}
                        {step.status === 'locked' && (
                           <div className="mt-4 flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                              <Lock className="w-4 h-4" /> Bloqueado até concluir etapa anterior
                           </div>
                        )}
                     </div>
                  </div>
                ))}
             </div>
             
             {/* Decor BG for Trail */}
             <div className="absolute right-0 bottom-0 p-32 bg-indigo-50/50 rounded-tl-[10rem] -z-10 translate-y-1/2 translate-x-1/2"></div>
          </div>
        )}

        {/* TAB: TUTORIAIS (CENTRAL DE AJUDA) */}
        {activeTab === 'tutoriais' && (
          <div className="space-y-10">
            <div className="max-w-2xl">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4">
                  <PlayCircle className="w-4 h-4" /> Guia Prático
               </div>
               <h2 className="text-3xl font-black text-gray-900 mb-2">Central de Treinamento Técnico</h2>
               <p className="text-gray-500 text-lg font-medium leading-relaxed">Vídeos rápidos e diretos ao ponto para você dominar cada função da plataforma Menu ADS.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {TUTORIAIS.map((tut, idx) => (
                <div key={idx} className="group bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all flex items-center gap-6">
                   <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all text-gray-400">
                      <tut.icon className="w-8 h-8" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="font-black text-gray-900 text-lg leading-tight mb-1 truncate">{tut.title}</h4>
                      <p className="text-xs text-gray-400 font-medium line-clamp-1 mb-3">{tut.desc}</p>
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black text-indigo-600/60 uppercase tracking-widest flex items-center gap-1.5">
                           <Clock className="w-3.5 h-3.5" /> {tut.duration}
                         </span>
                         <button className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                           <Play className="w-4 h-4 fill-current" />
                         </button>
                   </div>
                </div>
              </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-slate-900 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-10 border border-white/5 relative overflow-hidden">
               <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center text-white shadow-2xl border border-white/20">
                  <BookOpen className="w-12 h-12 text-indigo-300" />
               </div>
               <div className="flex-1 text-center md:text-left relative z-10">
                  <h3 className="text-2xl font-black text-white mb-2">Manual Completo da Plataforma</h3>
                  <p className="text-gray-400 text-base font-medium">Prefere uma leitura técnica detalhada? Baixe nosso guia completo em PDF com todas as funções e integrações.</p>
               </div>
               <button className="relative z-10 px-10 py-4 bg-white text-gray-900 rounded-[1.2rem] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-50 transition-all flex items-center gap-2">
                  Download PDF <ArrowRight className="w-4 h-4" />
               </button>
               
               {/* Deco for tutorials footer */}
               <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
            </div>
          </div>
        )}
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedCourse(null)}></div>
          <div className="relative bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden animate-[scale-in_0.3s_ease-out] flex flex-col md:flex-row">
            <div className="w-full md:w-3/5 aspect-video md:aspect-auto bg-gray-900 relative group overflow-hidden">
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
            </div>

            <div className="flex-1 p-10 flex flex-col bg-gray-50">
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600"><Video className="w-6 h-6" /></div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Treinamento</p>
                    <p className="text-gray-900 font-bold">Assistir Módulo 01</p>
                  </div>
                </div>
                <button onClick={() => setSelectedCourse(null)} className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-100 transition-colors shadow-sm">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="flex-1">
                <h4 className="font-black text-gray-900 text-xl mb-4">Sobre este treinamento</h4>
                <p className="text-gray-600 text-base leading-relaxed font-medium mb-10">{selectedCourse.description}</p>
                
                <div className="space-y-4">
                   <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-200/50 shadow-sm opacity-60">
                      <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                      <span className="text-sm font-bold text-gray-700">Introdução ao Mercado Digital</span>
                      <span className="ml-auto text-[10px] font-black text-gray-400">12:00</span>
                   </div>
                   <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-indigo-200 shadow-md">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
                      <span className="text-sm font-black text-indigo-700">Módulo 01: Estratégias Iniciais</span>
                      <Play className="w-3 h-3 ml-2 fill-indigo-600 text-indigo-600" />
                      <span className="ml-auto text-[10px] font-black text-indigo-600">18:45</span>
                   </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <button className="w-full bg-indigo-600 text-white py-5 rounded-[1.4rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                  <CheckCircle className="w-5 h-5" /> Concluir e Avançar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

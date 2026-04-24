
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import {
   Play, Star, X, Award, CheckCircle, GraduationCap,
   Video, Map, Sparkles, Target, Image, Handshake,
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
   { id: 1, title: 'Review por dentro da plataforma', instructor: 'Menu Academy', category: 'Gestão', duration: '12m', rating: 5.0, students: 450, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', description: 'Visão geral completa de todas as funcionalidades e ferramentas disponíveis na plataforma Menu de Negócios.', youtubeEmbed: 'https://www.youtube.com/embed/cBYzMN6lZ2o?list=PLZ9PlCqw0n_2Su4TpF8-RdramN_2HbhT5' },
   { id: 2, title: 'Dashboard & Painel', instructor: 'Menu Academy', category: 'Gestão', duration: '10m', rating: 4.9, students: 320, image: 'https://images.unsplash.com/photo-1551288049-bbda4833effb?auto=format&fit=crop&q=80&w=800', description: 'Como interpretar as métricas do seu dashboard e gerenciar seu painel de controle principal.', youtubeEmbed: 'https://www.youtube.com/embed/omINl8p82Zo?list=PLZ9PlCqw0n_2Su4TpF8-RdramN_2HbhT5' },
   { id: 3, title: 'Vitrine de negócios', instructor: 'Menu Academy', category: 'Marketing', duration: '15m', rating: 5.0, students: 280, image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800', description: 'Aprenda a configurar e otimizar sua vitrine para atrair mais clientes no ecossistema local.', youtubeEmbed: 'https://www.youtube.com/embed/kRhLZXxEW9A?list=PLZ9PlCqw0n_2Su4TpF8-RdramN_2HbhT5' },
   { id: 4, title: 'Menu Club', instructor: 'Menu Academy', category: 'Marketing', duration: '8m', rating: 4.8, students: 210, image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800', description: 'Como utilizar o Menu Club para gerar parcerias e fidelizar clientes através de benefícios exclusivos.', youtubeEmbed: 'https://www.youtube.com/embed/cc4UAkYD-_4?list=PLZ9PlCqw0n_2Su4TpF8-RdramN_2HbhT5' },
   { id: 5, title: 'CRM & VENDAS', instructor: 'Menu Academy', category: 'Vendas', duration: '20m', rating: 4.9, students: 390, image: 'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80&w=800', description: 'Domine a gestão de leads e o processo de vendas dentro da plataforma para não perder oportunidades.', youtubeEmbed: 'https://www.youtube.com/embed/tlhjfO9tSUc?list=PLZ9PlCqw0n_2Su4TpF8-RdramN_2HbhT5' },
   { id: 6, title: 'Financeiro', instructor: 'Menu Academy', category: 'Finanças', duration: '18m', rating: 4.7, students: 420, image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800', description: 'Como organizar suas contas, lançamentos e fluxo de caixa utilizando o módulo financeiro.', youtubeEmbed: 'https://www.youtube.com/embed/lFBJBMI3pcw?list=PLZ9PlCqw0n_2Su4TpF8-RdramN_2HbhT5' },
   { id: 7, title: 'Gestão de projetos', instructor: 'Menu Academy', category: 'Gestão', duration: '25m', rating: 4.9, students: 150, image: 'https://images.unsplash.com/photo-1454165833767-027ffea7025c?auto=format&fit=crop&q=80&w=800', description: 'Organize tarefas e checklists para manter a operação do seu negócio em dia.', youtubeEmbed: 'https://www.youtube.com/embed/ClPMXjSImbw?list=PLZ9PlCqw0n_2Su4TpF8-RdramN_2HbhT5' },
   { id: 8, title: 'Menu Academy', instructor: 'Menu Academy', category: 'Gestão', duration: '10m', rating: 5.0, students: 500, image: 'https://images.unsplash.com/photo-1524178232363-1fb28f74b0cd?auto=format&fit=crop&q=80&w=800', description: 'Explicação completa sobre como utilizar os treinamentos e recursos da nossa academia.', youtubeEmbed: 'https://www.youtube.com/embed/UZ0l4AddQLI?list=PLZ9PlCqw0n_2Su4TpF8-RdramN_2HbhT5' },
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
   const navigate = useNavigate();
   const [activeTab, setActiveTab] = useState<'home' | 'trilha' | 'treinamentos' | 'projetos' | 'connect'>('home');
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
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-2 italic uppercase overflow-visible text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] title-fix">
                           Comece por aqui
                        </h1>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em]">BEM-VINDO AO SEU ECOSSISTEMA DE SUCESSO.</p>
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
                     { id: 'home', label: 'Início', desc: 'Bem-vindo', icon: HomeIcon },
                     { id: 'trilha', label: 'Trilha do sucesso', desc: 'Passo a passo', icon: Map },
                     { id: 'connect', label: 'Connect', desc: 'Mentorias ao vivo', icon: Users },
                     { id: 'treinamentos', label: 'Treinamentos', desc: 'Vídeo aulas', icon: Video },
                     { id: 'projetos', label: 'Projetos', desc: 'Gestão estratégica', icon: Layers },
                  ].map(tab => (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex flex-col items-center justify-center min-w-[120px] px-8 py-3 rounded-[1.6rem] transition-all duration-300 whitespace-nowrap ${activeTab === tab.id ? 'bg-[#F67C01] text-white shadow-xl scale-105' : 'text-gray-400 hover:bg-black/5'}`}
                     >
                        <div className="flex items-center gap-2 mb-0.5">
                           <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-white' : 'text-brand-primary'}`} />
                           <span className="font-black text-[10px] tracking-widest italic">{tab.label}</span>
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
               <div className="bg-white rounded-[3.5rem] p-8 md:p-12 border border-gray-100 shadow-xl space-y-10">
                  <div className="max-w-3xl">
                     <h2 className="text-3xl font-black text-gray-900 uppercase italic mb-4">Bem-vindo ao Menu de Negócios!</h2>
                     <p className="text-lg text-slate-600 font-medium leading-relaxed">
                        Você agora faz parte de um ecossistema criado para ajudar você a organizar, conectar e crescer seu negócio.
                     </p>
                  </div>

                  <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden bg-black shadow-2xl border border-gray-200">
                     <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/UZ0l4AddQLI"
                        title="Aula de Boas vindas"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                     ></iframe>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="bg-indigo-50 p-8 rounded-[2rem] border border-indigo-100 space-y-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                           <Rocket className="w-6 h-6" />
                        </div>
                        <h3 className="font-black text-indigo-900 uppercase italic">Aceleração</h3>
                        <p className="text-xs text-indigo-700 font-medium">Ferramentas focadas em escala e resultados rápidos.</p>
                     </div>
                     <div className="bg-orange-50 p-8 rounded-[2rem] border border-orange-100 space-y-4">
                        <div className="w-12 h-12 bg-[#F67C01] rounded-2xl flex items-center justify-center text-white">
                           <Handshake className="w-6 h-6" />
                        </div>
                        <h3 className="font-black text-orange-900 uppercase italic">Conexão</h3>
                        <p className="text-xs text-orange-700 font-medium">O maior ecossistema de parceiros regionais.</p>
                     </div>
                     <div className="bg-purple-50 p-8 rounded-[2rem] border border-purple-100 space-y-4">
                        <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white">
                           <GraduationCap className="w-6 h-6" />
                        </div>
                        <h3 className="font-black text-purple-900 uppercase italic">Conhecimento</h3>
                        <p className="text-xs text-purple-700 font-medium">Mentorias e conteúdos práticos semanais.</p>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'trilha' && (
               <div className="space-y-10">
                  <div className="max-w-3xl px-4">
                     <h2 className="text-3xl font-black text-gray-900 uppercase italic mb-4">Trilha do Sucesso</h2>
                     <p className="text-lg text-slate-600 font-medium">
                        Siga este passo a passo simples com ações práticas para extrair o máximo da plataforma.
                     </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                     {[
                        {
                           number: "1️⃣",
                           title: "Primeiros Passos",
                           desc: "Inicie sua jornada criando seu primeiro projeto estratégico de expansão.",
                           action: "Criar meu primeiro projeto",
                           tab: "projetos",
                           icon: Rocket,
                           color: "indigo"
                        },
                        {
                           number: "2️⃣",
                           title: "Desenvolvimento de Negócio",
                           desc: "Estruture seu modelo de negócio e defina seus objetivos de médio prazo.",
                           action: "Definir metas do projeto",
                           tab: "projetos",
                           icon: Target,
                           color: "orange"
                        },
                        {
                           number: "3️⃣",
                           title: "Gestão de Redes Sociais",
                           desc: "Organize sua presença digital e crie um cronograma de conteúdo.",
                           action: "Gerenciar cronograma",
                           tab: "projetos",
                           icon: Smartphone,
                           color: "purple"
                        },
                        {
                           number: "4️⃣",
                           title: "Organização de Vendas",
                           desc: "Aprenda a organizar seu funil e coloque-o em prática no seu projeto.",
                           action: "Configurar funil",
                           tab: "projetos",
                           icon: TrendingUp,
                           color: "emerald"
                        },
                        {
                           number: "5️⃣",
                           title: "Plano de Execução",
                           desc: "Transforme tudo em tarefas práticas e metas semanais.",
                           action: "Visualizar tarefas",
                           tab: "projetos",
                           icon: ListChecks,
                           color: "blue"
                        }
                     ].map((item, idx) => (
                        <div key={idx} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between h-full">
                           <div className="space-y-6">
                              <div className="flex justify-between items-center">
                                 <span className="text-2xl">{item.number}</span>
                                 <div className={`p-4 rounded-2xl bg-${item.color}-50 text-${item.color}-600`}>
                                    <item.icon className="w-6 h-6" />
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">{item.title}</h3>
                                 <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                              </div>
                           </div>
                           
                           <div className="pt-8">
                              <button 
                                 onClick={() => setActiveTab((item as any).tab)}
                                 className={`w-full py-4 bg-gray-50 text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-gray-100 flex items-center justify-center gap-2 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all`}
                              >
                                 {(item as any).action} <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
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
                           <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                              {selectedCourse.description}
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'projetos' && (
               <div className="space-y-12 px-4 animate-fade-in">
                  <div className="bg-[#0F172A] rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
                     <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="space-y-6 max-w-xl">
                           <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 backdrop-blur-xl border border-white/10 flex items-center justify-center">
                              <Target className="w-10 h-10 text-brand-primary" />
                           </div>
                           <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">Gestão de Projetos</h2>
                           <p className="text-slate-400 text-lg font-medium leading-relaxed">
                              A base de qualquer negócio de sucesso é a organização. Use nossa ferramenta de gestão para transformar suas ideias em projetos práticos e lucrativos.
                           </p>
                        </div>
                        <div className="hidden lg:block">
                           <Layers className="w-48 h-48 text-white/5 -rotate-12" />
                        </div>
                     </div>
                  </div>

                  <div className="bg-white rounded-[3rem] border border-gray-100 p-8 shadow-sm">
                     <div className="flex flex-col items-center text-center space-y-8 py-10">
                        <div className="w-24 h-24 bg-orange-50 rounded-[2.5rem] flex items-center justify-center text-[#F67C01]">
                           <Rocket className="w-12 h-12" />
                        </div>
                        <div className="space-y-4 max-w-lg">
                           <h3 className="text-3xl font-black text-gray-900 uppercase italic">Comece seu projeto agora</h3>
                           <p className="text-slate-500 font-medium">Acesse a gestão completa de projetos para criar seu plano de ação, definir metas e acompanhar seu crescimento passo a passo.</p>
                        </div>
                        <button 
                           onClick={() => navigate('/project-management')}
                           className="px-10 py-5 bg-[#F67C01] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all active:scale-95 flex items-center gap-3"
                        >
                           IR PARA GESTÃO DE PROJETOS <ChevronRight className="w-5 h-5" />
                        </button>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'connect' && (
               <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-gray-100 shadow-xl space-y-8 px-4 mx-4 text-center animate-[fade-in_0.4s_ease-out]">
                  <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner mb-6">
                     <Users className="w-10 h-10" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 italic uppercase tracking-tighter mb-4">Menu Connect</h2>
                  <p className="text-lg text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed">
                     Nossas mentorias online acontecem todas as quartas-feiras às 19h30 no Google Meet. Um espaço exclusivo para tirar dúvidas, fazer networking e acelerar seus resultados.
                  </p>

                  <div className="bg-gray-50 border border-gray-200 rounded-[3rem] p-10 max-w-xl mx-auto mt-12 flex flex-col items-center">
                     <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Próxima Mentoria
                     </p>
                     <h3 className="text-3xl font-black text-gray-900 uppercase italic mb-10">Quarta-feira, 19:30</h3>

                     <a
                        href="https://meet.google.com/uuh-ffht-tvu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#F67C01] text-white px-10 py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-orange-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                     >
                        <Video className="w-6 h-6" /> ENTRAR NA SALA DO MEETING
                     </a>

                     <div className="mt-6 text-xs text-slate-400 font-bold bg-white px-6 py-3 rounded-xl border border-gray-100 w-full overflow-hidden text-ellipsis whitespace-nowrap">
                        Link oficial: <a href="https://meet.google.com/uuh-ffht-tvu" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">https://meet.google.com/uuh-ffht-tvu</a>
                     </div>

                     <div className="w-full mt-16 pt-10 border-t border-gray-200 text-left">
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-[0.1em] mb-6 flex items-center gap-2">
                           <PlayCircle className="w-5 h-5 text-[#F67C01]" /> Edições Anteriores
                        </h4>
                        <div className="space-y-4">
                           {[
                              { title: 'AULA DE VENDAS', speaker: 'DICK BORN', date: '01/04/2026', url: 'https://www.youtube.com/live/CT2c6C4BVfs' },
                              { title: 'PRODUÇÃO DE VÍDEOS', speaker: 'MAIA WILL', date: '25/03/2026', url: 'https://www.youtube.com/live/mrZDbs516t4' },
                              { title: 'GESTÃO FINANCEIRA', speaker: 'SIMONE FREITAS', date: '21/01/2026', url: 'https://www.youtube.com/live/NV1KbDow3hg' },
                              { title: 'GESTÃO EMPRESARIAL', speaker: 'VANDRESSA MOSMANN', date: '10/12/2025', url: 'https://www.youtube.com/live/BLk490Pu7dc' },
                              { title: 'ESTRUTURA DE MARKETING', speaker: 'INGRID MONTEIRO', date: '26/11/2025', url: 'https://www.youtube.com/live/nPFEVrpqKGQ' }
                           ].map((item, idx) => (
                              <a
                                 key={idx}
                                 href={item.url}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="flex items-start justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#F67C01] hover:shadow-lg transition-all group"
                              >
                                 <div>
                                    <p className="text-[10px] font-black text-[#F67C01] uppercase tracking-widest">{item.title}</p>
                                    <p className="text-xs font-bold text-gray-900">{item.speaker} - {item.date}</p>
                                 </div>
                                 <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-[#F67C01] transition-colors" />
                              </a>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

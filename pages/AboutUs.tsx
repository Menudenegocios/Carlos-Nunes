
import React from 'react';
import { Target, Eye, Heart, Rocket, Shield, Users, ArrowRight, Store, Sparkles, CheckCircle, Settings, TrendingUp, Globe, Handshake } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutUs: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-24 pb-32 pt-8 px-6">
      
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest">
           <Sparkles className="w-3 h-3" /> Propósito & Tecnologia
        </div>
         <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-tight max-w-4xl mx-auto uppercase italic overflow-visible">
          Menu de Negócios <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] title-fix">Plataforma All-in-One.</span>
         </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Nascemos para simplificar a gestão e potencializar o crescimento de quem faz a economia girar. Conectar, gerenciar e escalar em um único ecossistema.
        </p>
      </section>

      {/* 2. BENTO MISSION/VISION/VALUES */}
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { title: "Missão", icon: Target, bg: "bg-indigo-50", color: "text-indigo-600", desc: "Eliminar a complexidade tecnológica para pequenos negócios, centralizando as melhores ferramentas de gestão e marketing em um só lugar." },
          { title: "Visão", icon: Eye, bg: "bg-purple-50", color: "text-purple-600", desc: "Ser o ecossistema definitivo para o empreendedor moderno, unindo tecnologia de ponta com uma rede de networking B2B incomparável." },
          { title: "Valores", icon: Heart, bg: "bg-emerald-50", color: "text-emerald-600", desc: "Transparência, inovação acessível e a crença de que o crescimento de um negócio fortalece toda a comunidade ao seu redor." }
        ].map((item, i) => (
          <div key={i} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-lg space-y-6 group hover:shadow-2xl hover:-translate-y-2 transition-all">
            <div className={`w-16 h-16 rounded-[1.5rem] ${item.bg} ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <item.icon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-gray-900">{item.title}</h3>
            <p className="text-gray-500 font-medium leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* 3. STORY SECTION */}
      <section className="bg-white rounded-[4rem] p-12 md:p-24 border border-gray-100 shadow-2xl relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 relative z-10">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Nascemos de uma <br/><span className="text-indigo-600">Dor Real.</span></h2>
            <div className="space-y-6 text-gray-500 font-medium leading-relaxed text-lg">
                <p className="font-black text-gray-900 italic">
                  O empreendedor perde muito tempo tentando organizar ferramentas que não conversam entre si.
                </p>
                <p>
                  Planilhas financeiras de um lado, agenda no papel, site desatualizado e clientes perdidos no WhatsApp. Acreditamos que a tecnologia deve trabalhar para você, e não o contrário.
                </p>
                <p>
                  Por isso, construímos uma plataforma All-in-One onde você pode:
                </p>
                <ul className="space-y-3">
                  {[
                    { text: "Ter sua vitrine digital profissional em minutos", icon: Globe },
                    { text: "Gerenciar clientes e vendas com um CRM integrado", icon: Users },
                    { text: "Controlar sua agenda e financeiro sem complicação", icon: Settings },
                    { text: "Fechar negócios B2B dentro da própria rede", icon: Handshake },
                    { text: "Escalar seus resultados com nosso sistema de recompensas", icon: TrendingUp }
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm font-bold">
                      <item.icon className="w-5 h-5 text-emerald-500" />
                      {item.text}
                    </li>
                  ))}
                </ul>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[3.5rem] overflow-hidden rotate-3 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-4 border-zinc-800 bg-black">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200" 
                  className="w-full h-full object-cover opacity-80 transition-transform duration-1000 hover:scale-110" 
                  alt="Equipe trabalhando e crescendo" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-brand-primary p-8 rounded-[2.5rem] shadow-2xl animate-float z-20">
                <Rocket className="w-10 h-10 text-white mb-4" />
                <p className="font-black text-white text-lg leading-tight uppercase tracking-tighter">Crescimento <br/>Acelerado</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MENU CLUB SECTION */}
      <section className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
           <div className="bg-indigo-600 rounded-[3.5rem] p-12 text-white space-y-8 shadow-2xl">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-black tracking-tight leading-none italic uppercase">Muito mais que um software. Um Ecossistema.</h2>
              <p className="text-indigo-100 text-lg font-medium leading-relaxed">
                O Menu de Negócios não é apenas uma caixa de ferramentas. É uma comunidade ativa onde a colaboração gera expansão.
              </p>
              <div className="grid grid-cols-1 gap-4">
                {[
                  "Conecte-se com fornecedores e parceiros locais.",
                  "Ganhe Menu Cash ao indicar e fechar negócios.",
                  "Suba de nível e ganhe destaque na Vitrine Global."
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                    <p className="font-bold text-sm">{text}</p>
                  </div>
                ))}
              </div>
           </div>
        </div>
        <div className="space-y-8 order-1 lg:order-2">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none">
            A união perfeita entre <br/><span className="text-brand-primary">Gestão e Networking.</span>
          </h2>
          <div className="space-y-6 text-gray-500 font-medium leading-relaxed text-lg">
            <p>
              Nós resolvemos a parte chata da gestão para que você tenha tempo de focar no que realmente importa: crescer e se conectar.
            </p>
            <div className="flex flex-col gap-2 font-black text-2xl text-gray-900 uppercase italic tracking-tighter">
              <p className="flex items-center gap-3"><ArrowRight className="w-6 h-6 text-brand-primary" /> Somos a Ferramenta.</p>
              <p className="flex items-center gap-3"><ArrowRight className="w-6 h-6 text-brand-primary" /> Somos a Vitrine.</p>
              <p className="flex items-center gap-3"><ArrowRight className="w-6 h-6 text-brand-primary" /> Somos o Networking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TEAM CALL TO ACTION */}
      <section className="bg-gray-900 rounded-[3.5rem] p-16 text-center text-white relative overflow-hidden">
        <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Pronto para centralizar e escalar o seu negócio?</h2>
            <p className="text-gray-400 text-lg font-medium leading-relaxed">Junte-se a centenas de empreendedores que já estão usando a plataforma All-in-One definitiva.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
                <Link to="/register" className="bg-brand-primary text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
                    CRIAR MINHA CONTA
                </Link>
                <Link to="/vitrine" className="bg-white/10 text-white border border-white/20 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all">
                    EXPLORAR A VITRINE
                </Link>
            </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px]"></div>
      </section>
    </div>
  );
};

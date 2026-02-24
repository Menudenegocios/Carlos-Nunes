
import React from 'react';
import { Target, Eye, Heart, Rocket, Shield, Users, ArrowRight, Store, Sparkles, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutUs: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-24 pb-32 pt-8 px-6">
      
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest">
           <Sparkles className="w-3 h-3" /> Propósito & Tecnologia
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-none max-w-4xl mx-auto">
          O ecossistema onde <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#F67C01] to-[#9333EA] dark:from-brand-primary dark:to-brand-accent">Empreendedores fortalecem Empreendedores.</span>
        </h1>
        <p className="text-xl text-gray-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed">
          O Menu de Negócios é um ecossistema de economia colaborativa criado para fortalecer empreendedores.
        </p>
      </section>

      {/* 2. BENTO MISSION/VISION/VALUES */}
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { title: "Missão", icon: Target, bg: "bg-indigo-50", color: "text-indigo-600", desc: "Eliminar barreiras tecnológicas para pequenos negócios, fornecendo ferramentas de elite para o marketing digital regional." },
          { title: "Visão", icon: Eye, bg: "bg-purple-50", color: "text-purple-600", desc: "Ser o ecossistema número um em conexões locais no Brasil, sendo a ponte definitiva entre o consumidor e a oferta regional." },
          { title: "Valores", icon: Heart, bg: "bg-emerald-50", color: "text-emerald-600", desc: "Transparência total (zero comissões), inovação acessível e o fortalecimento da comunidade regional como centro de tudo." }
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-gray-100 dark:border-zinc-800 shadow-lg space-y-6 group hover:shadow-2xl hover:-translate-y-2 transition-all">
            <div className={`w-16 h-16 rounded-[1.5rem] ${item.bg} ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <item.icon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{item.title}</h3>
            <p className="text-gray-500 dark:text-zinc-400 font-medium leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* 3. STORY SECTION */}
      <section className="bg-white dark:bg-zinc-900 rounded-[4rem] p-12 md:p-24 border border-gray-100 dark:border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 relative z-10">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none">Nascemos com um <br/><span className="text-indigo-600 dark:text-brand-primary">Propósito Claro.</span></h2>
            <div className="space-y-6 text-gray-500 dark:text-zinc-400 font-medium leading-relaxed text-lg">
                <p className="font-black text-gray-900 dark:text-white italic">
                  Transformar conexões em negócios e negócios em crescimento.
                </p>
                <p>
                  Acreditamos que empreender não precisa ser uma jornada solitária. Quando empreendedores se conectam dentro do ambiente certo, o crescimento deixa de ser individual e passa a ser coletivo.
                </p>
                <p>
                  Por isso, construímos uma plataforma completa onde o empreendedor pode:
                </p>
                <ul className="space-y-3">
                  {[
                    { text: "Apresentar seus produtos e serviços com o Menu Pages", icon: CheckCircle },
                    { text: "Organizar e qualificar seus leads com o Menu CRM", icon: CheckCircle },
                    { text: "Controlar sua operação financeira e agenda", icon: CheckCircle },
                    { text: "Fechar negócios dentro da própria rede", icon: CheckCircle },
                    { text: "Participar de uma economia interna ativa através do Menu Club", icon: CheckCircle }
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
                  src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1200" 
                  className="w-full h-full object-cover opacity-80 transition-transform duration-1000 hover:scale-110" 
                  alt="Networking e Conexões" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-brand-primary p-8 rounded-[2.5rem] shadow-2xl animate-float z-20">
                <Users className="w-10 h-10 text-white mb-4" />
                <p className="font-black text-white text-lg leading-tight uppercase tracking-tighter">Conexão <br/>Estratégica</p>
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
              <h2 className="text-4xl font-black tracking-tight leading-none italic uppercase">O Menu Club é o motor do nosso ecossistema.</h2>
              <p className="text-indigo-100 text-lg font-medium leading-relaxed">
                Ele incentiva indicações, negócios B2B e movimentação interna por meio do Menu Cash, nossa moeda colaborativa.
              </p>
              <div className="grid grid-cols-1 gap-4">
                {[
                  "Aqui, o dinheiro circula entre os membros.",
                  "Aqui, a visibilidade é conquistada por movimento.",
                  "Aqui, quem participa cresce."
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
          <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
            Não somos apenas uma <br/><span className="text-brand-primary">Plataforma de Ferramentas.</span>
          </h2>
          <div className="space-y-6 text-gray-500 dark:text-zinc-400 font-medium leading-relaxed text-lg">
            <p>
              Somos um ambiente estratégico para quem deseja evoluir dentro de uma rede ativa de empreendedores. O Menu de Negócios foi criado para quem entende que colaboração gera expansão.
            </p>
            <div className="flex flex-col gap-2 font-black text-2xl text-gray-900 dark:text-white uppercase italic tracking-tighter">
              <p className="flex items-center gap-3"><ArrowRight className="w-6 h-6 text-brand-primary" /> Somos tecnologia.</p>
              <p className="flex items-center gap-3"><ArrowRight className="w-6 h-6 text-brand-primary" /> Somos comunidade.</p>
              <p className="flex items-center gap-3"><ArrowRight className="w-6 h-6 text-brand-primary" /> Somos movimento.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TEAM CALL TO ACTION */}
      <section className="bg-gray-900 rounded-[3.5rem] p-16 text-center text-white relative overflow-hidden">
        <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Somos o ecossistema onde empreendedores fortalecem empreendedores.</h2>
            <p className="text-gray-400 text-lg font-medium leading-relaxed">Junte-se à maior rede de colaboração regional e transforme seu negócio hoje mesmo.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
                <Link to="/register" className="bg-white text-gray-900 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-2xl active:scale-95">
                    CADASTRAR MEU NEGÓCIO
                </Link>
                <Link to="/partners" className="bg-white/10 text-white border border-white/20 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all">
                    SEJA UM PARCEIRO
                </Link>
            </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]"></div>
      </section>
    </div>
  );
};

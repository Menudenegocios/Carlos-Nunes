
import React from 'react';
import { Target, Eye, Heart, Rocket, Shield, Users, ArrowRight, Store, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutUs: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-24 pb-32 pt-8 px-6">
      
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest">
           <Sparkles className="w-3 h-3" /> Propósito & Tecnologia
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none max-w-4xl mx-auto">
          Acreditamos no potencial do <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Comércio Local.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
          O Menu de Negócios nasceu para dar voz e visibilidade aos empreendedores que movem a economia real: os vizinhos, os autônomos e as pequenas empresas regionais.
        </p>
      </section>

      {/* 2. BENTO MISSION/VISION/VALUES */}
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { title: "Missão", icon: Target, bg: "bg-indigo-50", color: "text-indigo-600", desc: "Eliminar barreiras tecnológicas para pequenos negócios, fornecendo ferramentas de elite para o marketing digital regional." },
          { title: "Visão", icon: Eye, bg: "bg-purple-50", color: "text-purple-600", desc: "Ser o ecossistema número um em conexões locais no Brasil, sendo a ponte definitiva entre o consumidor e a oferta regional." },
          { title: "Valores", icon: Heart, bg: "bg-emerald-50", color: "text-emerald-600", desc: "Transparência total (zero comissões), inovação acessível e o fortalecimento da comunidade regional como centro de tudo." }
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
            <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Por que o <br/><span className="text-indigo-600">Menu de Negócios?</span></h2>
            <div className="space-y-6 text-gray-500 font-medium leading-relaxed text-lg">
                <p>
                Em um mundo dominado por grandes marketplaces que cobram taxas abusivas, percebemos que o pequeno empreendedor estava perdendo sua margem de lucro apenas para estar online.
                </p>
                <p>
                Criamos uma plataforma onde o foco não é a transação intermediada por nós, mas a conexão direta entre você e seu cliente no WhatsApp. Sem taxas ocultas, sem burocracia, apenas resultado real.
                </p>
            </div>
            <div className="pt-6 flex gap-10">
                <div>
                    <p className="text-4xl font-black text-indigo-600">5k+</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Usuários Ativos</p>
                </div>
                <div className="w-px h-12 bg-gray-100"></div>
                <div>
                    <p className="text-4xl font-black text-indigo-600">100k</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Leads Gerados</p>
                </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[3rem] overflow-hidden rotate-3 shadow-2xl border-8 border-gray-50">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Equipe" />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-indigo-600 p-8 rounded-[2.5rem] shadow-2xl animate-float">
                <Users className="w-10 h-10 text-white mb-4" />
                <p className="font-black text-white text-lg leading-tight">Comunidade <br/>Forte</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[80px] -mb-40 -mr-40"></div>
      </section>

      {/* 4. TEAM CALL TO ACTION */}
      <section className="bg-gray-900 rounded-[3.5rem] p-16 text-center text-white relative overflow-hidden">
        <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Faça parte desta revolução local.</h2>
            <p className="text-gray-400 text-lg font-medium leading-relaxed">Seja você um artesão, um profissional liberal ou dono de comércio, o Menu de Negócios é o seu lugar para crescer.</p>
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

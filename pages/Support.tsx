
import React from 'react';
import { Mail, MessageCircle, ArrowLeft, LifeBuoy, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Support: React.FC = () => {
  const whatsappNumber = "5511999999999";
  const supportEmail = "suporte@menudenegocios.com.br";

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-[fade-in_0.6s_ease-out]">
      <Link 
        to="/dashboard" 
        className="flex items-center gap-2 text-brand-primary font-black text-[10px] uppercase tracking-widest mb-4 hover:opacity-70 transition-all w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
      </Link>

      <div className="bg-brand-contrast rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center border border-white/20">
            <LifeBuoy className="w-10 h-10 text-brand-primary animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight title-fix">Estamos aqui para <br/>ajudar você.</h1>
          <p className="text-brand-secondary text-lg font-medium max-w-xl">Nosso time de especialistas está pronto para tirar suas dúvidas e apoiar o crescimento do seu negócio.</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] p-10 border border-brand-secondary/30 shadow-sm space-y-8 group hover:shadow-xl transition-all">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-110">
            <MessageCircle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-brand-contrast mb-2">WhatsApp</h2>
            <p className="text-brand-contrast font-bold text-sm leading-relaxed">
              Atendimento rápido para dúvidas técnicas e suporte imediato sobre ferramentas.
            </p>
          </div>
          <a 
            href={`https://wa.me/${whatsappNumber}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest text-center shadow-lg hover:bg-emerald-700 transition-all"
          >
            Falar no WhatsApp
          </a>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 border border-brand-secondary/30 shadow-sm space-y-8 group hover:shadow-xl transition-all">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 transition-transform group-hover:scale-110">
            <Mail className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-brand-contrast mb-2">E-mail</h2>
            <p className="text-brand-contrast font-bold text-sm leading-relaxed">
              Ideal para questões de faturamento, parcerias ou solicitações mais detalhadas.
            </p>
          </div>
          <a 
            href={`mailto:${supportEmail}`}
            className="block w-full py-5 bg-brand-contrast text-white rounded-2xl font-black text-xs uppercase tracking-widest text-center shadow-lg hover:opacity-90 transition-all"
          >
            Enviar E-mail
          </a>
        </div>
      </div>

      <div className="bg-brand-surface rounded-[2.5rem] p-8 border border-brand-secondary/20 flex flex-col md:flex-row justify-between gap-8 items-center">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm"><Clock className="w-6 h-6 text-brand-primary" /></div>
           <div>
              <p className="text-[10px] font-black text-brand-secondary uppercase tracking-widest">Horário de Atendimento</p>
              <p className="text-brand-contrast font-bold">Segunda \u00e0 Sexta, das 09h \u00e0s 18h</p>
           </div>
        </div>
        <div className="flex items-center gap-3 text-brand-contrast">
           <CheckCircle className="w-5 h-5 text-brand-primary" />
           <span className="text-xs font-black uppercase tracking-widest">Tempo de resposta médio: 2h</span>
        </div>
      </div>
    </div>
  );
};

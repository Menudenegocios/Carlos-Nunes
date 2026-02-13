
import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32 pt-8 px-6 animate-[fade-in_0.6s_ease-out]">
      <Link 
        to="/" 
        className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-12 hover:bg-indigo-50 w-fit px-6 py-3 rounded-2xl transition-all border border-indigo-100"
      >
        <ChevronLeft className="w-4 h-4" /> VOLTAR PARA O INÍCIO
      </Link>

      <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl mb-16">
        <div className="relative z-10">
          <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl w-fit mb-6">
            <ShieldCheck className="h-10 w-10 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Política de Privacidade</h1>
          <p className="text-indigo-200 text-lg font-medium max-w-xl">Como protegemos seus dados e garantimos sua transparência no Menu de Negócios.</p>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-gray-100 shadow-xl space-y-12 text-gray-700 leading-relaxed font-medium">
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <Lock className="text-indigo-600" /> 1. Introdução
          </h2>
          <p>
            O Menu de Negócios valoriza a privacidade dos seus usuários. Esta política descreve como coletamos, usamos e protegemos suas informações pessoais quando você utiliza nossa plataforma de conexão local inteligente.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <Eye className="text-indigo-600" /> 2. Informações que Coletamos
          </h2>
          <ul className="list-disc pl-6 space-y-3">
            <li><strong>Dados de Registro:</strong> Nome, e-mail, senha e dados do negócio para criação do perfil.</li>
            <li><strong>Perfil Digital:</strong> Informações que você opta por tornar públicas, como nome fantasia, bio, telefone e links sociais.</li>
            <li><strong>Uso da Plataforma:</strong> Registros de atividades como postagens na comunidade e resgate de cupons para fins de pontuação no Clube ADS.</li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <FileText className="text-indigo-600" /> 3. Uso das Informações
          </h2>
          <p>
            Utilizamos seus dados para:
          </p>
          <ul className="list-disc pl-6 space-y-3">
            <li>Manter e otimizar sua vitrine digital e perfil profissional.</li>
            <li>Facilitar a conexão direta entre você e seus clientes via canais externos (como WhatsApp).</li>
            <li>Gerenciar o sistema de recompensas e autoridade do Clube ADS.</li>
            <li>Enviar notificações importantes sobre sua conta ou novos recursos.</li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-indigo-600" /> 4. Proteção e Compartilhamento
          </h2>
          <p>
            Não vendemos seus dados para terceiros. Suas informações comerciais são expostas apenas conforme configurado por você na Vitrine Digital para atrair clientes. Utilizamos protocolos de segurança modernos para proteger suas informações de acesso não autorizado.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <ChevronLeft className="text-indigo-600 rotate-180" /> 5. Seus Direitos
          </h2>
          <p>
            Você tem o direito de acessar, corrigir ou excluir seus dados a qualquer momento através do seu Painel de Controle ou entrando em contato com nosso suporte.
          </p>
        </section>

        <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-gray-400 font-bold uppercase">Última atualização: 22 de Outubro de 2024</p>
          <button className="bg-gray-50 text-gray-900 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border border-gray-100 hover:bg-gray-100 transition-all">Imprimir PDF</button>
        </div>
      </div>
    </div>
  );
};

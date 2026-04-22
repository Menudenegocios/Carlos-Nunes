
import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, ChevronLeft, Zap, X, Home as HomeIcon } from 'lucide-react';
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
          <p>
            Bem-vindo ao Menu de Negócios. A sua privacidade e a segurança dos seus dados são prioridades fundamentais para nós. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos as suas informações ao utilizar nossa plataforma, incluindo o uso de métodos de login social (Google Login).
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <Lock className="text-indigo-600" /> 1. Identificação do Controlador
          </h2>
          <p>
            Este site e plataforma são operados por Menu de Negócios, sob responsabilidade da empresa inscrita no CNPJ nº 34.718.659/0001-08, com sede no Rio Grande do Sul, Brasil.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <Eye className="text-indigo-600" /> 2. Informações que Coletamos
          </h2>
          <p>Para oferecer as ferramentas de gestão, vitrine digital e marketplace, coletamos os seguintes dados:</p>
          <ul className="list-disc pl-6 space-y-4">
            <li><strong>Dados de Autenticação (Google OAuth):</strong> Ao utilizar sua conta Google para acessar o Menu de Negócios, recebemos seu nome, endereço de e-mail, idioma de preferência e foto de perfil. Esses dados são utilizados exclusivamente para autenticação e criação de perfil.</li>
            <li><strong>Dados de Perfil Profissional:</strong> Informações sobre seu negócio, CNPJ/CPF, descrição de serviços e contatos comerciais inseridos voluntariamente por você.</li>
            <li><strong>Dados de Uso:</strong> Informações sobre como você interage com a plataforma (CRM e Marketplace) para fins de melhoria de performance.</li>
            <li><strong>Dados Financeiros e de Gestão:</strong> Ao utilizar as funcionalidades de ERP e Gestão Financeira, a plataforma processa informações inseridas por você, como registros de vendas, fluxo de caixa, contas a pagar/receber e dados de faturamento. Esses dados são tratados como estritamente confidenciais.</li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <FileText className="text-indigo-600" /> 3. Finalidade do Tratamento de Dados
          </h2>
          <p>Utilizamos os dados coletados para:</p>
          <ul className="list-disc pl-6 space-y-3">
            <li><strong>Autenticação:</strong> Permitir o acesso seguro via Google Login.</li>
            <li><strong>Operação da Plataforma:</strong> Viabilizar o uso do CRM e a exibição da sua Vitrine Digital.</li>
            <li><strong>Comunicação:</strong> Enviar notificações sobre atualizações do sistema e suporte técnico.</li>
            <li><strong>Gestão de Negócios:</strong> Os dados financeiros são processados exclusivamente para gerar os relatórios, gráficos e automações dentro do seu painel de controle, auxiliando na sua tomada de decisão.</li>
            <li><strong>Privacidade de Dados de Terceiros:</strong> O Menu de Negócios atua apenas como operador dos dados de clientes que você cadastrar no seu CRM ou Financeiro. Nós não acessamos, utilizamos ou compartilhamos as informações dos seus clientes finais para fins próprios.</li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-indigo-600" /> 4. Compartilhamento de Dados
          </h2>
          <p>
            O Menu de Negócios não vende ou aluga seus dados pessoais para terceiros. O compartilhamento ocorre apenas com parceiros tecnológicos necessários para a operação (como hospedagem) ou quando você decide exibir seus dados publicamente na sua Vitrine Digital para atrair clientes.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <Zap className="text-indigo-600" /> 5. Google API – Uso de Dados
          </h2>
          <p>
            O uso de informações recebidas das APIs do Google pelo Menu de Negócios obedece à <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">Política de Dados do Usuário dos Serviços de API do Google</a>. Não utilizamos dados obtidos via Google para servir anúncios ou fornecer informações a corretores de dados.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <X className="text-indigo-600" /> 6. Seus Direitos e Exclusão de Dados
          </h2>
          <p>
            Em conformidade com a LGPD, você possui o direito de acessar, corrigir ou excluir seus dados a qualquer momento.
          </p>
          <p>
            Para solicitar a exclusão definitiva da sua conta e de todos os dados associados, envie um e-mail para: <a href="mailto:nunesempreendedor@gmail.com" className="text-indigo-600 font-bold">nunesempreendedor@gmail.com</a>.
          </p>
          <p className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-800 text-sm">
            A exclusão será processada em até 7 dias úteis.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <HomeIcon className="text-indigo-600" /> 7. Contato
          </h2>
          <p>
            Para qualquer dúvida sobre esta política, entre em contato através do e-mail de suporte: <a href="mailto:nunesempreendedor@gmail.com" className="text-indigo-600 font-bold">nunesempreendedor@gmail.com</a>.
          </p>
        </section>

        <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-gray-400 font-bold uppercase">Última atualização: 22 de abril de 2026</p>
          <button onClick={() => window.print()} className="bg-gray-50 text-gray-900 px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border border-gray-100 hover:bg-gray-100 transition-all">Imprimir Página</button>
        </div>
      </div>
    </div>
  );
};

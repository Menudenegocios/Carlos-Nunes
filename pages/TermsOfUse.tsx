
import React from 'react';
import { Gavel, CheckCircle2, AlertTriangle, Users, ChevronLeft, Scale, Shield, Database, Zap, XCircle, RefreshCw, MapPin, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsOfUse: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32 pt-8 px-6 animate-[fade-in_0.6s_ease-out]">
      <Link 
        to="/" 
        className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-12 hover:bg-indigo-50 w-fit px-6 py-3 rounded-2xl transition-all border border-indigo-100"
      >
        <ChevronLeft className="w-4 h-4" /> VOLTAR PARA O INÍCIO
      </Link>

      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl mb-16">
        <div className="relative z-10">
          <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl w-fit mb-6">
            <Gavel className="h-10 w-10 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Termos e Condições de Uso</h1>
          <p className="text-indigo-200 text-lg font-medium max-w-xl">Bem-vindo ao Menu de Negócios. Ao utilizar nossa plataforma, você concorda em cumprir os seguintes termos.</p>
        </div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-gray-100 shadow-xl space-y-12 text-gray-700 leading-relaxed font-medium">
        <section className="space-y-6">
          <p>
            Bem-vindo ao Menu de Negócios. Ao acessar ou utilizar nossa plataforma, você concorda em cumprir e estar vinculado aos seguintes Termos e Condições de Uso. Caso não concorde com qualquer parte destes termos, você não deve utilizar nossos serviços.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <Briefcase className="text-indigo-600" /> 1. Objeto da Plataforma
          </h2>
          <p>O Menu de Negócios é um ecossistema digital que oferece ferramentas de:</p>
          <ul className="list-disc pl-6 space-y-3">
            <li><strong>Vitrine Digital:</strong> Exposição de produtos e serviços.</li>
            <li><strong>CRM e Vendas:</strong> Gestão de relacionamento com clientes.</li>
            <li><strong>ERP Financeiro:</strong> Controle de fluxo de caixa e gestão de negócios.</li>
            <li><strong>Marketplace B2B:</strong> Conexão entre empreendedores.</li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <Users className="text-indigo-600" /> 2. Elegibilidade e Cadastro
          </h2>
          <p>Para utilizar as funcionalidades completas, o usuário deve realizar um cadastro fornecendo informações verídicas e atualizadas.</p>
          <ul className="list-disc pl-6 space-y-3">
            <li>Você é o único responsável por manter a confidencialidade de sua senha e conta.</li>
            <li>O uso da plataforma por menores de 18 anos deve ser supervisionado pelos responsáveis legais.</li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <Database className="text-indigo-600" /> 3. Responsabilidade sobre Dados de Negócios (ERP/CRM)
          </h2>
          <ul className="list-disc pl-6 space-y-4">
            <li><strong>Propriedade dos Dados:</strong> Os dados financeiros e de clientes inseridos na plataforma pertencem exclusivamente ao usuário.</li>
            <li><strong>Precisão:</strong> O Menu de Negócios não se responsabiliza por erros de cálculo decorrentes de dados inseridos incorretamente pelo usuário.</li>
            <li><strong>Conformidade:</strong> O usuário é o controlador dos dados de seus próprios clientes finais, devendo respeitar a LGPD ao coletar informações em sua Vitrine Digital.</li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <Zap className="text-indigo-600" /> 4. Uso do Login Social (Google)
          </h2>
          <p>
            Ao utilizar o login via Google, o usuário autoriza o Menu de Negócios a acessar informações básicas de perfil para fins de autenticação. O uso dessas informações segue rigorosamente nossa Política de Privacidade.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <Shield className="text-indigo-600" /> 5. Propriedade Intelectual
          </h2>
          <p>
            Todo o conteúdo da plataforma (logotipos, design, software, textos) é de propriedade do Menu de Negócios ou licenciado para ele. É proibida a reprodução ou engenharia reversa do sistema sem autorização prévia.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <AlertTriangle className="text-indigo-600" /> 6. Limitação de Responsabilidade
          </h2>
          <p>
            O Menu de Negócios se esforça para manter a plataforma disponível 24/7, mas não garante que o serviço será ininterrupto ou livre de erros. Não nos responsabilizamos por:
          </p>
          <ul className="list-disc pl-6 space-y-3">
            <li>Falhas de conexão de internet do usuário.</li>
            <li>Negociações realizadas entre usuários no Marketplace B2B.</li>
            <li>Decisões financeiras tomadas com base nos relatórios do ERP.</li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <XCircle className="text-indigo-600" /> 7. Cancelamento e Suspensão
          </h2>
          <p>
            Reservamo-nos o direito de suspender contas que violem estes termos, pratiquem atividades ilegais ou utilizem a plataforma para spam e fraudes. O usuário pode cancelar sua assinatura a qualquer momento através das configurações do painel.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <RefreshCw className="text-indigo-600" /> 8. Alterações nos Termos
          </h2>
          <p>
            Podemos atualizar estes termos periodicamente. O uso continuado da plataforma após as alterações constitui aceitação dos novos termos.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <MapPin className="text-indigo-600" /> 9. Foro e Contato
          </h2>
          <p>
            Para dúvidas sobre estes termos, entre em contato através do e-mail: <a href="mailto:nunesempreendedor@gmail.com" className="text-indigo-600 font-bold">nunesempreendedor@gmail.com</a>. Fica eleito o foro da Comarca de Porto Alegre/RS para dirimir quaisquer questões relativas a este documento.
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

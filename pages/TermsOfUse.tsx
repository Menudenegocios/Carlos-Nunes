
import React from 'react';
import { Gavel, CheckCircle2, AlertTriangle, Users, ChevronLeft, Scale } from 'lucide-react';
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
            <Scale className="h-10 w-10 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Termos de Uso</h1>
          <p className="text-indigo-200 text-lg font-medium max-w-xl">As regras do jogo para uma comunidade empreendedora segura e produtiva.</p>
        </div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-gray-100 shadow-xl space-y-12 text-gray-700 leading-relaxed font-medium">
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <CheckCircle2 className="text-indigo-600" /> 1. Aceitação dos Termos
          </h2>
          <p>
            Ao acessar ou utilizar o Menu de Negócios, você concorda integralmente com estes termos. Se você não concorda com qualquer parte destas regras, não deverá utilizar nossos serviços.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <Users className="text-indigo-600" /> 2. Elegibilidade e Conduta
          </h2>
          <p>
            Nossa plataforma é destinada a empreendedores, freelancers e profissionais liberais reais. Você se compromete a fornecer informações verídicas e a manter uma conduta ética na comunidade, sendo proibido:
          </p>
          <ul className="list-disc pl-6 space-y-3">
            <li>Anunciar produtos ou serviços ilegais.</li>
            <li>Praticar spam ou assédio contra outros membros.</li>
            <li>Tentar fraudar o sistema de pontuação do Clube ADS.</li>
          </ul>
        </section>

        <section className="space-y-6 p-8 bg-indigo-50 rounded-[2rem] border border-indigo-100">
          <h2 className="text-2xl font-black text-indigo-900 uppercase tracking-tight flex items-center gap-3">
            <AlertTriangle className="text-orange-500" /> 3. Isenção de Responsabilidade
          </h2>
          <p className="text-indigo-800">
            <strong>O Menu de Negócios é uma ferramenta de conexão, não uma plataforma de intermediação financeira obrigatória.</strong>
          </p>
          <p className="text-sm text-indigo-700">
            Não nos responsabilizamos pela entrega, qualidade ou pagamento de transações feitas diretamente entre usuários fora de nossos sistemas proprietários (como no caso de contatos via WhatsApp). Atuamos como vitrine, e a confiança mútua é a base das conexões locais.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <Gavel className="text-indigo-600" /> 4. Propriedade Intelectual
          </h2>
          <p>
            Todo o design, tecnologia e marcas associadas ao Menu de Negócios são de nossa propriedade exclusiva. Você mantém a propriedade das fotos e informações enviadas ao seu perfil, mas nos concede licença para exibi-las em nossa rede de parceiros e diretórios locais.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <Scale className="text-indigo-600" /> 5. Modificações e Rescisão
          </h2>
          <p>
            Reservamo-nos o direito de modificar estes termos para refletir mudanças tecnológicas ou legais. O uso continuado da plataforma após as alterações constitui aceitação dos novos termos. Podemos suspender perfis que violem estas regras.
          </p>
        </section>

        <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-gray-400 font-bold uppercase">Última atualização: 22 de Outubro de 2024</p>
          <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic">Menu de Negócios Connect Local</p>
        </div>
      </div>
    </div>
  );
};

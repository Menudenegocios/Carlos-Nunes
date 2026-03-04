export const pointsRules = {
  indicacaoBasico: 120,
  indicacaoPro: 350,
  compraVitrine: 1, // 1 ponto a cada R$1 gasto
  loginDiario: 5,
  publicacaoBlog: 20,
  fecharNegocio: 50,
};

export const tiers = [
  {
    name: 'Elite',
    points: 300,
    color: 'bg-indigo-600',
    criteria: 'Mínimo 1 indicação Direta',
    description: 'Elite é ativação no ecossistema.',
    benefits: ['Ativação no ecossistema', 'Acesso ao Menu Club', 'Bio Digital Básica']
  },
  {
    name: 'Bronze',
    points: 800,
    color: 'bg-orange-900',
    criteria: 'Mínimo 3 indicações Diretas',
    description: 'Bronze é consistência.',
    benefits: ['5% de Menu Cash', 'Selo de Membro Bronze', 'Perfil visível no diretório']
  },
  {
    name: 'Prata',
    points: 2000,
    color: 'bg-slate-400',
    criteria: 'Mínimo 5 indicações Diretas',
    description: 'Prata é engajamento.',
    benefits: ['10% de Menu Cash', 'Maior visibilidade', 'Selo de Membro Prata']
  },
  {
    name: 'Ouro',
    points: 5000,
    color: 'bg-yellow-500',
    criteria: 'Mínimo 10 indicações Diretas',
    description: 'Ouro é posicionamento.',
    benefits: ['15% de Menu Cash', 'Destaque Prioritário', 'Selo de Verificado Oficial']
  },
  {
    name: 'Diamante',
    points: 12000,
    color: 'bg-blue-500',
    criteria: 'Mínimo 20 indicações Diretas',
    description: 'Diamante é autoridade.',
    benefits: ['20% de Menu Cash', 'Autoridade Máxima', 'Destaque Prioritário Máximo', 'Publicação de 3 produtos na Vitrine', 'Ganha acesso Plano PRO']
  }
];

export const plans = {
  basico: {
    semestral: 297,
    anual: 497,
  },
  pro: {
    semestral: 597,
    anual: 897,
  }
};

export const rankingRules = {
  top10Badge: true,
  top3Highlight: true,
};

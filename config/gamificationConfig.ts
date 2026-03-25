export const pointsRules = {
  indicacaoBasico: 50,
  indicacaoPro: 100,
  indicacaoFull: 200,
  compraMenuStore: 1, // 1 ponto a cada R$1 gasto
  loginDiario: 5,
  pontosExtras: 50,
};

export const tiers = [
  {
    name: 'Nível Base',
    points: 0,
    color: 'bg-slate-500',
    criteria: '0 Indicações',
    description: 'Você acabou de chegar.',
    benefits: [
      'Pode comprar ofertas na Menu Store usando Menu Cash',
      'Não pode criar ofertas'
    ]
  },
  {
    name: 'Bronze',
    points: 300,
    color: 'bg-orange-900',
    criteria: 'Mínimo 1 Indicação + 300 pontos',
    description: 'O Grande Desbloqueio!',
    benefits: [
      '5% Menu Cash',
      'Reconhecimento selo bronze'
    ]
  },
  {
    name: 'Prata',
    points: 1000,
    color: 'bg-slate-400',
    criteria: '3 Indicações + 1000 pontos',
    description: 'Destaque na Vitrine.',
    benefits: [
      'Sua vitrine ganha destaque na Página principal',
      '10% Menu Cash',
      'Reconhecimento selo prata'
    ]
  },
  {
    name: 'Ouro',
    points: 2000,
    color: 'bg-yellow-500',
    criteria: '6 Indicações + 2000 pontos',
    description: 'Autoridade na rede',
    benefits: [
      'Destaque no marketplace (selo ouro)',
      '15% Menu Cash',
      'Reconhecimento selo ouro'
    ]
  },
  {
    name: 'Diamante',
    points: 4000,
    color: 'bg-blue-500',
    criteria: '10 Indicações + 4000 pontos',
    description: 'O topo da plataforma.',
    benefits: [
      '1 Licença PRO de 6 meses',
      '20% Menu Cash',
      'Reconhecimento selo diamante'
    ]
  }
];

export const plans = {
  comunidade: {
    anual: 249.00,
  },
  fundador: {
    anual: 549.00,
  },
  fundador_pro: {
    anual: 1497.00,
  }
};

export const rankingRules = {
  top10Badge: true,
  top3Highlight: true,
};

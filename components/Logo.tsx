
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  forceWhite?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", variant = 'full', size = 'md', forceWhite = false }) => {
  const iconSizes = {
    xxs: 'h-6',
    xs: 'h-10',
    sm: 'h-20',
    md: 'h-32',
    lg: 'h-48',
    xl: 'h-64'
  };

  const fontSizes = {
    xxs: { top: 'text-[6px]', bottom: 'text-[12px]', spacing: 'mt-0.5', gap: 'gap-0.5' },
    xs: { top: 'text-[9px]', bottom: 'text-[22px]', spacing: 'mt-1', gap: 'gap-1' },
    sm: { top: 'text-[14px]', bottom: 'text-[36px]', spacing: 'mt-2', gap: 'gap-2' },
    md: { top: 'text-[20px]', bottom: 'text-[52px]', spacing: 'mt-3', gap: 'gap-3' },
    lg: { top: 'text-[28px]', bottom: 'text-[76px]', spacing: 'mt-4', gap: 'gap-4' },
    xl: { top: 'text-[40px]', bottom: 'text-[110px]', spacing: 'mt-6', gap: 'gap-6' }
  };

  const currentFont = fontSizes[size];
  
  // Cor oficial fornecida pelo usuário: #F67C01
  const brandOrange = "#F67C01";
  const iconColor = forceWhite ? "#FFFFFF" : brandOrange;
  const topTextColor = forceWhite ? "#FFFFFF" : "var(--brand-text)"; 
  const bottomTextColor = forceWhite ? "#FFFFFF" : brandOrange;

  return (
    <div className={`flex items-center ${size === 'xs' || size === 'sm' ? 'gap-3' : 'gap-6'} ${className}`}>
      {/* ÍCONE COMPLEXO REPRODUZIDO DA IMAGEM */}
      <svg 
        viewBox="0 0 300 300" 
        className={`${iconSizes[size]} w-auto flex-shrink-0 drop-shadow-sm`}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Estrutura Hexagonal Principal */}
        <path d="M150 40L230 85V175L150 220L70 175V85L150 40Z" stroke={iconColor} strokeWidth="2.5" />
        
        {/* Conexões Internas */}
        <path d="M150 40V220M70 85L230 175M230 85L70 175" stroke={iconColor} strokeWidth="1.5" strokeOpacity="0.6" />
        
        {/* Triângulo Central Invertido */}
        <path d="M150 220L230 85H70L150 220Z" stroke={iconColor} strokeWidth="2" fill={iconColor} fillOpacity="0.05" />

        {/* Nódulos com Ícones */}
        {/* Topo: Dinheiro/Vendas */}
        <circle cx="150" cy="30" r="28" fill="white" stroke={iconColor} strokeWidth="2" />
        <g transform="translate(138, 18) scale(1.1)">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </g>

        {/* Superior Direito: Podcast/Microfone */}
        <circle cx="255" cy="85" r="28" fill="white" stroke={iconColor} strokeWidth="2" />
        <g transform="translate(243, 73) scale(1.1)">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke={iconColor} strokeWidth="2"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke={iconColor} strokeWidth="2"/>
          <line x1="12" y1="19" x2="12" y2="23" stroke={iconColor} strokeWidth="2"/>
          <line x1="8" y1="23" x2="16" y2="23" stroke={iconColor} strokeWidth="2"/>
        </g>

        {/* Inferior Direito: Academy/Quadro */}
        <circle cx="250" cy="185" r="28" fill="white" stroke={iconColor} strokeWidth="2" />
        <g transform="translate(238, 173) scale(1.1)">
          <path d="M2 3h20v14H2z" stroke={iconColor} strokeWidth="2"/>
          <path d="M8 21l2-4M16 21l-2-4" stroke={iconColor} strokeWidth="2"/>
          <path d="M7 10h2M11 8h2M15 12h2" stroke={iconColor} strokeWidth="1.5"/>
        </g>

        {/* Base: Smartphone/Mão (Elemento Crucial da Imagem) */}
        <g transform="translate(110, 225)">
           <rect x="25" y="10" width="35" height="60" rx="6" stroke={iconColor} strokeWidth="2.5" fill="white" />
           <path d="M38 15h10" stroke={iconColor} strokeWidth="2" strokeLinecap="round"/>
           <rect x="38" y="60" width="8" height="4" rx="1" fill={iconColor} />
           <path d="M20 50c-5 0-10 5-10 15s5 15 10 15h30l5-5" stroke={iconColor} strokeWidth="2" strokeLinecap="round"/>
           <path d="M65 30c5 0 8 2 8 5s-3 5-8 5M65 45c5 0 8 2 8 5s-3 5-8 5M65 60c5 0 8 2 8 5s-3 5-8 5" stroke={iconColor} strokeWidth="2" strokeLinecap="round"/>
        </g>

        {/* Inferior Esquerdo: IA/Engrenagem */}
        <circle cx="45" cy="185" r="28" fill="white" stroke={iconColor} strokeWidth="2" />
        <g transform="translate(33, 173) scale(1.1)">
           <circle cx="12" cy="12" r="8" stroke={iconColor} strokeWidth="1.5" strokeDasharray="2 2"/>
           <text x="7" y="15" fill={iconColor} fontSize="8" fontWeight="900" style={{fontFamily: 'Raleway, sans-serif'}}>IA</text>
        </g>

        {/* Superior Esquerdo: Networking/Aperto de Mão */}
        <circle cx="45" cy="85" r="28" fill="white" stroke={iconColor} strokeWidth="2" />
        <g transform="translate(33, 73) scale(1.1)">
          <path d="M18 8a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8Z" stroke={iconColor} strokeWidth="2"/>
          <path d="M10 12l-2 2 4 4 6-6" stroke={iconColor} strokeWidth="2" strokeLinecap="round"/>
        </g>

        {/* Centro: Diamante/Valor */}
        <circle cx="150" cy="125" r="32" fill="white" stroke={iconColor} strokeWidth="2" />
        <g transform="translate(138, 113) scale(1.2)">
          <path d="M6 3h12l4 8-10 10L2 11l4-8z" stroke={iconColor} strokeWidth="2" strokeLinejoin="round"/>
          <path d="M11 3l-3 8 7 10M13 3l3 8-7 10M2 11h20" stroke={iconColor} strokeWidth="1" strokeOpacity="0.4"/>
        </g>
      </svg>

      {variant === 'full' && (
        <div className="flex flex-col leading-none">
          <div className={`flex items-baseline ${currentFont.gap}`}>
            <span className={`font-light tracking-[0.4em] uppercase ${currentFont.top}`} style={{ fontFamily: 'Raleway, sans-serif', color: topTextColor }}>
              MENU DE
            </span>
          </div>
          <span className={`font-black ${currentFont.spacing} ${currentFont.bottom} tracking-tighter`} style={{ fontFamily: 'Raleway, sans-serif', color: bottomTextColor }}>
            negócios
          </span>
        </div>
      )}
    </div>
  );
};


import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  forceWhite?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", variant = 'full', size = 'md', forceWhite = false }) => {
  const iconSizes = {
    xs: 'h-6',
    sm: 'h-10',
    md: 'h-20',
    lg: 'h-32',
    xl: 'h-44'
  };

  const fontSizes = {
    xs: { top: 'text-[6px]', bottom: 'text-[14px]', spacing: '-mt-1.5', gap: 'gap-1' },
    sm: { top: 'text-[8px]', bottom: 'text-[20px]', spacing: '-mt-2', gap: 'gap-1.5' },
    md: { top: 'text-[14px]', bottom: 'text-[36px]', spacing: '-mt-3.5', gap: 'gap-3' },
    lg: { top: 'text-[22px]', bottom: 'text-[58px]', spacing: '-mt-6', gap: 'gap-4' },
    xl: { top: 'text-[32px]', bottom: 'text-[84px]', spacing: '-mt-9', gap: 'gap-6' }
  };

  const currentFont = fontSizes[size];
  const primaryColor = forceWhite ? "#FFFFFF" : "#F67C01";
  const textColor = forceWhite ? "#FFFFFF" : "currentColor";

  return (
    <div className={`flex items-center ${size === 'xs' || size === 'sm' ? 'gap-2' : 'gap-4'} ${className}`}>
      {/* NOVO ÍCONE HEXAGONAL COMPLEXO */}
      <svg 
        viewBox="0 0 200 200" 
        className={`${iconSizes[size]} w-auto flex-shrink-0 drop-shadow-sm`}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Rede Hexagonal Principal */}
        <path d="M100 40L145 65V115L100 140L55 115V65L100 40Z" stroke={primaryColor} strokeWidth="1.5" />
        <path d="M100 25V40M160 55L145 65M160 125L145 115M100 155V140M40 125L55 115M40 55L55 65" stroke={primaryColor} strokeWidth="1" strokeLinecap="round"/>
        <path d="M100 40L55 115M100 40L145 115M55 65L145 65M55 115L145 115" stroke={primaryColor} strokeWidth="0.8" strokeOpacity="0.5"/>

        {/* Círculos dos Vértices com Símbolos */}
        {/* Topo: Moeda/Dinheiro */}
        <circle cx="100" cy="25" r="12" stroke={primaryColor} strokeWidth="1" fill={forceWhite ? "rgba(255,255,255,0.05)" : "rgba(246,124,1,0.05)"}/>
        <path d="M96 22H104M96 28H104M100 20V30" stroke={primaryColor} strokeWidth="0.8"/>
        
        {/* Superior Direito: Microfone */}
        <circle cx="160" cy="55" r="12" stroke={primaryColor} strokeWidth="1"/>
        <rect x="157" y="50" width="6" height="8" rx="3" stroke={primaryColor} strokeWidth="0.8"/>
        <path d="M154 54C154 57 157 59 160 59C163 59 166 57 166 54" stroke={primaryColor} strokeWidth="0.8"/>
        
        {/* Inferior Direito: Gráfico */}
        <circle cx="160" cy="125" r="12" stroke={primaryColor} strokeWidth="1"/>
        <path d="M155 130H165M157 127L160 122L163 125L166 118" stroke={primaryColor} strokeWidth="0.8"/>

        {/* Inferior Esquerdo: IA */}
        <circle cx="40" cy="125" r="12" stroke={primaryColor} strokeWidth="1"/>
        <text x="35" y="128" fill={primaryColor} fontSize="7" fontWeight="900" style={{fontFamily: 'Raleway, sans-serif'}}>IA</text>
        <circle cx="40" cy="125" r="8" stroke={primaryColor} strokeWidth="0.5" strokeDasharray="1 1"/>

        {/* Superior Esquerdo: Aperto de Mãos */}
        <circle cx="40" cy="55" r="12" stroke={primaryColor} strokeWidth="1"/>
        <path d="M35 55L38 52M45 55L42 52M37 57L43 57" stroke={primaryColor} strokeWidth="0.8" strokeLinecap="round"/>

        {/* Centro: Diamante */}
        <path d="M100 75L115 90L100 105L85 90L100 75Z" stroke={primaryColor} strokeWidth="1.5" fill={primaryColor} fillOpacity="0.1"/>
        <circle cx="100" cy="90" r="18" stroke={primaryColor} strokeWidth="1" strokeOpacity="0.3"/>

        {/* Base: Mão com Celular */}
        <g transform="translate(85, 140) scale(0.6)">
            <rect x="10" y="5" width="20" height="35" rx="4" stroke={primaryColor} strokeWidth="2.5"/>
            <path d="M5 45C5 45 8 55 15 55C22 55 25 45 25 45" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M30 15C35 15 38 18 38 22V35" stroke={primaryColor} strokeWidth="2" strokeLinecap="round"/>
            <circle cx="20" cy="32" r="1.5" fill={primaryColor}/>
        </g>
      </svg>

      {variant === 'full' && (
        <div className="flex flex-col">
          <div className={`flex items-baseline ${currentFont.gap}`}>
            <span className={`font-light tracking-[0.4em] uppercase ${currentFont.top}`} style={{ fontFamily: 'Raleway, sans-serif', color: textColor }}>
              MENU
            </span>
            <span className={`font-light tracking-[0.4em] uppercase ${currentFont.top}`} style={{ fontFamily: 'Raleway, sans-serif', color: textColor }}>
              DE
            </span>
          </div>
          <span className={`font-black ${currentFont.spacing} ${currentFont.bottom} tracking-tighter`} style={{ fontFamily: 'Raleway, sans-serif', color: primaryColor }}>
            negócios
          </span>
        </div>
      )}
    </div>
  );
};

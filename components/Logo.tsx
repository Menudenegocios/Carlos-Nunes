
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ className = "", variant = 'full', size = 'md' }) => {
  const iconSizes = {
    xs: 'h-6',
    sm: 'h-9',
    md: 'h-16',
    lg: 'h-28',
    xl: 'h-36'
  };

  const fontSizes = {
    xs: { top: 'text-[7px]', bottom: 'text-[11px]', spacing: '-mt-1', gap: 'gap-1' },
    sm: { top: 'text-[9px]', bottom: 'text-lg', spacing: '-mt-1.5', gap: 'gap-1.5' },
    md: { top: 'text-sm', bottom: 'text-4xl', spacing: '-mt-2.5', gap: 'gap-2' },
    lg: { top: 'text-2xl', bottom: 'text-7xl', spacing: '-mt-4', gap: 'gap-3' },
    xl: { top: 'text-3xl', bottom: 'text-8xl', spacing: '-mt-6', gap: 'gap-4' }
  };

  const currentFont = fontSizes[size];
  const primaryColor = "#F67C01";
  const contrastColor = "#000000";

  return (
    <div className={`flex items-center ${size === 'xs' || size === 'sm' ? 'gap-2' : 'gap-5'} ${className}`}>
      <svg 
        viewBox="0 0 160 160" 
        className={`${iconSizes[size]} w-auto flex-shrink-0 drop-shadow-sm`}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M80 30L120 52V98L80 120L40 98V52L80 30Z" stroke={primaryColor} strokeWidth="1.5" />
        <path d="M80 45L110 95H50L80 45Z" stroke={primaryColor} strokeWidth="1.2" />
        <path d="M80 18V30M133 48L120 52M133 103L120 98M80 132V120M27 103L40 98M27 48L40 52" stroke={primaryColor} strokeWidth="1" />

        <circle cx="80" cy="18" r="10" stroke={primaryColor} fill="white" strokeWidth="1"/>
        <path d="M77 15H83M77 21H83M80 13V23M76 18C76 18 78 16 80 16C82 16 84 18 84 18" stroke={primaryColor} strokeWidth="0.8"/>
        
        <circle cx="133" cy="48" r="10" stroke={primaryColor} fill="white" strokeWidth="1"/>
        <rect x="130" y="43" width="6" height="8" rx="3" stroke={primaryColor} strokeWidth="0.8"/>
        <path d="M128 47C128 50 130 52 133 52C136 52 138 50 138 47M133 52V55" stroke={primaryColor} strokeWidth="0.8"/>
        
        <circle cx="133" cy="103" r="10" stroke={primaryColor} fill="white" strokeWidth="1"/>
        <rect x="128" y="99" width="10" height="7" stroke={primaryColor} strokeWidth="0.8"/>
        <path d="M130 102H136M133 106L131 109M133 106L135 109" stroke={primaryColor} strokeWidth="0.8"/>
        
        <g transform="translate(68, 115) scale(0.6)">
            <path d="M15 10C15 7 17 5 20 5H30C33 5 35 7 35 10V45C35 48 33 50 30 50H20C17 50 15 48 15 45V10Z" stroke={primaryColor} strokeWidth="2.5"/>
            <path d="M22 55C15 55 10 50 10 40V25M28 55C35 55 40 50 40 40V25" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="25" cy="45" r="1.5" fill={primaryColor}/>
        </g>
        
        <circle cx="27" cy="103" r="10" stroke={primaryColor} fill="white" strokeWidth="1"/>
        <circle cx="27" cy="103" r="4.5" stroke={primaryColor} strokeWidth="0.8" strokeDasharray="1 1"/>
        <text x="23" y="105" fill={primaryColor} fontSize="5" fontWeight="900" style={{fontFamily: 'Raleway, sans-serif'}}>IA</text>
        
        <circle cx="27" cy="48" r="10" stroke={primaryColor} fill="white" strokeWidth="1"/>
        <path d="M22 48C22 48 23 45 27 45C31 45 32 48 32 48L27 53L22 48Z" stroke={primaryColor} strokeWidth="0.8" fill={primaryColor} fillOpacity="0.1"/>

        <circle cx="80" cy="72" r="13" stroke={primaryColor} fill="white" strokeWidth="1.2"/>
        <path d="M80 64L89 72L80 80L71 72L80 64Z" stroke={primaryColor} strokeWidth="1" fill={primaryColor} fillOpacity="0.2"/>
        <path d="M71 72H89M80 64V80" stroke={primaryColor} strokeWidth="0.5" strokeOpacity="0.3"/>
      </svg>

      {variant === 'full' && (
        <div className="flex flex-col -ml-2">
          <div className={`flex items-baseline ${currentFont.gap}`}>
            <span className={`font-light text-brand-contrast dark:text-brand-surface tracking-[0.45em] uppercase ${currentFont.top}`} style={{ fontFamily: 'Raleway, sans-serif' }}>
              MENU
            </span>
            <span className={`font-light text-brand-contrast dark:text-brand-surface tracking-[0.45em] uppercase ${currentFont.top}`} style={{ fontFamily: 'Raleway, sans-serif' }}>
              DE
            </span>
          </div>
          <span className={`font-black text-brand-primary ${currentFont.spacing} ${currentFont.bottom} tracking-tighter`} style={{ fontFamily: 'Raleway, sans-serif' }}>
            negócios
          </span>
        </div>
      )}
    </div>
  );
};
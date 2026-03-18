
import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  icon?: any;
  className?: string;
}

const countryCodes = [
  { code: '55', country: 'Brasil', flag: '🇧🇷' },
  { code: '1', country: 'EUA/Canadá', flag: '🇺🇸' },
  { code: '351', country: 'Portugal', flag: '🇵🇹' },
  { code: '34', country: 'Espanha', flag: '🇪🇸' },
  { code: '44', country: 'Reino Unido', flag: '🇬🇧' },
  { code: '33', country: 'França', flag: '🇫🇷' },
  { code: '49', country: 'Alemanha', flag: '🇩🇪' },
  { code: '39', country: 'Itália', flag: '🇮🇹' },
  { code: '81', country: 'Japão', flag: '🇯🇵' },
  { code: '86', country: 'China', flag: '🇨🇳' },
  { code: '54', country: 'Argentina', flag: '🇦🇷' },
  { code: '598', country: 'Uruguai', flag: '🇺🇾' },
  { code: '595', country: 'Paraguai', flag: '🇵🇾' },
  { code: '56', country: 'Chile', flag: '🇨🇱' },
  { code: '57', country: 'Colômbia', flag: '🇨🇴' },
  { code: '51', country: 'Peru', flag: '🇵🇪' },
  { code: '52', country: 'México', flag: '🇲🇽' },
];

export const PhoneInput: React.FC<PhoneInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "DDD + Número", 
  label, 
  icon: Icon = Phone,
  className = ""
}) => {
  const [countryCode, setCountryCode] = useState('55');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Sincroniza o valor inicial
  useEffect(() => {
    if (value) {
      // Ordena por tamanho decrescente para pegar o código mais longo primeiro (ex: 351 vs 3)
      const sortedCodes = [...countryCodes].sort((a, b) => b.code.length - a.code.length);
      const foundCode = sortedCodes.find(c => value.startsWith(c.code));
      
      if (foundCode) {
        setCountryCode(foundCode.code);
        setPhoneNumber(value.slice(foundCode.code.length));
      } else {
        // Se não encontrar, assume 55 e joga o resto no número
        setPhoneNumber(value);
      }
    }
  }, [value]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove qualquer caractere não numérico
    const numbersOnly = e.target.value.replace(/\D/g, '');
    setPhoneNumber(numbersOnly);
    onChange(`${countryCode}${numbersOnly}`);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value;
    setCountryCode(newCode);
    onChange(`${newCode}${phoneNumber}`);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
          {Icon && <Icon className="w-3 h-3" />} {label}
        </label>
      )}
      <div className="flex gap-2">
        <div className="relative w-[100px] shrink-0">
          <select
            value={countryCode}
            onChange={handleCountryChange}
            className="w-full bg-white border-none rounded-2xl p-4 font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-brand-primary outline-none shadow-sm h-full"
          >
            {countryCodes.map(c => (
              <option key={c.code} value={c.code}>
                {c.flag} +{c.code}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div className="relative flex-1">
          <input
            type="text"
            className="w-full bg-white border-none rounded-2xl p-4 font-bold outline-none focus:ring-2 focus:ring-brand-primary shadow-sm"
            placeholder={placeholder}
            value={phoneNumber}
            onChange={handlePhoneChange}
          />
        </div>
      </div>
    </div>
  );
};

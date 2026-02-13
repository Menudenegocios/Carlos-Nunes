
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from '../components/Logo';
import { AlertCircle, Lock, Mail } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Erro detalhado de login:", err);
      
      if (err.message.includes("Invalid login credentials")) {
        setError("E-mail ou senha incorretos. Verifique seus dados ou crie uma nova conta.");
      } else if (err.message.includes("Email not confirmed")) {
        setError("Seu e-mail ainda não foi verificado. Por favor, confirme sua conta no seu e-mail.");
      } else {
        setError(err.message || 'Erro ao fazer login. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 px-6 lg:px-8 bg-brand-surface dark:bg-black transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex mb-10 transform hover:scale-105 transition-transform">
           <Logo size="lg" />
        </div>
        <h2 className="text-center text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
          Acesse seu Painel
        </h2>
        <p className="mt-3 text-center text-gray-500 dark:text-slate-400 font-medium">
          Ainda não tem vitrine?{' '}
          <Link to="/register" className="font-black text-brand-primary hover:opacity-80 underline underline-offset-4">
            Crie grátis agora
          </Link>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-zinc-900 py-10 px-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-none sm:rounded-[3rem] sm:px-12 border border-gray-100 dark:border-zinc-800 transition-all">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">
                E-mail de Acesso
              </label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-14 pr-6 py-5 border border-gray-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white rounded-2xl placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary sm:text-sm font-bold transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">
                Sua Senha
              </label>
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-14 pr-6 py-5 border border-gray-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white rounded-2xl placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary sm:text-sm font-bold transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-rose-600 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30 p-5 rounded-2xl font-bold flex gap-4 animate-in fade-in zoom-in duration-300">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <span className="leading-tight">{error}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-5 px-4 border border-transparent rounded-2xl shadow-xl text-xs font-black text-white bg-brand-primary hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 transition-all uppercase tracking-widest active:scale-95"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Acessando...
                  </span>
                ) : 'Entrar no Sistema'}
              </button>
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-50 dark:border-zinc-800 text-center">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Esqueceu o acesso? 
                <Link to="/help" className="ml-2 text-brand-primary hover:underline">Contatar Suporte</Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

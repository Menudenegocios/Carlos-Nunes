
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from '../components/Logo';
import { AlertCircle, Lock, Mail, Sparkles, WifiOff } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginAsDemo, networkError } = useAuth();
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
      if (err.message === 'Failed to fetch') {
        setError("Não foi possível conectar ao servidor. Verifique sua internet ou utilize o Acesso Rápido (Demo).");
      } else if (err.message.includes("Invalid login credentials")) {
        setError("E-mail ou senha incorretos. Tente novamente.");
      } else if (err.message.includes("Email not confirmed")) {
        setError("Seu e-mail ainda não foi verificado.");
      } else {
        setError(err.message || 'Erro ao fazer login.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 px-6 lg:px-8 bg-brand-surface dark:bg-black transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex mb-10 transform hover:scale-105 transition-transform">
           <Logo size="lg" />
        </div>
        <h2 className="text-center text-4xl font-black text-gray-900 dark:text-white tracking-tighter leading-none uppercase italic">
          Bem-vindo ao <br/><span className="text-brand-primary">Menu de Negócios</span>
        </h2>
        <p className="mt-3 text-center text-gray-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">
          Sua plataforma de negócios.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-zinc-900 py-10 px-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-none sm:rounded-[3rem] sm:px-12 border border-gray-100 dark:border-zinc-800 transition-all">
          
          {networkError && (
             <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <WifiOff className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                   <p className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider mb-1">Servidor Indisponível</p>
                   <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">O banco de dados parece estar offline. Use o botão <strong>Demo</strong> para explorar a plataforma sem internet.</p>
                </div>
             </div>
          )}

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

            <div className="space-y-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-5 px-4 border border-transparent rounded-2xl shadow-xl text-xs font-black text-white bg-brand-primary hover:opacity-90 transition-all uppercase tracking-widest active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Acessando...' : 'Entrar no Sistema'}
              </button>
              
              <div className="relative py-2">
                 <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-zinc-800"></div></div>
                 <div className="relative flex justify-center text-[10px]"><span className="px-4 bg-white dark:bg-zinc-900 text-gray-400 font-black uppercase tracking-widest">OU</span></div>
              </div>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full flex items-center justify-center gap-2 py-5 px-4 border border-brand-primary/20 dark:border-brand-primary/30 rounded-2xl text-xs font-black text-brand-primary bg-brand-primary/5 dark:bg-brand-primary/10 hover:bg-brand-primary/10 transition-all uppercase tracking-widest"
              >
                <Sparkles className="w-4 h-4" /> Acesso Rápido (Demo)
              </button>
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-50 dark:border-zinc-800 text-center">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Ainda não tem conta? 
                <Link to="/register" className="ml-2 text-brand-primary hover:underline">Cadastrar Grátis</Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

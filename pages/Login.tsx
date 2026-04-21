
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from '../components/Logo';
import { AlertCircle, Lock, Mail, Sparkles } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Por favor, insira seu e-mail acima para redefinir a senha.');
      return;
    }
    setIsResetting(true);
    setError('');
    setSuccess('');
    try {
      await forgotPassword(email);
      setSuccess('E-mail de redefinição de senha enviado com sucesso! Verifique sua caixa de entrada.');
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar e-mail de redefinição.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) throw signInError;
      
      setSuccess('Login efetuado com sucesso! Redirecionando...');

      // Small delay just for the user to see the success message
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 500);
      
    } catch (err: any) {
      console.error("Erro de login:", err);
      setError(err.message || 'Erro ao fazer login.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Side: Welcome Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-surface relative overflow-hidden items-center justify-center p-12">
        {/* Abstract background elements for premium feel */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl -mr-48 -mt-48 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl -ml-48 -mb-48" />
        
        <div className="relative text-center space-y-10 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter leading-none italic uppercase">
              Bem-vindo ao
            </h1>
          </div>

          <div className="inline-flex transform hover:scale-105 transition-all duration-500">
            <Logo size="lg" />
          </div>

          <div className="space-y-6">
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">
              Conectando o Futuro dos Negócios
            </p>
            
            <div className="h-0.5 w-12 bg-brand-primary mx-auto rounded-full" />
            
            <p className="text-lg font-black text-gray-900 uppercase italic tracking-tight">
              Conexão & Networking
            </p>
          </div>

          <div className="pt-8 opacity-20">
            <div className="w-1 h-16 bg-gradient-to-b from-brand-primary to-transparent mx-auto rounded-full" />
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-white relative">
        <div className="w-full max-w-md space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
          {/* Mobile Logo Only */}
          <div className="lg:hidden flex justify-center mb-12">
            <Logo size="lg" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-gray-900 italic uppercase tracking-tighter">Entrar na Plataforma</h2>
            <p className="text-slate-400 font-medium text-sm font-sans">Sua jornada de negócios começa aqui.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                  E-mail
                </label>
                <div className="relative group">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-slate-400 group-focus-within:text-brand-primary transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="exemplo@vps.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border-none pl-12 pr-6 py-4 rounded-2xl placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary font-bold transition-all text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                  Senha
                </label>
                <div className="relative group">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-slate-400 group-focus-within:text-brand-primary transition-colors">
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
                    className="w-full bg-slate-50 border-none pl-12 pr-6 py-4 rounded-2xl placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary font-bold transition-all text-gray-900"
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={isResetting}
                    className="text-[10px] font-black text-brand-primary uppercase tracking-widest hover:underline disabled:opacity-50"
                  >
                    {isResetting ? 'Solicitando...' : 'Esqueceu sua senha?'}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 animate-in fade-in zoom-in-95 duration-300">
                <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs font-black text-rose-600 leading-normal uppercase italic tracking-tight">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3 animate-in fade-in zoom-in-95 duration-300">
                <Sparkles className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs font-black text-emerald-600 leading-normal uppercase italic tracking-tight">{success}</p>
              </div>
            )}

            <div className="space-y-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-gray-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-gray-900/20 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Processando...' : (
                  <>Acessar Painel</>
                )}
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100" /></div>
                <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-slate-400">
                  <span className="bg-white px-4 italic">Social Login</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                   // Placeholder for Google Login
                   supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
                }}
                className="w-full h-14 bg-white border-2 border-slate-100 text-gray-900 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-sm"
              >
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale" alt="Google" />
                Entrar com Google
              </button>
            </div>
          </form>

          <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest pt-4">
            Novo por aqui? 
            <Link to="/register" className="ml-2 text-brand-primary hover:underline">Solicitar Acesso</Link>
          </p>
        </div>

        {/* Floating elements for right side */}
        <div className="absolute top-0 right-0 p-8 lg:p-12 animate-in fade-in duration-1000 delay-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sistema Operante</span>
          </div>
        </div>
      </div>
    </div>
  );
};

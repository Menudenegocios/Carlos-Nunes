
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
    <div className="min-h-[85vh] flex flex-col justify-center py-12 px-6 lg:px-8 bg-brand-surface transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex mb-10 transform hover:scale-105 transition-transform">
           <Logo size="lg" />
        </div>
        <h2 className="text-center text-4xl font-black text-gray-900 tracking-tighter leading-tight uppercase italic overflow-visible">
          Bem-vindo ao <br/><span className="text-brand-primary title-fix">Menu de Negócios</span>
        </h2>
        <p className="mt-3 text-center text-gray-500 font-bold uppercase tracking-widest text-[10px]">
          Sua plataforma de negócios.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] sm:rounded-[3rem] sm:px-12 border border-gray-100 transition-all">
          


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
                  className="appearance-none block w-full pl-14 pr-6 py-5 border border-gray-100 rounded-2xl placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary sm:text-sm font-bold transition-all"
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
                  className="appearance-none block w-full pl-14 pr-6 py-5 border border-gray-100 rounded-2xl placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary sm:text-sm font-bold transition-all"
                />
              </div>
              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isResetting}
                  className="text-[10px] font-black text-brand-primary uppercase tracking-widest hover:underline disabled:opacity-50"
                >
                  {isResetting ? 'Enviando...' : 'Esqueci minha senha'}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-rose-600 bg-rose-50 border border-rose-100 p-5 rounded-2xl font-bold flex gap-4 animate-in fade-in zoom-in duration-300">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <span className="leading-tight">{error}</span>
              </div>
            )}

            {success && (
              <div className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 p-5 rounded-2xl font-bold flex gap-4 animate-in fade-in zoom-in duration-300">
                <Sparkles className="w-6 h-6 flex-shrink-0" />
                <span className="leading-tight">{success}</span>
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
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Ainda não tem conta? 
                <Link to="/register" className="ml-2 text-brand-primary hover:underline">Cadastrar Agora</Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

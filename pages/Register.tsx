
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from '../components/Logo';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      // O Supabase por padrão exige confirmação de e-mail. 
      // Se estiver desabilitado no painel, ele loga direto ou permite o login.
      alert('Conta criada com sucesso! Verifique seu e-mail (se necessário) e faça login.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar nova conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex mb-8">
           <Logo size="lg" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Crie sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-slate-400">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-medium text-[#F5821F] hover:opacity-80">
            Fazer login
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100 dark:border-slate-800 transition-colors">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                Nome Completo (ou Nome do Negócio)
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#F5821F] focus:border-[#F5821F] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                E-mail
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#F5821F] focus:border-[#F5821F] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                Senha
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#F5821F] focus:border-[#F5821F] sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-md font-bold">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-black text-white bg-[#F5821F] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F5821F] disabled:opacity-50 transition-all uppercase tracking-widest"
              >
                {loading ? 'Criando conta...' : 'Começar Agora Grátis'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-900 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                  Segurança Garantida
                </span>
              </div>
            </div>
            <p className="mt-4 text-center text-[10px] text-gray-500 dark:text-slate-400 leading-relaxed uppercase tracking-tighter">
              Ao criar sua conta, você concorda com nossos <Link to="/terms" className="underline font-black">Termos de Uso</Link> e <Link to="/privacy" className="underline font-black">Política de Privacidade</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

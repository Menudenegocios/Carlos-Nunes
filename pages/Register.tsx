
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { Logo } from '../components/Logo';
import { PhoneInput } from '../components/PhoneInput';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralId, setReferralId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [referrerName, setReferrerName] = useState<string | null>(null);

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setReferralId(ref);
      checkReferrer(ref);
    }
  }, [searchParams]);

  const checkReferrer = async (id: string) => {
    try {
      const cleanRef = id.trim().replace(/[^a-zA-Z0-9]/g, '');
      const isNumeric = /^\d+$/.test(cleanRef);
      let query = supabase.from('profiles').select('name, business_name');
      if (isNumeric) {
        query = query.eq('display_id', parseInt(cleanRef));
      } else {
        query = query.eq('referral_code', cleanRef);
      }
      const { data, error } = await query.maybeSingle();
      if (data) {
        setReferrerName(data.business_name || data.name);
      }
    } catch (e) {
      console.error("Erro checkReferrer:", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        setLoading(false);
        return;
      }

      if (!acceptedTerms) {
        setError('Você precisa aceitar os Termos de Uso e a Política de Privacidade.');
        setLoading(false);
        return;
      }
      
      console.log("Register: Iniciando cadastro para", email);
      
      let finalReferrerUuid = null;

      // Se houver ID de indicação, buscar o UUID do usuário correspondente
      if (referralId) {
        // Limpar possíveis "/" ou caracteres especiais adicionados por apps de mensagem
        const cleanRef = referralId.trim().replace(/[^a-zA-Z0-9]/g, '');
        const isNumeric = /^\d+$/.test(cleanRef);
        
        let query = supabase.from('profiles').select('id');
        
        if (isNumeric) {
          query = query.eq('display_id', parseInt(cleanRef));
        } else {
          query = query.eq('referral_code', cleanRef);
        }

        const { data: referrerData, error: referrerError } = await query.maybeSingle();
        
        if (referrerError) {
          console.error("Erro ao buscar indicador:", referrerError);
        } else if (referrerData) {
          finalReferrerUuid = referrerData.id;
        } else {
          // Se não encontrou, talvez avisar ou apenas seguir sem indicador
          console.warn("Indicador não encontrado para o ID:", cleanRef);
        }
      }

      // Criar um timeout para evitar travamentos infinitos no front
      const signUpPromise = supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            phone: whatsapp,
            referrer_id: finalReferrerUuid
          }
        }
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Timeout: O servidor do Supabase demorou muito para responder. Verifique sua conexão.")), 15000)
      );

      const { error: signUpError } = await Promise.race([signUpPromise, timeoutPromise]) as any;

      if (signUpError) throw signUpError;
      
      // Forçar logout imediato após o cadastro
      await supabase.auth.signOut();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log("Register: Finalizado com sucesso.");
      
      setSuccess('Conta criada! Verifique seu e-mail para confirmar o cadastro. Após confirmar, você poderá fazer login.');
      
      setTimeout(() => {
        navigate('/login', { replace: true });
        setLoading(false);
      }, 4000);

    } catch (err: any) {
      console.error("Register: Erro no cadastro:", err);
      let errorMsg = err.message || 'Erro inesperado. Tente novamente em alguns instantes.';
      
      // Tradução de erros comuns do Supabase Auth
      if (errorMsg.includes('User already registered') || errorMsg.includes('already exists')) {
        errorMsg = 'Este e-mail já está cadastrado. Tente fazer login ou recuperar sua senha.';
      } else if (errorMsg.includes('Password should be at least 6 characters')) {
        errorMsg = 'A senha deve ter pelo menos 6 caracteres.';
      } else if (errorMsg.includes('Invalid email format')) {
        errorMsg = 'Formato de e-mail inválido.';
      }

      setError(errorMsg);
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    if (!acceptedTerms) {
      setError('Você precisa aceitar os Termos de Uso e a Política de Privacidade.');
      return;
    }

    if (!whatsapp) {
      setError('Por favor, preencha o seu WhatsApp antes de continuar com o Google.');
      return;
    }

    try {
      setLoading(true);
      // Validar indicador se existir
      let finalReferrerUuid = null;
      if (referralId) {
        const cleanRef = referralId.trim().replace(/[^a-zA-Z0-9]/g, '');
        const isNumeric = /^\d+$/.test(cleanRef);
        let query = supabase.from('profiles').select('id');
        if (isNumeric) query = query.eq('display_id', parseInt(cleanRef));
        else query = query.eq('referral_code', cleanRef);
        
        const { data: refData } = await query.maybeSingle();
        if (refData) finalReferrerUuid = refData.id;
      }

      // Salvar metadados para processar após o redirecionamento
      sessionStorage.setItem('pending_registration_data', JSON.stringify({
        whatsapp,
        referrer_id: finalReferrerUuid
      }));

      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const redirectUrl = isLocal ? window.location.origin : 'https://menudenegocios.com';

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Side: Welcome Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-white relative overflow-hidden items-center justify-center p-12 border-r border-gray-50">
        <div className="relative text-center space-y-12 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="space-y-3">
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
              Criar <span className="text-brand-primary">Conta</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium italic">
              Junte-se à maior comunidade de empreendedores.
            </p>
          </div>

          <div className="pt-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">
              Seja Bem-vindo ao
            </p>
            <div className="inline-flex transform hover:scale-105 transition-all duration-500 scale-[0.9]">
              <Logo size="lg" />
            </div>
          </div>

          <div className="space-y-5 pt-4">
            <div className="h-1 w-12 bg-brand-primary mx-auto rounded-full" />
            <p className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] opacity-30">
              Membros & Prosperidade
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Logo size="md" />
          </div>

          <div className="space-y-4">

            <form onSubmit={handleSubmit} className="space-y-4">
              {referrerName && (
                <div className="flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-100 animate-bounce mb-2">
                  <span className="flex-shrink-0 w-2 h-2 bg-indigo-500 rounded-full" />
                  Você foi indicado por: {referrerName}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
                  placeholder="Seu nome"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <PhoneInput
                    label="WhatsApp (Obrigatório)"
                    value={whatsapp}
                    onChange={setWhatsapp}
                    placeholder="DDD + Número"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ID de Indicação</label>
                  <input
                    type="text"
                    value={referralId}
                    onChange={(e) => setReferralId(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
                    placeholder="Ex: 1024"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Seu melhor E-mail</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
                  placeholder="email@exemplo.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Senha de Acesso</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center gap-3 px-1 py-1">
                <input 
                  type="checkbox" 
                  id="terms" 
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-2 border-slate-100 text-brand-primary focus:ring-brand-primary/20 transition-all cursor-pointer"
                />
                <label htmlFor="terms" className="text-[10px] font-black text-slate-400 cursor-pointer leading-tight uppercase tracking-widest">
                  Li e concordo com os <Link to="/termos" className="text-brand-primary underline">Termos</Link> e <Link to="/privacidade" className="text-brand-primary underline">Privacidade</Link>
                </label>
              </div>

              {error && <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded-r-xl">{error}</div>}
              {success && <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 text-xs font-bold rounded-r-xl">{success}</div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4.5 bg-brand-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-brand-primary/20 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Processando...' : 'Criar minha conta'}
              </button>
            </form>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-slate-300">
                <span className="bg-white px-4">Ou via Google</span>
              </div>
            </div>

            <button
              onClick={handleGoogleRegister}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-white border-2 border-gray-100 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-brand-primary/20 transition-all active:scale-95 disabled:opacity-50 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.25.81-.59z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Registrar com Google
            </button>

            <p className="text-center text-sm font-medium text-slate-400">
              Já faz parte?{' '}
              <Link to="/login" className="text-brand-primary font-black hover:underline italic">
                Fazer Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

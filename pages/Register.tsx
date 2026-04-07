
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
  const [wantPlatform, setWantPlatform] = useState(true);
  const [wantLocalPlus, setWantLocalPlus] = useState(false);

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
            referrer_id: finalReferrerUuid,
            want_platform: wantPlatform,
            want_local_plus: wantLocalPlus,
            local_plan: wantLocalPlus ? 'presenca' : 'none' // Se quiser Local+, ja ganha o plano grátis
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

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex mb-8 transform scale-[0.7]">
           <Logo size="lg" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Crie sua conta
        </h2>
        {referrerName && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
             Você foi indicado por: <span className="bg-indigo-600 text-white px-2 py-0.5 rounded-md">{referrerName}</span>
          </div>
        )}
        <p className="mt-2 text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-medium text-[#F67C01] hover:opacity-80">
            Fazer login
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100 transition-colors">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome Completo (ou Nome do Negócio)
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#F67C01] focus:border-[#F67C01] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                Número do WhatsApp
              </label>
              <PhoneInput
                value={whatsapp}
                onChange={setWhatsapp}
                placeholder="DDD + Número"
                className="whatsapp-input-register"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#F67C01] focus:border-[#F67C01] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#F67C01] focus:border-[#F67C01] sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="referralId" className="block text-sm font-medium text-gray-700">
                ID de Indicação / Código (Opcional)
              </label>
              <div className="mt-1">
                <input
                  id="referralId"
                  name="referralId"
                  type="text"
                  placeholder="Ex: 1024 ou ABCXYZ"
                  value={referralId}
                  onChange={(e) => setReferralId(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#F67C01] focus:border-[#F67C01] sm:text-sm"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-widest">
                O que você deseja no Menu?
              </label>
              <div className="space-y-3">
                <label className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${wantPlatform ? 'border-indigo-500 bg-indigo-50/50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={wantPlatform}
                      onChange={(e) => setWantPlatform(e.target.checked)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">Plataforma de Gestão</span>
                    <span className="text-[10px] text-gray-500 font-medium">Ter minha vitrine, CRM, blog e ferramentas.</span>
                  </div>
                </label>
                
                <label className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all ${wantLocalPlus ? 'border-[#F67C01] bg-orange-50/50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-[#F67C01] focus:ring-[#F67C01] border-gray-300 rounded"
                      checked={wantLocalPlus}
                      onChange={(e) => setWantLocalPlus(e.target.checked)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">Vender no Local+</span>
                    <span className="text-[10px] text-gray-500 font-medium">Publicar ofertas no marketplace da minha região.</span>
                  </div>
                </label>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-md font-bold">
                {error}
              </div>
            )}

            {success && (
              <div className="text-sm text-green-600 bg-green-50 border border-green-200 p-3 rounded-md font-bold">
                {success}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-black text-white bg-[#F67C01] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F67C01] disabled:opacity-50 transition-all uppercase tracking-widest"
              >
                {loading ? 'Criando conta...' : 'Começar Agora'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                  Segurança Garantida
                </span>
              </div>
            </div>
            <p className="mt-4 text-center text-[10px] text-gray-500 leading-relaxed uppercase tracking-tighter">
              Ao criar sua conta, você concorda com nossos <Link to="/terms" className="underline font-black">Termos de Uso</Link> e <Link to="/privacy" className="underline font-black">Política de Privacidade</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

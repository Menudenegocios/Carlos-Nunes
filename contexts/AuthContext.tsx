
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { User } from '../types';
import { supabase } from '../services/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { pointsRules } from '../config/gamificationConfig';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  impersonateUser: (userId: string) => Promise<void>;
  stopImpersonating: () => void;
  isImpersonating: boolean;
  adminUser: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async (user_id: string, email: string | undefined, name: string | undefined) => {
    if (!user_id) {
        setIsLoading(false);
        return;
    }

    // Timeout de 10s para evitar travamento infinito no loading
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('TIMEOUT')), 10000)
    );

    const mapLevel = (level: string): User['level'] => {
      const lower = level?.toLowerCase() || '';
      if (lower === 'bronze') return 'Bronze';
      if (lower === 'prata') return 'Prata';
      if (lower === 'ouro') return 'Ouro';
      if (lower === 'diamante') return 'Diamante';
      return 'Nível Base';
    };

    try {
      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user_id)
        .maybeSingle();

      const { data, error } = (await Promise.race([fetchPromise, timeoutPromise])) as any;

      if (error) throw error;

      if (data) {
        // --- GAMIFICATION: DAILY LOGIN POINTS ---
        const lastLoginAt = data.last_login_at;
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const lastLoginStr = lastLoginAt ? new Date(lastLoginAt).toISOString().split('T')[0] : null;

        let currentPoints = data.points || 0;

        if (lastLoginStr !== todayStr) {
          const pointsToAdd = pointsRules.loginDiario || 5;
          currentPoints += pointsToAdd;

          // Update profile and log history (fire and forget for UI snappiness)
          Promise.all([
            supabase.from('profiles').update({ 
              points: currentPoints, 
              last_login_at: now.toISOString() 
            }).eq('user_id', user_id),
            supabase.from('points_history').insert({
              user_id: user_id,
              points: pointsToAdd,
              action: 'Login Diário',
              category: 'login',
              date: now.toISOString()
            })
          ]).catch(err => console.error("Error updating login points:", err));
        }

        setUser({
          id: user_id,
          name: data.business_name || data.name || name || 'Usuário',
          email: data.email || email || '',
          plan: data.plan || 'pre-cadastro',
          points: currentPoints,
          level: mapLevel(data.level),
          menu_cash: data.menu_cash || 0,
          referral_code: data.referral_code || '',
          referrals_count: data.referrals_count || 0,
          display_id: data.display_id,
          role: data.role as User['role'] || 'user'
        });
      } else {
        // Fallback básico caso o perfil ainda não tenha sido criado via trigger
        setUser({
          id: user_id,
          name: name || 'Usuário',
          email: email || '',
          plan: 'pre-cadastro',
          points: 0,
          level: 'Nível Base',
          menu_cash: 0,
          referral_code: '',
          referrals_count: 0,
          role: 'user'
        });
      }
    } catch (error: any) {
      if (error?.message === 'TIMEOUT') {
        console.warn("[Auth] Timeout ao carregar perfil. Finalizando loading.");
      } else {
        console.error("fetchUserProfile auth error:", error?.message || error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // useRef para saber se já temos um user sem causar re-subscrição do listener
  const userRef = React.useRef<User | null>(null);
  
  // Manter o ref sincronizado com o state
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: Session | null) => {
      if (!isMounted) return;

      const eventName = _event === 'INITIAL_SESSION' ? 'Sessão Inicial' : _event;
      console.log(`[Auth] Mudança de Estado: ${eventName}`, session?.user?.email || 'Nenhum usuário logado');

      if (session?.user) {
        // PRIORIDADE: Só ativar loading se não tivermos usuário carregado.
        // Se já tivermos usuário, qualquer re-autenticação ou refresh de aba deve ser silencioso.
        const shouldShowSpinner = userRef.current === null;

        if (shouldShowSpinner) {
          setIsLoading(true);
        }

        // IMPORTANTE: Usar setTimeout(0) para quebrar o contexto do Web Lock.
        // onAuthStateChange roda dentro de um lock — se fizermos await aqui,
        // a query do Supabase entra em deadlock esperando o mesmo lock liberar.
        setTimeout(async () => {
          if (!isMounted) return;
          try {
            await fetchUserProfile(session.user.id, session.user.email, session.user.user_metadata?.name);
          } catch (err) {
            console.error('[Auth] Erro ao carregar perfil:', err);
            setIsLoading(false);
          }
        }, 0);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    // Timeout defensivo global de 15s — se o loading inicial não finalizar, forçar fim
    const safetyTimeout = setTimeout(() => {
      if (isMounted) {
        setIsLoading(prev => {
          if (prev) {
            console.warn('[Auth] Safety timeout: finalizando loading após 15s.');
          }
          return false;
        });
      }
    }, 15000);

    return () => {
      isMounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try { 
      await supabase.auth.signOut(); 
    } catch (e) {
      console.error("Logout error", e);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    } catch (error) {
      console.error("Erro ao enviar e-mail de redefinição de senha:", error);
      throw error;
    }
  };

  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isImpersonating, setIsImpersonating] = useState(false);

  const mapLevel = (level: string): User['level'] => {
    const lower = level?.toLowerCase() || '';
    if (lower === 'bronze') return 'Bronze';
    if (lower === 'prata') return 'Prata';
    if (lower === 'ouro') return 'Ouro';
    if (lower === 'diamante') return 'Diamante';
    return 'Nível Base';
  };

  const getProfileData = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      id: userId,
      name: data.business_name || data.name || 'Usuário',
      email: data.email || '',
      plan: data.plan || 'pre-cadastro',
      points: data.points || 0,
      level: mapLevel(data.level),
      menu_cash: data.menu_cash || 0,
      referral_code: data.referral_code || '',
      referrals_count: data.referrals_count || 0,
      role: data.role as User['role'] || 'user'
    };
  };

  const impersonateUser = async (userId: string) => {
    if (!user || user.role !== 'admin') {
      alert("Apenas administradores podem usar o modo personificação.");
      return;
    }

    setIsLoading(true);
    try {
      const targetUserProfile = await getProfileData(userId);
      if (targetUserProfile) {
        setAdminUser(user);
        setUser(targetUserProfile);
        setIsImpersonating(true);
      } else {
        alert("Não foi possível carregar o perfil do usuário.");
      }
    } catch (err) {
      console.error("Erro ao personificar:", err);
      alert("Erro ao entrar em modo personificação.");
    } finally {
      setIsLoading(false);
    }
  };

  const stopImpersonating = () => {
    if (adminUser) {
      setUser(adminUser);
      setAdminUser(null);
      setIsImpersonating(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, logout, forgotPassword, 
      isAuthenticated: !!user, isLoading,
      impersonateUser, stopImpersonating, isImpersonating, adminUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};


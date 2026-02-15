
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { User } from '../types';
import { supabase } from '../services/supabaseClient';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  loginAsDemo: () => void;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  /* Fix: Added refreshProfile to expose user profile fetching */
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  networkError: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn("Perfil não encontrado ou erro de busca:", error.message);
      }

      if (data) {
        setUser({
          id: userId,
          name: data.full_name || 'Usuário',
          email: data.email || '',
          plan: data.plan || 'profissionais',
          points: data.points || 0,
          level: data.level || 'bronze',
          referralCode: data.referral_code || '',
          referralsCount: data.referrals_count || 0
        });
      } else {
        // Fallback para usuário recém criado ou erro de banco
        setUser({
          id: userId,
          name: 'Usuário (Demo)',
          email: '',
          plan: 'negocios',
          points: 1250,
          level: 'prata',
          referralCode: 'DEMO123',
          referralsCount: 5
        });
      }
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      if (error.message === 'Failed to fetch') {
        setNetworkError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* Fix: Implementation of refreshProfile */
  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    } else {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) await fetchUserProfile(session.user.id);
    }
  };

  useEffect(() => {
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await fetchUserProfile(session.user.id);
        } else {
          const savedDemo = localStorage.getItem('menu_demo_user');
          if (savedDemo) {
            setUser(JSON.parse(savedDemo));
          }
          setIsLoading(false);
        }
      } catch (e: any) {
        console.error("Auth initialization error:", e);
        if (e.message === 'Failed to fetch') {
          setNetworkError(true);
          // Se falhar rede, tenta restaurar demo do localStorage
          const savedDemo = localStorage.getItem('menu_demo_user');
          if (savedDemo) setUser(JSON.parse(savedDemo));
        }
        setIsLoading(false);
      }
    };

    initSession();

    // Listener de mudança de estado com tratamento de erro
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session) {
          await fetchUserProfile(session.user.id);
        } else {
          if (!localStorage.getItem('menu_demo_user')) {
            setUser(null);
          }
          setIsLoading(false);
        }
      } catch (e) {}
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;
      localStorage.removeItem('menu_demo_user');
      setNetworkError(false);
    } catch (error: any) {
      if (error.message === 'Failed to fetch') {
        setNetworkError(true);
      }
      throw error;
    }
  };

  const loginAsDemo = () => {
    const demoUser: User = {
      id: 'demo-user-id',
      name: 'Empreendedor Demo',
      email: 'demo@menu.com',
      plan: 'negocios',
      points: 2500,
      level: 'ouro',
      referralCode: 'MENU777',
      referralsCount: 12
    };
    setUser(demoUser);
    localStorage.setItem('menu_demo_user', JSON.stringify(demoUser));
    setNetworkError(false);
  };

  const register = async (name: string, email: string, pass: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: name
        }
      }
    });
    if (error) throw error;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    localStorage.removeItem('menu_demo_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      loginAsDemo, 
      register, 
      logout, 
      refreshProfile,
      isAuthenticated: !!user, 
      isLoading,
      networkError
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

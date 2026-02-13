
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { User } from '../types';
import { supabase } from '../services/supabaseClient';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        // Fallback: Se o gatilho falhou, criamos um estado de usuário básico para não travar o app
        setUser({
          id: userId,
          name: 'Usuário (Perfil em Criação)',
          email: '',
          plan: 'profissionais',
          points: 50,
          level: 'bronze',
          referralCode: '',
          referralsCount: 0
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Handle auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
  };

  const register = async (name: string, email: string, pass: string) => {
    // Importante: passamos o full_name nos metadados para o gatilho capturar
    const { error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: name
        }
      }
    });
    
    if (error) {
      if (error.message.includes("Database error saving new user")) {
        // Se este erro ainda ocorrer, o problema está nas permissões do schema 'auth'
        throw new Error("Erro de servidor ao salvar perfil. Por favor, tente usar um e-mail diferente ou contate o suporte.");
      }
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

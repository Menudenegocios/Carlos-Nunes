
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { User } from '../types';
import { supabase } from '../services/supabaseClient';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
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

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user_id)
        .maybeSingle(); // maybeSingle evita erro PGRST116 se não existir

      if (error) throw error;

      if (data) {
        setUser({
          id: user_id,
          name: data.business_name || data.name || name || 'Usuário',
          email: data.email || email || '',
          plan: data.plan || 'pre-cadastro',
          points: data.points || 0,
          level: data.level || 'consultor',
          menu_cash: data.menu_cash || 0,
          referral_code: data.referral_code || '',
          referrals_count: data.referrals_count || 0,
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
          level: 'consultor',
          menu_cash: 0,
          referral_code: '',
          referrals_count: 0,
          role: 'user'
        });
      }
    } catch (error: any) {
      console.error("fetchUserProfile auth error:", error?.message || error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // onAuthStateChange handles both initial session and subsequent changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: any, session: Session | null) => {
      console.log("Auth State Change:", _event, session?.user?.email);
      
      setIsLoading(true);
      if (session?.user) {
        await fetchUserProfile(session.user.id, session.user.email, session.user.user_metadata?.name);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
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

  return (
    <AuthContext.Provider value={{ 
      user, logout, forgotPassword, 
      isAuthenticated: !!user, isLoading 
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


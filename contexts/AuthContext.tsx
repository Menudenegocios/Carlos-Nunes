
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { User, Profile } from '../types';
import { supabase } from '../services/supabaseClient';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  loginAsDemo: () => void;
  register: (name: string, email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  impersonate: (targetUser: User) => void;
  stopImpersonating: () => void;
  isImpersonating: boolean;
  realAdmin: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  networkError: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_ID = 'de30de30-0000-4000-a000-000000000000';
const CARLOS_BATIDA_ID = 'c0a80101-0000-4000-a000-000000000000';
const ADMIN_USER_ID = 'adadadad-0000-4000-a000-000000000000';

export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [realAdmin, setRealAdmin] = useState<User | null>(null);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false);

  const fetchUserProfile = async (userId: string) => {
    // Safety check for userId
    if (!userId || userId === DEMO_USER_ID || userId === CARLOS_BATIDA_ID || userId === ADMIN_USER_ID || (userId && userId.startsWith && userId.startsWith('mock_'))) {
        setIsLoading(false);
        return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data) {
        setUser({
          id: userId,
          name: data.business_name || data.full_name || 'Usuário',
          email: data.email || '',
          plan: data.plan || 'profissionais',
          points: data.points || 0,
          level: data.level || 'elite',
          menuCash: data.menu_cash || 0,
          referralCode: data.referral_code || '',
          referralsCount: data.referrals_count || 0,
          role: data.role || 'user'
        });
      } else {
        // Se o perfil não existir, ainda assim precisamos setar o usuário para que ele consiga logar
        const { data: authData } = await supabase.auth.getUser();
        setUser({
          id: userId,
          name: authData.user?.user_metadata?.full_name || 'Usuário',
          email: authData.user?.email || '',
          plan: 'profissionais',
          points: 0,
          level: 'elite',
          menuCash: 0,
          referralCode: '',
          referralsCount: 0,
          role: 'user'
        });
      }
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      if (error.message === 'Failed to fetch') {
        setNetworkError(true);
      } else {
        // Se o perfil não existir (erro do single()), ainda assim precisamos setar o usuário
        const { data: authData } = await supabase.auth.getUser();
        setUser({
          id: userId,
          name: authData.user?.user_metadata?.full_name || 'Usuário',
          email: authData.user?.email || '',
          plan: 'profissionais',
          points: 0,
          level: 'elite',
          menuCash: 0,
          referralCode: '',
          referralsCount: 0,
          role: 'user'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const impersonate = (targetUser: User) => {
    if (user?.role === 'admin' || realAdmin?.role === 'admin') {
      if (!realAdmin) setRealAdmin(user);
      setUser(targetUser);
      setIsImpersonating(true);
      localStorage.setItem('menu_impersonating', JSON.stringify(targetUser));
    }
  };

  const stopImpersonating = () => {
    if (realAdmin) {
      setUser(realAdmin);
      setRealAdmin(null);
      setIsImpersonating(false);
      localStorage.removeItem('menu_impersonating');
    }
  };

  const refreshProfile = async () => {
    if (user && user.id) {
      if (user.id === DEMO_USER_ID || user.id === CARLOS_BATIDA_ID || user.id === ADMIN_USER_ID || (user.id.startsWith && user.id.startsWith('mock_'))) return;
      await fetchUserProfile(user.id);
    }
  };

  useEffect(() => {
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const impersonated = localStorage.getItem('menu_impersonating');
        
        if (session) {
          await fetchUserProfile(session.user.id);
          if (impersonated) {
            const adminUser = user || { id: ADMIN_USER_ID, role: 'admin' } as any;
            setRealAdmin(adminUser);
            const parsed = JSON.parse(impersonated);
            setUser({
              ...parsed,
              menuCash: parsed.menuCash || 0,
              level: parsed.level || 'bronze'
            });
            setIsImpersonating(true);
          }
        } else {
          const savedDemo = localStorage.getItem('menu_demo_user');
          if (savedDemo) {
            const parsed = JSON.parse(savedDemo);
            setUser({
              ...parsed,
              menuCash: parsed.menuCash || 0,
              level: parsed.level || 'bronze'
            });
          }
          setIsLoading(false);
        }
      } catch (e) {
        setIsLoading(false);
      }
    };
    initSession();
  }, []);

  const login = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    console.log("Tentando login com:", cleanEmail);

    // 1. Verificar Admin Hardcoded
    if (cleanEmail === 'nunesempreendedor@gmail.com' && (cleanPass === 'C1n9m9g7$.' || cleanPass === 'C1n9m9g7$')) {
      const admin: User = {
        id: ADMIN_USER_ID,
        name: 'Administrador Nunes',
        email: 'nunesempreendedor@gmail.com',
        plan: 'negocios',
        points: 9999,
        level: 'ouro',
        menuCash: 500,
        referralCode: 'ADMIN_NUNES',
        referralsCount: 100,
        role: 'admin'
      };
      setUser(admin);
      localStorage.setItem('menu_demo_user', JSON.stringify(admin));
      setIsLoading(false);
      return;
    }

    // 2. Verificar Mock Users (Criados pelo Admin)
    const savedMockUsers = localStorage.getItem('menu_global_mock_users');
    if (savedMockUsers) {
      const mockUsers = JSON.parse(savedMockUsers);
      const foundMock = mockUsers.find((u: any) => u.email.toLowerCase() === cleanEmail && u.password === cleanPass);
      
        if (foundMock) {
          const mockSessionUser: User = {
            id: foundMock.id,
            name: foundMock.name,
            email: foundMock.email,
            plan: foundMock.plan,
            points: foundMock.points,
            level: foundMock.level,
            menuCash: foundMock.menuCash || 0,
            referralCode: foundMock.referralCode,
            referralsCount: foundMock.referralsCount,
            role: foundMock.role
          };
        setUser(mockSessionUser);
        localStorage.setItem('menu_demo_user', JSON.stringify(mockSessionUser));
        setIsLoading(false);
        return;
      }
    }

    // 3. Login via Supabase (Real)
    try {
      console.log("Chamando supabase.auth.signInWithPassword para:", cleanEmail);
      const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password: cleanPass });
      if (error) {
        console.error("Erro no signInWithPassword:", error);
        if (error.message === 'Invalid login credentials') {
          throw new Error('E-mail ou senha incorretos. Por favor, verifique seus dados.');
        }
        throw error;
      }
      localStorage.removeItem('menu_demo_user');
      if (data.user) {
        await fetchUserProfile(data.user.id);
      }
    } catch (error: any) {
      console.error("Erro capturado no login:", error);
      throw error;
    }
  };

  const loginAsDemo = () => {
    const demoUser: User = {
      id: DEMO_USER_ID, 
      name: 'Empreendedor Demo', 
      email: 'demo@menu.com', 
      plan: 'negocios', 
      points: 2500, 
      level: 'bronze', 
      menuCash: 150,
      referralCode: 'MENU777', 
      referralsCount: 12, 
      role: 'user'
    };
    setUser(demoUser);
    localStorage.setItem('menu_demo_user', JSON.stringify(demoUser));
    setIsLoading(false);
  };

  const register = async (name: string, email: string, pass: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email: email.trim(), 
        password: pass.trim(), 
        options: { 
          data: { 
            full_name: name.trim() 
          } 
        } 
      });
      
      if (error) {
        console.error("Erro no Supabase SignUp:", error);
        throw error;
      }
      
      console.log("Usuário registrado com sucesso:", data.user?.id);
      
      // Se o Supabase já criou uma sessão, não precisamos logar novamente
      if (!data.session) {
        // Login automático após registro, caso não tenha criado sessão
        await login(email, pass);
      } else {
        localStorage.removeItem('menu_demo_user');
      }
      
      return data;
    } catch (error: any) {
      console.error("Erro detalhado no registro:", error);
      throw error;
    }
  };

  const logout = async () => {
    try { await supabase.auth.signOut(); } catch (e) {}
    localStorage.removeItem('menu_demo_user');
    localStorage.removeItem('menu_impersonating');
    setUser(null);
    setRealAdmin(null);
    setIsImpersonating(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, loginAsDemo, register, logout, refreshProfile, 
      impersonate, stopImpersonating, isImpersonating, realAdmin,
      isAuthenticated: !!user, isLoading, networkError 
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

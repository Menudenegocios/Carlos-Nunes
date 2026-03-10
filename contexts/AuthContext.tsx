

import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { User } from '../types';
import { supabase } from '../services/supabaseClient';
import { AuthError } from '@supabase/supabase-js';


interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<string | undefined>;
  loginAsDemo: () => string;
  register: (name: string, email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
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

      if (error) throw error;

      if (data) {
        console.log("User profile found");
        setUser({
          id: userId,
          name: data.businessName || data.name || 'Usuário',
          email: data.email || '',
          plan: data.plan || 'profissionais',
          points: data.points || 0,
          level: data.level || 'elite',
          menuCash: data.menuCash || 0,
          referralCode: data.referralCode || '',
          referralsCount: data.referralsCount || 0,
          role: (data.email === 'nunesempreendedor@gmail.com' ? 'admin' : (data.role as User['role'] || 'user'))
        });
      } else {
        console.log("User profile does not exist, creating...");
        // Se o perfil não existir no Supabase, usamos os dados do Auth
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser && currentUser.id === userId) {
             const newUserProfile = {
                user_id: userId,
                name: currentUser.user_metadata.name || 'Usuário',
                email: currentUser.email || '',
                plan: 'profissionais',
                points: 0,
                level: 'elite',
                menuCash: 0,
                referralCode: '',
                referralsCount: 0,
                role: 'user',
                created_at: new Date().toISOString()
            };
            
            // Create the profile in Supabase if it doesn't exist
            await supabase.from('profiles').insert([newUserProfile]);
            
            setUser({
              id: userId,
              ...newUserProfile,
              name: newUserProfile.name,
              plan: newUserProfile.plan as any,
              level: newUserProfile.level as any,
              role: newUserProfile.role as any
            });
        }
      }
    } catch (error: any) {
      console.error('Error fetching user profile for:', userId, error);
      if (error.message && error.message.includes('offline')) {
        setNetworkError(true);
      }
      // Fallback to auth user if Supabase fails
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser && currentUser.id === userId) {
         setUser({
            id: userId,
            name: currentUser.user_metadata.name || 'Usuário',
            email: currentUser.email || '',
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        const currentUser = session?.user;
        const impersonated = localStorage.getItem('menu_impersonating');
        
        if (currentUser) {
            await fetchUserProfile(currentUser.id);
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
             // Check for demo/mock user in local storage if not authenticated via Supabase
             const savedDemo = localStorage.getItem('menu_demo_user');
             if (savedDemo) {
                const parsed = JSON.parse(savedDemo);
                setUser({
                  ...parsed,
                  menuCash: parsed.menuCash || 0,
                  level: parsed.level || 'bronze'
                });
             } else {
                 setUser(null);
             }
             setIsLoading(false);
        }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<string | undefined> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    console.log("Tentando login com:", cleanEmail);

    // 1. Verificar Mock Users (Criados pelo Admin)
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
        return foundMock.role;
      }
    }

    // 2. Login via Supabase (Real)
    try {
      console.log("Chamando Supabase signInWithPassword para:", cleanEmail);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass,
      });
      
      if (error) throw error;
      
      localStorage.removeItem('menu_demo_user');
      
      // Fetch profile to get role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', data.user.id)
        .single();
        
      if (profile) {
        if (profile.role) return profile.role;
        if (cleanEmail === 'nunesempreendedor@gmail.com') return 'admin';
      }
      return 'user';
    } catch (error: any) {
      console.error("Erro no signIn:", error);
      
      // Special handling for the main admin email: try to create if not exists
      if (cleanEmail === 'nunesempreendedor@gmail.com' && (error.message.includes('Invalid login credentials') || error.message.includes('User not found'))) {
        try {
          console.log("Tentando criar usuário admin que não existia ou falhou login...");
          const { data, error: signUpError } = await supabase.auth.signUp({
            email: cleanEmail,
            password: cleanPass,
          });
          
          if (signUpError) throw signUpError;
          
          // Create profile
          await supabase.from('profiles').insert([{
            email: cleanEmail,
            user_id: data.user!.id,
            created_at: new Date().toISOString(),
            role: 'admin',
            plan: 'negocios',
            businessName: 'Admin Principal'
          }]);
          
          return 'admin';
        } catch (createError: any) {
          console.error("Erro ao tentar criar admin no fallback:", createError);
          // If create fails (e.g. email in use), it means password was definitely wrong for existing user
          if (createError.message.includes('already registered')) {
             throw new Error('Este e-mail já existe. A senha informada está incorreta.');
          }
        }
      }

      if (error.message.includes('Invalid login credentials')) {
        throw new Error('E-mail ou senha incorretos. Por favor, verifique seus dados.');
      }
      throw error;
    }
  };

  const loginAsDemo = (): string => {
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
    return demoUser.role || 'user';
  };

  const register = async (name: string, email: string, pass: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: { name }
        }
      });
      
      if (error) throw error;
      
      const newUser = data.user!;

      console.log("Usuário registrado com sucesso:", newUser.id);
      
      // Create user profile in Supabase
      const { error: profileError } = await supabase.from('profiles').insert([{
        user_id: newUser.id,
        name: name,
        email: email,
        plan: 'profissionais',
        points: 0,
        level: 'elite',
        menuCash: 0,
        referralCode: '',
        referralsCount: 0,
        role: 'user',
        created_at: new Date().toISOString()
      }]);

      if (profileError) throw profileError;

      localStorage.removeItem('menu_demo_user');
      // onAuthStateChanged will handle the rest
      
      return newUser;
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
      user, login, loginAsDemo, register, logout, forgotPassword, refreshProfile, 
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


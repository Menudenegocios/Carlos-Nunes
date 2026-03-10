

import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { User } from '../types';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile as updateAuthProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
      const userDocRef = doc(db, 'users', userId);
      console.log("Fetching user profile for path:", userDocRef.path);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        console.log("User profile found");
        const data = userDoc.data();
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
          role: (auth.currentUser?.email === 'nunesempreendedor@gmail.com' ? 'admin' : (data.role as User['role'] || 'user'))
        });
      } else {
        console.log("User profile does not exist, creating...");
        // Se o perfil não existir no Firestore, usamos os dados do Auth
        const currentUser = auth.currentUser;
        if (currentUser && currentUser.uid === userId) {
             const newUserProfile = {
                id: userId,
                userId: userId,
                name: currentUser.displayName || 'Usuário',
                email: currentUser.email || '',
                plan: 'profissionais' as 'profissionais' | 'freelancers' | 'negocios',
                points: 0,
                level: 'elite' as 'elite' | 'bronze' | 'ouro' | 'diamante',
                menuCash: 0,
                referralCode: '',
                referralsCount: 0,
                role: 'user' as User['role'],
                createdAt: new Date().toISOString()
            };
            
            // Create the profile in Firestore if it doesn't exist
            await setDoc(userDocRef, newUserProfile);
            
            setUser(newUserProfile);
        }
      }
    } catch (error: any) {
      console.error('Error fetching user profile for:', userId, error);
      if (error.message && error.message.includes('offline')) {
        setNetworkError(true);
      }
      // Fallback to auth user if firestore fails
      const currentUser = auth.currentUser;
      if (currentUser && currentUser.uid === userId) {
         setUser({
            id: userId,
            name: currentUser.displayName || 'Usuário',
            email: currentUser.email || '',
            plan: 'profissionais' as 'profissionais' | 'freelancers' | 'negocios',
            points: 0,
            level: 'elite' as 'elite' | 'bronze' | 'ouro' | 'diamante',
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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        const impersonated = localStorage.getItem('menu_impersonating');
        
        if (currentUser) {
            await fetchUserProfile(currentUser.uid);
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
             // Check for demo/mock user in local storage if not authenticated via Firebase
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

    return () => unsubscribe();
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

    // 2. Login via Firebase (Real)
    try {
      console.log("Chamando Firebase signInWithEmailAndPassword para:", cleanEmail);
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
      localStorage.removeItem('menu_demo_user');
      
      // Fetch profile to get role
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.role) return data.role;
        if (cleanEmail === 'nunesempreendedor@gmail.com') return 'admin';
      }
      return 'user';
    } catch (error: any) {
      console.error("Erro no signIn:", error);
      
      // Special handling for the main admin email: try to create if not exists
      if (cleanEmail === 'nunesempreendedor@gmail.com' && (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found')) {
        try {
          console.log("Tentando criar usuário admin que não existia ou falhou login...");
          const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPass);
          
          // Create profile
          const { setDoc } = await import('firebase/firestore');
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            email: cleanEmail,
            userId: userCredential.user.uid,
            createdAt: new Date(),
            role: 'admin',
            plan: 'negocios',
            businessName: 'Admin Principal'
          }, { merge: true });
          
          return 'admin';
        } catch (createError: any) {
          console.error("Erro ao tentar criar admin no fallback:", createError);
          // If create fails (e.g. email in use), it means password was definitely wrong for existing user
          if (createError.code === 'auth/email-already-in-use') {
             throw new Error('Este e-mail já existe. A senha informada está incorreta.');
          }
        }
      }

      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const newUser = userCredential.user;
      
      await updateAuthProfile(newUser, { displayName: name });

      console.log("Usuário registrado com sucesso:", newUser.uid);
      
      // Create user profile in Firestore
      const userProfile = {
        id: newUser.uid,
        userId: newUser.uid,
        name: name,
        email: email,
        plan: 'profissionais',
        points: 0,
        level: 'elite',
        menuCash: 0,
        referralCode: '',
        referralsCount: 0,
        role: 'user',
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', newUser.uid), userProfile);

      localStorage.removeItem('menu_demo_user');
      // onAuthStateChanged will handle the rest
      
      return newUser;
    } catch (error: any) {
      console.error("Erro detalhado no registro:", error);
      throw error;
    }
  };

  const logout = async () => {
    try { await signOut(auth); } catch (e) {}
    localStorage.removeItem('menu_demo_user');
    localStorage.removeItem('menu_impersonating');
    setUser(null);
    setRealAdmin(null);
    setIsImpersonating(false);
  };

  const forgotPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
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


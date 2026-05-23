'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '@/types';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const checkUserPortalMode = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('user_portal_mode') === 'true' || !window.location.pathname.startsWith('/superadmin');
};

const getSuperadminCompanyInfo = async (email: string) => {
  const normEmail = email.toLowerCase();
  let companyName = 'sellamsoft';
  if (normEmail.includes('sellamships')) {
    companyName = 'sellamships';
  } else if (normEmail.includes('marine time') || normEmail.includes('marinetime')) {
    companyName = 'marine time';
  } else if (normEmail.includes('test')) {
    companyName = 'test';
  }
  
  try {
    const { data } = await supabase
      .from('companies')
      .select('id, company_name')
      .ilike('company_name', companyName)
      .single();
    if (data) {
      return { id: data.id, name: data.company_name };
    }
  } catch (e) {
    console.error('Error in getSuperadminCompanyInfo:', e);
  }
  
  // Fallbacks
  if (companyName === 'sellamsoft') {
    return { id: '37d92d0d-1f11-4a31-b1a7-69cf3a80c7e7', name: 'sellamsoft' };
  } else if (companyName === 'sellamships') {
    return { id: '467955f6-f651-4305-8e71-09b6b377ca69', name: 'sellamships' };
  } else if (companyName === 'marine time') {
    return { id: 'c3f0beaf-4ebf-4880-8380-90898f51aeb8', name: 'MARINE TIME' };
  }
  return { id: '37d92d0d-1f11-4a31-b1a7-69cf3a80c7e7', name: 'sellamsoft' };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Parse local storage mock session for role and company_id fallbacks
          const mockSessionStr = typeof window !== 'undefined' ? localStorage.getItem('invoice_session') : null;
          let cachedRole = 'STAFF';
          let cachedCompanyId = undefined;
          if (mockSessionStr) {
            try {
              const mockSession = JSON.parse(mockSessionStr);
              cachedRole = mockSession.user?.role || 'STAFF';
              cachedCompanyId = mockSession.user?.company_id;
            } catch (e) {}
          }

          // Fallback user data from session
          const fallbackUser: User = {
            id: session.user.id,
            name: session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            role: cachedRole as Role,
            company_id: cachedCompanyId,
          };

          const { data: userDataFromDb, error: dbError } = await supabase
            .from('users')
            .select('*')
            .eq('email', session.user.email)
            .single();

          if (dbError) {
            console.warn('Could not fetch user profile from public.users, using session fallback:', dbError.message);
            setUser(fallbackUser);
          } else if (userDataFromDb) {
            let companyId = userDataFromDb.company_id;
            
            if (userDataFromDb.role?.toUpperCase() === 'SUPERADMIN' && checkUserPortalMode()) {
              const compInfo = await getSuperadminCompanyInfo(userDataFromDb.email || '');
              companyId = compInfo.id;
            }

            const userData: User = {
              id: userDataFromDb.id,
              name: userDataFromDb.name || fallbackUser.name,
              email: userDataFromDb.email || fallbackUser.email,
              role: (userDataFromDb.role as Role) || (cachedRole as Role),
              company_id: companyId || cachedCompanyId
            };
            setUser(userData);
          } else {
            setUser(fallbackUser);
          }
          
          sessionStorage.setItem('supabase-token', session.access_token);
        } else if (typeof window !== 'undefined') {
          // Check for mock session in localStorage if Supabase session is not found
          const mockSessionStr = localStorage.getItem('invoice_session');
          if (mockSessionStr) {
            try {
              const mockSession = JSON.parse(mockSessionStr);
              if (mockSession.expiry > Date.now()) {
                const { data: userDataFromDb, error } = await supabase
                  .from('users')
                  .select('*')
                  .eq('email', mockSession.user.email)
                  .single();
                  
                if (!error && userDataFromDb) {
                  let companyId = userDataFromDb.company_id;
                  
                  if (userDataFromDb.role?.toUpperCase() === 'SUPERADMIN' && checkUserPortalMode()) {
                    const compInfo = await getSuperadminCompanyInfo(userDataFromDb.email || '');
                    companyId = compInfo.id;
                  }

                  const updatedUser = {
                    ...mockSession.user,
                    name: userDataFromDb.name,
                    email: userDataFromDb.email,
                    role: userDataFromDb.role,
                    company_id: companyId
                  };
                  setUser(updatedUser);
                  mockSession.user = updatedUser;
                  localStorage.setItem('invoice_session', JSON.stringify(mockSession));
                } else {
                  setUser(mockSession.user);
                }
              } else {
                localStorage.removeItem('invoice_session');
              }
            } catch (e) {
              console.error('Failed to parse mock session:', e);
            }
          }
        }
      } catch (e) {
        console.error('Auth initialization failed:', e);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const { data: userDataFromDb } = await supabase
          .from('users')
          .select('*')
          .eq('email', session.user.email)
          .single();

        let companyId = userDataFromDb?.company_id;
        
        if (userDataFromDb?.role?.toUpperCase() === 'SUPERADMIN' && checkUserPortalMode()) {
          const compInfo = await getSuperadminCompanyInfo(userDataFromDb.email || '');
          companyId = compInfo.id;
        }

        const mockSessionStr = typeof window !== 'undefined' ? localStorage.getItem('invoice_session') : null;
        let cachedRole = 'STAFF';
        let cachedCompanyId = undefined;
        if (mockSessionStr) {
          try {
            const mockSession = JSON.parse(mockSessionStr);
            cachedRole = mockSession.user?.role || 'STAFF';
            cachedCompanyId = mockSession.user?.company_id;
          } catch (e) {}
        }

        const baseUser: User = {
          id: userDataFromDb?.id || session.user.id,
          name: userDataFromDb?.name || session.user.email?.split('@')[0] || 'User',
          email: userDataFromDb?.email || session.user.email || '',
          role: (userDataFromDb?.role as Role) || (cachedRole as Role),
          company_id: companyId || cachedCompanyId
        };
        
        setUser(baseUser);
        sessionStorage.setItem('supabase-token', session.access_token);
      } else {
        const mockSessionStr = typeof window !== 'undefined' ? localStorage.getItem('invoice_session') : null;
        if (!mockSessionStr) {
          setUser(null);
          sessionStorage.removeItem('supabase-token');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password || '',
      });
      
      if (error) {
        console.error('Login error details:', error);
        throw error;
      }
    } catch (error: any) {
      console.error('Login failed catch block:', error);
      alert(error.message || 'Login failed. Please check your credentials.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // 1. Clear local session data immediately
      sessionStorage.clear();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('invoice_session');
        localStorage.removeItem('user_portal_mode');
      }
      setUser(null);
      
      // 2. Attempt to sign out from Supabase (best effort)
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // 3. Force a hard redirect to the login page to clear all React state
      const isSuperadminPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/superadmin');
      window.location.href = isSuperadminPath ? '/superadmin/login' : '/login';
    }
  };

  const hasRole = (roles: Role[]) => {
    return user ? roles.includes(user.role) : false;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
